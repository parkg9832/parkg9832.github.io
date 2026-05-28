import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './LanguageContext';

export const metadata: Metadata = {
  title: 'MOKDA | Korean Sauce for LATAM',
  description: 'MOKDA brings Korean sauce culture to Latin American tables.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
