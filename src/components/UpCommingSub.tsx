import { View, Text, Image } from "react-native";
import React from "react";
// import { formatCurrency } from "@/src/lib/utils";

export default function UpcomingSubscriptionCard({
  name,
  price,
  daysLeft,
  icon,
  currency,
}: UpcomingSubscription) {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <View>
          <Text className="upcoming-price">
            {/* {formatCurrency(price, currency ?? "USD")} */}
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

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}
