'use client';
import React from 'react';
import { useSession } from '@/hooks';
import HeaderBox from './_nextjs/components/headerBox/headerBox';
import TotalBalanceBox from './_nextjs/components/totalBalanceBox/totalBalanceBox';
import Header from './_nextjs/components/header/header';

const Home = () => {

  const session = useSession();

  return (
    <section className='home no-scrollbar'>
      <div className='home-content no-scrollbar'>
        <header className='home-header'>
          <Header />

        </header>

				  <TotalBalanceBox totalBanks={3} totalCurrentBalance={1200}  />

      </div>

    </section>
  );
};

export default Home;
