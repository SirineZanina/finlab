import { client } from '@/lib/hono';
import { InferResponseType } from 'hono';

export type Transaction = {
	id: string;
	name: string;
	account: {
		id: string;
		name: string;
	},
	category: {
		id: string;
		name: string;
	} | null,
	amount: number;
	notes: string | null;
	payee: string;
	date: string; // ISO date string
}

export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>['data'][0];

// TODO: possibly remove this

export type getInstitutionProps = {
	institutionId: string;
}

export type getTransactionsByBankIdProps = {
	bankId: string;
}

export type CreateTransactionProps = {
  name: string;
  amount: string;
  accountId: string; // Add this property
  category: string;
  type: 'debit' | 'credit'; // Specify the type of transaction
  createdAt: Date;
}

export type getTransactionsProps = {
	accessToken: string;
}
