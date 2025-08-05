import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.transactions[':id']['$delete']>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
	ResponseType,
	Error
  >({
    mutationFn: async () => {
      if (!id) {
        throw new Error('Transaction ID is required');
      }

      const response = await client.api.transactions[':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transaction deleted');

      // Remove the specific transaction query from cache instead of invalidating
      queryClient.removeQueries({
        queryKey: ['transaction', { id }]
      });

      // Invalidate the transactions list to refresh it
      queryClient.invalidateQueries({
        queryKey: ['transactions']
      });

      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error('Failed to delete transaction');
    }
  });

  return mutation;
};
