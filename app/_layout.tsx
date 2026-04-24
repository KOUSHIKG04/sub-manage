import "@/global.css";
import LoaderScreen from "@/src/components/LoaderScreen";
import ThemedToast from "@/src/components/ThemedToast";
import { useTheme } from "@/src/theme/useTheme";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

void SplashScreen.preventAutoHideAsync().catch(() => {});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function InitialLayout() {
  const { isDark, theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const { isLoaded, isSignedIn } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    "PlusJakartaSans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "PlusJakartaSans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "PlusJakartaSans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && isLoaded) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isLoaded]);

  // Auth-aware redirect: navigate to the correct route group based on sign-in state
  useEffect(() => {
    if (!isLoaded || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inSSOCallback = segments[0] === "sso-callback";

    if (isSignedIn && (inAuthGroup || inSSOCallback)) {
      // User just signed in but is still in auth/callback → go to home
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup && !inSSOCallback) {
      // User is not signed in and not in auth flow → go to sign-in
      router.replace("/(auth)/sign-in");
    }
  }, [isSignedIn, isLoaded, fontsLoaded, segments]);

  if (fontError) throw fontError;

  if (!fontsLoaded || !isLoaded) {
    return (
      <View
        className={
          isDark ? "dark flex-1 bg-background" : "flex-1 bg-background"
        }
      >
        <LoaderScreen />
      </View>
    );
  }

  return (
    <View
      className={isDark ? "dark flex-1 bg-background" : "flex-1 bg-background"}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: "default",
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sso-callback" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <InitialLayout />
        <ThemedToast />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
