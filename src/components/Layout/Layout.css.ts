import { style, globalStyle } from "@vanilla-extract/css";
import { footerHeight, topbarHeight } from "@/styles/tokens.css";

export const layoutWrapper = style({
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto",
});

export const pageContent = style({});

export const header = style({
    fontFamily: "var(--code-font-family)",
    backgroundColor: "var(--gray-2)",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: topbarHeight,
    zIndex: 2,
    boxShadow: "var(--shadow-3)",
});

export const footer = style({
    backgroundColor: "var(--gray-2)",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: footerHeight,
    zIndex: 2,
});

export const versionText = style({
    fontFamily: "var(--code-font-family)",
    color: "var(--gray-8)",
    fontSize: "0.65rem",
});
export const attribution = style({
    fontFamily: "var(--code-font-family)",
    color: "var(--gray-10)",
    fontSize: "0.65rem",
});
export const githubLogo = style({
    color: "var(--gray-10)",
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

globalStyle(
    `${header} .rt-Button:where(.rt-r-size-2):where(.rt-variant-ghost)`,
    {
        vars: {
            "--button-ghost-padding-y": "var(--space-2)",
        },
    }
);
