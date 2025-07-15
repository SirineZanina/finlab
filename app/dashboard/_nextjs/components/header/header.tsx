'use client';
import React from 'react';
import ProfileDropdown from '@/app/components/profileDropdown/profileDropdown';
import { useSession } from '@/hooks';
import HeaderBox from '../headerBox/headerBox';

const Header = () => {
  const session = useSession();
  return (
    <header className='sticky top-0 '>
      <div className='flex justify-between items-center p-6 bg-white '>
        <HeaderBox
          type="greeting"
          title="Welcome"
          loggedInUser={{ firstName: session?.firstName || 'Guest' }}
          subtext="Access and manage your financial data securely and efficiently."
		  />
        <div>
          {session && (
            <ProfileDropdown firstName={session.firstName} lastName={session.lastName}
              email={session.email} role={session.role} profilePhotoUrl={session?.profilePhotoUrl ?? ''}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
