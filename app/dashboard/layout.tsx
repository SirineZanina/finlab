import React from 'react';
import Header from './_nextjs/components/header/header';
import Sidebar from './_nextjs/components/sidebar/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='flex h-screen w-full'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Header />
		  {children}
      </div>
    </main>
  );
}
