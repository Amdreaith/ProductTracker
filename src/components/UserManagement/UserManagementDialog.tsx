
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/authTypes";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserRolesTab } from "./UserRolesTab";
import { UserPermissionsTab } from "./UserPermissionsTab";
import { DataAdminTab } from "./DataAdminTab";

export function UserManagementDialog() {
  const { fetchAllUsers } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("roles");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Manage Users</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Management</DialogTitle>
          </DialogHeader>
          
          {loading && activeTab === "roles" ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-pulse text-primary font-medium">Loading users...</div>
            </div>
          ) : (
            <Tabs defaultValue="roles" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="roles">User Roles</TabsTrigger>
                <TabsTrigger value="permissions">Table Permissions</TabsTrigger>
                <TabsTrigger value="data-admin">Data Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="roles">
                <UserRolesTab users={users} loading={loading} />
              </TabsContent>
              
              <TabsContent value="permissions">
                <UserPermissionsTab users={users} />
              </TabsContent>

              <TabsContent value="data-admin">
                <DataAdminTab />
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
