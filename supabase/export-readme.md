
# Supabase Database Export

This directory contains scripts and information to help you export your Supabase database.

## Option 1: Supabase CLI (Recommended)

The Supabase CLI is the best way to perform database exports:

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Login to your Supabase account:
   ```
   supabase login
   ```
3. Export the database:
   ```
   supabase db dump -p hxjozccwmckdmqygvljq --file=database_export.sql
   ```

## Option 2: Using pg_dump

If you have PostgreSQL client tools installed locally:

1. Use pg_dump to export the database:
   ```
   pg_dump -h hxjozccwmckdmqygvljq.supabase.co -p 5432 -U postgres -d postgres -f database_export.sql
   ```
2. You'll need to enter your database password when prompted

## Option 3: Supabase Dashboard

For a simple export:

1. Go to the Supabase dashboard: https://app.supabase.com/project/hxjozccwmckdmqygvljq
2. Navigate to the SQL Editor
3. Run the export script in `export-script.sql`
4. Copy the results to save them

## Database Tables

The main inventory-related tables in your database are:

1. `categories` - Stores inventory categories
2. `inventory_items` - Stores inventory item details (name, quantity, price, etc.)
3. `inventory_transactions` - Records all inventory transactions (purchases, usage, adjustments)

## Re-importing Data

To restore your data:

1. Create a new Supabase project if needed
2. Go to the SQL Editor
3. Paste and run the SQL commands from your export file
4. Verify that your data has been successfully imported

## Notes

- Make sure to regularly backup your database
- Consider automating backups for production environments
- The export scripts in this directory create SQL commands that can be run to recreate your tables and data
