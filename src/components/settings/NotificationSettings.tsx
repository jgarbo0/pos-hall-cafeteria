
import React, { useState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import { 
  NotificationSettings as NotificationSettingsType,
  getNotificationSettings,
  updateNotificationSettings
} from '@/services/SettingsService';
import { toast } from 'sonner';

const NotificationSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>({
    email_new_order: true,
    email_low_stock: true,
    email_daily_summary: true,
    email_customer_feedback: false,
    app_new_order: true,
    app_order_status: true,
    app_inventory: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const settings = await getNotificationSettings();
        if (settings) {
          setNotificationSettings(settings);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast.error('Failed to load notification settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleSaveAll = async () => {
    console.log('Saving notification settings:', notificationSettings);
    
    const success = await updateNotificationSettings(notificationSettings);
    
    if (success) {
      toast.success('Notification preferences saved');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading notification settings...</p>
        </div>
      </div>
    );
  }

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
                { id: 'new-order', key: 'email_new_order', label: 'New Order Notifications' },
                { id: 'low-stock', key: 'email_low_stock', label: 'Low Stock Alerts' },
                { id: 'daily-summary', key: 'email_daily_summary', label: 'Daily Sales Summary' },
                { id: 'customer-feedback', key: 'email_customer_feedback', label: 'Customer Feedback' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <Label htmlFor={item.id} className="flex-1 dark:text-gray-300">{item.label}</Label>
                  <Switch 
                    id={item.id} 
                    checked={notificationSettings[item.key as keyof NotificationSettingsType]}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({ 
                        ...notificationSettings, 
                        [item.key]: checked 
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="dark:bg-gray-700" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-white">App Notifications</h3>
            <div className="space-y-2">
              {[
                { id: 'app-new-order', key: 'app_new_order', label: 'New Order Alerts' },
                { id: 'app-order-status', key: 'app_order_status', label: 'Order Status Changes' },
                { id: 'app-inventory', key: 'app_inventory', label: 'Inventory Updates' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <Label htmlFor={item.id} className="flex-1 dark:text-gray-300">{item.label}</Label>
                  <Switch 
                    id={item.id} 
                    checked={notificationSettings[item.key as keyof NotificationSettingsType]}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({ 
                        ...notificationSettings, 
                        [item.key]: checked 
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveAll}>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
