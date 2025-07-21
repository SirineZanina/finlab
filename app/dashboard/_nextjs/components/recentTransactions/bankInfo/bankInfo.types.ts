import { Account } from '@/types/account';

export type BankInfoProps = {
	account: Account;
	plaidAccountId: string;
	type: 'full' | 'card';
}
