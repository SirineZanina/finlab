'use client';

import { useSearchParams, useRouter } from 'next/navigation';

import {
  cn,
  formUrlQuery,
  formatAmount,
  getAccountTypeColors,
} from '@/lib/utils';
import { BankInfoProps } from './bankInfo.types';
import { AccountType } from '@/types/account';
import ConnectBankIcon from '@/components/assets/icons/connectBankIcon';

const BankInfo = ({ account, accountId, type }: BankInfoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = accountId === account?.id;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: account?.id,
    });
    router.push(newUrl, { scroll: false });
  };

  const colors = getAccountTypeColors(account?.type as AccountType);

  return (
    <div
      onClick={handleBankChange}
      className={cn('bank-info bg-primary-100 rounded-xl', {
        'shadow-sm border-blue-700': type === 'card' && isActive,
        'rounded-xl': type === 'card',
        'hover:shadow-sm cursor-pointer': type === 'card',
      })}
    >
      <figure
        className={`flex-center h-fit rounded-full bg-blue-100 ${colors.lightBg}`}
      >
        <ConnectBankIcon
          className='m-2 min-w-5' fill='#23978D'
        />
      </figure>
      <div className="flex w-full flex-1 flex-col justify-center gap-1">
        <div className="bank-info_content">
          <h2
            className={`text-base line-clamp-1 flex-1 font-bold text-blue-900 ${colors.title}`}
          >
            {account.name}
          </h2>
          {type === 'full' && (
            <p
              className={`text-xs rounded-full px-3 py-1 font-medium text-blue-700 ${colors.subText} ${colors.lightBg}`}
            >
              {account.subtype}
            </p>
          )}
        </div>

        <p className={`text-base font-medium text-blue-700 ${colors.subText}`}>
          {formatAmount(Number(account.currentBalance))}
        </p>
      </div>
    </div>
  );
};

export default BankInfo;
