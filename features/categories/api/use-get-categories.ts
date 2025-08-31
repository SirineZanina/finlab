import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useAuth } from '@/features/auth/api/use-auth';

export const useGetCategories = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        // type safe RPC
        const response = await client.api.categories.$get();

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const { data } = await response.json();
        return data;

      } catch (error) {
        console.error('Query function error:', error);
        throw error;
      }
    },
    enabled: isAuthenticated && !authLoading, // Only run when authenticated

    // Add retry configuration to prevent infinite retries on 404
    retry: (failureCount, error) => {
      // Don't retry on 404 errors (no categories found)
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
