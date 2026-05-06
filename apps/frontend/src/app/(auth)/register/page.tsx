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
import { RegisterPayload } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { register } from '@/app/actions/auth/register';

export default function RegisterPage() {
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

  const handleRegister = async (data: RegisterPayload) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await register(data);
      setSuccessMessage('Account created successfully! Redirecting...');
      await refetch();
    } catch (error) {
      console.error('Registration error:', error);
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
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Join us to manage your phone plans
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <AuthForm
            type="register"
            onSubmit={handleRegister}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link href="/login" passHref legacyBehavior>
                <MuiLink component="a" sx={{ cursor: 'pointer' }}>
                  Sign in
                </MuiLink>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
