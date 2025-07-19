import { Account } from './account';

export type Bank = {
  id: string;
  plaidAccountId: string;
  plaidBankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
  accounts: Account[];
};
