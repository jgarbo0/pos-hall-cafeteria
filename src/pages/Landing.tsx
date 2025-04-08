
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Users, Calendar, BarChart4 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Somali POS</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Button>Get Started</Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
            Modern POS System for <span className="text-primary">Somali Businesses</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Streamline your restaurant operations with our comprehensive point-of-sale solution designed for Somali cafés, restaurants, and venues.
          </p>
          <div className="mt-10">
            <Link to="/login">
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Now
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Everything you need to run your business
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sales & Orders</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage orders, process payments, and track sales in real-time with our intuitive interface.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Customer Management</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build better relationships by tracking customer preferences and purchase history.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hall Booking System</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage venue bookings, events, and reservations all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 text-center text-gray-600 dark:text-gray-400">
        <p>© 2023 Somali POS System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
