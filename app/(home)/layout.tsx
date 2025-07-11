import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='bg-[#EFFFFC] min-h-screen'>
	  {children}
    </main>
  );
}
