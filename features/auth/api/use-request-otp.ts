// import { client } from '@/lib/hono';
// import { AuthResponse, RequestOTPBody } from '@/types/api/auth';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { InferResponseType } from 'hono';
// import { toast } from 'sonner';

// type ResponseType = InferResponseType<typeof client.api.auth['request-otp']['$post']>;

// export const useRequestOTP = () => {

//   const queryClient = useQueryClient();

//   const mutation = useMutation<
// 	ResponseType,
// 	Error,
// 	RequestOTPBody
//   >({
//     mutationFn: async (json) => {
// 	  const response = await client.api.auth['request-otp'].$post({ json });
// 	  return await response.json();
//     },
//     onSuccess: () => {
// 	  toast.success('OTP sent successfully');
// 	  // Invalidate any queries that might be affected by the OTP request
// 	  queryClient.invalidateQueries({ queryKey: ['user'] });
// 	  queryClient.invalidateQueries({ queryKey: ['auth'] });
//     },
//     onError: () => {
// 	  toast.error('Failed to send OTP. Please try again.');
//     }
//   });
//   return mutation;
// };
