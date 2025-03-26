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

// Fetch settings by category and key
export const getSettings = async (category: string, key: string): Promise<SettingsValue | null> => {
  try {
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
    
    return data?.value || null;
  } catch (error) {
    console.error('Error in getSettings:', error);
    return null;
  }
};

// Fetch all settings by category
export const getAllSettingsByCategory = async (category: string): Promise<Record<string, SettingsValue> | null> => {
  try {
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
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, SettingsValue>);
    
    return settingsObject;
  } catch (error) {
    console.error('Error in getAllSettingsByCategory:', error);
    return null;
  }
};

// Update settings
export const updateSettings = async (category: string, key: string, value: SettingsValue): Promise<boolean> => {
  try {
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
    
    toast.success('Settings updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateSettings:', error);
    toast.error('An error occurred while updating settings');
    return false;
  }
};

// Create new settings
export const createSettings = async (category: string, key: string, value: SettingsValue): Promise<boolean> => {
  try {
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
    
    toast.success('Settings created successfully');
    return true;
  } catch (error) {
    console.error('Error in createSettings:', error);
    toast.error('An error occurred while creating settings');
    return false;
  }
};

// Create or update settings - checks if settings exist and creates or updates accordingly
export const createOrUpdateSettings = async (category: string, key: string, value: SettingsValue): Promise<boolean> => {
  try {
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
