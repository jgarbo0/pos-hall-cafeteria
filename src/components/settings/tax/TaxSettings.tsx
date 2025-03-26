
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
  TaxSettings as TaxSettingsType, 
  updateTaxSettings 
} from '@/services/SettingsService';

interface TaxSettingsProps {
  taxSettings: TaxSettingsType;
  setTaxSettings: React.Dispatch<React.SetStateAction<TaxSettingsType>>;
}

const TaxSettingsComponent: React.FC<TaxSettingsProps> = ({ 
  taxSettings, 
  setTaxSettings 
}) => {
  const handleSaveTaxSettings = async () => {
    console.log('Saving tax settings:', taxSettings);
    const success = await updateTaxSettings(taxSettings);
    if (success) {
      toast.success('Tax settings saved successfully');
    }
  };

  return (
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
  );
};

export default TaxSettingsComponent;
