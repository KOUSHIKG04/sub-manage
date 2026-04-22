import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";

export default function ListHeading({
  title,
  onPressViewAll,
}: ListHeadingProps) {
  const { theme } = useTheme();
  return (
    <View className="list-head">
      <Text className="list-title" style={{ color: theme.text }}>
        {title}
      </Text>

      <TouchableOpacity
        className="list-action"
        onPress={onPressViewAll}
        accessibilityRole="button"
        accessibilityLabel={`View all ${title}`}
        style={{
          backgroundColor: theme.surfaceFill,
          borderWidth: 0.7,
          borderColor: theme.stroke,
        }}
      >
        <Text
          className="list-action-text"
          style={{
            color: theme.text,
          }}
        >
          View all
        </Text>
      </TouchableOpacity>
    </View>
  );
}
