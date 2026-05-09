import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as meAction from '@/app/actions/auth/me';
import * as logoutAction from '@/app/actions/auth/logout';

jest.mock('@/app/actions/auth/me');
jest.mock('@/app/actions/auth/logout');

describe('useAuth Hook', () => {
  const mockGetCurrentUser = meAction.getCurrentUser as jest.MockedFunction<typeof meAction.getCurrentUser>;
  const mockLogout = logoutAction.logout as jest.MockedFunction<typeof logoutAction.logout>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch user on mount', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      fullName: 'Test User',
      gender: 'MALE',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetCurrentUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle user not found', async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle error during fetch', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('Fetch error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should logout user', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      fullName: 'Test User',
      gender: 'MALE',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetCurrentUser.mockResolvedValue(mockUser);
    mockLogout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    expect(mockLogout).toHaveBeenCalled();
  });

  it('should refetch user', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      fullName: 'Test User',
      gender: 'MALE',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetCurrentUser.mockResolvedValue(mockUser);

    const { result, rerender } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockGetCurrentUser).toHaveBeenCalled();
  });
});
