import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/assets/icons/arrowRight';

const Hero = () => {
  return (
    <section className='pt-8 pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#7EDEBC,#EFFFFC_66%)]'>
      <div className='container'>
        <div className='grid grid-cols-4 gap-4'>
          <div className='col-span-4 md:col-span-2 '>
            <div className=' flex items-center w-fit font-medium bg-secondary-200/40 rounded-4xl p-1'>
              <Button variant={'default'} className='rounded-4xl px-3 py-0.5'>
                <span className='text-xs'>News!</span>
              </Button>
			  <span className='p-2 text-xs '>
				Update New features for active users
			  </span>
            </div>
		  <h1 className='text-3xl sm:text-4xl md:text-5xl/14 font-bold tracking-tight bg-gradient-to-b from-black to-primary-600
		 	text-transparent bg-clip-text mt-6 pb-2'>Manage Your Finances With Complete Precision</h1>
		  <p className='text-sm sm:text-base lg:text-xl font-medium text-dark-blue mt-4'>
			A comprehensive financial management tool designed to help you track your income, expenses, and investments with ease.
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
          <div className='col-span-4 md:col-span-2 flex justify-end'>
            <Image
              src={'/images/hero-img.png'}
              width={1801}
              height={1333}
              alt='hero image'
              className='w-full h-auto object-cover rounded-lg shadow-lg'
            />
		 </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
