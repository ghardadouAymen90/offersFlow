import { ApiErrorResponse } from '@/types/user';
import { ApiError } from './apiError.interface';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiOptions extends RequestInit {
  includeCredentials?: boolean;
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
    throw new ApiError(response.status, errorData.message || 'An error occurred', errorData.error);
  }

  return data as T;
}

async function handleFetch(
  endpoint: string,
  method: 'DELETE' | 'GET' | 'POST' | 'PUT',
  options?: ApiOptions,
  body?: unknown
): Promise<Response> {
  const { headers, ...rest } = { ...(options ?? {}) };
  return fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: options?.includeCredentials ? 'include' : 'omit',
    ...rest,
  });
}

export const apiClient = {
  async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    const response = await handleFetch(endpoint, 'GET', options);
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<T> {
    const response = await handleFetch(endpoint, 'POST', options, body);
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, body?: unknown, options?: ApiOptions): Promise<T> {
    const response = await handleFetch(endpoint, 'PUT', options, body);
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    const response = await handleFetch(endpoint, 'DELETE', options);
    return handleResponse<T>(response);
  },
};
