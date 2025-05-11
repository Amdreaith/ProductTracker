
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "@/types/authTypes";

export function useAuthProvider() {
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

  return {
    user,
    session,
    isLoading,
    isAdmin,
    login,
    signup,
    logout,
    getUserProfile,
    updateUserRole,
    fetchAllUsers
  };
}
