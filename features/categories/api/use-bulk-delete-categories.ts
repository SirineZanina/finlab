import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.categories['bulk-delete']['$delete']>;
type RequestType = InferRequestType<typeof client.api.categories['bulk-delete']['$delete']>['json'];

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.categories['bulk-delete']['$delete']({ json });
      return await response.json();
    },
    onSuccess: () => {
      // Use refetchQueries for immediate update
      queryClient.refetchQueries({
        queryKey: ['categories']
      });
      // Also invalidate to mark as stale
      queryClient.invalidateQueries({
        queryKey: ['categories']
      });

      queryClient.invalidateQueries({
        queryKey: ['summary']
	  });
    }
  });

  return mutation;
};
