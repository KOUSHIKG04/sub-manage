import "@/global.css";
import { useTheme } from "@/src/theme/useTheme";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { isDark, theme } = useTheme();

  return (
    <SafeAreaProvider>
      <View
        className={
          isDark ? "dark flex-1 bg-background" : "flex-1 bg-background"
        }
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            animation: "default",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
