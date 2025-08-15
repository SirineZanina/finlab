'use client';
import React from 'react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import HamburgerIcon from '@/components/assets/icons/hamburgerIcon';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const MobileNavbar = () => {
  const pathname = usePathname();
  return (
    <section className=''>
      <Sheet>
        <SheetTrigger>
          <HamburgerIcon width={30} height={30} className='cursor-pointer' />
        </SheetTrigger>
        <SheetContent className='w-full max-w-[264px]' side='left'>
          <SheetHeader>
            <SheetTitle>
              <CompanyLogo />
            </SheetTitle>
          </SheetHeader>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 p-4 text-white">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.route;
                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        href={item.route}
                        className={cn('mobilenav-sheet_close w-full', { 'bg-primary-500': isActive })}
                      >
                        {item.icon && (
                          <item.icon
                            width={20}
                            height={20}
                            className={cn('transition-colors', isActive ? 'fill-primary-0' : 'fill-secondary-400')}
                          />
                        )}
                        <p className={cn('text-base font-semibold text-secondary-500', { 'text-white': isActive })}>
                          {item.label}
                        </p>
                      </Link>
                    </SheetClose>
                  );
                })}
        			USER
              </nav>
            </SheetClose>
          </div>
        </SheetContent>

      </Sheet>
    </section>
  );
};

export default MobileNavbar;
