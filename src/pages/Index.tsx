
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] text-white">
      <div className="animate-pulse">Redirecting...</div>
    </div>
  );
};

export default Index;
