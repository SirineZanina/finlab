import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { AccountFormProps, formSchema, FormValues } from './account-form.types';
import { TrashIcon } from 'lucide-react';

const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
} : AccountFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
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
                  placeholder='e.g. Cash, Bank, Credit Card'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        >

        </FormField>
        <Button className='w-full' disabled={disabled}>
          {id ? 'Save changes' : 'Create Account'}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className='w-full'
            variant='outline'
          >
            <TrashIcon className='size-4 mr-2' />
            Delete account
          </Button>

        )
        }
      </form>

    </Form>
  );
};

export default AccountForm;
