
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, BarChart2, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from '@/components/ScrollReveal';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="py-6 px-4 md:px-8 lg:px-16 flex items-center justify-between">
        <div className="text-xl font-semibold">PricePulse</div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-primary">Home</a>
          <a href="#features" className="text-gray-700 hover:text-primary">Features</a>
          <a href="#pricing" className="text-gray-700 hover:text-primary">Pricing</a>
        </nav>
        <Link to="/login">
          <Button variant="outline" className="rounded-full px-6">Login</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row pt-8 pb-16 px-4 md:px-8 lg:px-16">
        <div className="lg:w-1/2 flex items-center">
          <ScrollReveal width="100%">
            <img 
              src="/placeholder.svg" 
              alt="Product devices" 
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </ScrollReveal>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center mb-10 lg:mb-0 lg:pl-16">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Manage Your Inventory and Sales Smarter
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={0.35}>
            <p className="text-xl text-gray-600 mb-8">
              All-in-One Dashboard for Real-Time Tracking
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.45}>
            <div>
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg">
                  Get Started Free <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          
          <div className="mt-12 space-y-6">
            <ScrollReveal delay={0.55}>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <RefreshCw className="text-primary" />
                </div>
                <span className="text-lg">Real-Time Inventory Sync</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.65}>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <BarChart2 className="text-primary" />
                </div>
                <span className="text-lg">Sales Analytics</span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.75}>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <ClipboardList className="text-primary" />
                </div>
                <span className="text-lg">Order Management</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="bg-blue-100 p-3 rounded-full inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary text-white">
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
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by thousands of businesses worldwide
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              text: "PricePulse transformed our inventory management. We've reduced stockouts by 75% and saved countless hours on manual tracking.",
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
              <Card className="border-none shadow-md h-full">
                <CardContent className="p-8">
                  <div className="text-lg italic mb-4 text-gray-700">"{testimonial.text}"</div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.position}</div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Starter",
              price: "$29",
              description: "Perfect for small businesses",
              features: ["Up to 1,000 products", "2 team members", "Basic analytics", "Email support"]
            },
            {
              name: "Professional",
              price: "$79",
              description: "Best for growing businesses",
              features: ["Up to 10,000 products", "5 team members", "Advanced analytics", "Priority support", "API access"]
            },
            {
              name: "Enterprise",
              price: "$199",
              description: "For large scale operations",
              features: ["Unlimited products", "Unlimited team members", "Custom reporting", "24/7 dedicated support", "Custom integrations"]
            }
          ].map((plan, index) => (
            <ScrollReveal key={index} delay={0.2 + index * 0.1}>
              <Card className={`border-none h-full ${index === 1 ? 'shadow-xl ring-2 ring-primary' : 'shadow-md'}`}>
                <CardContent className="p-8">
                  <div className="text-xl font-bold mb-2">{plan.name}</div>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup">
                    <Button 
                      variant={index === 1 ? "default" : "outline"}
                      className="w-full rounded-full"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary text-white text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your inventory management?</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Join thousands of businesses that have transformed their operations with PricePulse.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.4}>
          <Link to="/signup">
            <Button variant="default" size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 py-6 text-lg">
              Start Your Free Trial
            </Button>
          </Link>
          <p className="mt-4 text-sm opacity-80">No credit card required</p>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 lg:px-16 bg-gray-900 text-white">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="text-xl font-semibold mb-4">PricePulse</div>
            <p className="text-gray-400">
              All-in-one inventory and sales management platform for growing businesses.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Integrations</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
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
          <p>© {new Date().getFullYear()} PricePulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
