import CreateSubscriptionModal from "@/src/components/CreateSubscriptionModal";
import Screen from "@/src/components/Screen";
import SubscriptionCard from "@/src/components/SubscriptionCard";
import { useSubscriptionStore } from "@/src/stores/subscription-store";
import { useTheme } from "@/src/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ItemSeparator = () => <View className="h-4" />;

export default function Subscription() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);
  const addSubscription = useSubscriptionStore(
    (state) => state.addSubscription,
  );

  const handleSubscriptionCreated = useCallback(
    (newSubscription: Subscription) => {
      addSubscription(newSubscription);
    },
    [addSubscription],
  );

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return subscriptions;
    }

    return subscriptions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(normalizedQuery) ||
        sub.category?.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery, subscriptions]);

  const listHeader = (
    <View className="mb-6 mt-4">
      <View className="home-header">
        <Text
          className="text-2xl font-sans-bold mb-4"
          style={{ color: theme.text }}
        >
          All Subscriptions
        </Text>

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

      <View
        className="flex-row items-center rounded-[20px] px-4 py-3"
        style={{
          backgroundColor: theme.surfaceFill,
          borderWidth: 0.6,
          borderColor: theme.stroke,
        }}
      >
        <Ionicons name="search" size={20} color={theme.text} className="mr-3" />
        <TextInput
          placeholder="Search subscriptions..."
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 font-sans-regular text-base ml-2"
          style={{ color: theme.text }}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={theme.stroke}
            onPress={() => setSearchQuery("")}
            suppressHighlighting
          />
        )}
      </View>
    </View>
  );

  const noList = (
    <View className="items-center justify-center py-10 mt-10">
      <Ionicons name="search-outline" size={48} color={theme.stroke} />
      <Text
        className="text-lg font-sans-medium mt-4 text-center"
        style={{ color: theme.text }}
      >
        No subscriptions found
      </Text>
      <Text
        className="text-sm font-sans-regular mt-2 text-center"
        style={{ color: theme.text }}
      >
        Try adjusting your search query, please!!
      </Text>
    </View>
  );

  return (
    <Screen className="px-6">
      <FlatList
        ListHeaderComponent={listHeader}
        data={filteredSubscriptions}
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
        ListEmptyComponent={noList}
        contentContainerStyle={{
          paddingBottom: 50 + insets.bottom,
        }}
      />
      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubscriptionCreated={handleSubscriptionCreated}
      />
    </Screen>
  );
}
