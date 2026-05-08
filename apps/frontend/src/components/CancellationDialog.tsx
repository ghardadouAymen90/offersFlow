import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import { Offer } from '@/types/offer';
import { Subscription } from '@/types/subscription';

interface CancellationDialogProps {
  open: boolean;
  onClose(): void;
  onConfirm(): void;
  isLoading: boolean;
  currentSubscription: Subscription | null;
  currentOffer: Offer | null | undefined;
  suggestedOffers: Offer[];
}

export default function CancellationDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
  currentSubscription,
  currentOffer,
  suggestedOffers,
}: CancellationDialogProps) {
  if (!currentSubscription || !currentOffer) return null;

  const gracePeriodDate = new Date();
  gracePeriodDate.setMonth(gracePeriodDate.getMonth() + 1);

  const discountPercentage = 15;
  const currentDiscountedPrice =
    Math.round(currentOffer.price * (1 - discountPercentage / 100) * 100) / 100;
  const upgradeDiscountPercentage = 20;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ⏸️ Before You Go...
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          We'd hate to see you go! Let us offer you some exclusive discounts:
        </Typography>

        <Card
          sx={{
            mb: 2,
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            border: '1px solid #667eea33',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Stay with {currentOffer.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Special offer just for you
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#667eea',
                    }}
                  >
                    €{currentDiscountedPrice}/month
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'textDisabled',
                    }}
                  >
                    €{currentOffer.price}/month
                  </Typography>
                  <Chip label={`${discountPercentage}% OFF`} size="small" color="primary" />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {suggestedOffers.length > 0 && (
          <div>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 3, mb: 2 }}>
              Or Upgrade and Get Even More Savings:
            </Typography>
            {suggestedOffers.map((offer) => {
              const discountedPrice =
                Math.round(offer.price * (1 - upgradeDiscountPercentage / 100) * 100) / 100;
              return (
                <Card
                  key={offer.id}
                  sx={{
                    mb: 2,
                    background: 'linear-gradient(135deg, #1a8c5c15 0%, #219667 15 100%)',
                    border: '1px solid #1a8c5c33',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                          Upgrade to {offer.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              color: '#1a8c5c',
                            }}
                          >
                            €{discountedPrice}/month
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              color: 'textDisabled',
                            }}
                          >
                            €{offer.price}/month
                          </Typography>
                          <Chip
                            label={`${upgradeDiscountPercentage}% OFF`}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #1a8c5c 0%, #0e4785 100%)',
                              color: 'white',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Divider sx={{ my: 3 }} />
        <Card
          sx={{
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
          }}
        >
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#ff9800' }}>
              Grace Period
            </Typography>
            <Typography variant="body2" color="textSecondary">
              If you proceed, you'll have a 1-month grace period until{' '}
              <strong>{gracePeriodDate.toLocaleDateString()}</strong> to change your mind. Your
              subscription will be fully canceled after this period.
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Keep Exploring
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(135deg, #f77d02 0%, #d62828 100%)',
          }}
        >
          {isLoading ? 'Processing...' : 'Request Cancellation'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
