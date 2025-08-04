import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.accounts['bulk-delete']['$delete']>;
type RequestType = InferRequestType<typeof client.api.accounts['bulk-delete']['$delete']>['json'];

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.accounts['bulk-delete']['$delete']({ json });
      return await response.json();
    },
    onSuccess: () => {
      // Use refetchQueries for immediate update
      queryClient.refetchQueries({
        queryKey: ['accounts']
      });
      // Also invalidate to mark as stale
      queryClient.invalidateQueries({
        queryKey: ['accounts']
      });
      // TODO: Also invalidate summary
    }
  });

  return mutation;
};
