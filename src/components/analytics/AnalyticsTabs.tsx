import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AnalyticsTabs = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the main analytics page
    navigate("/analytics");
  }, [navigate]);
  
  return null;
};
