import { Subscription } from '@/types/subscription';
import { create } from 'zustand';

interface SuggestedSubscriptionStore {
  suggestedSubscriptions: Subscription[];
  setSuggestedSubscriptions: (subscriptions: Subscription[]) => void;
  clearSuggestedSubscriptions: () => void;
}

export const useSuggestedSubscriptionStore = create<SuggestedSubscriptionStore>((set) => ({
  suggestedSubscriptions: [],
  setSuggestedSubscriptions: (subscriptions: Subscription[]) =>
    set({ suggestedSubscriptions: subscriptions }),
  clearSuggestedSubscriptions: () => set({ suggestedSubscriptions: [] }),
}));
