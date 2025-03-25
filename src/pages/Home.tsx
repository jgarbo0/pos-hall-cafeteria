import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LanguageSelector from '@/components/LanguageSelector';
import { 
  CalendarClock, 
  ChefHat, 
  Coffee, 
  Facebook, 
  Instagram, 
  MapPin, 
  Menu, 
  Phone, 
  UtensilsCrossed, 
  Youtube 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  
  const TikTokIcon = () => (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
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
                src="https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Restaurant interior"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

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

      <section id="hall" className="py-16 md:py-24 bg-white dark:bg-gray-800 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1562778612-e1e0cda9915c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
              <p className="text-gray-600 dark:text-gray-300">Hargeisa Somaliland,<br/>Masalla</p>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 text-center p-6 shadow-lg">
              <div className="flex justify-center mb-4">
                <Phone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Phone</h3>
              <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Saturday - Friday: 7AM - 11PM</p>
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
                <a href="https://www.facebook.com/doobvenue" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.instagram.com/doobvenue" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://www.youtube.com/doobvenue" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                  <Youtube className="h-6 w-6" />
                </a>
                <a href="https://www.tiktok.com/@doobvenue" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                  <TikTokIcon />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Saturday - Friday: 7AM - 11PM</li>
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
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <p className="text-gray-400 mb-4">Follow Doob Venue on social media for updates and special offers!</p>
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://www.facebook.com/doobvenue" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center p-3 rounded-lg bg-gray-700 hover:bg-blue-600 transition-colors"
                >
                  <Facebook className="h-6 w-6 mr-2" />
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://www.instagram.com/doobvenue" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center p-3 rounded-lg bg-gray-700 hover:bg-pink-600 transition-colors"
                >
                  <Instagram className="h-6 w-6 mr-2" />
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://www.youtube.com/doobvenue" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center p-3 rounded-lg bg-gray-700 hover:bg-red-600 transition-colors"
                >
                  <Youtube className="h-6 w-6 mr-2" />
                  <span>YouTube</span>
                </a>
                <a 
                  href="https://www.tiktok.com/@doobvenue" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center p-3 rounded-lg bg-gray-700 hover:bg-black transition-colors"
                >
                  <TikTokIcon />
                  <span>TikTok</span>
                </a>
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
