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
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => setOpen(false)}>Calendar</CommandItem>
          <CommandItem onSelect={() => setOpen(false)}>Search Emoji</CommandItem>
          <CommandItem onSelect={() => setOpen(false)}>Calculator</CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => setOpen(false)}>Profile</CommandItem>
          <CommandItem onSelect={() => setOpen(false)}>Billing</CommandItem>
          <CommandItem onSelect={() => setOpen(false)}>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
