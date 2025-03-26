
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Utensils, Calendar, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getRestaurantTables } from '@/services/TablesService';

const Landing: React.FC = () => {
  const { data: tables } = useQuery({
    queryKey: ['venue-tables'],
    queryFn: getRestaurantTables
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-800 dark:to-amber-950">
          <div className="absolute inset-0 bg-black opacity-50 dark:opacity-60"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: "url('/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png')" }}
          ></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mb-8 animate-fade-in">
            <span className="text-white font-bold text-3xl">D</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Doob Venue
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Exceptional cafeteria & hall bookings in Hargeisa, Somaliland
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <a href="#menu">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-6 text-lg">
                View Menu
              </Button>
            </a>
            <a href="#halls">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 hover:bg-white/20 text-white border-white font-bold px-8 py-6 text-lg"
              >
                Book a Hall
              </Button>
            </a>
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                Welcome to Doob Venue
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Established in 2023, Doob Venue has quickly become one of Hargeisa's premier destinations 
                for exceptional dining experiences and event hosting.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Our spacious cafeteria offers a variety of delicious meals in a comfortable setting, 
                while our elegant halls provide the perfect backdrop for your special occasions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Opening Hours</p>
                    <p className="text-gray-500 dark:text-gray-400">7:00 AM - 10:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Contact Us</p>
                    <p className="text-gray-500 dark:text-gray-400">+252 63 4123456</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-500 dark:text-gray-400">Masalla A-dhagah, Hargeisa</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Founded</p>
                    <p className="text-gray-500 dark:text-gray-400">2023</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Doob Venue Interior" 
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
              <Utensils className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Our Menu
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our delicious selection of meals, beverages, and desserts prepared with 
              the finest ingredients for a memorable dining experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Somali Tea & Coffee",
                description: "Traditional Somali tea and specialty coffee options",
                image: "https://images.unsplash.com/photo-1525480122447-64809d765ec4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                price: "$2 - $5"
              },
              {
                name: "Breakfast Menu",
                description: "Traditional Somali breakfast including canjeero, suqaar, and eggs",
                image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                price: "$5 - $12"
              },
              {
                name: "Lunch Specialties",
                description: "Rice dishes, pasta, and traditional Somali stews",
                image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                price: "$8 - $15"
              },
              {
                name: "Dinner Entrees",
                description: "Grilled meats, fish, and vegetarian options",
                image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                price: "$10 - $18"
              },
              {
                name: "Desserts",
                description: "Traditional halwa, cakes, and pastries",
                image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                price: "$3 - $7"
              },
              {
                name: "Fresh Juices",
                description: "Variety of fresh fruit juices and smoothies",
                image: "https://images.unsplash.com/photo-1584587727565-a154ed3d1ad8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
                price: "$3 - $6"
              }
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </h3>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">{item.price}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {item.description}
                  </p>
                  <Link to="/menu" className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:underline">
                    View details <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/menu">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Halls Section */}
      <div id="halls" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Our Halls
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Perfect venues for weddings, conferences, business meetings, and special occasions 
              with flexible catering options and modern amenities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            {[
              {
                name: "Grand Hall",
                capacity: "Up to 200 guests",
                description: "Our largest hall perfect for weddings and large conferences with full audiovisual setup",
                image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              },
              {
                name: "Executive Room",
                capacity: "Up to 50 guests",
                description: "Professional setting ideal for business meetings, training sessions and small gatherings",
                image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }
            ].map((hall, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={hall.image} 
                    alt={hall.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {hall.name}
                  </h3>
                  <p className="text-amber-600 dark:text-amber-400 font-medium mb-3">
                    {hall.capacity}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {hall.description}
                  </p>
                  <Link to="/hall">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full">
                      Book This Hall
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Table Availability Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Table Availability
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Check our current table availability for your visit. We recommend booking in advance for larger groups.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {tables?.map((table) => (
              <Card key={table.id} className={`
                ${table.status === 'available' ? 'border-green-300 dark:border-green-700' : 
                  table.status === 'reserved' ? 'border-amber-300 dark:border-amber-700' : 
                  'border-red-300 dark:border-red-700'} 
                border-2
              `}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      {table.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      table.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      table.status === 'reserved' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' : 
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    <p>Seats: {table.seats}</p>
                    {table.location && <p>Location: {table.location}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {(!tables || tables.length === 0) && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No tables information available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Link to="/login">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Make a Reservation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            What Our Guests Say
          </h2>
          
          <ScrollArea className="w-full" type="always">
            <div className="flex gap-8 pb-4 px-2 min-w-full" style={{ width: 'max-content' }}>
              {[
                {
                  quote: "Doob Venue hosted our wedding reception perfectly. The Grand Hall was beautifully decorated and the food was exceptional.",
                  author: "Amina Hassan",
                  role: "Wedding Client"
                },
                {
                  quote: "The Executive Room was perfect for our company's quarterly meeting. Professional service and great catering.",
                  author: "Mohamed Abdi",
                  role: "Business Client"
                },
                {
                  quote: "Their cafeteria has the best Somali tea in Hargeisa! I visit at least twice a week during my lunch break.",
                  author: "Sahra Ibrahim",
                  role: "Regular Customer"
                },
                {
                  quote: "I celebrated my graduation with friends at Doob Venue. The staff was very accommodating and the food was delicious.",
                  author: "Ahmed Osman",
                  role: "Customer"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 w-80 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-0">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white mr-4">
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
      <div className="py-20 bg-amber-600 dark:bg-amber-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to experience Doob Venue?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Visit our cafeteria or book one of our halls for your next event
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-amber-600 font-bold px-8 py-6 text-lg">
                Book Now
              </Button>
            </Link>
            <Link to="/menu">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent hover:bg-white/10 text-white border-white font-bold px-8 py-6 text-lg"
              >
                View Our Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">D</span>
                </div>
                <span className="text-xl font-semibold">Doob Venue</span>
              </div>
              <p className="mt-2 text-gray-400">Masalla A-dhagah, Hargeisa, Somaliland</p>
              <p className="mt-1 text-gray-400">+252 63 4123456</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2023 Doob Venue. All rights reserved.</p>
              <div className="mt-2">
                <a href="#menu" className="text-white hover:text-amber-400 mr-4">Menu</a>
                <a href="#halls" className="text-white hover:text-amber-400 mr-4">Halls</a>
                <Link to="/login" className="text-white hover:text-amber-400">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
