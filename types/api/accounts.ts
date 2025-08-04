import { Account, User } from '@prisma/client';

// ─── Route Handler Variables ───────────────────────────────────────
export type GetAccountsVariables = {
  userId: string;
  user: User;
  businessId: string;
}

// ─── API Response Types ───────────────────────────────────────
export type GetAccountsResponse = {
  success: true;
  data: Account[];
//   totalBanks: number;
//   totalCurrentBalance: number;
}

export type GetAccountResponse = {
	success: true,
	data: Account
}

export type CreateAccountResponse = {
  success: true;
  data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
  message: string;
}

export type UpdateAccountResponse = {
  success: true;
  data: Account;
  message: string;
}

export type DeleteMultipleAccountsResponse = {
	success: true;
	message: string;
	data: {
		deletedCount: number;
		deletedAccountIds: string[];
	};
}

export type DeleteAccountResponse = {
  success: true;
  message: string;
}
