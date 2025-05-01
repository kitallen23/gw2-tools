import { useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    TooltipProps,
} from "recharts";
import {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { ParsedPhaseObject } from "@/pages/Logfiles/HealthPercentPage/types";
import { formatDuration } from "@/pages/Logfiles/HealthPercentPage/util";

const LINE_COLOR = "var(--purple-9)";
const AREA_FILL_COLOR = "var(--red-a5)";
const COLOR_THRESHOLD = "var(--gray-12)";
const LINE_DATA_KEY = "y_line";
const FILL_DATA_KEY = "y_fill";

// Define the expected prop types
interface SingleStepGraphProps {
    data: [number, number][];
    threshold: number;
    phase: ParsedPhaseObject;
}

const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<ValueType, NameType>) => {
    const linePayload = payload?.filter(p => p.dataKey === LINE_DATA_KEY);
    if (active && linePayload && linePayload.length) {
        return (
            <div
                style={{
                    backgroundColor: "var(--gray-2)",
                    border: "1px solid var(--gray-6)",
                    padding: "4px 6px",
                    color: "var(--gray-12)",
                    fontSize: "12px",
                    borderRadius: "3px",
                    display: "grid",
                    gap: "0.5em",
                }}
            >
                <div className="label">{`Time: ${formatDuration(label)}`}</div>
                {linePayload.map((pld, index) => (
                    <div key={index} style={{ color: pld.color }}>
                        {`Health: ${pld.value}%`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const SingleStepGraph = ({ data, threshold, phase }: SingleStepGraphProps) => {
    const processedData = useMemo(() => {
        // Map the incoming tuple data
        const mappedData = data.map(([xVal, yVal]) => ({
            x: xVal,
            [LINE_DATA_KEY]: yVal,
            [FILL_DATA_KEY]: yVal,
        }));

        // Check if data exists and if the last point is before the phase end
        if (mappedData.length > 0) {
            const lastPoint = mappedData[mappedData.length - 1];
            if (lastPoint.x < phase.end) {
                // Add an extra point at the phase end with the last y-value
                mappedData.push({
                    x: phase.end,
                    [LINE_DATA_KEY]: lastPoint[LINE_DATA_KEY],
                    [FILL_DATA_KEY]: lastPoint[FILL_DATA_KEY],
                });
            }
        }

        return mappedData;
    }, [data, phase.end]);

    const partialFillData = useMemo(() => {
        const fillData = [];
        for (let i = 0; i < processedData.length; ++i) {
            const currentPoint = processedData[i];
            let currentPointValue = null;
            if (currentPoint[FILL_DATA_KEY] < threshold) {
                currentPointValue = currentPoint[FILL_DATA_KEY];
            }

            const previousPoint = processedData[i - 1];

            if (
                previousPoint &&
                previousPoint[FILL_DATA_KEY] < threshold &&
                currentPoint[FILL_DATA_KEY] >= threshold
            ) {
                fillData.push({
                    ...currentPoint,
                    [FILL_DATA_KEY]: previousPoint[FILL_DATA_KEY],
                });
            }

            fillData.push({
                ...currentPoint,
                [FILL_DATA_KEY]: currentPointValue,
            });
        }
        return fillData;
    }, [processedData, threshold]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={processedData}>
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
                <Tooltip content={<CustomTooltip />} />
                {/* Area for the fill */}
                <Area
                    dataKey={FILL_DATA_KEY}
                    data={partialFillData}
                    type="stepAfter"
                    fill={AREA_FILL_COLOR}
                    strokeWidth={0}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls={false}
                    activeDot={false}
                />
                <ReferenceLine
                    y={threshold}
                    stroke={COLOR_THRESHOLD}
                    strokeDasharray="6 8"
                    strokeWidth={1}
                    ifOverflow="extendDomain"
                />
                {/* Area styled as a line (rendered on top) */}
                <Area
                    dataKey={LINE_DATA_KEY}
                    data={processedData}
                    type="stepAfter"
                    fill="transparent"
                    stroke={LINE_COLOR}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls={true}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default SingleStepGraph;
