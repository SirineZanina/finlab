import { Button } from '@/components/ui/button';
import React from 'react';

const CallToAction = () => {
  return (
    <section className='bg-gradient-to-b from-white to-[#AFF7D5] py-24'>
      <div className='container text-center'>
        <div className='section-heading'>
          <h2 className='section-title'>Sign up for free today</h2>
          <p className='section-description mt-5'>
			Whether you&apos;re managing finances, setting goals,
			or simply enjoying the journey, our app is here to help you stay motivated and
			celebrate every step of the way.
          </p>
        </div>
        <div className='flex gap-2 mt-10 justify-center'>
          <Button variant='default'>Get for free</Button>
		  <Button variant='text'>Learn more</Button>
        </div>
	  </div>

    </section>
  );
};

export default CallToAction;
