
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
import { Printer } from 'lucide-react';

interface PrintOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: Order | null;
  onPrintPreview: () => void;
}

const PrintOrderDialog: React.FC<PrintOrderDialogProps> = ({
  isOpen,
  onClose,
  currentOrder,
  onPrintPreview
}) => {
  if (!currentOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Print Order</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="dark:text-white">Ready to print order #{currentOrder.orderNumber}?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            The receipt will include all order details including any applied discounts.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onPrintPreview}>
            <Printer className="mr-2 h-4 w-4" />
            Print Preview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrintOrderDialog;
