'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select';
import { formUrlQuery } from '@/lib/utils';
import { BankDropdownProps } from './bankDropdown.types';
import { CreditCardIcon } from '@/components/assets/icons/creditCardIcon';
import { Account } from '@/types/client/entities';

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<Account | null>(null);

  // Initialize selected account when accounts are available
  useEffect(() => {
    if (accounts.length > 0 && !selected) {
      const firstAccount = accounts[0];
      setSelected(firstAccount);

      // Set the initial value in the form
      if (setValue) {
        setValue('senderBank', firstAccount.id);
      }
    }
  }, [accounts, selected, setValue]);

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.id === id);

    if (!account) return;

    setSelected(account);

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: id,
    });
    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue('senderBank', id);
    }
  };

  // Don't render if no accounts or no selected account
  if (!accounts.length || !selected) {
    return (
      <div className="flex w-full bg-gray-100 gap-3 md:w-[300px] p-3 rounded border">
        <p className="text-gray-500">No bank accounts available</p>
      </div>
    );
  }

  return (
    <Select
      value={selected.id}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex w-full bg-white gap-3 md:w-[300px] ${otherStyles}`}
      >
        <CreditCardIcon />
        <p className="line-clamp-1 w-full text-left">{selected.name}</p>
      </SelectTrigger>
      <SelectContent
        className={`w-full bg-white md:w-[300px] ${otherStyles}`}
        align="end"
      >
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">
            Select a bank to display
          </SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem
              key={account.id}
              value={account.id}
              className="cursor-pointer border-t"
            >
              <div className="flex flex-col ">
                <p className="font-medium">{account.name}</p>

              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
