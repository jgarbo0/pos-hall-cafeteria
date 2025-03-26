
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
          <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png')" }}
          ></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 animate-fade-in">
            <span className="text-primary font-bold text-3xl">S</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Somali POS System
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            The complete solution for restaurants, cafeterias, and hall bookings in Hargeisa, Somaliland
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link to="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 text-lg">
                Get Started
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 hover:bg-white/20 text-white border-white font-bold px-8 py-6 text-lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Complete Restaurant Management System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {[
              {
                title: "Point of Sale",
                description: "Streamlined ordering system with intuitive interface for fast transactions",
                icon: "💳"
              },
              {
                title: "Hall Booking",
                description: "Manage venue reservations and special events with calendar integration",
                icon: "🏛️"
              },
              {
                title: "Inventory Control",
                description: "Track ingredients and products with automatic stock alerts",
                icon: "📦"
              },
              {
                title: "Customer Management",
                description: "Build customer profiles and loyalty programs",
                icon: "👥"
              },
              {
                title: "Financial Reports",
                description: "Comprehensive analytics and financial insights",
                icon: "📊"
              },
              {
                title: "Multi-language Support",
                description: "Available in Somali and English languages",
                icon: "🌍"
              }
            ].map((feature, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Trusted by Businesses in Hargeisa
          </h2>
          
          <ScrollArea className="w-full" type="always">
            <div className="flex gap-8 pb-4 px-2 min-w-full" style={{ width: 'max-content' }}>
              {[
                {
                  quote: "This POS system revolutionized how we manage our restaurant. The integration with hall booking is perfect for our events.",
                  author: "Ahmed Osman",
                  role: "Restaurant Owner"
                },
                {
                  quote: "The financial reports helped us identify our best-selling items and optimize our menu accordingly.",
                  author: "Amina Hassan",
                  role: "Café Manager"
                },
                {
                  quote: "Customer management feature has greatly improved our service and returning customer rate.",
                  author: "Mohamed Abdi",
                  role: "Hotel Director"
                },
                {
                  quote: "Easy to use interface means we spend less time training staff and more time serving customers.",
                  author: "Sahra Ibrahim",
                  role: "Restaurant Manager"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 w-80 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-0">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-4">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{testimonial.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to transform your business?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join businesses across Hargeisa already benefiting from our comprehensive POS solution
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white hover:bg-gray-100 text-primary font-bold px-8 py-6 text-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-semibold">Somali POS</span>
              </div>
              <p className="mt-2 text-gray-400">Hargeisa, Somaliland</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2023 Somali POS System. All rights reserved.</p>
              <div className="mt-2">
                <Link to="/login" className="text-white hover:text-primary mr-4">Login</Link>
                <a href="#features" className="text-white hover:text-primary">Features</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
