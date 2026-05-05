import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/apiClient';
import { getAuthHeader } from '@/lib/authCookie';
import { User } from '@/types/user';

export async function GET(request: NextRequest) {
  try {
    const headers = await getAuthHeader();

    if (!headers.Authorization) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await apiClient.get<User>('/auth/me', {
      headers,
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);

    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
}
