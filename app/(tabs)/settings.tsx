import ConfirmModal from "@/src/components/ConfirmModal";
import Screen from "@/src/components/Screen";
import { showErrorToast } from "@/src/lib/utils";
import { useTheme } from "@/src/theme/useTheme";
import { useClerk, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Switch, Text, View } from "react-native";

export default function Settings() {
  const { theme, isDark, setMode, mode } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOut = async () => {
    try {
      setShowSignOutModal(false);
      await signOut();
      // router.replace("/(auth)/sign-in");
    } catch (err) {
      showErrorToast("Failed to sign out. Please try again.");
    }
  };

  const toggleTheme = () => {
    if (mode === "system") return;
    setMode(isDark ? "light" : "dark");
  };

  const SettingItem = ({
    icon,
    label,
    value,
    onPress,
    showChevron = true,
    destructive = false,
    rightElement,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    destructive?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-[20px] py-4 px-4 mb-4"
      style={{
        backgroundColor: theme.surfaceFill,
        borderWidth: 0.6,
        borderColor: theme.stroke,
      }}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{
          backgroundColor: destructive ? "#ff444415" : theme.surfaceFill,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? "#ff4444" : theme.text}
        />
      </View>

      <View className="flex-1">
        <Text
          className="text-base font-sans-medium"
          style={{ color: destructive ? "#ff4444" : theme.text }}
        >
          {label}
        </Text>
      </View>

      {value && (
        <Text
          className="text-sm font-sans-regular mr-2"
          style={{ color: theme.stroke }}
        >
          {value}
        </Text>
      )}

      {rightElement}

      {showChevron && !rightElement && (
        <Ionicons name="chevron-forward" size={20} color={theme.stroke} />
      )}
    </Pressable>
  );

  return (
    <Screen className="px-6">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 80,
          flexGrow: 1,
        }}
      >
        <View className="py-6 flex-col items-center">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-24 h-24 rounded-full mb-4 border-2"
              style={{ borderColor: theme.accent }}
            />
          ) : (
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: theme.accent }}
            >
              <Text className="text-white text-3xl font-sans-bold">
                {user?.firstName?.[0] ||
                  user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                  "U"}
              </Text>
            </View>
          )}

          <Text
            className="text-2xl font-sans-bold"
            style={{ color: theme.text }}
          >
            {user?.fullName || "User"}
          </Text>

          <Text
            className="text-sm font-sans-regular"
            style={{ color: theme.text }}
          >
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <View className="mt-8">
          <Text
            className="text-xs font-sans-bold uppercase tracking-widest mb-2"
            style={{ color: theme.text }}
          >
            TOGGLE THEME
          </Text>

          <View
            className="rounded-[20px] py-4 px-6 border mb-4"
            style={{
              backgroundColor: theme.surfaceFill,
              borderColor: theme.stroke,
              borderWidth: 0.6,
              opacity: mode === "system" ? 0.5 : 1,
            }}
          >
            <Pressable
              onPress={toggleTheme}
              disabled={mode === "system"}
              className="flex-row items-center justify-between py-4"
            >
              <Text
                className="font-poppins-bold"
                style={{ color: theme.text, includeFontPadding: false }}
              >
                {mode === "system"
                  ? "Disable system theme to change manually"
                  : isDark
                    ? "Dark Mode"
                    : "Light Mode"}
              </Text>

              <Ionicons
                name={isDark ? "moon" : "sunny-outline"}
                size={18}
                color={mode === "system" ? theme.stroke : theme.text}
              />
            </Pressable>
          </View>

          <SettingItem
            icon="laptop-outline"
            label="System Theme"
            showChevron={false}
            rightElement={
              <Switch
                value={mode === "system"}
                onValueChange={(val) => setMode(val ? "system" : "light")}
                trackColor={{ false: theme.stroke, true: theme.accent }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        <View className="mt-8">
          <Text
            className="text-xs font-sans-bold uppercase tracking-widest mb-2"
            style={{ color: theme.text }}
          >
            Account
          </Text>

          <SettingItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => {}}
          />

          <SettingItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => {}}
          />

          <SettingItem
            icon="log-out-outline"
            label="Sign Out"
            destructive
            showChevron={false}
            onPress={() => setShowSignOutModal(true)}
          />
        </View>

        <View className="mt-8 mb-10">
          <Text
            className="text-xs font-sans-bold uppercase tracking-widest mb-2"
            style={{ color: theme.text }}
          >
            More
          </Text>

          <SettingItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => {}}
          />

          <SettingItem
            icon="information-circle-outline"
            label="About"
            onPress={() => {}}
          />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showSignOutModal}
        title="Sign Out"
        description="Are you sure you want to sign out? You'll need to sign in again to access your account."
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutModal(false)}
        danger
      />
    </Screen>
  );
}
