
import { createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { usePermissionsProvider } from "@/hooks/usePermissionsProvider";
import { UserProfile, UserRole, TablePermission, TablePermissionRecord, ActionPermission } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  fetchAllUsers: () => Promise<UserProfile[]>;
  // Table permissions
  getUserTablePermissions: (userId: string) => Promise<TablePermissionRecord[]>;
  updateTablePermission: (userId: string, tableName: string, permission: TablePermission) => Promise<void>;
  checkTablePermission: (tableName: string, requiredPermission: TablePermission) => Promise<boolean>;
  // Action permissions
  checkActionPermission: (action: string) => Promise<boolean>;
}

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
