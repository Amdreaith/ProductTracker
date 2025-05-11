
import { createContext, useContext, ReactNode } from "react";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { usePermissionsProvider } from "@/hooks/usePermissionsProvider";
import { AuthContextType, UserProfile, UserRole, TablePermission, TablePermissionRecord, ActionPermission } from "@/types/authTypes";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthProvider();
  const permissions = usePermissionsProvider(auth.isAdmin, auth.user?.id);

  const value: AuthContextType = {
    ...auth,
    ...permissions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export types for convenience
export type { UserProfile, UserRole, TablePermission, TablePermissionRecord, ActionPermission };
