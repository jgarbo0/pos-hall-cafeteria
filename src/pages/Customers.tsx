
import React, { useState } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Grid, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Sample customer data
const customersData = [
  { id: 1, name: 'Ahmed Mohamed', phone: '+252 61 1234567', email: 'ahmed@example.com', address: 'Mogadishu, Somalia', totalOrders: 24, totalSpent: 560 },
  { id: 2, name: 'Fatima Hussein', phone: '+252 61 7654321', email: 'fatima@example.com', address: 'Hargeisa, Somalia', totalOrders: 18, totalSpent: 420 },
  { id: 3, name: 'Omar Jama', phone: '+252 63 1122334', email: 'omar@example.com', address: 'Kismayo, Somalia', totalOrders: 12, totalSpent: 380 },
  { id: 4, name: 'Amina Abdi', phone: '+252 62 9988776', email: 'amina@example.com', address: 'Bosaso, Somalia', totalOrders: 8, totalSpent: 240 },
  { id: 5, name: 'Mohammed Ali', phone: '+252 64 5566778', email: 'mohammed@example.com', address: 'Baidoa, Somalia', totalOrders: 15, totalSpent: 320 },
];

// Customer form interface
interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

// Customer interface
interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const filteredCustomers = customers.filter(
    customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCustomer = () => {
    const newCustomer: Customer = {
      id: customers.length + 1,
      ...formData,
      totalOrders: 0,
      totalSpent: 0
    };
    
    setCustomers([...customers, newCustomer]);
    setIsAddDialogOpen(false);
    setFormData({ name: '', phone: '', email: '', address: '' });
    toast.success(`${newCustomer.name} added successfully`);
  };

  const handleEditClick = (customer: Customer) => {
    setCurrentCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (!currentCustomer) return;
    
    const updatedCustomers = customers.map(customer => 
      customer.id === currentCustomer.id 
        ? { ...customer, ...formData }
        : customer
    );
    
    setCustomers(updatedCustomers);
    setIsEditDialogOpen(false);
    toast.success(`${formData.name} updated successfully`);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCustomer = () => {
    if (!currentCustomer) return;
    
    const updatedCustomers = customers.filter(customer => customer.id !== currentCustomer.id);
    setCustomers(updatedCustomers);
    setIsDeleteDialogOpen(false);
    toast.success(`${currentCustomer.name} deleted successfully`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} />
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customers</h1>
            
            <div className="flex items-center gap-4">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              
              <Button className="gap-2" onClick={() => {
                setFormData({ name: '', phone: '', email: '', address: '' });
                setIsAddDialogOpen(true);
              }}>
                <Plus size={16} />
                Add Customer
              </Button>
            </div>
          </div>
          
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
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map(customer => (
                <Card key={customer.id} className="overflow-hidden bg-white dark:bg-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold dark:text-white">{customer.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Customer #{customer.id}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone size={16} />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Mail size={16} />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin size={16} />
                        <span>{customer.address}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                        <div className="text-lg font-bold dark:text-white">{customer.totalOrders}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Orders</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                        <div className="text-lg font-bold dark:text-white">${customer.totalSpent}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Total Spent</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => handleEditClick(customer)}>
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="w-full gap-1 text-red-500 hover:text-red-600 hover:border-red-200" onClick={() => handleDeleteClick(customer)}>
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium dark:text-white">{customer.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">#{customer.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm dark:text-gray-300">
                            <Phone size={14} />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm dark:text-gray-300">
                            <Mail size={14} />
                            <span>{customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{customer.address}</TableCell>
                      <TableCell className="dark:text-gray-300">{customer.totalOrders}</TableCell>
                      <TableCell className="dark:text-gray-300">${customer.totalSpent}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(customer)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteClick(customer)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="dark:text-white">Full Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="dark:text-white">Phone Number</label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="dark:text-white">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="address" className="dark:text-white">Address</label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="dark:text-white">Full Name</label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-phone" className="dark:text-white">Phone Number</label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-email" className="dark:text-white">Email Address</label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-address" className="dark:text-white">Address</label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateCustomer}>Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="dark:text-white">Are you sure you want to delete {currentCustomer?.name}?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
