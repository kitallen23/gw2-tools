import * as Progress from "@radix-ui/react-progress";
import React from "react";

interface RangeProgressBarProps {
    min: number;
    max: number;
    total?: number;
    color?: string;
}

const RangeProgressBar: React.FC<RangeProgressBarProps> = ({
    min,
    max,
    total = 100,
    color = "var(--accent-10)",
}) => {
    // Calculate percentage values
    const minPercent = (min / total) * 100;
    const maxPercent = (max / total) * 100;
    const rangeWidth = maxPercent - minPercent;

    return (
        <Progress.Root
            style={{
                position: "relative",
                overflow: "hidden",
                background: "var(--gray-4)",
                width: "100%",
                height: 5,
                borderRadius: "9999px",
            }}
            value={max}
            max={total}
        >
            <Progress.Indicator
                style={{
                    backgroundColor: color,
                    height: "100%",
                    width: `${rangeWidth}%`,
                    position: "absolute",
                    left: `${minPercent}%`,
                    transition:
                        "left 220ms cubic-bezier(0.65, 0, 0.35, 1), width 220ms cubic-bezier(0.65, 0, 0.35, 1)",
                }}
            />
        </Progress.Root>
    );
};

export default RangeProgressBar;
