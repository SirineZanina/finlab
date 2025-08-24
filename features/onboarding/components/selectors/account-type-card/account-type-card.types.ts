import { LucideIcon } from 'lucide-react';

export type AccountTypeCardProps = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: (id: string) => void
}
