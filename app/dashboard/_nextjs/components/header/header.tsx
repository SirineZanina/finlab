'use client';
import React from 'react';
import ProfileDropdown from '@/app/components/profileDropdown/profileDropdown';
import { useSession } from '@/hooks';
import HeaderBox from '../headerBox/headerBox';
import { usePathname } from 'next/navigation';

const Header = () => {
  const session = useSession();
  const pathname = usePathname();

  const subPath = pathname.replace('/dashboard', '').split('/').filter(Boolean)[0];
  const pathLocation = subPath ? subPath.charAt(0).toUpperCase() + subPath.slice(1) : 'Home';

  const subtitlesMap: Record<string, string> = {
    home: 'Welcome to your dashboard',
    banks: 'Manage your bank accounts',
    transactions: 'Track your spending and income',
  };

  const subtitle = subtitlesMap[subPath?.toLowerCase() || 'home'] ?? '';

  return (
    <header className='sticky top-0 '>
      <div className='flex justify-between items-start bg-white'>
        <HeaderBox
          pathLocation={pathLocation}
		  subtitle={subtitle}
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
