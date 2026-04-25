import { icons } from "@/src/constants/icon";
import { useTheme } from "@/src/theme/useTheme";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#FF6B6B",
  "AI Tools": "#4ECDC4",
  "Developer Tools": "#FFE66D",
  Design: "#95E1D3",
  Productivity: "#F38181",
  Cloud: "#AA96DA",
  Music: "#FCBAD3",
  Other: "#A8D8EA",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscriptionCreated: (subscription: Subscription) => void;
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onSubscriptionCreated,
}: CreateSubscriptionModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    name.trim() !== "" &&
    price !== "" &&
    parseFloat(price) > 0 &&
    selectedCategory !== null;

  const handleSubmit = async () => {
    if (!isFormValid) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please fill all fields correctly",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const startDate = dayjs();
      const renewalDate =
        frequency === "monthly"
          ? startDate.add(1, "month")
          : startDate.add(1, "year");

      const newSubscription: Subscription = {
        id: `subscription-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: name.trim(),
        price: parseFloat(price),
        frequency,
        category: selectedCategory,
        status: "active",
        startDate: startDate.toISOString(),
        renewalDate: renewalDate.toISOString(),
        icon: icons.wallet,
        billing: frequency === "monthly" ? "Monthly" : "Yearly",
        color: CATEGORY_COLORS[selectedCategory],
        currency: "USD",
      };

      onSubscriptionCreated(newSubscription);

      // Reset form
      setName("");
      setPrice("");
      setFrequency("monthly");
      setSelectedCategory(null);

      // Close modal
      onClose();

      Toast.show({
        type: "success",
        text1: "Subscription Created",
        text2: `${newSubscription.name} added successfully`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceChange = (text: string) => {
    const sanitized = text.replace(/[^0-9.]/g, "");

    const parts = sanitized.split(".");
    if (parts.length > 2) {
      setPrice(parts[0] + "." + parts.slice(1).join(""));
    } else {
      setPrice(sanitized);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable className="flex-1" onPress={onClose} hitSlop={0} />
          <View
            className="mt-auto max-h-[85%] rounded-t-[24px]"
            style={{ backgroundColor: theme.background }}
          >
            <View
              className="flex-row items-center justify-between px-5 py-4 border-b-[0.7px]"
              style={{ borderColor: theme.stroke }}
            >
              <Text
                className="text-xl font-poppins-bold"
                style={{ color: theme.text }}
              >
                New Subscription
              </Text>
              <TouchableOpacity
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.surfaceFill }}
                onPress={onClose}
                hitSlop={8}
              >
                <Text
                  className="text-xs font-poppins-bold"
                  style={{ color: theme.text }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              scrollEnabled
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="gap-5 p-5">
                <View className="gap-2">
                  <Text
                    className="text-sm font-poppins-bold"
                    style={{ color: theme.text }}
                  >
                    Subscription Name
                  </Text>
                  <TextInput
                    className="rounded-[16px] border px-4 py-4 text-base font-poppins"
                    style={{
                      borderColor: theme.stroke,
                      backgroundColor: theme.surfaceFill,
                      color: theme.text,
                    }}
                    placeholder="e.g., Spotify, Netflix"
                    placeholderTextColor={theme.text}
                    value={name}
                    onChangeText={setName}
                    editable={!isSubmitting}
                  />
                </View>

                <View className="gap-2">
                  <Text
                    className="text-sm font-poppins-bold"
                    style={{ color: theme.text }}
                  >
                    Price
                  </Text>
                  <TextInput
                    className="rounded-[16px] border px-4 py-4 text-base font-poppins"
                    style={{
                      borderColor: theme.stroke,
                      backgroundColor: theme.surfaceFill,
                      color: theme.text,
                    }}
                    placeholder="0.00"
                    placeholderTextColor={theme.text}
                    value={price}
                    onChangeText={handlePriceChange}
                    keyboardType="decimal-pad"
                    editable={!isSubmitting}
                  />
                </View>

                <View className="gap-2">
                  <Text
                    className="text-sm font-poppins-bold"
                    style={{ color: theme.text }}
                  >
                    Billing Frequency
                  </Text>
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => setFrequency("monthly")}
                      disabled={isSubmitting}
                      className="flex-1 items-center rounded-[16px] border py-3"
                      style={{
                        borderColor:
                          frequency === "monthly" ? theme.accent : theme.stroke,
                        backgroundColor:
                          frequency === "monthly"
                            ? `${theme.accent}15`
                            : theme.surfaceFill,
                      }}
                    >
                      <Text
                        className={`text-sm ${frequency === "monthly" ? "font-poppins-bold" : "font-poppins"}`}
                        style={{
                          color:
                            frequency === "monthly" ? theme.accent : theme.text,
                        }}
                      >
                        Monthly
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setFrequency("yearly")}
                      disabled={isSubmitting}
                      className="flex-1 items-center rounded-[16px] border py-3"
                      style={{
                        borderColor:
                          frequency === "yearly" ? theme.accent : theme.stroke,
                        backgroundColor:
                          frequency === "yearly"
                            ? `${theme.accent}15`
                            : theme.surfaceFill,
                      }}
                    >
                      <Text
                        className={`text-sm ${frequency === "yearly" ? "font-poppins-bold" : "font-poppins"}`}
                        style={{
                          color:
                            frequency === "yearly" ? theme.accent : theme.text,
                        }}
                      >
                        Yearly
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="gap-2">
                  <Text
                    className="text-sm font-poppins-bold"
                    style={{ color: theme.text }}
                  >
                    Category
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => setSelectedCategory(category)}
                        disabled={isSubmitting}
                        className="rounded-[20px] border px-4 py-2"
                        style={{
                          borderColor:
                            selectedCategory === category
                              ? theme.accent
                              : theme.stroke,
                          backgroundColor:
                            selectedCategory === category
                              ? `${theme.accent}15`
                              : theme.surfaceFill,
                        }}
                      >
                        <Text
                          className={`text-sm ${selectedCategory === category ? "font-poppins-bold" : "font-poppins"}`}
                          style={{
                            color:
                              selectedCategory === category
                                ? theme.accent
                                : theme.text,
                          }}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!isFormValid || !selectedCategory || isSubmitting}
                  className="mt-6 items-center rounded-[16px] py-4"
                  style={{
                    backgroundColor:
                      !isFormValid || !selectedCategory || isSubmitting
                        ? `${theme.accent}72`
                        : theme.accent,
                  }}
                >
                  <Text
                    className="text-base font-poppins-bold"
                    style={{ color: theme.text }}
                  >
                    {isSubmitting ? "Creating..." : "Create Subscription"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
