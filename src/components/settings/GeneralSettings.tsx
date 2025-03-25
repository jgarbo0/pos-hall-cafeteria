
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  itemCount: number;
}

const GeneralSettings: React.FC = () => {
  const mockCategories = [
    { id: '1', name: 'Main Dishes', itemCount: 12 },
    { id: '2', name: 'Appetizers', itemCount: 8 },
    { id: '3', name: 'Desserts', itemCount: 6 },
    { id: '4', name: 'Beverages', itemCount: 10 },
    { id: '5', name: 'Specials', itemCount: 5 },
  ];

  return (
    <div className="grid gap-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Restaurant Information</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Basic information about your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name" className="dark:text-gray-300">Restaurant Name</Label>
              <Input id="restaurant-name" defaultValue="Doob Venue" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-phone" className="dark:text-gray-300">Phone Number</Label>
              <Input id="restaurant-phone" defaultValue="+1 (555) 123-4567" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-address" className="dark:text-gray-300">Address</Label>
            <Input id="restaurant-address" defaultValue="Hargeisa Somaliland, Masalla" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-email" className="dark:text-gray-300">Email</Label>
            <Input id="restaurant-email" type="email" defaultValue="contact@doobvenue.com" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-hours" className="dark:text-gray-300">Business Hours</Label>
            <Input id="restaurant-hours" defaultValue="Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="dark:text-white">Categories</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Manage menu categories
            </CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={16} />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Add New Category</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Create a new category for menu items
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name" className="dark:text-gray-300">Category Name</Label>
                  <Input id="category-name" placeholder="e.g. Breakfast, Lunch, Dinner" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description" className="dark:text-gray-300">Description (Optional)</Label>
                  <Input id="category-description" placeholder="Brief description of this category" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium dark:text-white">{category.name}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{category.itemCount} items</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 dark:text-gray-400">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Tax Settings</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Configure tax rates for your orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tax-rate" className="dark:text-gray-300">Sales Tax Rate (%)</Label>
            <Input id="tax-rate" type="number" step="0.01" defaultValue="8.25" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="include-tax" defaultChecked />
            <Label htmlFor="include-tax" className="dark:text-gray-300">Include tax in listed prices</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-tax-receipt" defaultChecked />
            <Label htmlFor="show-tax-receipt" className="dark:text-gray-300">Show tax details on receipt</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Receipt Settings</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Customize your receipt format and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="receipt-header" className="dark:text-gray-300">Receipt Header</Label>
            <Input id="receipt-header" defaultValue="Doob Venue" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt-address" className="dark:text-gray-300">Receipt Address</Label>
            <Input id="receipt-address" defaultValue="123 Main Street, Minneapolis, MN 55414" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt-footer" className="dark:text-gray-300">Receipt Footer Text</Label>
            <Input id="receipt-footer" defaultValue="Thank you for dining with us!" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-logo" defaultChecked />
            <Label htmlFor="show-logo" className="dark:text-gray-300">Show logo on receipt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="include-tip" defaultChecked />
            <Label htmlFor="include-tip" className="dark:text-gray-300">Include tip suggestion</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeneralSettings;
