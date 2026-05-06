'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { PaymentForm } from './_components/PaymentForm';
import { Offer, fetchOffers } from '@/app/actions/offers';

export default function SubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  
  const offerId = searchParams.get('offerId');
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadOffer = async () => {
      if (!offerId) {
        setError('No offer selected');
        setLoading(false);
        return;
      }

      try {
        const offers = await fetchOffers();
        const selectedOffer = offers.find((o) => o.id === offerId);
        
        if (!selectedOffer) {
          setError('Offer not found');
        } else {
          setOffer(selectedOffer);
        }
      } catch (err) {
        setError('Failed to load offer details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [offerId]);

  const handleSubscriptionSuccess = () => {
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  const handleSubscriptionError = (error: string) => {
    console.error('Subscription error:', error);
  };

  if (authLoading || loading) {
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

  if (error) {
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
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/offers')}
            >
              Back to Offers
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (!offer) {
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
        background: 'linear-gradient(135deg, #ffffff 0%, #d7d3fa 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Complete Your Subscription
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Step 2: Payment Information
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* Offer Summary */}
            <Box>
              <Card sx={{ mb: 3, background: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Offer Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {offer.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {offer.description}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Minutes:</strong> {offer.minutes}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Texts:</strong> {offer.texts}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Data:</strong> {offer.data}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      p: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 1,
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      €{offer.price}/month
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Billed monthly
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Payment Form */}
            <Box>
              <PaymentForm
                offerId={offer.id}
                offerTitle={offer.title}
                offerPrice={offer.price}
                userEmail={user?.email || ''}
                onSuccess={handleSubscriptionSuccess}
                onError={handleSubscriptionError}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => router.push('/offers')}
            >
              ← Back to Offers
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
