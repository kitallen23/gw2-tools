import { createVar, globalStyle, style } from "@vanilla-extract/css";

export const fillColor = createVar();

export const logo = style({
    display: "flex",
});

globalStyle(`${logo} svg :not(g)`, {
    transition: "fill 0.3s ease-in-out",
});

globalStyle(`${logo} svg *`, {
    fill: fillColor,
});
