import React from 'react';
import { MobileNavbarProps } from './mobileNavbar.types';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import HamburgerIcon from '@/components/assets/icons/hamburgerIcon';

const MobileNavbar = ({ user } : MobileNavbarProps) => {
  return (
    <section className=''>
      <Sheet>
        <SheetTrigger>
          <HamburgerIcon className='w-8 h-8'/>
        </SheetTrigger>
        <SheetContent className='w-full max-w-[264px]' side='left'>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
				This action cannot be undone. This will permanently delete your account
				and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNavbar;
