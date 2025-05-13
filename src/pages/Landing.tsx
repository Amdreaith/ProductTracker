
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, BarChart2, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from '@/components/ScrollReveal';
import { MonthlySalesTrendChart } from "@/components/analytics/MonthlySalesTrendChart";
import { ProductDistributionChartAnalytics } from "@/components/analytics/ProductDistributionChartAnalytics";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useToast } from "@/components/ui/use-toast";
import ThemeSwitcher from '@/components/ThemeSwitcher';

const Landing = () => {
  const { theme, toggleTheme } = useDarkMode();
  const { toast } = useToast();
  
  const handleThemeChange = () => {
    toggleTheme();
    toast({
      title: `Theme changed to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'}`,
      duration: 2000,
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#1A1F2C]' : 'bg-gray-50'} ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      {/* Navigation Header */}
      <header className="py-6 px-4 md:px-8 lg:px-16 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-xl font-semibold">ProductTracker</div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className={`${theme === 'dark' ? 'text-gray-300 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>Home</a>
          <a href="#features" className={`${theme === 'dark' ? 'text-gray-300 hover:text-primary' : 'text-gray-700 hover:text-primary'}`}>Features</a>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <Link to="/login">
            <Button variant="default" className={`rounded-full px-6 ${theme === 'dark' ? 'bg-primary text-white' : 'bg-primary text-white'} hover:bg-primary/90 shadow-md`}>Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row pt-8 pb-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="lg:w-1/2 flex items-center">
          <ScrollReveal width="100%">
            <Card className={`w-full border ${theme === 'dark' ? 'border-gray-700 bg-[#2A2E3F]' : 'border-gray-200 bg-white'}`}>
              <CardContent className="p-6">
                <MonthlySalesTrendChart />
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center mb-10 lg:mb-0 lg:pl-16">
          <ScrollReveal>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Manage Your Inventory and Sales Smarter
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={0.35}>
            <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>
              All-in-One Dashboard for Real-Time Tracking
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.45}>
            <div>
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-primary text-white hover:bg-primary/90 shadow-lg">
                  Get Started Free <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          
          <div className="mt-12 space-y-6">
            <ScrollReveal delay={0.55}>
              <div className="flex items-center">
                <div className={`${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'} p-3 rounded-full mr-4`}>
                  <RefreshCw className="text-primary" />
                </div>
                <span className={`text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Real-Time Inventory Sync</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.65}>
              <div className="flex items-center">
                <div className={`${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'} p-3 rounded-full mr-4`}>
                  <BarChart2 className="text-primary" />
                </div>
                <span className={`text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Sales Analytics</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.75}>
              <div className="flex items-center">
                <div className={`${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'} p-3 rounded-full mr-4`}>
                  <ClipboardList className="text-primary" />
                </div>
                <span className={`text-lg ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Order Management</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section with Product Tracking Visuals */}
      <section id="features" className={`py-20 px-4 md:px-8 lg:px-16 ${theme === 'dark' ? 'bg-[#222333]' : 'bg-gray-100'}`}>
        <ScrollReveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Powerful Features</h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'} max-w-3xl mx-auto`}>
              Everything you need to streamline your inventory and boost your sales performance
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Real-Time Dashboard",
              description: "Monitor your inventory and sales with live updates and insightful metrics.",
              icon: <BarChart2 size={28} className="text-primary" />,
              image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=800&h=500"
            },
            {
              title: "Multi-Channel Integration",
              description: "Connect to all your sales channels for unified inventory management.",
              icon: <RefreshCw size={28} className="text-primary" />,
              image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800&h=500"
            },
            {
              title: "Automated Reports",
              description: "Get detailed analytics reports delivered to your inbox on your schedule.",
              icon: <ClipboardList size={28} className="text-primary" />,
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800&h=500"
            },
            {
              title: "Low Stock Alerts",
              description: "Never run out of stock again with customizable inventory alerts.",
              icon: <RefreshCw size={28} className="text-primary" />,
              image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800&h=500"
            },
            {
              title: "Sales Forecasting",
              description: "Predict future trends and make data-driven inventory decisions.",
              icon: <BarChart2 size={28} className="text-primary" />,
              image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800&h=500"
            },
            {
              title: "Customer Insights",
              description: "Understand your customers' purchasing patterns and preferences.",
              icon: <ClipboardList size={28} className="text-primary" />,
              image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800&h=500"
            }
          ].map((feature, index) => (
            <ScrollReveal key={index} delay={0.2 + index * 0.1}>
              <Card className={`border-none shadow-md hover:shadow-lg transition-all duration-300 h-full ${
                theme === 'dark' ? 'bg-[#2A2E3F] border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <CardContent className="p-0">
                  <div className="h-48 overflow-hidden rounded-t-md">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className={`${theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'} p-3 rounded-full inline-block mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                    <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Stats Section with Real-time Chart */}
      <section className={`py-20 px-4 md:px-8 lg:px-16 ${theme === 'dark' ? 'bg-[#1A1F2C]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-center`}>Real-time Data Analytics</h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card className={`border ${theme === 'dark' ? 'border-gray-700 bg-[#2A2E3F]' : 'border-gray-200 bg-white'}`}>
                <CardContent className="p-6">
                  <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Monthly Sales Trend</h3>
                  <MonthlySalesTrendChart />
                </CardContent>
              </Card>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <Card className={`border ${theme === 'dark' ? 'border-gray-700 bg-[#2A2E3F]' : 'border-gray-200 bg-white'}`}>
                <CardContent className="p-6">
                  <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Product Distribution</h3>
                  <ProductDistributionChartAnalytics />
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className={`py-20 px-4 md:px-8 lg:px-16 ${theme === 'dark' ? 'bg-[#222333]' : 'bg-gray-100'}`}>
        <div className="max-w-5xl mx-auto text-center">
          <ScrollReveal>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>See ProductTracker in Action</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className={`text-xl mb-10 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'} max-w-3xl mx-auto`}>
              Watch how our platform simplifies inventory management and boosts productivity
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className={`aspect-w-16 aspect-h-9 rounded-xl overflow-hidden ${theme === 'dark' ? 'border border-gray-700' : 'border border-gray-200'} shadow-xl`}>
              <div className="w-full h-[400px] bg-gray-800 flex items-center justify-center">
                <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <ClipboardList size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Product tracking demo video</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary text-center">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to optimize your inventory management?</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto">
              Join thousands of businesses that have transformed their operations with ProductTracker.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <Link to="/signup">
              <Button variant="default" size="lg" className={`${theme === 'dark' ? 'bg-[#1A1F2C]' : 'bg-white'} text-primary hover:bg-opacity-90 rounded-full px-8 py-6 text-lg shadow-lg`}>
                Start Your Free Trial
              </Button>
            </Link>
            <p className="mt-4 text-sm text-white">No credit card required</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 md:px-8 lg:px-16 ${theme === 'dark' ? 'bg-[#121622]' : 'bg-gray-900'} text-white`}>
        <div className="grid md:grid-cols-4 gap-8 mb-12 max-w-7xl mx-auto">
          <div>
            <div className="text-xl font-semibold mb-4">ProductTracker</div>
            <p className="text-gray-400">
              All-in-one inventory and sales management platform for growing businesses.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Integrations</a></li>
              <li><a href="#" className="hover:text-white">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">Guides</a></li>
              <li><a href="#" className="hover:text-white">API Reference</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} ProductTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
