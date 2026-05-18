import type { Metadata } from 'next';
import { ThemeRegistry } from '@/lib/ThemeRegistry.tsx';

export const metadata: Metadata = {
  title: 'OffersFlow - Manage Phone Subscriptions',
  description: 'Compare, subscribe, and manage phone subscription plans with personalized offers.',
  // openGraph: to Share on social medias.
  openGraph: {
    title: 'OffersFlow',
    description: 'Manage your phone subscriptions smartly',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
