import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Flex, Grid, Separator, Strong, Text } from "@radix-ui/themes";
import { useMemo } from "react";

import * as styles from "../DataDisplay.css.ts";
import { TabItem } from "@/pages/Logfiles/HealthPercentPage/DataDisplay/types";
import { formatDuration } from "@/pages/Logfiles/HealthPercentPage/util.ts";
import { ParsedPhaseObject } from "@/pages/Logfiles/HealthPercentPage/types.ts";

interface DataSectionProps {
    item: TabItem;
    phase: ParsedPhaseObject;
}

const DataSection = ({ item, phase }: DataSectionProps) => {
    const phaseDuration = useMemo(
        () => formatDuration(phase.end - phase.start),
        [phase.end, phase.start]
    );
    const durationAboveThreshold = useMemo(
        () => formatDuration(item.msAboveThreshold),
        [item.msAboveThreshold]
    );
    return (
        <TabsPrimitive.Content
            key={item.value}
            value={item.value}
            className={styles.content}
        >
            <Flex justify="start">
                <Grid gap="2">
                    <Text size="4">
                        Phase duration: <Strong>{phaseDuration}</Strong>
                    </Text>
                    <Text size="4">
                        {item.isPlayer ? "Time" : "Average time"} spent above
                        threshold: <Strong>{durationAboveThreshold}</Strong>
                    </Text>
                    <Separator orientation="horizontal" size="4" />
                    <Text size="4">
                        {item.isPlayer ? "Percent" : "Average percent "} of time
                        spent above threshold:{" "}
                        <Strong>
                            {item.percentAboveThreshold.toFixed(1)}%
                        </Strong>
                    </Text>
                </Grid>
            </Flex>
        </TabsPrimitive.Content>
    );
};

export default DataSection;
