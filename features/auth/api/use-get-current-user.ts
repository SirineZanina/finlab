import { client } from '@/lib/hono';
import { AuthResponse } from '@/types/api/auth';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '../hooks/use-session';

export const useGetCurrentUser = () => {
  const { user, loading } = useSession();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await client.api.auth.me.$get();

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data: AuthResponse = await response.json();
        return data;
      } catch (error) {
        console.error('Get current user error:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Only enable if we have a user session and it's not loading
    enabled: !!user && !loading,
  });
};
