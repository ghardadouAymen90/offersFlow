import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // let it pass from a cross domain get
  maxAge: 24 * 60 * 60, // 24 hours
};

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getAuthCookie();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}
