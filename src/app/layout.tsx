import type { Metadata } from 'next';
import { Fraunces, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { MarketplaceProvider } from '@/components/marketplace-provider';
import CompareTray from '@/components/compare-tray';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BarterHub | Classifieds for books, gear, and true barter',
  description:
    'Buy, sell, and swap second-hand books, textbooks, and tech. Cash offers, item-for-item barter, saved searches, and verified sellers.',
  keywords: ['classifieds', 'olx', 'book exchange', 'barter', 'second hand marketplace'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${display.variable} ${sans.variable} font-sans flex flex-col min-h-full bg-paper text-ink antialiased`}>
        <MarketplaceProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareTray />
        </MarketplaceProvider>
      </body>
    </html>
  );
}
