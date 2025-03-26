
import React, { useMemo } from 'react';
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
  // Calculate total incomes
  const totalIncome = useMemo(() => 
    hallBookings?.reduce((sum, booking) => sum + Number(booking.amount), 0) || 0, 
    [hallBookings]
  );
  
  // Assume expenses are 30% of income for demonstration purposes
  const totalExpense = useMemo(() => totalIncome * 0.3, [totalIncome]);
  
  // Generate chart data from bookings
  const financeData = useMemo(() => {
    // Create a dummy 7-day dataset if no data is available
    if (!hallBookings?.length) {
      return Array(7).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          income: 0,
          expense: 0
        };
      });
    }
    
    // Create a map to group bookings by date
    const dateMap = new Map();
    const today = new Date();
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(today.getDate() - 6);
    
    // Initialize the map with dates from the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(sixDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { 
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income: 0, 
        expense: 0 
      });
    }
    
    // Populate the map with actual booking data
    hallBookings.forEach(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      if (dateMap.has(bookingDate)) {
        const dayData = dateMap.get(bookingDate);
        dayData.income += Number(booking.amount);
        dayData.expense += Number(booking.amount) * 0.3; // Assume expenses are 30% of income
        dateMap.set(bookingDate, dayData);
      }
    });
    
    // Convert the map to an array and sort by date
    return Array.from(dateMap.values());
  }, [hallBookings]);

  return (
    <div className="space-y-8">
      <HallBookingFinanceWidget
        data={financeData}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        onViewReport={() => onViewDetails('all')}
        isLoading={isLoadingHallData}
      />
      
      <div className="mt-10">
        <HallBookingIncomesList
          bookings={hallBookings || []}
          isLoading={isLoadingHallData}
          onViewDetails={onViewDetails}
        />
      </div>
    </div>
  );
};

export default HallBookingsFinanceTab;
