'use client';
import React, { useEffect, useState } from 'react';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import SidebarItem from './sidebarItem/sidebarItem';
import { FinlabIcon } from '@/components/assets/logos/finlabIcon';
import { FinlabLogo } from '@/components/assets/logos/finlabLogo';

const Sidebar = () => {

  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
		 <Link href="/" className='cursor-pointer pb-4'>
          <div className=' flex items-center gap-0.5 border-b p-2 border-slate-200'>
				  <FinlabIcon className="w-9 h-9" />
            <FinlabLogo className='w-20 hidden lg:flex'/>
          </div>
        </Link>
        {sidebarLinks.map((item) => {
          const isHome = item.route === '/dashboard';
          const isActive = isHome
            ? pathname === item.route
            : pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <SidebarItem
              key={item.label}
              item={item}
              isActive={isActive}
            />
          );
        })}
		USER
        {/* <PlaidLink user={user} /> */}
      </nav>
		FOOTER
      {/* <Footer user={user} /> */}
    </section>
  );
};

export default Sidebar;
