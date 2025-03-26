import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  AlertTriangle,
  Plus,
  Search,
  Calendar,
  Package,
  Clock,
  Edit,
  Trash2,
  BarChart4,
  ArrowUpDown,
  RefreshCw,
  Filter
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  getInventoryItems, 
  getInventoryCategories, 
  getLowStockItems, 
  getExpiringItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  recordInventoryTransaction
} from '@/services/InventoryService';
import { InventoryItem, InventoryTransaction, InventoryCategory } from '@/types/inventory';

interface InventoryFormData {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  purchasePrice: number;
  expiryDate?: string;
  supplier?: string;
}

interface TransactionFormData {
  inventoryItemId: string;
  transactionType: 'purchase' | 'usage' | 'adjustment' | 'waste';
  quantity: number;
  unitPrice?: number;
  notes?: string;
}

const InventoryTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState("items");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  const [isInventoryFormOpen, setIsInventoryFormOpen] = useState(false);
  const [inventoryFormData, setInventoryFormData] = useState<InventoryFormData>({
    name: '',
    category: '',
    quantity: 0,
    unit: 'units',
    minStockLevel: 10,
    purchasePrice: 0
  });
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [transactionFormData, setTransactionFormData] = useState<TransactionFormData>({
    inventoryItemId: '',
    transactionType: 'purchase',
    quantity: 0
  });
  
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  useEffect(() => {
    fetchInventoryData();
  }, []);
  
  const fetchInventoryData = async () => {
    try {
      setIsLoading(true);
      const [items, cats, lowStock, expiring] = await Promise.all([
        getInventoryItems(),
        getInventoryCategories(),
        getLowStockItems(),
        getExpiringItems(7) // 7 days threshold
      ]);
      
      setInventoryItems(items);
      setCategories(cats);
      setLowStockItems(lowStock);
      setExpiringItems(expiring);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Failed to load inventory data');
      setIsLoading(false);
    }
  };
  
  const handleAddItem = () => {
    setIsEditMode(false);
    setInventoryFormData({
      name: '',
      category: '',
      quantity: 0,
      unit: 'units',
      minStockLevel: 10,
      purchasePrice: 0
    });
    setIsInventoryFormOpen(true);
  };
  
  const handleEditItem = (item: InventoryItem) => {
    setIsEditMode(true);
    setInventoryFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minStockLevel: item.minStockLevel,
      purchasePrice: item.purchasePrice,
      expiryDate: item.expiryDate,
      supplier: item.supplier
    });
    setSelectedItem(item);
    setIsInventoryFormOpen(true);
  };
  
  const handleDeleteItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDeleteItem = async () => {
    if (!selectedItem) return;
    
    try {
      await deleteInventoryItem(selectedItem.id);
      // Refresh data
      fetchInventoryData();
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };
  
  const handleAddTransaction = (item: InventoryItem) => {
    setTransactionFormData({
      inventoryItemId: item.id,
      transactionType: 'purchase',
      quantity: 0
    });
    setSelectedItem(item);
    setIsTransactionFormOpen(true);
  };
  
  const handleInventoryFormSubmit = async () => {
    try {
      if (isEditMode && selectedItem) {
        await updateInventoryItem(selectedItem.id, inventoryFormData);
      } else {
        await createInventoryItem(inventoryFormData);
      }
      
      // Refresh data
      fetchInventoryData();
      setIsInventoryFormOpen(false);
      
      // If this was a new item with quantity > 0, ask if they want to record a purchase transaction
      if (!isEditMode && inventoryFormData.quantity > 0) {
        toast({
          title: "Record initial stock?",
          description: "Do you want to record this as a purchase transaction?",
          action: (
            <Button onClick={() => {
              // We don't have the new item ID here, so we'll need to fetch it
              getInventoryItems().then(items => {
                const newItem = items.find(i => i.name === inventoryFormData.name);
                if (newItem) {
                  setTransactionFormData({
                    inventoryItemId: newItem.id,
                    transactionType: 'purchase',
                    quantity: inventoryFormData.quantity,
                    unitPrice: inventoryFormData.purchasePrice
                  });
                  setSelectedItem(newItem);
                  setIsTransactionFormOpen(true);
                }
              });
            }} variant="outline">
              Yes, record purchase
            </Button>
          ),
        });
      }
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };
  
  const handleTransactionFormSubmit = async () => {
    try {
      await recordInventoryTransaction({
        ...transactionFormData,
        transactionDate: new Date().toISOString()
      });
      
      // Refresh data
      fetchInventoryData();
      setIsTransactionFormOpen(false);
    } catch (error) {
      console.error('Error recording transaction:', error);
    }
  };
  
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {lowStockItems.length > 0 && (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  <CardTitle className="text-lg text-red-600 dark:text-red-400">Low Stock Alert</CardTitle>
                </div>
                <CardDescription>
                  {lowStockItems.length} items are below minimum stock level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-y-auto">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-red-600 dark:text-red-400 font-bold">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>Min. level: {item.minStockLevel} {item.unit}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleAddTransaction(item)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Restock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {expiringItems.length > 0 && (
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-500" />
                  <CardTitle className="text-lg text-amber-600 dark:text-amber-400">Expiry Alert</CardTitle>
                </div>
                <CardDescription>
                  {expiringItems.length} items are expiring soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-y-auto">
                  {expiringItems.map(item => {
                    const daysUntilExpiry = item.expiryDate ? 
                      differenceInDays(new Date(item.expiryDate), new Date()) : 0;
                    
                    return (
                      <div key={item.id} className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.name}</span>
                          <span className={`font-bold ${
                            daysUntilExpiry <= 3 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                          }`}>
                            {daysUntilExpiry} days left
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>Expires: {item.expiryDate ? format(new Date(item.expiryDate), 'MMM dd, yyyy') : 'Unknown'}</span>
                          <span>Qty: {item.quantity} {item.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Main Inventory Management Section */}
      <Tabs defaultValue="items" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="items">All Items</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center">
            <Button
              onClick={handleAddItem} 
              className="mr-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
            <Button
              variant="outline"
              onClick={fetchInventoryData} 
              className="mr-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="items">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">No inventory items found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Click "Add Item" to start adding inventory items'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">In Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className={`text-right ${
                        item.quantity <= item.minStockLevel ? 'text-red-600 font-bold' : ''
                      }`}>
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.purchasePrice)}</TableCell>
                      <TableCell>
                        {item.expiryDate ? format(new Date(item.expiryDate), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell>{item.supplier || '-'}</TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleAddTransaction(item)}
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="low-stock">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">No low stock items</h3>
              <p className="text-muted-foreground">All inventory items are above their minimum stock levels</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">In Stock</TableHead>
                    <TableHead className="text-right">Min Level</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right text-red-600 font-bold">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.minStockLevel} {item.unit}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAddTransaction(item)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Restock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expiring">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : expiringItems.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-1">No expiring items</h3>
              <p className="text-muted-foreground">No inventory items are expiring within the next 7 days</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringItems.map((item) => {
                    const daysUntilExpiry = item.expiryDate ? 
                      differenceInDays(new Date(item.expiryDate), new Date()) : 0;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell>
                          {item.expiryDate ? format(new Date(item.expiryDate), 'MMM dd, yyyy') : '-'}
                        </TableCell>
                        <TableCell className={
                          daysUntilExpiry <= 3 ? 'text-red-600 font-bold' : 'text-amber-600 font-bold'
                        }>
                          {daysUntilExpiry} days
                        </TableCell>
                        <TableCell className="space-x-2 text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isInventoryFormOpen} onOpenChange={setIsInventoryFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update the details for this inventory item.' 
                : 'Fill in the details to add a new inventory item.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Item Name
                </label>
                <Input
                  id="name"
                  value={inventoryFormData.name}
                  onChange={(e) => setInventoryFormData({...inventoryFormData, name: e.target.value})}
                  placeholder="Enter item name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  value={inventoryFormData.category}
                  onChange={(e) => setInventoryFormData({...inventoryFormData, category: e.target.value})}
                  placeholder="e.g., Beverages, Dairy"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="supplier" className="text-sm font-medium">
                  Supplier (Optional)
                </label>
                <Input
                  id="supplier"
                  value={inventoryFormData.supplier || ''}
                  onChange={(e) => setInventoryFormData({...inventoryFormData, supplier: e.target.value})}
                  placeholder="Supplier name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={inventoryFormData.quantity}
                  onChange={(e) => setInventoryFormData({
                    ...inventoryFormData, 
                    quantity: parseFloat(e.target.value) || 0
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="unit" className="text-sm font-medium">
                  Unit
                </label>
                <Select
                  value={inventoryFormData.unit}
                  onValueChange={(value) => setInventoryFormData({...inventoryFormData, unit: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="l">Liters (l)</SelectItem>
                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="packages">Packages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="minStockLevel" className="text-sm font-medium">
                  Min Stock Level
                </label>
                <Input
                  id="minStockLevel"
                  type="number"
                  min="0"
                  value={inventoryFormData.minStockLevel}
                  onChange={(e) => setInventoryFormData({
                    ...inventoryFormData, 
                    minStockLevel: parseFloat(e.target.value) || 0
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="purchasePrice" className="text-sm font-medium">
                  Purchase Price
                </label>
                <Input
                  id="purchasePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={inventoryFormData.purchasePrice}
                  onChange={(e) => setInventoryFormData({
                    ...inventoryFormData, 
                    purchasePrice: parseFloat(e.target.value) || 0
                  })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="text-sm font-medium">
                  Expiry Date (Optional)
                </label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={inventoryFormData.expiryDate || ''}
                  onChange={(e) => setInventoryFormData({...inventoryFormData, expiryDate: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInventoryFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInventoryFormSubmit}>
              {isEditMode ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTransactionFormOpen} onOpenChange={setIsTransactionFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Inventory Transaction</DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <span>Record a transaction for <strong>{selectedItem.name}</strong>.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="transactionType" className="text-sm font-medium">
                Transaction Type
              </label>
              <Select
                value={transactionFormData.transactionType}
                onValueChange={(value: 'purchase' | 'usage' | 'adjustment' | 'waste') => 
                  setTransactionFormData({...transactionFormData, transactionType: value})
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase (Add to Stock)</SelectItem>
                  <SelectItem value="usage">Usage (Remove from Stock)</SelectItem>
                  <SelectItem value="waste">Waste/Loss (Remove from Stock)</SelectItem>
                  <SelectItem value="adjustment">Adjustment (Set New Value)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="quantity" className="text-sm font-medium">
                {transactionFormData.transactionType === 'adjustment' ? 'New Quantity' : 'Quantity'}
              </label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={transactionFormData.quantity}
                onChange={(e) => setTransactionFormData({
                  ...transactionFormData, 
                  quantity: parseFloat(e.target.value) || 0
                })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {selectedItem && `Current stock: ${selectedItem.quantity} ${selectedItem.unit}`}
              </p>
            </div>
            
            {transactionFormData.transactionType === 'purchase' && (
              <div>
                <label htmlFor="unitPrice" className="text-sm font-medium">
                  Unit Price
                </label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionFormData.unitPrice || selectedItem?.purchasePrice || 0}
                  onChange={(e) => setTransactionFormData({
                    ...transactionFormData, 
                    unitPrice: parseFloat(e.target.value) || undefined
                  })}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {transactionFormData.quantity && transactionFormData.unitPrice && (
                    `Total cost: ${formatCurrency(transactionFormData.quantity * transactionFormData.unitPrice)}`
                  )}
                </p>
              </div>
            )}
            
            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Input
                id="notes"
                value={transactionFormData.notes || ''}
                onChange={(e) => setTransactionFormData({...transactionFormData, notes: e.target.value})}
                placeholder="Add any additional notes"
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransactionFormSubmit}>
              Record Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItem && (
                <span>
                  Are you sure you want to delete <strong>{selectedItem.name}</strong>?
                  This action cannot be undone.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteItem}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InventoryTab;
