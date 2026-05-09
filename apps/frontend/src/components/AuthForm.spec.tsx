import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthForm } from './AuthForm';

describe('AuthForm - Login', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form with submit button', () => {
    render(<AuthForm type="login" onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /sign/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    const errorMsg = 'Invalid credentials';
    render(<AuthForm type="login" onSubmit={mockOnSubmit} errorMessage={errorMsg} />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should disable button while loading', () => {
    render(<AuthForm type="login" onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
  });

  it('should enable button when not loading', () => {
    render(<AuthForm type="login" onSubmit={mockOnSubmit} isLoading={false} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).not.toBeDisabled();
  });

  it('should have error alert when errorMessage is provided', () => {
    const errorMsg = 'Test error message';
    render(<AuthForm type="login" onSubmit={mockOnSubmit} errorMessage={errorMsg} />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });
});

describe('AuthForm - Register', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render register form', () => {
    const { container } = render(<AuthForm type="register" onSubmit={mockOnSubmit} />);

    expect(container).toBeInTheDocument();
  });

  it('should render register-specific fields', () => {
    const { container } = render(<AuthForm type="register" onSubmit={mockOnSubmit} />);

    const ageInput = container.querySelector('input[name="age"]');
    expect(ageInput).toBeInTheDocument();
  });

  it('should display error message on register form', () => {
    const errorMsg = 'Email already exists';
    render(<AuthForm type="register" onSubmit={mockOnSubmit} errorMessage={errorMsg} />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<AuthForm type="register" onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeInTheDocument();
  });
});
