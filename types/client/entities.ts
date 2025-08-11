export interface TransactionAccount {
  id: string;
  name: string;
  businessId: string;
  bankId: string | null;
  plaidId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
}

export type Transaction = {
	id: string;
	name: string;
	account: Pick<TransactionAccount, 'id' | 'name'>;
	category: TransactionCategory | null;
	amount: number;
	notes: string | null;
	payee: string;
	date: string; // ISO date string
}

