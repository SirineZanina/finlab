import { AccountType } from './accountType';
import { Transaction } from '../transaction/transaction';

export type Account = {
	id: string;
	name: string;
	type: AccountType;
	balance: number;
	businessId: string;
	transaction: Transaction[];
	createdAt: Date;
	updatedAt: Date;
};
