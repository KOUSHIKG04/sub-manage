import { useTheme } from "@/src/theme/useTheme";
import React, { useMemo } from "react";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfigParams,
} from "react-native-toast-message";

const ThemedToast = () => {
  const { theme } = useTheme();

  const toastConfig = useMemo(
    () => ({
      success: (props: ToastConfigParams<any>) => (
        <BaseToast
          {...props}
          style={{
            backgroundColor: theme.card,
            borderLeftColor: theme.success,
            borderLeftWidth: 5,
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            color: theme.text,
            fontFamily: "PlusJakartaSans-Medium",
            fontSize: 15,
          }}
          text2Style={{
            color: theme.text,
            fontFamily: "PlusJakartaSans-Regular",
            fontSize: 13,
          }}
        />
      ),
      error: (props: ToastConfigParams<any>) => (
        <ErrorToast
          {...props}
          style={{
            backgroundColor: theme.card,
            borderLeftColor: theme.destructive,
            borderLeftWidth: 5,
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            color: theme.text,
            fontFamily: "PlusJakartaSans-Medium",
            fontSize: 15,
          }}
          text2Style={{
            color: theme.text,
            fontFamily: "PlusJakartaSans-Regular",
            fontSize: 13,
          }}
        />
      ),
    }),
    [theme.card, theme.success, theme.destructive, theme.text],
  );

  return (
    <Toast
      config={toastConfig}
      position="bottom"
      bottomOffset={20}
      visibilityTime={3000}
    />
  );
};

export default ThemedToast;
