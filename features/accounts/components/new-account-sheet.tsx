import React from 'react';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import AccountForm from '@/features/accounts/components/account-form/account-form';
import { FormValues } from '@/features/accounts/components/account-form/account-form.types';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const mutation = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose} >
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>
			New Account
          </SheetTitle>
		  <SheetDescription>
			Create a new account to track your transactions.
		  </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
		  disabled={mutation.isPending}
          defaultValues={{
            name: '',
            bankId: '',
            currencyId: ''
		  }}
        />
	  </SheetContent>
    </Sheet>
  );
};

export default NewAccountSheet;
