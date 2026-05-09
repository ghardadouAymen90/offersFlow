import { getCurrentUser } from './me';
import * as authCookieModule from '@/lib/authCookie';
import * as apiClientModule from '@/lib/apiClient';

jest.mock('@/lib/authCookie');
jest.mock('@/lib/apiClient');

describe('Get Current User Action', () => {
  const mockGetAuthHeader = authCookieModule.getAuthHeader as jest.MockedFunction<typeof authCookieModule.getAuthHeader>;
  const mockApiClient = apiClientModule.apiClient as jest.Mocked<typeof apiClientModule.apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get current user when authenticated', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      fullName: 'Test User',
      gender: 'MALE',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetAuthHeader.mockResolvedValue({
      Authorization: 'Bearer jwt-token-123',
    });
    mockApiClient.get = jest.fn().mockResolvedValue(mockUser);

    const result = await getCurrentUser();

    expect(result).toEqual(mockUser);
    expect(mockApiClient.get).toHaveBeenCalledWith(
      '/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-token-123',
        }),
      })
    );
  });

  it('should return null when not authenticated', async () => {
    mockGetAuthHeader.mockResolvedValue({});

    const result = await getCurrentUser();

    expect(result).toBeNull();
    expect(mockApiClient.get).not.toHaveBeenCalled();
  });

  it('should return null on API error', async () => {
    mockGetAuthHeader.mockResolvedValue({
      Authorization: 'Bearer jwt-token-123',
    });
    mockApiClient.get = jest.fn().mockRejectedValue(new Error('API Error'));

    const result = await getCurrentUser();

    expect(result).toBeNull();
  });

  it('should return null when API returns falsy value', async () => {
    mockGetAuthHeader.mockResolvedValue({
      Authorization: 'Bearer jwt-token-123',
    });
    mockApiClient.get = jest.fn().mockResolvedValue(null);

    const result = await getCurrentUser();

    expect(result).toBeNull();
  });
});
