import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for our settings
export interface SettingsValue {
  [key: string]: any;
}

export interface Settings {
  id: string;
  category: string;
  key: string;
  value: SettingsValue;
  created_at: string;
  updated_at: string;
}

// ===== Restaurant Info Settings =====

export interface RestaurantInfo {
  id?: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  business_hours?: string;
}

export const getRestaurantInfo = async (): Promise<RestaurantInfo | null> => {
  try {
    console.log('Fetching restaurant info');
    
    const { data, error } = await supabase
      .from('restaurant_info')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching restaurant info:', error);
      return null;
    }
    
    console.log('Retrieved restaurant info:', data);
    return data as RestaurantInfo;
  } catch (error) {
    console.error('Error in getRestaurantInfo:', error);
    return null;
  }
};

export const updateRestaurantInfo = async (info: RestaurantInfo): Promise<boolean> => {
  try {
    console.log('Updating restaurant info:', info);
    
    if (!info.id) {
      console.error('Error: Restaurant info ID is required for updates');
      toast.error('Failed to update restaurant information');
      return false;
    }
    
    const { error } = await supabase
      .from('restaurant_info')
      .update({
        name: info.name,
        phone: info.phone,
        address: info.address,
        email: info.email,
        business_hours: info.business_hours
      })
      .eq('id', info.id);
    
    if (error) {
      console.error('Error updating restaurant info:', error);
      toast.error('Failed to update restaurant information');
      return false;
    }
    
    console.log('Successfully updated restaurant info');
    toast.success('Restaurant information updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateRestaurantInfo:', error);
    toast.error('An error occurred while updating restaurant information');
    return false;
  }
};

// ===== Menu Categories =====

export interface MenuCategory {
  id?: string;
  name: string;
  description?: string;
  item_count?: number;
}

export const getMenuCategories = async (): Promise<MenuCategory[]> => {
  try {
    console.log('Fetching menu categories');
    
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching menu categories:', error);
      return [];
    }
    
    console.log('Retrieved menu categories:', data);
    return data as MenuCategory[];
  } catch (error) {
    console.error('Error in getMenuCategories:', error);
    return [];
  }
};

export const createMenuCategory = async (category: MenuCategory): Promise<string | null> => {
  try {
    console.log('Creating menu category:', category);
    
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({
        name: category.name,
        description: category.description,
        item_count: category.item_count || 0
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating menu category:', error);
      toast.error('Failed to create category');
      return null;
    }
    
    console.log('Successfully created menu category:', data);
    toast.success('Category created successfully');
    return data.id;
  } catch (error) {
    console.error('Error in createMenuCategory:', error);
    toast.error('An error occurred while creating category');
    return null;
  }
};

export const updateMenuCategory = async (category: MenuCategory): Promise<boolean> => {
  try {
    console.log('Updating menu category:', category);
    
    if (!category.id) {
      console.error('Error: Category ID is required for updates');
      toast.error('Failed to update category');
      return false;
    }
    
    const { error } = await supabase
      .from('menu_categories')
      .update({
        name: category.name,
        description: category.description
      })
      .eq('id', category.id);
    
    if (error) {
      console.error('Error updating menu category:', error);
      toast.error('Failed to update category');
      return false;
    }
    
    console.log('Successfully updated menu category');
    toast.success('Category updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateMenuCategory:', error);
    toast.error('An error occurred while updating category');
    return false;
  }
};

export const deleteMenuCategory = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting menu category:', id);
    
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting menu category:', error);
      toast.error('Failed to delete category');
      return false;
    }
    
    console.log('Successfully deleted menu category');
    toast.success('Category deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteMenuCategory:', error);
    toast.error('An error occurred while deleting category');
    return false;
  }
};

// ===== Tax Settings =====

export interface TaxSettings {
  id?: string;
  tax_rate: number;
  include_tax_in_price: boolean;
  show_tax_on_receipt: boolean;
}

export const getTaxSettings = async (): Promise<TaxSettings | null> => {
  try {
    console.log('Fetching tax settings');
    
    const { data, error } = await supabase
      .from('tax_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching tax settings:', error);
      return null;
    }
    
    console.log('Retrieved tax settings:', data);
    return data as TaxSettings;
  } catch (error) {
    console.error('Error in getTaxSettings:', error);
    return null;
  }
};

