
import React, { useState, useEffect } from 'react';
import { MenuItem } from '@/types';
import { Minus, Plus, Check, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, onAddToCart }) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(items);

  useEffect(() => {
    setMenuItems(items);
  }, [items]);

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

  const handleCardClick = (item: MenuItem) => {
    // If item is already selected, unselect it and don't add to cart
    if (selectedItem === item.id) {
      setSelectedItem(null);
      return;
    }
    
    // Set as selected item
    setSelectedItem(item.id);
    
    // Add to cart with current quantity
    const quantity = getQuantity(item.id);
    onAddToCart(item, quantity);
  };
  
  if (menuItems.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No menu items found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Try changing your search or selecting a different category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <Card 
          key={item.id} 
          className={cn(
            "food-card overflow-hidden bg-white dark:bg-gray-800 border-none shadow-md rounded-xl transition-all hover:shadow-lg",
            selectedItem === item.id && "ring-2 ring-blue-500"
          )}
        >
          <div className="food-card-image-container h-48 overflow-hidden relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
            {selectedItem === item.id && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <Check className="h-4 w-4" />
              </div>
            )}
            {item.popular && (
              <Badge className="absolute top-2 left-2 bg-red-500 border-none">Popular</Badge>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
              <span className="text-blue-500 dark:text-blue-400 font-bold">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
              {item.description || `Delicious ${item.title} prepared with fresh ingredients.`}
            </p>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    decreaseQuantity(item.id);
                  }}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-center w-8 dark:text-white">{getQuantity(item.id)}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    increaseQuantity(item.id);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="default" 
                className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => handleCardClick(item)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenuGrid;
