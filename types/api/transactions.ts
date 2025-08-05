import { Transaction, User } from '@prisma/client';

// ─── Route Handler Variables ───────────────────────────────────────
export type GetTransactionsVariables = {
  userId: string;
  user: User;
  businessId: string;
}

// ─── API Response Types ───────────────────────────────────────
export type GetTransactionsResponse = {
  success: true;
  data: Transaction[];
}

export type GetTransactionResponse = {
	success: true,
	data: Transaction
}

export type CreateTransactionResponse = {
  success: true;
  data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
  message: string;
}

export type UpdateTransactionResponse = {
  success: true;
  data: Transaction;
  message: string;
}

export type BulkDeleteTransactionsResponse = {
	success: true;
	message: string;
	data: {
		deletedCount: number;
		deletedTransactionsIds: string[];
	};
}

export type DeleteTransactionResponse = {
  success: true;
  message: string;
}
