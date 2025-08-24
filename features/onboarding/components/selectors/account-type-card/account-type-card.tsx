import React from 'react';
import { AccountTypeCardProps } from './account-type-card.types';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const AccountTypeCard = ({
  id,
  title,
  description,
  icon: Icon,
  isSelected,
  onClick
} : AccountTypeCardProps ) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        'w-full p-4 border-2 rounded-lg text-left transition-all duration-200 cursor-pointer',
        'hover:shadow-sm hover:scale-[1.02]',
        isSelected
          ? 'border-primary-500 bg-primary-50 scale-[1.01]'
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}>
      <div className='flex items-center space-x-4'>
        <div className='w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center'>
          <Icon className='w-6 h-6 text-white' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-lg mb-1 text-gray-900'>
            {title}
          </h3>
          <p className={cn(
            'text-sm text-gray-600',
            isSelected ? 'text-primary-700' : 'text-gray-500'
          )}>
            {description}
          </p>
        </div>

        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200',
          isSelected
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-600'
        )}>
          <ArrowRight className='w-5 h-5' />
        </div>
      </div>
    </div>
  );
};

export default AccountTypeCard;
