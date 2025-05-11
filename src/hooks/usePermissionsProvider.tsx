
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TablePermission, TablePermissionRecord } from "@/types/authTypes";
import { checkUserPermission } from "@/utils/permissionsUtils";

export function usePermissionsProvider(isAdmin: boolean, userId: string | undefined) {
  // Get user's table permissions
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

  // Update a user's permission for a specific table
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
        if (!userId) throw new Error("No authenticated user");
        
        const { error } = await supabase
          .from('table_permissions')
          .insert({
            user_id: userId,
            table_name: tableName,
            permission,
            granted_by: userId
          });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error updating table permission:", error);
      throw error;
    }
  };

  // Check if current user has permission for a table
  const checkTablePermission = async (tableName: string, requiredPermission: TablePermission): Promise<boolean> => {
    try {
      // Admins always have access
      if (isAdmin) return true;
      
      if (!userId) return false;
      
      const { data, error } = await supabase
        .from('table_permissions')
        .select('permission')
        .eq('user_id', userId)
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

  // Check if a user has permission for a specific action
  const checkActionPermission = async (action: string): Promise<boolean> => {
    try {
      // Admins always have full permissions
      if (isAdmin) return true;
      
      if (!userId) return false;
      
      return await checkUserPermission(userId, action);
    } catch (error) {
      console.error("Error checking action permission:", error);
      return false;
    }
  };
  
  return {
    getUserTablePermissions,
    updateTablePermission,
    checkTablePermission,
    checkActionPermission
  };
}
