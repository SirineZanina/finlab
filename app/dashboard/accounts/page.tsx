'use client';
import React from 'react';
import { columns } from './columns';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { useDeleteMultipleAccounts } from '@/features/accounts/api/use-bulk-delete';
import { toast } from 'sonner';

const Accounts = () => {
  const deleteMultipleAccounts = useDeleteMultipleAccounts();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data?.data || [];

  const isDisabled = accountsQuery.isLoading || deleteMultipleAccounts.isPending;

  const handleDelete = (row: any[]) => {
    const ids = row.map(r => r.original.id);
    const count = ids.length;

    // Show appropriate loading toast
    const loadingMessage = count === 1 ? 'Deleting account...' : `Deleting ${count} accounts...`;
    toast.loading(loadingMessage, { id: 'delete-accounts' });

    deleteMultipleAccounts.mutate(
      { accountIds: ids },
      {
        onSuccess: () => {
          toast.dismiss('delete-accounts');
          if (count === 1) {
            toast.success('Account deleted successfully');
          } else {
            toast.success(`${count} accounts deleted successfully`);
          }
        },
        onError: () => {
          toast.dismiss('delete-accounts');
          if (count === 1) {
            toast.error('Failed to delete account');
          } else {
            toast.error('Failed to delete accounts');
          }
        }
      }
    );
  };

  if (accountsQuery.isLoading) {
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
        data={accounts}
        filterKey='name'
        onDelete={handleDelete}
        disabled={isDisabled}
      />
    </div>
  );
};

export default Accounts;
