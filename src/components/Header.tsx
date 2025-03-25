
import React, { useState, useEffect } from 'react';
import { Search, Filter, Bell, Languages, LogOut, User, Settings, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import { User as UserType, Theme } from '@/types';

// Define available languages
const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
];

// Mock translations (in a real app, this would be more comprehensive)
const translations = {
  en: {
    search: "Search menu here...",
    filter: "Filter",
    notifications: "Notifications",
    markAllAsRead: "Mark all as read",
    myAccount: "My Account",
    switchUser: "Switch User",
    profile: "Profile",
    settings: "Settings",
    logout: "Log out",
    darkMode: "Dark mode",
    noNotifications: "No notifications"
  },
  so: {
    search: "Halkan raadi cuntooyinka...",
    filter: "Shaandhayn",
    notifications: "Ogeysiisyada",
    markAllAsRead: "Dhamaan u calaamadee sida la aqriyay",
    myAccount: "Akoonkeyga",
    switchUser: "Bedel isticmaale",
    profile: "Faahfaahinta",
    settings: "Dejinta",
    logout: "Ka bax",
    darkMode: "Habka madow",
    noNotifications: "Ma jiraan ogeysiisyo"
  },
  ar: {
    search: "ابحث هنا عن القائمة...",
    filter: "تصفية",
    notifications: "الإشعارات",
    markAllAsRead: "وضع علامة على الكل كمقروء",
    myAccount: "حسابي",
    switchUser: "تبديل المستخدم",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    darkMode: "الوضع المظلم",
    noNotifications: "لا توجد إشعارات"
  }
};

// Mock user data with correct role types
const predefinedUsers: UserType[] = [
  { id: '1', name: 'Aisha', email: 'aisha@example.com', role: 'admin', avatar: '/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png' },
  { id: '2', name: 'Mohamed', email: 'mohamed@example.com', role: 'cashier', avatar: null },
  { id: '3', name: 'Fatima', email: 'fatima@example.com', role: 'manager', avatar: null }
];

const Header = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received", time: "2 min ago", read: false },
    { id: 2, text: "Payment completed", time: "10 min ago", read: false },
    { id: 3, text: "New customer registered", time: "1 hour ago", read: true }
  ]);
  const [languageCode, setLanguageCode] = useState('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser] = useState<UserType>(predefinedUsers[0]);
  
  const navigate = useNavigate();
  
  // Get current translations based on selected language
  const t = translations[languageCode as keyof typeof translations];
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Get saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguageCode(savedLanguage);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleLanguageChange = (code: string) => {
    setLanguageCode(code);
    // Save language preference
    localStorage.setItem('language', code);
    
    // Find the language name to display in the toast
    const language = availableLanguages.find(lang => lang.code === code)?.name || code;
    toast.success(`Language set to ${language}`);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    toast.success(`Theme set to ${newTheme} mode`);
  };

  const handleUserChange = (selectedUser: UserType) => {
    setUser(selectedUser);
    toast.success(`Switched to ${selectedUser.name}'s account (${selectedUser.role})`);
  };

  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('user');
    toast.success("You have been logged out successfully");
    navigate('/login');
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <header className="w-full px-6 py-4 bg-white border-b dark:bg-gray-900 dark:border-gray-800 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder={t.search}
              className="pl-10 h-10 w-full rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-primary dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-400"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button variant="outline" size="sm" className="ml-2 gap-2 rounded-full h-10 px-4 dark:text-gray-300 dark:border-gray-700">
            <Filter className="h-4 w-4" />
            <span>{t.filter}</span>
          </Button>
        </div>
        
        <div className="flex items-center ml-4 space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full dark:text-gray-300 dark:border-gray-700">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-700">
              <DropdownMenuLabel className="dark:text-gray-200">Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-gray-700" />
              {availableLanguages.map(lang => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`${languageCode === lang.code ? 'bg-blue-50 dark:bg-blue-900/30' : ''} dark:text-gray-200 dark:hover:bg-gray-800`}
                >
                  <span className="mr-2">{lang.flag}</span> {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full relative dark:text-gray-300 dark:border-gray-700">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 dark:bg-gray-900 dark:border-gray-700" align="end">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h3 className="font-medium dark:text-gray-200">{t.notifications}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t.markAllAsRead}
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b last:border-0 dark:border-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium dark:text-gray-200">{notification.text}</p>
                        {!notification.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">{t.noNotifications}</div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full dark:text-gray-300 dark:border-gray-700"
            onClick={handleThemeToggle}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <Avatar className="h-10 w-10 border dark:border-gray-700">
                  <AvatarImage src={user.avatar || "/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-3 hidden md:block">
                  <p className="text-sm font-medium dark:text-gray-200">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-700">
              <DropdownMenuLabel className="dark:text-gray-200">{t.myAccount}</DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-gray-700" />
              
              {/* User switching section */}
              <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 pt-2">{t.switchUser}</DropdownMenuLabel>
              {predefinedUsers.map(predefinedUser => (
                <DropdownMenuItem 
                  key={predefinedUser.id} 
                  onClick={() => handleUserChange(predefinedUser)}
                  className={`${user.id === predefinedUser.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''} dark:text-gray-200 dark:hover:bg-gray-800`}
                >
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="text-[10px]">{predefinedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm">{predefinedUser.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{predefinedUser.role}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator className="dark:bg-gray-700" />
              <DropdownMenuItem className="dark:text-gray-200 dark:hover:bg-gray-800">
                <User className="mr-2 h-4 w-4" />
                <span>{t.profile}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-200 dark:hover:bg-gray-800">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t.settings}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-gray-700" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 dark:hover:bg-gray-800"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
