import Link from 'next/link';
import BankCard from './bankCard/bankCard';
import { PlusIcon } from '@/components/assets/icons/plusIcon';
import { BankSectionProps } from './bankSection.types';

const BankSection = ({ user, accounts }: BankSectionProps) => {

  return (
    <section>
      <div className="flex w-full justify-between">
        <h2 className="header-2">My Banks</h2>
        <Link href="/dashboard/banks" className="flex gap-2">
          <PlusIcon />
          <h2 className="text-base font-semibold text-gray-600">
              Add Bank
          </h2>
        </Link>
      </div>

      {accounts?.length > 0 && (
        <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
          <div className='relative z-10'>
            <BankCard
              key={accounts[0].id}
              account={accounts[0]}
              username={`${user.firstName} ${user.lastName}`}
              showBalance={false}
            />
          </div>
          {accounts[1] && (
            <div className="absolute right-0 top-8 z-0 w-[90%]">
              <BankCard
                key={accounts[1].id}
                account={accounts[1]}
                username={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
          )}
        </div>
      )}

    </section>
  );
};

export default BankSection;
