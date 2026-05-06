'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { fetchOffers, Offer } from '@/app/actions/offers';
import { getCurrentSubscription, Subscription } from '@/app/actions/subscriptions';

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const offersData = await fetchOffers();
        if (offersData.length === 0) {
          setError('No offers available at the moment');
        } else {
          setOffers(offersData);
        }

        const subscription = await getCurrentSubscription();
        if (subscription) {
          console.log('Current subscription =>', subscription);
          setActiveSubscription(subscription);
        }
      } catch (err) {
        setError('Failed to load offers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
          const isActive = activeSubscription?.offerId === offer.id;
          return (
            <Box key={offer.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isActive ? '2px solid #667eea' : 'none',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 0 20px rgba(102, 126, 234, 0.3)' : undefined,
                }}
              >
                {isActive && (
                  <Chip
                    label="Active Plan"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {offer.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {offer.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea', mb: 2 }}>
                      €{offer.price}/month
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2">
                        <strong>Minutes:</strong> {offer.minutes}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Texts:</strong> {offer.texts}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Data:</strong> {offer.data}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={isActive}
                    onClick={() => router.push(`/subscribe?offerId=${offer.id}`)}
                    sx={{
                      background: isActive
                        ? '#ccc'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      cursor: isActive ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isActive ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </CardActions>
              </Card>
            </Box>
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
    </Box>
  );
}
