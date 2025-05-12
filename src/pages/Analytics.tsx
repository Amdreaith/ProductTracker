
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, Package, Users, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  ProductSalesChart, 
  CustomerSalesChart, 
  MonthlySalesTrendChart,
  ProductDistributionChart 
} from "@/components/analytics/AnalyticsCharts";

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'User';
  
  // Handle URL-based tab navigation
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes("/analytics/products")) {
      setActiveTab("products");
    } else if (pathname.includes("/analytics/customers")) {
      setActiveTab("customers");
    } else if (pathname.includes("/analytics/trends")) {
      setActiveTab("trends");
    } else {
      setActiveTab("overview");
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    let path = "/analytics";
    if (value !== "overview") {
      path = `/analytics/${value}`;
    }
    
    // Update URL without full page reload
    window.history.pushState({}, "", path);
  };

  const OverviewTab = () => (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Monthly Sales</span>
                </CardTitle>
                <CardDescription>Sales performance over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <MonthlySalesTrendChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Top Products</span>
                </CardTitle>
                <CardDescription>Best selling products by quantity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProductDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Report</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your product performance and sales data
          </p>
        </div>
        <div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Analytics tabs with proper styling based on the reference images */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full grid grid-cols-4 md:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Customers</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Analysis</CardTitle>
              <CardDescription>Detailed breakdown of product performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductSalesChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers with highest sales value</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerSalesChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
              <CardDescription>Monthly sales performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlySalesTrendChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
