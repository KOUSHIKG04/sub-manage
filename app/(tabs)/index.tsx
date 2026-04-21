import Screen from "@/src/components/Screen";
import { useTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

export default function Home() {
  const { theme } = useTheme();
  return (
    <Screen>
      <View>
        <Text className="text-2xl font-sans-bold text-primary">Home</Text>
      </View>
    </Screen>
  );
}
