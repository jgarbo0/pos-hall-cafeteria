
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, Clock, Printer } from 'lucide-react';

interface ViewOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: Order | null;
  onPrint: () => void;
  formatTimestamp: (timestamp: string) => string;
  displayCustomerName: (name?: string) => string;
}

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({
  isOpen,
  onClose,
  currentOrder,
  onPrint,
  formatTimestamp,
  displayCustomerName
}) => {
  if (!currentOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order #</p>
                <p className="font-medium dark:text-white">{currentOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium dark:text-white">{displayCustomerName(currentOrder.customerName)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium dark:text-white">{formatTimestamp(currentOrder.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium dark:text-white">{currentOrder.orderType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Table</p>
                <p className="font-medium dark:text-white">{currentOrder.tableNumber ? `Table ${currentOrder.tableNumber}` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className={`flex items-center space-x-1 ${
                  currentOrder.status === 'completed' ? 'text-green-600 dark:text-green-500' : 'text-amber-500'
                }`}>
                  {currentOrder.status === 'completed' ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} />
                      <span>{currentOrder.status}</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                <p className={`font-medium ${
                  currentOrder.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-500' : 'text-orange-500'
                }`}>
                  {currentOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Items</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">Item</TableHead>
                      <TableHead className="dark:text-gray-300">Price</TableHead>
                      <TableHead className="dark:text-gray-300">Qty</TableHead>
                      <TableHead className="dark:text-gray-300 text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrder.items.length === 0 ? (
                      <TableRow className="dark:border-gray-700">
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No items
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentOrder.items.map((item, index) => (
                        <TableRow key={index} className="dark:border-gray-700">
                          <TableCell className="font-medium dark:text-white">{item.title}</TableCell>
                          <TableCell className="dark:text-gray-300">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="dark:text-gray-300">{item.quantity}</TableCell>
                          <TableCell className="dark:text-gray-300 text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="space-y-1 text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Subtotal: <span className="font-medium dark:text-white">${currentOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Tax: <span className="font-medium dark:text-white">${currentOrder.tax.toFixed(2)}</span>
              </div>
              <div className="text-base font-medium dark:text-white">
                Total: ${currentOrder.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;
