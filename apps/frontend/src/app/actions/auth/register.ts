'use server';

import { apiClient } from '@/lib/apiClient';
import { setAuthCookie } from '@/lib/authCookie';
import { registerSchema } from '@/schemas/auth/register';
import { AuthResponse, User } from '@/types/user';

export async function register(data: {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  age: number;
}): Promise<User> {
  try {
    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      throw new Error('Validation failed');
    }

    const validatedData = validation.data;
    const response = await apiClient.post<AuthResponse>('/auth/register', validatedData);

    await setAuthCookie(response.token);

    return response.user;
  } catch (error: any) {
    console.error('Register error:', error);
    throw new Error(error?.message || 'Failed to register');
  }
}
