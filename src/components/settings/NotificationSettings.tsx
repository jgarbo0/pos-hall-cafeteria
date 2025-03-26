
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
import { getAllSettingsByCategory, createOrUpdateSettings, SettingsValue } from '@/services/SettingsService';
import { toast } from 'sonner';

interface EmailNotifications {
  new_order: boolean;
  low_stock: boolean;
  daily_summary: boolean;
  customer_feedback: boolean;
}

interface AppNotifications {
  app_new_order: boolean;
  app_order_status: boolean;
  app_inventory: boolean;
}

const NotificationSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState<EmailNotifications>({
    new_order: true,
    low_stock: true,
    daily_summary: true,
    customer_feedback: false
  });
  
  const [appNotifications, setAppNotifications] = useState<AppNotifications>({
    app_new_order: true,
    app_order_status: true,
    app_inventory: true
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const notificationSettings = await getAllSettingsByCategory('notifications');
        console.log('Fetched notification settings:', notificationSettings);
        
        if (notificationSettings) {
          if (notificationSettings.email_notifications) {
            setEmailNotifications(notificationSettings.email_notifications as EmailNotifications);
          }
          
          if (notificationSettings.app_notifications) {
            setAppNotifications(notificationSettings.app_notifications as AppNotifications);
          }
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
  
  const handleSaveEmailNotifications = async () => {
    console.log('Saving email notifications:', emailNotifications);
    const success = await createOrUpdateSettings('notifications', 'email_notifications', emailNotifications as unknown as SettingsValue);
    if (success) {
      toast.success('Email notification settings updated');
    }
  };
  
  const handleSaveAppNotifications = async () => {
    console.log('Saving app notifications:', appNotifications);
    const success = await createOrUpdateSettings('notifications', 'app_notifications', appNotifications as unknown as SettingsValue);
    if (success) {
      toast.success('App notification settings updated');
    }
  };
  
  const handleSaveAll = async () => {
    console.log('Saving all notifications:', {
      email: emailNotifications,
      app: appNotifications
    });
    const emailSuccess = await createOrUpdateSettings('notifications', 'email_notifications', emailNotifications as unknown as SettingsValue);
    const appSuccess = await createOrUpdateSettings('notifications', 'app_notifications', appNotifications as unknown as SettingsValue);
    
    if (emailSuccess && appSuccess) {
      toast.success('All notification preferences saved');
    } else {
      toast.error('Some settings could not be saved');
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
                { id: 'new-order', key: 'new_order', label: 'New Order Notifications' },
                { id: 'low-stock', key: 'low_stock', label: 'Low Stock Alerts' },
                { id: 'daily-summary', key: 'daily_summary', label: 'Daily Sales Summary' },
                { id: 'customer-feedback', key: 'customer_feedback', label: 'Customer Feedback' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <Label htmlFor={item.id} className="flex-1 dark:text-gray-300">{item.label}</Label>
                  <Switch 
                    id={item.id} 
                    checked={emailNotifications[item.key as keyof typeof emailNotifications]}
                    onCheckedChange={(checked) => {
                      setEmailNotifications({ ...emailNotifications, [item.key]: checked });
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
                    checked={appNotifications[item.key as keyof typeof appNotifications]}
                    onCheckedChange={(checked) => {
                      setAppNotifications({ ...appNotifications, [item.key]: checked });
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
