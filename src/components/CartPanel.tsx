
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem, Customer } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CartPanelProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
  orderNumber: string;
  tableNumber: number;
  customers?: Customer[];
  selectedCustomer?: string;
  onCustomerChange?: (customerId: string) => void;
  orderType?: 'Dine In' | 'Take Away';
  onOrderTypeChange?: (type: 'Dine In' | 'Take Away') => void;
}

const CartPanel: React.FC<CartPanelProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder,
  orderNumber,
  tableNumber,
  customers = [],
  selectedCustomer = 'Walk-in Customer',
  onCustomerChange = () => {},
  orderType = 'Dine In',
  onOrderTypeChange = () => {},
}) => {
  const { t } = useLanguage();
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold dark:text-white">Order #{orderNumber}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearCart}
            disabled={items.length === 0}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b dark:border-gray-700">
        <div className="space-y-4">
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

          {orderType === 'Dine In' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Table #:</span>
              <span className="font-medium dark:text-white">{tableNumber}</span>
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
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <ShoppingBag className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-center">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-start border-b dark:border-gray-700 pb-4">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 mr-4">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm dark:text-white">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus size={12} />
                    </Button>
                    <span className="mx-2 text-sm dark:text-white">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-auto"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <div className="ml-2 font-medium text-sm dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="dark:text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Tax (10%)</span>
            <span className="dark:text-white">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="dark:text-white">Total</span>
            <span className="dark:text-white">${total.toFixed(2)}</span>
          </div>
        </div>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={items.length === 0}
          onClick={onPlaceOrder}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default CartPanel;
