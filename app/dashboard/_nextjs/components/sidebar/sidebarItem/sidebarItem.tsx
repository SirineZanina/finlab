import Link from 'next/link';
import React from 'react';
import { SidebarItemProps } from './sidebarItem.types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const SidebarItem = ({ item, isActive, isSidebarExpanded } : SidebarItemProps) => {
  return (
    <>
      {isSidebarExpanded ? (
        <Link
          href={item.route}
          className={`group text-sm h-full relative flex font-base items-center whitespace-nowrap rounded-md ${
            isActive
              ? ' bg-primary-500 shadow-sm text-primary-0'
              : 'hover:bg-primary-500/50 hover:text-primary-0 text-secondary-400'
          }`}
        >
          <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
            {item.icon && (
              <item.icon
                width={20}
                height={20}
                className={cn(
                  'transition-colors',
                  isActive
                    ? 'fill-primary-0'
                    : 'fill-secondary-400 group-hover:fill-primary-0'
                )}
              />
            )}
            <span>{item.label}</span>
          </div>
        </Link>
      ) : (
        <TooltipProvider delayDuration={70}>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={item.route}
                className={`group h-full text-sm relative flex items-center whitespace-nowrap rounded-md ${
                  isActive
                    ? 'bg-primary-500 shadow-sm text-primary-0'
                    : 'hover:bg-primary-500/50 hover:text-primary-0 text-secondary-400'
                }`}
              >
                <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center rounded-md duration-100">
                  {item.icon && (
                    <item.icon
                      width={20}
                      height={20}
                      className={cn(
                        'transition-colors',
                        isActive
                          ? 'fill-primary-0'
                          : 'fill-secondary-400 group-hover:fill-primary-0'
                      )}
                    />
                  )}
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="px-3 py-1.5 text-xs"
              sideOffset={10}
            >
              <span>{item.label}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default SidebarItem;
