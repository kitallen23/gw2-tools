import {
    Container,
    Flex,
    Grid,
    Select,
    Text,
    TextField,
} from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import RangeProgressBar from "@/components/RangeProgressBar/RangeProgressBar";
import EncounterInfo from "@/pages/Logfiles/HealthPercentPage/EncounterInfo";
import DataDisplay from "@/pages/Logfiles/HealthPercentPage/DataDisplay/DataDisplay";
import { extractHealthPercentages } from "@/pages/Logfiles/HealthPercentPage/util";
import {
    EncounterData,
    ParsedHealthData,
} from "@/pages/Logfiles/HealthPercentPage/types";

const DEFAULT_THRESHOLD = 90;
const DEBOUNCE_MS = 500;

interface HealthPercentPageProps {
    json: EncounterData;
}

const HealthPercentPage = ({ json }: HealthPercentPageProps) => {
    const [data, setData] = useState<ParsedHealthData | undefined>();
    const [phaseValue, setPhaseValue] = useState<string>("");
    const [phaseOptions, setPhaseOptions] = useState<string[][]>([]);
    const [breakbarPhaseOptions, setBreakbarPhaseOptions] = useState<
        string[][]
    >([]);
    const [tabValue, setTabValue] = useState<string>("total");

    // thresholdInput holds the raw input value (string)
    const [thresholdInput, setThresholdInput] = useState<string>("90");
    // threshold holds the validated and debounced number
    const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);

    const phase = useMemo(
        () => data?.phases.find(phase => phase.id === phaseValue),
        [phaseValue, data]
    );
    const phaseDisplayValue = useMemo(
        () =>
            phaseOptions
                .concat(breakbarPhaseOptions)
                .find(([id]) => id === phaseValue)?.[1] || "",
        [phaseValue, phaseOptions, breakbarPhaseOptions]
    );

    // Debounce and validate the threshold input
    useEffect(() => {
        const handler = setTimeout(() => {
            const num = parseInt(thresholdInput, 10);

            // Update threshold only if the parsed input is a valid number
            if (!isNaN(num) && num >= 0 && num <= 100) {
                setThreshold(num);
            } else {
                // Optionally reset to default if input is invalid, or keep last valid value
                // Resetting to default here:
                setThreshold(DEFAULT_THRESHOLD);
                // If you want to keep the input field reflecting the default:
                // setThresholdInput(String(DEFAULT_THRESHOLD));
            }
        }, DEBOUNCE_MS);

        // Cleanup function to clear the timeout if thresholdInput changes again before 500ms
        return () => {
            clearTimeout(handler);
        };
    }, [thresholdInput]);

    const onBlur = () => {
        const num = parseInt(thresholdInput, 10);
        // Reset threshold if it's invalid
        if (isNaN(num) || num < 0 || num > 100) {
            setThreshold(DEFAULT_THRESHOLD);
            setThresholdInput(`${DEFAULT_THRESHOLD}`);
        }
    };

    useEffect(() => {
        const healthData = extractHealthPercentages(json, threshold);

        setPhaseValue(healthData.phases?.[0].id || "");
        const dpsPhases = healthData.phases
            .filter(item => !item.breakbarPhase)
            .map(({ id, name }) => [id, name]);
        const breakbarPhases = healthData.phases
            .filter(item => item.breakbarPhase)
            .map(({ id, name }) => [id, name]);
        setPhaseOptions(dpsPhases);
        setBreakbarPhaseOptions(breakbarPhases);
        setData(healthData);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [json]);

    return (
        <>
            <Container size="2">
                <Text style={{ color: "var(--gray-10)" }}>
                    This tool displays the amount of time players spent above a
                    health threshold. This can be useful to determine if you
                    should be running utilities like the{" "}
                    <Link
                        to="https://wiki.guildwars2.com/wiki/Writ_of_Masterful_Strength"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Writ of Masterful Strength
                    </Link>
                    .
                </Text>
            </Container>

            <Container size="2">
                <EncounterInfo json={json} />
            </Container>

            {data && phase ? (
                // TODO: Change this to size 3 when creating graph
                <Container size="2">
                    <Grid gap="4">
                        <Flex
                            align="center"
                            justify="center"
                            wrap="nowrap"
                            gap="9"
                        >
                            <Flex align="center" gap="4">
                                Phase:
                                <Select.Root
                                    value={phaseValue}
                                    onValueChange={value =>
                                        setPhaseValue(value)
                                    }
                                >
                                    <Select.Trigger
                                        style={{ maxWidth: "300px" }}
                                    >
                                        <Text>{phaseDisplayValue}</Text>
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Group>
                                            {phaseOptions.map(([id, name]) => (
                                                <Select.Item
                                                    value={id}
                                                    key={id}
                                                >
                                                    {name}
                                                </Select.Item>
                                            ))}
                                        </Select.Group>
                                        {breakbarPhaseOptions.length ? (
                                            <Select.Group>
                                                <Select.Label>
                                                    Breakbar phases
                                                </Select.Label>
                                                {breakbarPhaseOptions.map(
                                                    ([id, name]) => (
                                                        <Select.Item
                                                            value={id}
                                                            key={id}
                                                        >
                                                            {name}
                                                        </Select.Item>
                                                    )
                                                )}
                                            </Select.Group>
                                        ) : null}
                                    </Select.Content>
                                </Select.Root>
                            </Flex>

                            <Flex align="center" gap="4">
                                Health threshold:
                                <TextField.Root
                                    type="number"
                                    value={thresholdInput}
                                    onChange={event =>
                                        setThresholdInput(event.target.value)
                                    }
                                    onBlur={onBlur}
                                    min="0"
                                    max="100"
                                    style={{ width: "5.75em" }}
                                >
                                    <TextField.Slot />
                                    <TextField.Slot>%</TextField.Slot>
                                </TextField.Root>
                            </Flex>
                        </Flex>

                        <RangeProgressBar
                            min={phase.start}
                            max={phase.end}
                            total={data.duration}
                        />

                        <DataDisplay
                            players={data.players}
                            phase={phase}
                            value={tabValue}
                            setValue={setTabValue}
                            threshold={threshold}
                        />
                    </Grid>
                </Container>
            ) : null}
        </>
    );
};

export default HealthPercentPage;
