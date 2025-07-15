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
		  <Link href="/" className='cursor-pointer flex items-center gap-0.5 pb-4'>
          <FinlabIcon className="w-9 h-9" />
          <FinlabLogo className='w-20 hidden lg:flex'/>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <SidebarItem
              item={item}
              isActive={isActive}
			  key={item.label}

            />
          );
        })}

        {/* <PlaidLink user={user} /> */}
      </nav>

      {/* <Footer user={user} /> */}
    </section>
  );
};

export default Sidebar;
