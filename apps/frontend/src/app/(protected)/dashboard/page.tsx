'use client';

import { Box, Typography, Paper, Button } from '@mui/material';

import DashboardCard from './_components/dashboardCard';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}
      >
        <DashboardCard
          title="Browse Offers"
          description="Explore available phone subscription plans"
          actionText="View Offers"
          linkTo="/offers"
        />

        <DashboardCard
          title="Your Profile"
          description="Manage your account settings"
          actionText="View Profile"
          linkTo="/profile"
        />
      </Box>
    </Box>
  );
}
