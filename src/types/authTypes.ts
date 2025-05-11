
import { User, Session } from "@supabase/supabase-js";

// Define a type for user roles
export type UserRole = "admin" | "user" | "blocked";

// Define a type for table permissions
export type TablePermission = "read" | "write" | "none";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  avatar_url?: string | null;
  updated_at?: string | null;
}

export interface TablePermissionRecord {
  id: string;
  user_id: string;
  table_name: string;
  permission: TablePermission;
  created_at: string;
}

// Action permissions
export interface ActionPermission {
  id: string;
  user_id: string;
  permission_name: string;
  enabled: boolean;
}

// Auth context type definition
export interface AuthContextType {
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
