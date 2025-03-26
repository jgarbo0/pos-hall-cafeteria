
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  RestaurantInfo, 
  updateRestaurantInfo 
} from '@/services/SettingsService';

interface RestaurantInfoSettingsProps {
  restaurantInfo: RestaurantInfo;
  setRestaurantInfo: React.Dispatch<React.SetStateAction<RestaurantInfo>>;
}

const RestaurantInfoSettings: React.FC<RestaurantInfoSettingsProps> = ({ 
  restaurantInfo, 
  setRestaurantInfo 
}) => {
  const handleSaveRestaurantInfo = async () => {
    console.log('Saving restaurant info:', restaurantInfo);
    const success = await updateRestaurantInfo(restaurantInfo);
    if (success) {
      toast.success('Restaurant information saved successfully');
    }
  };

  return (
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
  );
};

export default RestaurantInfoSettings;
