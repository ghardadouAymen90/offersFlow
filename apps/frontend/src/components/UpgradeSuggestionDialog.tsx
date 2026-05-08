'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Snackbar,
} from '@mui/material';
import { Offer } from '@/types/offer';
import { quickChangeSubscription } from '@/app/actions/subscriptions';

type OnCloseCallback = () => void;

interface UpgradeSuggestionDialogProps {
  open: boolean;
  onClose: OnCloseCallback;
  suggestedOffers: Offer[];
  currentOffer?: Offer;
}

export function UpgradeSuggestionDialog({
  open,
  onClose,
  suggestedOffers,
  currentOffer,
}: UpgradeSuggestionDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleClose = useCallback(() => {
    setError(null);
    onClose();
  }, [onClose]);

  const handleSelectOffer = useCallback(
    async (offer: Offer) => {
      if (!currentOffer) return;

      try {
        setIsChanging(true);
        setError(null);
        await quickChangeSubscription(offer.id);
        setSuccessMessage(`Successfully upgraded to ${offer.title}!`);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } catch (err: any) {
        setError(err.message || 'Failed to change subscription');
        console.error(err);
      } finally {
        setIsChanging(false);
      }
    },
    [currentOffer, handleClose]
  );

  if (!suggestedOffers || !suggestedOffers.length) return null;

  const recommendedOffer = suggestedOffers[0];
  const otherOffers = suggestedOffers.slice(1);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
        Available Upgrade Plans
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Upgrade your plan to get more minutes, texts, and data. Select any plan to continue.
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Recommended Plan
        </Typography>
        <OfferCard
          offer={recommendedOffer}
          currentOffer={currentOffer}
          isRecommended={true}
          onSelect={() => handleSelectOffer(recommendedOffer)}
          isChanging={isChanging}
        />

        {!!otherOffers.length && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 2, mt: 4, fontWeight: 'bold' }}>
              Other Plans That Might interrest you:
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
            >
              {otherOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  currentOffer={currentOffer}
                  onSelect={() => handleSelectOffer(offer)}
                  isChanging={isChanging}
                />
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isChanging}>
          Close
        </Button>
      </DialogActions>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Dialog>
  );
}

interface OfferCardProps {
  offer: Offer;
  currentOffer?: Offer;
  isRecommended?: boolean;
  onSelect(): void;
  isChanging: boolean;
}

function OfferCard({
  offer,
  currentOffer,
  isRecommended = false,
  onSelect,
  isChanging,
}: OfferCardProps) {
  const priceDifference = offer.price - (currentOffer?.price || 0);
  const percentageIncrease = ((priceDifference / (currentOffer?.price || 1)) * 100).toFixed(0);

  return (
    <Card
      sx={{
        background: isRecommended
          ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
          : 'linear-gradient(135deg, #f5f5f515 0%, #e0e0e015 100%)',
        border: isRecommended ? '2px solid #667eea' : '1px solid #e0e0e0',
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {offer.title}
          </Typography>
          {isRecommended && (
            <Chip
              label="Recommended"
              color="primary"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            />
          )}
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {offer.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 2,
            mb: 3,
            pb: 2,
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <Box>
            <Typography variant="body2" color="textSecondary">
              Price
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              €{offer.price}/month
            </Typography>
          </Box>

          {currentOffer && (
            <Box>
              <Typography variant="body2" color="textSecondary">
                Current
              </Typography>
              <Typography
                variant="body2"
                sx={{ textDecoration: 'line-through', color: 'textSecondary' }}
              >
                €{currentOffer.price}/month
              </Typography>
            </Box>
          )}

          <Box sx={{ ml: 'auto' }}>
            <Chip
              label={`+€${priceDifference}/mo`}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            />
          </Box>
        </Box>

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
      </CardContent>

      <Button
        onClick={onSelect}
        disabled={isChanging}
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          background: isRecommended
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'rgba(102, 126, 234, 0.6)',
        }}
      >
        {isChanging ? <CircularProgress size={20} /> : 'Select Plan'}
      </Button>
    </Card>
  );
}
