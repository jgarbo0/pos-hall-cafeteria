
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order, OrderType } from '@/types';

interface OrderFormData {
  tableNumber: number | null;
  orderType: OrderType;
  items: number; 
  total: number;
  status: "processing" | "completed" | "cancelled";
  customerName: string;
}

interface EditOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: Order | null;
  formData: OrderFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onUpdate: () => void;
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  isOpen,
  onClose,
  currentOrder,
  formData,
  onInputChange,
  onSelectChange,
  onUpdate
}) => {
  if (!currentOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <label htmlFor="customerName" className="text-sm dark:text-white">Customer Name</label>
              <Input
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={onInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="orderType" className="text-sm dark:text-white">Order Type</label>
              <Select 
                value={formData.orderType} 
                onValueChange={(value) => onSelectChange('orderType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dine In">Dine In</SelectItem>
                  <SelectItem value="Take Away">Take Away</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="tableNumber" className="text-sm dark:text-white">Table Number</label>
              <Input
                id="tableNumber"
                name="tableNumber"
                type="number"
                value={formData.tableNumber === null ? '' : formData.tableNumber}
                onChange={onInputChange}
                disabled={formData.orderType === "Take Away"}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="items" className="text-sm dark:text-white">Items</label>
              <Input
                id="items"
                name="items"
                type="number"
                value={formData.items}
                onChange={onInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="total" className="text-sm dark:text-white">Total</label>
              <Input
                id="total"
                name="total"
                type="number"
                value={formData.total}
                onChange={onInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm dark:text-white">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => onSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onUpdate}>Update Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
