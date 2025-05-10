
import { useState } from "react";
import { useAuth, UserProfile, UserRole } from "@/context/AuthContext";
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
import { Shield, User as UserIcon, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserRolesTabProps {
  users: UserProfile[];
  loading: boolean;
}

export function UserRolesTab({ users, loading }: UserRolesTabProps) {
  const { updateUserRole, user } = useAuth();
  const { toast } = useToast();
  
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: "Success",
        description: "User role updated successfully."
      });
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role. Please try again."
      });
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield className="text-blue-500" />;
      case "user":
        return <UserIcon className="text-green-500" />;
      case "blocked":
        return <UserX className="text-red-500" />;
      default:
        return <UserIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse text-primary font-medium">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[60vh]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((userData) => (
            <TableRow key={userData.id} className={userData.id === user?.id ? "bg-muted/50" : ""}>
              <TableCell>{userData.full_name}</TableCell>
              <TableCell>{userData.email}</TableCell>
              <TableCell className="flex items-center gap-2">
                {getRoleIcon(userData.role)}
                <span className="capitalize">{userData.role}</span>
              </TableCell>
              <TableCell>{formatDate(userData.created_at)}</TableCell>
              <TableCell>
                {userData.id !== user?.id ? (
                  <Select
                    defaultValue={userData.role}
                    onValueChange={(value) => handleRoleChange(userData.id, value as UserRole)}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Change role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm text-muted-foreground">(Current User)</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
