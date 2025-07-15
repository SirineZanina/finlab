'use client';
import React from 'react';
import { useSession } from '@/hooks';
import TotalBalanceBox from './_nextjs/components/totalBalanceBox/totalBalanceBox';

const Home = () => {

  const session = useSession();

  return (
    <section className='home no-scrollbar'>
      <div className='home-content no-scrollbar'>
        <TotalBalanceBox totalBanks={3} totalCurrentBalance={1200}  />

      </div>

    </section>
  );
};

export default Home;
