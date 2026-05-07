'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentSubscription, cancelSubscription } from '@/app/actions/subscriptions';
import { logout as logoutAction } from '@/app/actions/auth/logout';
import { useSubscriptionStore } from '@/store/subscription.store';

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, refetch } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentSubscription, setCurrentSubscription, clearCurrentSubscription } =
    useSubscriptionStore();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (isAuthenticated) {
        const subscription = await getCurrentSubscription();
        setCurrentSubscription(subscription);
      }
    };

    fetchSubscription();
  }, [isAuthenticated, anchorEl, setCurrentSubscription]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    await logoutAction();
    await refetch();
    router.push('/login');
  };

  const handleUnsubscribe = async () => {
    handleMenuClose();
    try {
      await cancelSubscription();
      clearCurrentSubscription();
      await refetch();
      router.refresh();
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => router.push('/dashboard')}
        >
          OffersFlow
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Link href="/dashboard" passHref legacyBehavior>
            <Button color="inherit" sx={{ textTransform: 'none' }}>
              Dashboard
            </Button>
          </Link>

          {!currentSubscription && (
            <Link href="/offers" passHref legacyBehavior>
              <Button
                color="inherit"
                sx={{
                  textTransform: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              >
                Subscribe
              </Button>
            </Link>
          )}

          {currentSubscription && (
            <>
              <Link href="/offers" passHref legacyBehavior>
                <Button
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                  }}
                >
                  Change Offer
                </Button>
              </Link>
            </>
          )}

          <Box>
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircleIcon />}
              sx={{ textTransform: 'none' }}
            >
              {user?.fullName?.split(' ')[0] || 'Menu'}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  router.push('/profile');
                }}
              >
                My Profile
              </MenuItem>
              {currentSubscription && (
                <MenuItem onClick={handleUnsubscribe} sx={{ color: '#d32f2f' }}>
                  Unsubscribe
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
