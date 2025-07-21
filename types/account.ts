import { Decimal } from '@prisma/client/runtime/library';
import { Transaction } from './transaction';

export type Account = {
	id: string;
	name: string;
	availableBalance: Decimal;
	currentBalance: Decimal;
	officialName: string;
	mask: string;
	institutionId: string;
	type: string;
	subtype: string;
	shareableId: string;
	businessId: string;
	createdAt: Date;
	updatedAt: Date;
	transactions?: Transaction[];
	bankId: string;
	plaidAccountId: string;
};

const AccountTypes = [
  'depository',
  'credit',
  'loan',
  'investment',
  'other',
];

export type AccountType = typeof AccountTypes[number];

export type Receiver = {
  firstName: string;
  lastName: string;
};

export type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

export type CreateBankAccountProps = {
  userId: string;
  accessToken: string;
  plaidBankId: string;
  plaidAccountId: string;
  fundingSourceUrl: string;
  shareableId: string;
}

export type getAccountsProps = {
	userId: string;
}

export type getAccountProps = {
	plaidAccountId: string
}
