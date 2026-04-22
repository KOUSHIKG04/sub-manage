import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ListHeading({
  title,
  onPressViewAll,
}: ListHeadingProps) {
  return (
    <View className="list-head">
      <Text className="list-title text-primary">{title}</Text>

      <TouchableOpacity
        className="list-action bg-card border-border"
        onPress={onPressViewAll}
        accessibilityRole="button"
        accessibilityLabel={`View all ${title}`}
      >
        <Text className="list-action-text text-primary">View all</Text>
      </TouchableOpacity>
    </View>
  );
}
