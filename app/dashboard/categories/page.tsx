'use client';
import React from 'react';
import { Row } from '@tanstack/react-table';
import { toast } from 'sonner';
// Components
import { DataTable } from '@/components/shared/data-table/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { columns } from './_components/columns';
// Icons
import { Loader2, Plus } from 'lucide-react';
// API
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories';
// Hooks
import { useNewCategory } from '@/features/categories/hooks/use-new-category';
// Types
import { Category } from '@/types/category';

const Categories = () => {
  const bulkDeleteCategories = useBulkDeleteCategories();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data?.data || [];
  const newCategory = useNewCategory();

  const isDisabled = categoriesQuery.isLoading || bulkDeleteCategories.isPending;

  const handleDelete = (rows: Row<Category>[]) => {
    const ids = rows.map(row => row.original.id);
    const count = ids.length;

    // Show appropriate loading toast
    const loadingMessage = count === 1 ? 'Deleting category...' : `Deleting ${count} categories...`;
    toast.loading(loadingMessage, { id: 'delete-categories' });

    bulkDeleteCategories.mutate(
      { categoryIds: ids },
      {
        onSuccess: () => {
          toast.dismiss('delete-categories');
          if (count === 1) {
            toast.success('Category deleted successfully');
          } else {
            toast.success(`${count} categories deleted successfully`);
          }
        },
        onError: () => {
          toast.dismiss('delete-categories');
          if (count === 1) {
            toast.error('Failed to delete category');
          } else {
            toast.error('Failed to delete categories');
          }
        }
      }
    );
  };

  if (categoriesQuery.isLoading) {
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
        data={categories}
        filterKey='name'
        onDelete={handleDelete}
        disabled={isDisabled}
        headerContent={
          <Button
		  	size="sm"
		  	onClick={() => { newCategory.onOpen(); }}
            className='w-full lg:w-auto'
          >
            <Plus className='size-4' />
				Add new
          </Button>
        }
        deleteEntityName='category'
        deleteEntityNamePlural='categories'
      />
    </div>
  );
};

export default Categories;
