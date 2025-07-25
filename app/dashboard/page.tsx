import React from 'react';
import TotalBalanceBox from './_nextjs/components/totalBalanceBox/totalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import RecentTransactions from './_nextjs/components/recentTransactions/recentTransactions';
import { getCurrentUser } from '../(auth)/_nextjs/currentUser';

const Home = async ({ searchParams }: {
  searchParams: Promise<{ id?: string; page?: string }>;
}) => {
  const { id, page } = await searchParams;
  const currentPage = Number(page) || 1;

  const loggedInUser = await getCurrentUser({ withFullUser: true });
  if (!loggedInUser) return;

  const data = await getAccounts(loggedInUser.id);

  if (!data) return;

  const accountsData = data?.data;

  if (!accountsData || accountsData.length === 0) return;

  const accountId = (id as string) || accountsData[0]?.id;

  const account = await getAccount(accountId);

  return (
    <section className='home no-scrollbar'>
      <div className='home-content no-scrollbar'>
        <TotalBalanceBox
          accounts={accountsData}
          totalBanks={data.totalBanks}
          totalCurrentBalance={data.totalCurrentBalance}
        />

        <RecentTransactions
          accounts={accountsData}
          initialTransactions={account?.transactions}
          accountId={accountId}
          page={currentPage}
        />
      </div>
      {/* {
        session.user && (
          <RightSidebar user={session?.user}/>
        )
      } */}
    </section>
  );
};

export default Home;
