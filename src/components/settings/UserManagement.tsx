
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { StaffUser, getStaffUsers, createStaffUser, updateStaffUser, deleteStaffUser } from '@/services/SupabaseService';

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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium dark:text-white">Staff Members</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus size={16} />
                  Add User
                </Button>
              </DialogTrigger>
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
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Separator className="dark:bg-gray-700" />
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No users found. Add your first user to get started.</p>
            ) : (
              users.map((user, index) => (
                <div key={user.id || index} className="flex justify-between items-center p-4 border rounded-md dark:border-gray-700 dark:bg-gray-800">
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
                      onClick={() => {
                        setCurrentUser(user);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="dark:bg-gray-700 dark:text-red-400 dark:border-gray-600"
                      onClick={() => {
                        setCurrentUser(user);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit User</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update user details
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Delete User</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <p className="text-gray-600 dark:text-gray-300">
                You are about to delete <span className="font-medium">{currentUser.name}</span> ({currentUser.email}).
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
