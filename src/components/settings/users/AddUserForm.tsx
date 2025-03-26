
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { StaffUser } from '@/types';

interface AddUserFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newUser: Omit<StaffUser, 'id'>;
  setNewUser: React.Dispatch<React.SetStateAction<Omit<StaffUser, 'id'>>>;
  handleAddUser: () => Promise<void>;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  isOpen,
  onOpenChange,
  newUser,
  setNewUser,
  handleAddUser
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New User</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Create a new staff account
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
            <Input 
              id="name" 
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="dark:text-gray-300">Role</Label>
            <Select 
              value={newUser.role} 
              onValueChange={(value) => setNewUser({...newUser, role: value})}
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
            Cancel
          </Button>
          <Button onClick={handleAddUser}>
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserForm;
