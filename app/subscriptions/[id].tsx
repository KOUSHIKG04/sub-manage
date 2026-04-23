import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Screen from "@/src/components/Screen";

export default function SubscriptionDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <Text className="text-primary">Subscription Details: {id}</Text>
      </View>
    </Screen>
  );
}
