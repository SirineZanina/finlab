import Link from 'next/link';
import React from 'react';
import { SidebarItemProps } from './sidebarItem.types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const SidebarItem = ({ item, isActive } : SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={70}>
      <Tooltip>
        <Link href={item.route} passHref>
          <TooltipTrigger asChild>
            <div
              className={`h-full flex items-center whitespace-nowrap rounded-md ${
                isActive
                  ? 'font-base text-sm bg-primary-700/50	'
                  : 'hover:bg-slate-200 hover:text-slate-700 text-slate-500'
              }`}
            >
              <div className="relative font-base text-sm p-2 flex flex-row items-center space-x-2 rounded-md">
                {item.icon && (
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-white' : 'fill-slate-500'}`} />
                )}
                <span className={cn('hidden xl:flex text-sm', isActive ? 'text-white' : 'text-slate-500')}>
                  {item.label}
                </span>
              </div>
            </div>
          </TooltipTrigger>
        </Link>
        <TooltipContent
          side="left"
          className="px-3 py-1.5 text-xs"
          sideOffset={10}
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarItem;
