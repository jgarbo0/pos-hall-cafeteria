
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, SquarePen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RestaurantTable, getRestaurantTables, createRestaurantTable, updateRestaurantTable, deleteRestaurantTable } from '@/services/TablesService';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const TablesManagement = () => {
  const { t } = useLanguage();
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTable, setCurrentTable] = useState<RestaurantTable | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    seats: 2,
    status: 'available' as 'available' | 'occupied' | 'reserved',
    location: ''
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setIsLoading(true);
    const data = await getRestaurantTables();
    setTables(data);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'seats') {
      const seatsValue = parseInt(value) || 0;
      setFormData(prev => ({ ...prev, [name]: seatsValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: value as 'available' | 'occupied' | 'reserved' 
    }));
  };

  const handleAddTable = async () => {
    if (!formData.name) {
      toast.error('Table name is required');
      return;
    }

    if (formData.seats <= 0) {
      toast.error('Number of seats must be greater than 0');
      return;
    }

    const newTable = await createRestaurantTable(formData);
    if (newTable) {
      setTables(prev => [...prev, newTable]);
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleEditTable = async () => {
    if (!currentTable) return;
    
    if (!formData.name) {
      toast.error('Table name is required');
      return;
    }

    if (formData.seats <= 0) {
      toast.error('Number of seats must be greater than 0');
      return;
    }

    const success = await updateRestaurantTable(currentTable.id, formData);
    if (success) {
      setTables(prev => prev.map(table => 
        table.id === currentTable.id 
          ? { ...table, ...formData } 
          : table
      ));
      resetForm();
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTable = async () => {
    if (!currentTable) return;
    
    const success = await deleteRestaurantTable(currentTable.id, currentTable.name);
    if (success) {
      setTables(prev => prev.filter(table => table.id !== currentTable.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (table: RestaurantTable) => {
    setCurrentTable(table);
    setFormData({
      name: table.name,
      seats: table.seats,
      status: table.status as 'available' | 'occupied' | 'reserved',
      location: table.location || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (table: RestaurantTable) => {
    setCurrentTable(table);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      seats: 2,
      status: 'available',
      location: ''
    });
    setCurrentTable(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-500">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-amber-500">Reserved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tables Management</CardTitle>
          <CardDescription>Manage your restaurant tables</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Table
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : tables.length === 0 ? (
          <div className="text-center py-8">
            <SquarePen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">No tables found. Click "Add Table" to create one.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>{table.seats}</TableCell>
                  <TableCell>{table.location || '-'}</TableCell>
                  <TableCell>{getStatusBadge(table.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(table)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500" onClick={() => openDeleteDialog(table)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Add Table Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>
                Create a new table for your restaurant
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Table Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Table 1"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="seats" className="text-right">
                  Seats
                </Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  min="1"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Main Area"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddTable}>
                Add Table
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Table Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Table</DialogTitle>
              <DialogDescription>
                Update the details of your table
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Table Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Table 1"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-seats" className="text-right">
                  Seats
                </Label>
                <Input
                  id="edit-seats"
                  name="seats"
                  type="number"
                  min="1"
                  value={formData.seats}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  name="location"
                  placeholder="Main Area"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditTable}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the table
                "{currentTable?.name}" and remove it from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTable} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default TablesManagement;
