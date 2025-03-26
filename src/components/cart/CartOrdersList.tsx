
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types';
import { formatDate, displayOrderCustomerName } from '@/utils/cartUtils';

interface CartOrdersListProps {
  orders: Order[];
}

const CartOrdersList: React.FC<CartOrdersListProps> = ({ orders }) => {
  const navigate = useNavigate();
  
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-center">No recent orders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-sm dark:text-white">Order #{order.orderNumber}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.timestamp)}</p>
                  </div>
                  <Badge className={order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-amber-500'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{displayOrderCustomerName(order.customerName)}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                  <span>Type:</span>
                  <span>{order.orderType}</span>
                </div>
                {order.orderType === 'Dine In' && order.tableNumber && (
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                    <span>Table:</span>
                    <span>#{order.tableNumber}</span>
                  </div>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
                <div className="mt-2 pt-2 border-t dark:border-gray-600 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders?id=${order.id}`)}
                    className="text-xs"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default CartOrdersList;
