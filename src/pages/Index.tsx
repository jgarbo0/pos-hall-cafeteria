
import React, { useState, useEffect } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import MenuCategories from '@/components/MenuCategories';
import MenuGrid from '@/components/MenuGrid';
import CartPanel from '@/components/CartPanel';
import { MenuItem, CartItem } from '@/types';
import { menuItems, categories, generateOrderNumber, generateTableNumber } from '@/data/mockData';
import { toast } from 'sonner';

const Index = () => {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber());
  const [tableNumber, setTableNumber] = useState(generateTableNumber());
  
  useEffect(() => {
    let result = [...menuItems];
    
    // Apply category filter
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredItems(result);
  }, [activeCategory, searchTerm]);
  
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCartItems(prev => {
      // Check if item already exists in cart
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newCartItems = [...prev];
        newCartItems[existingItemIndex].quantity += quantity;
        return newCartItems;
      } else {
        // Add new item to cart
        return [...prev, { ...item, quantity }];
      }
    });
    
    toast.success(`Added ${quantity} ${item.title} to cart`);
  };
  
  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const handleClearCart = () => {
    setCartItems([]);
  };
  
  const handlePlaceOrder = () => {
    setCartItems([]);
    setOrderNumber(generateOrderNumber());
    setTableNumber(generateTableNumber());
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} />
        
        <MenuCategories 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <div className="flex-1 overflow-y-auto">
          <MenuGrid 
            items={filteredItems}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
      
      <CartPanel 
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        orderNumber={orderNumber}
        tableNumber={tableNumber}
      />
    </div>
  );
};

export default Index;
