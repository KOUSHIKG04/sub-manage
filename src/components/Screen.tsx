import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/theme/useTheme";

import { ViewProps } from "react-native";

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export default function Screen({ children, className, ...props }: ScreenProps) {
  const { theme } = useTheme();
  return (
    <SafeAreaView 
      className={className ? `flex-1 bg-background ${className}` : "flex-1 p-5 bg-background"} 
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}
