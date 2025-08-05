import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { AppError } from '@/lib/errors/appError';

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['transaction', { id }],
    queryFn: async () => {
      try {
        if (!id) {
          throw new AppError('NOT_FOUND', 'Transaction ID is required', 404);
        }

        const response = await client.api.transactions[':id'].$get({
          param: { id },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`);
        }

        const { data } = await response.json();
        return data ;
      } catch (error) {
        console.error('Query function error:', error);
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error.message.includes('404')) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return query;
};
