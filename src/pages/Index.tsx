import React, { useState, useEffect } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import MenuCategories from '@/components/MenuCategories';
import MenuGrid from '@/components/MenuGrid';
import CartPanel from '@/components/CartPanel';
import { MenuItem, CartItem, Category, Customer } from '@/types';
import { generateOrderNumber, generateTableNumber } from '@/data/mockData';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { getMenuItems, getCategories, createOrder, getCustomers } from '@/services/SupabaseService';

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('Walk-in Customer');
  const [orderType, setOrderType] = useState<'Dine In' | 'Take Away'>('Dine In');
  const { t } = useLanguage();
  
  useEffect(() => {
    document.title = "Doob Café - Menu";
    
    fetchMenuItems();
    fetchCategories();
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };
  
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const data = await getMenuItems();
      
      if (data) {
        setMenuItems(data);
        setFilteredItems(data);
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
      const data = await getCategories();
      
      if (data) {
        const allCategories: Category[] = [
          { id: 'all', name: 'All Items' },
          ...data
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
      
      if (activeCategory !== 'all') {
        result = result.filter(item => item.category === activeCategory);
      }
      
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
      const existingItemIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        const newCartItems = [...prev];
        newCartItems[existingItemIndex].quantity += quantity;
        return newCartItems;
      } else {
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
  
  const handleOrderTypeChange = (type: 'Dine In' | 'Take Away') => {
    setOrderType(type);
  };
  
  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId);
  };
  
  const handleTableChange = (newTableNumber: number) => {
    setTableNumber(newTableNumber);
  };
  
  const handlePlaceOrder = async (
    paymentStatus: 'paid' | 'pending', 
    discountType: 'percentage' | 'fixed' = 'percentage',
    discountAmount?: number
  ) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    try {
      let customerName = 'Walk-in Customer';
      if (selectedCustomer !== 'Walk-in Customer') {
        const selectedCustomerObj = customers.find(c => c.id === selectedCustomer);
        if (selectedCustomerObj) {
          customerName = selectedCustomerObj.name;
        }
      }
      
      const orderId = await createOrder(
        orderNumber, 
        orderType, 
        orderType === 'Dine In' ? tableNumber : null, 
        cartItems, 
        customerName,
        paymentStatus,
        discountType,
        discountAmount
      );
      
      const paymentMessage = paymentStatus === 'paid' 
        ? "Order completed and payment received!" 
        : "Order completed with pending payment.";
      
      toast.success(paymentMessage, {
        action: {
          label: "View Orders",
          onClick: () => {
            window.location.href = '/orders';
          }
        },
      });
      
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
        onTableChange={handleTableChange}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onCustomerChange={handleCustomerChange}
        orderType={orderType}
        onOrderTypeChange={handleOrderTypeChange}
      />
    </div>
  );
};

export default Index;
