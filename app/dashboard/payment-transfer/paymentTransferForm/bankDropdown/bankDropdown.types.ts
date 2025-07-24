import { Account } from '@/types/account';
import { UseFormSetValue } from 'react-hook-form';

export type BankDropdownProps = {
	accounts: Account[],
	setValue: UseFormSetValue<any>,
	otherStyles?: string
}
