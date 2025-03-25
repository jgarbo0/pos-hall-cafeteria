
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Edit, Trash2, CheckCircle2, EyeIcon, FileEdit, FilePlus, FileX } from 'lucide-react';
import { Role, Permission } from '@/types/finance';

const PermissionsManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Administrator',
      description: 'Full access to all system features',
      permissions: ['1', '2', '3', '4', '5', '6', '7', '8'],
      isDefault: true
    },
    {
      id: '2',
      name: 'Manager',
      description: 'Access to manage inventory, staff, and orders',
      permissions: ['1', '2', '3', '4', '5', '6']
    },
    {
      id: '3',
      name: 'Staff',
      description: 'Access to handle orders and basic operations',
      permissions: ['1', '2', '3', '4']
    },
    {
      id: '4',
      name: 'Cashier',
      description: 'Access to handle payments and orders',
      permissions: ['1', '2']
    }
  ]);
  
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: '1',
      name: 'View Dashboard',
      description: 'Access to view dashboard statistics',
      module: 'dashboard',
      actions: ['view']
    },
    {
      id: '2',
      name: 'Manage Orders',
      description: 'Create and process customer orders',
      module: 'orders',
      actions: ['view', 'create', 'edit']
    },
    {
      id: '3',
      name: 'View Menu',
      description: 'Access to view menu items',
      module: 'menu',
      actions: ['view']
    },
    {
      id: '4',
      name: 'Manage Menu',
      description: 'Create and edit menu items',
      module: 'menu',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: '5',
      name: 'Manage Customers',
      description: 'Create and edit customer profiles',
      module: 'customers',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: '6',
      name: 'View Finance',
      description: 'View financial reports and transactions',
      module: 'finance',
      actions: ['view']
    },
    {
      id: '7',
      name: 'Manage Finance',
      description: 'Create and edit financial transactions',
      module: 'finance',
      actions: ['view', 'create', 'edit', 'delete']
    },
    {
      id: '8',
      name: 'Manage System Settings',
      description: 'Configure system settings and user permissions',
      module: 'settings',
      actions: ['view', 'create', 'edit', 'delete']
    }
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: []
  });

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditingPermissions(false);
  };

  const handleCreateNewRole = () => {
    setNewRole({
      name: '',
      description: '',
      permissions: []
    });
    setIsEditingRole(true);
  };

  const handleEditRole = () => {
    if (selectedRole) {
      setNewRole({
        name: selectedRole.name,
        description: selectedRole.description,
        permissions: selectedRole.permissions
      });
      setIsEditingRole(true);
    }
  };

  const handleDeleteRole = () => {
    if (selectedRole && !selectedRole.isDefault) {
      setRoles(roles.filter(role => role.id !== selectedRole.id));
      setSelectedRole(null);
    }
  };

  const handleSaveRole = () => {
    if (!newRole.name) return;

    if (selectedRole && isEditingRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === selectedRole.id 
          ? { ...role, name: newRole.name || '', description: newRole.description || '', permissions: newRole.permissions || [] }
          : role
      ));
      setSelectedRole(null);
    } else {
      // Create new role
      const newRoleEntry: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        description: newRole.description || '',
        permissions: newRole.permissions || []
      };
      setRoles([...roles, newRoleEntry]);
    }
    setIsEditingRole(false);
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRole) return;
    
    const updatedPermissions = selectedRole.permissions.includes(permissionId)
      ? selectedRole.permissions.filter(id => id !== permissionId)
      : [...selectedRole.permissions, permissionId];
    
    setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
    setRoles(roles.map(role => 
      role.id === selectedRole.id 
        ? { ...role, permissions: updatedPermissions }
        : role
    ));
  };

  const toggleEditPermissions = () => {
    setIsEditingPermissions(!isEditingPermissions);
  };

  const getPermissionIcon = (action: string) => {
    switch (action) {
      case 'view': return <EyeIcon className="h-4 w-4" />;
      case 'create': return <FilePlus className="h-4 w-4" />;
      case 'edit': return <FileEdit className="h-4 w-4" />;
      case 'delete': return <FileX className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissions Management
        </CardTitle>
        <CardDescription className="dark:text-gray-400">
          Configure roles and assign permissions to control access to system features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium dark:text-white">Roles</h3>
              <Button variant="outline" size="sm" onClick={handleCreateNewRole} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <Plus size={16} className="mr-1" />
                Add Role
              </Button>
            </div>
            <Separator className="dark:bg-gray-700" />
            
            <div className="space-y-2">
              {roles.map((role) => (
                <div 
                  key={role.id} 
                  className={`p-3 border rounded-md cursor-pointer transition-colors 
                    ${selectedRole?.id === role.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  onClick={() => handleSelectRole(role)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium dark:text-white flex items-center">
                        {role.name}
                        {role.isDefault && (
                          <Badge variant="outline" className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300">
                            Default
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">{role.description}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {role.permissions.length} permissions
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Role Details */}
          <div className="md:col-span-2 space-y-4">
            {selectedRole ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium dark:text-white">Role Details</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleEditPermissions} 
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      {isEditingPermissions ? (
                        <>
                          <CheckCircle2 size={16} className="mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          <Shield size={16} className="mr-1" />
                          Edit Permissions
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEditRole} 
                      className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    
                    {!selectedRole.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDeleteRole}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-red-400 hover:dark:bg-red-900/20"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold dark:text-white text-lg">{selectedRole.name}</h4>
                    <p className="text-muted-foreground dark:text-gray-400">{selectedRole.description}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-md font-medium dark:text-white mb-2">Permissions</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map(permission => (
                        <div 
                          key={permission.id} 
                          className={`p-3 border rounded-md transition-colors
                            ${selectedRole.permissions.includes(permission.id) 
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                              : 'dark:border-gray-700 dark:bg-gray-800'}`}
                        >
                          <div className="flex justify-between">
                            <h6 className="font-medium dark:text-white">{permission.name}</h6>
                            {isEditingPermissions && (
                              <Checkbox 
                                checked={selectedRole.permissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                              />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">{permission.description}</p>
                          <div className="mt-2 flex gap-1">
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              {permission.module}
                            </Badge>
                            {permission.actions.map(action => (
                              <Badge key={action} variant="outline" className="flex items-center gap-1">
                                {getPermissionIcon(action)}
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <Shield className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Select a role to view details</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center mt-2">
                  Select a role from the list or create a new one to configure permissions
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Edit Role Dialog */}
      <Dialog open={isEditingRole} onOpenChange={setIsEditingRole}>
        <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {selectedRole ? 'Update the role details and permissions.' : 'Configure a new role with specific permissions.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="role-name" className="dark:text-white">Role Name</Label>
              <Input 
                id="role-name" 
                value={newRole.name || ''} 
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role-description" className="dark:text-white">Description</Label>
              <Textarea 
                id="role-description" 
                value={newRole.description || ''} 
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="dark:text-white">Permissions</Label>
              <ScrollArea className="h-60 border rounded-md p-2 dark:border-gray-700 dark:bg-gray-700">
                {permissions.map(permission => (
                  <div key={permission.id} className="py-2 flex items-start gap-2">
                    <Checkbox 
                      id={`permission-${permission.id}`} 
                      checked={(newRole.permissions || []).includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewRole({
                            ...newRole, 
                            permissions: [...(newRole.permissions || []), permission.id]
                          });
                        } else {
                          setNewRole({
                            ...newRole, 
                            permissions: (newRole.permissions || []).filter(id => id !== permission.id)
                          });
                        }
                      }}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`permission-${permission.id}`}
                        className="font-medium text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
                      >
                        {permission.name}
                      </label>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingRole(false)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              {selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PermissionsManagement;
