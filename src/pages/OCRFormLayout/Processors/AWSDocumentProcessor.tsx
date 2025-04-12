import { useMemo, useState } from "react";
import {
    Button,
    Card,
    Checkbox,
    Flex,
    Grid,
    Heading,
    Select,
    Text,
} from "@radix-ui/themes";
import { nanoid } from "nanoid";
import { HTTPError } from "ky";
import { LapTimerIcon, ResetIcon } from "@radix-ui/react-icons";

import { useAmazonProcessDocument } from "@/api/documentAi";
import SingleFileForm from "@/components/SingleFileForm/SingleFileForm";
import EntityTable from "@/components/EntityTable";
import {
    AmazonProcessorType,
    ProcessedDocumentResponse,
} from "@/types/document.types";
import { usePassword } from "@/contexts/PasswordContext";
import { PDFPreview } from "@/components/PDFPreview/PDFPreview";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

const PROCESSOR_TYPE_OPTIONS = {
    "identity-document-parser": "Identity Document",
};

function AWSDocumentProcessor() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [ocrResult, setOcrResult] =
        useState<ProcessedDocumentResponse | null>(null);
    const [processorType, setProcessorType] = useState<AmazonProcessorType>(
        "identity-document-parser"
    );
    const [hideBlankEntities, setHideBlankEntities] = useState<boolean>(true);
    const formId = useMemo(() => nanoid(4), []);

    const { mutate, isPending, reset } = useAmazonProcessDocument();
    const { setHasError: setHasPasswordError } = usePassword();
    const [errorText, setErrorText] = useState("");

    const handleSubmit = async () => {
        setHasPasswordError(false);
        setErrorText("");
        if (selectedFile && !isPending) {
            mutate(
                { file: selectedFile, processorType },
                {
                    onSuccess: data => {
                        console.info(`data: `, data);
                        const sortedFields = [...data.fields].sort((a, b) => {
                            // Put empty values last
                            if (!a.value && b.value) return 1;
                            if (a.value && !b.value) return -1;

                            // For non-empty values, sort by confidence
                            // For empty values, also sort by confidence
                            return b.confidence - a.confidence;
                        });
                        setOcrResult({
                            ...data,
                            fields: sortedFields,
                        });
                    },
                    onError: async err => {
                        if (err instanceof HTTPError) {
                            const statusCode = err.response.status;
                            console.error(
                                `Error ${statusCode} processing document:`,
                                err
                            );
                            if (statusCode === 401) {
                                setHasPasswordError(true);
                                return;
                            }
                            try {
                                const errorData = await err.response.json();
                                const message =
                                    errorData.details || errorData.error || "";
                                if (message) {
                                    setErrorText(message);
                                }
                            } catch {} //eslint-disable-line no-empty
                        } else {
                            console.error(`Error processing document:`, err);
                        }
                    },
                }
            );
        }
    };

    const handleSelectedFileChange = (value: File | null) => {
        setSelectedFile(value);
        setOcrResult(null);
        reset();
    };
    const handleProcessorTypeChange = (value: AmazonProcessorType) => {
        if (processorType !== value) {
            setProcessorType(value);
            setOcrResult(null);
            reset();
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setHasPasswordError(false);
        setErrorText("");
        setOcrResult(null);
    };

    return (
        <>
            <Heading>Optical Character Recognition - Amazon Textract</Heading>
            <Select.Root
                value={processorType}
                onValueChange={(value: AmazonProcessorType) =>
                    handleProcessorTypeChange(value)
                }
            >
                <Select.Trigger>
                    <Text color="gray">Parser:</Text>{" "}
                    <Text>{PROCESSOR_TYPE_OPTIONS[processorType]}</Text>
                </Select.Trigger>
                <Select.Content>
                    <Select.Group>
                        <Select.Label>Parsers</Select.Label>
                        {Object.entries(PROCESSOR_TYPE_OPTIONS).map(
                            ([value, label]) => (
                                <Select.Item value={value} key={value}>
                                    {label}
                                </Select.Item>
                            )
                        )}
                    </Select.Group>
                </Select.Content>
            </Select.Root>

            <Card>
                <SingleFileForm
                    id={formId}
                    selectedFile={selectedFile}
                    setSelectedFile={handleSelectedFileChange}
                    onSubmit={handleSubmit}
                />
            </Card>
            {selectedFile ? (
                selectedFile.type === "application/pdf" ? (
                    <PDFPreview file={selectedFile} />
                ) : (
                    <Card style={{ padding: 0 }}>
                        <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Preview"
                            style={{
                                maxWidth: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </Card>
                )
            ) : null}
            <Button disabled={!selectedFile} loading={isPending} form={formId}>
                Submit
            </Button>

            <ErrorMessage errorText={errorText} />

            {ocrResult?.fields && !isPending ? (
                <Grid columns="1" gap="3" mt="4">
                    <Flex justify="between" gap="3">
                        <Heading size="4">Extracted Fields</Heading>
                        <Text
                            as="label"
                            htmlFor="hide-blank-rows"
                            style={{ userSelect: "none" }}
                        >
                            <Flex gap="2">
                                <Checkbox
                                    checked={hideBlankEntities}
                                    onCheckedChange={value =>
                                        setHideBlankEntities(!!value)
                                    }
                                    id="hide-blank-rows"
                                    style={{ height: "var(--line-height-3)" }}
                                />
                                Hide blank rows
                            </Flex>
                        </Text>
                        <Text color="gray">
                            {ocrResult.requestTime ? (
                                <Flex align="center" gap="1">
                                    <LapTimerIcon />
                                    {`${(ocrResult?.requestTime / 1000).toFixed(2)} seconds`}
                                </Flex>
                            ) : null}
                        </Text>
                    </Flex>
                    <EntityTable
                        entities={ocrResult.fields}
                        hideBlankEntities={hideBlankEntities}
                    />
                </Grid>
            ) : null}

            {ocrResult ? (
                <Flex justify="end">
                    <Button variant="soft" onClick={handleReset}>
                        <ResetIcon /> Start over
                    </Button>
                </Flex>
            ) : null}
        </>
    );
}

export default AWSDocumentProcessor;
