'use client';
import React from 'react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
// Components
import { DataTable } from '@/components/shared/data-table/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
// Icons
import { Loader2, Plus } from 'lucide-react';
// Columns
import { columns } from './_components/columns';
// API
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useBulkDeleteAccounts } from '@/features/accounts/api/use-bulk-delete-accounts';
// Hooks
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
// Types
import { Account } from '@/types/account';

const Accounts = () => {
  const bulkDeleteAccounts = useBulkDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data?.data || [];
  const newAccount = useNewAccount();

  const isDisabled = accountsQuery.isLoading || bulkDeleteAccounts.isPending;

  const handleDelete = (rows: Row<Account>[]) => {
    const ids = rows.map(row => row.original.id);
    const count = ids.length;

    console.log('Rows',rows.map(row => row.original)); // Log the actual account data

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
          <Button
		    size="sm"
		  	onClick={() => { newAccount.onOpen();}}
            className='w-full lg:w-auto'
		 >
            <Plus className='size-4' />
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
