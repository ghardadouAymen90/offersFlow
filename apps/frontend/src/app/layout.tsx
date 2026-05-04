import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OffersFlow',
  description: 'Frontend for OffersFlow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
