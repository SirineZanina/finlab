'use client';
import React from 'react';
import TotalBalanceBox from './_nextjs/components/totalBalanceBox/totalBalanceBox';
import RecentTransactions from './_nextjs/components/recentTransactions/recentTransactions';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { onOpen } = useNewAccount();

  const { data: accounts, isLoading, error, isError } = useGetAccounts();

  console.log('Accounts data:', accounts);

  //   console.log('Query state:', { accounts, isLoading, error, isError });

  //   if (isLoading) {
  //     return <div>Loading accounts...</div>;
  //   }

  //   if (isError) {
  //     console.error('Accounts error:', error);
  //     return <div>Error loading accounts: {error?.message}</div>;
  //   }

  //   if (!accounts) {
  //     return <div>No accounts data available</div>;
  //   }

  //   // Check if accounts.data exists and has items
  //   if (!accounts.data || accounts.data.length === 0) {
  //     return <div>No accounts found</div>;
  //   }

  return (
    <section className='home no-scrollbar'>
      <div className='home-content no-scrollbar'>
        {/* <TotalBalanceBox
          accounts={accounts?.data}
          totalBanks={accounts?.totalBanks}
          totalCurrentBalance={accounts?.totalCurrentBalance}
        /> */}
        <Button className='mb-4' onClick={onOpen}>
		  Create New Account
        </Button>

        {/* <RecentTransactions
          accounts={accounts.data}
          initialTransactions={}
          accountId={accountId}
          page={currentPage}
        /> */}
      </div>
    </section>
  );
};

export default Home;
