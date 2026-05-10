import { logout } from './logout';
import * as authCookieModule from '@/lib/authCookie';

jest.mock('@/lib/authCookie');

describe('Logout Action', () => {
  const mockClearAuthCookie = authCookieModule.clearAuthCookie as jest.MockedFunction<
    typeof authCookieModule.clearAuthCookie
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should clear auth cookie on logout', async () => {
    mockClearAuthCookie.mockResolvedValue(undefined);

    await logout();

    expect(mockClearAuthCookie).toHaveBeenCalled();
  });

  it('should throw error if cookie clearing fails', async () => {
    mockClearAuthCookie.mockRejectedValue(new Error('Clear cookie error'));

    await expect(logout()).rejects.toThrow('Clear cookie error');
  });
});
