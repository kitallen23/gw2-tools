import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Grid, Text } from "@radix-ui/themes";
import { useMemo } from "react";

import * as styles from "../DataDisplay.css.ts";
import { TabItem } from "@/pages/Logfiles/HealthPercentPage/DataDisplay/types";
import { formatDuration } from "@/pages/Logfiles/HealthPercentPage/util.ts";
import { ParsedPhaseObject } from "@/pages/Logfiles/HealthPercentPage/types.ts";
import StepGraph from "@/pages/Logfiles/HealthPercentPage/DataDisplay/DataSection/SingleStepGraph";

interface DataSectionProps {
    item: TabItem;
    phase: ParsedPhaseObject;
    threshold: number;
}

const DataSection = ({ item, phase, threshold }: DataSectionProps) => {
    const phaseDuration = useMemo(
        () => formatDuration(phase.end - phase.start),
        [phase.end, phase.start]
    );
    const durationAboveThreshold = useMemo(
        () => formatDuration(item.msAboveThreshold),
        [item.msAboveThreshold]
    );

    const graphData = useMemo(() => {
        if (item.isPlayer) {
            const healthData = phase.healthData.find(
                data => data.label === item.value
            );
            return healthData?.healthPercents || null;
        }
        return null;
    }, [item, phase]);

    return (
        <TabsPrimitive.Content
            key={item.value}
            value={item.value}
            className={styles.content}
        >
            <Grid gap="2">
                {graphData ? (
                    <StepGraph
                        data={graphData}
                        threshold={threshold}
                        phase={phase}
                    />
                ) : null}
                <Grid columns="1fr auto" gapX="1em" gapY="0.2em">
                    <Text align="right" style={{ color: "var(--gray-10)" }}>
                        Phase duration
                    </Text>
                    <Text>{phaseDuration}</Text>
                    <Text align="right" style={{ color: "var(--gray-10)" }}>
                        {item.isPlayer ? "Time" : "Average time"} spent above
                        threshold
                    </Text>
                    <Text>{durationAboveThreshold}</Text>
                    <Text align="right" style={{ color: "var(--gray-10)" }}>
                        {item.isPlayer ? "Percent" : "Average percent "} of time
                        spent above threshold
                    </Text>
                    <Text>{item.percentAboveThreshold.toFixed(1)}%</Text>
                </Grid>
            </Grid>
        </TabsPrimitive.Content>
    );
};

export default DataSection;
