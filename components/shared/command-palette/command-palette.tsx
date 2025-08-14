import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { CommandPaletteProps } from './command-palette.types';

const CommandPalette = ({ open, setOpen }: CommandPaletteProps) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder='Type a command or search...'
        className='border-[var(--color-secondary-200)] text-[var(--color-secondary-500)] placeholder:text-[var(--color-secondary-400)]'
      />
      <CommandList className='bg-[var(--color-primary-0)]'>
        <CommandEmpty className='text-[var(--color-secondary-400)] py-6 text-center'>
          No results found.
        </CommandEmpty>

        <CommandGroup
          heading='Suggestions'
          className='text-[var(--color-secondary-400)] [&_[cmdk-group-heading]]:text-[var(--color-secondary-400)] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5'
        >
          <CommandItem
            onSelect={() => setOpen(false)}
            className='text-[var(--color-secondary-500)] hover:bg-[var(--color-other-grey)] hover:text-[var(--color-primary-600)] aria-selected:bg-[var(--color-primary-100)] aria-selected:text-[var(--color-primary-600)] rounded-lg mx-2'
          >
            Calendar
          </CommandItem>
          <CommandItem
            onSelect={() => setOpen(false)}
            className='text-[var(--color-secondary-500)] hover:bg-[var(--color-other-grey)] hover:text-[var(--color-primary-600)] aria-selected:bg-[var(--color-primary-100)] aria-selected:text-[var(--color-primary-600)] rounded-lg mx-2'
          >
            Search Emoji
          </CommandItem>
          <CommandItem
            onSelect={() => setOpen(false)}
            className='text-[var(--color-secondary-500)] hover:bg-[var(--color-other-grey)] hover:text-[var(--color-primary-600)] aria-selected:bg-[var(--color-primary-100)] aria-selected:text-[var(--color-primary-600)] rounded-lg mx-2'
          >
            Calculator
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className='bg-[var(--color-secondary-200)]' />

        <CommandGroup
          heading='Settings'
          className='text-[var(--color-secondary-400)] [&_[cmdk-group-heading]]:text-[var(--color-secondary-400)] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5'
        >
          <CommandItem
            onSelect={() => setOpen(false)}
            className='text-[var(--color-secondary-500)] hover:bg-[var(--color-other-grey)] hover:text-[var(--color-primary-600)] aria-selected:bg-[var(--color-primary-100)] aria-selected:text-[var(--color-primary-600)] rounded-lg mx-2'
          >
            Profile
          </CommandItem>
          <CommandItem
            onSelect={() => setOpen(false)}
            className='text-[var(--color-secondary-500)] hover:bg-[var(--color-other-grey)] hover:text-[var(--color-primary-600)] aria-selected:bg-[var(--color-primary-100)] aria-selected:text-[var(--color-primary-600)] rounded-lg mx-2'
          >
            Billing
          </CommandItem>
          <CommandItem
            onSelect={() => setOpen(false)}
            className='text-[var(--color-secondary-500)] hover:bg-[var(--color-other-grey)] hover:text-[var(--color-primary-600)] aria-selected:bg-[var(--color-primary-100)] aria-selected:text-[var(--color-primary-600)] rounded-lg mx-2'
          >
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
