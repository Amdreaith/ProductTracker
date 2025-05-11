
import { useAuthentication } from "./useAuthentication";
import { useAuthOperations } from "./useAuthOperations";
import { useUserProfiles } from "./useUserProfiles";

export function useAuthProvider() {
  const auth = useAuthentication();
  const authOperations = useAuthOperations();
  const userProfiles = useUserProfiles();

  return {
    // Auth state
    user: auth.user,
    session: auth.session,
    isLoading: auth.isLoading || authOperations.isLoading,
    isAdmin: auth.isAdmin,
    
    // Auth operations
    login: authOperations.login,
    signup: authOperations.signup,
    logout: authOperations.logout,
    
    // User profile operations
    getUserProfile: userProfiles.getUserProfile,
    updateUserRole: userProfiles.updateUserRole,
    fetchAllUsers: userProfiles.fetchAllUsers
  };
}
