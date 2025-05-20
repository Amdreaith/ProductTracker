
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, ClipboardList, CheckCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import ThemeSwitcher from '@/components/ThemeSwitcher';

const Landing = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#0a192f] text-white">
      {/* Navigation Header */}
      <header className="py-8 px-8 md:px-16 lg:px-24 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-2xl font-bold">ProductTracker</div>
        <div className="flex items-center space-x-6">
          <ThemeSwitcher />
          {user ? (
            <Link to="/dashboard">
              <Button variant="default" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 shadow-md">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="default" className="rounded-full px-8 py-6 text-base bg-primary text-white hover:bg-primary/90 shadow-md">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-center lg:text-left">
              Manage Your Inventory and Sales Smarter
            </h1>
            <p className="text-xl mb-12 text-gray-300 text-center lg:text-left">
              All-in-One Dashboard for Real-Time Tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              {user ? (
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full w-full sm:w-auto px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg">
                    Go to Dashboard <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full w-full sm:w-auto px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg">
                    Get Started Free <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="mt-16 space-y-8">
              <div className="flex items-center">
                <div className="bg-blue-900/50 p-4 rounded-full mr-5">
                  <RefreshCw className="text-primary" />
                </div>
                <span className="text-lg text-gray-100">Real-Time Inventory Sync</span>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-900/50 p-4 rounded-full mr-5">
                  <BarChart2 className="text-primary" />
                </div>
                <span className="text-lg text-gray-100">Sales Analytics</span>
              </div>
              <div className="flex items-center">
                <div className="bg-blue-900/50 p-4 rounded-full mr-5">
                  <ClipboardList className="text-primary" />
                </div>
                <span className="text-lg text-gray-100">Order Management</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-lg blur opacity-75"></div>
              <Card className="relative w-full border border-gray-700/50 bg-[#0a192f]/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <img 
                    src="/lovable-uploads/f2946860-d054-4b73-bd59-dd16c7b77043.png" 
                    alt="Dashboard analytics" 
                    className="w-full h-full object-contain rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-[#112240]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Real-Time Dashboard",
                description: "Monitor your inventory and sales with live updates and insightful metrics.",
                icon: <BarChart2 size={28} className="text-primary" />,
              },
              {
                title: "Multi-Channel Integration",
                description: "Connect to all your sales channels for unified inventory management.",
                icon: <RefreshCw size={28} className="text-primary" />,
              },
              {
                title: "Automated Reports",
                description: "Get detailed analytics reports delivered to your inbox on your schedule.",
                icon: <ClipboardList size={28} className="text-primary" />,
              },
              {
                title: "Low Stock Alerts",
                description: "Never run out of stock again with customizable inventory alerts.",
                icon: <CheckCircle size={28} className="text-primary" />,
              },
              {
                title: "Sales Forecasting",
                description: "Predict future trends and make data-driven inventory decisions.",
                icon: <BarChart2 size={28} className="text-primary" />,
              },
              {
                title: "User Management",
                description: "Control access and permissions with comprehensive user management.",
                icon: <CheckCircle size={28} className="text-primary" />,
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-lg bg-[#1e2638]/80 border-gray-700">
                <CardContent className="p-8 h-full">
                  <div className="bg-primary/20 p-3 rounded-full inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-gradient-to-r from-[#0a192f] to-[#112240] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">Ready to optimize your inventory management?</h2>
          <p className="text-xl mb-12 text-white/90 max-w-3xl mx-auto px-4 text-center">
            Join thousands of businesses that have transformed their operations with ProductTracker.
          </p>
          <div className="flex justify-center">
            {user ? (
              <Link to="/dashboard" className="inline-block">
                <Button variant="default" size="lg" className="bg-white text-[#0a192f] hover:bg-opacity-90 rounded-full px-12 py-7 text-lg shadow-lg mx-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup" className="inline-block">
                <Button variant="default" size="lg" className="bg-white text-[#0a192f] hover:bg-opacity-90 rounded-full px-12 py-7 text-lg shadow-lg mx-auto">
                  Start Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 md:px-16 lg:px-24 bg-[#0a192f] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} ProductTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
