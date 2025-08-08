import { Transaction, User } from '@prisma/client';

// ─── Route Handler Variables ───────────────────────────────────────
export type GetTransactionsVariables = {
  userId: string;
  user: User;
  businessId: string;
}

import { Prisma } from '@prisma/client';

export type TransactionWithAccountAndCategory = Prisma.TransactionGetPayload<{
  select: {
    id: true;
    date: true;
    name: true;
    payee: true;
    amount: true;
    notes: true;
    account: {
      select: {
        id: true;
        name: true;
      };
    };
    category: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

// ─── API Response Types ───────────────────────────────────────
export type GetTransactionsResponse = {
  success: true;
  data: TransactionWithAccountAndCategory[];
};

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
