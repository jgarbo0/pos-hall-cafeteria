
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { bookings, timeSlots } from "@/data/mockData";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface HallBookingCalendarProps {
  onSelectBooking: (bookingId: string) => void;
}

const HallBookingCalendar: React.FC<HallBookingCalendarProps> = ({ onSelectBooking }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // Get bookings for the selected date
  const getBookingsForDate = () => {
    if (!date) return [];
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.date === dateStr);
  };

  // Check if a time slot has a booking
  const getBookingForTimeSlot = (timeSlot: string) => {
    const dateBookings = getBookingsForDate();
    return dateBookings.find(booking => 
      timeSlot >= booking.startTime && timeSlot < booking.endTime
    );
  };

  // Get dates with bookings for calendar highlighting
  const getDatesWithBookings = () => {
    const uniqueDates = [...new Set(bookings.map(booking => booking.date))];
    return uniqueDates.map(dateStr => new Date(dateStr));
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBooking(bookingId);
    onSelectBooking(bookingId);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Select Date</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-3 pointer-events-auto"
          modifiers={{
            booked: getDatesWithBookings()
          }}
          modifiersStyles={{
            booked: { 
              fontWeight: 'bold',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.5)' 
            }
          }}
        />
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></div>
            <span>Has Bookings</span>
          </div>
          
          <div>
            {date && (
              <span>Selected: <strong>{format(date, 'MMMM d, yyyy')}</strong></span>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-sm overflow-y-auto">
        <h2 className="text-lg font-medium mb-4">
          Time Slots for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
        </h2>
        
        {!date ? (
          <p className="text-gray-500 text-center py-8">Please select a date to view available time slots</p>
        ) : (
          <div className="grid gap-2">
            {timeSlots.map(timeSlot => {
              const booking = getBookingForTimeSlot(timeSlot);
              return (
                <div 
                  key={timeSlot}
                  className={`p-3 rounded-md flex items-center justify-between border ${
                    booking 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <span className="font-medium">{timeSlot}</span>
                    {booking && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {booking.purpose}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {booking ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={selectedBooking === booking.id ? 'bg-blue-100' : ''}
                        >
                          Details
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">{booking.purpose}</h3>
                          <p className="text-sm">Time: {booking.startTime} - {booking.endTime}</p>
                          <p className="text-sm">Customer: {booking.customerName}</p>
                          <p className="text-sm">Attendees: {booking.attendees}</p>
                          <div className="pt-2 flex justify-end">
                            <Button 
                              size="sm"
                              onClick={() => handleSelectBooking(booking.id)}
                            >
                              View Full Details
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button variant="outline" size="sm">Book</Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HallBookingCalendar;
