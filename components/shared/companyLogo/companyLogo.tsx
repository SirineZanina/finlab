import React from 'react';
import Link from 'next/link';
import { FinlabIcon } from '../../assets/logos/finlabIcon';
import { FinlabLogo } from '../../assets/logos/finlabLogo';
import { CompanyLogoProps } from './companyLogo.types';
import { cn } from '@/lib/utils';

const CompanyLogo = ({ className, hideTextLogo, fillIcon, fillLogo }: CompanyLogoProps) => {
  return (
    <Link href="/" className={cn(hideTextLogo ? 'flex items-center justify-center gap-3' : 'flex w-full items-center gap-3', className)}>
      <FinlabIcon className="w-8 h-8" fill={fillIcon} />
      <FinlabLogo className={cn(hideTextLogo ? 'hidden' : 'w-15 h-auto')} fill={fillLogo} />
    </Link>
  );
};

export default CompanyLogo;
