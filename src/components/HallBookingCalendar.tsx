
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, parseISO } from "date-fns";
import { bookings, timeSlots } from "@/data/mockData";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, Check } from "lucide-react";
import { HallBooking } from '@/types';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [hallBookings, setHallBookings] = useState<HallBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch bookings from database
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('hall_bookings')
          .select('*')
          .eq('hall_id', hallId);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Convert database records to HallBooking type
          const formattedBookings: HallBooking[] = data.map(item => ({
            id: item.id,
            date: item.date,
            startTime: item.start_time,
            endTime: item.end_time,
            customerName: item.customer_name,
            customerPhone: item.customer_phone,
            purpose: item.purpose,
            attendees: item.attendees,
            additionalServices: item.additional_services || [],
            status: item.status as 'pending' | 'confirmed' | 'canceled',
            totalAmount: item.total_amount,
            notes: item.notes || '',
            hallId: item.hall_id,
            packageId: item.package_id
          }));
          setHallBookings(formattedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [hallId]);

  // Determine the days to display in the calendar grid
  const getDaysInMonth = () => {
    if (!viewingMonth) return [];
    
    const start = startOfMonth(viewingMonth);
    const end = endOfMonth(viewingMonth);
    return eachDayOfInterval({ start, end });
  };

  // Get bookings for the selected date
  const getBookingsForDate = (dateStr: string) => {
    // First check the database bookings
    if (hallBookings.length > 0) {
      return hallBookings.filter(booking => {
        return booking.date === dateStr && (!hallId || booking.hallId === hallId);
      });
    }
    
    // Fallback to mock data if needed
    return bookings.filter(booking => {
      const bookingHallId = (booking as any).hallId;
      return booking.date === dateStr && (!hallId || bookingHallId === hallId);
    });
  };

  // Check if a date has any bookings
  const hasBookings = (dateStr: string) => {
    return getBookingsForDate(dateStr).length > 0;
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return timeSlots;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dateBookings = getBookingsForDate(dateStr);
    
    // Filter out time slots that are already booked
    return timeSlots.filter(timeSlot => {
      return !dateBookings.some(booking => 
        timeSlot >= booking.startTime && timeSlot < booking.endTime
      );
    });
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
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const daysInMonth = getDaysInMonth();

  // Find the selected booking details for the side panel
  const selectedDateBookings = selectedDate 
    ? getBookingsForDate(format(selectedDate, 'yyyy-MM-dd')) 
    : [];

  const availableTimeSlots = getAvailableTimeSlots();
  const hasAvailableTimeSlots = availableTimeSlots.length > 0;

  // Find the selected hall details
  const selectedHallData = {
    id: hallId,
    name: hallId === 1 ? 'Hall One' : 'Hall Two',
    image: '/lovable-uploads/e6ad9490-8326-48df-9c0d-eb6addb170e7.png',
    date: selectedDate ? format(selectedDate, 'dd MMMM yyyy') : '',
  };

  // Get services for the first booking on the selected date (for demo purposes)
  const firstBooking = selectedDateBookings[0];
  // Safely access additionalServices property
  const bookingServices = firstBooking && firstBooking.additionalServices 
    ? mockServices.filter(service => 
        firstBooking.additionalServices?.includes(service.id)
      )
    : [];

  // Handle the createBooking action
  const handleCreateBooking = () => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot first');
      return;
    }
    
    // Store selected date and time in localStorage to pass to booking form
    localStorage.setItem('selectedBookingDate', format(selectedDate, 'yyyy-MM-dd'));
    localStorage.setItem('selectedBookingTime', selectedTimeSlot);
    
    // Generate a temporary ID for a new booking
    const tempId = `new-${Date.now()}`;
    handleSelectBooking(tempId);
  };

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="w-full md:w-2/3 bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2 dark:text-gray-200">Booked dates</h2>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrevMonth}
                className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-base font-medium dark:text-gray-200">
                {format(viewingMonth, 'MMMM - yyyy')}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextMonth}
                className="flex items-center gap-1 dark:text-gray-300 dark:border-gray-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Calendar Header (Days of Week) */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: new Date(viewingMonth.getFullYear(), viewingMonth.getMonth(), 1).getDay() || 7 - 1 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md opacity-50"></div>
              ))}
              
              {daysInMonth.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isBooked = hasBookings(dateStr);
                const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr;
                const isTodayDate = isToday(day);
                
                return (
                  <div 
                    key={dateStr}
                    onClick={() => handleDateClick(day)}
                    className={`h-16 border dark:border-gray-700 rounded-md flex flex-col justify-start p-1 cursor-pointer transition-colors
                      ${isSelected ? 'ring-2 ring-primary bg-blue-50 dark:bg-blue-900/30' : ''}
                      ${isBooked ? 'bg-pink-100 dark:bg-pink-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                      ${isTodayDate ? 'border-blue-500' : ''}
                    `}
                  >
                    <div className={`text-right p-1 text-sm ${isTodayDate ? 'font-bold' : ''} dark:text-gray-200`}>
                      {format(day, 'd')}
                    </div>
                    {isBooked && (
                      <div className="mt-auto">
                        <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20 text-[10px] w-full flex justify-center">
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
            <Card className="bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
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
                
                <div className="p-4 space-y-4 dark:text-gray-200">
                  {selectedDateBookings.length > 0 ? (
                    <>
                      <h3 className="font-medium text-lg">Bookings for this date:</h3>
                      <div className="space-y-3">
                        {selectedDateBookings.map((booking) => (
                          <div key={booking.id} className="border dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => handleSelectBooking(booking.id)}>
                            <div className="flex justify-between">
                              <div className="font-medium">{booking.customerName}</div>
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                                {booking.purpose}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.startTime} - {booking.endTime}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <div className="text-xs text-gray-500 dark:text-gray-400">Guests</div>
                              <div className="text-xs font-medium text-right">{booking.attendees}</div>
                            </div>
                            {booking.additionalServices && booking.additionalServices.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Services:</div>
                                <div className="flex flex-wrap gap-1">
                                  {booking.additionalServices.map(service => (
                                    <Badge key={service} variant="outline" className="text-[10px] bg-gray-50 dark:bg-gray-800">
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {booking.notes && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Notes:</span> {booking.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {hasAvailableTimeSlots && (
                        <div className="pt-3 border-t dark:border-gray-700 mt-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium">Available Time Slots:</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{availableTimeSlots.length} slots</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {availableTimeSlots.map(slot => (
                              <Badge 
                                key={slot} 
                                variant="outline" 
                                className={`cursor-pointer ${
                                  selectedTimeSlot === slot
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-green-50 dark:bg-green-900/30'
                                }`}
                                onClick={() => handleTimeSlotClick(slot)}
                              >
                                {slot}
                                {selectedTimeSlot === slot && (
                                  <Check className="ml-1 h-3 w-3" />
                                )}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            className="w-full mt-4" 
                            onClick={handleCreateBooking}
                            disabled={!selectedTimeSlot}
                          >
                            Create New Booking
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No bookings for this date</p>
                      <div className="space-y-3 w-full">
                        <div>
                          <h4 className="font-medium mb-2">Available Time Slots:</h4>
                          <div className="flex flex-wrap gap-2">
                            {timeSlots.map(slot => (
                              <Badge 
                                key={slot} 
                                variant="outline" 
                                className={`cursor-pointer ${
                                  selectedTimeSlot === slot
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-green-50 dark:bg-green-900/30'
                                }`}
                                onClick={() => handleTimeSlotClick(slot)}
                              >
                                {slot}
                                {selectedTimeSlot === slot && (
                                  <Check className="ml-1 h-3 w-3" />
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          onClick={handleCreateBooking}
                          className="w-full mt-4"
                          disabled={!selectedTimeSlot}
                        >
                          Create Booking
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!selectedDate && (
            <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 border-dashed">
              <p className="text-gray-500 dark:text-gray-400">Select a date to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallBookingCalendar;
