
import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, Plus, Settings, User, Users, ChartBar, CircleHelp, Moon, Sun, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserManagement } from "@/components/UserManagement";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useDarkMode();
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard"
    },
    {
      title: "Analytics",
      icon: <ChartBar className="h-5 w-5" />,
      path: "/analytics"
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      path: "/products"
    },
    {
      title: "Add Product",
      icon: <Plus className="h-5 w-5" />,
      path: "/products/add"
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings"
    },
  ];

  // Admin-only menu items
  const adminMenuItems = [
    {
      title: "User Management",
      icon: <Users className="h-5 w-5" />,
      path: "/users"
    }
  ];

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'User';

  // Function to determine if a menu item is active
  const isActive = (path: string) => {
    if (path === "/products" && location.pathname.startsWith("/products/")) {
      // Special case for products sub-paths (except /products/add which is its own entry)
      return location.pathname.startsWith("/products/") && location.pathname !== "/products/add";
    }
    return location.pathname === path;
  };

  // Get theme icon
  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    return <MoreHorizontal className="h-5 w-5" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h1 className="text-xl font-bold text-primary">ProductTracker</h1>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {/* System Controls Group */}
            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={toggleTheme}
                      tooltip={`Theme: ${theme}`}
                    >
                      {getThemeIcon()}
                      <span>Theme</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setHelpDialogOpen(true)}
                      tooltip="Help"
                    >
                      <CircleHelp className="h-5 w-5" />
                      <span>Help</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        isActive={isActive(item.path)}
                        tooltip={item.title}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel>Admin Tools</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminMenuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          isActive={isActive(item.path)}
                          tooltip={item.title}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 text-primary p-2 rounded-full">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {/* New Account menu item */}
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start"
                  onClick={() => navigate("/settings")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 px-4 py-8 lg:px-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>
              ProductTracker help center
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <h3 className="font-medium">Quick Help Topics</h3>
            <div className="space-y-2">
              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium">Managing Products</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You can add, edit, and delete products, as well as update pricing information.
                </p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium">Analytics & Reports</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  View sales performance and customer data through interactive charts and reports.
                </p>
              </div>
              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium">User Management</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Admins can manage user accounts, roles and permissions.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              For additional support, please contact your system administrator.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default DashboardLayout;
