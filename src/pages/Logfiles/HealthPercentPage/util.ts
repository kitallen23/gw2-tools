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

type PlayersObject = {
    name: string;
    account: string;
    healthPercents: [number, number][];
    profession: string;
    group: number;
    hasCommanderTag: boolean;
};
type PhasesObject = {
    name: string;
    start: number;
    end: number;
    breakbarPhase: boolean;
};
export type HealthData = {
    players: PlayersObject[];
    phases: PhasesObject[];
    durationMS: number;
};

type ParsedPlayersObject = {
    name: string;
    account: string;
    profession: string;
    group: number;
    hasCommanderTag: boolean;
};
type ParsedHealthDataPoint = {
    label: string;
    isPlayer: boolean;
    healthPercents: [number, number][];
    msAboveThreshold: number;
    percentAboveThreshold: number;
};
type ParsedPhaseObject = {
    name: string;
    start: number;
    end: number;
    breakbarPhase: boolean;
    healthData: ParsedHealthDataPoint[];
};
export type ParsedHealthData = {
    players: ParsedPlayersObject[];
    phases: ParsedPhaseObject[];
    duration: number;
};

export function extractHealthPercentages(
    json: HealthData,
    threshold: number
): ParsedHealthData {
    // TODO: Remove me
    // console.log(`json: `, json);
    const phaseDataPoints: ParsedPhaseObject[] = [];

    json.phases.forEach(phase => {
        const { name, start, end, breakbarPhase } = phase;
        const phaseHealthData: ParsedHealthDataPoint[] = [];

        json.players.forEach(player => {
            const healthDataPercentagesForThisPlayer: [number, number][] = [];
            player.healthPercents.every(([ms, percent]) => {
                if (ms > phase.end) {
                    // We're now "after" this phase, so break loop
                    return false;
                } else if (ms >= phase.start) {
                    healthDataPercentagesForThisPlayer.push([ms, percent]);
                    return true;
                } else {
                    // E.g. ms is less than the start of this phase, so just
                    // continue
                    return true;
                }
            });

            const { account } = player;
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

        phaseDataPoints.push({
            name,
            start,
            end,
            breakbarPhase,
            healthData: phaseHealthData,
        });
    });

    return {
        players: [],
        phases: phaseDataPoints,
        duration: json.durationMS,
    };
}
