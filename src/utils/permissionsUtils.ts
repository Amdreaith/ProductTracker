
import { supabase } from "@/integrations/supabase/client";

export interface Permission {
  id: string;
  user_id: string;
  permission_name: string;
  enabled: boolean;
  created_at: string;
}

/**
 * Fetches permissions for a specific user
 */
export async function fetchUserPermissions(userId: string): Promise<Permission[]> {
  // Use any to bypass TypeScript's type checking for the table name
  const { data, error } = await (supabase
    .from('user_permissions' as any)
    .select('*')
    .eq('user_id', userId)) as unknown as { 
      data: Permission[] | null; 
      error: any;
    };
  
  if (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Creates default permissions for a user if none exist
 */
export async function createDefaultPermissions(userId: string): Promise<Permission[]> {
  const defaultPermissions = [
    { user_id: userId, permission_name: 'can_add_product', enabled: true },
    { user_id: userId, permission_name: 'can_edit_product', enabled: true },
    { user_id: userId, permission_name: 'can_delete_product', enabled: true },
    { user_id: userId, permission_name: 'can_add_price_history', enabled: true },
    { user_id: userId, permission_name: 'can_edit_price_history', enabled: true },
    { user_id: userId, permission_name: 'can_delete_price_history', enabled: true }
  ];
  
  const { data, error } = await (supabase
    .from('user_permissions' as any)
    .insert(defaultPermissions)
    .select()) as unknown as {
      data: Permission[] | null;
      error: any;
    };
  
  if (error) {
    console.error("Error creating default permissions:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Updates a permission's enabled status
 */
export async function updatePermissionStatus(permissionId: string, enabled: boolean): Promise<void> {
  const { error } = await (supabase
    .from('user_permissions' as any)
    .update({ enabled })
    .eq('id', permissionId)) as unknown as {
      error: any;
    };
  
  if (error) {
    console.error("Error updating permission:", error);
    throw error;
  }
}

/**
 * Checks if a user has a specific permission
 */
export async function checkUserPermission(userId: string, permissionName: string): Promise<boolean> {
  // For admin users, bypass permission checks
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
    
  if (userProfile?.role === 'admin') {
    return true;
  }
  
  const { data, error } = await (supabase
    .from('user_permissions' as any)
    .select('enabled')
    .eq('user_id', userId)
    .eq('permission_name', permissionName)
    .single()) as unknown as {
      data: { enabled: boolean } | null;
      error: any;
    };
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
    console.error("Error checking permission:", error);
    throw error;
  }
  
  // If no permission record exists, default to true
  return data ? data.enabled : true;
}
