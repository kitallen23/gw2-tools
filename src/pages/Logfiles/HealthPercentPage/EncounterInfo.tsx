import { Badge, Flex, Grid, Text } from "@radix-ui/themes";
import { useMemo } from "react";

import { EncounterData } from "@/pages/Logfiles/HealthPercentPage/types";
import { formatDuration } from "@/pages/Logfiles/HealthPercentPage/util";

interface EncounterInfoProps {
    json: EncounterData;
}

const EncounterInfo = ({ json }: EncounterInfoProps) => {
    const duration = useMemo(
        () => formatDuration(json.durationMS),
        [json.durationMS]
    );
    return (
        <Grid gap="4">
            <Flex gap="4" align="end" justify="center">
                <Flex gap="2" align="center">
                    <Text size="6">{json.fightName}</Text>
                    <Badge color={json.success ? "green" : "red"}>
                        {json.success ? "Success" : "Failure"}
                    </Badge>
                </Flex>
                <Text>{duration}</Text>
            </Flex>
        </Grid>
    );
};

export default EncounterInfo;
