'use client';
import CountUp from 'react-countup';
import { AnimatedCounterProps } from './animated-counter.types';
import { formatAmount } from '@/lib/utils';

const AnimatedCounter = ({ amount } : AnimatedCounterProps) => {
  return (
    <div className='w-full'>
      <CountUp
	  	preserveValue
        start={0}
        end={amount}
        decimals={2}
        decimalPlaces={2}
        formattingFn={formatAmount}
      />
    </div>
  );
};

export default AnimatedCounter;
