'use client';
import React from 'react';
import { columns } from './columns';
import { DataTable } from '@/components/shared/data-table/data-table';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plus } from 'lucide-react';
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';

const Accounts = () => {
  const bulkDeleteAccounts = useBulkDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data?.data || [];
  const newAccount = useNewAccount();

  const isDisabled = accountsQuery.isLoading || bulkDeleteAccounts.isPending;

  const handleDelete = (row: any[]) => {
    const ids = row.map(r => r.original.id);
    const count = ids.length;

    // Show appropriate loading toast
    const loadingMessage = count === 1 ? 'Deleting account...' : `Deleting ${count} accounts...`;
    toast.loading(loadingMessage, { id: 'delete-accounts' });

    bulkDeleteAccounts.mutate(
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
        headerContent={
          <Button onClick={() => { newAccount.onOpen();}} size="sm" >
            <Plus className='size-4 mr-2' />
			Add new
          </Button>
        }
        deleteEntityName='account'
        deleteEntityNamePlural='accounts'
      />
    </div>
  );
};

export default Accounts;
