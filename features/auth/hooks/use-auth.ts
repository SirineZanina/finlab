import { useQuery } from '@tanstack/react-query';

// Client-side hook that checks auth status
export const useAuth = () => {
  const query = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      try {
        // Since we're on the client, we need to make a request to check session
        const response = await fetch('/api/auth/session', {
          credentials: 'include', // Important: include cookies
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return data.user;
      } catch (error) {
        console.error('Session check error:', error);
        return null;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on auth failures
      return failureCount < 1;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Recheck when window regains focus
  });

  return {
    user: query.data,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
