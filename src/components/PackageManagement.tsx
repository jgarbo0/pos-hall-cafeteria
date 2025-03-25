
import React, { useState } from 'react';
import { ServicePackage } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PackageManagementProps {
  packages: ServicePackage[];
  onSave: (packages: ServicePackage[]) => void;
}

const PackageManagement: React.FC<PackageManagementProps> = ({ packages: initialPackages, onSave }) => {
  const [packages, setPackages] = useState<ServicePackage[]>(initialPackages);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [newPackage, setNewPackage] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<ServicePackage>>({
    name: '',
    description: '',
    price: 0,
    items: []
  });
  
  const [newItem, setNewItem] = useState<string>('');

  const handleStartNewPackage = () => {
    setFormData({
      id: `pkg${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      items: []
    });
    setNewPackage(true);
    setEditingPackage(null);
  };

  const handleEditPackage = (pkg: ServicePackage) => {
    setFormData(pkg);
    setEditingPackage(pkg);
    setNewPackage(false);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), newItem.trim()]
      }));
      setNewItem('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index)
    }));
  };

  const handleSavePackage = () => {
    if (!formData.name || formData.price === undefined) return;
    
    const updatedPackage: ServicePackage = {
      id: formData.id || `pkg${Date.now()}`,
      name: formData.name,
      description: formData.description || '',
      price: formData.price,
      items: formData.items || []
    };

    if (editingPackage) {
      setPackages(prev => prev.map(pkg => pkg.id === updatedPackage.id ? updatedPackage : pkg));
    } else {
      setPackages(prev => [...prev, updatedPackage]);
    }

    setEditingPackage(null);
    setNewPackage(false);
    setFormData({});
  };

  const handleCancelEdit = () => {
    setEditingPackage(null);
    setNewPackage(false);
    setFormData({});
  };

  const handleSaveAll = () => {
    onSave(packages);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Manage Packages</h2>
          <p className="text-sm text-muted-foreground">Create and edit service packages for hall bookings</p>
        </div>
        <Button onClick={handleStartNewPackage} disabled={newPackage || editingPackage !== null}>
          <Plus className="mr-2 h-4 w-4" /> Add Package
        </Button>
      </div>

      {(newPackage || editingPackage) && (
        <Card>
          <CardHeader>
            <CardTitle>{newPackage ? 'Create New Package' : 'Edit Package'}</CardTitle>
            <CardDescription>
              {newPackage ? 'Add a new service package' : `Editing ${editingPackage?.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleInputChange} 
                    placeholder="Package Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    value={formData.price || ''} 
                    onChange={handleInputChange} 
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description || ''} 
                  onChange={handleInputChange} 
                  placeholder="Describe what's included in this package"
                />
              </div>
              <div className="space-y-2">
                <Label>Items Included</Label>
                <div className="flex space-x-2">
                  <Input 
                    value={newItem} 
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add an item" 
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <Button onClick={handleAddItem} type="button" variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.items?.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleSavePackage}>Save Package</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-lg mb-2">${pkg.price.toFixed(2)}</div>
              <div className="space-y-2">
                <Label>Includes:</Label>
                <ul className="list-disc pl-5 space-y-1">
                  {pkg.items.map((item, idx) => (
                    <li key={idx} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the package and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeletePackage(pkg.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleEditPackage(pkg)}
                disabled={newPackage || editingPackage !== null}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveAll}>Save All Changes</Button>
      </div>
    </div>
  );
};

export default PackageManagement;
