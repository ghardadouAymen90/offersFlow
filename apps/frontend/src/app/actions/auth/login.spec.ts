import { login } from './login';
import * as authCookieModule from '@/lib/authCookie';
import * as apiClientModule from '@/lib/apiClient';

jest.mock('@/lib/authCookie');
jest.mock('@/lib/apiClient');

describe('Login Action', () => {
  const mockSetAuthCookie = authCookieModule.setAuthCookie as jest.MockedFunction<typeof authCookieModule.setAuthCookie>;
  const mockApiClient = apiClientModule.apiClient as jest.Mocked<typeof apiClientModule.apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login user with valid credentials', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      fullName: 'Test User',
      gender: 'MALE',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockResponse = {
      token: 'jwt-token-123',
      user: mockUser,
    };

    mockApiClient.post = jest.fn().mockResolvedValue(mockResponse);
    mockSetAuthCookie.mockResolvedValue(undefined);

    const result = await login({
      email: 'test@example.com',
      password: 'Test@1234',
    });

    expect(result).toEqual(mockUser);
    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/auth/login',
      expect.objectContaining({
        email: 'test@example.com',
        password: 'Test@1234',
      })
    );
    expect(mockSetAuthCookie).toHaveBeenCalledWith('jwt-token-123');
  });

  it('should throw error on invalid email', async () => {
    await expect(
      login({
        email: 'invalid-email',
        password: 'Test@1234',
      })
    ).rejects.toThrow('Validation failed');
  });

  it('should throw error on missing password', async () => {
    await expect(
      login({
        email: 'test@example.com',
        password: '',
      })
    ).rejects.toThrow();
  });

  it('should handle API errors', async () => {
    mockApiClient.post = jest.fn().mockRejectedValue(new Error('API Error'));

    await expect(
      login({
        email: 'test@example.com',
        password: 'Test@1234',
      })
    ).rejects.toThrow('API Error');
  });
});
