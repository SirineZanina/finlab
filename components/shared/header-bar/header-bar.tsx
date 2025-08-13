'use client';

import { useState, useEffect } from 'react';
import ProfileDropdown from '../profileDropdown/profileDropdown';
import { useSession } from '@/features/auth/use-session';
import { UserCircle2, Command } from 'lucide-react';
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
      <header className="sticky top-0 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md shadow-md">
        <div className="flex justify-between px-4 py-3">
          {/* Command palette trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="group flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
          >
            <Command
              size={16}
              className="text-gray-500 group-hover:text-gray-700 transition-colors"
            />
            <span className="text-sm font-medium">Search…</span>
            <div className="hidden sm:flex items-center gap-1 ml-auto text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 bg-gray-50 border border-gray-300 rounded">
     			 ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-50 border border-gray-300 rounded">
     			 K
              </kbd>
            </div>
          </button>

          {/* Profile section */}
          <div className="flex items-center">
            {session?.user ? (
              <ProfileDropdown
                firstName={session.user.firstName}
                lastName={session.user.lastName}
                email={session.user.email}
                profilePhotoUrl={session.user.profilePhotoUrl ?? ''}
                className=""
              />
            ) : (
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all duration-200 border border-transparent hover:border-gray-700/50">
                <UserCircle2 size={20} />
                <span className="text-sm font-medium">Sign In</span>
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
