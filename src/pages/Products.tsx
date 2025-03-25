
import React, { useState, useRef } from 'react';
import SidebarNavigation from '@/components/SidebarNavigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { Plus, Edit, Trash, Image, List, Grid, Upload } from 'lucide-react';
import { menuItems, categories } from '@/data/mockData';
import { MenuItem } from '@/types';
import { toast } from "sonner";

const Products = () => {
  const [products, setProducts] = useState<MenuItem[]>(menuItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<MenuItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editFormData, setEditFormData] = useState({
    title: '',
    price: 0,
    available: 0,
    category: '',
    image: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleEditClick = (product: MenuItem) => {
    setCurrentProduct(product);
    setEditFormData({
      title: product.title,
      price: product.price,
      available: product.available,
      category: product.category,
      image: product.image
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (product: MenuItem) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'available' ? parseFloat(value) : value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setEditFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleUpdateProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.map(product => 
      product.id === currentProduct.id 
        ? { ...product, ...editFormData }
        : product
    );
    
    setProducts(updatedProducts);
    setIsEditDialogOpen(false);
    toast.success(`${editFormData.title} updated successfully`);
  };

  const handleDeleteProduct = () => {
    if (!currentProduct) return;
    
    const updatedProducts = products.filter(product => product.id !== currentProduct.id);
    setProducts(updatedProducts);
    setIsDeleteDialogOpen(false);
    toast.success(`${currentProduct.title} deleted successfully`);
  };

  const handleAddNewProduct = () => {
    const newProduct: MenuItem = {
      id: `${products.length + 1}`,
      title: editFormData.title,
      price: editFormData.price,
      available: editFormData.available,
      category: editFormData.category,
      image: editFormData.image || 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80'
    };
    
    setProducts([...products, newProduct]);
    setIsEditDialogOpen(false);
    toast.success(`${newProduct.title} added successfully`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      // For now, we'll create an object URL
      const imageUrl = URL.createObjectURL(file);
      setEditFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
      toast.success('Image uploaded successfully');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Product Management</h1>
            
            <div className="flex items-center gap-4">
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <Select 
                value={filterCategory} 
                onValueChange={setFilterCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setCurrentProduct(null);
                    setEditFormData({
                      title: '',
                      price: 0,
                      available: 0,
                      category: 'main',
                      image: ''
                    });
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="dark:text-white">Product Name</label>
                      <Input 
                        id="title" 
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="price" className="dark:text-white">Price</label>
                      <Input 
                        id="price" 
                        name="price"
                        type="number" 
                        step="0.01"
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="available" className="dark:text-white">Available Quantity</label>
                      <Input 
                        id="available" 
                        name="available"
                        type="number"
                        value={editFormData.available}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category" className="dark:text-white">Category</label>
                      <Select 
                        value={editFormData.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label className="dark:text-white">Product Image</label>
                      <div className="flex gap-2">
                        <Input 
                          id="image" 
                          name="image"
                          value={editFormData.image}
                          onChange={handleEditFormChange}
                          placeholder="Image URL"
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          type="button" 
                          onClick={triggerFileInput}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>
                      {editFormData.image && (
                        <div className="mt-2">
                          <img 
                            src={editFormData.image} 
                            alt="Product preview" 
                            className="h-32 w-32 object-cover rounded-md" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={currentProduct ? handleUpdateProduct : handleAddNewProduct}>
                      {currentProduct ? 'Update Product' : 'Save Product'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="dark:text-white">Are you sure you want to delete {currentProduct?.title}?</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteProduct}>
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden bg-white dark:bg-gray-800">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg dark:text-white">{product.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {categories.find(c => c.id === product.category)?.name || product.category}
                        </p>
                      </div>
                      <p className="text-blue-500 font-bold">${product.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Available: {product.available}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteClick(product)} className="text-red-500">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium dark:text-white">{product.title}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="dark:text-gray-300">{product.available}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteClick(product)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
