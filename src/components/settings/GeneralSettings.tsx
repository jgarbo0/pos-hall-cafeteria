
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  RestaurantInfo, 
  getRestaurantInfo, 
  updateRestaurantInfo,
  TaxSettings,
  getTaxSettings,
  updateTaxSettings,
  ReceiptSettings,
  getReceiptSettings,
  updateReceiptSettings
} from '@/services/SettingsService';

const GeneralSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: '',
    phone: '',
    address: '',
    email: '',
    business_hours: ''
  });
  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    tax_rate: 0,
    include_tax_in_price: false,
    show_tax_on_receipt: false
  });
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>({
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
        
        // Fetch restaurant info
        const restaurantData = await getRestaurantInfo();
        if (restaurantData) {
          setRestaurantInfo(restaurantData);
        }
        
        // Fetch tax settings
        const taxData = await getTaxSettings();
        if (taxData) {
          setTaxSettings(taxData);
        }
        
        // Fetch receipt settings
        const receiptData = await getReceiptSettings();
        if (receiptData) {
          setReceiptSettings(receiptData);
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
    console.log('Saving restaurant info:', restaurantInfo);
    await updateRestaurantInfo(restaurantInfo);
  };

  const handleSaveTaxSettings = async () => {
    console.log('Saving tax settings:', taxSettings);
    await updateTaxSettings(taxSettings);
  };

  const handleSaveReceiptSettings = async () => {
    console.log('Saving receipt settings:', receiptSettings);
    await updateReceiptSettings(receiptSettings);
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
                value={restaurantInfo.phone || ''} 
                onChange={(e) => setRestaurantInfo({...restaurantInfo, phone: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-address" className="dark:text-gray-300">Address</Label>
            <Input 
              id="restaurant-address" 
              value={restaurantInfo.address || ''} 
              onChange={(e) => setRestaurantInfo({...restaurantInfo, address: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-email" className="dark:text-gray-300">Email</Label>
            <Input 
              id="restaurant-email" 
              type="email" 
              value={restaurantInfo.email || ''} 
              onChange={(e) => setRestaurantInfo({...restaurantInfo, email: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restaurant-hours" className="dark:text-gray-300">Business Hours</Label>
            <Input 
              id="restaurant-hours" 
              value={restaurantInfo.business_hours || ''} 
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
              onChange={(e) => setTaxSettings({...taxSettings, tax_rate: parseFloat(e.target.value) || 0})} 
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
              value={receiptSettings.header || ''}
              onChange={(e) => setReceiptSettings({...receiptSettings, header: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt-address" className="dark:text-gray-300">Receipt Address</Label>
            <Input 
              id="receipt-address" 
              value={receiptSettings.address || ''}
              onChange={(e) => setReceiptSettings({...receiptSettings, address: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt-footer" className="dark:text-gray-300">Receipt Footer Text</Label>
            <Input 
              id="receipt-footer" 
              value={receiptSettings.footer || ''}
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
