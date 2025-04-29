import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Grid, Text } from "@radix-ui/themes";
import { useMemo } from "react";

import * as styles from "../DataDisplay.css.ts";
import { TabItem } from "@/pages/Logfiles/HealthPercentPage/DataDisplay/types";
import { formatDuration } from "@/pages/Logfiles/HealthPercentPage/util.ts";
import {
    ParsedHealthDataPoint,
    ParsedPhaseObject,
    ParsedPlayerObject,
} from "@/pages/Logfiles/HealthPercentPage/types.ts";
import MultipleStepGraph from "@/pages/Logfiles/HealthPercentPage/DataDisplay/DataSection/MultipleStepGraph.tsx";
import SingleStepGraph from "@/pages/Logfiles/HealthPercentPage/DataDisplay/DataSection/SingleStepGraph";

interface DataSectionProps {
    item: TabItem;
    phase: ParsedPhaseObject;
    players: ParsedPlayerObject[];
    threshold: number;
}

const DataSection = ({ item, phase, threshold, players }: DataSectionProps) => {
    const phaseDuration = useMemo(
        () => formatDuration(phase.end - phase.start),
        [phase.end, phase.start]
    );
    const durationAboveThreshold = useMemo(
        () => formatDuration(item.msAboveThreshold),
        [item.msAboveThreshold]
    );

    const singleUserGraphData: [number, number][] | null = useMemo(() => {
        if (item.isPlayer) {
            const healthData = phase.healthData.find(
                data => data.label === item.value
            );
            return healthData?.healthPercents || null;
        }
        return null;
    }, [item, phase]);

    const subgroupGraphData: ParsedHealthDataPoint[] | null = useMemo(() => {
        if (item.value.startsWith("subgroup-")) {
            const group = +item.value.split("-")?.[1];
            const subgroupData: ParsedHealthDataPoint[] = [];
            phase.healthData.forEach(dataset => {
                if (dataset.isPlayer) {
                    const player = players.find(
                        player => player.account === dataset.label
                    );
                    if (player?.group === group) {
                        subgroupData.push(dataset);
                    }
                }
            });
            return subgroupData;
        }
        return null;
    }, [item, phase, players]);

    const totalGraphData: ParsedHealthDataPoint[] | null = useMemo(() => {
        if (item.value === "total") {
            const data: ParsedHealthDataPoint[] = [];
            phase.healthData.forEach(dataset => {
                if (dataset.isPlayer) {
                    const player = players.find(
                        player => player.account === dataset.label
                    );
                    if (player) {
                        data.push(dataset);
                    }
                }
            });
            return data;
        }
        return null;
    }, [item, phase, players]);

    return (
        <TabsPrimitive.Content
            key={item.value}
            value={item.value}
            className={styles.content}
        >
            <Grid gap="2">
                {singleUserGraphData ? (
                    <SingleStepGraph
                        data={singleUserGraphData}
                        threshold={threshold}
                        phase={phase}
                    />
                ) : subgroupGraphData ? (
                    <MultipleStepGraph
                        data={subgroupGraphData}
                        threshold={threshold}
                        phase={phase}
                        players={players}
                    />
                ) : totalGraphData ? (
                    <MultipleStepGraph
                        data={totalGraphData}
                        threshold={threshold}
                        phase={phase}
                        players={players}
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
