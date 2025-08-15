import { Account } from '@/types/client/entities';

export type BankCardProps = {
	account: Account;
	username: string;
	showBalance?: boolean;
}
