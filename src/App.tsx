import React from 'react';
import { getRandomProblem } from './MathService.ts';
import { ProblemCard } from './components/ProblemCard.tsx';
import { StatsCard } from './components/StatsCard.tsx';
import { MathProblem, UserStats } from './types.ts';
import { RefreshCw, Users, Settings, X, Volume2, VolumeX, Trash2, ChevronLeft, ChevronRight, Dices, Target, Trophy, Zap, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_STATS: UserStats = {
  nickname: '',
  points: 0,
  problemsSolved: 0,
  level: 1,
  streak: 0,
};

const ALL_GAMES = [
  { name: "Semaphore", origin: "Strategy", type: "3-in-a-row" },
  { name: "Tracks", origin: "Grid", type: "Movement" },
  { name: "Ouri", origin: "Mancala", type: "Seeds" },
  { name: "Product", origin: "Calculation", type: "Numbers" },
  { name: "Dominorio", origin: "Addition", type: "Puzzle" },
  { name: "Alquerque", origin: "Ancestral", type: "Classic" },
  { name: "Flume", origin: "Modern", type: "Colors" },
  { name: "Hex", origin: "Connection", type: "Topology" },
  { name: "Amazons", origin: "Territory", type: "Queens" },
  { name: "Advancement", origin: "Race", type: "Strategy" },
  { name: "Labyrinth", origin: "Wall", type: "Logic" },
  { name: "Cats and Rats", origin: "Asymmetric", type: "Logic" },
  { name: "Senet", origin: "Egypt", type: "Board" },
  { name: "Alcuin of York", origin: "Middle Ages", type: "Riddles" },
  { name: "Stomachion", origin: "Archimedes", type: "Geometry" },
  { name: "15 Puzzle", origin: "Sliding", type: "Classic" },
  { name: "Tangram", origin: "China", type: "Geometry" },
  { name: "Polyminoes", origin: "Tiles", type: "Shapes" },
  { name: "Magic Squares", origin: "Numbers", type: "Logic" },
  { name: "Sam Loyd", origin: "Puzzle", type: "Brain Teaser" },
  { name: "Einstein's Riddle", origin: "Logic", type: "Deduction" },
  { name: "Sokoban", origin: "Warehouse", type: "Boxes" },
  { name: "Arbusto", origin: "Fractals", type: "Growth" },
  { name: "Chaos Game", origin: "Fractals", type: "Chaos" },
  { name: "Sudoku", origin: "Japan", type: "Numbers" },
  { name: "Nim", origin: "Theory", type: "Logic" },
  { name: "Game of 24", origin: "Quick Math", type: "Numbers" },
  { name: "Tantrix", origin: "New Zealand", type: "Patterns" },
  { name: "Azumetria", origin: "Art", type: "Geometry" },
  { name: "Fibonacci (Flower)", origin: "Nature", type: "Patterns" }
];

interface LeaderboardEntry {
  nickname: string;
  points: number;
  problemsSolved: number;
  streak: number;
}

export default function App() {
  const [stats, setStats] = React.useState<UserStats>(() => {
    const saved = localStorage.getItem('math-quest-stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard' | 'random'>('random');
  const [gameMode, setGameMode] = React.useState<'mixed' | 'classic' | 'story' | 'puzzle'>('mixed');
  const [currentProblem, setCurrentProblem] = React.useState<MathProblem>(() => {
    const saved = localStorage.getItem('math-quest-stats');
    const level = saved ? JSON.parse(saved).level : 1;
    return getRandomProblem(undefined, level, 'mixed');
  });
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = React.useState(false);
  const [nicknameInput, setNicknameInput] = React.useState('');
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [isStatsReady, setIsStatsReady] = React.useState(false);
  const [showLanding, setShowLanding] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [libraryPage, setLibraryPage] = React.useState(0);

  const playSfx = React.useCallback((type: 'success' | 'error') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110.00, ctx.currentTime); // A2
        osc.frequency.exponentialRampToValueAtTime(55.00, ctx.currentTime + 0.4); 
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Audio Context not supported or blocked", e);
    }
  }, [soundEnabled]);

  const t = {
    settings: 'Settings',
    sound: 'Sound Effects',
    language: 'Language',
    reset: 'Reset Progress',
    danger: 'DANGEROUS ZONE',
    confirmReset: 'Are you sure you want to reset all your progress? This cannot be undone.',
    howToPlay: 'How to Play',
    guide: 'Guide',
    rules: 'Rules',
    newProblem: 'New Problem',
    mixed: 'Mixed',
    gameMode: 'Game Mode',
    difficultyLabel: 'Difficulty',
    modes: {
      mixed: 'All Mixed',
      classic: 'Classic',
      story: 'Stories',
      puzzle: 'Puzzles',
    },
    library: 'Logic & Games Library',
    randomGame: 'Random Game',
    explore: 'Explore more: Stomachion, Magic Squares, Game of 24, Nim, Hex, Amazon, Alquerque, and Sam Loyd\'s puzzles. Learn the history and logic behind math!',
    player: 'Player',
    editName: 'Edit Name',
  };

  React.useEffect(() => {
    setIsStatsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isStatsReady) return;
    localStorage.setItem('math-quest-stats', JSON.stringify(stats));
    
    // Update server score if nickname exists
    if (stats.nickname) {
      fetch('./api/scores', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nickname: stats.nickname,
          points: stats.points,
          problemsSolved: stats.problemsSolved,
          streak: stats.streak,
          level: stats.level
        })
      }).catch(err => console.warn("Could not sync score:", err));
    }
  }, [stats]);

  // Fetch leaderboard
  const fetchLeaderboard = React.useCallback(async () => {
    try {
      console.log("Fetching leaderboard...");
      // Using relative path with dot to ensure it stays on current origin in iframes
      const res = await fetch('./api/leaderboard', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data = await res.json();
      console.log("Leaderboard data received:", data);
      setLeaderboard(data);
    } catch (err) {
      console.error("Detailed fetch error:", err);
      // Fallback with more realistic mock data
      setLeaderboard([
        { nickname: "MathMaster", points: 2450, problemsSolved: 120, streak: 15, level: 25 },
        { nickname: "Euler_Fan", points: 1980, problemsSolved: 95, streak: 8, level: 20 },
        { nickname: "LogicNinja", points: 1500, problemsSolved: 75, streak: 12, level: 15 },
        { nickname: "Pythagoras", points: 1200, problemsSolved: 60, streak: 5, level: 12 }
      ]);
    }
  }, []);

  React.useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // sync every 30s
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const handleSetNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameInput.trim()) {
      setStats(prev => ({ ...prev, nickname: nicknameInput.trim() }));
    }
  };

  const handleNextProblem = (forcedDifficulty?: 'easy' | 'medium' | 'hard', forcedLevel?: number, isProgression = false, forcedMode?: 'mixed' | 'classic' | 'story' | 'puzzle', specificGame?: string) => {
    setIsRefreshing(true);
    const targetDiff = forcedDifficulty || (difficulty === 'random' ? undefined : difficulty);
    const targetLevel = forcedLevel || stats.level;
    const targetMode = forcedMode || gameMode;
    
    // Penalty for skipping a problem manually
    if (!isProgression && stats.streak > 0) {
      setStats(prev => ({ ...prev, streak: 0 }));
    }

    setTimeout(() => {
      setCurrentProblem(getRandomProblem(targetDiff, targetLevel, targetMode, specificGame));
      setIsRefreshing(false);
    }, 400);
  };

  const changeDifficulty = (newDiff: 'easy' | 'medium' | 'hard' | 'random') => {
    setDifficulty(newDiff);
    handleNextProblem(newDiff === 'random' ? undefined : newDiff);
  };

  const changeGameMode = (newMode: 'mixed' | 'classic' | 'story' | 'puzzle') => {
    setGameMode(newMode);
    handleNextProblem(undefined, undefined, false, newMode);
  };

  const handleSolve = (isCorrect: boolean) => {
    if (isCorrect) {
      playSfx('success');
      
      setStats(prev => {
        const newPoints = prev.points + currentProblem.points;
        const newSolved = prev.problemsSolved + 1;
        const newLevel = Math.floor(newSolved / 5) + 1;
        const newStreak = prev.streak + 1;
        
        if (newLevel > prev.level) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3000);
        }

        return {
          ...prev,
          points: newPoints,
          problemsSolved: newSolved,
          level: newLevel,
          streak: newStreak
        };
      });
      handleNextProblem(undefined, undefined, true);
    } else {
      playSfx('error');
      setStats(prev => ({ ...prev, streak: 0 }));
    }
  };

  const handleEditNickname = () => {
    setStats(prev => ({ ...prev, nickname: '' }));
  };

  const handleStartGame = () => {
    localStorage.setItem('math-quest-intro-seen', 'true');
    setShowLanding(false);
  };

  const resetGame = () => {
    localStorage.removeItem('math-quest-stats');
    localStorage.removeItem('math-quest-intro-seen');
    setStats(INITIAL_STATS);
    setDifficulty('random');
    setIsConfirmingReset(false);
    handleNextProblem(undefined, INITIAL_STATS.level);
    setShowLanding(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-10 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" />

      <div className="relative z-10">
        <AnimatePresence>
        {showLanding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed inset-0 z-[60] bg-math-bg overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto py-12 px-6 md:py-24 flex flex-col items-center">
              {/* Massive Logo Section */}
              <div className="flex flex-col items-center mb-16 text-center">
                <motion.div 
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-20 h-20 bg-[#2D3436] rounded-[24px] flex items-center justify-center mb-6 shadow-neo"
                >
                  <span className="text-4xl">🧠</span>
                </motion.div>
                <div className="flex flex-col leading-[0.8] font-black uppercase text-[#2D3436]">
                  <span className="text-7xl md:text-8xl tracking-tighter">Math</span>
                  <span className="text-7xl md:text-8xl tracking-tighter">Quest</span>
                  <div className="relative group mt-2">
                    <span className="text-7xl md:text-8xl tracking-tighter text-neo-purple">Logic</span>
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-neo-pink rounded-full transform -rotate-1" />
                  </div>
                </div>
              </div>

              {/* Dotted Feature Cards Grid */}
              <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
                {/* 01 Mission Script */}
                <div className="neo-card dotted-grid p-8 min-h-[220px]">
                  <div className="w-10 h-10 bg-neo-blue/20 rounded-xl flex items-center justify-center mb-6 border-2 border-neo-blue">
                    <Target className="text-neo-blue" size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black mb-1">Mission Script</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#2D3436]/60 mb-6">Operational Protocol</p>
                  
                  <div className="space-y-4">
                    {[
                      { id: '01', text: 'Analyze the logical pattern.' },
                      { id: '02', text: 'Input calculated solution.' },
                      { id: '03', text: 'Validate to gain experience.' }
                    ].map((step) => (
                      <div key={step.id} className="flex gap-3">
                        <span className="bg-[#2D3436] text-white text-[8px] font-black px-1.5 py-0.5 rounded h-fit mt-0.5">{step.id}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#2D3436] leading-tight">{step.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 02 Rank System */}
                <div className="neo-card dotted-grid p-8 min-h-[220px]">
                  <div className="w-10 h-10 bg-neo-pink/20 rounded-xl flex items-center justify-center mb-6 border-2 border-neo-pink">
                    <Trophy className="text-neo-pink" size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black mb-1">Rank System</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#2D3436]/60 mb-6">Tier Progression</p>
                  
                  <div className="space-y-4 font-mono">
                    <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-neo-blue">Easy Level.</span>
                      </div>
                      <span className="text-xs font-bold whitespace-nowrap">10-20 XP</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-2">
                       <div className="flex flex-col">
                        <span className="text-xs font-black text-neo-yellow">Medium Level.</span>
                      </div>
                      <span className="text-xs font-bold whitespace-nowrap">25-35 XP</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-2">
                       <div className="flex flex-col">
                        <span className="text-xs font-black text-neo-pink">Hard Level.</span>
                      </div>
                      <span className="text-xs font-bold whitespace-nowrap">45-60 XP</span>
                    </div>
                  </div>
                  <p className="mt-4 text-[7px] font-bold text-slate-400 italic leading-tight uppercase">
                    * Points converted to Global XP.
                  </p>
                </div>

                {/* 03 Streak System */}
                <div className="neo-card dotted-grid p-8 min-h-[160px]">
                  <div className="w-10 h-10 bg-neo-orange/20 rounded-xl flex items-center justify-center mb-6 border-2 border-neo-orange">
                    <Zap className="text-neo-orange" size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black mb-1">Streak System</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#2D3436]/60 mb-6">Combo Matrix</p>
                  
                  <p className="text-xs font-bold text-[#2D3436] mb-1">Correct answers increase your Streak. Higher streaks mean more prestige!</p>
                  
                  <p className="text-[8px] font-bold text-neo-pink uppercase tracking-tight">
                    <span className="font-black decoration-double underline">Warning:</span> One error resets it to zero!
                  </p>
                </div>

                {/* 04 Progression */}
                <div className="neo-card dotted-grid p-8 min-h-[160px]">
                  <div className="w-10 h-10 bg-neo-purple/20 rounded-xl flex items-center justify-center mb-6 border-2 border-neo-purple">
                    <RefreshCw className="text-neo-purple" size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-black mb-1">Progression</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#2D3436]/60 mb-6">Level Protocol</p>
                  
                  <p className="text-xs font-bold text-[#2D3436] mb-1">Every 5 problems you level up. New challenges like powers and logic are introduced.</p>
                </div>
              </div>

              {/* Start Button Block */}
              <motion.button
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
                className="w-full max-w-2xl bg-neo-purple py-8 rounded-[32px] border-[6px] border-[#2D3436] shadow-neo flex flex-col items-center justify-center group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">Start Adventure</span>
                  <Dices className="text-white group-hover:rotate-180 transition-transform duration-500" size={42} strokeWidth={3} />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Nickname Modal */}
        <AnimatePresence>
          {isStatsReady && !stats.nickname && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2D3436]/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-10 rounded-[40px] border-[6px] border-[#2D3436] shadow-neo max-w-md w-full"
              >
                <div className="w-20 h-20 bg-neo-pink rounded-3xl mb-8 flex items-center justify-center border-[4px] border-[#2D3436] mx-auto shadow-neo-sm">
                  <span className="text-white text-4xl font-black">?</span>
                </div>
                <h2 className="text-4xl font-black text-center mb-2 uppercase tracking-tight">Welcome, Hero!</h2>
                <p className="text-center font-bold text-[#2D3436]/60 mb-8 uppercase text-xs tracking-widest leading-none">Enter your nickname to save your rank</p>
                <form onSubmit={handleSetNickname} className="space-y-6">
                  <input
                    autoFocus
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="CHALLENGER_01"
                    maxLength={15}
                    className="w-full px-6 py-4 rounded-2xl border-[4px] border-[#2D3436] text-xl font-black uppercase placeholder:opacity-20 focus:outline-none focus:shadow-neo-sm transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!nicknameInput.trim()}
                    className="neo-btn bg-neo-purple text-white w-full py-5 text-xl font-black"
                  >
                    START TRAINING
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#2D3436]/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-8 rounded-[40px] border-[6px] border-[#2D3436] shadow-neo max-w-sm w-full relative"
              >
                <button 
                  onClick={() => setShowSettings(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-[#2D3436]" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-neo-yellow rounded-xl flex items-center justify-center border-[3px] border-[#2D3436]">
                    <span className="font-black text-[#2D3436]">#</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">{t.settings}</h2>
                </div>

                <div className="space-y-4">
                  {/* Sound Toggle */}
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 border-[3px] border-[#2D3436] rounded-2xl group transition-all hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      {soundEnabled ? <Volume2 className="text-neo-purple" /> : <VolumeX className="text-slate-400" />}
                      <span className="font-black uppercase text-sm tracking-tight">{t.sound}</span>
                    </div>
                    <div className={`w-12 h-6 rounded-full border-[3px] border-[#2D3436] relative transition-colors ${soundEnabled ? 'bg-neo-green' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 bottom-0.5 w-3.5 h-3.5 bg-white border-2 border-[#2D3436] rounded-full transition-all ${soundEnabled ? 'right-1' : 'left-1'}`} />
                    </div>
                  </button>

                  <div className="pt-4 mt-4 border-t-4 border-slate-100 italic text-[10px] uppercase font-bold text-slate-400">
                    {t.danger}
                  </div>

                  {/* Reset Progress */}
                  <button 
                    onClick={() => {
                      if (confirm(t.confirmReset)) {
                        setStats(INITIAL_STATS);
                        localStorage.removeItem('math-quest-stats');
                        setShowSettings(false);
                        window.location.reload();
                      }
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-rose-50 border-[3px] border-rose-500 rounded-2xl text-rose-500 hover:bg-rose-100 transition-all font-black uppercase text-sm tracking-tight"
                  >
                    <Trash2 size={20} />
                    {t.reset}
                  </button>
                </div>

                <p className="mt-8 text-center text-[10px] font-black uppercase text-slate-300 tracking-widest">
                  Math Quest Logic v1.2.0 • Build 2026
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up Notification */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-[#6C5CE7] text-white px-10 py-6 rounded-[24px] border-[6px] border-[#2D3436] shadow-[10px_10px_0px_#2D3436] flex flex-col items-center gap-2"
            >
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Level Up!</h2>
              <p className="font-bold text-lg">Now at Level {stats.level}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 py-12 px-10">
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="relative">
              <div className="absolute inset-0 bg-[#2D3436] rounded-[24px] translate-x-1.5 translate-y-1.5" />
              <div className="relative w-16 h-16 bg-[#2D3436] rounded-[24px] flex items-center justify-center border-[4px] border-[#2D3436] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
                <span className="text-3xl">🧠</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-[#2D3436] uppercase leading-none">Math Quest</h1>
              <p className="text-neo-purple font-black uppercase text-xs tracking-[0.3em] mt-2 italic underline underline-offset-4 decoration-2 decoration-neo-pink">Logic</p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6">
            <StatsCard stats={stats} />
            
            <div className="flex gap-3">
              <button 
                onClick={handleNextProblem}
                className="neo-btn bg-neo-green p-3 shadow-neo-sm"
                title={t.newProblem}
              >
                <RefreshCw size={20} strokeWidth={4} className={isRefreshing ? 'animate-spin' : ''} />
              </button>

              <button 
                onClick={() => setShowSettings(true)}
                className="neo-btn bg-white p-3 shadow-neo-sm"
                title={t.settings}
              >
                <Settings size={20} strokeWidth={4} className="text-[#2D3436]" />
              </button>
            </div>
          </div>
        </header>

        {/* Category & Difficulty Selectors */}
        <div className="flex flex-wrap gap-10 items-end">
          {/* Difficulty Selector */}
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">
              {t.difficultyLabel}
            </span>
            <nav className="flex flex-wrap gap-2">
              {(['random', 'easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => changeDifficulty(d)}
                  className={`neo-btn text-[10px] px-4 py-2 ${
                    difficulty === d 
                      ? 'bg-neo-purple text-white shadow-neo-sm -translate-y-1' 
                      : 'bg-white'
                  }`}
                >
                  {d === 'random' ? `🎲 ${t.mixed}` : d}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Area */}
        <div className="max-w-4xl mx-auto space-y-12">
          
          <main className="relative min-h-[450px]">
            <AnimatePresence mode="wait">
              {!isRefreshing && (
                <ProblemCard 
                  key={currentProblem.id} 
                  problem={currentProblem} 
                  onSolve={handleSolve} 
                />
              )}
            </AnimatePresence>
            
            {isRefreshing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCw className="animate-spin text-neo-purple" size={64} strokeWidth={4} />
              </div>
            )}
          </main>

          {/* Stats Summary in Main Area */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="neo-card p-6 bg-neo-purple text-white flex flex-col items-center justify-center">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Level</span>
              <span className="text-3xl font-black">{stats.level}</span>
            </div>
            <div className="neo-card p-6 bg-neo-yellow flex flex-col items-center justify-center">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Streak</span>
              <span className="text-3xl font-black">🔥 {stats.streak}</span>
            </div>
            <div className="neo-card p-6 bg-white flex flex-col items-center justify-center">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Solved</span>
              <span className="text-3xl font-black">{stats.problemsSolved}</span>
            </div>
            <div className="neo-card p-6 bg-neo-pink text-white flex flex-col items-center justify-center">
              <span className="text-xs font-black uppercase tracking-widest opacity-60">Points</span>
              <span className="text-3xl font-black">{stats.points}</span>
            </div>
          </div>

            <div className="space-y-3 pt-4 section-divider">
              {isConfirmingReset ? (
                <div className="flex gap-2">
                  <button 
                    onClick={resetGame}
                    className="flex-1 py-4 text-xs font-black bg-neo-pink text-white uppercase tracking-[0.1em] border-2 border-[#2D3436] rounded-xl shadow-neo-sm active:shadow-none translate-y-[-2px] active:translate-y-0"
                  >
                    Yes, Start Over
                  </button>
                  <button 
                    onClick={() => setIsConfirmingReset(false)}
                    className="flex-1 py-4 text-xs font-black bg-white text-[#2D3436] uppercase tracking-[0.1em] border-2 border-[#2D3436] rounded-xl"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsConfirmingReset(true)}
                  className="w-full py-4 text-xs font-black text-[#2D3436]/40 uppercase tracking-[0.2em] border-2 border-[#2D3436]/10 rounded-xl hover:border-neo-pink/30 hover:text-neo-pink transition-all"
                >
                  Reset Progress
                </button>
              )}
            </div>
        </div>

        <footer className="pt-20 text-center font-black uppercase text-xs tracking-[0.3em] text-[#2D3436]/40 pb-10">
          <p>Created by Rodrigo Marques</p>
        </footer>
      </div>
    </div>
  </div>
);
}
