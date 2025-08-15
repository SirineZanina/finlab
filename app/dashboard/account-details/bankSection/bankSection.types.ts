import { Account } from '@/types/client/entities';
import { User } from '@/types/client/user';

export type BankSectionProps = {
	user: User;
	accounts: Account[];
}
