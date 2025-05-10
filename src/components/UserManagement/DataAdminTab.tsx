
import { useState, useEffect } from "react";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Permission {
  id: string;
  user_id: string;
  permission_name: string;
  enabled: boolean;
  created_at: string;
}

// Type for direct Supabase interactions with user_permissions table
type UserPermissionRow = {
  id: string;
  user_id: string;
  permission_name: string;
  enabled: boolean;
  created_at: string;
}

export function DataAdminTab() {
  const { fetchAllUsers } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await fetchAllUsers();
      // Filter out admin users as they always have full permissions
      setUsers(allUsers.filter(user => user.role !== "admin"));
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again."
      });
    }
  };

  const loadUserPermissions = async (userId: string) => {
    setLoading(true);
    try {
      // Use generic query to avoid TypeScript errors
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId) as { data: UserPermissionRow[] | null; error: any };
      
      if (error) throw error;
      
      // If no permissions are set yet, create default ones
      if (!data || data.length === 0) {
        const defaultPermissions = [
          { user_id: userId, permission_name: 'can_add_product', enabled: true },
          { user_id: userId, permission_name: 'can_edit_product', enabled: true },
          { user_id: userId, permission_name: 'can_delete_product', enabled: true },
          { user_id: userId, permission_name: 'can_add_price_history', enabled: true },
          { user_id: userId, permission_name: 'can_edit_price_history', enabled: true },
          { user_id: userId, permission_name: 'can_delete_price_history', enabled: true }
        ];
        
        // Use generic insert to avoid TypeScript errors
        const { data: insertedData, error: insertError } = await supabase
          .from('user_permissions')
          .insert(defaultPermissions)
          .select() as { data: UserPermissionRow[] | null; error: any };
        
        if (insertError) throw insertError;
        
        setPermissions(insertedData as Permission[]);
      } else {
        setPermissions(data as Permission[]);
      }
    } catch (error) {
      console.error("Failed to load permissions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user permissions. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
    loadUserPermissions(user.id);
  };

  const updatePermission = async (permissionId: string, enabled: boolean) => {
    try {
      // Use generic update to avoid TypeScript errors
      const { error } = await supabase
        .from('user_permissions')
        .update({ enabled })
        .eq('id', permissionId) as { error: any };
      
      if (error) throw error;
      
      // Update local state
      setPermissions(permissions.map(p => 
        p.id === permissionId ? { ...p, enabled } : p
      ));
      
      toast({
        title: "Success",
        description: "Permission updated successfully."
      });
    } catch (error) {
      console.error("Failed to update permission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update permission. Please try again."
      });
    }
  };

  const getPermissionByName = (name: string): Permission | undefined => {
    return permissions.find(p => p.permission_name === name);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-medium">User Action Permissions</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <span>Select User</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
            <DropdownMenuLabel>Users</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {users
              .filter(u => u.role !== "admin" && u.role !== "blocked")
              .map(user => (
                <DropdownMenuItem 
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="cursor-pointer"
                >
                  {user.full_name || user.email || "Unknown"}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedUser ? (
        <>
          <div className="bg-muted p-4 rounded-md mb-4">
            <h4 className="font-medium">Selected User:</h4>
            <p>
              {selectedUser.full_name || "No name"} ({selectedUser.email || "No email"})
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse text-primary font-medium">Loading permissions...</div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell rowSpan={3}>Product</TableCell>
                    <TableCell>Add</TableCell>
                    <TableCell>
                      {getPermissionByName('can_add_product') && (
                        <Checkbox
                          checked={getPermissionByName('can_add_product')?.enabled}
                          onCheckedChange={(checked) => 
                            updatePermission(
                              getPermissionByName('can_add_product')!.id, 
                              !!checked
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Edit</TableCell>
                    <TableCell>
                      {getPermissionByName('can_edit_product') && (
                        <Checkbox
                          checked={getPermissionByName('can_edit_product')?.enabled}
                          onCheckedChange={(checked) => 
                            updatePermission(
                              getPermissionByName('can_edit_product')!.id, 
                              !!checked
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Delete</TableCell>
                    <TableCell>
                      {getPermissionByName('can_delete_product') && (
                        <Checkbox
                          checked={getPermissionByName('can_delete_product')?.enabled}
                          onCheckedChange={(checked) => 
                            updatePermission(
                              getPermissionByName('can_delete_product')!.id, 
                              !!checked
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell rowSpan={3}>Price History</TableCell>
                    <TableCell>Add</TableCell>
                    <TableCell>
                      {getPermissionByName('can_add_price_history') && (
                        <Checkbox
                          checked={getPermissionByName('can_add_price_history')?.enabled}
                          onCheckedChange={(checked) => 
                            updatePermission(
                              getPermissionByName('can_add_price_history')!.id, 
                              !!checked
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Edit</TableCell>
                    <TableCell>
                      {getPermissionByName('can_edit_price_history') && (
                        <Checkbox
                          checked={getPermissionByName('can_edit_price_history')?.enabled}
                          onCheckedChange={(checked) => 
                            updatePermission(
                              getPermissionByName('can_edit_price_history')!.id, 
                              !!checked
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Delete</TableCell>
                    <TableCell>
                      {getPermissionByName('can_delete_price_history') && (
                        <Checkbox
                          checked={getPermissionByName('can_delete_price_history')?.enabled}
                          onCheckedChange={(checked) => 
                            updatePermission(
                              getPermissionByName('can_delete_price_history')!.id, 
                              !!checked
                            )
                          }
                        />
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center border rounded-md bg-muted/30">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Select a User</p>
          <p className="text-sm text-muted-foreground">
            Choose a user to manage their action permissions
          </p>
        </div>
      )}
    </div>
  );
}
