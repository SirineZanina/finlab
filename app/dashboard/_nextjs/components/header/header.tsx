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
  const pathLocation = subPath
    ? subPath
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    : 'Home';

  const subtitlesMap: Record<string, string> = {
    home: 'Welcome to your dashboard',
    banks: 'Manage your bank accounts efficiently',
    'transaction-history': 'View your complete transaction history',
    'payment-transfer': 'Transfer funds securely',
  };

  const subtitle = subtitlesMap[subPath?.toLowerCase() || 'home'] ?? '';

  return (
    <header>
      <div className='flex justify-between items-start'>
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
