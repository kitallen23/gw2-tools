import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useMemo } from "react";
import { Grid, Text } from "@radix-ui/themes";
import { StarFilledIcon } from "@radix-ui/react-icons";

import * as styles from "./DataDisplay.css.ts";
import {
    getSubgroupAverageHealthAboveThreshold,
    getSubgroupHealthData,
    getTotalAverageHealthAboveThreshold,
} from "@/pages/Logfiles/HealthPercentPage/util";
import { TabItem } from "@/pages/Logfiles/HealthPercentPage/DataDisplay/types.ts";
import {
    ParsedPhaseObject,
    ParsedPlayerObject,
} from "@/pages/Logfiles/HealthPercentPage/types.ts";
import DataSection from "@/pages/Logfiles/HealthPercentPage/DataDisplay/DataSection/DataSection.tsx";

interface TabNavigatorProps {
    players: ParsedPlayerObject[];
    phase: ParsedPhaseObject;
    value: string;
    threshold: number;
    setValue: (value: string) => void;
}

const DataDisplay = ({
    players,
    phase,
    value,
    threshold,
    setValue,
}: TabNavigatorProps) => {
    const tabs: TabItem[] = useMemo(() => {
        const tabItems: TabItem[] = [];
        phase.healthData.forEach(
            ({ label: account, percentAboveThreshold, msAboveThreshold }) => {
                const player = players.find(
                    player => account === player.account
                );
                if (player) {
                    tabItems.push({
                        ...player,
                        percentAboveThreshold,
                        msAboveThreshold,
                        isPlayer: true,
                        value: player.account,
                    });
                }
            }
        );

        const subgroupData = getSubgroupHealthData(phase.healthData, players);
        const subgroupThresholdData =
            getSubgroupAverageHealthAboveThreshold(subgroupData);
        subgroupThresholdData.forEach(
            ([groupKey, [averagePercent, averageMS]]) => {
                tabItems.unshift({
                    value: `subgroup-${groupKey}`,
                    name: `Group ${groupKey}`,
                    profession: null,
                    group: null,
                    hasCommanderTag: null,
                    percentAboveThreshold: averagePercent,
                    msAboveThreshold: averageMS,
                    isPlayer: false,
                });
            }
        );

        const [totalPercentAboveThreshold, totalMSAboveThreshold] =
            getTotalAverageHealthAboveThreshold(phase);
        tabItems.unshift({
            value: "total",
            name: "Total",
            profession: null,
            group: null,
            hasCommanderTag: null,
            percentAboveThreshold: totalPercentAboveThreshold,
            msAboveThreshold: totalMSAboveThreshold,
            isPlayer: false,
        });

        return tabItems;
    }, [players, phase]);

    return (
        <TabsPrimitive.Root
            orientation="vertical"
            className={styles.root}
            value={value}
            onValueChange={setValue}
        >
            <TabsPrimitive.List
                aria-label="Players"
                className={styles.list}
                style={{ width: "200px" }}
            >
                {tabs.map((item: TabItem) => (
                    <TabsPrimitive.Trigger
                        value={item.value}
                        className={styles.trigger}
                        key={item.value}
                    >
                        <div className={styles.triggerContent}>
                            <Grid columns="1fr auto">
                                <Text truncate weight="bold">
                                    {item.name}
                                </Text>
                                <Text>
                                    {item.percentAboveThreshold.toFixed(1)}%
                                </Text>
                            </Grid>
                            {item.group ? (
                                <Grid>
                                    <Text size="1" trim="both">
                                        {item.hasCommanderTag ? (
                                            <>
                                                <StarFilledIcon
                                                    width={10}
                                                    height={10}
                                                    style={{
                                                        marginBottom: "-1px",
                                                    }}
                                                />{" "}
                                            </>
                                        ) : null}
                                        Group {item.group}
                                    </Text>
                                </Grid>
                            ) : null}
                        </div>
                    </TabsPrimitive.Trigger>
                ))}
            </TabsPrimitive.List>

            {tabs.map((item: TabItem) => (
                <DataSection
                    key={item.value}
                    item={item}
                    phase={phase}
                    threshold={threshold}
                    players={players}
                />
            ))}
        </TabsPrimitive.Root>
    );
};

export default DataDisplay;
