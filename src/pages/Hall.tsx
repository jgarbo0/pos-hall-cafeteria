
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import HallBookingForm from '@/components/HallBookingForm';
import HallBookingCalendar from '@/components/HallBookingCalendar';
import HallEditForm from '@/components/HallEditForm';
import PackageManagement from '@/components/PackageManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookings } from '@/data/mockData';
import { TableItem, ServicePackage, HallBooking, Hall as HallType, AvailabilityRange } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  customerPhone: '123-456-7890',
  additionalServices: ['photography', 'music'],
  status: 'pending' as const,
  totalAmount: 500,
  notes: 'Special setup required for the event.',
  hallId: 1,
  guests: {
    total: 120,
    children: 32,
    family: 90,
    group: 14,
    single: 16,
    staff: 20
  }
}));

// Hall data with availability range
const hallsData: Hall[] = [
  {
    id: 1,
    name: 'Hall One',
    image: '/lovable-uploads/e6ad9490-8326-48df-9c0d-eb6addb170e7.png',
    capacity: 150,
    type: 'Guest',
    availabilityRange: 'week'
  },
  {
    id: 2,
    name: 'Hall Two',
    image: '/lovable-uploads/e6ad9490-8326-48df-9c0d-eb6addb170e7.png',
    capacity: 200,
    type: 'Family',
    availabilityRange: 'month'
  },
];

const Hall = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [selectedHall, setSelectedHall] = useState<number>(1);
  const [editingHall, setEditingHall] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('calendar');
  
  const handleSelectBooking = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setActiveTab('new');
  };

  const handleSelectHall = (hallId: number) => {
    setSelectedHall(hallId);
  };
  
  const handleEditHall = () => {
    setEditingHall(true);
    setActiveTab('edit');
  };

  const handleSaveHall = (updatedHall: Hall) => {
    // In a real app, you would save this to your backend
    console.log('Updated hall:', updatedHall);
    setEditingHall(false);
    setActiveTab('calendar');
    toast.success('Hall details updated successfully!');
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
              {hallsData.map((hall) => (
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
                        <div className="text-sm text-gray-500 mt-1">Capacity:</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold">{hall.capacity}</span>
                          <Badge variant="outline">{hall.type}</Badge>
                        </div>
                        <div className="mt-2">
                          <Badge className="bg-blue-100 text-blue-800 border-none">
                            {hall.availabilityRange.charAt(0).toUpperCase() + hall.availabilityRange.slice(1)} availability
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleEditHall}>
                Edit Hall Details
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-360px)]">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="new">New Booking</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              {editingHall && <TabsTrigger value="edit">Edit Hall</TabsTrigger>}
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
                halls={hallsData}
                onSubmit={(booking) => {
                  console.log('Booking submitted:', booking);
                  toast.success('Booking saved successfully!');
                  // Here you would typically save the booking to your database
                }}
              />
            </TabsContent>

            <TabsContent value="packages">
              <PackageManagement 
                packages={mockPackages}
                onSave={(updatedPackages) => {
                  console.log('Packages updated:', updatedPackages);
                  toast.success('Packages updated successfully!');
                }}
              />
            </TabsContent>
            
            {editingHall && (
              <TabsContent value="edit">
                <HallEditForm 
                  hall={hallsData.find(h => h.id === selectedHall) || hallsData[0]}
                  onSave={handleSaveHall}
                  onCancel={() => {
                    setEditingHall(false);
                    setActiveTab('calendar');
                  }}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hall;
