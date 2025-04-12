import { style } from "@vanilla-extract/css";

export const darkCard = style({
    backgroundColor: "var(--gray-12)",
    color: "var(--gray-1)",
    selectors: {
        "&:before": {
            backgroundColor: "var(--gray-12)",
        },
    },
});
