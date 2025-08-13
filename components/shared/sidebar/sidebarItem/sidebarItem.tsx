'use client';
import Link from 'next/link';
import React from 'react';
import PlaidLink from '@/app/(auth)/_nextjs/_components/plaidLink/plaidLink';
import { SidebarItemProps } from './sidebarItem.types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const SidebarItem = ({ item, isActive, isSidebarExpanded, user }: SidebarItemProps) => {
  const commonClasses = `group text-base h-full relative flex items-center whitespace-nowrap rounded-md ${
    isActive
      ? 'bg-gray-200 text-gray-700 shadow-sm'
      : 'hover:bg-gray-200 hover:text-gray-700 text-gray-500'
  }`;

  // Collapsed sidebar (tooltip mode): icon only
  if (!isSidebarExpanded) {
    return (
      <TooltipProvider delayDuration={70}>
        <Tooltip>
          <TooltipTrigger asChild>
            {item.isPlaid ? (
              <div className={`${commonClasses} py-1.5 px-2 duration-100`}>
                {item.icon && (
                  <item.icon
                    width={20}
                    height={20}
                    className="transition-colors fill-gray-500 group-hover:text-gray-700"
                  />
                )}
              </div>
            ) : (
              <Link href={item.route} className={`${commonClasses} py-1.5 px-2 duration-100`}>
                {item.icon && (
                  <item.icon
                    width={20}
                    height={20}
                    className={cn(
                      'transition-colors',
                      isActive
                        ? 'fill-gray-700'
                        : 'group-hover:text-gray-700 fill-gray-500'
                    )}
                  />
                )}
              </Link>
            )}
          </TooltipTrigger>
          <TooltipContent side="left" className="px-3 py-1.5 text-xs" sideOffset={10}>
            <span>{item.label}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Expanded sidebar (normal view)
  if (item.isPlaid) {
    return (
      <div className={commonClasses}>
        <div className="relative font-medium text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
          {item.icon && (
            <item.icon
              width={20}
              height={20}
              className="transition-colors fill-gray-500 group-hover:text-gray-700"
            />
          )}
          <PlaidLink user={user} />
        </div>
      </div>
    );
  }

  return (
    <Link href={item.route} className={commonClasses}>
      <div className="relative font-medium text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
        {item.icon && (
          <item.icon
            width={20}
            height={20}
            className={cn(
              'transition-colors',
              isActive
                ? 'fill-gray-700'
                : 'group-hover:text-gray-700 fill-gray-500'
            )}
          />
        )}
        <span>{item.label}</span>
      </div>
    </Link>
  );
};

export default SidebarItem;
