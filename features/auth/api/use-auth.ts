import { useGetCurrentUser } from './use-get-current-user';
import { useGetSession } from './use-get-session';
import { useLogout } from './use-logout';
import { useRequestOTP } from './use-request-otp';
import { useVerifyOTP } from './use-verify-otp';

export const useAuth = () => {
  const session = useGetSession();
  const currentUser = useGetCurrentUser();
  const requestOTP = useRequestOTP();
  const verifyOTP = useVerifyOTP();
  const logout = useLogout();

  return {
    // State
    user: session.data,
    isAuthenticated: !!session.data,
    isLoading: session.isLoading,
    isError: session.isError,

    // Actions
    requestOTP,
    verifyOTP,
    logout,

    // Utilities
    refetchSession: session.refetch,
    getCurrentUser: currentUser,
  };
};
