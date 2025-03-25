
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeText: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeText, icon }) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className="flex items-center mt-1">
            <span className="text-xs font-medium text-green-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </span>
            <span className="text-xs text-muted-foreground ml-1">{changeText}</span>
          </div>
        </div>
        <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
