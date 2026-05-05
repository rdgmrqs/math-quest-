import React from 'react';
import { getRandomProblem } from './MathService.ts';
import { ProblemCard } from './components/ProblemCard.tsx';
import { StatsCard } from './components/StatsCard.tsx';
import { MathProblem, UserStats } from './types.ts';
import { Calculator, RefreshCw, Star, Trophy, Users, Edit2, Gamepad2, Brain, Zap, Target, BookOpen, Settings, X, Volume2, VolumeX, Trash2, Languages, ChevronLeft, ChevronRight, Dices } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_STATS: UserStats = {
  nickname: '',
  points: 0,
  problemsSolved: 0,
  level: 1,
  streak: 0,
};

const ALL_GAMES = [
  { name: "Senet", origin: { en: "Ancient Egypt", pt: "Egito Antigo" }, type: { en: "Board Game", pt: "Jogo de Tabuleiro" } },
  { name: "Alcuíno de Iorque", origin: { en: "Middle Ages", pt: "Idade Média" }, type: { en: "Logic", pt: "Lógica" } },
  { name: "Stomachion", origin: { en: "Archimedes", pt: "Arquimedes" }, type: { en: "Geometry", pt: "Geometria" } },
  { name: "15 Puzzle", origin: { en: "Sam Loyd", pt: "Sam Loyd" }, type: { en: "Combinatorics", pt: "Combinatória" } },
  { name: "Tangram", origin: { en: "China", pt: "China" }, type: { en: "Geometry", pt: "Geometria" } },
  { name: "Poliminós", origin: { en: "Geometry", pt: "Geometria" }, type: { en: "Tiles", pt: "Peças" } },
  { name: "Quadrados Mágicos", origin: { en: "Mathematics", pt: "Matemática" }, type: { en: "History", pt: "História" } },
  { name: "Sam Loyd Puzzles", origin: { en: "USA", pt: "EUA" }, type: { en: "Brain Teasers", pt: "Desafios" } },
  { name: "Enigma de Einstein", origin: { en: "Logic", pt: "Lógica" }, type: { en: "Deduction", pt: "Dedução" } },
  { name: "Sokoban", origin: { en: "Japan", pt: "Japão" }, type: { en: "Logic", pt: "Lógica" } },
  { name: "Arbusto", origin: { en: "Chaos Theory", pt: "Teoria do Caos" }, type: { en: "Fractals", pt: "Fractais" } },
  { name: "Jogo do Caos", origin: { en: "Dynamics", pt: "Dinâmica" }, type: { en: "Math", pt: "Matemática" } },
  { name: "3 em linha", origin: { en: "Universal", pt: "Universal" }, type: { en: "Classic", pt: "Clássico" } },
  { name: "Jogos Poliédricos", origin: { en: "Geometry", pt: "Geometria" }, type: { en: "3D Shapes", pt: "Sólidos" } },
  { name: "Pontos e quadrados", origin: { en: "Strategy", pt: "Estratégia" }, type: { en: "Dots & Boxes", pt: "Pontos e Caixas" } },
  { name: "Sudoku", origin: { en: "Logic", pt: "Lógica" }, type: { en: "Numbers", pt: "Números" } },
  { name: "Nim", origin: { en: "Game Theory", pt: "Teoria de Jogos" }, type: { en: "Classical", pt: "Clássico" } },
  { name: "Penim", origin: { en: "Strategy", pt: "Estratégia" }, type: { en: "Nim Variant", pt: "Variante do Nim" } },
  { name: "Trinca Espinhas", origin: { en: "Traditional", pt: "Tradicional" }, type: { en: "Logic", pt: "Lógica" } },
  { name: "Jogo do 24", origin: { en: "Quick Math", pt: "Cálculo Rápido" }, type: { en: "Numbers", pt: "Números" } },
  { name: "Solitário", origin: { en: "France", pt: "França" }, type: { en: "Solo Strategy", pt: "Estratégia Solo" } },
  { name: "Rã saltitante", origin: { en: "Puzzle", pt: "Puzzle" }, type: { en: "Logic", pt: "Lógica" } },
  { name: "Jogo da Vida", origin: { en: "Conway", pt: "Conway" }, type: { en: "Simulation", pt: "Simulação" } },
  { name: "Jogo do Galo", origin: { en: "Traditional", pt: "Tradicional" }, type: { en: "Strategy", pt: "Estratégia" } },
  { name: "Mancala", origin: { en: "Ancient World", pt: "Mundo Antigo" }, type: { en: "Strategy", pt: "Estratégia" } },
  { name: "Hex", origin: { en: "Game Theory", pt: "Teoria de Jogos" }, type: { en: "Connection", pt: "Conexão" } },
  { name: "Peões", origin: { en: "Tactics", pt: "Tática" }, type: { en: "Board Game", pt: "Jogo de Tabuleiro" } },
  { name: "Amazonas", origin: { en: "Territory", pt: "Território" }, type: { en: "Strategy", pt: "Estratégia" } },
  { name: "Damas", origin: { en: "Universal", pt: "Universal" }, type: { en: "Classic", pt: "Clássico" } },
  { name: "Xadrez", origin: { en: "Pérsia", pt: "Pérsia" }, type: { en: "Grandmaster", pt: "Grão-Mestre" } },
  { name: "Alquerque", origin: { en: "Ancient East", pt: "Oriente Antigo" }, type: { en: "Ancestral", pt: "Ancestral" } },
  { name: "Rastros", origin: { en: "Strategy", pt: "Estratégia" }, type: { en: "Modern", pt: "Moderno" } },
  { name: "Gatos e Cães", origin: { en: "Abstract", pt: "Abstrato" }, type: { en: "Strategy", pt: "Estratégia" } },
  { name: "Yoté", origin: { en: "África", pt: "África" }, type: { en: "Traditional", pt: "Tradicional" } },
  { name: "Avanço", origin: { en: "Race", pt: "Corrida" }, type: { en: "Strategy", pt: "Estratégia" } },
  { name: "Produto", origin: { en: "Product Game", pt: "Jogo do Produto" }, type: { en: "Math", pt: "Matemática" } },
  { name: "Pentalfa", origin: { en: "Star Logic", pt: "Lógica Estelar" }, type: { en: "Puzzle", pt: "Quebra-cabeça" } },
  { name: "Semáforo", origin: { en: "Grid Logic", pt: "Lógica de Grelha" }, type: { en: "Concentric", pt: "Concêntrico" } },
  { name: "Sesqui", origin: { en: "Abstract", pt: "Abstrato" }, type: { en: "Strategy", pt: "Estratégia" } },
  { name: "Flume", origin: { en: "Flow", pt: "Fluxo" }, type: { en: "Modern", pt: "Moderno" } },
  { name: "Hexiamante", origin: { en: "Geometry", pt: "Geometria" }, type: { en: "Patterns", pt: "Padrões" } },
  { name: "Meta", origin: { en: "Deduction", pt: "Dedução" }, type: { en: "Logic", pt: "Lógica" } },
  { name: "Tantrix", origin: { en: "Patterns", pt: "Padrões" }, type: { en: "Paths", pt: "Caminhos" } },
  { name: "Azumetria", origin: { en: "Modern", pt: "Moderno" }, type: { en: "Geometry", pt: "Geometria" } }
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

  const [language, setLanguage] = React.useState<'en' | 'pt'>(() => {
    const saved = localStorage.getItem('math-quest-lang');
    return (saved as 'en' | 'pt') || 'en';
  });

  React.useEffect(() => {
    localStorage.setItem('math-quest-lang', language);
  }, [language]);

  const t = {
    settings: language === 'en' ? 'Settings' : 'Definições',
    sound: language === 'en' ? 'Sound Effects' : 'Efeitos de Som',
    language: language === 'en' ? 'Language' : 'Idioma',
    reset: language === 'en' ? 'Reset Progress' : 'Resetar Progresso',
    danger: language === 'en' ? 'DANGEROUS ZONE' : 'ZONA DE PERIGO',
    confirmReset: language === 'en' ? 'Are you sure you want to reset all your progress? This cannot be undone.' : 'Tem certeza que deseja resetar todo o seu progresso? Isso não pode ser desfeito.',
    howToPlay: language === 'en' ? 'How to Play' : 'Como Jogar',
    guide: language === 'en' ? 'Guide / Guia' : 'Guia / Guide',
    rules: language === 'en' ? 'Rules' : 'Regras',
    newProblem: language === 'en' ? 'New Problem' : 'Nova Pergunta',
    mixed: language === 'en' ? 'Mixed' : 'Misto',
    gameMode: language === 'en' ? 'Game Mode' : 'Modo de Jogo',
    difficultyLabel: language === 'en' ? 'Difficulty' : 'Dificuldade',
    modes: {
      mixed: language === 'en' ? 'All Mixed' : 'Tudo Misto',
      classic: language === 'en' ? 'Classic' : 'Clássico',
      story: language === 'en' ? 'Stories' : 'Histórias',
      puzzle: language === 'en' ? 'Puzzles' : 'Puzzles',
    },
    library: language === 'en' ? 'Logic & Games Library' : 'Biblioteca de Lógica e Jogos',
    randomGame: language === 'en' ? 'Random Game' : 'Jogo Aleatório',
    explore: language === 'en' ? 'Explore more: Stomachion, Magic Squares, Game of 24, Nim, Hex, Amazon, Alquerque, and Sam Loyd\'s puzzles. Learn the history and logic behind math!' : 'Explore mais: Stomachion, Quadrados Mágicos, Jogo do 24, Nim, Hex, Amazon, Alquerque e puzzles de Sam Loyd. Aprenda a história e lógica por trás da matemática!',
    player: language === 'en' ? 'Player' : 'Jogador',
    editName: language === 'en' ? 'Edit Name' : 'Editar Nome',
  };

  React.useEffect(() => {
    setIsStatsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isStatsReady) return;
    localStorage.setItem('math-quest-stats', JSON.stringify(stats));
    
    // Update server score if nickname exists
    if (stats.nickname) {
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: stats.nickname,
          points: stats.points,
          problemsSolved: stats.problemsSolved,
          streak: stats.streak,
          level: stats.level
        })
      }).catch(console.error);
    }
  }, [stats]);

  // Fetch leaderboard
  const fetchLeaderboard = React.useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
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
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <span className="floating-symbol top-20 left-[10%] rotate-12 animate-math-float" style={{ animationDelay: '0s' }}>Σ</span>
        <span className="floating-symbol top-1/2 left-[5%] -rotate-12 animate-math-float" style={{ animationDelay: '2s' }}>π</span>
        <span className="floating-symbol top-[80%] left-[15%] rotate-45 animate-math-float" style={{ animationDelay: '4s' }}>√</span>
        <span className="floating-symbol top-10 right-[15%] -rotate-3 animate-math-float" style={{ animationDelay: '1s' }}>∫</span>
        <span className="floating-symbol top-1/2 right-[8%] rotate-12 animate-math-float" style={{ animationDelay: '3s' }}>∞</span>
        <span className="floating-symbol top-[75%] right-[20%] rotate-[-30deg] animate-math-float" style={{ animationDelay: '5s' }}>∆</span>
        <span className="floating-symbol top-[15%] left-[45%] opacity-[0.03] text-8xl font-mono">f(x)=lim(h→0)</span>
        
        {/* Geometric Blueprints */}
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] border-[2px] border-neo-purple/10 rounded-full">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neo-purple/5" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-neo-purple/5" />
        </div>
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] border-[2px] border-neo-pink/10 rounded-[120px] rotate-12">
          <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 20px)' }} />
        </div>
      </div>

      <div className="relative z-10">
        <AnimatePresence>
        {showLanding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-neo-yellow overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto py-12 px-6 md:py-24 relative text-[#2D3436]">
              <header className="text-center mb-16 relative">
                <motion.div 
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-24 h-24 bg-[#2D3436] rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-neo-hover"
                >
                  <Brain className="text-neo-yellow" size={48} />
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6 whitespace-nowrap">
                  Math<br />Quest<br />
                  <span className="text-neo-purple underline decoration-neo-pink decoration-8 underline-offset-8">Logic</span>
                </h1>
              </header>

              <div className="grid md:grid-cols-2 gap-8 mb-16 px-2">
                <div className="neo-card p-8 shadow-neo">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-4 border-[#2D3436] mb-6 shadow-neo-sm">
                    <Target className="text-neo-blue" size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-1">Mission Script</h3>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-wider">Protocolo de Operação</p>
                  
                  <ul className="space-y-4 font-bold text-sm text-[#2D3436]">
                    <li className="flex items-start gap-4">
                      <span className="w-6 h-6 bg-[#2D3436] text-white rounded-lg flex-shrink-0 flex items-center justify-center text-xs mt-0.5 font-mono">01</span>
                      <div>
                        <span>Analyze the logical pattern.</span>
                        <span className="block text-[10px] opacity-60">Analise o padrão lógico.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-6 h-6 bg-[#2D3436] text-white rounded-lg flex-shrink-0 flex items-center justify-center text-xs mt-0.5 font-mono">02</span>
                      <div>
                        <span>Input calculated solution.</span>
                        <span className="block text-[10px] opacity-60">Digite sua solução.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="w-6 h-6 bg-[#2D3436] text-white rounded-lg flex-shrink-0 flex items-center justify-center text-xs mt-0.5 font-mono">03</span>
                      <div>
                        <span>Validate to gain experience.</span>
                        <span className="block text-[10px] opacity-60">Valide para ganhar experiência.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="neo-card p-8">
                  <div className="w-12 h-12 bg-neo-pink rounded-2xl flex items-center justify-center border-4 border-[#2D3436] mb-6">
                    <Trophy className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-1">Rank System</h3>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-wider">Escalonamento</p>

                  <div className="space-y-4 font-bold text-slate-600">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-neo-green font-black">Easy Level</span>
                        <span className="block text-[8px] opacity-50 uppercase">Nível Fácil</span>
                      </div>
                      <span className="font-black text-xl">10-20 XP</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-neo-yellow font-black">Medium Level</span>
                        <span className="block text-[8px] opacity-50 uppercase">Nível Médio</span>
                      </div>
                      <span className="font-black text-xl">25-35 XP</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-neo-pink font-black">Hard Level</span>
                        <span className="block text-[8px] opacity-50 uppercase">Nível Difícil</span>
                      </div>
                      <span className="font-black text-xl">45-60 XP</span>
                    </div>
                    <p className="text-xs mt-2 italic">* Points converted to Global XP. / Pontos convertidos para Rank Global!</p>
                  </div>
                </div>

                <div className="neo-card p-8 md:col-span-2">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="text-neo-pink" size={28} />
                        <div>
                          <h3 className="text-2xl font-black uppercase leading-none">Streak System</h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sequência</span>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-slate-600 leading-relaxed">
                        Correct answers increase your Streak. Higher streaks mean more prestige!<br />
                        <span className="text-[10px] opacity-60">Respostas corretas aumentam o seu Streak. Quanto maior o seu Streak, maior o seu prestígio!</span>
                        <br /><br />
                        <span className="text-rose-500 underline decoration-4 underline-offset-4">Warning:</span> One error resets it to zero! / Um erro reseta para zero!
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="text-neo-purple" size={28} />
                        <div>
                          <h3 className="text-2xl font-black uppercase leading-none">Progression</h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progressão</span>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-slate-600 leading-relaxed">
                        Every 5 problems you level up. New challenges like powers and logic are introduced.<br />
                        <span className="text-[10px] opacity-60">A cada 5 problemas, você sobe de nível. Novos desafios como potências e lógica são introduzidos.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartGame}
                className="w-full bg-neo-purple py-8 rounded-[40px] border-[6px] border-[#2D3436] shadow-neo flex flex-col items-center justify-center group mb-20 px-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase whitespace-nowrap">Start Adventure</span>
                  <Gamepad2 className="text-white group-hover:rotate-12 transition-transform" size={40} />
                </div>
                <span className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mt-1">Começar Aventura</span>
              </motion.button>
              <footer className="mt-10 text-center opacity-40 font-black uppercase text-[10px] tracking-widest text-[#2D3436]">
                Feito por Rodrigo Marques
              </footer>
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
                  <Users className="text-white" size={40} />
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
                    START QUEST
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
                    <Settings className="text-[#2D3436]" size={24} />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">{t.settings}</h2>
                </div>

                <div className="space-y-4">
                  {/* Language Toggle */}
                  <button 
                    onClick={() => setLanguage(l => l === 'en' ? 'pt' : 'en')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 border-[3px] border-[#2D3436] rounded-2xl group transition-all hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <Languages className="text-neo-purple" />
                      <span className="font-black uppercase text-sm tracking-tight">{t.language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black uppercase ${language === 'en' ? 'text-neo-purple' : 'text-slate-400'}`}>EN</span>
                      <div className="w-8 h-4 rounded-full border-2 border-[#2D3436] relative bg-slate-200">
                        <div className={`absolute top-0.5 bottom-0.5 w-2 h-2 bg-neo-purple border border-[#2D3436] rounded-full transition-all ${language === 'pt' ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                      <span className={`text-xs font-black uppercase ${language === 'pt' ? 'text-neo-purple' : 'text-slate-400'}`}>PT</span>
                    </div>
                  </button>

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
                  Math Quest v1.2.0 • Build 2026
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
              <Trophy size={48} className="mb-2" />
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Level Up!</h2>
              <p className="font-bold text-lg">Now at Level {stats.level}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white py-12 px-10 rounded-[48px] border-[6px] border-[#2D3436] shadow-neo">
          <div className="flex items-center gap-6 group cursor-pointer" onClick={() => setShowLanding(true)}>
            <div className="relative">
              <div className="absolute inset-0 bg-neo-purple rounded-[24px] translate-x-2 translate-y-2 border-[4px] border-[#2D3436]" />
              <div className="relative w-16 h-16 bg-neo-purple rounded-[24px] flex items-center justify-center border-[4px] border-[#2D3436] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform">
                <Calculator className="text-white" size={32} strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-[#2D3436] uppercase leading-none">Math Quest</h1>
              <p className="text-[#2D3436]/40 font-black uppercase text-[8px] tracking-[0.3em] mt-2">Logic Adventure</p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6">
            <StatsCard stats={stats} language={language} />
            
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          
          <div className="space-y-8">
            <main className="relative min-h-[450px]">
              <AnimatePresence mode="wait">
                {!isRefreshing && (
                  <ProblemCard 
                    key={currentProblem.id} 
                    problem={currentProblem} 
                    onSolve={handleSolve} 
                    language={language}
                  />
                )}
              </AnimatePresence>
              
              {isRefreshing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="animate-spin text-[#6C5CE7]" size={64} strokeWidth={4} />
                </div>
              )}
            </main>

            {/* Puzzle Library / Suggestions */}
            <section className="neo-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Star className="text-neo-yellow" fill="currentColor" />
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{t.library}</h2>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const randomIdx = Math.floor(Math.random() * ALL_GAMES.length);
                      const game = ALL_GAMES[randomIdx];
                      setGameMode('puzzle');
                      handleNextProblem(undefined, undefined, false, 'puzzle', game.name);
                    }}
                    className="neo-btn bg-neo-yellow py-2 px-3 text-[10px] shadow-neo-sm"
                    title={t.randomGame}
                  >
                    <Dices size={16} strokeWidth={4} />
                    <span className="hidden sm:inline ml-2">{t.randomGame}</span>
                  </button>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => setLibraryPage(prev => Math.max(0, prev - 1))}
                      disabled={libraryPage === 0}
                      className="neo-btn bg-white py-2 px-3 text-[10px] shadow-neo-sm disabled:opacity-50"
                    >
                      <ChevronLeft size={16} strokeWidth={4} />
                    </button>
                    <button 
                      onClick={() => setLibraryPage(prev => (prev + 1) * 6 < ALL_GAMES.length ? prev + 1 : prev)}
                      disabled={(libraryPage + 1) * 6 >= ALL_GAMES.length}
                      className="neo-btn bg-white py-2 px-3 text-[10px] shadow-neo-sm disabled:opacity-50"
                    >
                      <ChevronRight size={16} strokeWidth={4} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ALL_GAMES.slice(libraryPage * 6, (libraryPage + 1) * 6).map((game) => (
                  <button 
                    key={game.name} 
                    onClick={() => {
                      setGameMode('puzzle');
                      handleNextProblem(undefined, undefined, false, 'puzzle', game.name);
                    }}
                    className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-neo-purple hover:bg-white transition-all cursor-pointer group text-left w-full"
                  >
                    <span className="block font-black text-[#2D3436] group-hover:text-neo-purple line-clamp-1 truncate">{game.name}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mt-1">
                      {game.origin[language]} • {game.type[language]}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                {t.explore}
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            {/* User Profile */}
            <section className="neo-card p-6 flex items-center justify-between gap-4 overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-5 font-mono text-[8px] rotate-90 origin-top-right">QUEST_LOG_{stats.nickname?.toUpperCase()}</div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-neo-pink border-[4px] border-[#2D3436] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-neo-sm">
                  {stats.nickname?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-[#2D3436]/40 leading-none mb-1">Active Hero</span>
                  <span className="block font-black uppercase truncate max-w-[120px] text-xl leading-tight">{stats.nickname}</span>
                </div>
              </div>
              <button 
                onClick={handleEditNickname}
                className="neo-btn bg-white py-1.5 px-3 text-[10px] shadow-neo-sm hover:bg-slate-50 border-[2px]"
              >
                EDIT Name
              </button>
            </section>

            {/* Leaderboard */}
            <section className="neo-card p-8 border-neo-purple/50">
              <div className="flex items-center gap-2 mb-6 border-b-4 border-slate-100 pb-4">
                <Users size={20} className="text-neo-purple" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Top Analysts</h3>
                <div className="ml-auto w-2 h-2 bg-neo-green rounded-full animate-ping" />
              </div>
              <div className="space-y-4">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 5).map((entry, idx) => (
                    <div 
                      key={entry.nickname} 
                      className={`flex items-center justify-between p-3 rounded-xl border-4 transition-all ${
                        entry.nickname === stats.nickname 
                          ? 'border-neo-purple bg-neo-purple/10' 
                          : 'border-slate-100 shadow-neo-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 text-2xl font-black math-mono ${idx === 0 ? 'text-neo-yellow' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-neo-orange' : 'text-slate-300'}`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="block font-black uppercase text-sm leading-tight">{entry.nickname}</span>
                          <span className="block text-[8px] font-black text-neo-purple opacity-40 tracking-widest leading-none mt-1">LVL {entry.level}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] font-black uppercase text-slate-400 leading-none">{entry.problemsSolved} SOLVED</span>
                        <span className="block text-sm math-mono font-black text-neo-pink mt-1">🔥 {entry.streak}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs font-black text-slate-400 py-4 uppercase tracking-widest">Loading ranks...</p>
                )}
              </div>
            </section>

            {/* Progress Card */}
            <section className="neo-card p-8 bg-white overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10 font-mono text-[8px] tracking-widest uppercase">Target_Sync</div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#2D3436]/50 mb-4 border-b-2 border-slate-100 pb-2">
                Today's Goal
              </span>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-black uppercase leading-none">Level {stats.level}</span>
                <span className="text-base math-mono font-black text-neo-pink">{(stats.problemsSolved % 5) * 20}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full border-2 border-[#2D3436] overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.problemsSolved % 5) * 20}%` }}
                  className="h-full bg-neo-pink"
                />
              </div>
              <p className="mt-4 text-xs font-bold text-[#2D3436]/70 text-center uppercase tracking-tight">
                {5 - (stats.problemsSolved % 5)} more for next level
              </p>
            </section>

            {/* Streak Card */}
            <section className="neo-card p-8 bg-neo-purple text-white">
              <span className="text-6xl math-mono font-black block mb-2 leading-none">🔥 {stats.streak}</span>
              <span className="text-lg font-black uppercase tracking-tighter">Current Streak!</span>
            </section>
          </aside>

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
          <p>Feito por Rodrigo Marques</p>
        </footer>
      </div>
    </div>
  </div>
);
}
