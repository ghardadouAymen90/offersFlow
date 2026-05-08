'use client';

import { Typography, Paper, Button } from '@mui/material';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  description: string;
  actionText: string;
  linkTo: string;
}

const DashboardCard = ({ title, description, actionText, linkTo }: DashboardCardProps) => {
  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Link href={linkTo} passHref legacyBehavior>
        <Button variant="contained" component="a">
          {actionText}
        </Button>
      </Link>
    </Paper>
  );
};

export default DashboardCard;
