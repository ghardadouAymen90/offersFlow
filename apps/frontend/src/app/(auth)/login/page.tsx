'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Box,
  Paper,
  Typography,
  Alert,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import { AuthForm } from '@/components/AuthForm';
import { LoginPayload } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { login } from '@/app/actions/auth/login';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, refetch } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (data: LoginPayload) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await login(data);
      setSuccessMessage('Login successful! Redirecting...');
      await refetch();
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign in to manage your phone plans
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <AuthForm
            type="login"
            onSubmit={handleLogin}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Link href="/register" passHref legacyBehavior>
                <MuiLink component="a" sx={{ cursor: 'pointer' }}>
                  Sign up
                </MuiLink>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
