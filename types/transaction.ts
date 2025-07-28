export type Transaction = {
	id: string;
	name: string;
	amount: number;
	paymentChannel: string;
	pending: boolean;
	image?: string;
	type: string;
	category: string;
	createdAt: Date;
}

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
