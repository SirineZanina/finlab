// import { client } from '@/lib/hono';
// import { VerifyOTPBody } from '@/types/api/auth';
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// import { InferResponseType } from 'hono';
// import { toast } from 'sonner';

// type ResponseType = InferResponseType<typeof client.api.auth['verify-otp']['$post']>;

// export const useVerifyOTP = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation<
//   ResponseType,
//   Error,
//   VerifyOTPBody
//   >({
//     mutationFn: async (json) => {
// 	  const response = await client.api.auth['verify-otp'].$post({ json });
// 	  return await response.json();
//     },
//     onSuccess: () => {
// 	 	toast.success('OTP verified successfully');
// 	 // Invalidate any queries that might be affected by the OTP verification
// 	 	queryClient.invalidateQueries({ queryKey: 	['user']
// 	 	});
// 	 queryClient.invalidateQueries({ queryKey: ['auth']
// 	 });
//     }
//     ,
//     onError: () => {
//       toast.error('Failed to verify OTP. Please try again.');
//     }
//   });
//   return mutation;

// };
