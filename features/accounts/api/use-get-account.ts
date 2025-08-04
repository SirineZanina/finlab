import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { AppError } from '@/lib/errors/appError';
import { GetAccountResponse } from '@/types/api/accounts';

export const useGetAccount = (id?: string, options?: { enabled?: boolean }) => {
  const query = useQuery({
    enabled: !!id && (options?.enabled !== false),
    queryKey: ['account', { id }],
    queryFn: async (): Promise<GetAccountResponse> => {
      try {
        if (!id) {
          throw new AppError('NOT_FOUND', 'Account ID is required', 404);
        }

        const response = await client.api.accounts[':id'].$get({
          param: { id },
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch accounts: ${response.status}`);
        }

        const responseData = await response.json() as GetAccountResponse;
        return responseData;
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
