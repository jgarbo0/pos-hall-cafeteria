
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { StaffUser } from '@/types';
import { getStaffUsers, createStaffUser, updateStaffUser, deleteStaffUser } from '@/services/SupabaseService';

// Import components
import UserList from './users/UserList';
import AddUserForm from './users/AddUserForm';
import EditUserForm from './users/EditUserForm';
import DeleteUserDialog from './users/DeleteUserDialog';

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<StaffUser, 'id'>>({
    name: '',
    email: '',
    role: 'Staff'
  });
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getStaffUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.name.trim() || !newUser.email.trim()) {
        toast.error('Name and email are required');
        return;
      }

      await createStaffUser(newUser);
      setIsAddDialogOpen(false);
      setNewUser({ name: '', email: '', role: 'Staff' });
      await fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async () => {
    try {
      if (!currentUser || !currentUser.name.trim() || !currentUser.email.trim()) {
        toast.error('Name and email are required');
        return;
      }

      await updateStaffUser(currentUser.id, currentUser);
      setIsEditDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!currentUser) return;

      await deleteStaffUser(currentUser.id);
      setIsDeleteDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (user: StaffUser) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (user: StaffUser) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">User Management</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Manage staff accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserList 
          users={users} 
          onAddUser={handleOpenAddDialog}
          onEditUser={handleOpenEditDialog}
          onDeleteUser={handleOpenDeleteDialog}
        />
      </CardContent>

      {/* Dialogs */}
      <AddUserForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        handleAddUser={handleAddUser}
      />

      <EditUserForm
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        handleEditUser={handleEditUser}
      />

      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        currentUser={currentUser}
        handleDeleteUser={handleDeleteUser}
      />
    </Card>
  );
};

export default UserManagement;
