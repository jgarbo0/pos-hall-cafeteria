import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '@/context/LanguageContext';

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

const hallsData: HallType[] = [
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
  const { t } = useLanguage();
  
  useEffect(() => {
    const storedDate = localStorage.getItem('selectedBookingDate');
    const storedTime = localStorage.getItem('selectedBookingTime');
    
    if (activeTab === 'new' && storedDate && storedTime) {
      console.log('Using stored date/time for new booking:', storedDate, storedTime);
    }
  }, [activeTab]);
  
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

  const handleSaveHall = (updatedHall: HallType) => {
    console.log('Updated hall:', updatedHall);
    setEditingHall(false);
    setActiveTab('calendar');
    toast.success('Hall details updated successfully!');
  };
  
  const getInitialBookingData = (): HallBooking | undefined => {
    const storedDate = localStorage.getItem('selectedBookingDate');
    const storedTime = localStorage.getItem('selectedBookingTime');
    
    if (selectedBooking && !selectedBooking.startsWith('new-')) {
      const foundBooking = fullBookings.find(b => b.id === selectedBooking);
      if (foundBooking) {
        return foundBooking;
      }
    }
    
    if (selectedBooking?.startsWith('new-') && storedDate && storedTime) {
      const newBooking: HallBooking = {
        id: selectedBooking,
        customerName: '',
        customerPhone: '',
        purpose: '',
        date: storedDate,
        startTime: storedTime,
        endTime: '10:00',
        attendees: 1,
        additionalServices: [],
        status: 'pending',
        totalAmount: 0,
        notes: '',
        hallId: selectedHall,
        guests: {
          total: 1,
          children: 0,
          family: 0,
          group: 0,
          single: 0,
          staff: 0
        }
      };
      
      return newBooking;
    }
    
    return undefined;
  };
  
  const handleSubmitBooking = (booking: any) => {
    console.log('Booking submitted:', booking);
    toast.success('Booking saved successfully!');
    
    localStorage.removeItem('selectedBookingDate');
    localStorage.removeItem('selectedBookingTime');
    
    setActiveTab('calendar');
  };
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Hall Bookings</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4 dark:text-gray-200">My Halls</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hallsData.map((hall) => (
                <Card 
                  key={hall.id} 
                  className={`cursor-pointer transition-all dark:bg-gray-800 ${selectedHall === hall.id ? 'ring-2 ring-primary bg-blue-50 dark:bg-blue-900/30' : 'bg-blue-50 dark:bg-gray-800'}`}
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
                        <h3 className="font-semibold dark:text-white">{hall.name}</h3>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Capacity:</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold dark:text-white">{hall.capacity}</span>
                          <Badge variant="outline" className="dark:text-gray-200 dark:border-gray-600">{hall.type}</Badge>
                        </div>
                        <div className="mt-2">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-none">
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
              <Button variant="outline" onClick={handleEditHall} className="dark:text-gray-200 dark:border-gray-600">
                Edit Hall Details
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-360px)]">
            <TabsList className="mb-4 dark:bg-gray-800">
              <TabsTrigger value="calendar" className="dark:data-[state=active]:bg-gray-700">Calendar View</TabsTrigger>
              <TabsTrigger value="new" className="dark:data-[state=active]:bg-gray-700">New Booking</TabsTrigger>
              <TabsTrigger value="packages" className="dark:data-[state=active]:bg-gray-700">Packages</TabsTrigger>
              {editingHall && <TabsTrigger value="edit" className="dark:data-[state=active]:bg-gray-700">Edit Hall</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="calendar" className="h-full">
              <HallBookingCalendar 
                onSelectBooking={handleSelectBooking}
                hallId={selectedHall}
              />
            </TabsContent>
            
            <TabsContent value="new">
              <HallBookingForm 
                initialData={getInitialBookingData()}
                onClearSelection={() => {
                  setSelectedBooking(null);
                  localStorage.removeItem('selectedBookingDate');
                  localStorage.removeItem('selectedBookingTime');
                }}
                tables={mockTables}
                packages={mockPackages}
                hallId={selectedHall}
                halls={hallsData}
                onSubmit={handleSubmitBooking}
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
