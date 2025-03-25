
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Settings, 
  ShoppingCart,
  Calendar,
  Package,
  Wallet,
  Users,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SidebarNavigation = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
    { icon: LayoutGrid, path: '/', label: 'Menu' },
    { icon: ShoppingCart, path: '/orders', label: 'Orders' },
    { icon: Package, path: '/products', label: 'Products' },
    { icon: Users, path: '/customers', label: 'Customers' },
    { icon: Calendar, path: '/hall', label: 'Hall Booking' },
    { icon: Wallet, path: '/finance', label: 'Finance' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 h-screen border-r dark:border-gray-800 flex flex-col items-center pt-4 animate-fadeIn transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="p-3 mb-6 flex justify-between w-full">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        {!isCollapsed && (
          <span className="text-xl font-semibold ml-2 text-gray-800 dark:text-gray-200">Doob Venue</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      <div className="flex flex-col space-y-6 items-center w-full">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center justify-start rounded-xl transition-all duration-200 relative group w-full px-4",
              isCollapsed ? "justify-center" : "justify-start",
              isActive(item.path) 
                ? "bg-primary text-white" 
                : "text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={cn(
              "w-10 h-10 flex items-center justify-center",
              isCollapsed ? "w-10" : "w-auto"
            )}>
              <item.icon size={20} />
            </div>
            {!isCollapsed && (
              <span className="ml-2 text-sm font-medium">{item.label}</span>
            )}
            <span className="absolute left-full ml-2 px-2 py-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
              {item.label}
            </span>
            {isActive(item.path) && (
              <span className="absolute left-0 w-1 h-5 bg-primary rounded-r-full -translate-x-full"></span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarNavigation;
