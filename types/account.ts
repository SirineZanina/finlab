import { Transaction } from './transaction';

export type Account = {
	id: string;
	name: string;
	availableBalance: number;
	currentBalance: number;
	officialName: string;
	mask: string;
	institutionId: string;
	type: string;
	subtype: string;
	shareableId: string;
	businessId: string;
	transactions?: Transaction[];
	bankId: string;
	plaidId: string;
	createdAt: string;
	updatedAt: string;
};

const AccountTypes = [
  'depository',
  'credit',
  'loan',
  'investment',
  'other',
];

export type AccountType = typeof AccountTypes[number];

export type CreateBankAccountProps = {
  userId: string;
  accessToken: string;
  plaidBankId: string;
  plaidId: string;
  fundingSourceUrl: string;
  shareableId: string;
}