export const updateTaxSettings = async (settings: TaxSettings): Promise<boolean> => {
  try {
    console.log('Updating tax settings:', settings);
    
    if (!settings.id) {
      console.error('Error: Tax settings ID is required for updates');
      toast.error('Failed to update tax settings');
      return false;
    }
    
    const { error } = await supabase
      .from('tax_settings')
      .update({
        tax_rate: settings.tax_rate,
        include_tax_in_price: settings.include_tax_in_price,
        show_tax_on_receipt: settings.show_tax_on_receipt
      })
      .eq('id', settings.id);
    
    if (error) {
      console.error('Error updating tax settings:', error);
      toast.error('Failed to update tax settings');
      return false;
    }
    
    console.log('Successfully updated tax settings');
    toast.success('Tax settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateTaxSettings:', error);
    toast.error('An error occurred while updating tax settings');
    return false;
  }
};

// ===== Receipt Settings =====

export interface ReceiptSettings {
  id?: string;
  header?: string;
  address?: string;
  footer?: string;
  show_logo: boolean;
  include_tip: boolean;
}

export const getReceiptSettings = async (): Promise<ReceiptSettings | null> => {
  try {
    console.log('Fetching receipt settings');
    
    const { data, error } = await supabase
      .from('receipt_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching receipt settings:', error);
      return null;
    }
    
    console.log('Retrieved receipt settings:', data);
    return data as ReceiptSettings;
  } catch (error) {
    console.error('Error in getReceiptSettings:', error);
    return null;
  }
};

export const updateReceiptSettings = async (settings: ReceiptSettings): Promise<boolean> => {
  try {
    console.log('Updating receipt settings:', settings);
    
    if (!settings.id) {
      console.error('Error: Receipt settings ID is required for updates');
      toast.error('Failed to update receipt settings');
      return false;
    }
    
    const { error } = await supabase
      .from('receipt_settings')
      .update({
        header: settings.header,
        address: settings.address,
        footer: settings.footer,
        show_logo: settings.show_logo,
        include_tip: settings.include_tip
      })
      .eq('id', settings.id);
    
    if (error) {
      console.error('Error updating receipt settings:', error);
      toast.error('Failed to update receipt settings');
      return false;
    }
    
    console.log('Successfully updated receipt settings');
    toast.success('Receipt settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateReceiptSettings:', error);
    toast.error('An error occurred while updating receipt settings');
    return false;
  }
};

// ===== Appearance Settings =====

export interface AppearanceSettings {
  id?: string;
  theme: string;
  primary_color: string;
  font_size: string;
  compact_mode: boolean;
  animations: boolean;
}

export const getAppearanceSettings = async (): Promise<AppearanceSettings | null> => {
  try {
    console.log('Fetching appearance settings');
    
    const { data, error } = await supabase
      .from('appearance_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching appearance settings:', error);
      return null;
    }
    
    console.log('Retrieved appearance settings:', data);
    return data as AppearanceSettings;
  } catch (error) {
    console.error('Error in getAppearanceSettings:', error);
    return null;
  }
};

export const updateAppearanceSettings = async (settings: AppearanceSettings): Promise<boolean> => {
  try {
    console.log('Updating appearance settings:', settings);
    
    if (!settings.id) {
      console.error('Error: Appearance settings ID is required for updates');
      toast.error('Failed to update appearance settings');
      return false;
    }
    
    const { error } = await supabase
      .from('appearance_settings')
      .update({
        theme: settings.theme,
        primary_color: settings.primary_color,
        font_size: settings.font_size,
        compact_mode: settings.compact_mode,
        animations: settings.animations
      })
      .eq('id', settings.id);
    
    if (error) {
      console.error('Error updating appearance settings:', error);
      toast.error('Failed to update appearance settings');
      return false;
    }
    
    console.log('Successfully updated appearance settings');
    toast.success('Appearance settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateAppearanceSettings:', error);
    toast.error('An error occurred while updating appearance settings');
    return false;
  }
};

// ===== Notification Settings =====

export interface NotificationSettings {
  id?: string;
  email_new_order: boolean;
  email_low_stock: boolean;
  email_daily_summary: boolean;
  email_customer_feedback: boolean;
  app_new_order: boolean;
  app_order_status: boolean;
  app_inventory: boolean;
}

