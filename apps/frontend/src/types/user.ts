export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  gender: Gender;
  age: number;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  fullName: string;
  gender: Gender;
  age: number;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}
