import { Decimal } from '@prisma/client/runtime/library';

export type Account = {
	id: string;
	availableBalance: Decimal;
	currentBalance: Decimal;
	officialName: string;
	mask: string;
	institutionId: string;
	name: string;
	type: string;
	subtype: string;
	shareableId: string;
};

const AccountType = [
  'depository',
  'credit',
  'loan',
  'investment',
  'other',
];

export type AccountType = typeof AccountType[number];

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
  accessToken: string;
  userId: string;
  plaidBankId: string;
  plaidAccountId: string;
  fundingSourceUrl: string;
  shareableId: string;
}

export type getAccountsProps = {
	userId: string;
}

export type getAccountProps = {
	accountId: string
}
