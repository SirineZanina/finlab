import { Account } from '@/types/account';
import { Transaction } from '@/types/transaction';

export type RecentTransactionsProps = {
	accounts: Account[];
	transactions: Transaction[];
	plaidAccountId: string;
	page?: number;
};
