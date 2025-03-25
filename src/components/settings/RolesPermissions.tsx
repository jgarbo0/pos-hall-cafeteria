
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, ShieldCheck, Users } from 'lucide-react';

const RolesPermissions: React.FC = () => {
  return (
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
  );
};

export default RolesPermissions;
