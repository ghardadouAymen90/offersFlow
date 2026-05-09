import { fetchOffers } from './offers';
import * as authCookieModule from '@/lib/authCookie';
import * as apiClientModule from '@/lib/apiClient';

jest.mock('@/lib/authCookie');
jest.mock('@/lib/apiClient');

describe('Fetch Offers Action', () => {
  const mockGetAuthHeader = authCookieModule.getAuthHeader as jest.MockedFunction<typeof authCookieModule.getAuthHeader>;
  const mockApiClient = apiClientModule.apiClient as jest.Mocked<typeof apiClientModule.apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch offers with auth header', async () => {
    const mockOffers = [
      {
        id: 'offer-1',
        title: 'Basic Plan',
        description: 'Basic plan description',
        price: 10,
        data: '10GB',
        minutes: 'Unlimited',
        texts: 'Unlimited',
        advantages: ['Advantage 1'],
        isForFirstSubscription: true,
        isForReSubscription: true,
        isForSwitch: true,
        createdAt: new Date(),
      },
      {
        id: 'offer-2',
        title: 'Premium Plan',
        description: 'Premium plan description',
        price: 20,
        data: '20GB',
        minutes: 'Unlimited',
        texts: 'Unlimited',
        advantages: ['Advantage 1', 'Advantage 2'],
        isForFirstSubscription: true,
        isForReSubscription: true,
        isForSwitch: true,
        createdAt: new Date(),
      },
    ];

    mockGetAuthHeader.mockResolvedValue({
      Authorization: 'Bearer jwt-token-123',
    });
    mockApiClient.get = jest.fn().mockResolvedValue(mockOffers);

    const result = await fetchOffers();

    expect(result).toEqual(mockOffers);
    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/offers',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-token-123',
        }),
      })
    );
  });

  it('should return empty array on API error', async () => {
    mockGetAuthHeader.mockResolvedValue({
      Authorization: 'Bearer jwt-token-123',
    });
    mockApiClient.get = jest.fn().mockRejectedValue(new Error('API Error'));

    const result = await fetchOffers();

    expect(result).toEqual([]);
  });

  it('should return empty array on network error', async () => {
    mockGetAuthHeader.mockResolvedValue({
      Authorization: 'Bearer jwt-token-123',
    });
    mockApiClient.get = jest.fn().mockRejectedValue(new Error('Network error'));

    const result = await fetchOffers();

    expect(result).toEqual([]);
  });
});
