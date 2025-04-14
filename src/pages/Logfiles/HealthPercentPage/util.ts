import {
    HealthData,
    ParsedHealthData,
    ParsedHealthDataPoint,
    ParsedPhaseObject,
    ParsedPlayerObject,
} from "@/pages/Logfiles/HealthPercentPage/types";
import { nanoid } from "nanoid";

/**
 * Finds the percentage value at a specific time based on the data points.
 * Assumes data is sorted by timestamp.
 * @param data - Array of [timestamp, percentage] tuples, sorted by timestamp.
 * @param time - The time (ms) to find the value for.
 * @returns The percentage value active at the given time. Returns 0 if time is before the first data point.
 */
function getValueAtTime(data: [number, number][], time: number): number {
    let value = 0; // Default if time is before the first point
    // Find the latest data point whose timestamp is less than or equal to the target time
    for (const [ts, percentage] of data) {
        if (ts <= time) {
            value = percentage;
        } else {
            // Data is sorted, so we can break early
            break;
        }
    }
    return value;
}

/**
 * Calculates the total duration (in milliseconds) the value was above a threshold within a given range.
 * @param data - Array of [timestamp, percentage] tuples, assumed sorted by timestamp.
 * @param start - The start time (ms) of the range.
 * @param end - The end time (ms) of the range.
 * @param threshold - The percentage threshold.
 * @returns The total duration (ms) the value was above the threshold. Returns 0 if end <= start.
 */
function calculateDurationAboveThreshold(
    data: [number, number][],
    start: number,
    end: number,
    threshold: number
): number {
    if (end <= start) {
        // Return 0 for an invalid or zero-duration range
        return 0;
    }

    // Collect unique time points relevant to the calculation
    const timePoints = new Set<number>([start, end]);
    data.forEach(([ts]) => {
        // Include timestamps from data that fall strictly within the range
        if (ts > start && ts < end) {
            timePoints.add(ts);
        }
    });

    // Sort the time points to define the intervals
    const sortedTimePoints = Array.from(timePoints).sort((a, b) => a - b);

    let durationAboveThreshold = 0;

    // Iterate through each interval defined by consecutive time points
    for (let i = 0; i < sortedTimePoints.length - 1; i++) {
        const intervalStart = sortedTimePoints[i];
        const intervalEnd = sortedTimePoints[i + 1];
        const intervalDuration = intervalEnd - intervalStart;

        // Determine the value at the beginning of the current interval
        const value = getValueAtTime(data, intervalStart);

        // If the value is above the threshold, add the interval's duration
        if (value > threshold) {
            durationAboveThreshold += intervalDuration;
        }
    }

    // Return the total duration in milliseconds
    return durationAboveThreshold;
}

export function extractHealthPercentages(
    json: HealthData,
    threshold: number
): ParsedHealthData {
    const phaseDataPoints: ParsedPhaseObject[] = [];
    const players: ParsedPlayerObject[] = json.players.map(player => ({
        account: player.account,
        name: player.name,
        profession: player.profession,
        group: player.group,
        hasCommanderTag: player.hasCommanderTag,
    }));

    json.phases.forEach(phase => {
        const { name, start, end, breakbarPhase } = phase;
        const phaseHealthData: ParsedHealthDataPoint[] = [];

        json.players.forEach(player => {
            const { account, healthPercents } = player;
            const initialHealthValue = getValueAtTime(healthPercents, start);

            const healthDataPercentagesForThisPlayer: [number, number][] = [
                [start, initialHealthValue],
            ];

            player.healthPercents.every(([ms, percent]) => {
                if (ms > phase.end) {
                    // We're now "after" this phase, so break loop
                    return false;
                } else if (ms > phase.start) {
                    healthDataPercentagesForThisPlayer.push([ms, percent]);
                    return true;
                } else {
                    // E.g. ms is less than or equal to the start of this phase,
                    // so just continue
                    return true;
                }
            });

            const msAboveThreshold = calculateDurationAboveThreshold(
                healthDataPercentagesForThisPlayer,
                start,
                end,
                threshold
            );

            const totalDuration = end - start;
            let percentage = 0;

            if (totalDuration > 0) {
                percentage = (msAboveThreshold / totalDuration) * 100;
            }
            phaseHealthData.push({
                label: account,
                isPlayer: true,
                healthPercents: healthDataPercentagesForThisPlayer,
                msAboveThreshold,
                percentAboveThreshold: percentage,
            });
        });

        const sortedPhaseHealthData = phaseHealthData.sort(
            (a, b) => b.msAboveThreshold - a.msAboveThreshold
        );

        phaseDataPoints.push({
            id: `${name}-${nanoid(4)}`,
            name,
            start,
            end,
            breakbarPhase,
            healthData: sortedPhaseHealthData,
        });
    });

    return {
        players,
        phases: phaseDataPoints,
        duration: json.durationMS,
    };
}

export function getTotalAverageHealthAboveThreshold(
    phase: ParsedPhaseObject
): [number, number] {
    const count = phase.healthData.length;
    if (!count) {
        return [0, 0];
    }

    const totalPercentAboveThreshold = phase.healthData.reduce(
        (dataSum, dataPoint) => dataSum + dataPoint.percentAboveThreshold,
        0
    );
    const totalMSAboveThreshold = phase.healthData.reduce(
        (dataSum, dataPoint) => dataSum + dataPoint.msAboveThreshold,
        0
    );
    return [totalPercentAboveThreshold / count, totalMSAboveThreshold / count];
}

export function getSubgroupHealthData(
    healthData: ParsedHealthDataPoint[],
    players: ParsedPlayerObject[]
): Record<number, ParsedHealthDataPoint[]> {
    const subgroups: Record<number, ParsedHealthDataPoint[]> = {};
    healthData.forEach(item => {
        if (!item.isPlayer) {
            return;
        }
        const player = players.find(p => p.account === item.label);
        if (!player) {
            return;
        }

        if (subgroups[player.group]) {
            subgroups[player.group].push(item);
        } else {
            subgroups[player.group] = [item];
        }
    });
    return subgroups;
}

// Number 1: group number
// Number 2: average time as percentage
// Number 3: average time as milliseconds
export function getSubgroupAverageHealthAboveThreshold(
    subgroups: Record<number, ParsedHealthDataPoint[]>
): [number, [number, number]][] {
    const subgroupHealthAboveThresholdObj: Record<number, [number, number]> =
        {};

    Object.entries(subgroups).forEach(([group, data]) => {
        const count = data.length;
        if (!count) {
            return;
        }

        const percentSum = data.reduce(
            (dataSum, dataPoint) => dataSum + dataPoint.percentAboveThreshold,
            0
        );
        const msSum = data.reduce(
            (dataSum, dataPoint) => dataSum + dataPoint.msAboveThreshold,
            0
        );

        subgroupHealthAboveThresholdObj[+group] = [
            percentSum / count,
            msSum / count,
        ];
    });

    const subgroupPercentAboveThreshold = Object.entries(
        subgroupHealthAboveThresholdObj
    )
        .map(([key, value]): [number, [number, number]] => [+key, value])
        .sort(([, valueA], [, valueB]) => valueB[0] - valueA[0]);

    return subgroupPercentAboveThreshold;
}

/**
 * Converts milliseconds to a formatted string (e.g., "3m 10s", "55s", "61m").
 * @param ms - The duration in milliseconds.
 * @returns The formatted duration string.
 */
export function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
        return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }
    return `${seconds}s`;
}
