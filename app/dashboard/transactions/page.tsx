'use client';
import React from 'react';
import { columns } from './columns';
import { DataTable } from '@/components/shared/data-table/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';

const Transactions = () => {
  const bulkDeleteTransactions = useBulkDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data?.data || [];
  const newTransaction = useNewTransaction();

  const isDisabled = transactionsQuery.isLoading || bulkDeleteTransactions.isPending;

  const handleDelete = (row: any[]) => {
    const ids = row.map(r => r.original.id);
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

  return (
    <div className='flex flex-col gap-6'>
      <DataTable
        columns={columns}
        data={transactions}
        filterKey='name'
        onDelete={handleDelete}
        disabled={isDisabled}
        headerContent={
          <Button onClick={() => { newTransaction.onOpen();}} size="sm" >
            <Plus className='size-4 mr-2' />
			Add new
          </Button>
        }
        deleteEntityName='transaction'
        deleteEntityNamePlural='transactions'
      />
    </div>
  );
};

export default Transactions;
