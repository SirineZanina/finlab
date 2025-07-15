'use client';
import React from 'react';
import { AnimatedCounterProps } from './animatedCounter.types';
import CountUp from 'react-countup';

const AnimatedCounter = ({ amount } : AnimatedCounterProps) => {
  return (
    <div className='w-full'>
      <CountUp
	  	duration={2}
        decimals={2}
        decimal=","
        prefix='$'
        end={amount}
      />
    </div>
  );
};

export default AnimatedCounter;
