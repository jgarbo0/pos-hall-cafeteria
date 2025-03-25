
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserPlus } from 'lucide-react';

const UserManagement: React.FC = () => {
  return (
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
  );
};

export default UserManagement;
