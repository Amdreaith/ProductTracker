
import { useState, useEffect } from "react";
import { useAuth, UserProfile } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Permission, 
  fetchUserPermissions, 
  createDefaultPermissions,
} from "@/utils/permissionsUtils";

// Import our new components
import { UserSelector } from "./UserSelector";
import { UserDetail } from "./UserDetail";
import { PermissionsTable } from "./PermissionsTable";
import { EmptyPermissionsState } from "./EmptyPermissionsState";

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
      let userPermissions = await fetchUserPermissions(userId);
      
      // If no permissions are set yet, create default ones
      if (userPermissions.length === 0) {
        userPermissions = await createDefaultPermissions(userId);
      }
      
      setPermissions(userPermissions);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-medium">User Action Permissions</h3>
        <UserSelector users={users} onSelectUser={handleUserSelect} />
      </div>

      {selectedUser ? (
        <>
          <UserDetail user={selectedUser} />
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse text-primary font-medium">Loading permissions...</div>
            </div>
          ) : (
            <PermissionsTable 
              permissions={permissions} 
              onPermissionUpdate={setPermissions} 
            />
          )}
        </>
      ) : (
        <EmptyPermissionsState />
      )}
    </div>
  );
}
