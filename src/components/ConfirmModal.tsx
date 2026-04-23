import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/useTheme";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

export default function ConfirmModal({
  visible,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <View
          className="w-full rounded-[20px] p-5 border"
          style={{
            backgroundColor: theme.surfaceFill,
            borderColor: theme.stroke,
            borderWidth: 0.7,
          }}
        >
          {/* {danger && (
            <View className="mb-3">
              <Ionicons
                name="warning-outline"
                size={22}
                color={theme.semanticRed}
              />
            </View>
          )} */}

          <Text
            className="text-xl font-poppins-bold mb-4"
            style={{ color: theme.text }}
          >
            {title}{" "}
            {danger && (
              <Ionicons
                name="warning-outline"
                size={20}
                color={theme.semanticRed}
              />
            )}
          </Text>

          <Text
            className="text-md font-poppins mb-6"
            style={{ color: theme.text }}
          >
            {description}
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 px-6 py-4 rounded-[20px] items-center border"
              style={{
                borderColor: theme.text,
                borderWidth: 0.6,
                backgroundColor: theme.surfaceFill,
              }}
              onPress={onCancel}
            >
              <Text style={{ color: theme.text }}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 px-6 py-4 rounded-[20px] items-center"
              style={{
                backgroundColor: danger
                  ? theme.semanticRed
                  : theme.primaryOrange,
              }}
              onPress={onConfirm}
            >
              <Text className="text-white font-poppins-bold">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
