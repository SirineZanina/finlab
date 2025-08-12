import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useSearchParams } from 'next/navigation';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetTransactions = () => {

  const params = useSearchParams();
  const from = params.get('from') || undefined;
  const to = params.get('to') || undefined;
  const accountId = params.get('accountId') || undefined;

  const query = useQuery({
    // TODO: check if params are needed in the key.
    queryKey: ['transactions', { from, to, accountId }],
    queryFn: async () => {
      try {
		    console.log('GET request params:', { from, to, accountId }); // Add this

        // type safe RPC
        const response = await client.api.transactions.$get({
          query: {
            from,
            to,
            accountId
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`);
        }

        const responseData = await response.json();

        return responseData.data.map((transaction) => ({
          ...transaction,
          amount: convertAmountFromMiliunits(transaction.amount)
        }));

      } catch (error) {
        console.error('Query function error:', error);
        throw error;
      }
    },
    // Add retry configuration to prevent infinite retries on 404
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (no transactions found)
      if (error.message.includes('404')) {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
    // Add stale time to prevent unnecessary refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Cache time
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return query;
};
