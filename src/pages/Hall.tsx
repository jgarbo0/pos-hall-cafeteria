
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import HallBookingForm from '@/components/HallBookingForm';
import HallBookingCalendar from '@/components/HallBookingCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookings } from '@/data/mockData';

// Mock data for tables and packages
const mockTables = [
  { id: 1, name: 'Table 1', seats: 4, status: 'available' },
  { id: 2, name: 'Table 2', seats: 6, status: 'available' },
  { id: 3, name: 'Table 3', seats: 8, status: 'occupied' },
  { id: 4, name: 'Table 4', seats: 4, status: 'available' },
];

const mockPackages = [
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

const Hall = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  
  const handleSelectBooking = (bookingId: string) => {
    setSelectedBooking(bookingId);
  };
  
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Hall Bookings</h1>
          
          <Tabs defaultValue="calendar" className="h-[calc(100vh-180px)]">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="new">New Booking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="h-full">
              <HallBookingCalendar onSelectBooking={handleSelectBooking} />
            </TabsContent>
            
            <TabsContent value="new">
              <HallBookingForm 
                initialData={selectedBooking ? bookings.find(b => b.id === selectedBooking) : undefined}
                onClearSelection={() => setSelectedBooking(null)}
                tables={mockTables}
                packages={mockPackages}
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
