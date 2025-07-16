'use client';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarProps } from './sidebar.types';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <CompanyLogo />
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link href={item.route} key={item.label}
              className={cn('sidebar-link', { 'bg-primary-700': isActive })}
            >
              <div className="relative size-6">
                {item.icon && (
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-white' : 'fill-slate-500'}`} />
                )}
              </div>
              <p className={cn('sidebar-label hidden lg:flex', { 'text-white': isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })}

        {/* <PlaidLink user={user} /> */}
      </nav>

      {/* <Footer user={user} /> */}
    </section>
  );
};

export default Sidebar;
