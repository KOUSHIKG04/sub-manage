import Screen from "@/src/components/Screen";
import { showErrorToast, showSuccessToast } from "@/src/lib/utils";
import { useTheme } from "@/src/theme/useTheme";
import { useClerk, useSignIn, useSSO } from "@clerk/expo";
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

export default function SignIn() {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { theme } = useTheme();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onSignInPress = async () => {
    if (!emailAddress || !password || isSigningIn || isGoogleLoading) return;

    setIsSigningIn(true);

    try {
      await signIn?.create({
        identifier: emailAddress,
      });
      const res = await signIn?.password({
        password,
      });

      if (res?.error) {
        let message =
          // @ts-ignore
          res.error.errors?.[0]?.longMessage || res.error.errors?.[0]?.message ||
          "Invalid credentials";

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes("password")) {
          message = "Wrong password";
        } else if (
          lowerMsg.includes("identifier") ||
          lowerMsg.includes("account") ||
          lowerMsg.includes("not found")
        ) {
          message = "Account not found, please create account";
        } else if (lowerMsg.includes("too many")) {
          message = "Too many attempts. Try again later";
        }

        showErrorToast(message);
        setIsSigningIn(false);
        return;
      }

      if (signIn?.status === "complete") {
        setIsNavigating(true);
        await signIn.finalize();
        showSuccessToast("Signed in successfully!");
        return;
      }

      // fallback
      showErrorToast("Sign-in not complete. Try again.");
      setIsSigningIn(false);
    } catch (err) {
      console.log("UNEXPECTED ERROR:", err);
      showErrorToast("Something went wrong");
      setIsNavigating(false);
      setIsSigningIn(false);
    }
  };

  const onGooglePress = useCallback(async () => {
    if (isGoogleLoading || isSigningIn) return;

    setIsGoogleLoading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/sso-callback", {
          scheme: "submanage",
        }),
      });

      if (createdSessionId && setActive) {
        setIsNavigating(true);
        await setActive({ session: createdSessionId });
        // router.replace("/(tabs)");
        return;
      }

      setIsGoogleLoading(false);
    } catch (err) {
      showErrorToast("Google sign-in failed. Please try again.");
      setIsNavigating(false);
      setIsGoogleLoading(false);
    }
  }, [startSSOFlow, router, isGoogleLoading, isSigningIn]);

  const isAnyLoading =
    isSigningIn || isGoogleLoading || isNavigating || !signIn;

  return (
    <Screen className="p-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-16">
            <View className="mb-12 flex-col items-center">
              <Text
                className="text-3xl font-sans-bold mb-2"
                style={{ color: theme.text }}
              >
                Welcome back
              </Text>
              <Text
                className="text-base font-sans-regular"
                style={{ color: theme.accent }}
              >
                Sign in to manage your subscriptions
              </Text>
            </View>

            <View className="gap-5">
              <View>
                <Text
                  className="text-sm font-sans-medium mb-2"
                  style={{ color: theme.text }}
                >
                  Email Address
                </Text>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.stroke}
                  onChangeText={setEmailAddress}
                  editable={!isAnyLoading}
                  className="rounded-[18px] p-4 font-sans-regular"
                  style={{
                    borderColor: theme.stroke,
                    borderWidth: 1,
                    color: theme.text,
                    backgroundColor: theme.surfaceFill,
                  }}
                />
              </View>

              <View>
                <Text
                  className="text-sm font-sans-medium mb-2"
                  style={{ color: theme.text }}
                >
                  Password
                </Text>
                <TextInput
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.stroke}
                  secureTextEntry
                  onChangeText={setPassword}
                  editable={!isAnyLoading}
                  className="rounded-[18px] p-4 font-sans-regular"
                  style={{
                    borderColor: theme.stroke,
                    borderWidth: 1,
                    color: theme.text,
                    backgroundColor: theme.surfaceFill,
                  }}
                />
              </View>

              <Pressable
                onPress={onSignInPress}
                disabled={!emailAddress || !password || isAnyLoading}
                className="rounded-[18px] p-4 items-center justify-center mt-2"
                style={{
                  backgroundColor: theme.accent,
                  opacity: !emailAddress || !password || isAnyLoading ? 0.7 : 1,
                }}
              >
                {isSigningIn || isNavigating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-sans-semibold text-base">
                    Sign In
                  </Text>
                )}
              </Pressable>

              <View className="flex-row items-center gap-3 my-2">
                <View
                  className="flex-1 h-[1px]"
                  style={{ backgroundColor: theme.text + "30" }}
                />
                <Text
                  className="font-sans-medium text-xs"
                  style={{ color: theme.text }}
                >
                  OR
                </Text>
                <View
                  className="flex-1 h-[1px]"
                  style={{ backgroundColor: theme.text + "30" }}
                />
              </View>

              <Pressable
                onPress={onGooglePress}
                disabled={isAnyLoading}
                className="flex-row gap-3 rounded-[18px] p-4 items-center justify-center"
                style={{
                  borderColor: theme.stroke,
                  borderWidth: 1,
                  backgroundColor: theme.surfaceFill,
                  opacity: isAnyLoading ? 0.7 : 1,
                }}
              >
                {isGoogleLoading || isNavigating ? (
                  <ActivityIndicator color={theme.text} />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color={theme.text} />
                    <Text
                      className="font-sans-semibold text-base"
                      style={{ color: theme.text }}
                    >
                      Continue with Google
                    </Text>
                  </>
                )}
              </Pressable>
            </View>

            <View className="mt-14 flex-row flex-wrap items-center justify-center">
              <Text className="font-sans-regular" style={{ color: theme.text }}>
                Don't have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable disabled={isAnyLoading}>
                  <Text
                    className="font-sans-semibold"
                    style={{
                      color: theme.accent,
                      opacity: isAnyLoading ? 0.7 : 1,
                    }}
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
