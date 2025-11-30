-- Create RSVP submissions table
CREATE TABLE public.rsvp_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  will_attend BOOLEAN NOT NULL,
  number_of_guests INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rsvp_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert RSVP (public form)
CREATE POLICY "Anyone can submit RSVP"
ON public.rsvp_submissions
FOR INSERT
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_rsvp_created_at ON public.rsvp_submissions(created_at DESC);