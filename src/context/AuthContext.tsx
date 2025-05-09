
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user info
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, this would be an API call
      // Simulate a delay for the API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // For demo purposes, we'll just validate that something was provided
      if (!email || !password) {
        throw new Error("Please provide both email and password");
      }
      
      // Mock user data - in a real app, this would come from the API response
      const userData = {
        id: "user-123",
        email,
        name: email.split('@')[0],
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      console.log("Logged in as:", userData.email);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (!email || !password || !name) {
        throw new Error("Please provide all required information");
      }
      
      // Mock user creation - in a real app, this would be handled by the API
      const userData = {
        id: "user-" + Math.floor(Math.random() * 1000),
        email,
        name,
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      console.log("User created:", userData.email);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
