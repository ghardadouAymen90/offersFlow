import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from './page';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
  usePathname: () => '/login',
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    logout: jest.fn(),
    refetch: jest.fn(),
  })),
}));

jest.mock('@/app/actions/auth/login', () => ({
  login: jest.fn(),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
  });

  it('should render login page', () => {
    const { container } = render(<LoginPage />);
    expect(container).toBeInTheDocument();
  });

  it('should render heading', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });
});
