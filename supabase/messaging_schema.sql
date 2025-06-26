-- Real-time Messaging System Database Schema
-- Add this to your existing Supabase database

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    patient_id UUID REFERENCES auth.users(id) NOT NULL,
    doctor_id UUID REFERENCES auth.users(id) NOT NULL,
    subject TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE
);

-- Create doctors table for healthcare providers
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    license_number TEXT,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    theme_color TEXT DEFAULT 'blue' CHECK (theme_color IN ('blue', 'purple', 'green', 'amber', 'red'))
);

-- Create message_read_status table for tracking read receipts
CREATE TABLE IF NOT EXISTS public.message_read_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(message_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_read_status ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view conversations they're part of" ON public.conversations
    FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Participants can update conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = conversation_id 
            AND (patient_id = auth.uid() OR doctor_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = conversation_id 
            AND (patient_id = auth.uid() OR doctor_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Create policies for doctors
CREATE POLICY "Everyone can view active doctors" ON public.doctors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Doctors can update their own profile" ON public.doctors
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for message read status
CREATE POLICY "Users can view read status for their messages" ON public.message_read_status
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.messages m
            JOIN public.conversations c ON m.conversation_id = c.id
            WHERE m.id = message_id 
            AND (c.patient_id = auth.uid() OR c.doctor_id = auth.uid())
        )
    );

CREATE POLICY "Users can update read status" ON public.message_read_status
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS conversations_patient_id_idx ON public.conversations(patient_id);
CREATE INDEX IF NOT EXISTS conversations_doctor_id_idx ON public.conversations(doctor_id);
CREATE INDEX IF NOT EXISTS conversations_updated_at_idx ON public.conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at DESC);

CREATE INDEX IF NOT EXISTS doctors_specialty_idx ON public.doctors(specialty);
CREATE INDEX IF NOT EXISTS doctors_is_active_idx ON public.doctors(is_active);

CREATE INDEX IF NOT EXISTS message_read_status_message_id_idx ON public.message_read_status(message_id);
CREATE INDEX IF NOT EXISTS message_read_status_user_id_idx ON public.message_read_status(user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_doctors_updated_at
    BEFORE UPDATE ON public.doctors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update conversation's last_message_at when new message is added
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation timestamp
CREATE TRIGGER update_conversation_on_new_message
    AFTER INSERT ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_timestamp();

-- Insert sample doctors
INSERT INTO public.doctors (user_id, full_name, specialty, theme_color, bio, avatar_url) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Dr. Sarah Chen', 'Weight Loss Specialist', 'blue', 'Specializing in personalized weight management and metabolic health.', NULL),
    ('00000000-0000-0000-0000-000000000002', 'Dr. Michael Torres', 'Hair Loss Specialist', 'purple', 'Expert in hair restoration and dermatological treatments.', NULL),
    ('00000000-0000-0000-0000-000000000003', 'Dr. Emily Rodriguez', 'Anti-Aging Specialist', 'green', 'Focused on advanced anti-aging treatments and skincare.', NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Enable realtime for messaging tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_read_status;
