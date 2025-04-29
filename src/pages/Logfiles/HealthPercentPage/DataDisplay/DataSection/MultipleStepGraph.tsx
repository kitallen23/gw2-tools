import { useMemo, useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
} from "recharts";

import {
    ParsedHealthDataPoint,
    ParsedPhaseObject,
    ParsedPlayerObject,
} from "@/pages/Logfiles/HealthPercentPage/types";
import { formatDuration } from "@/pages/Logfiles/HealthPercentPage/util";

const COLOR_THRESHOLD = "var(--gray-12)";
const LINE_DATA_KEY = "y_line";
const GRAPH_COLORS = [
    "var(--purple-9)",
    "var(--yellow-9)",
    "var(--blue-9)",
    "var(--orange-9)",
    "var(--green-9)",
    "var(--gray-9)",
    "var(--red-9)",
    "var(--mint-9)",
    "var(--crimson-9)",
    "var(--brown-9)",
];

// Define the expected prop types
interface MultipleStepGraphProps {
    data: ParsedHealthDataPoint[];
    phase: ParsedPhaseObject;
    players: ParsedPlayerObject[];
    threshold: number;
}

const MultipleStepGraph = ({
    data,
    threshold,
    phase,
    players,
}: MultipleStepGraphProps) => {
    const [hoveredLineLabel, setHoveredLineLabel] = useState<string | null>(
        null
    );

    const processedData = useMemo(() => {
        // Map the incoming data
        const mappedData = data.map((item, i) => {
            const healthPercents = item.healthPercents.map(([xVal, yVal]) => ({
                x: xVal,
                [LINE_DATA_KEY]: yVal,
            }));

            if (healthPercents.length > 0) {
                const lastPoint = healthPercents[healthPercents.length - 1];
                if (lastPoint.x < phase.end) {
                    // Add an extra point at the phase end with the last y-value
                    healthPercents.push({
                        x: phase.end,
                        [LINE_DATA_KEY]: lastPoint[LINE_DATA_KEY],
                    });
                }
            }

            const player = players.find(
                player => player.account === item.label
            );

            return {
                ...item,
                healthPercents: healthPercents.map(item => ({
                    ...item,
                    player,
                })),
                color: GRAPH_COLORS[i % GRAPH_COLORS.length],
                player,
            };
        });

        return mappedData;
    }, [data, phase.end, players]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={processedData}>
                <Legend
                    formatter={value => {
                        return (
                            players.find(item => item.account === value)
                                ?.name ?? ""
                        );
                    }}
                    onMouseEnter={({ value }) => setHoveredLineLabel(value)}
                    onMouseLeave={() => setHoveredLineLabel(null)}
                />
                <CartesianGrid strokeDasharray="2 6" stroke="var(--gray-4)" />
                <XAxis
                    dataKey="x"
                    type="number"
                    tick={{ fontSize: 12, fill: "var(--gray-11)" }}
                    stroke="var(--gray-8)"
                    domain={[phase.start, phase.end]}
                    tickFormatter={formatDuration}
                />
                <YAxis
                    dataKey="y"
                    type="number"
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "var(--gray-11)" }}
                    stroke="var(--gray-8)"
                    tickFormatter={val => (val === 0 ? "" : `${val}%`)}
                />
                <ReferenceLine
                    y={threshold}
                    stroke={COLOR_THRESHOLD}
                    strokeDasharray="6 8"
                    strokeWidth={1}
                    ifOverflow="extendDomain"
                />
                {processedData.map(item => (
                    <Line
                        key={item.label}
                        data={item.healthPercents}
                        type="monotone"
                        dataKey={LINE_DATA_KEY}
                        stroke={item.color}
                        strokeWidth={
                            hoveredLineLabel && hoveredLineLabel === item.label
                                ? 2
                                : 1
                        }
                        dot={false}
                        name={item.label}
                        isAnimationActive={false}
                        onMouseEnter={() => setHoveredLineLabel(item.label)}
                        onMouseLeave={() => setHoveredLineLabel(null)}
                        strokeOpacity={
                            hoveredLineLabel && hoveredLineLabel !== item.label
                                ? 0.05
                                : 1
                        }
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default MultipleStepGraph;
