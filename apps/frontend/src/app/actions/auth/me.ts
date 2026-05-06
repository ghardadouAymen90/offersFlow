'use server';

import { apiClient } from '@/lib/apiClient';
import { getAuthHeader } from '@/lib/authCookie';
import { User } from '@/types/user';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const headers = await getAuthHeader();

    if (!headers.Authorization) {
      return null;
    }

    const user = await apiClient.get<User>('/auth/me', {
      headers,
    });

    return user || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
