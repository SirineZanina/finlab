import { Account } from '@/types/account';
import { Transaction } from '@/types/transaction';
import { User } from '@/types/client/user';

export type BankSectionProps = {
	user: User;
	accounts: Account[];
	transactions: Transaction[]
}
