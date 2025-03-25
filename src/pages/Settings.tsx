
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';

// Import the new component files
import GeneralSettings from '@/components/settings/GeneralSettings';
import UserManagement from '@/components/settings/UserManagement';
import RolesPermissions from '@/components/settings/RolesPermissions';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import CustomerSettings from '@/components/settings/CustomerSettings';

const Settings = () => {
  const { t } = useLanguage();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Manage your restaurant settings and preferences
            </p>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6 dark:bg-gray-800">
              <TabsTrigger value="general" className="dark:data-[state=active]:bg-gray-700 dark:text-white">General</TabsTrigger>
              <TabsTrigger value="users" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Users</TabsTrigger>
              <TabsTrigger value="roles" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="notifications" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Notifications</TabsTrigger>
              <TabsTrigger value="appearance" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Appearance</TabsTrigger>
              <TabsTrigger value="customers" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Customers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="roles">
              <RolesPermissions />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="appearance">
              <AppearanceSettings theme={theme} onThemeChange={handleThemeChange} />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
