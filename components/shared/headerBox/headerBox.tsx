import React from 'react';
import { HeaderBoxProps } from './headerBox.types';
import { Sparkles } from 'lucide-react';

const HeaderBox = ({ pathLocation, subtitle }: HeaderBoxProps) => {
  return (
    <div className='overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600  to-primary-700
	 p-5 shadow-xl mb-6'>
      <div className='flex items-center gap-2 mb-3'>
        <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
          <Sparkles size={20} className='text-white' />
        </div>
        <h1 className='text-2xl font-bold text-white leading-tight'>
          {pathLocation === 'Home' ? 'Welcome to your Dashboard' : pathLocation}
        </h1>
      </div>

      {subtitle && (
        <p className='text-primary-100 text-base font-medium leading-relaxed max-w-2xl'>
          {pathLocation === 'Home'
            ? 'Track your financial performance at a glance'
            : subtitle
          }
        </p>
      )}
    </div>
  );
};

export default HeaderBox;
