'use server';

import { clearAuthCookie } from '@/lib/authCookie';

export async function logout(): Promise<void> {
  try {
    await clearAuthCookie();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
