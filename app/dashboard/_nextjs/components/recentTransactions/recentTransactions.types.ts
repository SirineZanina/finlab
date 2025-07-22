import { Account } from '@/types/account';
import { Transaction } from '@/types/transaction';

export type RecentTransactionsProps = {
  accounts: Account[];
  initialTransactions: Transaction[]; // or your Transaction type
  accountId: string;
  page?: number;

}
