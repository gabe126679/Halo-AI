import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Halo AI - AI that answers. Revenue that follows.',
  description: 'Voice agents, automations, and custom software—built for real businesses. Capture leads, qualify prospects, and integrate with your stack.',
  keywords: 'AI voice agents, lead capture, CRM integration, business automation',
  openGraph: {
    title: 'Halo AI - AI that answers. Revenue that follows.',
    description: 'Voice agents, automations, and custom software—built for real businesses.',
    type: 'website',
    url: 'https://halo.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halo AI - AI that answers. Revenue that follows.',
    description: 'Voice agents, automations, and custom software—built for real businesses.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}