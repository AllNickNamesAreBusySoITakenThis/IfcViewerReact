import { RGBColor } from "./Color";

export const ColorComponentFromFloat = (component: number) => {
    return Math.round(component * 255.0);
}

export function ColorComponentToFloat(component: number) {
    return component / 255.0;
}

export function RGBColorFromFloatComponents(r: number, g: number, b: number): RGBColor {
    return new RGBColor(
        ColorComponentFromFloat(r),
        ColorComponentFromFloat(g),
        ColorComponentFromFloat(b)
    );
}

export { }