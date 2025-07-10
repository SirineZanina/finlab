import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/assets/icons/arrowRight';
import AmountWidget from './amountWidget';
import StatsGrid from './statsGrid';

const Hero = () => {
  return (
    <section className='pt-8 pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#7EDEBC,#EFFFFC_66%)]'>
      <div className='container'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <div className='text-xs md:text-sm text-secondary-500 font-medium inline-flex border border-secondary-200 px-3 py-1 rounded-lg tracking-tight'>
				Try it now
            </div>
		  <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-black to-primary-600
		 	text-transparent bg-clip-text mt-6 pb-2'>Manage Your Finances With Complete Precision</h1>
		  <p className='text-sm sm:text-base lg:text-xl text-dark-blue tracking-tight mt-4'>We help you manage your business cashflow.
			we provide the best features that will help you to manage financial task easily.
            </p>
		  <div className='flex gap-1 items-center mt-[30px]'>
              <Button variant={'default'}>
				Get for free
              </Button>
              <Button variant={'text'} className='gap-1'>
            	<span>Learn more</span>
		    	<ArrowRight className='size-5'/>
              </Button>
		  </div>
          </div>
          <div className=''>
            <StatsGrid	/>
            {/* <div className='relative w-[300px] bg-primary-600 rounded-lg overflow-hidden'>
              <AmountWidget />

              <Image
                src='/images/hero.png'
                alt='hero image'
                width={300}
                height={400}
              />
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
