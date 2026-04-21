import { icons } from "@/src/constants/icon";
import { useTheme } from "@/src/theme/useTheme";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const TABS = [
    {
      name: "index",
      title: "Home",
      icon: icons.home,
    },
    {
      name: "subscription",
      title: "Subscription",
      icon: icons.wallet,
    },
    {
      name: "insights",
      title: "Insights",
      icon: icons.activity,
    },
    {
      name: "settings",
      title: "Settings",
      icon: icons.setting,
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          position: "absolute",
          borderTopWidth: 0,
          paddingTop: 13,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 73 + Math.max(insets.bottom, 12), paddingBottom: Math.max(insets.bottom, 12),
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.border,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  // backgroundColor: focused
                  //   ? theme.accent + "15"
                  //   : "transparent",
                  // borderRadius: 20,
                  padding: 16,
                  marginTop: 4,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={tab.icon}
                  style={{ width: 24, height: 24, tintColor: color }}
                  resizeMode="contain"
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
