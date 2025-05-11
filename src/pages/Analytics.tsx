
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { AnalyticsTabs } from "@/components/analytics/AnalyticsTabs";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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
          <div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Analytics content */}
        <AnalyticsTabs />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
