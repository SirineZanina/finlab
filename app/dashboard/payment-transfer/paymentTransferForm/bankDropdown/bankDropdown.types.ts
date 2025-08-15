import { Account } from '@/types/client/entities';
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
