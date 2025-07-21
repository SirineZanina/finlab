'use server';
import React from 'react';
import TotalBalanceBox from './_nextjs/components/totalBalanceBox/totalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { SearchParamProps } from '@/types/pagination';
import RecentTransactions from './_nextjs/components/recentTransactions/recentTransactions';

const Home = async ({ params } : SearchParamProps) => {

  const { id, page} = await params;

  const currentPage = Number(page as string) || 1;

  const loggedInUser = await getLoggedInUser();
  const data = await getAccounts(loggedInUser.id);

  if (!data) return;

  const accountsData = data?.data;

  if (!accountsData || accountsData.length === 0) return;

  const plaidAccountId = (id as string) || accountsData[0]?.account_id;

  const account = await getAccount({ plaidAccountId });

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
          transactions={account?.transactions}
          plaidAccountId={plaidAccountId}
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
