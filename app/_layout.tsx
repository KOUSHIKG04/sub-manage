import "@/global.css";
import LoaderScreen from "@/src/components/LoaderScreen";
import ThemedToast from "@/src/components/ThemedToast";
import { useTheme } from "@/src/theme/useTheme";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PostHogProvider, usePostHog } from "posthog-react-native";

void SplashScreen.preventAutoHideAsync().catch(() => {});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const FONTS = {
  "PlusJakartaSans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  "PlusJakartaSans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
  "PlusJakartaSans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
  "PlusJakartaSans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  "PlusJakartaSans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  "PlusJakartaSans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
};

function InitialLayout() {
  const { isDark, theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const posthog = usePostHog();

  const [fontsLoaded, fontError] = useFonts(FONTS);

  useEffect(() => {
    if ((fontsLoaded || fontError) && isLoaded) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isLoaded]);

  // Identify or reset PostHog user based on auth state
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && userId) {
      const userProps: Record<string, string> = {};
      
      if (user?.primaryEmailAddress?.emailAddress) {
        userProps.email = user.primaryEmailAddress.emailAddress;
      }
      if (user?.fullName || user?.username) {
        userProps.name = (user.fullName || user.username) as string;
      }
      
      posthog.identify(userId, Object.keys(userProps).length > 0 ? userProps : undefined);
    } else if (!isSignedIn) {
      posthog.reset();
    }
  }, [isSignedIn, isLoaded, userId, user, posthog]);

  // Track screen views automatically
  useEffect(() => {
    if (pathname) {
      posthog.screen(pathname);
    }
  }, [pathname, posthog]);

  // Auth-aware redirect: navigate to the correct route group based on sign-in state
  useEffect(() => {
    if (!isLoaded || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)"; const inSSOCallback = segments[0] === "sso-callback";

    if (isSignedIn && (inAuthGroup || inSSOCallback)) {
      // User just signed in but is still in auth/callback → go to home
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup && !inSSOCallback) {
      // User is not signed in and not in auth flow → go to sign-in
      router.replace("/(auth)/sign-in");
    }
  }, [isSignedIn, isLoaded, fontsLoaded, segments, router]);

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

  // Memoize screen options to prevent Stack re-renders
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: { backgroundColor: theme.background },
      animation: "default" as const,
    }),
    [theme.background]
  );

  return (
    <View
      className={isDark ? "dark flex-1 bg-background" : "flex-1 bg-background"}
    >
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="sso-callback" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY!}
      options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <SafeAreaProvider>
          <InitialLayout />
          <ThemedToast />
        </SafeAreaProvider>
      </ClerkProvider>
    </PostHogProvider>
  );
}
