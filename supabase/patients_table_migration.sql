-- Migration: Add patients table and update user registration
-- Run this if you already have an existing Supabase database without the patients table
-- Date: 2025-06-26

-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
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

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for patients
CREATE POLICY "Users can view own patient record" ON public.patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own patient record" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patient record" ON public.patients
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update the user registration function to include patient creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS patients_user_id_idx ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS patients_email_idx ON public.patients(email);

-- Migrate existing users to have patient records
-- This will create patient records for all existing profiles that don't have one
INSERT INTO public.patients (user_id, first_name, last_name, email)
SELECT 
    p.id,
    COALESCE(SPLIT_PART(p.full_name, ' ', 1), 'Patient') as first_name,
    NULLIF(SUBSTRING(p.full_name FROM POSITION(' ' IN p.full_name) + 1), '') as last_name,
    p.email
FROM public.profiles p
LEFT JOIN public.patients pt ON pt.user_id = p.id
WHERE pt.user_id IS NULL;
