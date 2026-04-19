export const themeColors = {
    light: {
        primaryFill: "#FBF6F3",
        surfaceFill: "#FFFFFF",
        containerFill: "#ffe7da9a",
        text: "#010101",
        stroke: "#A7A4A2",
        primaryOrange: "#FF5C00",
        semanticGreen: "#14761A",
        semanticRed: "#FF4F41",
        whiteConstant: "#FFFFFF",
        background: "#FBF6F3",
        card: "#FFFFFF",
        muted: "#ffe7da9a",
        primary: "#010101",
        accent: "#FF5C00",
        border: "#A7A4A2",
        success: "#14761A",
        destructive: "#FF4F41",
        subscription: "#8fd1bd",
    },
    dark: {
        primaryFill: "#111111",
        surfaceFill: "#22201F",
        containerFill: "#363636",
        text: "#FFFFFF",
        stroke: "#a1a1a19e",
        primaryOrange: "#FF5C00",
        semanticGreen: "#23BB2D",
        semanticRed: "#FF4F41",
        whiteConstant: "#FFFFFF",
        background: "#111111",
        card: "#22201F",
        muted: "#363636",
        primary: "#FFFFFF",
        accent: "#FF5C00",
        border: "#a1a1a19e",
        success: "#23BB2D",
        destructive: "#FF4F41",
        subscription: "#8fd1bd", // Assuming same for dark, or adjust if needed
    },
} as const;

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type AppTheme = (typeof themeColors)[ResolvedTheme];