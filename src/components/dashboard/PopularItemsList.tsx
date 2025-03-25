
import React from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Utensils, Coffee } from 'lucide-react';

interface PopularItem {
  id: string; // Changed from number to string
  name: string;
  category: string;
  sales: number;
  growth: number;
}

interface PopularItemsListProps {
  items: PopularItem[];
}

const PopularItemsList: React.FC<PopularItemsListProps> = ({ items }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Popular Items</CardTitle>
        <CardDescription>
          Top selling menu items this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                  {item.category === 'Main Dishes' ? 
                    <Utensils className="h-4 w-4 text-blue-600 dark:text-blue-400" /> : 
                    item.category === 'Beverages' ? 
                      <Coffee className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                      <Coffee className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  }
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
      </CardContent>
    </Card>
  );
};

export default PopularItemsList;
