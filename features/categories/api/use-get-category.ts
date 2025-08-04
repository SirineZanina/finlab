import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { AppError } from '@/lib/errors/appError';
import { GetCategoryResponse } from '@/types/api/categories';

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['category', { id }],
    queryFn: async (): Promise<GetCategoryResponse> => {
      try {
        if (!id) {
          throw new AppError('NOT_FOUND', 'Category ID is required', 404);
        }

        const response = await client.api.categories[':id'].$get({
          param: { id },
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const responseData = await response.json() as GetCategoryResponse;
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
