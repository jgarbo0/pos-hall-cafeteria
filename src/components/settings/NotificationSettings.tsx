
import React from 'react';
import { Button } from '@/components/ui/button';
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
import { Separator } from '@/components/ui/separator';

const NotificationSettings: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Customize your notification settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-white">Email Notifications</h3>
            <div className="space-y-2">
              {[
                { id: 'new-order', label: 'New Order Notifications' },
                { id: 'low-stock', label: 'Low Stock Alerts' },
                { id: 'daily-summary', label: 'Daily Sales Summary' },
                { id: 'customer-feedback', label: 'Customer Feedback' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <Label htmlFor={item.id} className="flex-1 dark:text-gray-300">{item.label}</Label>
                  <Switch id={item.id} defaultChecked={item.id !== 'customer-feedback'} />
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="dark:bg-gray-700" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-white">App Notifications</h3>
            <div className="space-y-2">
              {[
                { id: 'app-new-order', label: 'New Order Alerts' },
                { id: 'app-order-status', label: 'Order Status Changes' },
                { id: 'app-inventory', label: 'Inventory Updates' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <Label htmlFor={item.id} className="flex-1 dark:text-gray-300">{item.label}</Label>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
