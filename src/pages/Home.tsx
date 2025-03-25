
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LanguageSelector from '@/components/LanguageSelector';
import { CalendarClock, ChefHat, Coffee, MapPin, Menu, Phone, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Coffee className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Doob Venue</h1>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">About</a>
              <a href="#menu" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Menu</a>
              <a href="#hall" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Hall</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Contact</a>
            </nav>
            <LanguageSelector />
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">Welcome to Doob Venue</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fadeIn">Experience the finest dining and event hosting services.</p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn">
            <Link to="/index">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-200">
                <Menu className="mr-2 h-5 w-5" />
                Order Online
              </Button>
            </Link>
            <Link to="/hall">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <CalendarClock className="mr-2 h-5 w-5" />
                Book Hall
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in 2010, Doob Venue brings the finest dining and event hosting experience. Our recipes have been crafted with care, preserving traditional flavors while adding our own modern twist.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                We take pride in using fresh, locally-sourced ingredients to create dishes that not only taste amazing but also represent our rich cultural heritage.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <ChefHat className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-gray-800 dark:text-white">Expert Chefs</span>
                </div>
                <div className="flex items-center">
                  <UtensilsCrossed className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-gray-800 dark:text-white">Fresh Ingredients</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Restaurant interior"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section id="menu" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Popular Menu Items</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our most loved dishes, prepared with authentic recipes and the freshest ingredients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: "Special Rice (Bariis)",
                price: 12.99,
                image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              },
              {
                id: 2,
                title: "Sambusa (Samosa)",
                price: 8.99,
                image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              },
              {
                id: 3,
                title: "Special Tea (Shaah)",
                price: 3.99,
                image: "https://images.unsplash.com/photo-1550547239-62093e3bc750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
              }
            ].map(item => (
              <Card key={item.id} className="overflow-hidden transform transition-transform hover:scale-105 bg-white dark:bg-gray-800">
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-bold mb-4">${item.price.toFixed(2)}</p>
                  <Link to="/index">
                    <Button className="w-full">Order Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/index">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Hall Booking Section */}
      <section id="hall" className="py-16 md:py-24 bg-white dark:bg-gray-800 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1576095910273-b1ea657fa6fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Event hall"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Book Our Event Hall</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Our spacious event hall is perfect for weddings, parties, corporate events, and cultural celebrations. With capacity for up to 200 guests, premium catering options, and state-of-the-art facilities, we'll make your special occasion unforgettable.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Capacity for up to 200 guests",
                  "Professional sound system",
                  "Customizable catering options",
                  "Free parking for all guests",
                  "Dedicated event coordinator"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/hall">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Book the Hall
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions or want to make a reservation? Get in touch with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800 text-center p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <MapPin className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Address</h3>
              <p className="text-gray-600 dark:text-gray-300">123 Main Street,<br/>Minneapolis, MN 55414</p>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 text-center p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <Phone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Daily: 9AM - 10PM</p>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 text-center p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">contact@doobvenue.com</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">We'll respond within 24 hours</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Coffee className="h-6 w-6 text-blue-400 mr-2" />
                <h3 className="text-xl font-bold">Doob Venue</h3>
              </div>
              <p className="text-gray-400 mb-4">Premium dining and event hosting in the heart of Minneapolis.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Friday: 9AM - 10PM</li>
                <li>Saturday - Sunday: 10AM - 11PM</li>
                <li>Holiday Hours May Vary</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-blue-400">About Us</a></li>
                <li><a href="#menu" className="text-gray-400 hover:text-blue-400">Menu</a></li>
                <li><a href="#hall" className="text-gray-400 hover:text-blue-400">Event Hall</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-blue-400">Contact</a></li>
                <li><Link to="/index" className="text-gray-400 hover:text-blue-400">Order Online</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to receive updates on special offers and events.</p>
              <div className="flex space-x-2">
                <input type="email" placeholder="Your email" className="px-4 py-2 w-full rounded bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Doob Venue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
