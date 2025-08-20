import React from 'react';
import { ApiFormValues } from '@/features/transactions/components/transaction-form/transaction-form.types';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction';
import TransactionForm from '@/features/transactions/components/transaction-form/transaction-form';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';

const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();

  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({
      name
    });
  };
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
  }));

  const isPending =
  	createMutation.isPending ||
	categoryMutation.isPending ||
	accountMutation.isPending;

  const isLoading =
  categoryQuery.isLoading ||
  accountQuery.isLoading;

  const onSubmit = (values: ApiFormValues) => {
    console.log('Submitting new transaction:', values);
    createMutation.mutate(values, {
	  onSuccess: () => {
        onClose();
	  }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>
			New Transaction
          </SheetTitle>
		  <SheetDescription>
			Add a new transaction.
		  </SheetDescription>
        </SheetHeader>
        {isLoading
          ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='size-4 text-muted-foreground animate-spin' />
            </div>
          )
		  : (
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
        	/>
          )
        }
	  </SheetContent>
    </Sheet>
  );
};

export default NewTransactionSheet;
