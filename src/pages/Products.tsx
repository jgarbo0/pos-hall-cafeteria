
import React, { useState } from 'react';
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
import { Plus, Edit, Trash } from 'lucide-react';
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Product Management</h1>
            
            <div className="flex items-center gap-4">
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
                      <label htmlFor="title">Product Name</label>
                      <Input 
                        id="title" 
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="price">Price</label>
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
                      <label htmlFor="available">Available Quantity</label>
                      <Input 
                        id="available" 
                        name="available"
                        type="number"
                        value={editFormData.available}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category">Category</label>
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
                      <label htmlFor="image">Image URL</label>
                      <Input 
                        id="image" 
                        name="image"
                        value={editFormData.image}
                        onChange={handleEditFormChange}
                      />
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
                    <p>Are you sure you want to delete {currentProduct?.title}?</p>
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
          
          <div className="bg-white rounded-lg shadow">
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
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.available}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default Products;
