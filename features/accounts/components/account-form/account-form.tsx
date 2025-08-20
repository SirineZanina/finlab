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
import { AccountFormProps, FormValues } from './account-form.types';
import { TrashIcon } from 'lucide-react';
import { CreateAccountSchema } from '@/types/schemas/account-schema';

const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
} : AccountFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(CreateAccountSchema),
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
        className='space-y-4'
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
        />
        <FormField
          name='bankId'
          control={form.control}
          render={({ field }) => (
		  <FormItem>
              <FormLabel>Bank</FormLabel>
              <FormControl>
			  <Input
                  {...field}
                  disabled={disabled}
                  placeholder='e.g. Bank of America, Chase'
			  />
              </FormControl>
              <FormMessage />
		  </FormItem>
          )}
        />
        <FormField
		  name='currencyId'
		  control={form.control}
		  render={({ field }) => (
					  <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
			  <Input
                  {...field}
                  disabled={disabled}
                  placeholder='e.g. USD, EUR'
			  />
              </FormControl>
              <FormMessage />
					  </FormItem>
		  )}
        />
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
            <TrashIcon className='size-4' />
            Delete account
          </Button>

        )
        }
      </form>

    </Form>
  );
};

export default AccountForm;
