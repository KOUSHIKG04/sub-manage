import CreateSubscriptionModal from "@/src/components/CreateSubscriptionModal";
import ListHeading from "@/src/components/ListHeading";
import Screen from "@/src/components/Screen";
import SubscriptionCard from "@/src/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/src/components/UpCommingSub";
import {
  HOME_BALANCE,
  UPCOMING_SUBSCRIPTIONS,
} from "@/src/constants/data";
import { formatCurrency } from "@/src/lib/utils";
import { useTheme } from "@/src/theme/useTheme";
import { useSubscriptionStore } from "@/src/stores/subscription-store";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";

export default function Home() {
  const { theme } = useTheme();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const addSubscription = useSubscriptionStore(
    (state) => state.addSubscription,
  );
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useUser();

  const insets = useSafeAreaInsets();

  const handleSubscriptionCreated = useCallback(
    (newSubscription: Subscription) => {
      addSubscription(newSubscription);
    },
    [addSubscription],
  );

  const ItemSeparator = () => <View className="h-4" />;

  const renderHeader = useCallback(
    () => (
      <>
        <View className="home-header">
          <View className="home-user">
            {user?.imageUrl && (
              <Image
                source={{ uri: user.imageUrl }}
                className="home-avatar"
                style={{ borderColor: theme.accent }}
              />
            )}
            <Text className="home-user-name">{user?.fullName || "User"}</Text>
          </View>

          <Pressable
            onPress={() => setModalVisible(true)}
            hitSlop={8}
            className="w-10 h-10 rounded-full items-center justify-center p-2"
            style={{
              backgroundColor: theme.surfaceFill,
              borderWidth: 0.7,
              borderColor: theme.stroke,
            }}
          >
            <Ionicons name="add" size={20} color={theme.text} />
          </Pressable>
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
    try {
      // TODO: replace with function call for refresh window
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Screen>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={subscriptions}
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
      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubscriptionCreated={handleSubscriptionCreated}
      />
    </Screen>
  );
}
