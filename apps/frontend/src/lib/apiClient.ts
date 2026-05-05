import { ApiErrorResponse } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiOptions extends RequestInit {
  includeCredentials?: boolean;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw new ApiError(
      response.status,
      errorData.message || 'An error occurred',
      errorData.error
    );
  }

  return data as T;
}

export const apiClient = {
  async get<T>(
    endpoint: string,
    options?: ApiOptions
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: options?.includeCredentials ? 'include' : 'omit',
      ...options,
    });

    return handleResponse<T>(response);
  },

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiOptions
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: options?.includeCredentials ? 'include' : 'omit',
      ...options,
    });

    return handleResponse<T>(response);
  },

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiOptions
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: options?.includeCredentials ? 'include' : 'omit',
      ...options,
    });

    return handleResponse<T>(response);
  },

  async delete<T>(
    endpoint: string,
    options?: ApiOptions
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      credentials: options?.includeCredentials ? 'include' : 'omit',
      ...options,
    });

    return handleResponse<T>(response);
  },
};
