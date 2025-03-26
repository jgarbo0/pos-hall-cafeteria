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
  return (
    <div>
      <HallBookingFinanceWidget
        hallBookings={hallBookings}
        hall1Bookings={hall1Bookings}
        hall2Bookings={hall2Bookings}
        isLoadingHallData={isLoadingHallData}
        onSearch={onSearch}
      />
      <HallBookingIncomesList
        hallBookings={hallBookings}
        isLoadingHallData={isLoadingHallData}
        onViewDetails={onViewDetails}
      />
    </div>
  );
};

export default HallBookingsFinanceTab;
