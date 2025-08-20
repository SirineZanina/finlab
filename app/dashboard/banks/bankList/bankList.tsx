'use client';
import { Account } from '@/types/client/entities';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import BankCard from './bankCard/bankCard';
import { BankListProps } from './bankList.types';

const BankList = ({ user }: BankListProps) => {

  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];

  return (
    <section className="flex">
      <div className='my-banks'>
        <h2 className='header-2'>Your cards</h2>
        <div className='flex flex-wrap gap-6'>
          {accounts.map((account: Account) => (
            <BankCard
              key={account.id}
              account={account}
              username={`${user.firstName} ${user.lastName}`}
              showBalance={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BankList;
