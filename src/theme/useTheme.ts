import { useColorScheme } from "react-native";
import { themeColors, type ResolvedTheme } from "@/src/theme/colors";
import { useThemeStore } from "@/src/stores/theme-store";

export function useTheme() {
    const systemScheme = useColorScheme();
    const mode = useThemeStore((state) => state.mode); const setMode = useThemeStore((state) => state.setMode);

    const resolvedTheme: ResolvedTheme =
        mode === "system"
            ? systemScheme === "dark"
                ? "dark"
                : "light"
            : mode;

    const theme = themeColors[resolvedTheme];

    return {
        mode,
        resolvedTheme,
        theme,
        isDark: resolvedTheme === "dark",
        setMode,
    };
}