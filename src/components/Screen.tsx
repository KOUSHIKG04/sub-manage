import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/theme/useTheme";

export default function Screen({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      className="flex-1 p-5"
      style={{ backgroundColor: theme.primaryFill }}
    >
      {children}
    </SafeAreaView>
  );
}
