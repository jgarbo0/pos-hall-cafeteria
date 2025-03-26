
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Receipt, Search } from 'lucide-react';

interface OrdersHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  onAddNew: () => void;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onAddNew
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold dark:text-white">Orders/Sales Management</h1>
      <div className="flex gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-8"
          />
        </div>
        <Button onClick={onRefresh} variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
        <Button variant="outline">
          <Receipt className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
