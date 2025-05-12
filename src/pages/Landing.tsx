
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, BarChart2, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from '@/components/ScrollReveal';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Navigation Header */}
      <header className="py-6 px-4 md:px-8 lg:px-16 flex items-center justify-between">
        <div className="text-xl font-semibold">ProductTracker</div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-primary">Home</a>
          <a href="#features" className="text-gray-300 hover:text-primary">Features</a>
        </nav>
        <Link to="/login">
          <Button variant="outline" className="rounded-full px-6 border-gray-500 text-white hover:bg-white/10">Login</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row pt-8 pb-16 px-4 md:px-8 lg:px-16">
        <div className="lg:w-1/2 flex items-center">
          <ScrollReveal width="100%">
            <img 
              src="/lovable-uploads/7f06f568-e654-4454-b3a9-4f8918661654.png" 
              alt="Product analytics chart" 
              className="w-full h-auto rounded-2xl shadow-lg border border-blue-500/30"
            />
          </ScrollReveal>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center mb-10 lg:mb-0 lg:pl-16">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Manage Your Inventory and Sales Smarter
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={0.35}>
            <p className="text-xl text-gray-100 mb-8">
              All-in-One Dashboard for Real-Time Tracking
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.45}>
            <div>
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-primary text-black hover:bg-primary/90">
                  Get Started Free <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          
          <div className="mt-12 space-y-6">
            <ScrollReveal delay={0.55}>
              <div className="flex items-center">
                <div className="bg-blue-900/50 p-3 rounded-full mr-4">
                  <RefreshCw className="text-primary" />
                </div>
                <span className="text-lg text-gray-100">Real-Time Inventory Sync</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.65}>
              <div className="flex items-center">
                <div className="bg-blue-900/50 p-3 rounded-full mr-4">
                  <BarChart2 className="text-primary" />
                </div>
                <span className="text-lg text-gray-100">Sales Analytics</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.75}>
              <div className="flex items-center">
                <div className="bg-blue-900/50 p-3 rounded-full mr-4">
                  <ClipboardList className="text-primary" />
                </div>
                <span className="text-lg text-gray-100">Order Management</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 lg:px-16 bg-[#222333]">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful Features</h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Everything you need to streamline your inventory and boost your sales performance
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Real-Time Dashboard",
              description: "Monitor your inventory and sales with live updates and insightful metrics.",
              icon: <BarChart2 size={28} className="text-primary" />
            },
            {
              title: "Multi-Channel Integration",
              description: "Connect to all your sales channels for unified inventory management.",
              icon: <RefreshCw size={28} className="text-primary" />
            },
            {
              title: "Automated Reports",
              description: "Get detailed analytics reports delivered to your inbox on your schedule.",
              icon: <ClipboardList size={28} className="text-primary" />
            },
            {
              title: "Low Stock Alerts",
              description: "Never run out of stock again with customizable inventory alerts.",
              icon: <RefreshCw size={28} className="text-primary" />
            },
            {
              title: "Sales Forecasting",
              description: "Predict future trends and make data-driven inventory decisions.",
              icon: <BarChart2 size={28} className="text-primary" />
            },
            {
              title: "Customer Insights",
              description: "Understand your customers' purchasing patterns and preferences.",
              icon: <ClipboardList size={28} className="text-primary" />
            }
          ].map((feature, index) => (
            <ScrollReveal key={index} delay={0.2 + index * 0.1}>
              <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 h-full bg-[#2A2E3F] border-gray-700">
                <CardContent className="p-8">
                  <div className="bg-blue-900/50 p-3 rounded-full inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-200">{feature.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary text-[#1A1F2C]">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "24M+", label: "Products Tracked" },
            { value: "99%", label: "Customer Satisfaction" }
          ].map((stat, index) => (
            <ScrollReveal key={index} delay={0.2 + index * 0.1}>
              <div>
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#1A1F2C]">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What Our Customers Say</h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Trusted by thousands of businesses worldwide
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              text: "ProductTracker transformed our inventory management. We've reduced stockouts by 75% and saved countless hours on manual tracking.",
              author: "Sarah Johnson",
              position: "Operations Manager, TechRetail"
            },
            {
              text: "The analytics tools are incredible. We can now forecast seasonal demands with amazing accuracy and optimize our purchasing accordingly.",
              author: "Michael Chen",
              position: "Supply Chain Director, GlobalGoods"
            },
            {
              text: "Setting up was incredibly simple, and their customer support team is always available when we need assistance. Couldn't recommend it more!",
              author: "Elena Rodriguez",
              position: "E-commerce Owner, StyleBoutique"
            }
          ].map((testimonial, index) => (
            <ScrollReveal key={index} delay={0.2 + index * 0.1}>
              <Card className="border-none shadow-md h-full bg-[#2A2E3F] border-gray-700">
                <CardContent className="p-8">
                  <div className="text-lg italic mb-4 text-gray-100">"{testimonial.text}"</div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-200">{testimonial.position}</div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary text-[#1A1F2C] text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your inventory management?</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Join thousands of businesses that have transformed their operations with ProductTracker.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.4}>
          <Link to="/signup">
            <Button variant="default" size="lg" className="bg-[#1A1F2C] text-white hover:bg-[#2A2E3F] rounded-full px-8 py-6 text-lg">
              Start Your Free Trial
            </Button>
          </Link>
          <p className="mt-4 text-sm">No credit card required</p>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 lg:px-16 bg-[#121622] text-white">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
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
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} ProductTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
