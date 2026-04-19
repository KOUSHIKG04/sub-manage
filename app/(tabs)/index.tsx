import "@/global.css";
import Screen from "@/src/components/Screen";
import { useTheme } from "@/src/theme/useTheme";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  const { theme } = useTheme();
  return (
    <Screen>
       <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold text-primary" >
        Welcome to Nativewind!
      </Text></View>
    </Screen>
  );
}


