import { useGetCurrentUser } from './use-get-current-user';
import { useGetSession } from './use-get-session';
import { useLogout } from './use-logout';

export const useAuth = () => {

  const session = useGetSession();
  const currentUser = useGetCurrentUser();
  const logout = useLogout();

  return {
    // State
    user: session.data,
    isAuthenticated: !!session.data,
    isLoading: session.isLoading,
    isError: session.isError,

    // Actions
    logout,

    // Utilities
    refetchSession: session.refetch,
    getCurrentUser: currentUser,
  };
};
