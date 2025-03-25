
import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  
  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && ['en', 'so', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage as 'en' | 'so' | 'ar');
    }
  }, [setLanguage]);
  
  const handleLanguageChange = (newLanguage: 'en' | 'so' | 'ar') => {
    setLanguage(newLanguage);
    // Save language preference to localStorage
    localStorage.setItem('language', newLanguage);
    
    // Show confirmation toast
    const languageNames = {
      en: 'English',
      so: 'Somali',
      ar: 'Arabic'
    };
    
    toast.success(`Language changed to ${languageNames[newLanguage]}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
          <Globe className="h-5 w-5 dark:text-white" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-600 text-[0.6rem] text-white flex items-center justify-center font-bold">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')} 
          className={`${language === 'en' ? 'bg-blue-100 dark:bg-blue-900' : ''} dark:text-white dark:hover:bg-gray-700`}
        >
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('so')} 
          className={`${language === 'so' ? 'bg-blue-100 dark:bg-blue-900' : ''} dark:text-white dark:hover:bg-gray-700`}
        >
          <span className="mr-2">🇸🇴</span> Somali
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ar')} 
          className={`${language === 'ar' ? 'bg-blue-100 dark:bg-blue-900' : ''} dark:text-white dark:hover:bg-gray-700`}
        >
          <span className="mr-2">🇸🇦</span> Arabic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
