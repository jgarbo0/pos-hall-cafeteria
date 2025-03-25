
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Filter, Download, Plus } from 'lucide-react';

interface FinanceHeaderProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  dateRange: 'day' | 'week' | 'month';
  onDateRangeChange: (range: 'day' | 'week' | 'month') => void;
  onAddTransactionClick: () => void;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  date,
  onDateChange,
  dateRange,
  onDateRangeChange,
  onAddTransactionClick
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Finance Dashboard</h1>
      
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, 'PPP') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              className="dark:bg-gray-800"
            />
          </PopoverContent>
        </Popover>

        <Select 
          value={dateRange} 
          onValueChange={(value: any) => onDateRangeChange(value)}
        >
          <SelectTrigger className="w-[150px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        <Button variant="outline" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button 
          className="dark:bg-blue-600 dark:text-white"
          onClick={onAddTransactionClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
    </div>
  );
};

export default FinanceHeader;
