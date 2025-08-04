import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { CategoryFormProps, formSchema, FormValues } from './category-form.types';
import { TrashIcon } from 'lucide-react';

const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
} : CategoryFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-4 p-4'
      >
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder='e.g. Food, Travel, etc.'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        >

        </FormField>
        <Button className='w-full' disabled={disabled}>
          {id ? 'Save changes' : 'Create Category'}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className='w-full'
            variant='outline'
          >
            <TrashIcon className='size-4' />
            Delete category
          </Button>

        )
        }
      </form>

    </Form>
  );
};

export default CategoryForm;
