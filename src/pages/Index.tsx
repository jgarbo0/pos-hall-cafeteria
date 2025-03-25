
import React, { useState, useEffect } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import MenuCategories from '@/components/MenuCategories';
import MenuGrid from '@/components/MenuGrid';
import CartPanel from '@/components/CartPanel';
import { MenuItem, CartItem } from '@/types';
import { menuItems, categories, generateOrderNumber, generateTableNumber } from '@/data/mockData';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, Utensils, Award } from 'lucide-react';

const Index = () => {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber());
  const [tableNumber, setTableNumber] = useState(generateTableNumber());
  const { t } = useLanguage();
  
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
        
        {/* New Hero Section */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900 py-6 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
              Welcome to Doob Café
            </h1>
            <p className="text-blue-100 mb-4 max-w-lg animate-fade-in">
              Founded in 2025, Hargeisa, Somaliland - A modern café experience with delicious food and a welcoming atmosphere.
            </p>
            <div className="flex flex-wrap gap-4 text-white my-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Open Daily</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>7:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center">
                <Utensils className="h-5 w-5 mr-2" />
                <span>International Cuisine</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </div>
        
        <MenuCategories 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{activeCategory === 'all' ? 'All Menu Items' : `${categories.find(c => c.id === activeCategory)?.name || ''} Menu`}</h2>
            <MenuGrid 
              items={filteredItems}
              onAddToCart={handleAddToCart}
            />
          </div>
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
