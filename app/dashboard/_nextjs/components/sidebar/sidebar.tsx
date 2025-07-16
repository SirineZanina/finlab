'use client';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { SidebarProps } from './sidebar.types';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import SidebarItem from './sidebarItem/sidebarItem';

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      	  <nav className="flex flex-col gap-4">

        <CompanyLogo />
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route;

          return (
            <SidebarItem

			  key={item.label}
			  item={item}
			  isActive={isActive}
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
