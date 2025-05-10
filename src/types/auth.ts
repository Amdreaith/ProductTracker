
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

// New interface for action permissions
export interface ActionPermission {
  id: string;
  user_id: string;
  permission_name: string;
  enabled: boolean;
}
