'use server';

import { apiClient } from '@/lib/apiClient';
import { setAuthCookie } from '@/lib/authCookie';
import { loginSchema } from '@/schemas/auth/login';
import { AuthResponse, User } from '@/types/user';

export async function login(credentials: { email: string; password: string }): Promise<User> {
  try {
    const validation = loginSchema.safeParse(credentials);
    if (!validation.success) {
      throw new Error('Validation failed');
    }

    const validatedData = validation.data;
    const response = await apiClient.post<AuthResponse>('/auth/login', validatedData);

    await setAuthCookie(response.token);

    return response.user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error?.message || 'Failed to login');
  }
}
