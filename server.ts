import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabaseClient: any = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}

// ... existing interface ...

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.get("/api/leaderboard", async (req, res) => {
    console.log("GET /api/leaderboard");
    try {
      const supabase = getSupabase();
      if (!supabase) {
        // Return empty leaderboard if Supabase is not configured
        return res.json([
          { nickname: "Example Pro", points: 1500, problemsSolved: 100, streak: 12, level: 10 },
          { nickname: "Math Wizard", points: 1200, problemsSolved: 80, streak: 8, level: 8 },
        ]);
      }
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;

      const mappedData = (data || []).map(row => ({
        nickname: row.nickname,
        points: row.points,
        problemsSolved: row.problems_solved,
        streak: row.streak,
        level: row.level
      }));

      res.json(mappedData);
    } catch (err) {
      console.error("Error fetching leaderboard from Supabase:", err);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.post("/api/scores", async (req, res) => {
    const { nickname, points, problemsSolved, streak, level } = req.body;
    if (!nickname || typeof points !== 'number') {
      return res.status(400).json({ error: "Invalid data" });
    }

    try {
      const supabase = getSupabase();
      if (!supabase) {
        console.warn("Supabase not configured. Score not saved.");
        return res.json({ success: true, message: "Demo mode: score not persisted." });
      }
      const { error } = await supabase
        .from('leaderboard')
        .upsert(
          { 
            nickname, 
            points, 
            problems_solved: problemsSolved || 0, 
            streak: streak || 0,
            level: level || 1,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'nickname' }
        );

      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      console.error("Error saving score to Supabase:", err);
      res.status(500).json({ error: "Failed to save score" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
