import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MinusCircle, PlusCircle, Trash2, Users, Printer, Clock } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState('immediate');
  
  const customers = [
    { id: 'walk-in', name: 'Walk-in Customer', registered: false },
    { id: 'ahmed', name: 'Ahmed Mohamed', registered: true },
    { id: 'fatima', name: 'Fatima Hussein', registered: true },
    { id: 'omar', name: 'Omar Jama', registered: true },
    { id: 'amina', name: 'Amina Abdi', registered: true },
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

  const isRegisteredCustomer = () => {
    const selectedCustomer = customers.find(c => c.id === customer);
    return selectedCustomer ? selectedCustomer.registered : false;
  };

  const handlePrintAndPay = () => {
    if (items.length === 0) {
      toast.error("Please add items to cart first");
      return;
    }
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${orderNumber}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; }
              .receipt { width: 300px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
              .address { font-size: 12px; color: #555; margin-bottom: 5px; }
              .contact { font-size: 12px; color: #555; margin-bottom: 15px; }
              .divider { border-top: 1px dashed #ccc; margin: 10px 0; }
              .order-info { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px; }
              .items { margin: 15px 0; }
              .item-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; padding-bottom: 5px; border-bottom: 1px solid #eee; }
              .item { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
              .item-name { flex: 1; }
              .item-qty { width: 30px; text-align: center; }
              .item-price { width: 70px; text-align: right; }
              .total-section { margin-top: 10px; }
              .total-row { display: flex; justify-content: space-between; font-size: 14px; }
              .grand-total { font-weight: bold; font-size: 16px; margin-top: 5px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
              .payment-method { text-align: center; margin-top: 10px; padding: 5px; background: #f9f9f9; border-radius: 5px; font-size: 13px; }
              .qr-placeholder { width: 100px; height: 100px; margin: 10px auto; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777; }
              .barcode-placeholder { height: 40px; margin: 10px auto; background: #eee; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${generateReceiptContent()}
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
    const isPaidLater = paymentMethod === 'later';
    
    let content = `
      <div class="header">
        <div class="logo">Doob Venue</div>
        <div class="address">Hargeisa Somaliland, Masalla</div>
        <div class="contact">Tel: (555) 123-4567 | info@doobvenue.com</div>
        <div class="divider"></div>
      </div>

      <div class="order-info">
        <span>Receipt #</span>
        <span>${orderNumber}</span>
      </div>
      <div class="order-info">
        <span>Date</span>
        <span>${date}</span>
      </div>
      <div class="order-info">
        <span>Customer</span>
        <span>${customerName}</span>
      </div>
      <div class="order-info">
        <span>Order Type</span>
        <span>${orderType}</span>
      </div>
      ${orderType === 'Dine In' ? `
      <div class="order-info">
        <span>Table #</span>
        <span>${tableNumber}</span>
      </div>` : ''}
      <div class="divider"></div>
      
      <div class="items">
        <div class="item-header">
          <div class="item-name">Item</div>
          <div class="item-qty">Qty</div>
          <div class="item-price">Amount</div>
        </div>
    `;
    
    items.forEach(item => {
      content += `
        <div class="item">
          <div class="item-name">${item.title}</div>
          <div class="item-qty">${item.quantity}</div>
          <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `;
    });
    
    content += `
      </div>
      <div class="divider"></div>
      
      <div class="total-section">
        <div class="total-row">
          <span>Subtotal</span>
          <span>$${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax (10%)</span>
          <span>$${calculateTax().toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total</span>
          <span>$${calculateTotal().toFixed(2)}</span>
        </div>
      </div>
      
      <div class="payment-method">
        ${isPaidLater ? 'PAYMENT PENDING - To be paid later' : 'PAID IN FULL - Thank you!'}
      </div>
    `;
    
    if (notes) {
      content += `
        <div class="divider"></div>
        <div style="font-size: 14px;">
          <strong>Notes:</strong>
          <p style="margin-top: 5px;">${notes}</p>
        </div>
      `;
    }
    
    content += `
      <div class="divider"></div>
      <div class="barcode-placeholder">Order #${orderNumber}</div>
      <div class="footer">
        <p>Thank you for your order!</p>
        <p>www.doobvenue.com</p>
      </div>
    `;
    
    return content;
  };

  return (
    <div className="w-[380px] bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold dark:text-white">Current Order</h2>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-md">
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
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Table No.</div>
            <div className="font-medium text-lg dark:text-white">{tableNumber}</div>
          </div>
        )}
        
        <div className="mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
            <Users size={16} />
            Customer
          </div>
          <Select
            value={customer}
            onValueChange={setCustomer}
          >
            <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {customers.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} {c.registered && <span className="ml-1 text-xs text-blue-500">(Registered)</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isRegisteredCustomer() && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Payment Method</div>
            <div className="flex gap-2">
              <Button 
                variant={paymentMethod === 'immediate' ? 'default' : 'outline'} 
                className="flex-1 text-sm"
                onClick={() => setPaymentMethod('immediate')}
              >
                Pay Now
              </Button>
              
              <Button 
                variant={paymentMethod === 'later' ? 'default' : 'outline'} 
                className="flex-1 text-sm flex items-center gap-1"
                onClick={() => setPaymentMethod('later')}
              >
                <Clock size={14} />
                Pay Later
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <div className="text-5xl mb-2">🛒</div>
            <p>Your cart is empty</p>
            <p className="text-sm">Add some items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-start">
                <div className="flex-1">
                  <div className="font-medium dark:text-white">{item.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">${item.price.toFixed(2)}</div>
                  
                  <div className="flex items-center mt-2">
                    <button 
                      className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
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
                    
                    <span className="mx-2 w-8 text-center font-medium dark:text-white">{item.quantity}</span>
                    
                    <button 
                      className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold dark:text-white">${(item.price * item.quantity).toFixed(2)}</div>
                  <button 
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors mt-4"
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
      
      <div className="p-4 border-t dark:border-gray-700">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="dark:text-white">${calculateSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Tax (10%)</span>
            <span className="dark:text-white">${calculateTax().toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700">
            <span className="dark:text-white">Total</span>
            <span className="dark:text-white">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <Textarea
            placeholder="Order notes..."
            className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
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
            {paymentMethod === 'later' && isRegisteredCustomer() ? 'Print Order' : 'Pay & Print'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;
