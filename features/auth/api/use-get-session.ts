import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';

export const useGetSession = () => {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      try {
        const response = await client.api.auth.session.$get();

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
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
