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
    <header className='sticky top-0'>
      <div className='flex justify-between items-center p-6 bg-white'>
        <HeaderBox
          pathLocation={pathLocation}
        />
        <div>
          {session && (
            <ProfileDropdown
              firstName={session.firstName}
              lastName={session.lastName}
              email={session.email}
              role={session.role}
              profilePhotoUrl={session?.profilePhotoUrl ?? ''}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
