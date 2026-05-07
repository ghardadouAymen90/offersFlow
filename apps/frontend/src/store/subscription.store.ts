import { create } from 'zustand';
import { Subscription } from '@/app/actions/subscriptions';

interface SubscriptionStore {
  currentSubscription: Subscription | null;
  setCurrentSubscription: (currentSubscription: Subscription | null) => void;
  clearCurrentSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  currentSubscription: null,
  setCurrentSubscription: (subscription) => set({ currentSubscription: subscription }),
  clearCurrentSubscription: () => set({ currentSubscription: null }),
}));
