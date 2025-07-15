import { Account } from '../account/account';
import { Business } from '../business/business';
import { TransactionType } from './transactionType';

export type Transaction = {
	id: string;
	description: string;
	amount: number;
	date: Date;
	type: TransactionType;
	business: Business;
	businessId: string;
	accountId: string;
	account: Account;
}
