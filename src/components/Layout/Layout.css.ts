import { style, globalStyle } from "@vanilla-extract/css";
import { topbarHeight } from "@/styles/tokens.css";

// Global styles
globalStyle("radix-themes", {
    padding: topbarHeight,
});

export const layoutWrapper = style({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto",
});

export const pageContent = style({});

export const header = style({
    backgroundColor: "var(--gray-2)",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: topbarHeight,
    zIndex: 2,
    boxShadow: "var(--shadow-3)",
});

export const headerContent = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
});

export const logoLink = style({
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
});

export const rightOptions = style({
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: "1em",
});

globalStyle(".rt-Button:where(.rt-r-size-2):where(.rt-variant-ghost)", {
    vars: {
        "--button-ghost-padding-y": "var(--space-2)",
    },
});
