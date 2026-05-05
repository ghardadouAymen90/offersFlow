import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';
import { setAuthCookie } from '@/lib/authCookie';
import { registerSchema } from '@/schemas/auth/register';
import { AuthResponse } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      console.error('Validation errors:', errors);
      console.error('Body received:', JSON.stringify(body, null, 2));
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const validatedData = validation.data;
    const { confirmPassword, ...registerData } = validatedData;

    const response = await apiClient.post<AuthResponse>('/auth/register', registerData);

    await setAuthCookie(response.token);

    return NextResponse.json(
      {
        user: response.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';

    if (errorMessage.includes('already exists') || errorMessage.includes('409')) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: errorMessage || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
