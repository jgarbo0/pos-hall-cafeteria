
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MinusCircle, PlusCircle, Trash2, Users, Printer } from 'lucide-react';
import { CartItem, OrderType } from '@/types';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CartPanelProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
  orderNumber: string;
  tableNumber: number;
}

const CartPanel = ({ 
  items, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearCart, 
  onPlaceOrder,
  orderNumber,
  tableNumber
}: CartPanelProps) => {
  const [orderType, setOrderType] = useState<OrderType>('Dine In');
  const [notes, setNotes] = useState('');
  const [customer, setCustomer] = useState('walk-in');
  
  const customers = [
    { id: 'walk-in', name: 'Walk-in Customer' },
    { id: 'ahmed', name: 'Ahmed Mohamed' },
    { id: 'fatima', name: 'Fatima Hussein' },
    { id: 'omar', name: 'Omar Jama' },
    { id: 'amina', name: 'Amina Abdi' },
  ];

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePrintAndPay = () => {
    if (items.length === 0) {
      toast.error("Please add items to cart first");
      return;
    }
    
    // Generate receipt content
    const receiptContent = generateReceiptContent();
    
    // Create a print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${orderNumber}</title>
            <style>
              body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
              .receipt { width: 300px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .items { margin-bottom: 20px; }
              .item { margin-bottom: 5px; }
              .total { border-top: 1px dashed #000; padding-top: 10px; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${receiptContent}
            </div>
            <script>
              window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    
    toast.success(`Order #${orderNumber} placed successfully!`);
    onPlaceOrder();
    setNotes('');
  };

  const generateReceiptContent = () => {
    const date = new Date().toLocaleString();
    const customerName = customers.find(c => c.id === customer)?.name || 'Walk-in Customer';
    
    let content = `
      <div class="header">
        <h2>Somali Restaurant</h2>
        <p>Order #${orderNumber}</p>
        <p>${date}</p>
        <p>Customer: ${customerName}</p>
        <p>Order Type: ${orderType}</p>
        ${orderType === 'Dine In' ? `<p>Table #${tableNumber}</p>` : ''}
      </div>
      <div class="items">
        <h3>Items</h3>
    `;
    
    items.forEach(item => {
      content += `
        <div class="item">
          <p>${item.quantity} x ${item.title} - $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `;
    });
    
    content += `
      </div>
      <div class="total">
        <p>Subtotal: $${calculateSubtotal().toFixed(2)}</p>
        <p>Tax (10%): $${calculateTax().toFixed(2)}</p>
        <p><strong>Total: $${calculateTotal().toFixed(2)}</strong></p>
      </div>
    `;
    
    if (notes) {
      content += `
        <div class="notes">
          <h3>Notes</h3>
          <p>${notes}</p>
        </div>
      `;
    }
    
    content += `
      <div class="footer">
        <p>Thank you for your order!</p>
      </div>
    `;
    
    return content;
  };

  return (
    <div className="w-[380px] bg-white border-l flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Current Order</h2>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
            #{orderNumber}
          </span>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant={orderType === 'Dine In' ? 'default' : 'outline'} 
            className="flex-1"
            onClick={() => setOrderType('Dine In')}
          >
            Dine In
          </Button>
          
          <Button 
            variant={orderType === 'Take Away' ? 'default' : 'outline'} 
            className="flex-1"
            onClick={() => setOrderType('Take Away')}
          >
            Take Away
          </Button>
        </div>
        
        {orderType === 'Dine In' && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-1">Table No.</div>
            <div className="font-medium text-lg">{tableNumber}</div>
          </div>
        )}
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
            <Users size={16} />
            Customer
          </div>
          <Select
            value={customer}
            onValueChange={setCustomer}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-5xl mb-2">🛒</div>
            <p>Your cart is empty</p>
            <p className="text-sm">Add some items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 flex items-start">
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500 mb-2">${item.price.toFixed(2)}</div>
                  
                  <div className="flex items-center mt-2">
                    <button 
                      className="text-gray-500 hover:text-primary transition-colors"
                      onClick={() => {
                        if (item.quantity > 1) {
                          onUpdateQuantity(item.id, item.quantity - 1);
                        } else {
                          onRemoveItem(item.id);
                        }
                      }}
                    >
                      <MinusCircle size={20} />
                    </button>
                    
                    <span className="mx-2 w-8 text-center font-medium">{item.quantity}</span>
                    
                    <button 
                      className="text-gray-500 hover:text-primary transition-colors"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  <button 
                    className="text-red-500 hover:text-red-700 p-1 transition-colors mt-4"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (10%)</span>
            <span>${calculateTax().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <Textarea
            placeholder="Order notes..."
            className="text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClearCart}
          >
            Clear All
          </Button>
          
          <Button 
            variant="default" 
            className="w-full flex items-center gap-2"
            onClick={handlePrintAndPay}
          >
            <Printer size={16} />
            Pay & Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
