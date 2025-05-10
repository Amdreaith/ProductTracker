
import { Permission, updatePermissionStatus } from "@/utils/permissionsUtils";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface PermissionsTableProps {
  permissions: Permission[];
  onPermissionUpdate: (permissions: Permission[]) => void;
}

export function PermissionsTable({ permissions, onPermissionUpdate }: PermissionsTableProps) {
  const { toast } = useToast();

  const updatePermission = async (permissionId: string, enabled: boolean) => {
    try {
      await updatePermissionStatus(permissionId, enabled);
      
      // Update local state
      const updatedPermissions = permissions.map(p => 
        p.id === permissionId ? { ...p, enabled } : p
      );
      
      onPermissionUpdate(updatedPermissions);
      
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
  );
}
