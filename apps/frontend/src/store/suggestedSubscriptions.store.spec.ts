import { useSuggestedSubscriptionStore } from './suggestedSubscriptions.store';

describe('Suggested Subscription Store', () => {
  beforeEach(() => {
    useSuggestedSubscriptionStore.setState({
      suggestedSubscriptions: [],
    });
  });

  it('should initialize with empty array', () => {
    const store = useSuggestedSubscriptionStore.getState();
    expect(store.suggestedSubscriptions).toEqual([]);
  });

  it('should set suggested subscriptions', () => {
    const mockSubscriptions = [
      {
        id: 'sub-1',
        userId: 'user-1',
        offerId: 'offer-1',
        status: 'ACTIVE' as const,
        startedAt: new Date(),
        endedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        cancellationRequestedAt: undefined,
        gracePeriodEndAt: undefined,
        soldPrice: 20,
      },
      {
        id: 'sub-2',
        userId: 'user-1',
        offerId: 'offer-2',
        status: 'ACTIVE' as const,
        startedAt: new Date(),
        endedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        cancellationRequestedAt: undefined,
        gracePeriodEndAt: undefined,
        soldPrice: 25,
      },
    ];

    useSuggestedSubscriptionStore.getState().setSuggestedSubscriptions(mockSubscriptions);

    const store = useSuggestedSubscriptionStore.getState();
    expect(store.suggestedSubscriptions).toHaveLength(2);
    expect(store.suggestedSubscriptions[0].id).toBe('sub-1');
    expect(store.suggestedSubscriptions[1].id).toBe('sub-2');
  });

  it('should clear suggested subscriptions', () => {
    const mockSubscriptions = [{ id: 'sub-1' } as any];

    useSuggestedSubscriptionStore.getState().setSuggestedSubscriptions(mockSubscriptions);
    let store = useSuggestedSubscriptionStore.getState();
    expect(store.suggestedSubscriptions).toHaveLength(1);

    useSuggestedSubscriptionStore.getState().clearSuggestedSubscriptions();
    store = useSuggestedSubscriptionStore.getState();
    expect(store.suggestedSubscriptions).toEqual([]);
  });

  it('should replace subscriptions on new set', () => {
    const subs1 = [{ id: 'sub-1' } as any];
    useSuggestedSubscriptionStore.getState().setSuggestedSubscriptions(subs1);
    let store = useSuggestedSubscriptionStore.getState();
    expect(store.suggestedSubscriptions).toHaveLength(1);

    const subs2 = [{ id: 'sub-2' }, { id: 'sub-3' }] as any;
    useSuggestedSubscriptionStore.getState().setSuggestedSubscriptions(subs2);
    store = useSuggestedSubscriptionStore.getState();
    expect(store.suggestedSubscriptions).toHaveLength(2);
    expect(store.suggestedSubscriptions[0].id).toBe('sub-2');
  });
});
