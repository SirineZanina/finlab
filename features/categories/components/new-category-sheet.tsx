import React from 'react';
import { useNewCategory } from '@/features/categories/hooks/use-new-category';
import CategoryForm from '@/features/categories/components/category-form/category-form';
import { FormValues } from '@/features/categories/components/category-form/category-form.types';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
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
			New Category
          </SheetTitle>
		  <SheetDescription>
			Create a new category to organize your transactions.
		  </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
		  disabled={mutation.isPending}
          defaultValues={{
            name: ''
		  }}
        />
	  </SheetContent>
    </Sheet>
  );
};

export default NewCategorySheet;
