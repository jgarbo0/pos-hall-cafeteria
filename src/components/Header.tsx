
import React, { useState } from 'react';
import { Search, Filter, Bell, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

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
          <Button variant="default" size="sm" className="gap-2 rounded-full h-10 px-4 bg-blue-600 text-white">
            <Menu className="h-4 w-4" />
            <span>All Menu</span>
          </Button>
          
          <Button variant="default" size="sm" className="gap-2 rounded-full h-10 px-4 bg-blue-600 text-white">
            <Menu className="h-4 w-4" />
            <span>All Menu</span>
          </Button>
          
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>
          
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png" alt="User" />
              <AvatarFallback>HS</AvatarFallback>
            </Avatar>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium">Brooklyn</p>
              <p className="text-xs text-gray-500">Cashier</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
