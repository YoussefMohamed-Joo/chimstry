import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import AppProvider from '@/providers/AppProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticlesBackground from '@/components/shared/Particles';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'كيمستري - منصة تعلم الكيمياء',
  description: 'منصة تعليمية متخصصة في علوم الكيمياء، نقدم محتوى تفاعلي وشامل لطلاب الكيمياء في جميع المراحل التعليمية.',
  openGraph: {
    title: 'كيمستري - منصة تعلم الكيمياء',
    description: 'منصة تعليمية متخصصة في علوم الكيمياء، نقدم محتوى تفاعلي وشامل لطلاب الكيمياء.',
    type: 'website',
    locale: 'ar_EG',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body suppressHydrationWarning className={`${cairo.variable} min-h-full flex flex-col font-cairo antialiased`}>
        <AppProvider>
          <ParticlesBackground />
          <Navbar />
          <main className="flex-1 relative z-10 pt-16">{children}</main>
          <WhatsAppButton />
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
