
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LanguageSelector from '@/components/LanguageSelector';

interface AppearanceSettingsProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, onThemeChange }) => {
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
          <Select value={theme} onValueChange={onThemeChange}>
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
              { color: 'bg-blue-500', name: 'Blue' },
              { color: 'bg-green-500', name: 'Green' },
              { color: 'bg-purple-500', name: 'Purple' },
              { color: 'bg-red-500', name: 'Red' },
              { color: 'bg-orange-500', name: 'Orange' },
            ].map((colorOption) => (
              <div 
                key={colorOption.name}
                className={`h-10 rounded-md cursor-pointer border-2 ${colorOption.color} ${colorOption.name === 'Blue' ? 'border-black dark:border-white' : 'border-transparent'}`}
                title={colorOption.name}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="font-size" className="dark:text-gray-300">Font Size</Label>
          <Select defaultValue="medium">
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
            <Switch id="compact-mode" />
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Reduces padding and margins for a more compact interface
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="animations" className="dark:text-gray-300">Interface Animations</Label>
            <Switch id="animations" defaultChecked />
          </div>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Enable or disable interface animations and transitions
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Appearance</Button>
      </CardFooter>
    </Card>
  );
};

export default AppearanceSettings;
