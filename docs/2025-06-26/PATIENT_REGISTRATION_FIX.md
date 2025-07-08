# Patient Registration System Fix

## Issue Description
The patient registration system was not working because the `patients` table was missing from the database schema. When users registered, their profiles were created but no patient records were added, causing dashboard and patient management features to fail.

## Root Cause
- The `patients` table was never added to the original database setup
- Patient registration code was trying to insert into a non-existent table
- Database triggers for automatic patient creation were missing

## Fix Applied

### 1. Database Schema Updates
✅ **Added patients table to `supabase/setup.sql`**
✅ **Created migration script at `supabase/patients_table_migration.sql`**
✅ **Updated TypeScript types in `lib/supabase.ts`**
✅ **Updated database services to use proper types**

### 2. Database Schema - Patients Table
```sql
CREATE TABLE public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    date_of_birth DATE,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    target_weight DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 3. Row Level Security & Policies
```sql
-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own patient record" ON public.patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own patient record" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patient record" ON public.patients
    FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Automatic Patient Creation
Updated the user registration trigger to automatically create patient records:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    -- Create patient record
    INSERT INTO public.patients (user_id, first_name, last_name, email)
    VALUES (
        NEW.id,
        COALESCE(SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1), 'Patient'),
        NULLIF(SUBSTRING(NEW.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1), ''),
        NEW.email
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## How to Apply the Fix

### For New Databases
1. Run the updated `supabase/setup.sql` script
2. This will create all tables including the new patients table

### For Existing Databases
1. **Run the migration script:**
   ```sql
   -- Copy and paste the content of supabase/patients_table_migration.sql
   -- into your Supabase SQL editor and execute
   ```

2. **Verify the fix:**
   ```sql
   -- Check if patients table exists
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name = 'patients';
   
   -- Check if existing users now have patient records
   SELECT COUNT(*) FROM public.patients;
   ```

### For Application Code
✅ **No changes needed** - The application code already had the patient creation logic. It was just failing silently because the table didn't exist.

## Testing the Fix

### 1. New User Registration
- Register a new user
- Check that both profile and patient records are created
- Verify dashboard shows patient data

### 2. Existing Users
- Existing users should automatically get patient records on next login
- Or run the migration script to create them immediately

### 3. Database Verification
```sql
-- View all patients
SELECT p.first_name, p.last_name, p.email, p.created_at 
FROM public.patients p;

-- View patients with their profiles
SELECT 
    pr.full_name as profile_name,
    pt.first_name,
    pt.last_name,
    pt.email,
    pt.created_at as patient_created
FROM public.profiles pr
JOIN public.patients pt ON pr.id = pt.user_id;
```

## Expected Behavior After Fix

### New User Registration Flow
1. User signs up with email/password or Google OAuth
2. Database trigger automatically creates:
   - Profile record in `profiles` table
   - Patient record in `patients` table
3. Application context loads both profile and patient data
4. Dashboard and patient features work correctly

### Existing User Login
1. User signs in
2. Application checks for patient record
3. If missing, creates one automatically
4. All features work correctly

## Prevention
- Always run database schema updates in development first
- Test patient registration flow after any database changes
- Monitor application logs for database errors
- Keep TypeScript types synchronized with database schema

## Files Modified
- `supabase/setup.sql` - Added patients table and updated triggers
- `supabase/patients_table_migration.sql` - Created migration script
- `lib/supabase.ts` - Added patients table TypeScript types
- `services/database.ts` - Updated to use proper types
- `docs/2025-06-26/PATIENT_REGISTRATION_FIX.md` - This documentation

The patient registration system should now work correctly for both new and existing users.
