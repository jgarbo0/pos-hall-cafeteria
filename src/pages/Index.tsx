
import React, { useState, useEffect } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import MenuCategories from '@/components/MenuCategories';
import MenuGrid from '@/components/MenuGrid';
import CartPanel from '@/components/CartPanel';
import { MenuItem, CartItem, Category } from '@/types';
import { generateOrderNumber, generateTableNumber } from '@/data/mockData';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderNumber, setOrderNumber] = useState(generateOrderNumber());
  const [tableNumber, setTableNumber] = useState(generateTableNumber());
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Set document title
    document.title = "Doob Café - Menu";
    
    // Fetch menu items and categories
    fetchMenuItems();
    fetchCategories();
  }, []);
  
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          id,
          title,
          price,
          available,
          popular,
          description,
          image,
          categories(id, name)
        `)
        .order('title');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedItems: MenuItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          available: item.available,
          image: item.image || 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80',
          category: item.categories?.id || '',
          popular: item.popular || false,
          description: item.description
        }));
        setMenuItems(formattedItems);
        setFilteredItems(formattedItems);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Add 'all' category
        const allCategories: Category[] = [
          { id: 'all', name: 'All Items' },
          ...data.map(category => ({
            id: category.id,
            name: category.name
          }))
        ];
        setCategories(allCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };
  
  useEffect(() => {
    if (menuItems.length > 0) {
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
          (item.description && item.description.toLowerCase().includes(term))
        );
      }
      
      setFilteredItems(result);
    }
  }, [activeCategory, searchTerm, menuItems]);
  
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
  
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    try {
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      
      // Insert order to database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          order_type: 'Dine In', // This should be dynamic based on user selection
          table_number: tableNumber, // This should be conditional based on order type
          subtotal: subtotal,
          tax: tax,
          total: total,
          status: 'processing',
          customer_name: 'Walk-in Customer' // This should be dynamic based on selected customer
        })
        .select('id')
        .single();
      
      if (orderError) throw orderError;
      
      // Insert order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || null,
        spicy_level: item.spicyLevel || null
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      toast.success("Order placed successfully!");
      setCartItems([]);
      setOrderNumber(generateOrderNumber());
      setTableNumber(generateTableNumber());
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
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
        
        <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {activeCategory === 'all' ? 'All Menu Items' : `${categories.find(c => c.id === activeCategory)?.name || ''} Menu`}
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <MenuGrid 
                items={filteredItems}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-gray-500 dark:text-gray-400">No menu items found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Try changing your filters or search term</p>
              </div>
            )}
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
