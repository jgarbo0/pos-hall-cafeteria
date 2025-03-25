
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { UserPlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Customer, getCustomers } from '@/services/SupabaseService';
import { toast } from 'sonner';

const CustomerSettings: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data.slice(0, 4)); // Only display the first 4 customers
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);

  const handleViewCustomerDetails = (customerId: string) => {
    navigate(`/customer/${customerId}`);
  };

  const handleAddCustomer = () => {
    navigate('/customers');
  };

  if (loading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Registered Customers</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Manage customer accounts and view payment history
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-500 dark:text-gray-400">Loading customers...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="dark:text-white">Registered Customers</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Manage customer accounts and view payment history
          </CardDescription>
        </div>
        <Button size="sm" className="flex items-center gap-1" onClick={handleAddCustomer}>
          <UserPlus size={16} />
          Add Customer
        </Button>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No customers found. Add your first customer now.</p>
            <Button variant="outline" onClick={handleAddCustomer}>
              <UserPlus size={16} className="mr-2" />
              Add Customer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="p-4 border rounded-md dark:border-gray-700 dark:bg-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium dark:text-white">{customer.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email || 'No email provided'}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="dark:bg-gray-600 dark:text-white dark:border-gray-600"
                    onClick={() => handleViewCustomerDetails(customer.id)}
                  >
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
                    <span className="ml-2 dark:text-white">${customer.totalSpent?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t dark:border-gray-600">
                  <h5 className="text-sm font-medium mb-2 dark:text-gray-300">Pending Payments</h5>
                  {customer.pendingPayments && customer.pendingPayments.length > 0 ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm dark:text-gray-300">{customer.pendingPayments[0].description}</span>
                        <span className="text-sm font-medium dark:text-yellow-300">${customer.pendingPayments[0].amount.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        From {new Date(customer.pendingPayments[0].date).toLocaleDateString()}
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
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerSettings;
