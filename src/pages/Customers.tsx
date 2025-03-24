
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample customer data
const customersData = [
  { id: 1, name: 'Ahmed Mohamed', phone: '+252 61 1234567', email: 'ahmed@example.com', address: 'Mogadishu, Somalia', totalOrders: 24, totalSpent: 560 },
  { id: 2, name: 'Fatima Hussein', phone: '+252 61 7654321', email: 'fatima@example.com', address: 'Hargeisa, Somalia', totalOrders: 18, totalSpent: 420 },
  { id: 3, name: 'Omar Jama', phone: '+252 63 1122334', email: 'omar@example.com', address: 'Kismayo, Somalia', totalOrders: 12, totalSpent: 380 },
  { id: 4, name: 'Amina Abdi', phone: '+252 62 9988776', email: 'amina@example.com', address: 'Bosaso, Somalia', totalOrders: 8, totalSpent: 240 },
  { id: 5, name: 'Mohammed Ali', phone: '+252 64 5566778', email: 'mohammed@example.com', address: 'Baidoa, Somalia', totalOrders: 15, totalSpent: 320 },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState(customersData);

  const filteredCustomers = customers.filter(
    customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white p-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <Button className="gap-2">
              <Plus size={16} />
              Add Customer
            </Button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search customers..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => (
              <Card key={customer.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{customer.name}</div>
                      <div className="text-sm text-gray-500">Customer #{customer.id}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{customer.address}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-bold">{customer.totalOrders}</div>
                      <div className="text-xs text-gray-500">Orders</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-lg font-bold">${customer.totalSpent}</div>
                      <div className="text-xs text-gray-500">Total Spent</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <Edit size={14} />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-1 text-red-500 hover:text-red-600 hover:border-red-200">
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
