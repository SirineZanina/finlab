'use client';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { SidebarProps } from './sidebar.types';
import CompanyLogo from '@/components/shared/companyLogo/companyLogo';
import SidebarItem from './sidebarItem/sidebarItem';
import { cn } from '@/lib/utils';
import ChevronLeftIcon from '@/components/assets/icons/chevronLeftIcon';
import useIsSidebarExpanded from './sidebar.hooks';
import ChevronRightIcon from '@/components/assets/icons/chevronRightIcon';

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  const { isSidebarExpanded, toggleSidebar } = useIsSidebarExpanded();

  return (
    <div
      className={cn(
        isSidebarExpanded ? 'w-[280px]' : 'w-[68px]',
        'bg-gradient-to-b from-primary-700 to-primary-800 transition-all duration-200 ease-in-out transform hidden md:flex h-full shadow-xl',
      )}
    >
      <aside className={cn(
        isSidebarExpanded ? '' : 'items-center justify-center',
        'flex h-full flex-col w-full break-words p-6 overflow-x-hidden columns-1'
      )}>
        {/* Top - Logo Section */}
        {isSidebarExpanded ? (
          <CompanyLogo fillIcon={'#FFFFFF'} fillLogo={'#FFFFFF'} className='mb-7 ml-2'/>
        ) : (
          <CompanyLogo fillIcon={'#FFFFFF'} hideTextLogo={true} className='mb-7' />
        )}

        <div className="relative flex-1">
          <div className="flex flex-col gap-2">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.route;
              if (item.position === 'top') {
                return (
                  <div className="space-y-2" key={item.label}>
                    <SidebarItem
                      item={item}
                      isActive={isActive}
                      isSidebarExpanded={isSidebarExpanded}
                      user={user}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto mb-4 space-y-2">
          {sidebarLinks.map((item, idx) => {
            if (item.position === 'bottom') {
              return (
                <div className="space-y-2" key={idx}>
                  <SidebarItem
                    item={item}
                    isActive={pathname === item.route}
                    isSidebarExpanded={isSidebarExpanded}
                    user={user}
                  />
                </div>
              );
            }
          })}
        </div>
      </aside>

      {/* Toggle Button */}
      <div className="mt-[calc(calc(90vh)-40px)] relative">
        <button
          type="button"
          className="absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center border border-primary-400 rounded-full bg-white cursor-pointer transition-all duration-200 ease-in-out
		 	hover:bg-primary-100 hover:shadow-lg hover:scale-105"
          onClick={toggleSidebar}
        >
          {isSidebarExpanded ? (
            <ChevronLeftIcon width={12} height={12} className="text-primary-600"/>
          ) : (
            <ChevronRightIcon width={12} height={12} className="text-primary-600"/>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
