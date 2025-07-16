'use client';
import Link from 'next/link';
import { ArrowRight } from '@/components/assets/icons/arrowRightIcon';
import { MenuIcon } from '@/components/assets/icons/menuIcon';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks';
import ProfileDropdown from '@/app/components/profileDropdown/profileDropdown';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';

const Header = () => {
  const session = useSession();

  return (
    <header className="sticky top-0 backdrop-blur-md">
      <div className='flex justify-center items-center py-3 bg-black text-white text-xs gap-3'>
        <p className="text-white/60 hidden md:block ">
			Manage your cashflow and boost your finances.
        </p>
        <div className="inline-flex items-center gap-1">
          <p>Get started for free</p>
          <ArrowRight className="h-4 w-4 inline-flex justify-center items-center"/>
        </div>
      </div>
      <div className="py-5">
        <div className="container">
          <div className="flex items-center justify-between">
            <CompanyLogo />
            <MenuIcon className="h-5 w-5 md:hidden" />
            <nav className="text-sm hidden md:flex gap-6 text-secondary-400 items-center font-medium">
              <Link href="/">Home</Link>
              <Link href="#features">Features</Link>
              <Link href="#testimonials">Testimonials</Link>
              <Link href="#updates">Updates</Link>
              <Link href="/help">Help</Link>
              { session === null ? (
				 <Link href="/sign-up">
                  <Button variant={'default'}>
					Get Started
                  </Button>
                </Link>
              ) :
                (
                  session.user && (
                    <ProfileDropdown
                      firstName={session.user.firstName}
                      lastName={session.user.lastName}
                      email={session.user.email}
                    />
                  )
                )
              }
            </nav>
          </div>
        </div>
      </div>
    </header>
  	);
};

export default Header;
