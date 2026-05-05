import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';
import { setAuthCookie } from '@/lib/authCookie';
import { loginSchema } from '@/schemas/auth/login';
import { AuthResponse } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const validatedData = validation.data;
    const response = await apiClient.post<AuthResponse>('/auth/login', validatedData);

    await setAuthCookie(response.token);

    const secureDataToSend = {
      user: response.user,
    };
    
    return NextResponse.json(secureDataToSend, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);

    if (error?.name === 'ApiError' && (error?.statusCode === 400 || error?.statusCode === 401)) {
      return NextResponse.json(
        { error: error?.message || 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}
