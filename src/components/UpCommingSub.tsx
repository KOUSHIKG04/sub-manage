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
    <View className="upcoming-card" style={{ backgroundColor: theme.primary }}>
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <View>
          <Text className="upcoming-price" style={{ color: theme.stroke }}>
            {formatCurrency(price, currency ?? "USD")}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft <= 0
              ? "Expired"
              : daysLeft === 1
                ? "Last day"
                : `${daysLeft} days left`}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: theme.stroke,
          marginTop: 2,
        }}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );
}
