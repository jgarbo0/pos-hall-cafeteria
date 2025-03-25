
import React from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Switch
} from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Check, ShieldCheck, UserPlus, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const Settings = () => {
  const { t } = useLanguage();
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    }
  };

  const mockCategories = [
    { id: '1', name: 'Main Dishes', itemCount: 12 },
    { id: '2', name: 'Appetizers', itemCount: 8 },
    { id: '3', name: 'Desserts', itemCount: 6 },
    { id: '4', name: 'Beverages', itemCount: 10 },
    { id: '5', name: 'Specials', itemCount: 5 },
  ];

  const mockCustomers = [
    { id: 'c1', name: 'Ahmed Mohamed', email: 'ahmed@example.com', totalOrders: 24, totalSpent: 845.50 },
    { id: 'c2', name: 'Fatima Hussein', email: 'fatima@example.com', totalOrders: 18, totalSpent: 620.75 },
    { id: 'c3', name: 'Omar Jama', email: 'omar@example.com', totalOrders: 9, totalSpent: 312.25 },
    { id: 'c4', name: 'Amina Abdi', email: 'amina@example.com', totalOrders: 15, totalSpent: 490.00 },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Settings</h1>
            <p className="text-muted-foreground dark:text-gray-400">
              Manage your restaurant settings and preferences
            </p>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6 dark:bg-gray-800">
              <TabsTrigger value="general" className="dark:data-[state=active]:bg-gray-700 dark:text-white">General</TabsTrigger>
              <TabsTrigger value="users" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Users</TabsTrigger>
              <TabsTrigger value="roles" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="notifications" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Notifications</TabsTrigger>
              <TabsTrigger value="appearance" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Appearance</TabsTrigger>
              <TabsTrigger value="customers" className="dark:data-[state=active]:bg-gray-700 dark:text-white">Customers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Restaurant Information</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Basic information about your restaurant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-name" className="dark:text-gray-300">Restaurant Name</Label>
                        <Input id="restaurant-name" defaultValue="Doob Venue" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-phone" className="dark:text-gray-300">Phone Number</Label>
                        <Input id="restaurant-phone" defaultValue="+1 (555) 123-4567" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-address" className="dark:text-gray-300">Address</Label>
                      <Input id="restaurant-address" defaultValue="123 Main Street, Minneapolis, MN 55414" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-email" className="dark:text-gray-300">Email</Label>
                      <Input id="restaurant-email" type="email" defaultValue="contact@doobvenue.com" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-hours" className="dark:text-gray-300">Business Hours</Label>
                      <Input id="restaurant-hours" defaultValue="Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>

                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="dark:text-white">Categories</CardTitle>
                      <CardDescription className="dark:text-gray-400">
                        Manage menu categories
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex items-center gap-1">
                          <Plus size={16} />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">Add New Category</DialogTitle>
                          <DialogDescription className="dark:text-gray-400">
                            Create a new category for menu items
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="category-name" className="dark:text-gray-300">Category Name</Label>
                            <Input id="category-name" placeholder="e.g. Breakfast, Lunch, Dinner" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category-description" className="dark:text-gray-300">Description (Optional)</Label>
                            <Input id="category-description" placeholder="Brief description of this category" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save Category</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium dark:text-white">{category.name}</h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{category.itemCount} items</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 dark:text-gray-400">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Tax Settings</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Configure tax rates for your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate" className="dark:text-gray-300">Sales Tax Rate (%)</Label>
                      <Input id="tax-rate" type="number" step="0.01" defaultValue="8.25" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-tax" defaultChecked />
                      <Label htmlFor="include-tax" className="dark:text-gray-300">Include tax in listed prices</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-tax-receipt" defaultChecked />
                      <Label htmlFor="show-tax-receipt" className="dark:text-gray-300">Show tax details on receipt</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
                
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Receipt Settings</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Customize your receipt format and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="receipt-header" className="dark:text-gray-300">Receipt Header</Label>
                      <Input id="receipt-header" defaultValue="Doob Venue" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receipt-address" className="dark:text-gray-300">Receipt Address</Label>
                      <Input id="receipt-address" defaultValue="123 Main Street, Minneapolis, MN 55414" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receipt-footer" className="dark:text-gray-300">Receipt Footer Text</Label>
                      <Input id="receipt-footer" defaultValue="Thank you for dining with us!" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-logo" defaultChecked />
                      <Label htmlFor="show-logo" className="dark:text-gray-300">Show logo on receipt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-tip" defaultChecked />
                      <Label htmlFor="include-tip" className="dark:text-gray-300">Include tip suggestion</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">User Management</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Manage staff accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium dark:text-white">Staff Members</h3>
                      <Button className="flex items-center gap-2">
                        <UserPlus size={16} />
                        Add User
                      </Button>
                    </div>
                    <Separator className="dark:bg-gray-700" />
                    <div className="space-y-4">
                      {[
                        { name: 'Ahmed Mohamed', email: 'ahmed@example.com', role: 'Admin' },
                        { name: 'Fatima Hassan', email: 'fatima@example.com', role: 'Manager' },
                        { name: 'Omar Ali', email: 'omar@example.com', role: 'Staff' },
                      ].map((user, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800">
                          <div>
                            <p className="font-medium dark:text-white">{user.name}</p>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium dark:text-gray-300">{user.role}</span>
                            <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="roles">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Roles & Permissions</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Configure roles and assign permissions to users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium dark:text-white">System Roles</h3>
                        <Button className="flex items-center gap-2">
                          <Users size={16} />
                          Add Role
                        </Button>
                      </div>
                      <Separator className="dark:bg-gray-700" />
                      
                      {[
                        { id: 1, name: 'Admin', description: 'Full system access', users: 1 },
                        { id: 2, name: 'Manager', description: 'Can manage orders, menu and staff', users: 2 },
                        { id: 3, name: 'Staff', description: 'Can take orders and view assigned tasks', users: 5 },
                        { id: 4, name: 'Kitchen', description: 'Can view and fulfill orders', users: 3 },
                      ].map((role) => (
                        <div key={role.id} className="p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium dark:text-white">{role.name}</h4>
                              <p className="text-sm text-muted-foreground dark:text-gray-400">{role.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-100">{role.users} users</span>
                              <Button variant="outline" size="sm" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">Edit</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium dark:text-white">Permission Matrix</h3>
                      <Separator className="dark:bg-gray-700" />
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="text-left p-2 border-b dark:border-gray-700 dark:text-gray-300">Permission</th>
                              <th className="text-center p-2 border-b dark:border-gray-700 dark:text-gray-300">Admin</th>
                              <th className="text-center p-2 border-b dark:border-gray-700 dark:text-gray-300">Manager</th>
                              <th className="text-center p-2 border-b dark:border-gray-700 dark:text-gray-300">Staff</th>
                              <th className="text-center p-2 border-b dark:border-gray-700 dark:text-gray-300">Kitchen</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { name: 'View Dashboard', admin: true, manager: true, staff: false, kitchen: false },
                              { name: 'Manage Users', admin: true, manager: false, staff: false, kitchen: false },
                              { name: 'Edit Menu', admin: true, manager: true, staff: false, kitchen: false },
                              { name: 'Take Orders', admin: true, manager: true, staff: true, kitchen: false },
                              { name: 'Process Payments', admin: true, manager: true, staff: true, kitchen: false },
                              { name: 'View Orders', admin: true, manager: true, staff: true, kitchen: true },
                              { name: 'Change Settings', admin: true, manager: false, staff: false, kitchen: false },
                              { name: 'View Reports', admin: true, manager: true, staff: false, kitchen: false },
                            ].map((permission, index) => (
                              <tr key={index} className="border-b dark:border-gray-700">
                                <td className="p-2 text-left dark:text-white">{permission.name}</td>
                                <td className="p-2 text-center">{permission.admin && <Check className="mx-auto text-green-500" size={16} />}</td>
                                <td className="p-2 text-center">{permission.manager && <Check className="mx-auto text-green-500" size={16} />}</td>
                                <td className="p-2 text-center">{permission.staff && <Check className="mx-auto text-green-500" size={16} />}</td>
                                <td className="p-2 text-center">{permission.kitchen && <Check className="mx-auto text-green-500" size={16} />}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Update Permissions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Customize your notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium dark:text-white">Email Notifications</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'new-order', label: 'New Order Notifications' },
                          { id: 'low-stock', label: 'Low Stock Alerts' },
                          { id: 'daily-summary', label: 'Daily Sales Summary' },
                          { id: 'customer-feedback', label: 'Customer Feedback' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2">
                            <Label htmlFor={item.id} className="flex-1 dark:text-gray-300">{item.label}</Label>
                            <Switch id={item.id} defaultChecked={item.id !== 'customer-feedback'} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="dark:bg-gray-700" />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium dark:text-white">App Notifications</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'app-new-order', label: 'New Order Alerts' },
                          { id: 'app-order-status', label: 'Order Status Changes' },
                          { id: 'app-inventory', label: 'Inventory Updates' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2">
                            <Label htmlFor={item.id} className="flex-1 dark:text-gray-300">{item.label}</Label>
                            <Switch id={item.id} defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Appearance Settings</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Customize the appearance of your POS system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="dark:text-gray-300">Theme</Label>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language" className="dark:text-gray-300">Language</Label>
                    <div className="py-2">
                      <LanguageSelector />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary-color" className="dark:text-gray-300">Primary Color</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { color: 'bg-blue-500', name: 'Blue' },
                        { color: 'bg-green-500', name: 'Green' },
                        { color: 'bg-purple-500', name: 'Purple' },
                        { color: 'bg-red-500', name: 'Red' },
                        { color: 'bg-orange-500', name: 'Orange' },
                      ].map((colorOption) => (
                        <div 
                          key={colorOption.name}
                          className={`h-10 rounded-md cursor-pointer border-2 ${colorOption.color} ${colorOption.name === 'Blue' ? 'border-black dark:border-white' : 'border-transparent'}`}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size" className="dark:text-gray-300">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compact-mode" className="dark:text-gray-300">Compact Mode</Label>
                      <Switch id="compact-mode" />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Reduces padding and margins for a more compact interface
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations" className="dark:text-gray-300">Interface Animations</Label>
                      <Switch id="animations" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Enable or disable interface animations and transitions
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Appearance</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="customers">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
