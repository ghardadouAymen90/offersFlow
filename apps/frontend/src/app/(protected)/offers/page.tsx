'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button, Alert, Snackbar, CircularProgress } from '@mui/material';
import { fetchOffers } from '@/app/actions/offers';
import {
  getCurrentSubscription,
  requestSuggestedOffers,
  quickChangeSubscription,
} from '@/app/actions/subscriptions';
import { useSubscriptionStore } from '@/store/subscription.store';
import { useSuggestedSubscriptionStore } from '@/store/suggestedSubscriptions.store';
import { Offer } from '@/types/offer';
import OfferCard from './_components/OfferCard';

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [changingOfferId, setChangingOfferId] = useState<string | null>(null);
  const { currentSubscription, setCurrentSubscription } = useSubscriptionStore();
  const { suggestedSubscriptions, setSuggestedSubscriptions } = useSuggestedSubscriptionStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const offersData = await fetchOffers();
        if (!offersData.length) {
          setError('No offers available at the moment');
        } else {
          setOffers(offersData);
        }

        const subscription = await getCurrentSubscription();
        if (subscription) {
          setCurrentSubscription(subscription);
          const suggested = await requestSuggestedOffers();
          setSuggestedSubscriptions(suggested ?? []);
        }
      } catch (err) {
        setError('Failed to load offers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setCurrentSubscription]);

  const handleUpgradeOffer = async (offer: Offer) => {
    try {
      setChangingOfferId(offer.id);
      setError(null);
      await quickChangeSubscription(offer.id);
      setSuccessMessage(`Successfully upgraded to ${offer.title}!`);
      const subscription = await getCurrentSubscription();
      if (subscription) {
        setCurrentSubscription(subscription);
        const suggested = await requestSuggestedOffers();
        setSuggestedSubscriptions(suggested || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade plan');
      console.error(err);
    } finally {
      setChangingOfferId(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Available Offers
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Choose the perfect plan for your needs
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
        }}
      >
        {offers.map((offer) => {
          const isActive = currentSubscription?.offerId === offer.id;
          const isUpgradeAvailable = suggestedSubscriptions.some((o) => o.id === offer.id);
          const isUnavailable = !isActive && !!currentSubscription && !isUpgradeAvailable;
          const canSubscribe = !currentSubscription || isUpgradeAvailable;
          return (
            <OfferCard
              key={offer.id}
              offer={offer}
              isActive={isActive}
              isUpgradeAvailable={isUpgradeAvailable}
              isUnavailable={isUnavailable}
              canSubscribe={canSubscribe}
              changingOfferId={changingOfferId}
              currentSubscription={currentSubscription}
              onUpgradeOffer={handleUpgradeOffer}
              onSubscribe={(offerId) => router.push(`/subscribe?offerId=${offerId}`)}
            />
          );
        })}
      </Box>

      <Paper
        sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)' }}
      >
        <Typography variant="body2" color="textSecondary">
          💡 <strong>Tip:</strong> You can change your plan anytime without any penalty. Start with
          a plan and upgrade whenever you need.
        </Typography>
      </Paper>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="text" onClick={() => router.push('/dashboard')}>
          ← Back to Dashbord
        </Button>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
