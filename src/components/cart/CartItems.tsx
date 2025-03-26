
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Percent, Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  itemDiscounts: Record<string, number>;
  onApplyItemDiscount: (itemId: string, discount: number) => void;
  onClearItemDiscount: (itemId: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity,
  itemDiscounts,
  onApplyItemDiscount,
  onClearItemDiscount
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <ShoppingBag className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-center">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => {
              const itemDiscount = itemDiscounts[item.id] || 0;
              return (
                <div key={item.id} className="flex flex-col border-b dark:border-gray-700 pb-4">
                  <div className="flex items-start">
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

                  <div className="mt-2 flex gap-2 items-center">
                    <div className="flex-1 relative">
                      <Input 
                        type="number" 
                        placeholder="Item discount %" 
                        value={itemDiscount > 0 ? itemDiscount.toString() : ''} 
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= 100) {
                            onApplyItemDiscount(item.id, value);
                          } else if (e.target.value === '') {
                            onClearItemDiscount(item.id);
                          }
                        }}
                        min="0"
                        max="100"
                        className="h-8 text-xs pr-7"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Percent size={14} className="text-gray-400" />
                      </div>
                    </div>
                    {itemDiscount > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => onClearItemDiscount(item.id)}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default CartItems;
