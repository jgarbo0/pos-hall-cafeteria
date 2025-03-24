
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { format } from 'date-fns';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Utensils, 
  Camera, 
  Music, 
  Mic, 
  PlusCircle, 
  Package
} from 'lucide-react';
import { ServicePackage, TableItem, HallBooking } from '@/types';
import HallBookingForm from '@/components/HallBookingForm';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Hall = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<HallBooking[]>([
    {
      id: "BK001",
      customerName: "Ahmed Hassan",
      customerPhone: "+252634567890",
      date: "2023-10-18",
      startTime: "18:00",
      endTime: "22:00",
      purpose: "Wedding Reception",
      attendees: 60,
      tableId: 6,
      packageId: "pkg2",
      additionalServices: ["music", "photography"],
      status: "confirmed",
      notes: "Bride prefers white decorations",
      totalAmount: 450
    },
    {
      id: "BK002",
      customerName: "Fadumo Ali",
      customerPhone: "+252612345678",
      date: "2023-10-20",
      startTime: "09:00",
      endTime: "14:00",
      purpose: "Business Seminar",
      attendees: 25,
      packageId: "pkg1",
      additionalServices: ["projector"],
      status: "pending",
      notes: "Needs special setup for presentations",
      totalAmount: 180
    }
  ]);
  
  const [tables] = useState<TableItem[]>([
    { id: 1, name: 'Table 1', seats: 4, status: 'available' },
    { id: 2, name: 'Table 2', seats: 2, status: 'occupied' },
    { id: 3, name: 'Table 3', seats: 6, status: 'available' },
    { id: 4, name: 'Table 4', seats: 4, status: 'available' },
    { id: 5, name: 'Table 5', seats: 2, status: 'occupied' },
    { id: 6, name: 'Table 6', seats: 8, status: 'available' },
    { id: 7, name: 'Table 7', seats: 4, status: 'available' },
    { id: 8, name: 'Table 8', seats: 2, status: 'available' },
  ]);

  const [servicePackages] = useState<ServicePackage[]>([
    {
      id: "pkg1",
      name: "Business Meeting Package",
      description: "Perfect for corporate events and business meetings",
      price: 150,
      items: ["Projector & Screen", "Coffee & Tea Service", "Water & Snacks", "Notepads & Pens"]
    },
    {
      id: "pkg2",
      name: "Wedding Reception Package",
      description: "Everything you need for your special day",
      price: 350,
      items: ["Decorated Tables & Chairs", "Buffet Setup", "Basic Sound System", "Wedding Cake Table"]
    },
    {
      id: "pkg3",
      name: "Birthday Celebration Package",
      description: "Make your birthday party memorable",
      price: 200,
      items: ["Decorated Area", "Sound System", "Cake Table Setup", "Soft Drinks Service"]
    }
  ]);

  const handleSelectTable = (tableId: number) => {
    setSelectedTable(tableId);
    
    // Find the table by ID
    const table = tables.find(t => t.id === tableId);
    
    if (table?.status === 'occupied') {
      toast.error("This table is already occupied");
    } else {
      toast.success(`Table ${tableId} selected`);
      // In a real app, you would store this selected table in a global state
      localStorage.setItem('selectedTable', tableId.toString());
    }
  };

  const getBookingsForDate = (date: Date | undefined) => {
    if (!date) return [];
    const dateString = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.date === dateString);
  };

  const currentDateBookings = getBookingsForDate(selectedDate);

  const handleAddBooking = (booking: HallBooking) => {
    setBookings([...bookings, booking]);
    toast.success("Booking added successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Hall Management</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Booking
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md w-[600px] overflow-y-auto">
                <HallBookingForm 
                  tables={tables} 
                  packages={servicePackages} 
                  onSubmit={handleAddBooking}
                />
              </SheetContent>
            </Sheet>
          </div>
          
          <Tabs defaultValue="bookings">
            <TabsList className="mb-6">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CalendarDays className="mr-2 h-5 w-5" />
                        Booking Calendar
                      </CardTitle>
                      <CardDescription>Select a date to view bookings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border pointer-events-auto"
                      />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="mr-2 h-5 w-5" />
                        {selectedDate ? 
                          `Bookings for ${format(selectedDate, 'MMMM d, yyyy')}` : 
                          'Select a date to view bookings'}
                      </CardTitle>
                      <CardDescription>
                        {currentDateBookings.length === 0 ? 
                          'No bookings for this date' : 
                          `${currentDateBookings.length} booking(s) scheduled`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentDateBookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No bookings found for this date
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentDateBookings.map((booking) => (
                            <Card key={booking.id} className="overflow-hidden">
                              <div className={`h-2 ${
                                booking.status === 'confirmed' ? 'bg-green-500' : 
                                booking.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                              }`} />
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium">{booking.purpose}</h3>
                                    <p className="text-sm text-gray-500">{booking.customerName} • {booking.customerPhone}</p>
                                  </div>
                                  <div className="px-2 py-1 text-xs rounded-full bg-gray-100">
                                    {booking.startTime} - {booking.endTime}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Users className="h-3 w-3 mr-1" />
                                    {booking.attendees} Attendees
                                  </div>
                                  {booking.packageId && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Package className="h-3 w-3 mr-1" />
                                      {servicePackages.find(p => p.id === booking.packageId)?.name}
                                    </div>
                                  )}
                                  {booking.tableId && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Utensils className="h-3 w-3 mr-1" />
                                      Table {booking.tableId}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tables" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <div 
                    key={table.id}
                    className={`p-4 rounded-lg border ${
                      table.status === 'available' 
                        ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                        : 'bg-gray-100'
                    } ${
                      selectedTable === table.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectTable(table.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{table.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        table.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {table.status === 'available' ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Seats: {table.seats}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="packages" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicePackages.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="font-semibold text-lg mb-3">${pkg.price.toFixed(2)}</div>
                      <ul className="space-y-2">
                        {pkg.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Select Package
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hall;
