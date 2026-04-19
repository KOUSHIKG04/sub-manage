import { View, Text } from "react-native";
import React from "react";
import Screen from "@/src/components/Screen";

export default function settings() {
  return (
    <Screen>
       <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold text-primary">settings</Text></View>
    </Screen>
  );
}