export const getNotificationSettings = async (): Promise<NotificationSettings | null> => {
  try {
    console.log('Fetching notification settings');
    
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching notification settings:', error);
      return null;
    }
    
    console.log('Retrieved notification settings:', data);
    return data as NotificationSettings;
  } catch (error) {
    console.error('Error in getNotificationSettings:', error);
    return null;
  }
};

export const updateNotificationSettings = async (settings: NotificationSettings): Promise<boolean> => {
  try {
    console.log('Updating notification settings:', settings);
    
    if (!settings.id) {
      console.error('Error: Notification settings ID is required for updates');
      toast.error('Failed to update notification settings');
      return false;
    }
    
    const { error } = await supabase
      .from('notification_settings')
      .update({
        email_new_order: settings.email_new_order,
        email_low_stock: settings.email_low_stock,
        email_daily_summary: settings.email_daily_summary,
        email_customer_feedback: settings.email_customer_feedback,
        app_new_order: settings.app_new_order,
        app_order_status: settings.app_order_status,
        app_inventory: settings.app_inventory
      })
      .eq('id', settings.id);
    
    if (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
      return false;
    }
    
    console.log('Successfully updated notification settings');
    toast.success('Notification settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateNotificationSettings:', error);
    toast.error('An error occurred while updating notification settings');
    return false;
  }
};

// ===== Roles & Permissions =====

export interface Role {
  id?: string;
  name: string;
  description?: string;
  is_default?: boolean;
}

export interface Permission {
  id?: string;
  name: string;
  description?: string;
  module: string;
  actions: string[];
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    console.log('Fetching roles');
    
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
    
    console.log('Retrieved roles:', data);
    return data as Role[];
  } catch (error) {
    console.error('Error in getRoles:', error);
    return [];
  }
};

export const getPermissions = async (): Promise<Permission[]> => {
  try {
    console.log('Fetching permissions');
    
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('module', 'name');
    
    if (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
    
    console.log('Retrieved permissions:', data);
    return data as Permission[];
  } catch (error) {
    console.error('Error in getPermissions:', error);
    return [];
  }
};

export const getRolePermissions = async (roleId: string): Promise<string[]> => {
  try {
    console.log(`Fetching permissions for role ${roleId}`);
    
    const { data, error } = await supabase
      .from('roles_permissions')
      .select('permission_id')
      .eq('role_id', roleId);
    
    if (error) {
      console.error('Error fetching role permissions:', error);
      return [];
    }
    
    console.log('Retrieved role permissions:', data);
    return data.map(item => item.permission_id);
  } catch (error) {
    console.error('Error in getRolePermissions:', error);
    return [];
  }
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<boolean> => {
  try {
    console.log(`Updating permissions for role ${roleId}:`, permissionIds);
    
    // First delete all existing permissions for this role
    const { error: deleteError } = await supabase
      .from('roles_permissions')
      .delete()
      .eq('role_id', roleId);
    
    if (deleteError) {
      console.error('Error deleting existing role permissions:', deleteError);
      toast.error('Failed to update role permissions');
      return false;
    }
    
    // Skip insert if no permissions are selected
    if (permissionIds.length === 0) {
      console.log('No permissions to insert');
      toast.success('Role permissions updated successfully');
      return true;
    }
    
    // Insert new permissions
    const permissionsToInsert = permissionIds.map(permissionId => ({
      role_id: roleId,
      permission_id: permissionId
    }));
    
    const { error: insertError } = await supabase
      .from('roles_permissions')
      .insert(permissionsToInsert);
    
    if (insertError) {
      console.error('Error inserting role permissions:', insertError);
      toast.error('Failed to update role permissions');
      return false;
    }
    
    console.log('Successfully updated role permissions');
    toast.success('Role permissions updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateRolePermissions:', error);
    toast.error('An error occurred while updating role permissions');
    return false;
  }
};

export const createRole = async (role: Role): Promise<string | null> => {
  try {
    console.log('Creating role:', role);
    
    const { data, error } = await supabase
      .from('roles')
      .insert({
        name: role.name,
        description: role.description,
        is_default: role.is_default || false
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating role:', error);
      toast.error('Failed to create role');
      return null;
    }
    
    console.log('Successfully created role:', data);
    toast.success('Role created successfully');
    return data.id;
  } catch (error) {
    console.error('Error in createRole:', error);
    toast.error('An error occurred while creating role');
    return null;
  }
};

export const updateRole = async (role: Role): Promise<boolean> => {
  try {
    console.log('Updating role:', role);
    
    if (!role.id) {
      console.error('Error: Role ID is required for updates');
      toast.error('Failed to update role');
      return false;
    }
    
    const { error } = await supabase
      .from('roles')
      .update({
        name: role.name,
        description: role.description,
        is_default: role.is_default
      })
      .eq('id', role.id);
    
    if (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
      return false;
    }
    
    console.log('Successfully updated role');
    toast.success('Role updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateRole:', error);
    toast.error('An error occurred while updating role');
    return false;
  }
};

export const deleteRole = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting role:', id);
    
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
      return false;
    }
    
    console.log('Successfully deleted role');
    toast.success('Role deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteRole:', error);
    toast.error('An error occurred while deleting role');
    return false;
  }
};

