
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

const Settings = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your restaurant settings and preferences
            </p>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Restaurant Information</CardTitle>
                    <CardDescription>
                      Basic information about your restaurant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-name">Restaurant Name</Label>
                        <Input id="restaurant-name" defaultValue="Somali Delights" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="restaurant-phone">Phone Number</Label>
                        <Input id="restaurant-phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-address">Address</Label>
                      <Input id="restaurant-address" defaultValue="123 Main Street, Minneapolis, MN 55414" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-email">Email</Label>
                      <Input id="restaurant-email" type="email" defaultValue="contact@somalidelights.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-hours">Business Hours</Label>
                      <Input id="restaurant-hours" defaultValue="Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Settings</CardTitle>
                    <CardDescription>
                      Configure tax rates for your orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Sales Tax Rate (%)</Label>
                      <Input id="tax-rate" type="number" step="0.01" defaultValue="8.25" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-tax" defaultChecked />
                      <Label htmlFor="include-tax">Include tax in listed prices</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Receipt Settings</CardTitle>
                    <CardDescription>
                      Customize your receipt format and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="receipt-footer">Receipt Footer Text</Label>
                      <Input id="receipt-footer" defaultValue="Thank you for dining with us!" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="show-logo" defaultChecked />
                      <Label htmlFor="show-logo">Show logo on receipt</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-tip" defaultChecked />
                      <Label htmlFor="include-tip">Include tip suggestion</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage staff accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Staff Members</h3>
                      <Button>Add User</Button>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      {[
                        { name: 'Ahmed Mohamed', email: 'ahmed@example.com', role: 'Admin' },
                        { name: 'Fatima Hassan', email: 'fatima@example.com', role: 'Manager' },
                        { name: 'Omar Ali', email: 'omar@example.com', role: 'Staff' },
                      ].map((user, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border rounded-md">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{user.role}</span>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your subscription and payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                      <div className="p-4 bg-primary/10 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">Premium Plan</p>
                          <span className="bg-primary text-white px-2 py-1 rounded text-xs">Active</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Unlimited orders, full analytics, and premium support
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></span>
                          <Button variant="outline">Change Plan</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                      <div className="p-4 border rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-6 bg-blue-600 rounded mr-3"></div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                          </div>
                        </div>
                        <Button variant="ghost">Change</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Billing History</h3>
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-3 p-3 bg-muted font-medium">
                          <div>Date</div>
                          <div>Amount</div>
                          <div>Status</div>
                        </div>
                        {[
                          { date: 'May 1, 2023', amount: '$49.99', status: 'Paid' },
                          { date: 'Apr 1, 2023', amount: '$49.99', status: 'Paid' },
                          { date: 'Mar 1, 2023', amount: '$49.99', status: 'Paid' },
                        ].map((invoice, index) => (
                          <div key={index} className="grid grid-cols-3 p-3 border-t">
                            <div>{invoice.date}</div>
                            <div>{invoice.amount}</div>
                            <div className="text-green-600">{invoice.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Customize your notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Email Notifications</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'new-order', label: 'New Order Notifications' },
                          { id: 'low-stock', label: 'Low Stock Alerts' },
                          { id: 'daily-summary', label: 'Daily Sales Summary' },
                          { id: 'customer-feedback', label: 'Customer Feedback' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2">
                            <Label htmlFor={item.id} className="flex-1">{item.label}</Label>
                            <Switch id={item.id} defaultChecked={item.id !== 'customer-feedback'} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">App Notifications</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'app-new-order', label: 'New Order Alerts' },
                          { id: 'app-order-status', label: 'Order Status Changes' },
                          { id: 'app-inventory', label: 'Inventory Updates' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2">
                            <Label htmlFor={item.id} className="flex-1">{item.label}</Label>
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
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the appearance of your POS system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
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
                          className={`h-10 rounded-md cursor-pointer border-2 ${colorOption.color} ${colorOption.name === 'Blue' ? 'border-black' : 'border-transparent'}`}
                          title={colorOption.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compact-mode">Compact Mode</Label>
                      <Switch id="compact-mode" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reduces padding and margins for a more compact interface
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations">Interface Animations</Label>
                      <Switch id="animations" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable interface animations and transitions
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Appearance</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
