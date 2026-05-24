'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppBar, Toolbar, Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  getCurrentSubscription,
  requestSuggestedOffers,
  requestCancellation,
} from '@/app/actions/subscriptions';
import { logout as logoutAction } from '@/app/actions/auth/logout';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useSuggestedSubscriptionStore } from '@/store/suggestedSubscriptions.store';
import CancellationDialog from './CancellationDialog';
import { UpgradeSuggestionDialog } from './UpgradeSuggestionDialog';
import { Offer } from '@/types/offer';

const timeForSuggestion = 5_000;

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, refetch } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [requestingCancellation, setRequestingCancellation] = useState(false);
  const [suggestedOffers, setSuggestedOffers] = useState<Offer[]>([]);
  const [availableUpgrade, setAvailableUpgrade] = useState(false);
  const { currentSubscription, setCurrentSubscription } = useSubscriptionStore();

  const { setSuggestedSubscriptions } = useSuggestedSubscriptionStore();
  useEffect(() => {
    const fetchSubscription = async () => {
      if (isAuthenticated) {
        const subscription = await getCurrentSubscription();
        setCurrentSubscription(subscription);
        await fetchSuggestedOffer();
      }
    };

    fetchSubscription();
  }, [isAuthenticated, anchorEl, setCurrentSubscription]);

  useEffect(() => {
    if (!pathname.includes('/dashboard')) return;
    if (!isAuthenticated || !currentSubscription) return;

    const timer = setTimeout(() => {
      fetchSuggestedOffer();
      setDialogOpen(true);
    }, timeForSuggestion);

    return () => clearTimeout(timer);
  }, [isAuthenticated, currentSubscription, pathname]);

  const fetchSuggestedOffer = async () => {
    try {
      const offers = await requestSuggestedOffers();
      setSuggestedSubscriptions(offers);
      if (offers && offers.length > 0) {
        setAvailableUpgrade(true);
        setSuggestedOffers(offers);
      } else {
        setAvailableUpgrade(false);
        setSuggestedOffers([]);
      }
    } catch (err) {
      console.error('Failed to fetch suggested offers:', err);
    }
  };

  const handleChangeOffer = async () => {
    await fetchSuggestedOffer();
    setDialogOpen(true);
  };

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

  const handleRequestCancellation = async () => {
    handleMenuClose();
    setShowCancellationDialog(true);
  };

  const handleConfirmCancellation = async () => {
    try {
      setRequestingCancellation(true);
      await requestCancellation();
      setShowCancellationDialog(false);
      const subscription = await getCurrentSubscription();
      setCurrentSubscription(subscription);
      await fetchSuggestedOffer();
    } catch (error) {
      console.error('Failed to request cancellation:', error);
    } finally {
      setRequestingCancellation(false);
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

          {currentSubscription && availableUpgrade && (
            <>
              <Button
                color="inherit"
                onClick={handleChangeOffer}
                sx={{
                  textTransform: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                }}
              >
                Change Offer
              </Button>
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
                <MenuItem onClick={handleRequestCancellation} sx={{ color: '#d32f2f' }}>
                  Unsubscribe
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>

      <UpgradeSuggestionDialog
        open={dialogOpen && !showCancellationDialog}
        onClose={() => setDialogOpen(false)}
        suggestedOffers={suggestedOffers}
        currentOffer={currentSubscription?.offer}
      />

      <CancellationDialog
        open={showCancellationDialog}
        onClose={() => setShowCancellationDialog(false)}
        onConfirm={handleConfirmCancellation}
        isLoading={requestingCancellation}
        currentSubscription={currentSubscription}
        currentOffer={currentSubscription?.offer}
        suggestedOffers={suggestedOffers}
      />
    </AppBar>
  );
}
