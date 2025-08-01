import { Account } from '@/types/account';

export type TotalBalanceBoxProps = {
	accounts?: Account[],
	totalBanks: number | undefined;
	totalCurrentBalance: number | undefined;
}

