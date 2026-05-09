import {
  getCurrentSubscription,
  createSubscription,
  requestCancellation,
  confirmCancellation,
  requestSuggestedOffers,
  quickChangeSubscription,
} from './subscriptions';
import * as authCookieModule from '@/lib/authCookie';
import * as apiClientModule from '@/lib/apiClient';

jest.mock('@/lib/authCookie');
jest.mock('@/lib/apiClient');

describe('Subscription Actions', () => {
  const mockGetAuthHeader = authCookieModule.getAuthHeader as jest.MockedFunction<typeof authCookieModule.getAuthHeader>;
  const mockApiClient = apiClientModule.apiClient as jest.Mocked<typeof apiClientModule.apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAuthHeader.mockResolvedValue({
      Authorization: 'Bearer jwt-token-123',
    });
  });

  describe('getCurrentSubscription', () => {
    it('should get current subscription', async () => {
      const mockSubscription = {
        id: 'sub-123',
        userId: 'user-123',
        offerId: 'offer-123',
        status: 'ACTIVE',
        startedAt: new Date(),
        endedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        cancellationRequestedAt: null,
        gracePeriodEndAt: null,
        soldPrice: 15,
      };

      mockApiClient.get = jest.fn().mockResolvedValue(mockSubscription);

      const result = await getCurrentSubscription();

      expect(result).toEqual(mockSubscription);
      expect(mockApiClient.get).toHaveBeenCalledWith('/subscriptions/current', expect.any(Object));
    });

    it('should return null when no subscription', async () => {
      mockApiClient.get = jest.fn().mockResolvedValue(null);

      const result = await getCurrentSubscription();

      expect(result).toBeNull();
    });

    it('should return null on API error', async () => {
      mockApiClient.get = jest.fn().mockRejectedValue(new Error('API Error'));

      const result = await getCurrentSubscription();

      expect(result).toBeNull();
    });
  });

  describe('createSubscription', () => {
    it('should create subscription with valid payload', async () => {
      const mockResponse = {
        subscription: {
          id: 'sub-123',
          status: 'ACTIVE',
        },
      };

      const payload = {
        offerId: 'offer-123',
        email: 'test@example.com',
        address: '123 Main St',
        phoneNumber: '+1234567890',
        cardNumber: '4242 4242 4242 4242',
      };

      mockApiClient.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await createSubscription(payload);

      expect(result).toEqual(mockResponse);
      expect(mockApiClient.post).toHaveBeenCalledWith('/subscriptions', payload, expect.any(Object));
    });

    it('should throw error on API failure', async () => {
      const payload = {
        offerId: 'offer-123',
        email: 'test@example.com',
        address: '123 Main St',
        phoneNumber: '+1234567890',
        cardNumber: '4242 4242 4242 4242',
      };

      mockApiClient.post = jest.fn().mockRejectedValue(new Error('Creation failed'));

      await expect(createSubscription(payload)).rejects.toThrow('Creation failed');
    });
  });

  describe('requestCancellation', () => {
    it('should request subscription cancellation', async () => {
      const mockSubscription = {
        id: 'sub-123',
        status: 'ACTIVE',
        cancellationRequestedAt: new Date(),
      };

      mockApiClient.post = jest.fn().mockResolvedValue(mockSubscription);

      const result = await requestCancellation();

      expect(result).toEqual(mockSubscription);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/subscriptions/request-cancellation',
        {},
        expect.any(Object)
      );
    });

    it('should throw error on API failure', async () => {
      mockApiClient.post = jest.fn().mockRejectedValue(new Error('Cancellation failed'));

      await expect(requestCancellation()).rejects.toThrow('Cancellation failed');
    });
  });

  describe('confirmCancellation', () => {
    it('should confirm subscription cancellation', async () => {
      const mockSubscription = {
        id: 'sub-123',
        status: 'CANCELLED',
      };

      mockApiClient.post = jest.fn().mockResolvedValue(mockSubscription);

      const result = await confirmCancellation();

      expect(result).toEqual(mockSubscription);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/subscriptions/confirm-cancellation',
        {},
        expect.any(Object)
      );
    });

    it('should throw error on API failure', async () => {
      mockApiClient.post = jest.fn().mockRejectedValue(new Error('Confirm failed'));

      await expect(confirmCancellation()).rejects.toThrow('Confirm failed');
    });
  });

  describe('requestSuggestedOffers', () => {
    it('should fetch suggested offers', async () => {
      const mockOffers = [
        { id: 'offer-1', title: 'Plan A' },
        { id: 'offer-2', title: 'Plan B' },
      ];

      mockApiClient.get = jest.fn().mockResolvedValue(mockOffers);

      const result = await requestSuggestedOffers();

      expect(result).toEqual(mockOffers);
      expect(mockApiClient.get).toHaveBeenCalledWith('/subscriptions/suggest', expect.any(Object));
    });

    it('should return empty array on error', async () => {
      mockApiClient.get = jest.fn().mockRejectedValue(new Error('API Error'));

      const result = await requestSuggestedOffers();

      expect(result).toEqual([]);
    });
  });

  describe('quickChangeSubscription', () => {
    it('should change subscription to new offer', async () => {
      const mockResponse = {
        subscription: {
          id: 'sub-123',
          offerId: 'offer-456',
        },
      };

      mockApiClient.post = jest.fn().mockResolvedValue(mockResponse);

      const result = await quickChangeSubscription('offer-456');

      expect(result).toEqual(mockResponse);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/subscriptions/change',
        { offerId: 'offer-456' },
        expect.any(Object)
      );
    });

    it('should throw error on API failure', async () => {
      mockApiClient.post = jest.fn().mockRejectedValue(new Error('Change failed'));

      await expect(quickChangeSubscription('offer-456')).rejects.toThrow('Change failed');
    });
  });
});
