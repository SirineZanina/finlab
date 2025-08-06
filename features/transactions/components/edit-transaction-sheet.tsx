import React from 'react';
import TransactionForm from '@/features/transactions/components/transaction-form/transaction-form';
import { ApiFormValues } from '@/features/transactions/components/transaction-form/transaction-form.types';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { Loader2 } from 'lucide-react';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useConfirm } from '@/hooks/use-confirm';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this transaction.'
  );

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => {
	  categoryMutation.mutate({
      name
	  });
  };
  const categoryOptions = (categoryQuery.data?.data ?? []).map((category) => ({
	  label: category.name,
	  value: category.id
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
	  accountMutation.mutate({
      name
	  });
  };
  const accountOptions = (accountQuery.data?.data ?? []).map((account) => ({
	  label: account.name,
	  value: account.id
  }));

  const isPending =
  	editMutation.isPending ||
	deleteMutation.isPending;

  const isLoading = transactionQuery.isLoading;

  const onSubmit = (values: ApiFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  const defaultValues = transactionQuery.data ? {
    name: transactionQuery.data.name,
    amount: transactionQuery.data.amount?.toString(),
    date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
    payee: transactionQuery.data.payee,
    paymentChannel: transactionQuery.data.paymentChannel,
    notes: transactionQuery.data.notes || '',
    categoryId: transactionQuery.data.category?.id,
    accountId: transactionQuery.data.account?.id,
  } : {
    name: '',
    amount: '',
    date: new Date(),
    payee: '',
    paymentChannel: '',
    notes: '',
    categoryId: undefined,
    accountId: '',
  };

  return (
    <>
      <ConfirmDialog />
	  <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>
			Edit Transaction
            </SheetTitle>
		  <SheetDescription>
			Edit an existing transaction.
		  </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='size-4 text-muted-foreground animate-spin' />
            </div>
          ) :
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
		  	  categoryOptions={categoryOptions}
			  accountOptions={accountOptions}
			  onCreateCategory={onCreateCategory}
			  onCreateAccount={onCreateAccount}
            />
          }
	  </SheetContent>
      </Sheet>
    </>
  );
};

export default EditTransactionSheet;
