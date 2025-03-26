
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit, 
  Trash, 
  Printer,
  DollarSign, 
} from 'lucide-react';

interface OrdersTableProps {
  isLoading: boolean;
  filteredOrders: Order[];
  searchTerm: string;
  onViewOrder: (order: Order) => void;
  onPrintOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  onPayOrder: (order: Order) => void;
  formatTimestamp: (timestamp: string) => string;
  displayCustomerName: (name?: string) => string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  isLoading,
  filteredOrders,
  searchTerm,
  onViewOrder,
  onPrintOrder,
  onEditOrder,
  onDeleteOrder,
  onPayOrder,
  formatTimestamp,
  displayCustomerName
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">Order ID</TableHead>
              <TableHead className="dark:text-gray-300">Customer</TableHead>
              <TableHead className="dark:text-gray-300">Type</TableHead>
              <TableHead className="dark:text-gray-300">Table</TableHead>
              <TableHead className="dark:text-gray-300">Items</TableHead>
              <TableHead className="dark:text-gray-300">Total</TableHead>
              <TableHead className="dark:text-gray-300">Date</TableHead>
              <TableHead className="dark:text-gray-300">Status</TableHead>
              <TableHead className="dark:text-gray-300">Payment</TableHead>
              <TableHead className="dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow className="dark:border-gray-700">
                <TableCell colSpan={10} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No matching orders found' : 'No orders found'}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="dark:border-gray-700">
                  <TableCell className="font-medium dark:text-white">{order.orderNumber}</TableCell>
                  <TableCell className="dark:text-gray-300">{displayCustomerName(order.customerName)}</TableCell>
                  <TableCell className="dark:text-gray-300">{order.orderType}</TableCell>
                  <TableCell className="dark:text-gray-300">
                    {order.tableNumber ? `Table ${order.tableNumber}` : 'N/A'}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{order.items.length}</TableCell>
                  <TableCell className="dark:text-gray-300">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="dark:text-gray-300">{formatTimestamp(order.timestamp)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center space-x-1 ${
                      order.status === 'completed' ? 'text-green-600 dark:text-green-500' : 
                      order.status === 'cancelled' ? 'text-red-600 dark:text-red-500' :
                      'text-amber-500'
                    }`}>
                      {order.status === 'completed' ? (
                        <>
                          <CheckCircle size={16} />
                          <span>Completed</span>
                        </>
                      ) : order.status === 'cancelled' ? (
                        <>
                          <Trash size={16} />
                          <span>Cancelled</span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} />
                          <span>{order.status}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`${
                      order.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-500' : 'text-orange-500'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onPrintOrder(order)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => onEditOrder(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500" onClick={() => onDeleteOrder(order)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                      {order.paymentStatus === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600"
                          onClick={() => onPayOrder(order)}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrdersTable;
