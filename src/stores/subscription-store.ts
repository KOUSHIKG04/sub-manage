import { HOME_SUBSCRIPTIONS } from "@/src/constants/data";
import { create } from "zustand";

type SubscriptionState = {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  setSubscriptions: (subscriptions: Subscription[]) => void;
};

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) =>
    set((state) => ({
      subscriptions: [subscription, ...state.subscriptions],
    })),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
}));
