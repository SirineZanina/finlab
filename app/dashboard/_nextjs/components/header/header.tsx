'use client';
import React from 'react';
import ProfileDropdown from '@/app/components/profileDropdown/profileDropdown';
import { useSession } from '@/hooks';
import HeaderBox from '../headerBox/headerBox';
import { usePathname } from 'next/navigation';

const Header = () => {
  const session = useSession();
  const pathname = usePathname();

  const pathLocation = (() => {
    const subPath = pathname.replace('/dashboard', '').split('/').filter(Boolean)[0];
    if (!subPath) return 'Home';

    return subPath.charAt(0).toUpperCase() + subPath.slice(1);
  })();

  return (
    <header className='sticky top-0 '>
      <div className='flex justify-between items-center p-6 sm:p-8 bg-white'>
        <HeaderBox
          pathLocation={pathLocation}
        />
        <div>
          {session && session.user && (
            <ProfileDropdown
              firstName={session.user.firstName}
              lastName={session.user.lastName}
              email={session.user.email}
              profilePhotoUrl={session.user.profilePhotoUrl ?? ''}
			  className='hidden md:block'
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
