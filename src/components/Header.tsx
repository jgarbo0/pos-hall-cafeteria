
import React, { useState } from 'react';
import { Search, Filter, Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const Header = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received", time: "2 min ago", read: false },
    { id: 2, text: "Payment completed", time: "10 min ago", read: false },
    { id: 3, text: "New customer registered", time: "1 hour ago", read: true }
  ]);
  const { toast } = useToast();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <header className="w-full px-6 py-4 bg-white border-b animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Search menu here..."
              className="pl-10 h-10 w-full rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" size="sm" className="ml-2 gap-2 rounded-full h-10 px-4">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
        
        <div className="flex items-center ml-4 space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b last:border-0 ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{notification.text}</p>
                        {!notification.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png" alt="User" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium">Aisha</p>
              <p className="text-xs text-gray-500">Cashier</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
