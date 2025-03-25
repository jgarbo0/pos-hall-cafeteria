
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-600 text-[0.6rem] text-white flex items-center justify-center font-bold">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-blue-100 dark:bg-blue-900' : ''}>
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('so')} className={language === 'so' ? 'bg-blue-100 dark:bg-blue-900' : ''}>
          <span className="mr-2">🇸🇴</span> Somali
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-blue-100 dark:bg-blue-900' : ''}>
          <span className="mr-2">🇸🇦</span> Arabic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
