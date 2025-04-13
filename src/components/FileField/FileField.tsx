import { dropzone, dropzoneText } from "@/components/FileField/dropzone.css";
import { Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

interface FileFieldProps {
    file: File | null;
    onDrop: (
        acceptedFiles: File[],
        fileRejections: FileRejection[],
        event: DropEvent
    ) => void;
}

const FileField = ({ file, onDrop }: FileFieldProps) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/octet-stream": [".zevtc", ".evtc"],
        },
        multiple: false,
    });

    return (
        <Form.Field name="file">
            <div
                {...getRootProps()}
                className={dropzone}
                data-dragging={isDragActive}
            >
                <Form.Control asChild>
                    <input {...getInputProps()} />
                </Form.Control>
                {file && file.name ? (
                    <Text>File chosen: {file.name}</Text>
                ) : isDragActive ? (
                    <Text className={dropzoneText}>Drop the file here</Text>
                ) : (
                    <Text className={dropzoneText}>
                        Drag and drop a file, or click to select
                    </Text>
                )}
            </div>
        </Form.Field>
    );
};

export default FileField;
