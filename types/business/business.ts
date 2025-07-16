import { Account } from '../account/account';
import { Transaction } from '../transaction/transaction';
import { BusinessIndustry } from './businessIndustry';

export type Business = {
	id: string;
	name: string;
	industry: BusinessIndustry;
	accounts: Account[];
	transactions: Transaction[];
}
