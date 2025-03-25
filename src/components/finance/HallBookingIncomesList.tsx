
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Building, CalendarIcon, Users } from 'lucide-react';

interface HallBookingIncome {
  id: string;
  date: string | Date;
  customerName: string;
  purpose: string;
  attendees: number;
  amount: number;
}

interface HallBookingIncomesListProps {
  bookings: HallBookingIncome[];
  onViewDetails: (id: string) => void;
}

const HallBookingIncomesList: React.FC<HallBookingIncomesListProps> = ({
  bookings,
  onViewDetails
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Hall Booking Incomes</CardTitle>
        <Button variant="outline" size="sm" onClick={() => onViewDetails('all')}>
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-400">Date</TableHead>
              <TableHead className="dark:text-gray-400">Customer</TableHead>
              <TableHead className="dark:text-gray-400">Purpose</TableHead>
              <TableHead className="dark:text-gray-400 text-right">Attendees</TableHead>
              <TableHead className="dark:text-gray-400 text-right">Amount</TableHead>
              <TableHead className="dark:text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No hall booking incomes found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="dark:border-gray-700">
                  <TableCell className="font-medium dark:text-gray-300 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {format(new Date(booking.date), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{booking.customerName}</TableCell>
                  <TableCell className="dark:text-gray-300 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    {booking.purpose}
                  </TableCell>
                  <TableCell className="dark:text-gray-300 text-right flex items-center justify-end">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    {booking.attendees}
                  </TableCell>
                  <TableCell className="dark:text-gray-300 text-right font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(booking.amount)}
                  </TableCell>
                  <TableCell className="dark:text-gray-300 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetails(booking.id)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HallBookingIncomesList;
