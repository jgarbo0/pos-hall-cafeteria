
-- This script prepares SQL commands to export your entire Supabase database
-- You can run this directly in the Supabase SQL Editor
-- Or use it as guidance for commands to run locally

-- Export full database (schema and data) to a SQL file
-- Note: This is meant to be run locally with pg_dump installed:
-- pg_dump -h [host] -p [port] -U [username] -d [database] -f database_export.sql

-- Get a list of all tables in the public schema
SELECT 'Available tables in public schema:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- For each table in the database, generate export commands
-- This dynamic SQL approach will export all tables in the public schema

-- First, create a function to help with generating export SQL for any table
CREATE OR REPLACE FUNCTION generate_table_export(tablename text) 
RETURNS text AS $$
DECLARE
  columns_info text;
  insert_statement text;
BEGIN
  -- Get column list for the table
  SELECT string_agg(column_name, ', ') 
  INTO columns_info
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = tablename
  ORDER BY ordinal_position;
  
  -- Generate the INSERT statement
  insert_statement := 'SELECT ''INSERT INTO public.' || tablename || ' (' || columns_info || ') VALUES '' || string_agg(''('' || ';
  
  -- Build the value part of the statement
  SELECT string_agg(
    CASE 
      WHEN is_nullable = 'NO' AND data_type NOT IN ('integer', 'bigint', 'numeric', 'real', 'double precision', 'boolean') 
        THEN '||' || '''' || '''''' || ''' || REPLACE(COALESCE(' || column_name || '::text, ''''), '''''''', '''''''''''') || ''' || '''''' || ''' || '
      WHEN is_nullable = 'YES' AND data_type NOT IN ('integer', 'bigint', 'numeric', 'real', 'double precision', 'boolean')
        THEN '|| CASE WHEN ' || column_name || ' IS NULL THEN ''NULL'' ELSE '''' || '''''' || ''' || REPLACE(COALESCE(' || column_name || '::text, ''''), '''''''', '''''''''''') || ''' || '''''' || '''' END || '
      WHEN data_type IN ('integer', 'bigint', 'numeric', 'real', 'double precision') 
        THEN '|| COALESCE(' || column_name || '::text, ''NULL'') || '
      WHEN data_type = 'boolean'
        THEN '|| CASE WHEN ' || column_name || ' IS NULL THEN ''NULL'' ELSE ' || column_name || '::text END || '
      ELSE '|| ''NULL'' || '
    END, 
    ' || '', '' || '
  )
  INTO insert_statement
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = tablename
  ORDER BY ordinal_position;
  
  -- Complete the statement
  insert_statement := insert_statement || ' || '')'', '', '') FROM ' || tablename || ';';
  
  RETURN insert_statement;
END;
$$ LANGUAGE plpgsql;

-- Generate and execute the export SQL for each table
DO $$
DECLARE
  tables RECORD;
  export_sql text;
BEGIN
  FOR tables IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  LOOP
    -- Show table information
    RAISE NOTICE '-- Table: %', tables.table_name;
    
    -- Generate schema
    EXECUTE 'SELECT ''-- Schema for ' || tables.table_name || ' Table'' AS description;';
    
    -- Get column definitions
    EXECUTE 'SELECT ''CREATE TABLE IF NOT EXISTS public.' || tables.table_name || ' ('' || 
      string_agg(
        column_name || '' '' || 
        data_type || 
        CASE 
          WHEN character_maximum_length IS NOT NULL THEN ''('' || character_maximum_length || '')'' 
          ELSE '''' 
        END || 
        CASE 
          WHEN is_nullable = ''NO'' THEN '' NOT NULL'' 
          ELSE '''' 
        END ||
        CASE 
          WHEN column_default IS NOT NULL THEN '' DEFAULT '' || column_default 
          ELSE '''' 
        END,
        '', ''
      ) || 
      CASE 
        WHEN (SELECT constraint_name FROM information_schema.table_constraints 
              WHERE table_schema = ''public'' AND table_name = ''' || tables.table_name || ''' 
              AND constraint_type = ''PRIMARY KEY'' LIMIT 1) IS NOT NULL 
        THEN '', '' || 
             (SELECT ''PRIMARY KEY ('' || string_agg(column_name, '', '') || '')'' 
              FROM information_schema.key_column_usage 
              WHERE table_schema = ''public'' AND table_name = ''' || tables.table_name || ''' 
              AND constraint_name = (SELECT constraint_name FROM information_schema.table_constraints 
                                    WHERE table_schema = ''public'' AND table_name = ''' || tables.table_name || ''' 
                                    AND constraint_type = ''PRIMARY KEY'' LIMIT 1))
        ELSE '''' 
      END ||
      '');''
    FROM information_schema.columns 
    WHERE table_schema = ''public'' AND table_name = ''' || tables.table_name || '''
    ORDER BY ordinal_position;';
    
    -- Get data export
    EXECUTE 'SELECT ''-- Data for ' || tables.table_name || ' Table'' AS description;';
    
    -- Generate data INSERT statements
    export_sql := (SELECT generate_table_export(tables.table_name));
    EXECUTE export_sql;
    
    -- Add a separator
    EXECUTE 'SELECT ''-- End of ' || tables.table_name || ' export'' AS separator;';
  END LOOP;
END $$;

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_table_export(text);

-- Instructions for Full Database Export via CLI
SELECT 
  '-- To export the full database from a terminal with pg_dump:' || E'\n' ||
  '-- 1. Install PostgreSQL client tools' || E'\n' ||
  '-- 2. Run this command (replace values in brackets):' || E'\n' ||
  '-- pg_dump -h hxjozccwmckdmqygvljq.supabase.co -p 5432 -U postgres -d postgres -F c -f full_database_export.dump' || E'\n' ||
  '-- 3. Enter your database password when prompted' || E'\n' ||
  '-- 4. The export will be saved to full_database_export.dump'
AS export_instructions;
