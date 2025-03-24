
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface TableItem {
  id: number;
  name: string;
  seats: number;
  status: 'available' | 'occupied';
}

const Hall = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tables] = useState<TableItem[]>([
    { id: 1, name: 'Table 1', seats: 4, status: 'available' },
    { id: 2, name: 'Table 2', seats: 2, status: 'occupied' },
    { id: 3, name: 'Table 3', seats: 6, status: 'available' },
    { id: 4, name: 'Table 4', seats: 4, status: 'available' },
    { id: 5, name: 'Table 5', seats: 2, status: 'occupied' },
    { id: 6, name: 'Table 6', seats: 8, status: 'available' },
    { id: 7, name: 'Table 7', seats: 4, status: 'available' },
    { id: 8, name: 'Table 8', seats: 2, status: 'available' },
  ]);

  const handleSelectTable = (tableId: number) => {
    setSelectedTable(tableId);
    
    // Find the table by ID
    const table = tables.find(t => t.id === tableId);
    
    if (table?.status === 'occupied') {
      toast.error("This table is already occupied");
    } else {
      toast.success(`Table ${tableId} selected`);
      // In a real app, you would store this selected table in a global state
      localStorage.setItem('selectedTable', tableId.toString());
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-semibold mb-6">Hall Management</h1>
          
          <Tabs defaultValue="tables">
            <TabsList className="mb-6">
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="reservations">Reservations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tables" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <div 
                    key={table.id}
                    className={`p-4 rounded-lg border ${
                      table.status === 'available' 
                        ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                        : 'bg-gray-100'
                    } ${
                      selectedTable === table.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectTable(table.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{table.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        table.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {table.status === 'available' ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Seats: {table.seats}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reservations">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-lg font-medium mb-4">Upcoming Reservations</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Table</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Ahmed Mohamed</TableCell>
                      <TableCell>2023-10-15</TableCell>
                      <TableCell>7:00 PM</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>Table 3</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fartun Ali</TableCell>
                      <TableCell>2023-10-16</TableCell>
                      <TableCell>6:30 PM</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>Table 2</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">View</Button>
                      </TableCell>
                    </TableRow>
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

export default Hall;
