
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, BarChart2, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from '@/components/ScrollReveal';
import { useDarkMode } from "@/hooks/useDarkMode";
import { useToast } from "@/components/ui/use-toast";
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a192f] text-white' : 'bg-white text-[#0a192f]'}`}>
      {/* Navigation Header - Updated with transparent background */}
      <header className="py-6 px-4 md:px-8 lg:px-16 flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-xl font-bold">ProductTracker</div>
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

      {/* Hero Section - Updated with dark blue theme and image background */}
      <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <ScrollReveal>
              <div className="relative z-10">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${theme === 'dark' ? 'text-white' : 'text-[#0a192f]'}`}>
                  Manage Your Inventory and Sales Smarter
                </h1>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.35}>
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'}`}>
                All-in-One Dashboard for Real-Time Tracking
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.45}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-full w-full sm:w-auto px-8 py-6 text-lg bg-primary text-white hover:bg-primary/90 shadow-lg">
                    Get Started Free <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link to="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className={`rounded-full w-full sm:w-auto px-8 py-6 text-lg ${theme === 'dark' ? 'border-gray-700 text-white hover:bg-white/10' : 'border-gray-300 text-[#0a192f] hover:bg-gray-100'}`}>
                    Learn More
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
          <div className="order-1 lg:order-2 relative">
            <ScrollReveal>
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-lg blur opacity-75"></div>
                <Card className={`relative w-full border ${theme === 'dark' ? 'border-gray-700/50 bg-[#0a192f]/80' : 'border-gray-200 bg-white/90'} backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <AspectRatio ratio={16/9}>
                      <div className="w-full h-full flex items-center justify-center">
                        <img 
                          src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                          alt="Dashboard preview" 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </AspectRatio>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section - Updated with dark blue theme */}
      <section id="features" className={`py-20 px-4 md:px-8 lg:px-16 ${theme === 'dark' ? 'bg-[#112240]' : 'bg-gray-50'}`}>
        <ScrollReveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#0a192f]'}`}>Powerful Features</h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700'} max-w-3xl mx-auto text-center`}>
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
              <Card className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full ${
                theme === 'dark' ? 'bg-[#1e2638]/80 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="p-6 flex-grow">
                    <div className={`${theme === 'dark' ? 'bg-primary/20' : 'bg-primary/10'} p-3 rounded-full inline-block mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-[#0a192f] to-[#112240] text-center">
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
            <div className="flex justify-center">
              <Link to="/signup" className="inline-block">
                <Button variant="default" size="lg" className="bg-white text-[#0a192f] hover:bg-opacity-90 rounded-full px-8 py-6 text-lg shadow-lg mx-auto">
                  Start Now
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 lg:px-16 bg-[#0a192f] text-white">
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
