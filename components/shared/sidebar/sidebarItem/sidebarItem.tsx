'use client';
import Link from 'next/link';
import React from 'react';
import PlaidLink from '@/app/(auth)/_nextjs/_components/plaidLink/plaidLink';
import { SidebarItemProps } from './sidebarItem.types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const SidebarItem = ({ item, isActive, isSidebarExpanded, user }: SidebarItemProps) => {
  const commonClasses = cn(
    'group relative flex items-center whitespace-nowrap rounded-xl transition-all duration-200 ease-in-out',
    isActive
      ? 'bg-white/20 text-white border border-white/30 shadow-lg backdrop-blur-sm'
      : 'hover:bg-white/10 hover:text-white text-primary-100 border border-transparent hover:border-white/20 hover:shadow-md backdrop-blur-sm'
  );

  // Collapsed sidebar (tooltip mode): icon only
  if (!isSidebarExpanded) {
    return (
      <TooltipProvider delayDuration={70}>
        <Tooltip>
          <TooltipTrigger asChild>
            {item.isPlaid ? (
              <div className={cn(commonClasses, 'py-3 px-3 justify-center')}>
                {item.icon && (
                  <item.icon
                    width={20}
                    height={20}
                    className={cn(
                      'transition-colors',
                      isActive
                        ? 'fill-white'
                        : 'fill-primary-200 group-hover:fill-white'
                    )}
                  />
                )}
              </div>
            ) : (
              <Link href={item.route} className={cn(commonClasses, 'py-3 px-3 justify-center')}>
                {item.icon && (
                  <item.icon
                    width={20}
                    height={20}
                    className={cn(
                      'transition-colors',
                      isActive
                        ? 'fill-white'
                        : 'fill-primary-200 group-hover:fill-white'
                    )}
                  />
                )}
              </Link>
            )}
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="px-3 py-2 text-sm font-medium bg-gray-900 text-white border-gray-800"
            sideOffset={12}
          >
            <span>{item.label}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Expanded sidebar (normal view)
  if (item.isPlaid) {
    return (
      <div className={cn(commonClasses, 'py-3 px-4')}>
        <div className="flex items-center space-x-4 w-full">
          {item.icon && (
            <item.icon
              width={20}
              height={20}
              className={cn(
                'transition-colors flex-shrink-0',
                isActive
                  ? 'fill-white'
                  : 'fill-primary-200 group-hover:fill-white'
              )}
            />
          )}
          <div className="flex-1 min-w-0">
            <PlaidLink user={user} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link href={item.route} className={cn(commonClasses, 'py-3 px-4')}>
      <div className="flex items-center space-x-4 w-full">
        {item.icon && (
          <item.icon
            width={20}
            height={20}
            className={cn(
              'transition-colors flex-shrink-0',
              isActive
                ? 'fill-white'
                : 'fill-teal-200 group-hover:fill-white'
            )}
          />
        )}
        <span className="font-medium text-base truncate">{item.label}</span>
      </div>
    </Link>
  );
};

export default SidebarItem;
