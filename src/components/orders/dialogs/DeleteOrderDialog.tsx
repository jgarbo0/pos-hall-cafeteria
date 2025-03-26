
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
import { AlertTriangle } from 'lucide-react';

interface DeleteOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: Order | null;
  onConfirmDelete: () => void;
}

const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = ({
  isOpen,
  onClose,
  currentOrder,
  onConfirmDelete
}) => {
  if (!currentOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Delete Order
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="dark:text-white">Are you sure you want to delete order #{currentOrder.orderNumber}?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirmDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOrderDialog;
