
import React from 'react';
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

interface DeleteUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: StaffUser | null;
  handleDeleteUser: () => Promise<void>;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  onOpenChange,
  currentUser,
  handleDeleteUser
}) => {
  if (!currentUser) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Delete User</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 dark:text-gray-300">
            You are about to delete <span className="font-medium">{currentUser.name}</span> ({currentUser.email}).
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
