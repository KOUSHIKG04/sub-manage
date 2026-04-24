import { useTheme } from "@/src/theme/useTheme";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

type LoaderScreenProps = {
  description?: string;
};

export default function LoaderScreen({ description }: LoaderScreenProps) {
  const { theme } = useTheme();
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={theme.accent} />
      <Text
        className="text-base font-sans-regular mt-4"
        style={{ color: theme.text }}
      >
        {description ? (
          <Text
            className="text-base font-sans-regular mt-4"
            style={{ color: theme.text }}
          >
            {description}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}
