
import { useState, useEffect, useCallback } from "react";
import { useAuth, UserProfile, UserRole, TablePermission, TablePermissionRecord } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Shield, 
  User as UserIcon, 
  UserX, 
  Settings, 
  Database, 
  ChevronDown, 
  History, 
  RotateCcw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export function UserManagement() {
  const { fetchAllUsers, updateUserRole, getUserTablePermissions, updateTablePermission, user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userPermissions, setUserPermissions] = useState<TablePermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("roles");
  const { toast } = useToast();

  // New states for product and price history tables
  const [products, setProducts] = useState<any[]>([]);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  useEffect(() => {
    if (selectedUser) {
      loadUserPermissions(selectedUser.id);
    }
  }, [selectedUser]);

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

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      }));
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

  // Load products with admin view (including status and stamp)
  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product')
        .select('*')
        .order('prodcode');
        
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again."
      });
    } finally {
      setProductsLoading(false);
    }
  };

  // Load price history with admin view (including status and stamp)
  const loadPriceHistory = async () => {
    setPriceHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('pricehist')
        .select('*')
        .order('prodcode');
        
      if (error) throw error;
      setPriceHistory(data);
    } catch (error) {
      console.error("Failed to load price history:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load price history. Please try again."
      });
    } finally {
      setPriceHistoryLoading(false);
    }
  };

  // Handle restoring a "deleted" product
  const handleRestoreProduct = async (prodcode: string) => {
    try {
      const { error } = await supabase
        .from('product')
        .update({ status: 'restored', stamp: new Date().toISOString() })
        .eq('prodcode', prodcode);
      
      if (error) throw error;
      
      // Refresh products list
      loadProducts();
      
      toast({
        title: "Success",
        description: `Product ${prodcode} has been restored.`
      });
    } catch (error) {
      console.error("Failed to restore product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore product. Please try again."
      });
    }
  };

  // Handle restoring a "deleted" price history entry
  const handleRestorePriceHistory = async (prodcode: string, effdate: string) => {
    try {
      const { error } = await supabase
        .from('pricehist')
        .update({ status: 'restored', stamp: new Date().toISOString() })
        .eq('prodcode', prodcode)
        .eq('effdate', effdate);
      
      if (error) throw error;
      
      // Refresh price history list
      loadPriceHistory();
      
      toast({
        title: "Success",
        description: `Price history entry for ${prodcode} has been restored.`
      });
    } catch (error) {
      console.error("Failed to restore price history:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to restore price history. Please try again."
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
  
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  
  const getPermissionForTable = (tableName: string): TablePermission => {
    const permission = userPermissions.find(p => p.table_name === tableName);
    return permission ? permission.permission as TablePermission : 'none';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'added':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Added</Badge>;
      case 'edited':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Edited</Badge>;
      case 'deleted':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Deleted</Badge>;
      case 'restored':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Restored</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Load products and price history when admin tab is activated
  useEffect(() => {
    if (activeTab === 'data-admin' && open) {
      loadProducts();
      loadPriceHistory();
    }
  }, [activeTab, open]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Manage Users</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Management</DialogTitle>
          </DialogHeader>
          
          {loading ? (
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
              
              <TabsContent value="roles" className="overflow-auto max-h-[60vh]">
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
              </TabsContent>
              
              <TabsContent value="permissions">
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
                              onClick={() => setSelectedUser(user)}
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
              </TabsContent>

              {/* New Data Admin Tab */}
              <TabsContent value="data-admin">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Products</h3>
                    {productsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-pulse text-primary font-medium">Loading products...</div>
                      </div>
                    ) : (
                      <div className="border rounded-md overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product Code</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Unit</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Last Modified</TableHead>
                              <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {products.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                  No products found.
                                </TableCell>
                              </TableRow>
                            ) : (
                              products.map((product) => (
                                <TableRow key={product.prodcode} className={product.status === 'deleted' ? 'bg-red-50' : ''}>
                                  <TableCell>{product.prodcode}</TableCell>
                                  <TableCell>{product.description}</TableCell>
                                  <TableCell>{product.unit}</TableCell>
                                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                                  <TableCell>{formatDateTime(product.stamp)}</TableCell>
                                  <TableCell>
                                    {product.status === 'deleted' && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleRestoreProduct(product.prodcode)}
                                        title="Restore product"
                                      >
                                        <RotateCcw className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Price History</h3>
                    {priceHistoryLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-pulse text-primary font-medium">Loading price history...</div>
                      </div>
                    ) : (
                      <div className="border rounded-md overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product Code</TableHead>
                              <TableHead>Effective Date</TableHead>
                              <TableHead>Unit Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Last Modified</TableHead>
                              <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {priceHistory.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                  No price history found.
                                </TableCell>
                              </TableRow>
                            ) : (
                              priceHistory.map((price) => (
                                <TableRow key={`${price.prodcode}-${price.effdate}`} className={price.status === 'deleted' ? 'bg-red-50' : ''}>
                                  <TableCell>{price.prodcode}</TableCell>
                                  <TableCell>{formatDate(price.effdate)}</TableCell>
                                  <TableCell>${price.unitprice?.toFixed(2)}</TableCell>
                                  <TableCell>{getStatusBadge(price.status)}</TableCell>
                                  <TableCell>{formatDateTime(price.stamp)}</TableCell>
                                  <TableCell>
                                    {price.status === 'deleted' && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => handleRestorePriceHistory(price.prodcode, price.effdate)}
                                        title="Restore price history entry"
                                      >
                                        <RotateCcw className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>
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
