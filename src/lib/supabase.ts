import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key missing. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export interface LeaderboardEntry {
  id?: string;
  nickname: string;
  points: number;
  problems_solved: number;
  streak: number;
  level: number;
}

export async function getTopLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('points', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data;
}

export async function upsertScore(entry: LeaderboardEntry) {
  // Simple upsert logic by nickname for this demo
  // In a real app, use entry.id or auth.uid()
  const { data, error } = await supabase
    .from('leaderboard')
    .upsert(
      { 
        nickname: entry.nickname, 
        points: entry.points, 
        problems_solved: entry.problems_solved,
        streak: entry.streak,
        level: entry.level,
        updated_at: new Date().toISOString()
      }, 
      { onConflict: 'nickname' }
    )
    .select();

  if (error) {
    console.error('Error upserting score:', error);
  }
  return data;
}
