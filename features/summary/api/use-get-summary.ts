import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useSearchParams } from 'next/navigation';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetSummary = () => {

  const params = useSearchParams();
  const from = params.get('from') || undefined;
  const to = params.get('to') || undefined;
  const accountId = params.get('accountId') || undefined;

  const query = useQuery({
    queryKey: ['summary', { from, to, accountId }],
    queryFn: async () => {
	  try {
        console.log('GET request params:', { from, to, accountId }); // Add this

        // type safe RPC
        const response = await client.api.summary.$get({
		  query: {
            from,
            to,
            accountId
		  }
        });

        if (!response.ok) {
		  throw new Error(`Failed to fetch summary: ${response.status}`);
        }

        const { data } = await response.json();

        return {
          ...data,
          incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
		  expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
		  remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
		  categories: data.categories.map(category => ({
            ...category,
            value: convertAmountFromMiliunits(category.value)
		  })),
		  days: data.days.map(day => ({
            ...day,
            income: convertAmountFromMiliunits(day.income),
            expenses: convertAmountFromMiliunits(day.expenses),
		  }))
        };

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
