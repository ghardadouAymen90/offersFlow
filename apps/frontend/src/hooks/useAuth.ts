'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';
import { getCurrentUser } from '@/app/actions/auth/me';
import { logout as logoutAction } from '@/app/actions/auth/logout';

interface UseAuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const user = await getCurrentUser();

        if (!user) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
          return;
        }

        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } catch (error) {
        console.error('Auth fetch error:', error);
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchUser();
  }, []);

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await getCurrentUser();

      if (!user) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        return;
      }

      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      console.error('Auth fetch error:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAction();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  }, []);

  return {
    ...state,
    refetch,
    logout,
  };
}
