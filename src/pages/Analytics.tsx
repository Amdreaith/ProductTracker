
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ChartBar, ChartPie } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Analytics = () => {
  const { user } = useAuth();
  
  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'User';

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics Report</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your product performance and sales data
            </p>
          </div>
        </div>

        {/* Analytics tabs */}
        <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
          <div className="px-4 py-2 border-b-2 border-primary font-medium text-primary flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span>Overview</span>
          </div>
          <div className="px-4 py-2 border-b-2 border-transparent hover:border-primary/50 font-medium text-muted-foreground hover:text-foreground transition-colors">
            Products
          </div>
          <div className="px-4 py-2 border-b-2 border-transparent hover:border-primary/50 font-medium text-muted-foreground hover:text-foreground transition-colors">
            Customers
          </div>
          <div className="px-4 py-2 border-b-2 border-transparent hover:border-primary/50 font-medium text-muted-foreground hover:text-foreground transition-colors">
            Trends
          </div>
        </div>

        {/* Analytics cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar className="h-5 w-5 text-primary" />
                    <span>Monthly Sales</span>
                  </CardTitle>
                  <CardDescription>Sales performance over time</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-muted-foreground flex items-center gap-2">
                <ChartBar className="h-5 w-5" />
                <span>Sales chart will be displayed here</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ChartPie className="h-5 w-5 text-primary" />
                    <span>Top Products</span>
                  </CardTitle>
                  <CardDescription>Best selling products by quantity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-muted-foreground flex items-center gap-2">
                <ChartPie className="h-5 w-5" />
                <span>Product distribution chart will be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
