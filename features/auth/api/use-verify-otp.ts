import { client } from '@/lib/hono';
import { AuthResponse, VerifyOTPBody } from '@/types/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useVerifyOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerifyOTPBody): Promise<AuthResponse> => {
      try {
        const response = await client.api.auth['verify-otp'].$post({
          json: data
        });

        const result: AuthResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || 'Failed to verify OTP');
        }

        return result;
      } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch session-related queries after successful verification
      queryClient.invalidateQueries({ queryKey: ['auth'] });

      // If we got a token, you might want to store it or update auth state
      if (data.token) {
        // Handle token storage here if needed
        // localStorage.setItem('token', data.token); // Not recommended for artifacts
        console.log('OTP verified successfully, token received');
      }
    },
  });
};
