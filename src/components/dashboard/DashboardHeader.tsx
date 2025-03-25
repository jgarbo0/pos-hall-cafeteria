
import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

const DashboardHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your restaurant today.
        </p>
      </div>
      <div className="flex items-center dark:text-gray-300 mt-3 sm:mt-0">
        <Clock className="h-4 w-4 mr-2" />
        <span>{format(currentTime, 'EEEE, MMMM d, yyyy')} | {format(currentTime, 'h:mm:ss a')}</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
