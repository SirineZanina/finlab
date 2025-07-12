import React from 'react';
import type { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';
import {Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { getCurrentUser } from './(auth)/_nextjs/currentUser';
import { SessionProvider } from './components/sessionProvider';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Finlens',
  description: 'A modern finance app for managing your personal finances'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const currentUser = await getCurrentUser({ withFullUser: true});
  return (
    <html lang="en">
      <body className={twMerge(plusJakartaSans.variable, 'antialiased')}>
        <SessionProvider value={currentUser}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
