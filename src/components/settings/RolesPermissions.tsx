
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Check, ShieldCheck, UserPlus, Edit, Trash2, Loader2 } from 'lucide-react';
import { 
  Role,
  Permission,
  getRoles,
  getPermissions,
  getRolePermissions,
  updateRolePermissions,
  createRole,
  updateRole,
  deleteRole
} from '@/services/SettingsService';
import { toast } from 'sonner';

const RolesPermissions: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Role>({ name: '', description: '' });
  
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        setLoading(true);
        
        // Fetch roles
        const rolesData = await getRoles();
        if (rolesData && rolesData.length > 0) {
          setRoles(rolesData);
          setSelectedRole(rolesData[0]); // Select the first role by default
        }
        
        // Fetch permissions
        const permissionsData = await getPermissions();
        if (permissionsData) {
          setPermissions(permissionsData);
        }
      } catch (error) {
        console.error('Error fetching roles and permissions:', error);
        toast.error('Failed to load roles and permissions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRolesAndPermissions();
  }, []);
  
  useEffect(() => {
    const fetchRolePermissions = async () => {
      if (selectedRole && selectedRole.id) {
        try {
          const permissionsData = await getRolePermissions(selectedRole.id);
          setRolePermissions(permissionsData);
        } catch (error) {
          console.error('Error fetching role permissions:', error);
        }
      }
    };
    
    if (selectedRole) {
      fetchRolePermissions();
    }
  }, [selectedRole]);
  
  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };
  
  const handleTogglePermission = (permissionId: string) => {
    setRolePermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  const handleSavePermissions = async () => {
    if (selectedRole && selectedRole.id) {
      const success = await updateRolePermissions(selectedRole.id, rolePermissions);
      if (success) {
        toast.success('Role permissions updated successfully');
      }
    }
  };
  
  const handleAddRole = async () => {
    if (!newRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    
    const newId = await createRole(newRole);
    if (newId) {
      const createdRole = {
        ...newRole,
        id: newId
      };
      
      setRoles([...roles, createdRole]);
      setNewRole({ name: '', description: '' });
      setIsAddDialogOpen(false);
    }
  };
  
  const handleEditRole = async () => {
    if (!selectedRole || !selectedRole.id) return;
    
    if (!selectedRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }
    
    const success = await updateRole(selectedRole);
    if (success) {
      setRoles(roles.map(role => 
        role.id === selectedRole.id ? selectedRole : role
      ));
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteRole = async (id: string) => {
    const success = await deleteRole(id);
    if (success) {
      const updatedRoles = roles.filter(role => role.id !== id);
      setRoles(updatedRoles);
      
      if (selectedRole && selectedRole.id === id) {
        setSelectedRole(updatedRoles.length > 0 ? updatedRoles[0] : null);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500 dark:text-gray-400">Loading roles & permissions...</p>
        </div>
      </div>
    );
  }

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
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus size={16} />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Add New Role</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      Create a new role with specific permissions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="role-name" className="text-sm font-medium dark:text-gray-300">
                        Role Name
                      </label>
                      <Input
                        id="role-name"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                        placeholder="e.g. Manager, Cashier"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role-description" className="text-sm font-medium dark:text-gray-300">
                        Description
                      </label>
                      <Input
                        id="role-description"
                        value={newRole.description || ''}
                        onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                        placeholder="Brief description of this role"
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRole}>Add Role</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Separator className="dark:bg-gray-700" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div 
                  key={role.id} 
                  className={`p-4 border rounded-md cursor-pointer dark:border-gray-700 dark:bg-gray-800 ${
                    selectedRole && selectedRole.id === role.id ? 'border-blue-500 dark:border-blue-400' : ''
                  }`}
                  onClick={() => handleSelectRole(role)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium dark:text-white">{role.name}</h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 dark:text-gray-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRole(role);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (role.id) {
                            handleDeleteRole(role.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedRole && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium dark:text-white">
                  Permissions for {selectedRole.name}
                </h3>
                <Button onClick={handleSavePermissions}>Save Permissions</Button>
              </div>
              <Separator className="dark:bg-gray-700" />
              
              <div className="space-y-6">
                {/* Group permissions by module */}
                {Array.from(new Set(permissions.map(p => p.module))).map(module => (
                  <div key={module} className="space-y-3">
                    <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {module}
                    </h4>
                    {permissions
                      .filter(p => p.module === module)
                      .map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={permission.id} 
                            checked={permission.id ? rolePermissions.includes(permission.id) : false}
                            onCheckedChange={() => {
                              if (permission.id) {
                                handleTogglePermission(permission.id);
                              }
                            }}
                          />
                          <label 
                            htmlFor={permission.id} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
                          >
                            {permission.name}
                            {permission.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {permission.description}
                              </p>
                            )}
                          </label>
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Role</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update role details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-role-name" className="text-sm font-medium dark:text-gray-300">
                Role Name
              </label>
              <Input
                id="edit-role-name"
                value={selectedRole?.name || ''}
                onChange={(e) => setSelectedRole(prev => prev ? {...prev, name: e.target.value} : null)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-role-description" className="text-sm font-medium dark:text-gray-300">
                Description
              </label>
              <Input
                id="edit-role-description"
                value={selectedRole?.description || ''}
                onChange={(e) => setSelectedRole(prev => prev ? {...prev, description: e.target.value} : null)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RolesPermissions;
