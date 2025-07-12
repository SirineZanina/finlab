'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileDropdownProps } from './profileDropdown.types';
import Link from 'next/link';

export default function ProfileDropdown({
  name,
  email,
  role,
  profilePhotoUrl,
}: ProfileDropdownProps ) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={profilePhotoUrl || ''} alt="User avatar" />
          <AvatarFallback>{name?.[0] ?? 'U'}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
            <span className="text-xs text-muted-foreground capitalize">{role}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href='/private'>
			Dashboard
          </Link>

        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Earnings</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
