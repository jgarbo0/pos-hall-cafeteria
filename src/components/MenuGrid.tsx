
import React, { useState } from 'react';
import { MenuItem } from '@/types';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddToCart }) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const getQuantity = (itemId: string) => {
    return quantities[itemId] || 1;
  };

  const increaseQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1
    }));
  };

  const decreaseQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 1)
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = getQuantity(item.id);
    onAddToCart(item, quantity);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="food-card overflow-hidden bg-white dark:bg-gray-800 border-none shadow-md rounded-3xl transition-all hover:shadow-lg"
        >
          <div className="food-card-image-container h-52 overflow-hidden">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.available} bowl's available</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-blue-500 font-bold">${item.price.toFixed(2)}</p>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 border-none"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-center w-8">{getQuantity(item.id)}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 rounded-full bg-blue-500 border-none text-white"
                  onClick={() => increaseQuantity(item.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="default"
              className="w-full mt-3 rounded-full bg-blue-500 hover:bg-blue-600"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenuGrid;
