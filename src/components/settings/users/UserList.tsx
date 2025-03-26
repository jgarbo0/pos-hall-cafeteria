
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { StaffUser } from '@/types';
import UserListItem from './UserListItem';

interface UserListProps {
  users: StaffUser[];
  onAddUser: () => void;
  onEditUser: (user: StaffUser) => void;
  onDeleteUser: (user: StaffUser) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  onAddUser, 
  onEditUser, 
  onDeleteUser 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium dark:text-white">Staff Members</h3>
        <Button className="flex items-center gap-2" onClick={onAddUser}>
          <UserPlus size={16} />
          Add User
        </Button>
      </div>
      <Separator className="dark:bg-gray-700" />
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No users found. Add your first user to get started.
          </p>
        ) : (
          users.map((user, index) => (
            <UserListItem 
              key={user.id || index} 
              user={user} 
              onEdit={onEditUser} 
              onDelete={onDeleteUser} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
