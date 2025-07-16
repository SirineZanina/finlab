import React from 'react';
import Header from './_nextjs/components/header/header';
import Sidebar from './_nextjs/components/sidebar/sidebar';
import { getCurrentUser } from '../(auth)/_nextjs/currentUser';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import MobileNavbar from './_nextjs/components/mobileNavbar/mobileNavbar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	  const loggedInUser = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });
  return (
    <main className='flex h-screen w-full'>
      <Sidebar
	  user={loggedInUser}
	  />
	  <div className='flex size-full flex-col'>
        <div className='root-layout'>
          <CompanyLogo hideTextLogo={true} />
          <MobileNavbar user={loggedInUser} />
        </div>
        <div>
          <Header />
		  {children}
        </div>
	  </div>
    </main>
  );
}
