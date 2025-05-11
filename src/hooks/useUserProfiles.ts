
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "@/types/authTypes";

export function useUserProfiles() {
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
    getUserProfile,
    updateUserRole,
    fetchAllUsers
  };
}
