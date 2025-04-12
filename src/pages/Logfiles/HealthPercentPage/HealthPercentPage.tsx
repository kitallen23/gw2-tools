import RangeProgressBar from "@/components/RangeProgressBar/RangeProgressBar";
import {
    extractHealthPercentages,
    HealthData,
    ParsedHealthData,
} from "@/pages/Logfiles/HealthPercentPage/util";
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

const DEFAULT_THRESHOLD = 90;
const DEBOUNCE_MS = 500;

interface HealthPercentPageProps {
    json: HealthData;
}

const HealthPercentPage = ({ json }: HealthPercentPageProps) => {
    const [phaseValue, setPhaseValue] = useState<string>("");
    const [phaseOptions, setPhaseOptions] = useState<string[]>([]);

    // thresholdInput holds the raw input value (string)
    const [thresholdInput, setThresholdInput] = useState<string>("90");

    // threshold holds the validated and debounced number
    const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);

    const [data, setData] = useState<ParsedHealthData | undefined>();

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
        // TODO: Remove me
        // console.log(`healthData: `, healthData);

        setPhaseValue(healthData.phases?.[0].name || "");
        setPhaseOptions(healthData.phases.map(({ name }) => name));
        setData(healthData);
    }, [json, threshold]);

    const phase = useMemo(
        () => data?.phases.find(phase => phase.name === phaseValue),
        [phaseValue, data]
    );

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

            {data ? (
                <Container size="3">
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
                                        <Text>{phaseValue}</Text>
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Group>
                                            {phaseOptions.map((name, i) => (
                                                <Select.Item
                                                    value={name}
                                                    key={`${name}-${i}`}
                                                >
                                                    {name}
                                                </Select.Item>
                                            ))}
                                        </Select.Group>
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
                            min={phase!.start}
                            max={phase!.end}
                            total={data.duration}
                        />
                    </Grid>
                </Container>
            ) : null}
        </>
    );
};

export default HealthPercentPage;
