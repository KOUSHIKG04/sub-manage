import LoaderScreen from "@/src/components/LoaderScreen";
import Screen from "@/src/components/Screen";
import { useTheme } from "@/src/theme/useTheme";
import { useSignUp, useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as Linking from "expo-linking";
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
  const { signUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { theme } = useTheme();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const onSignUpPress = async () => {
    if (
      !emailAddress ||
      !password ||
      isSigningUp ||
      isGoogleLoading ||
      isVerifying
    ) {
      return;
    }

    setIsSigningUp(true);

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        setIsSigningUp(false);
        return;
      }

      const sendResult = await signUp.verifications.sendEmailCode();

      if (sendResult.error) {
        console.error(JSON.stringify(sendResult.error, null, 2));
        setIsSigningUp(false);
        return;
      }

      setIsSigningUp(false);
    } catch (err) {
      console.error("Sign-up error:", err);
      setIsSigningUp(false);
    }
  };

  const onPressVerify = async () => {
    if (!code || isVerifying || isSigningUp || isGoogleLoading) return;

    setIsVerifying(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        console.error(JSON.stringify(error, null, 2));
        setIsVerifying(false);
        return;
      }

      if (signUp.status === "complete") {
        setIsNavigating(true);
        await signUp.finalize();
      } else {
        console.error("Sign-up attempt not complete:", signUp);
        setIsVerifying(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setIsVerifying(false);
    }
  };

  const onGooglePress = useCallback(async () => {
    if (isGoogleLoading || isSigningUp || isVerifying) return;

    setIsGoogleLoading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/(auth)/sign-up", { scheme: "submanage" }),
      });

      if (createdSessionId && setActive) {
        setIsNavigating(true);
        await setActive({ session: createdSessionId });
        // router.replace("/(tabs)");
        return;
      }

      setIsGoogleLoading(false);
    } catch (err) {
      console.error("OAuth error", err);
      setIsGoogleLoading(false);
    }
  }, [startSSOFlow, router, isGoogleLoading, isSigningUp, isVerifying]);

  const isPendingVerification = Boolean(
    signUp?.status === "missing_requirements" &&
      signUp?.unverifiedFields?.includes("email_address")
  );

  const isAnyLoading =
    isSigningUp ||
    isVerifying ||
    isGoogleLoading ||
    isNavigating ||
    !signUp;


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
                {isPendingVerification ? "Verify Email" : "Create Account"}
              </Text>

              <Text
                className="text-base font-sans-regular text-center"
                style={{ color: theme.accent }}
              >
                {isPendingVerification
                  ? `Enter the code sent to ${emailAddress}`
                  : "Sign up to start tracking your subscriptions"}
              </Text>
            </View>

            {!isPendingVerification && (
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
                    placeholder="Create a password"
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
                  onPress={onSignUpPress}
                  disabled={!emailAddress || !password || isAnyLoading}
                  className="rounded-[18px] p-4 items-center justify-center mt-2"
                  style={{
                    backgroundColor: theme.accent,
                    opacity:
                      !emailAddress || !password || isAnyLoading ? 0.7 : 1,
                  }}
                >
                  {isSigningUp ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-sans-semibold text-base">
                      Sign Up
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
                      <Ionicons
                        name="logo-google"
                        size={20}
                        color={theme.text}
                      />
                      <Text
                        className="font-sans-semibold text-base"
                        style={{ color: theme.text }}
                      >
                        Continue with Google
                      </Text>
                    </>
                  )}
                </Pressable>

                <View className="mt-8 flex-row flex-wrap items-center justify-center">
                  <Text
                    className="font-sans-regular"
                    style={{ color: theme.text }}
                  >
                    Already have an account?{" "}
                  </Text>
                  <Link href="/(auth)/sign-in" asChild>
                    <Pressable disabled={isAnyLoading}>
                      <Text
                        className="font-sans-semibold"
                        style={{
                          color: theme.accent,
                          opacity: isAnyLoading ? 0.7 : 1,
                        }}
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
                  <Text
                    className="text-sm font-sans-medium mb-2"
                    style={{ color: theme.text }}
                  >
                    Verification Code
                  </Text>
                  <TextInput
                    value={code}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={theme.muted}
                    onChangeText={setCode}
                    keyboardType="numeric"
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
                  onPress={onPressVerify}
                  disabled={!code || isAnyLoading}
                  className="rounded-[18px] p-4 items-center justify-center mt-2"
                  style={{
                    backgroundColor: theme.accent,
                    opacity: !code || isAnyLoading ? 0.7 : 1,
                  }}
                >
                  {isVerifying || isNavigating ? (
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

        {isNavigating && (
          <View
            className="absolute inset-0 items-center justify-center"
            style={{ backgroundColor: theme.background + "CC" }}
          >
            <ActivityIndicator size="large" color={theme.accent} />
            <Text
              className="mt-4 font-sans-medium text-base"
              style={{ color: theme.text }}
            >
              Creating your account...
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}
