import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from '@/components/assets/icons/arrowRightIcon';

const Hero = () => {
  return (
    <section className='pt-8 pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#7EDEBC,#EFFFFC_66%)]'>
      <div className='container'>
        <div className='grid grid-cols-4 gap-4 lg:gap-20'>
          <div className='col-span-4 md:col-span-2 '>
            <div className='tag'>
              	New features for active users
            </div>
		  <h1 className='text-3xl sm:text-4xl xl:text-5xl/14 font-bold tracking-tight bg-gradient-to-b from-black to-primary-600
		 	text-transparent bg-clip-text mt-5 pb-2'>Manage Your Finances With Complete Precision</h1>
		  <p className='text-sm sm:text-base xl:text-lg font-medium text-dark-blue mt-4'>
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
		  <div className='flex mt-6 md:mt-12 items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <p className='text-xl md:text-2xl xl:text-4xl font-bold text-primary-900'>
					290K<span className='text-primary-500'>+</span>
                </p>
                <span className='font-medium text-secondary-400 text-sm'>Downloaded</span>

			  </div>
			   <div className='flex flex-col gap-2'>
                <p className='text-xl md:text-2xl xl:text-4xl font-bold text-primary-900'>
					110K<span className='text-primary-500'>+</span>
                </p>
                <span className='font-medium text-secondary-400 text-sm'>Active users</span>

			  </div>
			   <div className='flex flex-col gap-2'>
                <p className='text-xl md:text-2xl xl:text-4xl font-bold text-primary-900'>
					900<span className='text-primary-500'>+</span>
                </p>
                <span className='font-medium text-secondary-400 text-sm'>Business teams</span>
			  </div>
		  </div>
          </div>
          <div className='col-span-4 md:col-span-2 flex justify-end'>
            <Image
              src={'/images/hero-img.png'}
              width={1801}
              height={1333}
              alt='Hero Image'
              className='w-full h-auto object-cover rounded-lg shadow-lg'
			  priority
            />
		 </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
