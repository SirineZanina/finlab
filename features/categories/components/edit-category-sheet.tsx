import React from 'react';
import CategoryForm from '@/features/categories/components/category-form/category-form';
import { FormValues } from '@/features/categories/components/category-form/category-form.types';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useGetCategory } from '@/features/categories/api/use-get-category';
import { Loader2 } from 'lucide-react';
import { useEditCategory } from '@/features/categories/api/use-edit-category';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useConfirm } from '@/hooks/use-confirm';

const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this category.'
  );

  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);

  const isPending =
  	editMutation.isPending ||
	deleteMutation.isPending;

  const isLoading = categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
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

  const defaultValues = categoryQuery.data ? {
    name: categoryQuery.data.data.name
  } : { name: ''};

  return (
    <>
      <ConfirmDialog />
	  <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side='right'>
          <SheetHeader>
            <SheetTitle>
			Edit Category
            </SheetTitle>
		  <SheetDescription>
			Edit an existing category.
		  </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='size-4 text-muted-foreground animate-spin' />
            </div>
          ) :
            <CategoryForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          }
	  </SheetContent>
      </Sheet>
    </>
  );
};

export default EditCategorySheet;
