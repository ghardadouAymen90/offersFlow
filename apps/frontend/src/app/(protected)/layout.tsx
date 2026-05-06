'use client';

import { AppBar, Toolbar, Box, Button, Typography, Container, Paper } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, refetch } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
    await refetch();
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography>Redirecting to login...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OffersFlow
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/dashboard" passHref legacyBehavior>
              <Button color="inherit" sx={{ textTransform: 'none' }}>
                Dashboard
              </Button>
            </Link>
            <Link href="/offers" passHref legacyBehavior>
              <Button color="inherit" sx={{ textTransform: 'none' }}>
                Offers
              </Button>
            </Link>
            <Link href="/profile" passHref legacyBehavior>
              <Button color="inherit" sx={{ textTransform: 'none' }}>
                Profile
              </Button>
            </Link>
            <Button color="inherit" onClick={handleLogout} sx={{ textTransform: 'none' }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 12, flexGrow: 1 }}>
        {user && (
          <Paper sx={{ p: 2, mb: 4, background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}>
            <Typography variant="subtitle1">
              Welcome back, <strong>{user.fullName}</strong>!
            </Typography>
          </Paper>
        )}
        {children}
      </Container>
    </Box>
  );
}
