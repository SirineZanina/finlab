import React from 'react';
import Header from './_nextjs/components/header/header';
import Sidebar from './_nextjs/components/sidebar/sidebar';
import { getCurrentUser } from '../(auth)/_nextjs/currentUser';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	  const user = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  return (
    <main className='flex h-screen w-full'>
      <Sidebar
	  user={user}
	  />
      <div className='flex-1 flex flex-col'>
        <Header />
		  {children}
      </div>
    </main>
  );
}
