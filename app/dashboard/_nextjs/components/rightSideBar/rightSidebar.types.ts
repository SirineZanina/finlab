import { BankAccount } from '@/types/account/bankAccount';
import { SafeUser } from '@/types/session/sessionData';
import { Transaction } from '@/types/transaction/transaction';

export type RightSidebarProps = {
  user: SafeUser;
  transactions?: Transaction[];
  banks?: BankAccount[];
};
