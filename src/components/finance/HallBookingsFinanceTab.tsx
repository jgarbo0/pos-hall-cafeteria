
import React from 'react';
import { HallBookingIncome } from '@/types/finance';
import HallBookingFinanceWidget from './HallBookingFinanceWidget';
import HallBookingIncomesList from './HallBookingIncomesList';

interface HallBookingsFinanceTabProps {
  hallBookings: HallBookingIncome[];
  hall1Bookings: HallBookingIncome[];
  hall2Bookings: HallBookingIncome[];
  isLoadingHallData: boolean;
  onViewDetails: (id: string) => void;
  onSearch: (term: string) => void;
}

const HallBookingsFinanceTab: React.FC<HallBookingsFinanceTabProps> = ({
  hallBookings,
  hall1Bookings,
  hall2Bookings,
  isLoadingHallData,
  onViewDetails,
  onSearch
}) => {
  // Calculate totals for chart data
  const totalIncome = hallBookings.reduce((sum, booking) => sum + booking.amount, 0);
  const totalExpense = 0; // Assume no expenses for hall bookings or calculate if available
  
  // Generate chart data from hall bookings
  const chartData = hallBookings.map(booking => ({
    name: new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    income: booking.amount,
    expense: 0 // Assuming no expense per booking
  }));
  
  return (
    <div>
      <HallBookingFinanceWidget
        data={chartData}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        onViewReport={() => onViewDetails('all')}
        isLoading={isLoadingHallData}
      />
      <HallBookingIncomesList
        bookings={hallBookings}
        isLoading={isLoadingHallData}
        onViewDetails={onViewDetails}
      />
    </div>
  );
};

export default HallBookingsFinanceTab;
