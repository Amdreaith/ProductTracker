
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Activity, BarChart, LineChart, Package, Users, TrendingUp } from "lucide-react";
import { 
  ProductSalesChart, 
  CustomerSalesChart, 
  MonthlySalesTrendChart,
  ProductDistributionChart 
} from "./AnalyticsCharts";

const OverviewTab = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
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
                  <BarChart className="h-5 w-5 text-primary" />
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
};

const ProductsTab = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Product Sales Analysis</CardTitle>
        <CardDescription>Detailed breakdown of product performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductSalesChart />
      </CardContent>
    </Card>
  );
};

const CustomersTab = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
        <CardDescription>Customers with highest sales value</CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerSalesChart />
      </CardContent>
    </Card>
  );
};

const TrendsTab = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Sales Trends</CardTitle>
        <CardDescription>Monthly sales performance analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <MonthlySalesTrendChart />
      </CardContent>
    </Card>
  );
};

export const AnalyticsTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <ToggleGroup type="single" value={activeTab} onValueChange={(value) => value && setActiveTab(value)} className="justify-start border-b pb-2">
        <ToggleGroupItem value="overview" variant="outline" aria-label="Overview" className="gap-2">
          <Activity className="h-4 w-4" />
          <span>Overview</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="products" variant="outline" aria-label="Products" className="gap-2">
          <Package className="h-4 w-4" />
          <span>Products</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="customers" variant="outline" aria-label="Customers" className="gap-2">
          <Users className="h-4 w-4" />
          <span>Customers</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="trends" variant="outline" aria-label="Trends" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          <span>Trends</span>
        </ToggleGroupItem>
      </ToggleGroup>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "products" && <ProductsTab />}
      {activeTab === "customers" && <CustomersTab />}
      {activeTab === "trends" && <TrendsTab />}
    </div>
  );
};
