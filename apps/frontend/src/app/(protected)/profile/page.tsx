'use client';

import { Box, Typography, Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, logout, refetch } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || 'MALE',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: string }>) => {
    const { name, value } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      // TODO: Implement profile update API endpoint
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    await refetch();
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Your Profile
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        {!isEditing ? (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 3, mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Full Name:
              </Typography>
              <Typography variant="body2">{user?.fullName}</Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Email:
              </Typography>
              <Typography variant="body2">{user?.email}</Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Age:
              </Typography>
              <Typography variant="body2">{user?.age}</Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Gender:
              </Typography>
              <Typography variant="body2">
                {user?.gender === 'MALE' ? 'Male' : user?.gender === 'FEMALE' ? 'Female' : 'Other'}
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Member Since:
              </Typography>
              <Typography variant="body2">
                {user && new Date(user.createdAt).toLocaleDateString()}
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Last Updated:
              </Typography>
              <Typography variant="body2">
                {user && new Date(user.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              fullWidth
              disabled
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              disabled
            />

            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select name="gender" value={formData.gender} onChange={handleInputChange as any} label="Gender">
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info">
              Note: Email and full name cannot be changed for security reasons.
            </Alert>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user?.fullName || '',
                    email: user?.email || '',
                    age: user?.age || '',
                    gender: user?.gender || 'MALE',
                  });
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
