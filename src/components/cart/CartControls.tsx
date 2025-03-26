
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RestaurantTable } from '@/services/TablesService';
import { Customer } from '@/types';

interface CartControlsProps {
  orderType: 'Dine In' | 'Take Away';
  onOrderTypeChange: (type: 'Dine In' | 'Take Away') => void;
  tableNumber: number;
  onTableChange: (tableNumber: number) => void;
  availableTables: RestaurantTable[];
  selectedCustomer: string;
  onCustomerChange: (customerId: string) => void;
  customers: Customer[];
  fetchAvailableTables: (orderType: 'Dine In' | 'Take Away') => void;
}

const CartControls: React.FC<CartControlsProps> = ({ 
  orderType,
  onOrderTypeChange,
  tableNumber,
  onTableChange,
  availableTables,
  selectedCustomer,
  onCustomerChange,
  customers,
  fetchAvailableTables
}) => {
  
  useEffect(() => {
    fetchAvailableTables(orderType);
  }, [orderType, fetchAvailableTables]);

  return (
    <div className="p-4 border-b dark:border-gray-700">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {orderType === 'Dine In' && (
            <div>
              <Label htmlFor="table-select" className="text-sm font-medium mb-1 block">
                Table
              </Label>
              <Select 
                value={tableNumber.toString()} 
                onValueChange={(value) => onTableChange(parseInt(value))}
              >
                <SelectTrigger id="table-select" className="w-full">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {availableTables.map(table => (
                    <SelectItem 
                      key={table.id} 
                      value={table.name.replace('Table ', '')}
                      disabled={table.status === 'occupied' || table.status === 'reserved'}
                    >
                      {table.name} ({table.seats} seats) - {table.location || 'Main Area'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <Label htmlFor="customer-select" className="text-sm font-medium mb-1 block">
              Customer
            </Label>
            <Select value={selectedCustomer} onValueChange={onCustomerChange}>
              <SelectTrigger id="customer-select" className="w-full">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Walk-in Customer">Walk-in Customer</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="order-type" className="text-sm font-medium mb-1 block">
            Order Type
          </Label>
          <RadioGroup 
            id="order-type" 
            className="flex gap-4" 
            value={orderType} 
            onValueChange={(value) => onOrderTypeChange(value as 'Dine In' | 'Take Away')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Dine In" id="dine-in" />
              <Label htmlFor="dine-in" className="cursor-pointer">Dine In</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Take Away" id="take-away" />
              <Label htmlFor="take-away" className="cursor-pointer">Take Away</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default CartControls;
