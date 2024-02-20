import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

import QuestionPoolProvider from '@/lib/context/QuestionPoolProvider';

export const metadata: Metadata = {
  title: 'GFN - JavaScript Fragenkatalog',
  description:
    'Alle Fragen zu JavaScript für die Webmaster Europe Zertifizierung',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <QuestionPoolProvider>{children}</QuestionPoolProvider>
      </body>
    </html>
  );
}
