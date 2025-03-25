
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'so' | 'ar';

export type Translations = {
  [key: string]: {
    en: string;
    so: string;
    ar: string;
  };
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultTranslations: Translations = {
  "all_items": {
    en: "All Items",
    so: "Dhamaan Cuntooyinka",
    ar: "جميع العناصر"
  },
  "dashboard": {
    en: "Dashboard",
    so: "Dashboard",
    ar: "لوحة التحكم"
  },
  "orders": {
    en: "Orders",
    so: "Dalabada",
    ar: "الطلبات"
  },
  "menu": {
    en: "Menu",
    so: "Menu",
    ar: "القائمة"
  },
  "hall": {
    en: "Hall",
    so: "Hall",
    ar: "الصالة"
  },
  "products": {
    en: "Products",
    so: "Alaabta",
    ar: "المنتجات"
  },
  "finance": {
    en: "Finance",
    so: "Maaliyadda",
    ar: "المالية"
  },
  "customers": {
    en: "Customers",
    so: "Macaamiisha",
    ar: "العملاء"
  },
  "settings": {
    en: "Settings",
    so: "Fadhiga",
    ar: "الإعدادات"
  },
  "cart": {
    en: "Cart",
    so: "Kaalay",
    ar: "عربة التسوق"
  },
  "search": {
    en: "Search",
    so: "Raadi",
    ar: "بحث"
  },
  "add_to_cart": {
    en: "Add to Cart",
    so: "Ku dar Kaalay",
    ar: "أضف إلى العربة"
  },
  "clear_cart": {
    en: "Clear Cart",
    so: "Nadiifi Kaalay",
    ar: "مسح العربة"
  },
  "subtotal": {
    en: "Subtotal",
    so: "Subtotal",
    ar: "المجموع الفرعي"
  },
  "tax": {
    en: "Tax",
    so: "Canshuur",
    ar: "الضريبة"
  },
  "total": {
    en: "Total",
    so: "Wadarta",
    ar: "المجموع"
  },
  "place_order": {
    en: "Place Order",
    so: "Dalbo",
    ar: "تقديم الطلب"
  },
  "order_number": {
    en: "Order Number",
    so: "Lambarka Dalabka",
    ar: "رقم الطلب"
  },
  "table_number": {
    en: "Table Number",
    so: "Lambarka Miiska",
    ar: "رقم الطاولة"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);

  useEffect(() => {
    // Load language from localStorage on initial render
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
