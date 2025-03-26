
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Transaction } from '@/types/finance';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction
}) => {
  const [newTransaction, setNewTransaction] = React.useState({
    description: '',
    amount: '',
    type: 'income' as 'income' | 'expense',
    category: '',
    date: new Date(),
    paymentMethod: 'Cash'
  });

  const handleAddTransaction = () => {
    if (!newTransaction.description) {
      toast.error('Please enter a description');
      return;
    }

    if (!newTransaction.amount || isNaN(Number(newTransaction.amount)) || Number(newTransaction.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!newTransaction.category) {
      toast.error('Please select a category');
      return;
    }

    onAddTransaction({
      description: newTransaction.description,
      amount: Number(newTransaction.amount),
      type: newTransaction.type,
      category: newTransaction.category,
      date: format(newTransaction.date, 'yyyy-MM-dd'),
      paymentMethod: newTransaction.paymentMethod
    });

    // Reset form
    setNewTransaction({
      description: '',
      amount: '',
      type: 'income',
      category: '',
      date: new Date(),
      paymentMethod: 'Cash'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="transaction-type" className="dark:text-gray-300">Transaction Type</Label>
            <Select
              value={newTransaction.type}
              onValueChange={(value: 'income' | 'expense') => 
                setNewTransaction({...newTransaction, type: value})
              }
            >
              <SelectTrigger id="transaction-type" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
            <Input 
              id="description" 
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount" className="dark:text-gray-300">Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.01" 
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category" className="dark:text-gray-300">Category</Label>
            <Select 
              value={newTransaction.category}
              onValueChange={(value) => 
                setNewTransaction({...newTransaction, category: value})
              }
            >
              <SelectTrigger id="category" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {newTransaction.type === 'expense' ? (
                  <>
                    <SelectItem value="Grocery">Grocery</SelectItem>
                    <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Dhaweeye">Dhaweeye</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Venue Booking">Venue Booking</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod" className="dark:text-gray-300">Payment Method</Label>
            <Select 
              value={newTransaction.paymentMethod}
              onValueChange={(value) => 
                setNewTransaction({...newTransaction, paymentMethod: value})
              }
            >
              <SelectTrigger id="paymentMethod" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date" className="dark:text-gray-300">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex justify-start dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newTransaction.date ? format(newTransaction.date, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                <Calendar
                  mode="single"
                  selected={newTransaction.date}
                  onSelect={(date) => date && setNewTransaction({...newTransaction, date})}
                  initialFocus
                  className="dark:bg-gray-800"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddTransaction}>
            Save Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
