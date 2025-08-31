import { client } from '@/lib/hono';
import { AuthResponse } from '@/types/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<AuthResponse> => {
      try {
        const response = await client.api.auth.logout.$post();

        const result: AuthResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || 'Failed to logout');
        }

        return result;
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Clear all auth-related queries after logout
      queryClient.removeQueries({ queryKey: ['auth'] });

      // Clear any stored tokens
      // localStorage.removeItem('token'); // Not recommended for artifacts

      // Optionally redirect to login page
      // window.location.href = '/login';
    },
  });
};
