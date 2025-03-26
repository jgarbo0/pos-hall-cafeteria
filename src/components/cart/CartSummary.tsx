
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Clock, Printer, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  rawSubtotal: number;
  tax: number;
  taxRate: number;
  discountAmount: number;
  total: number;
  hasItems: boolean;
  isWalkInCustomer: boolean;
  onPayNow: () => void;
  onPayLater: () => void;
  onPrintReceipt: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  rawSubtotal, 
  tax,
  taxRate,
  discountAmount, 
  total, 
  hasItems,
  isWalkInCustomer,
  onPayNow,
  onPayLater,
  onPrintReceipt
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4 border-t dark:border-gray-700">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
          <span className="dark:text-white">${rawSubtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Tax ({taxRate}%)</span>
          <span className="dark:text-white">${tax.toFixed(2)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-500 flex items-center">
              <Percent size={14} className="mr-1" /> Discount
            </span>
            <span className="text-green-500">-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-semibold">
          <span className="dark:text-white">Total</span>
          <span className="dark:text-white">${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {isWalkInCustomer ? (
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!hasItems}
              onClick={onPayNow}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Pay Now
            </Button>
            <Button
              variant="outline"
              disabled={!hasItems}
              onClick={onPrintReceipt}
            >
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!hasItems}
              onClick={onPayNow}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Pay Now
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600"
              disabled={!hasItems}
              onClick={onPayLater}
            >
              <Clock className="mr-2 h-4 w-4" /> Pay Later
            </Button>
          </div>
        )}
        
        {hasItems && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onPrintReceipt}
          >
            <Printer className="mr-2 h-4 w-4" /> Print Receipt
          </Button>
        )}
      </div>
    </div>
  );
};

export default CartSummary;
