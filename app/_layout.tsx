import "@/global.css";
import { useTheme } from "@/src/theme/useTheme";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

void SplashScreen.preventAutoHideAsync().catch(() => {});


export default function RootLayout() {
  const { isDark, theme } = useTheme();

   const [fontsLoaded, fontError] = useFonts({
     "PlusJakartaSans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
     "PlusJakartaSans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
     "PlusJakartaSans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
     "PlusJakartaSans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
     "PlusJakartaSans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
     "PlusJakartaSans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
   });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (fontError) throw fontError;

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
