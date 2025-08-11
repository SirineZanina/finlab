import { Account } from '@prisma/client';
import { ApiSuccessResponse } from './common';

// ─── API Response Types ───────────────────────────────────────
export type GetAccountsResponse = ApiSuccessResponse<Account[]>;

export type GetAccountResponse = ApiSuccessResponse<Account>;

export type CreateAccountResponse = ApiSuccessResponse<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>;

export type UpdateAccountResponse = ApiSuccessResponse<Account>;

export type DeleteMultipleAccountsResponse = ApiSuccessResponse<{
  deletedCount: number;
  deletedAccountIds: string[];
}>;

export type DeleteAccountResponse = ApiSuccessResponse<{ id: string }>;
