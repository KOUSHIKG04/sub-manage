import Screen from "@/src/components/Screen";
import { useTheme } from "@/src/theme/useTheme";
import { useSignUp, useSSO } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { theme } = useTheme();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    const sendResult = await signUp.verifications.sendEmailCode();
    if (sendResult.error) {
      console.error(JSON.stringify(sendResult.error, null, 2));
    }
  };

  const onPressVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: () => {
          router.replace("/(tabs)");
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
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

  const isPendingVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

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
              <Text className="text-3xl font-sans-bold mb-2 text-foreground">
                {isPendingVerification ? "Verify Email" : "Create Account"}
              </Text>
              <Text className="text-base font-sans-regular text-primary">
                {isPendingVerification
                  ? `Enter the code sent to ${emailAddress}`
                  : "Sign up to start tracking your subscriptions"}
              </Text>
            </View>

            {!isPendingVerification && (
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
                  {errors?.fields?.emailAddress && (
                    <Text className="text-destructive font-sans-medium text-sm mt-1">
                      {errors.fields.emailAddress.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-sm font-sans-medium text-foreground mb-2">
                    Password
                  </Text>
                  <TextInput
                    value={password}
                    placeholder="Create a password"
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
                  onPress={onSignUpPress}
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
                      Sign Up
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

                <View className="mt-8 flex-row flex-wrap items-center justify-center">
                  <Text className="font-sans-regular text-primary">
                    Already have an account?{" "}
                  </Text>
                  <Link href="/(auth)/sign-in" asChild>
                    <Pressable>
                      <Text
                        className="font-sans-semibold"
                        style={{ color: theme.accent }}
                      >
                        Sign in
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              </View>
            )}

            {isPendingVerification && (
              <View className="gap-5">
                <View>
                  <Text className="text-sm font-sans-medium text-foreground mb-2">
                    Verification Code
                  </Text>
                  <TextInput
                    value={code}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={theme.muted}
                    onChangeText={setCode}
                    keyboardType="numeric"
                    className="bg-card border border-border rounded-[18px] p-4 text-foreground font-sans-regular"
                    style={{ borderColor: theme.stroke }}
                  />
                  {errors?.fields?.code && (
                    <Text className="text-destructive font-sans-medium text-sm mt-1">
                      {errors.fields.code.message}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={onPressVerify}
                  disabled={fetchStatus === "fetching" || !code}
                  className={`rounded-[18px] p-4 items-center justify-center mt-2 ${fetchStatus === "fetching" || !code ? "opacity-70" : ""}`}
                  style={{ backgroundColor: theme.accent }}
                >
                  {fetchStatus === "fetching" ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-sans-semibold text-base">
                      Verify Email
                    </Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
