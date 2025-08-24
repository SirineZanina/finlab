'use client';

import { User } from 'lucide-react';
import AccountTypeCard from '../account-type-card/account-type-card';
import { IndividualCardProps } from './individual-card.types';

const IndividualCard = ({
  isSelected,
  onSelect
} : IndividualCardProps) => {
  return (
    <AccountTypeCard
      id="individual"
      title="Individual"
      description="Personal account to manage your activities."
      icon={User}
      isSelected={isSelected}
      onClick={onSelect}
    />
  );
};

export default IndividualCard;
