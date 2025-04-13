import { useEffect, useState } from "react";
import FileField from "@/components/FileField/FileField";
import {
    Box,
    Callout,
    Container,
    Flex,
    Grid,
    Heading,
    Progress,
    Section,
    Select,
    Text,
    TextField,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import { useGetLog } from "@/api/uploadFile";

import HealthPercentPage from "@/pages/Logfiles/HealthPercentPage/HealthPercentPage";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type ToolType = "health-percent";
const TOOL_TYPE_OPTIONS = { "health-percent": "Health Threshold Display" };
const DEBOUNCE_MS = 500;
const BASE_REPORT_URL = "https://dps.report/";

function Logs() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // reportUrl holds the raw input string
    const [reportUrl, setReportUrl] = useState<string>("");
    // url holds a valid DPS report URL
    const [url, setUrl] = useState<string>("");

    const [toolType, setToolType] = useState<ToolType>("health-percent");

    const { data, isLoading, error } = useGetLog(selectedFile, url);

    useEffect(() => {
        const handler = setTimeout(() => {
            // Update threshold only if the parsed input is a valid number
            if (
                reportUrl.startsWith(BASE_REPORT_URL) &&
                reportUrl.length > BASE_REPORT_URL.length
            ) {
                setUrl(reportUrl);
                setSelectedFile(null);
            }
        }, DEBOUNCE_MS);

        return () => {
            clearTimeout(handler);
        };
    }, [reportUrl]);

    const handleReportUrlChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setReportUrl(event.target.value);
    };

    const handleFileFieldChange = (acceptedFiles: File[]) => {
        if (acceptedFiles.length) {
            setSelectedFile(acceptedFiles[0]);
            setReportUrl("");
            setUrl("");
        } else {
            setSelectedFile(null);
            setReportUrl("");
            setUrl("");
        }
    };

    return (
        <Section size="2">
            <Box px="4">
                <Grid gap="4">
                    <Container size="2">
                        <Heading style={{ textAlign: "center" }}>
                            Log file tools
                        </Heading>
                    </Container>

                    <Container size="2">
                        <TextField.Root
                            value={reportUrl}
                            onChange={handleReportUrlChange}
                            placeholder="Enter DPS report URL"
                        />

                        <Flex justify="center" py="1">
                            <Text
                                style={{
                                    color: "var(--gray-10)",
                                }}
                                size="1"
                            >
                                — or —
                            </Text>
                        </Flex>

                        <Form.Root>
                            <div
                                style={{
                                    margin: "0 auto",
                                }}
                            >
                                <FileField
                                    file={selectedFile}
                                    onDrop={handleFileFieldChange}
                                />
                            </div>
                        </Form.Root>
                    </Container>

                    {error ? (
                        <Container size="2">
                            <div
                                style={{
                                    width: "100%",
                                    margin: "0 auto",
                                }}
                            >
                                <Callout.Root color="red">
                                    <Callout.Icon>
                                        <ExclamationTriangleIcon />
                                    </Callout.Icon>
                                    <Callout.Text>
                                        Something went wrong. Please try again
                                        later.
                                    </Callout.Text>
                                </Callout.Root>
                            </div>
                        </Container>
                    ) : isLoading ? (
                        <Container size="2">
                            <Progress duration="5s" />
                        </Container>
                    ) : data ? (
                        toolType === "health-percent" ? (
                            <>
                                <Container size="2">
                                    <Select.Root
                                        value={toolType}
                                        onValueChange={(value: ToolType) =>
                                            setToolType(value)
                                        }
                                    >
                                        <Select.Trigger
                                            style={{
                                                width: "100%",
                                                margin: "0 auto",
                                            }}
                                        >
                                            <Text color="gray">Tool:</Text>{" "}
                                            <Text>
                                                {TOOL_TYPE_OPTIONS[toolType]}
                                            </Text>
                                        </Select.Trigger>
                                        <Select.Content>
                                            <Select.Group>
                                                <Select.Label>
                                                    Tool
                                                </Select.Label>
                                                {Object.entries(
                                                    TOOL_TYPE_OPTIONS
                                                ).map(([value, label]) => (
                                                    <Select.Item
                                                        value={value}
                                                        key={value}
                                                    >
                                                        {label}
                                                    </Select.Item>
                                                ))}
                                            </Select.Group>
                                        </Select.Content>
                                    </Select.Root>
                                </Container>

                                <HealthPercentPage json={data} />
                            </>
                        ) : null
                    ) : null}

                    {}
                </Grid>
            </Box>
        </Section>
    );
}

export default Logs;
