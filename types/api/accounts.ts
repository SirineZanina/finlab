import { Account, User } from '@prisma/client';

// ─── Route Handler ───────────────────────────────────────
export type GetAccountsVariables = {
	userId: string;
	user: User;
}

export type GetAccountsResponse = {
	success: true;
	data: Account[];
	totalBanks: number;
	totalCurrentBalance: number;
}
