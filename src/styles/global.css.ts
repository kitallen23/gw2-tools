import { footerHeight, lineHeight, topbarHeight } from "@/styles/tokens.css";
import { globalStyle, style } from "@vanilla-extract/css";

globalStyle(":root", {
    fontFamily:
        '"Noto Sans", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    lineHeight: 1.5,
    fontWeight: 400,
    colorScheme: "light dark",
    fontSynthesis: "none",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",

    vars: {
        "--line-height": lineHeight.default,
    },
});

globalStyle("*, *::before, *::after", {
    boxSizing: "border-box",
});

globalStyle("a", {
    fontWeight: 500,
    color: "var(--gray-11)",
    textDecoration: "inherit",
});

globalStyle("a:hover", {
    color: "#535bf2",
});

globalStyle("body", {
    margin: 0,
    backgroundColor: "var(--color-background)",
});

globalStyle("h1", {
    fontSize: "3.2em",
    lineHeight: 1.1,
});

export const radixTheme = style({
    paddingTop: topbarHeight,
    scrollPaddingTop: topbarHeight,

    paddingBottom: footerHeight,
    scrollPaddingBottom: footerHeight,

    vars: {
        "--default-font-family":
            '"Noto Sans", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        "--heading-font-family":
            '"Noto Sans", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        "--code-font-family": '"Noto Sans Mono", monospace',
    },
});

// Fix for a bug when nesting containers
const containerSizes = [1, 2, 3, 4] as const;
containerSizes.forEach(size => {
    globalStyle(`.rt-Container.rt-r-size-${size} > .rt-ContainerInner`, {
        maxWidth: `var(--container-${size}) !important`,
    });
});
