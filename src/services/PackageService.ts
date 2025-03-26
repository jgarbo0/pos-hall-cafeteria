
import { supabase } from '@/integrations/supabase/client';
import { ServicePackage } from '@/types';
import { toast } from 'sonner';

// Fetch all packages
export const getPackages = async (): Promise<ServicePackage[]> => {
  try {
    const { data, error } = await supabase
      .from('service_packages')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      items: pkg.items || []
    }));
  } catch (error) {
    console.error('Error fetching packages:', error);
    toast.error('Failed to fetch packages');
    throw error;
  }
};

// Create a new package
export const createPackage = async (packageData: Omit<ServicePackage, 'id'>): Promise<ServicePackage> => {
  try {
    const { data, error } = await supabase
      .from('service_packages')
      .insert({
        name: packageData.name,
        description: packageData.description,
        price: packageData.price,
        items: packageData.items
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success(`Package "${packageData.name}" created successfully`);
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      items: data.items || []
    };
  } catch (error) {
    console.error('Error creating package:', error);
    toast.error('Failed to create package');
    throw error;
  }
};

// Update an existing package
export const updatePackage = async (id: string, packageData: Partial<ServicePackage>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('service_packages')
      .update({
        name: packageData.name,
        description: packageData.description,
        price: packageData.price,
        items: packageData.items
      })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Package "${packageData.name}" updated successfully`);
  } catch (error) {
    console.error('Error updating package:', error);
    toast.error('Failed to update package');
    throw error;
  }
};

// Delete a package
export const deletePackage = async (id: string, name: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('service_packages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Package "${name}" deleted successfully`);
  } catch (error) {
    console.error('Error deleting package:', error);
    toast.error('Failed to delete package');
    throw error;
  }
};

export default {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
};
