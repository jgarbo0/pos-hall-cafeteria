
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
            "menu-category-button",
            activeCategory === "all" && "active"
          )}
          onClick={() => onCategoryChange("all")}
        >
          All Menu
        </button>
        
        {categories.map((category, index) => (
          <button
            key={category.id}
            className={cn(
              "menu-category-button",
              activeCategory === category.id && "active"
            )}
            onClick={() => onCategoryChange(category.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuCategories;
