import React from 'react';
import type { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';
import {Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Finlens',
  description: 'A modern finance app for managing your personal finances'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={twMerge(plusJakartaSans.variable, 'antialiased')}>
        {children}
      </body>
    </html>
  );
}
