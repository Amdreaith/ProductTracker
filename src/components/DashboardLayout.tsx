
import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Package, 
  Plus, 
  Settings, 
  User, 
  Users, 
  ChartBar, 
  CircleHelp, 
  Moon, 
  Sun, 
  MoreHorizontal,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";
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
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Props {
  children: ReactNode;
}

interface MenuItemWithSubItems {
  title: string;
  icon: React.ReactNode;
  path?: string;
  isExpanded?: boolean;
  subItems?: Array<{ title: string; path: string }>;
}

const DashboardLayout = ({ children }: Props) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useDarkMode();
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const { state, toggleSidebar } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    analytics: false,
    settings: false
  });

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const menuItems: MenuItemWithSubItems[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard"
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
      title: "Analytics",
      icon: <ChartBar className="h-5 w-5" />,
      isExpanded: expandedItems.analytics,
      subItems: [
        { title: "Overview", path: "/analytics" },
        { title: "Products", path: "/analytics/products" },
        { title: "Customers", path: "/analytics/customers" },
        { title: "Trends", path: "/analytics/trends" }
      ]
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
      isExpanded: expandedItems.settings,
    },
  ];

  // Admin-only menu items - removed from main menu
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
    
    if (path === "/analytics" && location.pathname.startsWith("/analytics/")) {
      // Match all analytics sub-paths to the main analytics item
      return true;
    }
    
    return location.pathname === path;
  };

  // Get theme icon
  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    return <MoreHorizontal className="h-5 w-5" />;
  }

  // Determine if the sidebar is collapsed
  const isCollapsed = state === "collapsed";

  return (
    <div className="min-h-screen flex bg-background w-full">
      <Sidebar>
        <SidebarHeader>
          <div className="p-4 flex items-center justify-between">
            {!isCollapsed && <h1 className="text-xl font-bold text-primary">ProductTracker</h1>}
            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {isAdmin ? 'ADMIN' : 'USER'}
                  </span>
                </div>
              )}
              <div className="h-9 w-9 rounded-full bg-primary/20 text-primary overflow-hidden flex items-center justify-center">
                <User size={20} />
              </div>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <>
                        <SidebarMenuButton 
                          onClick={() => toggleExpanded(item.title.toLowerCase())}
                          tooltip={item.title}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                          {item.isExpanded ? 
                            <ChevronDown className="ml-auto h-4 w-4" /> : 
                            <ChevronRight className="ml-auto h-4 w-4" />
                          }
                        </SidebarMenuButton>
                        
                        {item.isExpanded && item.subItems && (
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  onClick={() => navigate(subItem.path)}
                                  isActive={isActive(subItem.path)}
                                >
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        onClick={() => navigate(item.path!)}
                        isActive={isActive(item.path!)}
                        tooltip={item.title}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* System Group */}
          <SidebarGroup>
            <SidebarGroupLabel>SYSTEM</SidebarGroupLabel>
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
        </SidebarContent>
        
        <SidebarFooter>
          <div className="p-4 space-y-2">
            {/* Account section */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/settings")}
                  isActive={isActive("/settings")}
                  tooltip="Account"
                >
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Admin User Management moved to bottom */}
              {isAdmin && adminMenuItems.map((item) => (
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
            
            <Button
              variant="outline"
              className="w-full flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout Account
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 lg:px-8 overflow-auto">
        {children}
      </main>

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
    </div>
  );
};

export default DashboardLayout;
