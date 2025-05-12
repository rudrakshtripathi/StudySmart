
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/app-providers';
import { AnimatedBackground } from '@/components/layout/animated-background';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StudySmart',
  description: 'AI-Powered Learning Companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} 
        data-ai-hint="app background"
        suppressHydrationWarning={true}
      >
        <AnimatedBackground />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

