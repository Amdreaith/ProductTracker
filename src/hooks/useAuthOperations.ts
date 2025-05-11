
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthOperations() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
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
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    login,
    signup,
    logout,
    isLoading
  };
}
