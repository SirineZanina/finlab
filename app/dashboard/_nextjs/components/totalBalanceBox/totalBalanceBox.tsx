import React from 'react';
import { TotalBalanceBoxProps } from './totalBalanceBox.types';
import AnimatedCounter from '../animatedCounter/animatedCounter';
import DoughnutChart from '../doughnutChart/doughnutChart';

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance = 1200.00
} : TotalBalanceBoxProps) => {
  return (
    <section className='total-balance'>
      <div className='flex size-full max-w-[180px] items-center sm:max-w-[120px]'>
        <DoughnutChart accounts={accounts} />
      </div>
      <div className='flex flex-col gap-6'>
        <h2 className='header-2'>
			Bank Accounts: {totalBanks}
        </h2>
        <div className='flex flex-col gap-2'>
          <p className='total-balance-label'>
			Total Current Balance
          </p>
		  <div className='total-balance-amount flex-center gap-2'>
            <AnimatedCounter amount={totalCurrentBalance} />
		  </div>

        </div>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
