
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  // New functions for table permissions
  getUserTablePermissions: (userId: string) => Promise<TablePermissionRecord[]>;
  updateTablePermission: (userId: string, tableName: string, permission: TablePermission) => Promise<void>;
  // New function to check if user has permission to table
  checkTablePermission: (tableName: string, requiredPermission: TablePermission) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check if the user is an admin
        if (currentSession?.user) {
          checkUserRole(currentSession.user.id);
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check if the user is an admin
      if (currentSession?.user) {
        checkUserRole(currentSession.user.id);
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Function to check if user is an admin
  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
    }
  };

  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      // Transform the data to match the UserProfile interface
      const profile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: (data.role as UserRole) || 'user',
        created_at: data.created_at,
        avatar_url: data.avatar_url,
        updated_at: data.updated_at
      };

      return profile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };

  const fetchAllUsers = async (): Promise<UserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return [];
      }

      // Transform each profile to match the UserProfile interface
      return data.map(item => ({
        id: item.id,
        email: item.email,
        full_name: item.full_name,
        role: (item.role as UserRole) || 'user',
        created_at: item.created_at,
        avatar_url: item.avatar_url,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  };

  // New function to get user's table permissions
  const getUserTablePermissions = async (userId: string): Promise<TablePermissionRecord[]> => {
    try {
      const { data, error } = await supabase
        .from('table_permissions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error("Error fetching user table permissions:", error);
        return [];
      }

      return data as TablePermissionRecord[];
    } catch (error) {
      console.error("Error getting user table permissions:", error);
      return [];
    }
  };

  // New function to update a user's permission for a specific table
  const updateTablePermission = async (userId: string, tableName: string, permission: TablePermission): Promise<void> => {
    try {
      // Check if permission record exists first
      const { data: existingPermission } = await supabase
        .from('table_permissions')
        .select('id')
        .eq('user_id', userId)
        .eq('table_name', tableName)
        .single();

      if (existingPermission) {
        // Update existing permission
        const { error } = await supabase
          .from('table_permissions')
          .update({ permission })
          .eq('id', existingPermission.id);
        
        if (error) throw error;
      } else {
        // Create new permission if current user is admin
        if (!user) throw new Error("No authenticated user");
        
        const { error } = await supabase
          .from('table_permissions')
          .insert({
            user_id: userId,
            table_name: tableName,
            permission,
            granted_by: user.id
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error updating table permission:", error);
      throw error;
    }
  };

  // New function to check if current user has permission for a table
  const checkTablePermission = async (tableName: string, requiredPermission: TablePermission): Promise<boolean> => {
    try {
      // Admins always have access
      if (isAdmin) return true;
      
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('table_permissions')
        .select('permission')
        .eq('user_id', user.id)
        .eq('table_name', tableName)
        .single();
      
      if (error) {
        console.error("Error checking table permission:", error);
        return false;
      }
      
      if (!data) return false;
      
      // For 'read' permission, only 'read' or 'write' is sufficient
      if (requiredPermission === 'read') {
        return data.permission === 'read' || data.permission === 'write';
      }
      
      // For 'write' permission, only 'write' is sufficient
      return data.permission === 'write';
    } catch (error) {
      console.error("Error checking table permission:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) throw error;
      
      // If signup is successful and we have a user, create profile
      if (data && data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: name,
              role: 'user', // Default role is user
              created_at: new Date().toISOString(),
            }
          ]);
        
        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user, 
    session, 
    isLoading, 
    isAdmin,
    login, 
    signup, 
    logout,
    getUserProfile,
    updateUserRole,
    fetchAllUsers,
    // Add new functions to context
    getUserTablePermissions,
    updateTablePermission,
    checkTablePermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
