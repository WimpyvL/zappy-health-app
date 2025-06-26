-- Test data for messaging system
-- Run this after setting up the main messaging schema

-- Create some test user IDs (these would normally come from auth.users)
-- For testing purposes, we'll use placeholder UUIDs

-- Sample conversations (adjust user_ids as needed for your test environment)
INSERT INTO public.conversations (id, patient_id, doctor_id, subject, status) VALUES
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Weight loss consultation', 'active'),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'Hair loss treatment', 'active'),
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003', 'Anti-aging treatment options', 'active')
ON CONFLICT (id) DO NOTHING;

-- Sample messages
INSERT INTO public.messages (conversation_id, sender_id, content, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Hello! I reviewed your health assessment. Let''s discuss your weight loss goals.', NOW() - INTERVAL '2 hours'),
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000010', 'Thank you Dr. Chen! I''m looking to lose about 20 pounds safely.', NOW() - INTERVAL '1 hour 30 minutes'),
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'That''s a great goal. I''d recommend starting with our personalized nutrition plan and weekly check-ins.', NOW() - INTERVAL '1 hour'),
    
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'I''ve reviewed your photos. We can definitely help with hair restoration. Would you like to schedule a consultation?', NOW() - INTERVAL '45 minutes'),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000010', 'Yes, I''d love to learn more about the treatment options available.', NOW() - INTERVAL '30 minutes'),
    
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'Hello! I see you''re interested in our anti-aging treatments. What specific concerns would you like to address?', NOW() - INTERVAL '20 minutes'),
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000010', 'I''m mainly concerned about fine lines and skin texture. What would you recommend?', NOW() - INTERVAL '10 minutes')
ON CONFLICT DO NOTHING;

-- Update conversation timestamps
UPDATE public.conversations 
SET last_message_at = (
    SELECT MAX(created_at) FROM public.messages 
    WHERE messages.conversation_id = conversations.id
)
WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
