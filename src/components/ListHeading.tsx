import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ListHeading({
  title,
  onPressViewAll,
}: ListHeadingProps) {
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      <TouchableOpacity
        className="list-action"
        onPress={onPressViewAll}
        accessibilityRole="button"
        accessibilityLabel={`View all ${title}`}
      >
        <Text className="list-action-text">View all</Text>
      </TouchableOpacity>
    </View>
  );
}
