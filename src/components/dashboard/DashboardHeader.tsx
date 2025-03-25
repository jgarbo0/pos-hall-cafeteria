
import React from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="default" size="sm">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
