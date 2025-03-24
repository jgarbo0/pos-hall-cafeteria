
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Receipt } from 'lucide-react';
import { CartItem, OrderType } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CartPanelProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
  orderNumber: string;
  tableNumber: number;
}

const CartPanel: React.FC<CartPanelProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder,
  orderNumber,
  tableNumber,
}) => {
  const [orderType, setOrderType] = useState<OrderType>('Dine In');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's a selected table in localStorage
    const storedTable = localStorage.getItem('selectedTable');
    if (storedTable) {
      setSelectedTable(parseInt(storedTable));
    }
  }, []);
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;
  
  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (orderType === 'Dine In' && !selectedTable) {
      toast.error('Please select a table first');
      navigate('/hall');
      return;
    }
    
    if (orderType === 'Take Away') {
      // Process the take away order directly
      processOrder();
    } else {
      // Process the dine in order with the selected table
      processOrder();
    }
  };
  
  const processOrder = () => {
    const orderDetails = {
      items,
      orderType,
      tableNumber: selectedTable || tableNumber,
      orderNumber,
      subtotal,
      tax,
      total,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, you would send this to a backend
    console.log('Order placed:', orderDetails);
    
    // Show success message
    if (orderType === 'Dine In') {
      toast.success(`Order placed for Table ${selectedTable || tableNumber}`);
    } else {
      toast.success('Take Away order placed successfully!');
    }
    
    // Clear cart and reset selected table
    onPlaceOrder();
    localStorage.removeItem('selectedTable');
    setSelectedTable(null);
  };

  const handleSelectTable = () => {
    navigate('/hall');
  };

  return (
    <div className="w-[380px] bg-white border-l h-full flex flex-col">
      <div className="p-6 border-b animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Current Orders</h2>
            <p className="text-2xl font-bold mt-1">#{orderNumber}</p>
          </div>
          <div>
            <h3 className="text-right text-gray-500">No.Table</h3>
            <p className="text-2xl font-bold">{selectedTable || tableNumber}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-b animate-fadeIn">
        <div className="flex space-x-3">
          <button 
            className={`flex-1 py-2 px-4 rounded-full text-center transition-all ${orderType === 'Dine In' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
            onClick={() => setOrderType('Dine In')}
          >
            Dine In
          </button>
          <button 
            className={`flex-1 py-2 px-4 rounded-full text-center transition-all ${orderType === 'Take Away' ? 'bg-white shadow-sm font-medium' : 'text-gray-500'}`}
            onClick={() => setOrderType('Take Away')}
          >
            Take Away
          </button>
        </div>
        
        {orderType === 'Dine In' && (
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleSelectTable}
            >
              {selectedTable ? `Table ${selectedTable} Selected` : 'Select a Table'}
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-fadeIn">
            <ShoppingCartIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="flex bg-white p-3 rounded-lg shadow-sm animate-slideInRight"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="h-16 w-16 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="text-primary font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <div>x{item.quantity}</div>
                    {item.spicyLevel && (
                      <div className="ml-2">· Spicy Lv.{item.spicyLevel}</div>
                    )}
                  </div>
                  <div className="flex mt-1 justify-between">
                    <div className="text-xs text-gray-500">
                      {item.notes && item.notes.trim() ? item.notes : "-"}
                    </div>
                    <div className="flex space-x-1">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Pencil size={14} />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t p-6 animate-fadeIn">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Sub Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total Payment</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full py-6 rounded-lg text-white bg-primary hover:bg-primary/90 font-medium"
            onClick={handlePlaceOrder}
          >
            {orderType === 'Take Away' ? 'Process Payment' : 'Place Order'}
          </Button>
          
          {items.length > 0 && (
            <Button 
              variant="outline"
              className="w-full py-6 rounded-lg font-medium"
              onClick={onClearCart}
            >
              Clear Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" 
    />
  </svg>
);

export default CartPanel;
