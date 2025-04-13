import { globalStyle, style } from "@vanilla-extract/css";

export const root = style({
    display: "flex",
});

export const list = style({
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid var(--gray-a5)",
});

export const trigger = style({
    padding: "var(--space-2) var(--space-4)",
    width: "100%",
    textAlign: "left",
    color: "var(--gray-9)",
    backgroundColor: "transparent",
    border: "none",
    borderRight: "2px solid transparent",
    marginRight: "-1px",
    cursor: "pointer",
    whiteSpace: "nowrap",

    ":hover": {
        color: "var(--gray-12)",
    },

    ":focus": {
        outline: "none",
    },

    selectors: {
        '&[data-state="active"]': {
            color: "var(--gray-12)",
            borderRightColor: "var(--accent-10)",
        },
    },
});
export const triggerContent = style({
    width: "100%",
    cursor: "pointer",
    justifyContent: "flex-start",

    fontSize: "var(--font-size-2)",
    lineHeight: "var(--line-height-2)",
    letterSpacing: "var(--letter-spacing-2)",
    padding: "var(--button-ghost-padding-y) var(--button-ghost-padding-x)",
    margin: "var(--margin-top-override) var(--margin-right-override) var(--margin-bottom-override) var(--margin-left-override)",
    borderRadius: "max(var(--radius-2), var(--radius-full))",
    boxSizing: "content-box",
    height: "fit-content",
    gap: "var(--space-1)",

    vars: {
        "--margin-top": "0px",
        "--margin-right": "0px",
        "--margin-bottom": "0px",
        "--margin-left": "0px",
        "--margin-top-override":
            "calc(var(--margin-top) - var(--button-ghost-padding-y))",
        "--margin-right-override":
            "calc(var(--margin-right) - var(--button-ghost-padding-x))",
        "--margin-bottom-override":
            "calc(var(--margin-bottom) - var(--button-ghost-padding-y))",
        "--margin-left-override":
            "calc(var(--margin-left) - var(--button-ghost-padding-x))",
        "--base-button-classic-active-padding-top": "2px",
        "--base-button-height": "var(--space-6)",
        "--button-ghost-padding-x": "var(--space-2)",
        "--button-ghost-padding-y": "var(--space-1)",
    },
});

globalStyle(`${trigger}:hover ${triggerContent}`, {
    backgroundColor: "var(--accent-a3)",
});

export const content = style({
    flexGrow: 1,
    paddingLeft: "var(--space-4)",
});
