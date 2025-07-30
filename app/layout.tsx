import React from 'react';
import type { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';
import {Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getCurrentUser } from './(auth)/_nextjs/currentUser';
import { SessionProvider } from './components/sessionProvider';
import { SessionData } from '@/types/session';
import { QueryProvider } from '@/providers/query-provider';

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
            {children}
          </SessionProvider>
	   </QueryProvider>
      </body>
    </html>
  );
}
