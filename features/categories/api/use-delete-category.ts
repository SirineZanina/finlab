import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.categories[':id']['$delete']>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
	ResponseType,
	Error
  >({
    mutationFn: async () => {
      if (!id) {
        throw new Error('Category ID is required');
      }

      const response = await client.api.categories[':id']['$delete']({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Category deleted');

      // Remove the specific category query from cache instead of invalidating
      queryClient.removeQueries({
        queryKey: ['category', { id }]
      });

      // Invalidate the categories list to refresh it
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });

      // TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error('Failed to delete category');
    }
  });

  return mutation;
};
