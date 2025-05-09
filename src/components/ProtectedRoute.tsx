
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";

const ProtectedRoute = () => {
  const { user, isLoading, getUserProfile } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        const profile = await getUserProfile(user.id);
        setIsBlocked(profile?.role === "blocked");
      }
      setCheckingStatus(false);
    };

    if (!isLoading && user) {
      checkUserStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [user, isLoading, getUserProfile]);

  if (isLoading || checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-medium">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border-2 border-red-300 rounded-lg p-8 max-w-md text-center">
          <UserX className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Account Blocked</h2>
          <p className="text-gray-700 mb-6">
            Your account has been suspended. Please contact an administrator for assistance.
          </p>
          <Button 
            variant="outline" 
            className="border-red-300 hover:bg-red-50"
            onClick={() => window.location.href = "/login"}
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
