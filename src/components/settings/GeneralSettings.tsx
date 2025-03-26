
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  RestaurantInfo, 
  getRestaurantInfo, 
  TaxSettings,
  getTaxSettings,
  ReceiptSettings,
  getReceiptSettings,
} from '@/services/SettingsService';

// Import component files
import RestaurantInfoSettings from './restaurant/RestaurantInfoSettings';
import TaxSettingsComponent from './tax/TaxSettings';
import ReceiptSettingsComponent from './receipt/ReceiptSettings';

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
      <RestaurantInfoSettings 
        restaurantInfo={restaurantInfo} 
        setRestaurantInfo={setRestaurantInfo} 
      />
      
      <TaxSettingsComponent 
        taxSettings={taxSettings} 
        setTaxSettings={setTaxSettings} 
      />
      
      <ReceiptSettingsComponent 
        receiptSettings={receiptSettings} 
        setReceiptSettings={setReceiptSettings} 
      />
    </div>
  );
};

export default GeneralSettings;
