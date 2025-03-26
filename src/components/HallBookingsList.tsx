
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HallBooking } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Clock, Users, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface HallBookingsListProps {
  onSelectBooking: (bookingId: string) => void;
  hallId?: number;
}

const HallBookingsList: React.FC<HallBookingsListProps> = ({ 
  onSelectBooking,
  hallId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['hallBookings', hallId],
    queryFn: async () => {
      try {
        let query = supabase
          .from('hall_bookings')
          .select('*');
        
        if (hallId) {
          query = query.eq('hall_id', hallId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        return data.map(item => ({
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
          packageId: item.package_id,
          discount: item.discount,
          discountType: item.discount_type as 'percentage' | 'fixed',
        })) as HallBooking[];
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
        return [];
      }
    }
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerPhone.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || 
      booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'canceled') => {
    try {
      const { error } = await supabase
        .from('hall_bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
      
      if (error) {
        throw error;
      }
      
      toast.success(`Booking status updated to ${newStatus}`);
      
      // Refresh the data by invalidating the query
      // Using window.location.reload() for simplicity as we don't have direct access to queryClient
      window.location.reload();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>All Hall Bookings</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer name or purpose..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No bookings found matching your criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-400">Date</TableHead>
                  <TableHead className="dark:text-gray-400">Time</TableHead>
                  <TableHead className="dark:text-gray-400">Customer</TableHead>
                  <TableHead className="dark:text-gray-400">Purpose</TableHead>
                  <TableHead className="dark:text-gray-400">Attendees</TableHead>
                  <TableHead className="dark:text-gray-400">Status</TableHead>
                  <TableHead className="dark:text-gray-400 text-right">Amount</TableHead>
                  <TableHead className="dark:text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="dark:border-gray-700">
                    <TableCell className="dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                        {booking.date}
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <div>
                        <div>{booking.customerName}</div>
                        <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">{booking.purpose}</TableCell>
                    <TableCell className="dark:text-gray-300">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        {booking.attendees}
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <Badge className={`${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="dark:text-gray-300 text-right font-medium">
                      ${booking.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSelectBooking(booking.id)}
                        >
                          Edit
                        </Button>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleUpdateStatus(
                            booking.id, 
                            value as 'pending' | 'confirmed' | 'canceled'
                          )}
                        >
                          <SelectTrigger className="w-[110px] h-8">
                            <SelectValue placeholder="Set Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="canceled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HallBookingsList;
