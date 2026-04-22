import ListHeading from "@/src/components/ListHeading";
import Screen from "@/src/components/Screen";
import UpcomingSubscriptionCard from "@/src/components/UpCommingSub";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/src/constants/data";
import image from "@/src/constants/image";
import { formatCurrency } from "@/src/lib/utils";
import { useTheme } from "@/src/theme/useTheme";
import dayjs from "dayjs";
import { Image, Text, View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SubscriptionCard from "@/src/components/SubscriptionCard";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const { theme } = useTheme();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={image.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>
              <View className="p-2 items-center justify-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: theme.surfaceFill,
                  }}
                >
                  <Ionicons name="add" size={35} color={theme.text} />
                </View>
              </View>
            </View>
            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount, "USD")}
                </Text>

                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("DD/MM")}
                </Text>
              </View>
            </View>
            <View className="mb-5 mt-2">
              <ListHeading
                title="Upcoming"
                onPressViewAll={() => console.log("View all pressed")}
              />

              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading
              title="All Subscriptions"
              onPressViewAll={() => console.log("ALL SUB")}
            />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet.</Text>
        }
        contentContainerStyle={{
          paddingBottom: 50 + insets.bottom,
        }}
      />
    </Screen>
  );
}
