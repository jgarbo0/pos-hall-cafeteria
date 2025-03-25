
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

const CustomerSettings: React.FC = () => {
  const mockCustomers = [
    { id: 'c1', name: 'Ahmed Mohamed', email: 'ahmed@example.com', totalOrders: 24, totalSpent: 845.50 },
    { id: 'c2', name: 'Fatima Hussein', email: 'fatima@example.com', totalOrders: 18, totalSpent: 620.75 },
    { id: 'c3', name: 'Omar Jama', email: 'omar@example.com', totalOrders: 9, totalSpent: 312.25 },
    { id: 'c4', name: 'Amina Abdi', email: 'amina@example.com', totalOrders: 15, totalSpent: 490.00 },
  ];

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="dark:text-white">Registered Customers</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Manage customer accounts and view payment history
          </CardDescription>
        </div>
        <Button size="sm" className="flex items-center gap-1">
          <UserPlus size={16} />
          Add Customer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCustomers.map((customer) => (
            <div key={customer.id} className="p-4 border rounded-md dark:border-gray-700 dark:bg-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium dark:text-white">{customer.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                </div>
                <Button variant="outline" size="sm" className="dark:bg-gray-600 dark:text-white dark:border-gray-600">
                  View Details
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Total Orders:</span> 
                  <span className="ml-2 dark:text-white">{customer.totalOrders}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Total Spent:</span> 
                  <span className="ml-2 dark:text-white">${customer.totalSpent.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t dark:border-gray-600">
                <h5 className="text-sm font-medium mb-2 dark:text-gray-300">Pending Payments</h5>
                {customer.id === 'c1' || customer.id === 'c3' ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm dark:text-gray-300">Order #12458</span>
                      <span className="text-sm font-medium dark:text-yellow-300">${customer.id === 'c1' ? '45.75' : '28.50'}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      From {customer.id === 'c1' ? '2 days ago' : 'yesterday'}
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 h-8 text-xs w-full dark:bg-gray-700 dark:border-gray-600">
                      Mark as Paid
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">No pending payments</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSettings;
