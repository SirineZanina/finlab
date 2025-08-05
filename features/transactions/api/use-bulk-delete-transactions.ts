import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.transactions['bulk-delete']['$delete']>;
type RequestType = InferRequestType<typeof client.api.transactions['bulk-delete']['$delete']>['json'];

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.transactions['bulk-delete']['$delete']({ json });
      return await response.json();
    },
    onSuccess: () => {
      // Use refetchQueries for immediate update
      queryClient.refetchQueries({
        queryKey: ['transactions']
      });
      // Also invalidate to mark as stale
      queryClient.invalidateQueries({
        queryKey: ['transactions']
      });
      // TODO: Also invalidate summary
    }
  });

  return mutation;
};
