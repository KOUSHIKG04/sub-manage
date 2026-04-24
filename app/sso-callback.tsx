import LoaderScreen from "@/src/components/LoaderScreen";
import { showErrorToast } from "@/src/lib/utils";
import { useTheme } from "@/src/theme/useTheme";
import { useClerk } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

// Dismiss the in-app browser if it's still open
WebBrowser.maybeCompleteAuthSession();

export default function SSOCallback() {
  const { theme } = useTheme();
  const { setActive } = useClerk();
  const router = useRouter();
  const params = useLocalSearchParams<{
    created_session_id?: string;
    rotating_token_nonce?: string;
  }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeSession = async () => {
      try {
        const sessionId = Array.isArray(params.created_session_id)
          ? params.created_session_id[0]
          : params.created_session_id;

        if (!sessionId) {
          // If there is no session ID, it means the flow was cancelled or failed
          setError("Session creation failed. Please try again.");
          return;
        }

        // Activate the session that was created by the SSO flow
        await setActive({ session: sessionId });
        // After this, isSignedIn will become true and root layout will redirect to (tabs)
      } catch (err) {
        showErrorToast("Failed to complete sign in. Please try again.");
        setError("Failed to complete sign in. Please try again.");
      }
    };

    void completeSession();
  }, [params.created_session_id, setActive]);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: theme.background }}
    >
      {error ? (
        <View className="items-center px-8">
          <Text
            className="text-center font-sans-medium text-base"
            style={{ color: theme.destructive || "#ef4444" }}
          >
            {error}
          </Text>
          <Pressable
            onPress={() => router.replace("/(auth)/sign-in")}
            className="mt-4 rounded-[14px] px-4 py-3"
            style={{ backgroundColor: theme.accent }}
          >
            <Text className="text-white font-sans-semibold">
              Back to Sign In
            </Text>
          </Pressable>
        </View>
      ) : (
        <LoaderScreen description="Completing signin..." />
      )}
    </View>
  );
}
