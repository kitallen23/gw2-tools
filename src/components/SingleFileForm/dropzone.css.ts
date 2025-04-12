import { style } from "@vanilla-extract/css";

export const dropzone = style({
    border: "2px dashed var(--gray-7)",
    borderRadius: "var(--radius-3)",
    padding: "var(--space-4)",
    backgroundColor: "var(--gray-2)",
    cursor: "pointer",
    transition: "all 0.2s ease",

    ":hover": {
        backgroundColor: "var(--gray-3)",
        borderColor: "var(--gray-8)",
    },

    selectors: {
        '&[data-dragging="true"]': {
            borderColor: "var(--accent-9)",
            backgroundColor: "var(--accent-3)",
        },
    },
});

export const dropzoneText = style({
    margin: 0,
    color: "var(--gray-11)",
    fontSize: "var(--font-size-3)",
    fontFamily: "var(--font-family)",
    textAlign: "center",
    userSelect: "none",
});
