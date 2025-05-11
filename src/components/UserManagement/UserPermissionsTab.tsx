
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile, TablePermission, TablePermissionRecord } from "@/types/authTypes";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Settings, Database, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface UserPermissionsTabProps {
  users: UserProfile[];
}

export function UserPermissionsTab({ users }: UserPermissionsTabProps) {
  const { getUserTablePermissions, updateTablePermission } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userPermissions, setUserPermissions] = useState<TablePermissionRecord[]>([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const { toast } = useToast();

  const loadUserPermissions = async (userId: string) => {
    setPermissionsLoading(true);
    try {
      const permissions = await getUserTablePermissions(userId);
      setUserPermissions(permissions);
    } catch (error) {
      console.error("Failed to load user permissions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user permissions. Please try again."
      });
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handlePermissionChange = async (userId: string, tableName: string, permission: TablePermission) => {
    try {
      await updateTablePermission(userId, tableName, permission);
      
      // Update local state
      setUserPermissions(prev => {
        const existingPermIndex = prev.findIndex(p => p.user_id === userId && p.table_name === tableName);
        
        if (existingPermIndex >= 0) {
          // Update existing permission
          const updated = [...prev];
          updated[existingPermIndex] = { ...updated[existingPermIndex], permission };
          return updated;
        } else {
          // Add new permission (this is simplified, real data will come from server)
          return [...prev, {
            id: `temp-${Date.now()}`,
            user_id: userId,
            table_name: tableName,
            permission,
            created_at: new Date().toISOString()
          }];
        }
      });
      
      toast({
        title: "Success",
        description: `${tableName} permission updated successfully.`
      });
    } catch (error) {
      console.error("Failed to update table permission:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update permission. Please try again."
      });
    }
  };

  const getPermissionForTable = (tableName: string): TablePermission => {
    const permission = userPermissions.find(p => p.table_name === tableName);
    return permission ? permission.permission as TablePermission : 'none';
  };

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
    loadUserPermissions(user.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-medium">Table Access Permissions</h3>
        
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
          
          {permissionsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse text-primary font-medium">Loading permissions...</div>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Product</span>
                    </TableCell>
                    <TableCell className="capitalize">
                      {getPermissionForTable('product')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={getPermissionForTable('product')}
                        onValueChange={(value) => 
                          handlePermissionChange(selectedUser.id, 'product', value as TablePermission)
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Permission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      <span>Price History</span>
                    </TableCell>
                    <TableCell className="capitalize">
                      {getPermissionForTable('pricehist')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={getPermissionForTable('pricehist')}
                        onValueChange={(value) => 
                          handlePermissionChange(selectedUser.id, 'pricehist', value as TablePermission)
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Permission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
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
            Choose a user to manage their table permissions
          </p>
        </div>
      )}
    </div>
  );
}
