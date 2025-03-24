
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, CheckCircle, Clock } from 'lucide-react';

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-3421",
    tableNumber: 5,
    type: "Dine In",
    items: 4,
    total: 42.50,
    status: "completed",
    date: "2023-10-15 12:34 PM"
  },
  {
    id: "ORD-3422",
    tableNumber: null,
    type: "Take Away",
    items: 2,
    total: 18.75,
    status: "completed",
    date: "2023-10-15 12:45 PM"
  },
  {
    id: "ORD-3423",
    tableNumber: 3,
    type: "Dine In",
    items: 6,
    total: 87.20,
    status: "processing",
    date: "2023-10-15 1:05 PM"
  },
  {
    id: "ORD-3424",
    tableNumber: null,
    type: "Take Away",
    items: 1,
    total: 12.99,
    status: "processing",
    date: "2023-10-15 1:15 PM"
  }
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("processing");
  
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Orders Management</h1>
            <Button>
              <Receipt className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
          
          <Tabs defaultValue="processing" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.type}</TableCell>
                          <TableCell>
                            {order.tableNumber ? `Table ${order.tableNumber}` : 'N/A'}
                          </TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <div className={`flex items-center space-x-1 ${
                              order.status === 'completed' ? 'text-green-600' : 'text-amber-500'
                            }`}>
                              {order.status === 'completed' ? (
                                <>
                                  <CheckCircle size={16} />
                                  <span>Completed</span>
                                </>
                              ) : (
                                <>
                                  <Clock size={16} />
                                  <span>Processing</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Orders;
