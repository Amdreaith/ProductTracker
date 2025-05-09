
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Package, Plus, Settings, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
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
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings"
    },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={`bg-sidebar fixed lg:static inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 border-r border-border`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-primary">ProductTracker</h1>
          </div>
          
          <nav className="flex-1 px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.title}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-md hover:bg-primary/10 transition-colors text-left"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary/20 text-primary p-2 rounded-full">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
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
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 lg:px-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
