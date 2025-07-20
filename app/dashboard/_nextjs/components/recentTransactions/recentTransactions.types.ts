import { Account } from '@/types/account';
import { Transaction } from '@/types/transaction';

export type RecentTransactionsProps = {
	accounts: Account[];
	transactions: Transaction[];
	accountId: string; // Changed from appwriteItemId to accountId
	page?: number;
};
