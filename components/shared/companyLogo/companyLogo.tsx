import React from 'react';
import Link from 'next/link';
import { FinlabIcon } from '../../assets/logos/finlabIcon';
import { FinlabLogo } from '../../assets/logos/finlabLogo';
import { CompanyLogoProps } from './companyLogo.types';
import { cn } from '@/lib/utils';

const CompanyLogo = ({ className } : CompanyLogoProps) => {
  return (
    <Link href="/" className={cn('cursor-pointer flex items-center gap-0.5', className)}>
      <FinlabIcon className="w-9 h-9" />
      <FinlabLogo className='w-20'/>
    </Link>
  );
};

export default CompanyLogo;
