import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { useAuth } from '@/features/auth/hooks/use-auth';

export const useGetCountries = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
	  try {
        // type safe RPC
        const response = await client.api.countries.$get();

        if (!response.ok) {
		  throw new Error(`Failed to fetch countries: ${response.status}`);
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
	  // Don't retry on 404 errors (no countries found)
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
