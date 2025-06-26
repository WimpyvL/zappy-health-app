-- Enhanced User Profile Schema Migration
-- This extends the basic profiles table with comprehensive user information

-- First, let's add the new columns to the existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
ADD COLUMN IF NOT EXISTS address JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS emergency_contact JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS medical_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
  "notifications": {
    "email": true,
    "sms": false,
    "push": true,
    "marketing": false
  },
  "privacy": {
    "share_data_for_research": false,
    "share_progress_with_providers": true
  },
  "communication": {
    "preferred_contact_method": "email",
    "timezone": "UTC"
  }
}',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'enterprise')),
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Update the profiles table type definition (for TypeScript generation)
COMMENT ON COLUMN public.profiles.phone_number IS 'User phone number for contact';
COMMENT ON COLUMN public.profiles.date_of_birth IS 'User date of birth';
COMMENT ON COLUMN public.profiles.gender IS 'User gender identity';
COMMENT ON COLUMN public.profiles.address IS 'User address information: {street, city, state, zip_code, country}';
COMMENT ON COLUMN public.profiles.emergency_contact IS 'Emergency contact information: {name, phone, relationship}';
COMMENT ON COLUMN public.profiles.medical_info IS 'Medical information: {allergies[], medications[], conditions[], height, weight, blood_type}';
COMMENT ON COLUMN public.profiles.preferences IS 'User preferences for notifications, privacy, and communication';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Current subscription plan';
COMMENT ON COLUMN public.profiles.subscription_expires_at IS 'Subscription expiration date';

-- Create index for subscription status queries
CREATE INDEX IF NOT EXISTS profiles_subscription_status_idx ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS profiles_subscription_expires_at_idx ON public.profiles(subscription_expires_at) WHERE subscription_expires_at IS NOT NULL;

-- Create index for date of birth (for age-based queries, but privacy-conscious)
CREATE INDEX IF NOT EXISTS profiles_birth_year_idx ON public.profiles(EXTRACT(YEAR FROM date_of_birth)) WHERE date_of_birth IS NOT NULL;

-- Update RLS policies to ensure users can only access their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to update user preferences safely
CREATE OR REPLACE FUNCTION public.update_user_preferences(
    user_id UUID,
    new_preferences JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Ensure user can only update their own preferences
    IF auth.uid() != user_id THEN
        RETURN FALSE;
    END IF;
    
    -- Update preferences by merging with existing data
    UPDATE public.profiles 
    SET 
        preferences = COALESCE(preferences, '{}'::jsonb) || new_preferences,
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$;

-- Function to safely update medical information
CREATE OR REPLACE FUNCTION public.update_medical_info(
    user_id UUID,
    new_medical_info JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Ensure user can only update their own medical info
    IF auth.uid() != user_id THEN
        RETURN FALSE;
    END IF;
    
    -- Update medical info by merging with existing data
    UPDATE public.profiles 
    SET 
        medical_info = COALESCE(medical_info, '{}'::jsonb) || new_medical_info,
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$;

-- Function to get user age without exposing exact birthdate
CREATE OR REPLACE FUNCTION public.get_user_age(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_age INTEGER;
BEGIN
    -- Ensure user can only get their own age or is a healthcare provider
    IF auth.uid() != user_id THEN
        RETURN NULL;
    END IF;
    
    SELECT EXTRACT(YEAR FROM AGE(date_of_birth))::INTEGER
    INTO user_age
    FROM public.profiles
    WHERE id = user_id AND date_of_birth IS NOT NULL;
    
    RETURN user_age;
END;
$$;

-- Create a view for healthcare providers to access relevant patient info (with proper permissions)
CREATE OR REPLACE VIEW public.patient_medical_summary AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone_number,
    public.get_user_age(p.id) as age,
    p.gender,
    p.medical_info,
    p.emergency_contact,
    p.created_at,
    p.updated_at
FROM public.profiles p
WHERE 
    -- Only show for healthcare providers who have active conversations with the patient
    EXISTS (
        SELECT 1 FROM public.conversations c 
        WHERE (c.patient_id = p.id AND c.doctor_id = auth.uid())
        OR (c.doctor_id = p.id AND c.patient_id = auth.uid())
    );

-- Add RLS to the view
ALTER VIEW public.patient_medical_summary SET (security_barrier = true);

-- Grant appropriate permissions
GRANT SELECT ON public.patient_medical_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_preferences(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_medical_info(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_age(UUID) TO authenticated;
