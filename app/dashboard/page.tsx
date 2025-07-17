'use client';
import React from 'react';
import TotalBalanceBox from './_nextjs/components/totalBalanceBox/totalBalanceBox';
import RightSidebar from './_nextjs/components/rightSideBar/rightSidebar';
import { useSession } from '@/hooks';
const Home = () => {

  const session = useSession();

  console.log('session', session);

  return (
    <section className='home no-scrollbar'>
      <div className='home-content no-scrollbar'>
        <TotalBalanceBox totalBanks={3} totalCurrentBalance={1200}  />
		RECENT TRANSACTIONS
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
