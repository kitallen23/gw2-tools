import { useEffect, useState } from "react";
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
    TextField,
} from "@radix-ui/themes";
import { useGetLog } from "@/api/uploadFile";

import HealthPercentPage from "@/pages/Logfiles/HealthPercentPage/HealthPercentPage";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "react-router-dom";

type ToolType = "health-percent";
const TOOL_TYPE_OPTIONS = { "health-percent": "Health Threshold Display" };
const DEBOUNCE_MS = 500;
const BASE_REPORT_URL = "https://dps.report/";

function getSearchParamsUrl(searchParams: URLSearchParams) {
    const queryUrl = searchParams.get("url");
    if (queryUrl) {
        if (
            queryUrl.startsWith(BASE_REPORT_URL) &&
            queryUrl.length > BASE_REPORT_URL.length
        ) {
            return queryUrl;
        }
    }
    return "";
}

function Logs() {
    const [searchParams, setSearchParams] = useSearchParams();

    // reportUrl holds the raw input string
    const [reportUrl, setReportUrl] = useState<string>(
        getSearchParamsUrl(searchParams)
    );
    // url holds a valid DPS report URL
    const [url, setUrl] = useState<string>(getSearchParamsUrl(searchParams));

    const [toolType, setToolType] = useState<ToolType>("health-percent");

    const { data, isLoading, error } = useGetLog(url);

    useEffect(() => {
        const handler = setTimeout(() => {
            // Update threshold only if the parsed input is a valid number
            if (
                reportUrl.startsWith(BASE_REPORT_URL) &&
                reportUrl.length > BASE_REPORT_URL.length
            ) {
                setUrl(reportUrl);
            }
        }, DEBOUNCE_MS);

        return () => {
            clearTimeout(handler);
        };
    }, [reportUrl]);

    useEffect(() => {
        let validUrl;
        if (
            reportUrl.startsWith(BASE_REPORT_URL) &&
            reportUrl.length > BASE_REPORT_URL.length
        ) {
            validUrl = reportUrl;
        }

        if (reportUrl && validUrl) {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set("url", validUrl);
                return newParams;
            });
        } else {
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.delete("url");
                return newParams;
            });
        }
    }, [reportUrl, setSearchParams]);

    const handleReportUrlChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setReportUrl(event.target.value);
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
                            <Progress duration={url ? "0.5s" : "5s"} />
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
