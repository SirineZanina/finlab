import { client } from '@/lib/hono';
import { InferResponseType } from 'hono';

export type Account = {
  id: string;
  name: string;
  businessId: string;
  bankId: string | null;
  plaidId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ResponseType = InferResponseType<typeof client.api.accounts.$get, 200>['data'][0];

// TODO: change these
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
