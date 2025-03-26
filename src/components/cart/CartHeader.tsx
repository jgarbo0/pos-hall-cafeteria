
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CartHeaderProps {
  orderNumber: string;
  activeTab: string;
  onClearCart: () => void;
  itemsCount: number;
}

const CartHeader: React.FC<CartHeaderProps> = ({ 
  orderNumber, 
  activeTab, 
  onClearCart,
  itemsCount
}) => {
  return (
    <div className="p-4 border-b dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold dark:text-white">Order #{orderNumber}</h2>
        {activeTab === "cart" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearCart}
            disabled={itemsCount === 0}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CartHeader;
