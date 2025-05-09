
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Package, DollarSign, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { 
      title: "Total Products", 
      value: "24", 
      description: "All products in your inventory", 
      icon: <Package className="h-10 w-10 text-primary/20" />,
      change: "+2 from last month"
    },
    { 
      title: "Revenue", 
      value: "$10,482", 
      description: "Total monthly revenue", 
      icon: <DollarSign className="h-10 w-10 text-primary/20" />,
      change: "+12.3% from last month"
    },
    { 
      title: "Price Changes", 
      value: "8", 
      description: "Products with price changes", 
      icon: <TrendingUp className="h-10 w-10 text-primary/20" />,
      change: "3 increases, 5 decreases"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your product inventory and key metrics.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Price Changes</CardTitle>
            <CardDescription>
              Most significant price changes in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>
              Top performing products based on price stability
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-muted-foreground flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              <span>Chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
