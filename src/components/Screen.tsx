import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/theme/useTheme";
import type { ComponentProps, ReactNode } from "react";

interface ScreenProps extends ComponentProps<typeof SafeAreaView> {
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
