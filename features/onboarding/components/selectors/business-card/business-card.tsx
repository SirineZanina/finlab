import React from 'react';
import AccountTypeCard from '../account-type-card/account-type-card';
import { BusinessCardProps } from './business-card.types';
import { Building2 } from 'lucide-react';

const BusinessCard = ({
  isSelected,
  onSelect
} : BusinessCardProps) => {
  return (
    <AccountTypeCard
      id='business'
      title='Business'
      description='Own or belong to a company, this is for you.'
      icon={Building2}
      isSelected={isSelected}
      onClick={onSelect}
    />
  );
};

export default BusinessCard;
