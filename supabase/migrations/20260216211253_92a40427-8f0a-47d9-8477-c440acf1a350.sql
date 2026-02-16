
-- Add readiness_level and status columns to quiz_leads for the new assessment flow
ALTER TABLE public.quiz_leads 
ADD COLUMN IF NOT EXISTS readiness_level text,
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'unregistered';
