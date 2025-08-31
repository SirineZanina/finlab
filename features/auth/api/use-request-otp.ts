import { client } from '@/lib/hono';
import { AuthResponse, RequestOTPBody } from '@/types/api/auth';
import { useMutation } from '@tanstack/react-query';

export const useRequestOTP = () => {
  return useMutation({
    mutationFn: async (data: RequestOTPBody): Promise<AuthResponse> => {
      try {
        const response = await client.api.auth['request-otp'].$post({
          json: data
        });

        const result: AuthResponse = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || 'Failed to request OTP');
        }

        return result;
      } catch (error) {
        console.error('Request OTP error:', error);
        throw error;
      }
    },
  });
};
