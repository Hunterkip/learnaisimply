
-- Table to store quiz leads and their responses
CREATE TABLE public.quiz_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  profession TEXT,
  comfort_level INTEGER,
  repetitive_task TEXT,
  current_ai_usage TEXT,
  values_certificate BOOLEAN,
  hours_to_save INTEGER,
  readiness_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (lead capture - no auth required)
CREATE POLICY "Anyone can submit quiz" ON public.quiz_leads
  FOR INSERT WITH CHECK (true);

-- Only admins can view all leads
CREATE POLICY "Admins can view quiz leads" ON public.quiz_leads
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
