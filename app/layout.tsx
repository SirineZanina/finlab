import React from 'react';
import type { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';
import {Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getCurrentUser } from '@/app/(auth)/_nextjs/currentUser';
import { SessionProvider } from '@/app/components/sessionProvider';
import { SessionData } from '@/types/client/session';
import { QueryProvider } from '@/providers/query-provider';
import { SheetProvider } from '@/providers/sheet-provider';
import { Toaster } from '@/components/ui/sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Finlab',
  description: 'A modern finance app for managing your personal finances'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const fullUser = await getCurrentUser({ withFullUser: true });

  const sessionData: SessionData = {
    user: fullUser,
    loading: false,
  };
  return (
    <html lang="en">
      <body className={twMerge(plusJakartaSans.variable, 'antialiased')}>
        <QueryProvider>
		 <SessionProvider value={sessionData}>
            <SheetProvider />
            <Toaster />
            {children}
          </SessionProvider>
	   </QueryProvider>
      </body>
    </html>
  );
}
