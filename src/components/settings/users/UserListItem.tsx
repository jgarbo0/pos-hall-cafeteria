
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { StaffUser } from '@/types';

interface UserListItemProps {
  user: StaffUser;
  onEdit: (user: StaffUser) => void;
  onDelete: (user: StaffUser) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800">
      <div>
        <p className="font-medium dark:text-white">{user.name}</p>
        <p className="text-sm text-muted-foreground dark:text-gray-400">{user.email}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium dark:text-gray-300">{user.role}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onClick={() => onEdit(user)}
        >
          <Edit size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="dark:bg-gray-700 dark:text-red-400 dark:border-gray-600"
          onClick={() => onDelete(user)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserListItem;
