
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import HallBookingForm from '@/components/HallBookingForm';
import HallBookingCalendar from '@/components/HallBookingCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookings } from '@/data/mockData';

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
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hall;
