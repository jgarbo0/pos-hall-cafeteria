
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown } from 'lucide-react';

type DateRange = 'all' | 'today' | 'week' | 'month';

interface OrdersFiltersProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  dateRange: DateRange;
  setDateRange: (value: DateRange) => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  activeTab,
  setActiveTab,
  dateRange,
  setDateRange
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="dark:bg-gray-800">
          <TabsTrigger value="all" className="dark:data-[state=active]:bg-gray-700">All Orders</TabsTrigger>
          <TabsTrigger value="processing" className="dark:data-[state=active]:bg-gray-700">Processing</TabsTrigger>
          <TabsTrigger value="completed" className="dark:data-[state=active]:bg-gray-700">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="dark:data-[state=active]:bg-gray-700">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {dateRange === 'all' ? 'All Time' : 
             dateRange === 'today' ? 'Today' : 
             dateRange === 'week' ? 'This Week' : 'This Month'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setDateRange('all')}>
            All Time
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDateRange('today')}>
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDateRange('week')}>
            This Week
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDateRange('month')}>
            This Month
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrdersFilters;
