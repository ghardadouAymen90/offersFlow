'use client';

import { Box, Card, CardContent, CardActions, Button, Chip, Typography, CircularProgress } from '@mui/material';
import { Offer } from '@/types/offer';
import { Subscription } from '@/types/subscription';

interface OfferCardProps {
  offer: Offer;
  isActive: boolean;
  isUpgradeAvailable: boolean;
  isUnavailable: boolean;
  canSubscribe: boolean;
  changingOfferId: string | null;
  currentSubscription: Subscription | null;
  onUpgradeOffer: (offer: Offer) => Promise<void>;
  onSubscribe: (offerId: string) => void;
}

export default function OfferCard({
  offer,
  isActive,
  isUpgradeAvailable,
  isUnavailable,
  canSubscribe,
  changingOfferId,
  currentSubscription,
  onUpgradeOffer,
  onSubscribe,
}: OfferCardProps) {
  return (
    <Box key={offer.id}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: isActive
            ? '2px solid #667eea'
            : isUpgradeAvailable
            ? '2px solid #1a8c5c'
            : isUnavailable
            ? '2px solid #3f02c333'
            : 'none',
          position: 'relative',
          transition: 'all 0.3s ease',
          boxShadow: isActive
            ? '0 0 20px rgba(102, 126, 234, 0.3)'
            : isUpgradeAvailable
            ? '0 0 20px rgba(76, 175, 79, 0.82)'
            : isUnavailable
            ? '0 0 20px rgba(255, 152, 0, 0.2)'
            : undefined,
          opacity: isUnavailable ? 0.7 : 1,
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
        {isUpgradeAvailable && !isActive && (
          <Chip
            label="Available Upgrade"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'linear-gradient(135deg, #219667 0%, #0e4785 100%)',
              color: 'white',
            }}
          />
        )}
        {!currentSubscription && !isActive && (
          <Chip
            label="Available to Subscribe"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          />
        )}
        {isUnavailable && (
          <Chip
            label="Unavailable"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'linear-gradient(135deg, #f77d02 0%, #caba05 100%)',
              color: 'white',
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
          {isUnavailable ? (
            <Button
              variant="contained"
              fullWidth
              disabled
              sx={{
                cursor: 'not-allowed',
              }}
            >
              Not Available
            </Button>
          ) : !isActive && isUpgradeAvailable ? (
            <Button
              variant="contained"
              fullWidth
              disabled={changingOfferId === offer.id}
              onClick={() => onUpgradeOffer(offer)}
              sx={{
                background: 'linear-gradient(135deg, #479777 0%, #0e4785 100%)',
              }}
            >
              {changingOfferId === offer.id ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : currentSubscription ? (
                `Upgrade to ${offer.title}`
              ) : (
                `Subscribe to ${offer.title}`
              )}
            </Button>
          ) : canSubscribe ? (
            <Button
              variant="contained"
              fullWidth
              onClick={() => onSubscribe(offer.id)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                cursor: 'pointer',
              }}
            >
              Subscribe
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              disabled={true}
              sx={{
                background: '#ccc',
                cursor: 'not-allowed',
              }}
            >
              {isActive ? 'Current Plan' : 'Not Available'}
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
}
