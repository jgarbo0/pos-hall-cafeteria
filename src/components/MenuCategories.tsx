
import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuCategoriesProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const MenuCategories: React.FC<MenuCategoriesProps> = ({ 
  categories,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="w-full py-4 px-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex space-x-2 min-w-max animate-fadeIn pb-1">
          <button
            className={cn(
              "py-2 px-4 rounded-full text-sm font-medium transition-colors",
              activeCategory === "all" 
                ? "bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white" 
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
            onClick={() => onCategoryChange("all")}
          >
            All Items
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              className={cn(
                "py-2 px-4 rounded-full text-sm font-medium transition-colors",
                activeCategory === category.id 
                  ? "bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white" 
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MenuCategories;
