import { Bank } from '@/types/bank';
import { Transaction } from '@/types/transaction';
import { User } from '@/types/user';

export type RightSidebarProps = {
  user: User;
  transactions?: Transaction[];
  banks?: Bank[];
};
