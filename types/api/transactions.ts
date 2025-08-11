import { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { ApiSuccessResponse } from './common';

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
export type GetTransactionsResponse = ApiSuccessResponse<TransactionWithAccountAndCategory[]>;

export type GetTransactionResponse = ApiSuccessResponse<TransactionWithAccountAndCategory>;

export type CreateTransactionResponse = ApiSuccessResponse<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateTransactionResponse = ApiSuccessResponse<Transaction>;

export type BulkDeleteTransactionsResponse = ApiSuccessResponse<{
  deletedCount: number;
  deletedTransactionsIds: string[];
}>;

export type DeleteTransactionResponse = ApiSuccessResponse<{ id: string }>;
