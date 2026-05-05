'use client';

import { useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';

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
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            setState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              error: null,
            });
            return;
          }
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }

        const user = await response.json();
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
  }, []); // Empty deps: run only once on mount

  const refetch = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
          return;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const user = await response.json();
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
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
