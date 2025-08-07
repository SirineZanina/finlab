import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.accounts[':id']['$delete']>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
	ResponseType,
	Error
  >({
    mutationFn: async () => {
      if (!id) {
        throw new Error('Account ID is required');
      }

      const response = await client.api.accounts[':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Account deleted');

      // Remove the specific account query from cache instead of invalidating
      queryClient.removeQueries({
        queryKey: ['account', { id }]
      });

      // Invalidate the accounts list to refresh it
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      });

	   queryClient.invalidateQueries({
        queryKey: ['transactions']
      });

      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error('Failed to delete account');
    }
  });

  return mutation;
};
