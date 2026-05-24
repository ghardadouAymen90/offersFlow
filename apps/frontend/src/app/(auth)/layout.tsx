import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OffersFlow - Manage Phone Subscriptions',
  description: 'Sign in or create an account to manage your phone subscription plans.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
