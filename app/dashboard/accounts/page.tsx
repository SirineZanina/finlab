'use client';
import { Button } from '@/components/ui/button';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { Plus } from 'lucide-react';
import React from 'react';

const Accounts = () => {

  const newAccount = useNewAccount();
  return (
    <div>
		Accounts Page
      <Button onClick={newAccount.onOpen} size="sm">
        <Plus className='size-4' />
		Add new
	  </Button>
    </div>
  );
};

export default Accounts;
