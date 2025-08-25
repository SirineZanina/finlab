import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SessionContext } from '@/providers/session-provider';

export const useAuth = () => {
  const sessionContext = useContext(SessionContext);

  // Always call useQuery unconditionally to comply with React Hooks rules
  const query = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
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
      return failureCount < 1;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    // Only run if we don't have session context
    enabled: !sessionContext || sessionContext.loading,
  });

  // If we have session data from the server context, use it
  if (sessionContext && !sessionContext.loading) {
    return {
      user: sessionContext.user,
      isAuthenticated: !!sessionContext.user,
      isLoading: false,
      isError: false,
      refetch: () => {}, // No-op since we're using server data
    };
  }

  // Fallback to API call only if no session context (shouldn't happen in your setup)
  return {
    user: query.data,
    isAuthenticated: !!query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
