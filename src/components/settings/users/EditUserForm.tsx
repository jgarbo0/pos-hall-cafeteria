
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { StaffUser } from '@/types';

interface EditUserFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: StaffUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<StaffUser | null>>;
  handleEditUser: () => Promise<void>;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  isOpen,
  onOpenChange,
  currentUser,
  setCurrentUser,
  handleEditUser
}) => {
  if (!currentUser) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Edit User</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Update user details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="dark:text-gray-300">Full Name</Label>
            <Input 
              id="edit-name" 
              value={currentUser.name}
              onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="dark:text-gray-300">Email</Label>
            <Input 
              id="edit-email" 
              type="email"
              value={currentUser.email}
              onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-role" className="dark:text-gray-300">Role</Label>
            <Select 
              value={currentUser.role} 
              onValueChange={(value) => setCurrentUser({...currentUser, role: value})}
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
          <Button onClick={handleEditUser}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
