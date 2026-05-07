'use client';

import { Box, Typography, Paper, Button } from '@mui/material';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}
      >
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Browse Offers
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Explore available phone subscription plans
          </Typography>
          <Link href="/offers" passHref legacyBehavior>
            <Button variant="contained" component="a">
              View Offers
            </Button>
          </Link>
        </Paper>

        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Profile
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Manage your account settings
          </Typography>
          <Link href="/profile" passHref legacyBehavior>
            <Button variant="contained" component="a">
              View Profile
            </Button>
          </Link>
        </Paper>
      </Box>
    </Box>
  );
}
