export interface DocumentField {
    label: string;
    value: string;
    confidence: number;
    boundingBox?: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
    rawValue?: unknown;
    type?: "text" | "date" | "number";
    isValid?: boolean;
    fields?: DocumentField[];
}

export interface ProcessedDocumentResponse {
    fields: DocumentField[];
    text?: string;
    requestTime: number;
}

export type GoogleProcessorType =
    | "us-drivers-license-parser"
    | "document-parser"
    | "form-parser";

export type AmazonProcessorType = "identity-document-parser";
