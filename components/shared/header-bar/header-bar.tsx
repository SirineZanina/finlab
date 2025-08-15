'use client';

import { useState, useEffect } from 'react';
import ProfileDropdown from '../profileDropdown/profileDropdown';
import { useSession } from '@/features/auth/hooks/use-session';
import { UserCircle2, Search, Bell } from 'lucide-react';
import CommandPalette from '../command-palette/command-palette';

const HeaderBar = () => {
  const session = useSession();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Keyboard shortcut handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <header className='sticky top-0 border-b border-secondary-200 bg-primary-0 px-6 py-4'>
        <div className='flex items-center justify-between'>
          {/* Search bar */}
          <div className='flex-1 max-w-md'>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className='group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border border-secondary-200 bg-primary-0 text-secondary-400 hover:bg-other-grey hover:border-primary-300 transition-all duration-200 shadow-sm cursor-pointer'
            >
              <Search
                size={18}
                className='text-primary-500 flex-shrink-0'
              />
              <span className='text-sm font-medium text-secondary-400'>Search...</span>
              <div className='hidden sm:flex items-center gap-1 ml-auto'>
                <kbd className='px-2 py-1 bg-secondary-100 border border-secondary-200 rounded-md text-xs text-secondary-400 font-medium'>
                  ⌘
                </kbd>
                <kbd className='px-2 py-1 bg-secondary-100 border border-secondary-200 rounded-md text-xs text-secondary-400 font-medium'>
                  K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className='flex items-center gap-3 ml-6'>
            {/* Notification Bell */}
            <button className='p-2.5 rounded-full text-primary-500 bg-secondary-100 hover:bg-primary-100 transition-all duration-200 cursor-pointer'>
              <Bell size={20} />
            </button>

            {/* Profile section */}
            {session?.user ? (
              <div className='flex items-center'>
                <ProfileDropdown
                  firstName={session.user.firstName}
                  lastName={session.user.lastName}
                  email={session.user.email}
                  profilePhotoUrl={session.user.profilePhotoUrl ?? ''}
                />
              </div>
            ) : (
              <button className='flex items-center gap-2 px-4 py-2 rounded-xl text-secondary-400 hover:text-primary-600 hover:bg-other-grey transition-all duration-200 hover:border-secondary-200'>
                <UserCircle2 size={20} />
                <span className='text-sm font-medium'>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        setOpen={setCommandPaletteOpen}
      />
    </>
  );
};

export default HeaderBar;
