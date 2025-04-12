import { useState } from "react";
import FileField from "@/components/FileField/FileField";
import {
    Box,
    Callout,
    Container,
    Grid,
    Heading,
    Progress,
    Section,
    Select,
    Text,
} from "@radix-ui/themes";
import { Form } from "radix-ui";
import { useGetLog } from "@/api/uploadFile";

import HealthPercentPage from "@/pages/Logfiles/HealthPercentPage/HealthPercentPage";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type ToolType = "health-percent";
const TOOL_TYPE_OPTIONS = { "health-percent": "Health Threshold Display" };

function Logs() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [toolType, setToolType] = useState<ToolType>("health-percent");

    const onDrop = (acceptedFiles: File[]) => {
        setSelectedFile(acceptedFiles[0]);
    };

    const { data, isLoading, error } = useGetLog(selectedFile);

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
                        <Form.Root>
                            <div
                                style={{
                                    margin: "0 auto",
                                }}
                            >
                                <FileField
                                    file={selectedFile}
                                    onDrop={onDrop}
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
