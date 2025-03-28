
# Supabase Database Export

This directory contains scripts and information to help you export your complete Supabase database.

## Option 1: Supabase CLI (Recommended)

The Supabase CLI is the best way to perform database exports:

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Login to your Supabase account:
   ```
   supabase login
   ```
3. Export the database:
   ```
   supabase db dump -p hxjozccwmckdmqygvljq --file=full_database_export.sql
   ```

## Option 2: Using pg_dump

For a complete database backup using PostgreSQL client tools:

1. Use pg_dump to export the entire database:
   ```
   pg_dump -h hxjozccwmckdmqygvljq.supabase.co -p 5432 -U postgres -d postgres -F c -f full_database_export.dump
   ```
   
   The `-F c` flag creates a custom-format archive suitable for input into pg_restore.
   
2. You'll need to enter your database password when prompted

3. To restore from this dump file:
   ```
   pg_restore -h [host] -p [port] -U [username] -d [database] full_database_export.dump
   ```

## Option 3: Supabase Dashboard

For exporting table definitions and data via SQL:

1. Go to the Supabase dashboard: https://app.supabase.com/project/hxjozccwmckdmqygvljq
2. Navigate to the SQL Editor
3. Run the export script in `export-script.sql`
4. Copy the results to save them

## Database Tables

Your database contains the following primary tables:

1. `categories` - Inventory categories
2. `inventory_items` - Inventory item details 
3. `inventory_transactions` - Inventory transaction records
4. `customers` - Customer information
5. `hall_bookings` - Hall booking details
6. `menu_items` - Restaurant menu items
7. `menu_categories` - Restaurant menu categories
8. `orders` - Order information
9. `order_items` - Items in each order
10. `restaurant_tables` - Restaurant table management
11. `service_packages` - Service package details
12. `staff_users` - Staff user accounts
13. `transactions` - Financial transactions
14. Various settings tables (tax_settings, appearance_settings, etc.)

## Re-importing Data

To restore your data:

1. Create a new Supabase project if needed
2. Use one of these methods to restore:
   - For SQL output: Run the generated SQL commands in the SQL Editor
   - For pg_dump output: Use pg_restore as described above
   - For Supabase CLI: Use `supabase db restore`

## Notes

- For production environments, schedule regular backups
- The custom-format dump (-F c) is more flexible for restoration than plain SQL
- If you only need a subset of tables, modify the export script accordingly
- For large databases, consider exporting directly to a file instead of through the SQL Editor
