import type { Metadata } from 'next';
import { ThemeRegistry } from '@/lib/ThemeRegistry.tsx';

export const metadata: Metadata = {
  title: 'OffersFlow',
  description: 'Frontend for OffersFlow'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
