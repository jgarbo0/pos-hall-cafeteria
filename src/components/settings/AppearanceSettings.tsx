
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LanguageSelector from '@/components/LanguageSelector';
import { getSettings, updateSettings } from '@/services/SettingsService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AppearanceSettingsProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, onThemeChange }) => {
  const [loading, setLoading] = useState(true);
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primary_color: 'blue',
    font_size: 'medium',
    compact_mode: false,
    animations: true
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settings = await getSettings('appearance', 'theme_settings');
        
        if (settings) {
          setAppearanceSettings(settings);
          // Update the theme in parent component if it differs
          if (settings.theme !== theme) {
            onThemeChange(settings.theme);
          }
        }
      } catch (error) {
        console.error('Error fetching appearance settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [theme, onThemeChange]);
  
  const handleSaveAppearance = async () => {
    try {
      const success = await updateSettings('appearance', 'theme_settings', appearanceSettings);
      
      if (success) {
        // Make sure to update the theme in the parent component
        onThemeChange(appearanceSettings.theme);
        toast.success('Appearance settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving appearance settings:', error);
      toast.error('Failed to save appearance settings');
    }
  };
  
  const handleThemeChange = (value: string) => {
    setAppearanceSettings({ ...appearanceSettings, theme: value });
    onThemeChange(value);
  };
  
  const handlePrimaryColorSelect = (color: string) => {
    setAppearanceSettings({ ...appearanceSettings, primary_color: color });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading appearance settings...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Appearance Settings</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Customize the appearance of your POS system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme" className="dark:text-gray-300">Theme</Label>
          <Select value={appearanceSettings.theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language" className="dark:text-gray-300">Language</Label>
          <div className="py-2">
            <LanguageSelector />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primary-color" className="dark:text-gray-300">Primary Color</Label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { color: 'bg-blue-500', name: 'blue' },
              { color: 'bg-green-500', name: 'green' },
              { color: 'bg-purple-500', name: 'purple' },
              { color: 'bg-red-500', name: 'red' },
              { color: 'bg-orange-500', name: 'orange' },
            ].map((colorOption) => (
              <div 
                key={colorOption.name}
                className={`h-10 rounded-md cursor-pointer border-2 ${colorOption.color} ${
                  colorOption.name === appearanceSettings.primary_color ? 'border-black dark:border-white' : 'border-transparent'
                }`}
                title={colorOption.name}
                onClick={() => handlePrimaryColorSelect(colorOption.name)}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font-size" className="dark:text-gray-300">Font Size</Label>
          <Select 
            value={appearanceSettings.font_size}
            onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, font_size: value })}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="compact-mode" className="dark:text-gray-300">Compact Mode</Label>
            <Switch 
              id="compact-mode" 
              checked={appearanceSettings.compact_mode}
              onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, compact_mode: checked })}
            />
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Reduces padding and margins for a more compact interface
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations" className="dark:text-gray-300">Interface Animations</Label>
            <Switch 
              id="animations" 
              checked={appearanceSettings.animations}
              onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, animations: checked })}
            />
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Enable or disable interface animations and transitions
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveAppearance}>Save Appearance</Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSettings;
