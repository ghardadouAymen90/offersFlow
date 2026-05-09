import { useSubscriptionStore } from './subscription.store';

describe('Subscription Store', () => {
  beforeEach(() => {
    useSubscriptionStore.setState({
      currentSubscription: null,
    });
  });

  it('should initialize with null subscription', () => {
    const store = useSubscriptionStore.getState();
    expect(store.currentSubscription).toBeNull();
  });

  it('should set current subscription', () => {
    const mockSubscription = {
      id: 'sub-123',
      userId: 'user-123',
      offerId: 'offer-123',
      status: 'ACTIVE' as const,
      startedAt: new Date(),
      endedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      cancellationRequestedAt: null,
      gracePeriodEndAt: null,
      soldPrice: 15,
    };

    useSubscriptionStore.getState().setCurrentSubscription(mockSubscription);

    const updatedStore = useSubscriptionStore.getState();
    expect(updatedStore.currentSubscription).toEqual(mockSubscription);
    expect(updatedStore.currentSubscription?.id).toBe('sub-123');
    expect(updatedStore.currentSubscription?.status).toBe('ACTIVE');
  });

  it('should clear current subscription', () => {
    const mockSubscription = {
      id: 'sub-123',
      userId: 'user-123',
      offerId: 'offer-123',
      status: 'ACTIVE' as const,
      startedAt: new Date(),
      endedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      cancellationRequestedAt: null,
      gracePeriodEndAt: null,
      soldPrice: 15,
    };

    useSubscriptionStore.getState().setCurrentSubscription(mockSubscription);
    const storeAfterSet = useSubscriptionStore.getState();
    expect(storeAfterSet.currentSubscription).not.toBeNull();

    useSubscriptionStore.getState().clearCurrentSubscription();
    const storeAfterClear = useSubscriptionStore.getState();
    expect(storeAfterClear.currentSubscription).toBeNull();
  });

  it('should update subscription multiple times', () => {
    const sub1 = { id: 'sub-1', status: 'ACTIVE' } as any;
    useSubscriptionStore.getState().setCurrentSubscription(sub1);
    let state = useSubscriptionStore.getState();
    expect(state.currentSubscription?.id).toBe('sub-1');

    const sub2 = { id: 'sub-2', status: 'ACTIVE' } as any;
    useSubscriptionStore.getState().setCurrentSubscription(sub2);
    state = useSubscriptionStore.getState();
    expect(state.currentSubscription?.id).toBe('sub-2');
  });
});
