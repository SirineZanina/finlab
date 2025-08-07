import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
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
import { TrashIcon } from 'lucide-react';
import {
  formSchema,
  FormValues,
  TransactionFormProps
} from './transaction-form.types';
import DatePicker from '@/components/shared/date-picker/date-picker';
import { Select } from '@/components/shared/select/select';
import { Textarea } from '@/components/ui/textarea';
import AmountInput from '@/components/shared/amount-input/amount-input';
import { convertAmountToMiliunits } from '@/lib/utils';

const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory
} : TransactionFormProps) => {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: defaultValues
  });
  const handleSubmit = (values: FormValues) => {
    console.log('Form values from resolver:', values);

    const amount = parseFloat(values.amount);
    const amountToMiliunits = convertAmountToMiliunits(amount);

    const transformedData = {
      ...values,
      paymentChannel: 'manual',
      amount: amountToMiliunits,
      date: format(values.date, 'yyyy-MM-dd')
    };

    console.log('Transformed data being sent to API:', transformedData);

    onSubmit(transformedData);
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
              <FormLabel>Transaction Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
                  disabled={disabled}
                  placeholder='Add a transaction name'
                />
              </FormControl>
              <FormMessage />
              <FormMessage />
            </FormItem>
		  )}
        />
        <FormField
          name='date'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='accountId'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
				  value={field.value}
				  onChange={field.onChange}
				  options={accountOptions}
				  placeholder='Select an account'
				  disabled={disabled}
				  onCreate={onCreateAccount}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='categoryId'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
				  value={field.value}
				  onChange={field.onChange}
				  options={categoryOptions}
				  placeholder='Select a category'
				  disabled={disabled}
				  onCreate={onCreateCategory}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='payee'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
				  {...field}
				  value={field.value || ''}
				  disabled={disabled}
				  placeholder='Add a payee'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='notes'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
			 	  {...field}
                  value={field.value || ''}
                  disabled={disabled}
                  placeholder='Optional notes'
			    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
		  <FormField
          name='amount'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
			 	  {...field}
				  value={field.value}
                  disabled={disabled}
                  placeholder='0.00'
			    />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className='w-full'
          disabled={disabled}
        >
          {id ? 'Save changes' : 'Create Transaction'}
        </Button>
        {!!id && (
          <Button
            type='button'
            disabled={disabled}
            onClick={handleDelete}
            className='w-full'
            variant='outline'
          >
            <TrashIcon className='size-4' />
            Delete transaction
          </Button>
        )
        }
      </form>

    </Form>
  );
};

export default TransactionForm;
