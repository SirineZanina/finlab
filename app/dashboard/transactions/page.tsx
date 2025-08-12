'use client';
import React, { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
// Features
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';

import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';
// Components
import { DataTable } from '@/components/shared/data-table/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import UploadButton from './_components/upload-button/upload-button';
import ImportCard from './_components/import-card/import-card';
// Icons
import { Loader2, Plus } from 'lucide-react';
// Columns
import { columns } from './_components/columns/columns';
// Hooks
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
// Types
import { INITIAL_IMPORT_RESULTS, VARIANTS } from './page.types';
import { formattedDataType } from './_components/import-card/import-card.types';
import { Transaction } from '@/types/client/entities';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    // Set the import results and switch to the import variant
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);

  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];
  const newTransaction = useNewTransaction();
  const bulkCreateTransactions = useBulkCreateTransactions();

  const bulkDeleteTransactions = useBulkDeleteTransactions();

  const isDisabled = transactionsQuery.isLoading || bulkDeleteTransactions.isPending;

  const onSubmitImport = async (
    values: formattedDataType[],
  ) => {
    const accountId = await confirm();
    if (!accountId) {
      return toast.error('Please select an account to continue');
    }

    const data = values.map((value) => ({
      accountId: accountId as string,
      amount: value.amount as number,
      date: new Date(value.date).toISOString(),
      name: value.payee as string,
      payee: value.payee as string,
      paymentChannel: 'import',
      // Optional fields - include if available in your data
      notes: value.notes as string ?? '',
      pending: false,             // or value.pending if available
      image: undefined,           // or value.image if available
      categoryId: undefined,      // or value.categoryId if available
    }));

    bulkCreateTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    });

  };

  const handleDelete = (rows: Row<Transaction>[]) => {
    const ids = rows.map(row => row.original.id);
    const count = ids.length;

    // Show appropriate loading toast
    const loadingMessage = count === 1 ? 'Deleting transaction...' : `Deleting ${count} transactions...`;
    toast.loading(loadingMessage, { id: 'delete-transactions' });

    bulkDeleteTransactions.mutate(
      { transactionIds: ids },
      {
        onSuccess: () => {
          toast.dismiss('delete-transactions');
          if (count === 1) {
            toast.success('Transaction deleted successfully');
          } else {
            toast.success(`${count} transactions deleted successfully`);
          }
        },
        onError: () => {
          toast.dismiss('delete-transactions');
          if (count === 1) {
            toast.error('Failed to delete transaction');
          } else {
            toast.error('Failed to delete transactions');
          }
        }
      }
    );
  };

  if (transactionsQuery.isLoading) {
    return (
      <>
        <div className='flex flex-col gap-6'>
          <Skeleton className='h-8 w-48'/>
        </div>
        <div className='h-[500px] w-full flex items-center justify-center'>
          <Loader2 className='size-6 text-slate-300 animate-spin' />
        </div>
      </>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
	 	<AccountDialog />
	  	<ImportCard
          data={importResults.data}
		  onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
	  </>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      <DataTable
        columns={columns}
        data={transactions}
        filterKey='payee'
        onDelete={handleDelete}
        disabled={isDisabled}
        headerContent={
          <div className='flex flex-col w-full lg:w-auto lg:flex-row gap-2 items-center'>
		  <Button
              size="sm"
		  	  onClick={() => { newTransaction.onOpen();}}
			  className='w-full lg:w-auto'
		  >
              <Plus className='size-4' />
			Add new
            </Button>
		  <UploadButton
              onUpload={onUpload}
			  className='w-full lg:w-auto'
            />
		 </div>
        }
        deleteEntityName='transaction'
        deleteEntityNamePlural='transactions'
      />
    </div>
  );
};

export default TransactionsPage;
