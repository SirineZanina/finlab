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
import { logOut } from '@/app/(auth)/_nextjs/actions';

export default function ProfileDropdown({
  firstName,
  lastName,
  email,
  profilePhotoUrl,
  className
}: ProfileDropdownProps ) {
  return (
    <div className={className}>
		 <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer w-10 h-10">
            <AvatarImage src={profilePhotoUrl || ''} alt="User avatar" />
            <AvatarFallback>{firstName?.[0] ?? 'U'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 mr-10">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <div className='flex items-end gap-2'>
                <span className="text-sm font-semibold">
                  {firstName} {lastName?.[0]}.
			  </span>
              </div>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href='/dashboard'>
			Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Earnings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={async () => await logOut()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
