import Screen from "@/src/components/Screen";
import { useTheme } from "@/src/theme/useTheme";
import { useSignIn, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

// import * as SecureStore from "expo-secure-store";
// const HAS_SIGNED_IN_BEFORE_KEY = "hasSignedInBefore";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { theme } = useTheme();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  // const [hasSignedInBefore, setHasSignedInBefore] = useState(false);
  // useEffect(() => {
  //   const loadFlag = async () => {
  //     const value = await SecureStore.getItemAsync(HAS_SIGNED_IN_BEFORE_KEY);
  //     setHasSignedInBefore(value === "true");
  //   };
  //   loadFlag();
  // }, []);

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate:async () => {
          router.replace("/(tabs)");
        },
      });
      // Or, omit navigate entirely and let Expo Router's layout handle navigation via useAuth() hook:
      // await signIn.finalize();
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/(auth)/callback", {
          scheme: "submanage",
        }),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startSSOFlow, router]);

  return (
    <Screen className="p-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-16">
            <View className="mb-12 flex-col items-center">
              <Text className="text-3xl font-sans-bold text-foreground mb-2">
                Welcome back
              </Text>
              <Text className="text-base font-sans-regular text-primary">
                Sign in to manage your subscriptions
              </Text>
            </View>

            <View className="gap-5">
              <View>
                <Text className="text-sm font-sans-medium text-foreground mb-2">
                  Email Address
                </Text>
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.muted}
                  onChangeText={setEmailAddress}
                  className="bg-card border border-border rounded-[18px] p-4 text-foreground font-sans-regular"
                  style={{ borderColor: theme.stroke }}
                />
                {errors?.fields?.identifier && (
                  <Text className="text-destructive font-sans-medium text-sm mt-1">
                    {errors.fields.identifier.message}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-sm font-sans-medium text-foreground mb-2">
                  Password
                </Text>
                <TextInput
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.muted}
                  secureTextEntry
                  onChangeText={setPassword}
                  className="bg-card border border-border rounded-[18px] p-4 text-foreground font-sans-regular"
                  style={{ borderColor: theme.stroke }}
                />
                {errors?.fields?.password && (
                  <Text className="text-destructive font-sans-medium text-sm mt-1">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={onSignInPress}
                disabled={
                  fetchStatus === "fetching" || !emailAddress || !password
                }
                className={`rounded-[18px] p-4 items-center justify-center mt-2 ${fetchStatus === "fetching" || !emailAddress || !password ? "opacity-70" : ""}`}
                style={{ backgroundColor: theme.accent }}
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-sans-semibold text-base">
                    Sign In
                  </Text>
                )}
              </Pressable>

              <View className="flex-row items-center gap-3 my-2">
                <View
                  className="flex-1 h-[1px] bg-border"
                  style={{ backgroundColor: theme.text + "30" }}
                />
                <Text className="text-primary font-sans-medium text-xs">
                  OR
                </Text>
                <View
                  className="flex-1 h-[1px] bg-border"
                  style={{ backgroundColor: theme.text + "30" }}
                />
              </View>

              <Pressable
                onPress={onGooglePress}
                className="flex-row gap-3 bg-card border border-border rounded-[18px] p-4 items-center justify-center"
                style={{ borderColor: theme.stroke }}
              >
                <Ionicons name="logo-google" size={20} color={theme.text} />
                <Text className="text-foreground font-sans-semibold text-base">
                  Continue with Google
                </Text>
              </Pressable>
            </View>

            <View className="mt-14 flex-row flex-wrap items-center justify-center">
              <Text className="font-sans-regular text-primary">
                Don't have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text
                    className="font-sans-semibold"
                    style={{ color: theme.accent }}
                  >
                    Sign up
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
