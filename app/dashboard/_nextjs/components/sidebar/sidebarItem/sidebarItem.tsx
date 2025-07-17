'use client';
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
          className={`group text-sm h-full relative flex items-center whitespace-nowrap rounded-md ${
            isActive
              ? ' bg-neutral-200 text-neutral-700 shadow-sm'
              : 'hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500'
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
                    ? ' fill-neutral-700'
                    : 'group-hover:text-neutral-700 fill-neutral-500'
                )}
              />
            )}
            <span>{item.label}</span>
          </div>
        </Link>
      ) : (
        <TooltipProvider delayDuration={70}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.route}
                className={`group h-full text-sm relative flex flex-row  items-center whitespace-nowrap rounded-md 
					py-1.5 px-2 duration-100
					${
        isActive
          ? ' bg-neutral-200 text-neutral-700 shadow-sm'
          : 'hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500'
        }`}
              >
                {item.icon && (
                  <item.icon
                    width={20}
                    height={20}
                    className={cn(
                      'transition-colors',
                      isActive
                        ? ' fill-neutral-700'
                        : 'group-hover:text-neutral-700 fill-neutral-500'
                    )}
                  />
                )}
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
