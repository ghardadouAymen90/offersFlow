import { register } from './register';
import * as authCookieModule from '@/lib/authCookie';
import * as apiClientModule from '@/lib/apiClient';

jest.mock('@/lib/authCookie');
jest.mock('@/lib/apiClient');

describe('Register Action', () => {
  const mockSetAuthCookie = authCookieModule.setAuthCookie as jest.MockedFunction<
    typeof authCookieModule.setAuthCookie
  >;
  const mockApiClient = apiClientModule.apiClient as jest.Mocked<typeof apiClientModule.apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user with valid data', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'newuser@example.com',
      fullName: 'New User',
      gender: 'FEMALE',
      age: 28,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockResponse = {
      token: 'jwt-token-123',
      user: mockUser,
    };

    mockApiClient.post = jest.fn().mockResolvedValue(mockResponse);
    mockSetAuthCookie.mockResolvedValue(undefined);

    const result = await register({
      email: 'newuser@example.com',
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
      fullName: 'New User',
      gender: 'FEMALE',
      age: 28,
    });

    expect(result).toEqual(mockUser);
    expect(mockApiClient.post).toHaveBeenCalledWith(
      '/auth/register',
      expect.objectContaining({
        email: 'newuser@example.com',
        fullName: 'New User',
        gender: 'FEMALE',
        age: 28,
      })
    );
    expect(mockSetAuthCookie).toHaveBeenCalledWith('jwt-token-123');
  });

  it('should throw error on invalid email', async () => {
    await expect(
      register({
        email: 'invalid-email',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        fullName: 'Test User',
        gender: 'MALE',
        age: 25,
      })
    ).rejects.toThrow('Validation failed');
  });

  it('should throw error on age below 18', async () => {
    await expect(
      register({
        email: 'test@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        fullName: 'Test User',
        gender: 'MALE',
        age: 16,
      })
    ).rejects.toThrow();
  });

  it('should throw error on API failure', async () => {
    mockApiClient.post = jest.fn().mockRejectedValue(new Error('API Error'));

    await expect(
      register({
        email: 'test@example.com',
        password: 'Test@1234',
        confirmPassword: 'Test@1234',
        fullName: 'Test User',
        gender: 'MALE',
        age: 25,
      })
    ).rejects.toThrow('API Error');
  });
});
