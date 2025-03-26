
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CartDiscountProps {
  globalDiscount: number;
  discountType: 'percentage' | 'fixed';
  onDiscountChange: (value: number) => void;
  onDiscountTypeChange: (type: 'percentage' | 'fixed') => void;
  hasItems: boolean;
}

const CartDiscount: React.FC<CartDiscountProps> = ({
  globalDiscount,
  discountType,
  onDiscountChange,
  onDiscountTypeChange,
  hasItems
}) => {
  if (!hasItems) return null;
  
  return (
    <div className="px-4 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="discount-type" className="text-sm font-medium">
            Discount:
          </Label>
          <RadioGroup 
            id="discount-type" 
            className="flex gap-4" 
            value={discountType} 
            onValueChange={(value) => onDiscountTypeChange(value as 'percentage' | 'fixed')}
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage" className="cursor-pointer text-xs">%</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed" className="cursor-pointer text-xs">$</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="relative w-24">
          <Input 
            id="discount"
            type="number" 
            value={globalDiscount.toString()}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                onDiscountChange(value);
              } else {
                onDiscountChange(0);
              }
            }}
            min="0"
            max={discountType === 'percentage' ? "100" : undefined}
            step="0.01"
            placeholder={discountType === 'percentage' ? "0-100" : "0.00"}
            className="h-8 text-xs pr-8"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            {discountType === 'percentage' ? '%' : '$'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDiscount;
