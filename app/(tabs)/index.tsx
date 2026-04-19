import "@/global.css";
import Screen from "@/src/components/Screen";
import { useTheme } from "@/src/theme/useTheme";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  const { theme } = useTheme();
  return (
    <Screen>
      <Text className="text-xl font-bold" style={{ color: theme.text }}>
        Welcome to Nativewind!
      </Text>
    </Screen>
  );
}


