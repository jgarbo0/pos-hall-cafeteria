
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Clock, 
  Settings, 
  ShoppingCart,
  Calendar,
  Package,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: LayoutGrid, path: '/', label: 'Menu' },
    { icon: ShoppingCart, path: '/orders', label: 'Orders' },
    { icon: Package, path: '/products', label: 'Products' },
    { icon: Calendar, path: '/hall', label: 'Hall Booking' },
    { icon: Wallet, path: '/finance', label: 'Finance' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="w-[70px] bg-white h-screen border-r flex flex-col items-center pt-4 animate-fadeIn">
      <div className="p-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-6 items-center">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 relative group",
              isActive(item.path) 
                ? "bg-primary text-white" 
                : "text-gray-500 hover:text-primary hover:bg-blue-50"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <item.icon size={20} />
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
