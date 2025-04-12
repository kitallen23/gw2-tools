import { Grid, Text } from "@radix-ui/themes";
import { useDropzone } from "react-dropzone";
import { Form } from "radix-ui";

import { dropzone, dropzoneText } from "./dropzone.css.ts";

interface SingleFileFormProps {
    id: string;
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    onSubmit: () => void;
}

function SingleFileForm({
    id,
    selectedFile,
    setSelectedFile,
    onSubmit,
}: SingleFileFormProps) {
    const onDrop = (acceptedFiles: File[]) => {
        setSelectedFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
            "application/pdf": [".pdf"],
        },
        multiple: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <Form.Root id={id} onSubmit={handleSubmit}>
            <Grid columns="1" gap="3">
                <Form.Field name="file">
                    <div
                        {...getRootProps()}
                        className={dropzone}
                        data-dragging={isDragActive}
                    >
                        <Form.Control asChild>
                            <input {...getInputProps()} />
                        </Form.Control>
                        {selectedFile && selectedFile.name ? (
                            <Text>File chosen: {selectedFile.name}</Text>
                        ) : isDragActive ? (
                            <Text className={dropzoneText}>
                                Drop the file here
                            </Text>
                        ) : (
                            <Text className={dropzoneText}>
                                Drag and drop a file, or click to select
                            </Text>
                        )}
                    </div>
                    <Form.Message match="valueMissing">
                        Please select a file
                    </Form.Message>
                </Form.Field>
            </Grid>
        </Form.Root>
    );
}

export default SingleFileForm;
