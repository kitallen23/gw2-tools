import { Document, Page } from "react-pdf";
import { useState } from "react";
import { AccessibleIcon, Card, Flex, IconButton } from "@radix-ui/themes";
import { useResizeDetector } from "react-resize-detector";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";

interface PDFPreviewProps {
    file: string | File;
    width?: number;
}

export const PDFPreview = ({ file }: PDFPreviewProps) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { width, ref } = useResizeDetector();

    const changePage = (offset: number) => {
        setCurrentPage(prevPage => {
            const newPage = prevPage + offset;
            return Math.min(Math.max(1, newPage), numPages);
        });
    };

    return (
        <>
            <Card ref={ref}>
                <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                    <Page
                        pageNumber={currentPage}
                        width={width}
                        scale={1.0}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </Card>

            {numPages <= 1 ? null : (
                <Flex justify="center">
                    <Flex display="inline-flex" gap="3">
                        <IconButton
                            variant="soft"
                            onClick={() => changePage(-1)}
                            size="1"
                        >
                            <AccessibleIcon label="Previous page">
                                <CaretLeftIcon />
                            </AccessibleIcon>
                        </IconButton>
                        <div>
                            Page {currentPage} of {numPages}
                        </div>
                        <IconButton
                            variant="soft"
                            onClick={() => changePage(1)}
                            size="1"
                        >
                            <AccessibleIcon label="Next page">
                                <CaretRightIcon />
                            </AccessibleIcon>
                        </IconButton>
                    </Flex>
                </Flex>
            )}
        </>
    );
};
