import { Account } from '@/types/account';
import { UseFormSetValue } from 'react-hook-form';

export type BankDropdownProps = {
    accounts: Account[],
    setValue: UseFormSetValue<{
        amount: string;
        name: string;
        email: string;
        shareableId: string;
        senderBank: string;
    }>,
    otherStyles?: string
}
