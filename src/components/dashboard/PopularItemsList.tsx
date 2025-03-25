
import React, { useEffect, useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Utensils, Coffee, Cake } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PopularItem {
  id: string; // Changed from number to string
  name: string;
  category: string;
  sales: number;
  growth: number;
}

interface PopularItemsListProps {
  items?: PopularItem[];
}

const PopularItemsList: React.FC<PopularItemsListProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState<PopularItem[]>(initialItems || []);
  const [isLoading, setIsLoading] = useState(!initialItems);

  useEffect(() => {
    if (!initialItems) {
      fetchPopularItems();
    }
  }, [initialItems]);

  const fetchPopularItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          id,
          title,
          categories(name),
          popular
        `)
        .eq('popular', true)
        .limit(5);
      
      if (error) throw error;
      
      // Transform data and generate random sales and growth numbers for demo purposes
      const popularItems: PopularItem[] = data.map(item => ({
        id: item.id,
        name: item.title,
        category: item.categories?.name || 'Uncategorized',
        sales: Math.floor(Math.random() * 100) + 20, // Random number between 20-120
        growth: Math.floor(Math.random() * 30) + 5 // Random number between 5-35
      }));
      
      setItems(popularItems);
    } catch (error) {
      console.error('Error fetching popular items:', error);
      toast.error('Failed to load popular items');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('main') || categoryLower.includes('dish')) {
      return <Utensils className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    } else if (categoryLower.includes('beverage') || categoryLower.includes('drink')) {
      return <Coffee className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    } else if (categoryLower.includes('dessert') || categoryLower.includes('cake')) {
      return <Cake className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    } else {
      return <Coffee className="h-4 w-4 text-blue-600 dark:text-blue-400" />; // Default icon
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Popular Items</CardTitle>
        <CardDescription>
          Top selling menu items this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.sales} sold</p>
                  <p className="text-xs text-green-500">+{item.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No popular items found</p>
            <p className="text-sm">Mark items as popular in Products page</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PopularItemsList;
