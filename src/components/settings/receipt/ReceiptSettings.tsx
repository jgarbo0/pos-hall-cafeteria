
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
import { toast } from 'sonner';
import { 
  ReceiptSettings as ReceiptSettingsType, 
  updateReceiptSettings 
} from '@/services/SettingsService';

interface ReceiptSettingsProps {
  receiptSettings: ReceiptSettingsType;
  setReceiptSettings: React.Dispatch<React.SetStateAction<ReceiptSettingsType>>;
}

const ReceiptSettingsComponent: React.FC<ReceiptSettingsProps> = ({ 
  receiptSettings, 
  setReceiptSettings 
}) => {
  const handleSaveReceiptSettings = async () => {
    console.log('Saving receipt settings:', receiptSettings);
    const success = await updateReceiptSettings(receiptSettings);
    if (success) {
      toast.success('Receipt settings saved successfully');
    }
  };

  return (
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
  );
};

export default ReceiptSettingsComponent;
