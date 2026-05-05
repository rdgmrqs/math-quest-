-- Create a table for the global leaderboard
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nickname TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for points to speed up leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON public.leaderboard (points DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow anyone to read, allow anyone to insert/update for this demo app)
-- In a real app, you would tie this to Auth users.
CREATE POLICY "Allow public read access" ON public.leaderboard
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.leaderboard
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.leaderboard
    FOR UPDATE USING (true);
