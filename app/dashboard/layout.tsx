import React from 'react';
import Header from './_nextjs/components/header/header';
import Sidebar from './_nextjs/components/sidebar/sidebar';
import { getCurrentUser } from '../(auth)/_nextjs/currentUser';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import MobileNavbar from './_nextjs/components/mobileNavbar/mobileNavbar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedInUser = await getCurrentUser({ withFullUser: true });

  return (
    <main className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      {loggedInUser && <Sidebar user={loggedInUser} />}
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar (Mobile Nav + Logo) */}
        <div className="flex md:hidden items-center justify-between p-6 sticky top-0
		border-b border-gray-200">
          <CompanyLogo />
          {loggedInUser && <MobileNavbar user={loggedInUser} />}
        </div>
        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Header />
          {children}
        </div>
      </div>
    </main>
  );
}
