import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import HallBookingForm from '@/components/HallBookingForm';
import HallBookingCalendar from '@/components/HallBookingCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookings } from '@/data/mockData';
import { TableItem, ServicePackage, HallBooking } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for tables and packages with proper typing
const mockTables: TableItem[] = [
  { id: 1, name: 'Table 1', seats: 4, status: 'available' },
  { id: 2, name: 'Table 2', seats: 6, status: 'available' },
  { id: 3, name: 'Table 3', seats: 8, status: 'occupied' },
  { id: 4, name: 'Table 4', seats: 4, status: 'available' },
];

const mockPackages: ServicePackage[] = [
  {
    id: 'pkg1',
    name: 'Basic Package',
    description: 'Essential setup for small gatherings',
    price: 200,
    items: ['Basic seating arrangement', 'Standard lighting', 'Water service']
  },
  {
    id: 'pkg2',
    name: 'Standard Package',
    description: 'Perfect for medium-sized events',
    price: 500,
    items: ['Elegant seating arrangement', 'Professional lighting', 'Water and juice service', 'Basic sound system']
  },
  {
    id: 'pkg3',
    name: 'Premium Package',
    description: 'Luxury setup for special occasions',
    price: 1000,
    items: ['Premium decoration', 'Advanced lighting system', 'Full beverage service', 'Professional sound system', 'Basic video recording']
  }
];

// Extended mock bookings to match the HallBooking type
const fullBookings: HallBooking[] = bookings.map(booking => ({
  ...booking,
  customerPhone: '123-456-7890', // Adding required fields
  additionalServices: [],
  status: 'pending' as const,
  totalAmount: 0,
  notes: '',
  hallId: 1 // Default hall ID
}));

// Mock data for hall cards
const hallCards = [
  {
    id: 1,
    name: 'Somali Hall 1',
    image: '/lovable-uploads/af565575-6616-4b09-8b69-dddf2967d846.png',
    capacity: 120,
    type: 'Guest'
  },
  {
    id: 2,
    name: 'Somali Hall 2',
    image: '/lovable-uploads/af565575-6616-4b09-8b69-dddf2967d846.png',
    capacity: 120,
    type: 'Guest'
  },
];

const Hall = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [selectedHall, setSelectedHall] = useState<number>(1);
  
  const handleSelectBooking = (bookingId: string) => {
    setSelectedBooking(bookingId);
  };

  const handleSelectHall = (hallId: number) => {
    setSelectedHall(hallId);
  };
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Hall Bookings</h1>
          
          {/* Hall Cards */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">My Halls</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hallCards.map((hall) => (
                <Card 
                  key={hall.id} 
                  className={`cursor-pointer transition-all ${selectedHall === hall.id ? 'ring-2 ring-primary bg-blue-50' : 'bg-blue-50'}`}
                  onClick={() => handleSelectHall(hall.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 overflow-hidden rounded-lg">
                        <img 
                          src={hall.image} 
                          alt={hall.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{hall.name}</h3>
                        <div className="text-sm text-gray-500 mt-1">Booked:</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold">{hall.capacity}</span>
                          <Badge variant="outline">{hall.type}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <Tabs defaultValue="calendar" className="h-[calc(100vh-360px)]">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="new">New Booking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="h-full">
              <HallBookingCalendar 
                onSelectBooking={handleSelectBooking}
                hallId={selectedHall}
              />
            </TabsContent>
            
            <TabsContent value="new">
              <HallBookingForm 
                initialData={selectedBooking ? fullBookings.find(b => b.id === selectedBooking) : undefined}
                onClearSelection={() => setSelectedBooking(null)}
                tables={mockTables}
                packages={mockPackages}
                hallId={selectedHall}
                onSubmit={(booking) => {
                  console.log('Booking submitted:', booking);
                  // Here you would typically save the booking to your database
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hall;
