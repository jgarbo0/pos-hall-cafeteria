
import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddToCart }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  const handleIncrement = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };
  
  const handleDecrement = (itemId: string) => {
    if (!quantities[itemId] || quantities[itemId] <= 0) return;
    
    setQuantities(prev => ({
      ...prev,
      [itemId]: prev[itemId] - 1
    }));
  };
  
  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      onAddToCart(item, quantity);
      setQuantities(prev => ({
        ...prev,
        [item.id]: 0
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-6">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className="food-card card-hover"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            opacity: 0,
            animation: `fadeIn 0.5s ease-out ${index * 0.05}s forwards`
          }}
        >
          <div className="food-card-image-container">
            <img 
              src={item.image} 
              alt={item.title} 
              className="food-card-image"
              loading="lazy"
            />
          </div>
          <h3 className="food-card-title">{item.title}</h3>
          <p className="food-card-availability">{item.available} bowl's available</p>
          <p className="food-card-price">${item.price.toFixed(2)}</p>
          
          <div className="food-card-controls">
            <div className="flex items-center space-x-2">
              <button 
                className="quantity-btn decrement"
                onClick={() => handleDecrement(item.id)}
                disabled={!quantities[item.id] || quantities[item.id] <= 0}
              >
                <MinusCircle size={18} />
              </button>
              
              <span className="font-medium">{quantities[item.id] || 0}</span>
              
              <button 
                className="quantity-btn increment"
                onClick={() => handleIncrement(item.id)}
              >
                <PlusCircle size={18} />
              </button>
            </div>
            
            {quantities[item.id] > 0 && (
              <button 
                className="text-xs font-medium text-primary hover:text-primary/80"
                onClick={() => handleAddToCart(item)}
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
