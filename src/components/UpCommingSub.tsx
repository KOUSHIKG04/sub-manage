import { formatCurrency } from "@/src/lib/utils";
import { useTheme } from "@/src/theme/useTheme";
import React from "react";
import { Image, Text, View } from "react-native";

export default function UpcomingSubscriptionCard({
  name,
  price,
  daysLeft,
  icon,
  currency,
}: Omit<UpcomingSubscription, "id">) {
  const { theme } = useTheme();
  return (
    <View
      className="upcoming-card"
      style={{
        backgroundColor: "#ffff",
        borderWidth: 0.7,
        borderColor: theme.stroke,
      }}
    >
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <View>
          <Text className="upcoming-price" style={{ color: "#1a1a1a" }}>
            {formatCurrency(price, currency ?? "USD")}
          </Text>
          <Text
            className="upcoming-meta"
            style={{ color: "#A7A4A2" }}
            numberOfLines={1}
          >
            {daysLeft <= 0
              ? "Expired"
              : daysLeft === 1
                ? "Last day"
                : `${daysLeft} days left`}
          </Text>
        </View>
      </View>

      <Text className="text-lg font-sans-bold" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}
