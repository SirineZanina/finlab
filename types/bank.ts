import { Account } from './account';

export type Bank = {
  id: string;
  plaidId: string;
  plaidBankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
  accounts: Account[];
};

export type getBanksProps = {
  userId: string;
}

export type getBankProps = {
  id: string;
}

export type getBankByAccountIdProps = {
  accountId: string;
}

