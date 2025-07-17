'use client';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { SidebarProps } from './sidebar.types';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import SidebarItem from './sidebarItem/sidebarItem';
import { Fragment, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ChevronLeftIcon from '@/components/assets/icons/chevronLeftIcon';
import { ChevronRightIcon } from 'lucide-react';

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('sidebarExpanded');
      if (saved === null) {
        return true;
      }
      return JSON.parse(saved);
    }
    return true; // default state if window is not defined
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'sidebarExpanded',
        JSON.stringify(isSidebarExpanded),
      );
    }
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="">
      <div
        className={cn(
          isSidebarExpanded ? 'w-[200px]' : 'w-[68px]',
          ' border-r transition-all duration-300 ease-in-out transform hidden md:flex h-full bg-accent',
        )}
      >
        <aside className={cn( isSidebarExpanded ? '' : 'items-center justify-center',
          'flex h-full flex-col w-full break-words p-6 overflow-x-hidden columns-1'
        )}>
          {/* Top */}
		  	 {isSidebarExpanded ? (
            <CompanyLogo className="mb-7"  />
          ) : (
            <CompanyLogo className="mb-7 " hideTextLogo={true} />
          )}

          <div className="relative">
            <div className="flex flex-col gap-2">
              {sidebarLinks.map((item, idx) => {
                if (item.position === 'top') {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SidebarItem
						  item={item}
						  isActive={pathname === item.route}
                          isSidebarExpanded={isSidebarExpanded}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            </div>
          </div>
          {/* Bottom */}
          <div className="sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
            {sidebarLinks.map((item, idx) => {
              if (item.position === 'bottom') {
                return (
                  <Fragment key={idx}>
                    <div className="space-y-1">
                      <SidebarItem
                        item={item}
						 isActive={pathname === item.route}
                        isSidebarExpanded={isSidebarExpanded}
                      />
                    </div>
                  </Fragment>
                );
              }
            })}
          </div>
        </aside>
        <div className="mt-[calc(calc(90vh)-40px)] relative">
          <button
            type="button"
            className="absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center border border-muted-foreground/20 rounded-full bg-accent shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? (
              <ChevronLeftIcon width={16} height={16}/>
            ) : (
              <ChevronRightIcon width={16} height={16}/>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