// Keep the original settings functions for backward compatibility
export const getSettings = async (category: string, key: string): Promise<SettingsValue | null> => {
  try {
    console.log(`Fetching settings for ${category}.${key}`);
    
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('category', category)
      .eq('key', key)
      .single();
    
    if (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
    
    console.log(`Retrieved settings for ${category}.${key}:`, data?.value);
    return data?.value as SettingsValue || null;
  } catch (error) {
    console.error('Error in getSettings:', error);
    return null;
  }
};

export const getAllSettingsByCategory = async (category: string): Promise<Record<string, SettingsValue> | null> => {
  try {
    console.log(`Fetching all settings for category: ${category}`);
    
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('category', category);
    
    if (error) {
      console.error('Error fetching settings by category:', error);
      return null;
    }
    
    // Convert array to object with key as the property name
    const settingsObject = data.reduce((acc, item) => {
      acc[item.key] = item.value as SettingsValue;
      return acc;
    }, {} as Record<string, SettingsValue>);
    
    console.log(`Retrieved settings for category ${category}:`, settingsObject);
    return settingsObject;
  } catch (error) {
    console.error('Error in getAllSettingsByCategory:', error);
    return null;
  }
};

export const updateSettings = async (category: string, key: string, value: SettingsValue): Promise<boolean> => {
  try {
    console.log(`Updating settings: ${category}.${key}`, value);
    
    const { error } = await supabase
      .from('settings')
      .update({ value })
      .eq('category', category)
      .eq('key', key);
    
    if (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      return false;
    }
    
    console.log(`Successfully updated settings: ${category}.${key}`);
    toast.success('Settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateSettings:', error);
    toast.error('An error occurred while updating settings');
    return false;
  }
};

export const createSettings = async (category: string, key: string, value: SettingsValue): Promise<boolean> => {
  try {
    console.log(`Creating settings: ${category}.${key}`, value);
    
    const { error } = await supabase
      .from('settings')
      .insert({
        category,
        key,
        value
      });
    
    if (error) {
      console.error('Error creating settings:', error);
      toast.error('Failed to create settings');
      return false;
    }
    
    console.log(`Successfully created settings: ${category}.${key}`);
    toast.success('Settings created successfully');
    return true;
  } catch (error) {
    console.error('Error in createSettings:', error);
    toast.error('An error occurred while creating settings');
    return false;
  }
};

export const createOrUpdateSettings = async (category: string, key: string, value: SettingsValue): Promise<boolean> => {
  try {
    console.log(`Checking if settings exist: ${category}.${key}`, value);
    
    // First check if the settings exist
    const { data, error: fetchError } = await supabase
      .from('settings')
      .select('id')
      .eq('category', category)
      .eq('key', key);
    
    if (fetchError) {
      console.error('Error checking if settings exist:', fetchError);
      toast.error('Failed to check if settings exist');
      return false;
    }
    
    console.log(`Settings exist check result for ${category}.${key}:`, data);
    
    // If settings exist, update them
    if (data && data.length > 0) {
      return await updateSettings(category, key, value);
    } 
    
    // Otherwise, create new settings
    return await createSettings(category, key, value);
  } catch (error) {
    console.error('Error in createOrUpdateSettings:', error);
    toast.error('An error occurred while saving settings');
    return false;
  }
};
