
import React from 'react';
import { MenuItem } from '@/types';
import { toast } from "sonner";

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddToCart }) => {
  
  const handleItemClick = (item: MenuItem) => {
    onAddToCart(item, 1);
    toast.success(`Added ${item.title} to cart`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-6">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className="food-card card-hover cursor-pointer transform transition hover:scale-105"
          style={{ 
            animationDelay: `${index * 0.05}s`,
            opacity: 0,
            animation: `fadeIn 0.5s ease-out ${index * 0.05}s forwards`
          }}
          onClick={() => handleItemClick(item)}
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
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
