
import React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

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
    <div className="w-full overflow-x-auto py-4 px-6 no-scrollbar">
      <div className="flex space-x-2 min-w-max animate-fadeIn">
        <button
          className={cn(
            "py-2 px-4 rounded-full text-sm font-medium transition-colors",
            activeCategory === "all" 
              ? "bg-blue-500 text-white" 
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
          )}
          onClick={() => onCategoryChange("all")}
        >
          All Menu
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            className={cn(
              "py-2 px-4 rounded-full text-sm font-medium transition-colors",
              activeCategory === category.id 
                ? "bg-blue-500 text-white" 
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
            )}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuCategories;
