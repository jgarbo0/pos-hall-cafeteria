
import React, { useState, useEffect } from 'react';
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
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAllSettingsByCategory, updateSettings } from '@/services/SettingsService';

interface Category {
  id: string;
  name: string;
  itemCount: number;
}

const GeneralSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    business_hours: ''
  });
  const [taxSettings, setTaxSettings] = useState({
    tax_rate: 0,
    include_tax_in_price: false,
    show_tax_on_receipt: false
  });
  const [receiptSettings, setReceiptSettings] = useState({
    header: '',
    address: '',
    footer: '',
    show_logo: false,
    include_tip: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // Fetch all general settings
        const generalSettings = await getAllSettingsByCategory('general');
        
        if (generalSettings) {
          // Set restaurant info
          if (generalSettings.restaurant_info) {
            setRestaurantInfo(generalSettings.restaurant_info);
          }
          
          // Set categories
          if (generalSettings.categories) {
            setCategories(generalSettings.categories);
          }
          
          // Set tax settings
          if (generalSettings.tax_settings) {
            setTaxSettings(generalSettings.tax_settings);
          }
          
          // Set receipt settings
          if (generalSettings.receipt_settings) {
            setReceiptSettings(generalSettings.receipt_settings);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSaveRestaurantInfo = async () => {
    const success = await updateSettings('general', 'restaurant_info', restaurantInfo);
    if (success) {
      toast.success('Restaurant information updated successfully');
    }
  };

  const handleSaveTaxSettings = async () => {
    const success = await updateSettings('general', 'tax_settings', taxSettings);
    if (success) {
      toast.success('Tax settings updated successfully');
    }
  };

  const handleSaveReceiptSettings = async () => {
    const success = await updateSettings('general', 'receipt_settings', receiptSettings);
    if (success) {
      toast.success('Receipt settings updated successfully');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    const newId = Math.random().toString(36).substr(2, 9);
    const newCategoryItem: Category = {
      id: newId,
      name: newCategory.name,
      itemCount: 0
    };
    
    const updatedCategories = [...categories, newCategoryItem];
    const success = await updateSettings('general', 'categories', updatedCategories);
    
    if (success) {
      setCategories(updatedCategories);
      setNewCategory({ name: '', description: '' });
      toast.success(`Category "${newCategory.name}" added successfully`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    const success = await updateSettings('general', 'categories', updatedCategories);
    
    if (success) {
      setCategories(updatedCategories);
      toast.success('Category deleted successfully');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

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
              <Input 
                id="restaurant-name" 
                value={restaurantInfo.name} 
                onChange={(e) => setRestaurantInfo({...restaurantInfo, name: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-phone" className="dark:text-gray-300">Phone Number</Label>
              <Input 
                id="restaurant-phone" 
                value={restaurantInfo.phone} 
                onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-address" className="dark:text-gray-300">Address</Label>
            <Input 
              id="restaurant-address" 
              value={restaurantInfo.address} 
              onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-email" className="dark:text-gray-300">Email</Label>
            <Input 
              id="restaurant-email" 
              type="email" 
              value={restaurantInfo.email} 
              onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-hours" className="dark:text-gray-300">Business Hours</Label>
            <Input 
              id="restaurant-hours" 
              value={restaurantInfo.business_hours} 
              onChange={(e) => setRestaurantInfo({...restaurantInfo, business_hours: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveRestaurantInfo}>Save Changes</Button>
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
                  <Input 
                    id="category-name" 
                    placeholder="e.g. Breakfast, Lunch, Dinner" 
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description" className="dark:text-gray-300">Description (Optional)</Label>
                  <Input 
                    id="category-description" 
                    placeholder="Brief description of this category" 
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCategory}>Save Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium dark:text-white">{category.name}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{category.itemCount} items</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 dark:text-gray-400">
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
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
            <Input 
              id="tax-rate" 
              type="number" 
              step="0.01" 
              value={taxSettings.tax_rate}
              onChange={(e) => setTaxSettings({...taxSettings, tax_rate: parseFloat(e.target.value)})} 
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="include-tax" 
              checked={taxSettings.include_tax_in_price}
              onCheckedChange={(checked) => setTaxSettings({...taxSettings, include_tax_in_price: checked})}
            />
            <Label htmlFor="include-tax" className="dark:text-gray-300">Include tax in listed prices</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-tax-receipt" 
              checked={taxSettings.show_tax_on_receipt}
              onCheckedChange={(checked) => setTaxSettings({...taxSettings, show_tax_on_receipt: checked})}
            />
            <Label htmlFor="show-tax-receipt" className="dark:text-gray-300">Show tax details on receipt</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveTaxSettings}>Save Changes</Button>
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
            <Input 
              id="receipt-header" 
              value={receiptSettings.header}
              onChange={(e) => setReceiptSettings({...receiptSettings, header: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt-address" className="dark:text-gray-300">Receipt Address</Label>
            <Input 
              id="receipt-address" 
              value={receiptSettings.address}
              onChange={(e) => setReceiptSettings({...receiptSettings, address: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt-footer" className="dark:text-gray-300">Receipt Footer Text</Label>
            <Input 
              id="receipt-footer" 
              value={receiptSettings.footer}
              onChange={(e) => setReceiptSettings({...receiptSettings, footer: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-logo" 
              checked={receiptSettings.show_logo}
              onCheckedChange={(checked) => setReceiptSettings({...receiptSettings, show_logo: checked})}
            />
            <Label htmlFor="show-logo" className="dark:text-gray-300">Show logo on receipt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="include-tip" 
              checked={receiptSettings.include_tip}
              onCheckedChange={(checked) => setReceiptSettings({...receiptSettings, include_tip: checked})}
            />
            <Label htmlFor="include-tip" className="dark:text-gray-300">Include tip suggestion</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveReceiptSettings}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeneralSettings;
