
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { bookings, timeSlots } from "@/data/mockData";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HallBookingCalendarProps {
  onSelectBooking: (bookingId: string) => void;
  hallId?: number;
}

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock service items to display in the sidebar
const mockServices = [
  { id: 'photography', name: 'Photography' },
  { id: 'videography', name: 'Videography' },
  { id: 'music', name: 'Music System' },
  { id: 'projector', name: 'Projector' },
  { id: 'microphone', name: 'Microphone Set' },
];

const HallBookingCalendar: React.FC<HallBookingCalendarProps> = ({ onSelectBooking, hallId = 1 }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [viewingMonth, setViewingMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Determine the days to display in the calendar grid
  const getDaysInMonth = () => {
    if (!viewingMonth) return [];
    
    const start = startOfMonth(viewingMonth);
    const end = endOfMonth(viewingMonth);
    return eachDayOfInterval({ start, end });
  };

  // Get bookings for the selected date
  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter(booking => {
      // Safely access hallId property, treating bookings as having optional hallId
      const bookingHallId = (booking as any).hallId;
      return booking.date === dateStr && (!hallId || bookingHallId === hallId);
    });
  };

  // Check if a date has any bookings
  const hasBookings = (dateStr: string) => {
    return getBookingsForDate(dateStr).length > 0;
  };

  // Check if a time slot has a booking on the selected date
  const getBookingForTimeSlot = (timeSlot: string) => {
    if (!selectedDate) return null;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dateBookings = getBookingsForDate(dateStr);
    return dateBookings.find(booking => 
      timeSlot >= booking.startTime && timeSlot < booking.endTime
    );
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBooking(bookingId);
    onSelectBooking(bookingId);
  };

  const handleNextMonth = () => {
    setViewingMonth(addMonths(viewingMonth, 1));
  };

  const handlePrevMonth = () => {
    setViewingMonth(subMonths(viewingMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const daysInMonth = getDaysInMonth();

  // Find the selected booking details for the side panel
  const selectedDateBookings = selectedDate 
    ? getBookingsForDate(format(selectedDate, 'yyyy-MM-dd')) 
    : [];

  // Find the selected hall details
  const selectedHallData = {
    id: hallId,
    name: hallId === 1 ? 'Hall One' : 'Hall Two',
    image: '/lovable-uploads/e6ad9490-8326-48df-9c0d-eb6addb170e7.png',
    date: selectedDate ? format(selectedDate, 'dd MMMM yyyy') : '',
  };

  // Get services for the first booking on the selected date (for demo purposes)
  const firstBooking = selectedDateBookings[0];
  // Safely access additionalServices property, treating it as optional
  const firstBookingAdditionalServices = firstBooking ? (firstBooking as any).additionalServices || [] : [];
  const bookingServices = firstBooking 
    ? mockServices.filter(service => 
        firstBookingAdditionalServices.includes(service.id)
      )
    : [];

  // Handle the createBooking action (this was the undefined setActiveTab)
  const handleCreateBooking = () => {
    // Instead of using undefined setActiveTab, we'll just call onSelectBooking with a new random ID
    // which will trigger the parent component to show the booking form
    if (firstBooking) {
      handleSelectBooking(firstBooking.id);
    } else {
      // Generate a temporary ID for a new booking
      const tempId = `new-${Date.now()}`;
      handleSelectBooking(tempId);
    }
  };

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Booked dates</h2>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevMonth}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-base font-medium">
                {format(viewingMonth, 'MMMM - yyyy')}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextMonth}
                className="flex items-center gap-1"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Calendar Header (Days of Week) */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: new Date(viewingMonth.getFullYear(), viewingMonth.getMonth(), 1).getDay() || 7 - 1 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 border bg-gray-50 rounded-md opacity-50"></div>
              ))}
              
              {daysInMonth.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isBooked = hasBookings(dateStr);
                const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr;
                const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
                
                return (
                  <div 
                    key={dateStr}
                    onClick={() => handleDateClick(day)}
                    className={`h-16 border rounded-md flex flex-col justify-start p-1 cursor-pointer transition-colors
                      ${isSelected ? 'ring-2 ring-primary bg-blue-50' : ''}
                      ${isBooked ? 'bg-pink-100' : 'hover:bg-gray-50'}
                      ${isToday ? 'border-blue-500' : ''}
                    `}
                  >
                    <div className={`text-right p-1 text-sm ${isToday ? 'font-bold' : ''}`}>
                      {format(day, 'd')}
                    </div>
                    {isBooked && (
                      <div className="mt-auto">
                        <Badge variant="outline" className="bg-primary/10 text-[10px] w-full flex justify-center">
                          Booked
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 space-y-6">
          {/* Selected Hall Card */}
          {selectedDate && (
            <Card className="bg-white shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-32 bg-gradient-to-r from-blue-400 to-blue-600 overflow-hidden">
                  <img 
                    src={selectedHallData.image} 
                    alt={selectedHallData.name}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-xl font-bold">{selectedHallData.name}</h3>
                    <p className="text-sm">{selectedHallData.date}</p>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {selectedDateBookings.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Total Guests</p>
                          <div className="flex items-center justify-between border rounded-md p-2">
                            <span className="font-medium">120</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Children</p>
                          <div className="flex items-center justify-between border rounded-md p-2">
                            <span className="font-medium">32</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Family</p>
                          <div className="flex items-center justify-between border rounded-md p-2">
                            <span className="font-medium">90</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Group</p>
                          <div className="flex items-center justify-between border rounded-md p-2">
                            <span className="font-medium">14</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Single</p>
                          <div className="flex items-center justify-between border rounded-md p-2">
                            <span className="font-medium">16</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">No. of Staff</p>
                          <div className="flex items-center justify-between border rounded-md p-2">
                            <span className="font-medium">20</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Reception Status</p>
                        <div className="flex items-center justify-between border rounded-md p-2">
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                      </div>
                      
                      {/* Services Selected */}
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Services Selected</p>
                        <div className="flex flex-wrap gap-2">
                          {bookingServices.length > 0 ? (
                            bookingServices.map(service => (
                              <Badge key={service.id} variant="outline" className="bg-blue-50">
                                {service.name}
                              </Badge>
                            ))
                          ) : (
                            <div className="text-sm text-gray-400 italic">No services selected</div>
                          )}
                        </div>
                      </div>
                      
                      {/* Notes */}
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Notes</p>
                        <div className="border rounded-md p-2 min-h-[60px] text-sm">
                          {firstBooking && (firstBooking as any).notes ? (firstBooking as any).notes : "No notes available"}
                        </div>
                      </div>
                      
                      {/* Edit Booking Button */}
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => firstBooking && handleSelectBooking(firstBooking.id)}
                      >
                        Edit Booking
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="text-gray-500 mb-4">No bookings for this date</p>
                      <Button onClick={handleCreateBooking}>Create Booking</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!selectedDate && (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">Select a date to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallBookingCalendar;
