import React from 'react';
import Link from 'next/link';
import { FinlabIcon } from '../../assets/logos/finlabIcon';
import { FinlabLogo } from '../../assets/logos/finlabLogo';
import { CompanyLogoProps } from './companyLogo.types';
import { cn } from '@/lib/utils';

const CompanyLogo = ({ className, hideTextLogo } : CompanyLogoProps) => {
  return (
    <Link href="/" className={cn('cursor-pointer flex items-center gap-3', className)}>
      <FinlabIcon className="w-8 h-8" />
      {!hideTextLogo && <FinlabLogo className='w-15' />}
    </Link>
  );
};

export default CompanyLogo;
