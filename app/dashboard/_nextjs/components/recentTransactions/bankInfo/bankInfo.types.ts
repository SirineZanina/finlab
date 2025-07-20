import { Account } from '@/types/account';

export type BankInfoProps = {
	account: Account;
	accountId?: string;
	type: 'full' | 'card';
}
