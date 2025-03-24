
import React from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const Hall = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Hall Management</h1>
            <p className="text-gray-500 mb-8">This page is under construction</p>
            <Button asChild>
              <a href="/">Return to Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hall;
