
-- This script prepares SQL commands to export your database
-- You can run this directly in the Supabase SQL Editor
-- Or use it as guidance for commands to run locally

-- Export full database (schema and data) to a SQL file
-- Note: This is meant to be run locally with pg_dump installed:
-- pg_dump -h [host] -p [port] -U [username] -d [database] -f database_export.sql

-- For selective table exports, you can run these queries:

-- 1. Export categories schema and data
SELECT '-- Categories Table Schema and Data' AS description,
       COUNT(*) AS row_count FROM categories;

COPY (
  SELECT 'CREATE TABLE IF NOT EXISTS public.categories (' ||
         'id UUID PRIMARY KEY DEFAULT gen_random_uuid(),' ||
         'name TEXT NOT NULL,' ||
         'created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL' ||
         ');'
) TO STDOUT;

COPY (
  SELECT 'INSERT INTO public.categories (id, name, created_at) VALUES ' ||
  string_agg(
    '(''' || id || ''', ''' || REPLACE(name, '''', '''''') || ''', ''' || created_at || ''')',
    ', '
  )
  FROM categories
) TO STDOUT;

-- 2. Export inventory_items schema and data
SELECT '-- Inventory Items Table Schema and Data' AS description,
       COUNT(*) AS row_count FROM inventory_items;

COPY (
  SELECT 'CREATE TABLE IF NOT EXISTS public.inventory_items (' ||
         'id UUID PRIMARY KEY DEFAULT gen_random_uuid(),' ||
         'name TEXT NOT NULL,' ||
         'category TEXT NOT NULL,' ||
         'quantity NUMERIC DEFAULT 0 NOT NULL,' ||
         'unit TEXT NOT NULL,' ||
         'min_stock_level NUMERIC DEFAULT 10,' ||
         'purchase_price NUMERIC NOT NULL,' ||
         'supplier TEXT,' ||
         'expiry_date DATE,' ||
         'created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,' ||
         'updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL' ||
         ');'
) TO STDOUT;

COPY (
  SELECT 'INSERT INTO public.inventory_items (id, name, category, quantity, unit, min_stock_level, purchase_price, supplier, expiry_date, created_at, updated_at) VALUES ' ||
  string_agg(
    '(''' || id || ''', ''' || 
    REPLACE(name, '''', '''''') || ''', ''' || 
    REPLACE(category, '''', '''''') || ''', ' || 
    quantity || ', ''' || 
    REPLACE(unit, '''', '''''') || ''', ' || 
    COALESCE(min_stock_level::text, 'NULL') || ', ' || 
    purchase_price || ', ' || 
    CASE WHEN supplier IS NULL THEN 'NULL' ELSE '''' || REPLACE(supplier, '''', '''''') || '''' END || ', ' ||
    CASE WHEN expiry_date IS NULL THEN 'NULL' ELSE '''' || expiry_date || '''' END || ', ''' ||
    created_at || ''', ''' ||
    updated_at || ''')',
    ', '
  )
  FROM inventory_items
) TO STDOUT;

-- 3. Export inventory_transactions schema and data
SELECT '-- Inventory Transactions Table Schema and Data' AS description,
       COUNT(*) AS row_count FROM inventory_transactions;

COPY (
  SELECT 'CREATE TABLE IF NOT EXISTS public.inventory_transactions (' ||
         'id UUID PRIMARY KEY DEFAULT gen_random_uuid(),' ||
         'inventory_item_id UUID NOT NULL REFERENCES public.inventory_items(id),' ||
         'transaction_type TEXT NOT NULL,' ||
         'quantity NUMERIC NOT NULL,' ||
         'unit_price NUMERIC,' ||
         'total_price NUMERIC,' ||
         'transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,' ||
         'notes TEXT,' ||
         'created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL' ||
         ');'
) TO STDOUT;

COPY (
  SELECT 'INSERT INTO public.inventory_transactions (id, inventory_item_id, transaction_type, quantity, unit_price, total_price, transaction_date, notes, created_at) VALUES ' ||
  string_agg(
    '(''' || id || ''', ''' || 
    inventory_item_id || ''', ''' || 
    REPLACE(transaction_type, '''', '''''') || ''', ' || 
    quantity || ', ' || 
    COALESCE(unit_price::text, 'NULL') || ', ' || 
    COALESCE(total_price::text, 'NULL') || ', ''' || 
    transaction_date || ''', ' ||
    CASE WHEN notes IS NULL THEN 'NULL' ELSE '''' || REPLACE(notes, '''', '''''') || '''' END || ', ''' ||
    created_at || ''')',
    ', '
  )
  FROM inventory_transactions
) TO STDOUT;

-- 4. Export timestamping trigger
COPY (
  SELECT 
    'CREATE OR REPLACE FUNCTION update_timestamp_column() ' ||
    'RETURNS TRIGGER AS $$ ' ||
    'BEGIN ' ||
    '  NEW.updated_at = now(); ' ||
    '  RETURN NEW; ' ||
    'END; ' ||
    '$$ LANGUAGE plpgsql;'
) TO STDOUT;

COPY (
  SELECT 
    'CREATE TRIGGER update_inventory_items_timestamp ' ||
    'BEFORE UPDATE ON inventory_items ' ||
    'FOR EACH ROW ' ||
    'EXECUTE FUNCTION update_timestamp_column();'
) TO STDOUT;

-- Instructions for Full Database Export via CLI
COPY (
  SELECT 
    '-- To export the full database from a terminal with pg_dump:' || E'\n' ||
    '-- 1. Install PostgreSQL client tools' || E'\n' ||
    '-- 2. Run this command (replace values in brackets):' || E'\n' ||
    '-- pg_dump -h hxjozccwmckdmqygvljq.supabase.co -p 5432 -U postgres -d postgres -f database_export.sql' || E'\n' ||
    '-- 3. Enter your database password when prompted' || E'\n' ||
    '-- 4. The export will be saved to database_export.sql'
) TO STDOUT;
