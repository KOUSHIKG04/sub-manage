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
import {
  Image,
  Text,
  View,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SubscriptionCard from "@/src/components/SubscriptionCard";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const { theme } = useTheme();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const ItemSeparator = () => <View className="h-4" />;

  const renderHeader = useCallback(
    () => (
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
                borderWidth: 0.7,
                borderColor: theme.stroke,
              }}
            >
              <Ionicons name="add" size={33} color={theme.text} />
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
            // TODO
            onPressViewAll={() => console.log("View all pressed")}
          />
          {/* <FlatList
            data={UPCOMING_SUBSCRIPTIONS}
            renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <Text className="home-empty-state">
                No upcoming renewals yet.
              </Text>
            }
          /> */}

          {/* When FlatList is okay Use a nested FlatList only when the inner list
          is actually large enough to need virtualization and you have tested
          scroll behavior carefully. For a tiny header carousel like yours,
          ScrollView is usually the right tradeoff because it avoids warnings
          and complexity without hurting performance. */}

          {UPCOMING_SUBSCRIPTIONS.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 8 }}
            >
              {UPCOMING_SUBSCRIPTIONS.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    marginRight:
                      index === UPCOMING_SUBSCRIPTIONS.length - 1 ? 0 : 3,
                  }}
                >
                  <UpcomingSubscriptionCard {...item} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text className="home-empty-state">No upcoming renewals yet.</Text>
          )}
        </View>

        <ListHeading
          title="All Subscriptions"
          // TODO
          onPressViewAll={() => console.log("ALL SUB")}
        />
      </>
    ),
    [theme],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: replace with fubction call for refresh window
    // Simulate fetching data or re-calculating stats,
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <Screen>
      <FlatList
        ListHeaderComponent={renderHeader}
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
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet.</Text>
        }
        contentContainerStyle={{
          paddingBottom: 50 + insets.bottom,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primaryOrange}
            colors={[theme.primaryOrange]}
          />
        }
      />
    </Screen>
  );
}
