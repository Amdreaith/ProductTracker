
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, ClipboardList, CheckCircle, ArrowDown, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import ThemeSwitcher from '@/components/ThemeSwitcher';

const Landing = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-[#112240] to-[#0a192f] text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 py-4 px-8 md:px-16 lg:px-24 flex items-center justify-between z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0a192f]/90 backdrop-blur-md shadow-lg' : ''}`}>
        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          ProductTracker
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <ThemeSwitcher />
          {user ? (
            <Link to="/dashboard">
              <Button variant="default" className="rounded-full px-5 py-2 md:px-8 md:py-6 text-sm md:text-base bg-primary hover:bg-primary/90 shadow-md">
                Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex space-x-2 md:space-x-4">
              <Link to="/login">
                <Button variant="outline" className="rounded-full px-5 py-2 md:px-8 text-sm md:text-base border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" className="rounded-full px-5 py-2 md:px-8 text-sm md:text-base bg-primary text-white hover:bg-primary/90 shadow-md">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-8 md:px-16 lg:px-24 relative">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/f2946860-d054-4b73-bd59-dd16c7b77043.png')] opacity-5 bg-center bg-cover"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white inline-block py-1 px-4 rounded-full text-sm font-medium mb-6">
                Inventory Management Simplified
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-center lg:text-left bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Manage Your Inventory and Sales <span className="text-primary">Smarter</span>
              </h1>
              <p className="text-xl mb-12 text-blue-100 text-center lg:text-left leading-relaxed">
                All-in-One Dashboard for Real-Time Tracking. Optimize your inventory, 
                boost sales, and grow your business with ProductTracker.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                {user ? (
                  <Link to="/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full rounded-full sm:w-auto px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg">
                      Go to Dashboard <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full rounded-full sm:w-auto px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg">
                      Get Started Free <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={scrollToFeatures}
                  className="w-full rounded-full sm:w-auto px-10 py-7 text-lg border-white/20 text-white hover:bg-white/10"
                >
                  Learn More <ArrowDown className="ml-2" />
                </Button>
              </div>
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-blue-200">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">15k+</div>
                  <div className="text-sm text-blue-200">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">250k+</div>
                  <div className="text-sm text-blue-200">Products Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-blue-200">Support</div>
                </div>
              </div>
            </div>
            <div className="relative lg:block hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-lg blur opacity-75"></div>
              <Card className="relative w-full border border-gray-700/50 bg-[#0a192f]/80 backdrop-blur-sm rounded-xl overflow-hidden">
                <CardContent className="p-1">
                  <img 
                    src="/lovable-uploads/f2946860-d054-4b73-bd59-dd16c7b77043.png" 
                    alt="Dashboard analytics" 
                    className="w-full h-full object-cover rounded-lg shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
                  />
                </CardContent>
              </Card>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-0 right-0 flex justify-center animate-bounce">
          <Button variant="ghost" size="icon" onClick={scrollToFeatures}>
            <ArrowDown className="h-6 w-6 text-white/70" />
          </Button>
        </div>
      </section>

      {/* Animated Wave Divider */}
      <div className="w-full h-24 relative overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#112240"
            fillOpacity="1"
            d="M0,128L48,138.7C96,149,192,171,288,186.7C384,203,480,213,576,202.7C672,192,768,160,864,160C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 md:px-16 lg:px-24 bg-[#112240]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Powerful Features to Streamline Your Business
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Everything you need to manage inventory, track sales, and grow your business.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                title: "User Management",
                description: "Control access and permissions with comprehensive user management.",
                icon: <Users size={28} className="text-primary" />,
              },
              {
                title: "Enterprise Security",
                description: "Keep your data safe with advanced security features and encryption.",
                icon: <ShieldCheck size={28} className="text-primary" />,
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none shadow-lg bg-gradient-to-br from-[#1e2638]/90 to-[#1e2638]/50 backdrop-blur-sm hover:shadow-primary/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
          
          {/* Product Showcase */}
          <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-xl blur-xl opacity-70"></div>
              <Card className="relative border border-gray-700/40 overflow-hidden bg-[#0a192f]/70 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="rounded-md overflow-hidden">
                    <img 
                      src="/lovable-uploads/7f06f568-e654-4454-b3a9-4f8918661654.png" 
                      alt="Analytics dashboard" 
                      className="w-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">Powerful Analytics</h3>
              <p className="text-lg text-blue-100 mb-6">
                Make data-driven decisions with our comprehensive analytics dashboard. Monitor sales trends, track inventory levels, and identify growth opportunities.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Interactive charts and graphs",
                  "Customizable reporting periods",
                  "Export data in multiple formats",
                  "Set goals and track progress"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to={user ? "/dashboard" : "/signup"}>
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90">
                  {user ? "Access Dashboard" : "Try Analytics Now"}
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-[#0a192f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Trusted by Businesses Worldwide
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              See what our customers have to say about ProductTracker.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "ProductTracker has transformed how we manage our inventory. We've reduced stockouts by 75% and improved fulfillment speed.",
                name: "Sarah Johnson",
                role: "Operations Manager"
              },
              {
                quote: "The analytics provided by ProductTracker helped us identify our best-selling products and optimize our purchasing decisions.",
                name: "Michael Chen",
                role: "Retail Store Owner"
              },
              {
                quote: "User-friendly interface with powerful features. We've saved countless hours on inventory management since switching to ProductTracker.",
                name: "Jessica Williams",
                role: "E-commerce Director"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-none bg-gradient-to-b from-[#1d2538]/80 to-[#101728]/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6 text-primary">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-gray-300 mb-8 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-[#112240] to-[#0a192f] text-center">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-xl blur-xl opacity-30"></div>
          <Card className="relative border border-white/10 bg-[#121e36]/80 backdrop-blur-lg">
            <CardContent className="py-12 px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to optimize your inventory management?</h2>
              <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
                Join thousands of businesses that have transformed their operations with ProductTracker.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="default" size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-10 py-6 text-lg">
                      Go to Dashboard
                      <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button variant="default" size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-10 py-6 text-lg w-full sm:w-auto">
                        Get Started Free
                        <ArrowRight className="ml-2" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 md:px-16 lg:px-24 bg-[#0a192f] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">ProductTracker</h3>
              <p className="text-gray-400 mb-4">
                All-in-One Dashboard for Real-Time Inventory Management and Sales Tracking.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Real-Time Dashboard</li>
                <li>Multi-Channel Integration</li>
                <li>Automated Reports</li>
                <li>User Management</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Support Center</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} ProductTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
