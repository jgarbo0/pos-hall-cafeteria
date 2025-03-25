
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  purpose: string;
  date: Date;
  time: string;
  guests: number;
}

interface UpcomingBookingsProps {
  bookings: Booking[];
}

const UpcomingBookings: React.FC<UpcomingBookingsProps> = ({ bookings }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Bookings</CardTitle>
        <CardDescription>
          Scheduled hall and venue bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bookings.map(booking => (
            <Card key={booking.id} className="bg-gray-50 shadow-none dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {booking.purpose}
                  </Badge>
                  <div className="text-sm">{booking.guests} guests</div>
                </div>
                <h4 className="font-semibold">{booking.customerName}</h4>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  <span>{format(booking.date, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{booking.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => navigate('/hall')}
        >
          View All Bookings
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpcomingBookings;
