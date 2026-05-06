'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  validatePhoneNumber,
  validateCardNumber,
  validateAddress,
} from '@/lib/validators/paymentValidator';
import { createSubscription } from '@/app/actions/subscriptions';

interface PaymentFormProps {
  offerId: string;
  offerTitle: string;
  offerPrice: number;
  userEmail: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({
  offerId,
  offerTitle,
  offerPrice,
  userEmail,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    email: userEmail,
    address: '',
    phoneNumber: '',
    cardNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '').slice(0, 19);
    setFormData((prev) => ({
      ...prev,
      cardNumber: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateAddress(formData.address)) {
      setErrorMessage('Please enter a valid address (at least 5 characters)');
      setIsLoading(false);
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setErrorMessage('Please enter a valid phone number (10-15 digits)');
      setIsLoading(false);
      return;
    }

    if (!validateCardNumber(formData.cardNumber)) {
      setErrorMessage('Please enter a valid card number (13-19 digits)');
      setIsLoading(false);
      return;
    }

    try {
      const result = await createSubscription({
        offerId,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        cardNumber: formData.cardNumber,
      });

      setSuccessMessage(
        `Successfully subscribed to ${offerTitle}! Your subscription is now active.`
      );
      onSuccess();

      setFormData({
        email: userEmail,
        address: '',
        phoneNumber: '',
        cardNumber: '',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {offerTitle}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Monthly Price: €{offerPrice}/month
          </Typography>
          <Typography variant="body2">
            Complete your subscription by entering your payment information below.
          </Typography>
        </CardContent>
      </Card>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <TextField
          label="Email"
          type="email"
          value={formData.email}
          disabled
          fullWidth
          helperText="Auto-filled from your account"
        />

        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main Street, City, Country"
          fullWidth
          required
          disabled={isLoading}
        />

        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          fullWidth
          required
          disabled={isLoading}
          error={!!formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)}
          helperText="10-15 digits"
        />

        <TextField
          label="Credit Card Number"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          fullWidth
          required
          disabled={isLoading}
          error={!!formData.cardNumber && !validateCardNumber(formData.cardNumber)}
          helperText="13-19 digit card number (no spaces required)"
          type="text"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            mt: 2,
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Processing...
            </div>
          ) : (
            `Subscribe to ${offerTitle} - €${offerPrice}/month`
          )}
        </Button>
      </Box>
    </Box>
  );
}
