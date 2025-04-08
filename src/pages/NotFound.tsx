
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button>
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
