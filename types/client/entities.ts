export interface Account {
  id: string;
  name: string;
  businessId: string;
  bankId: string | null;
  plaidId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export type Transaction = {
	id: string;
	name: string;
	account: Pick<Account, 'id' | 'name'>;
	category: Category | null;
	amount: number;
	notes: string | null;
	payee: string;
	date: string; // ISO date string
}

