import React from 'react';
import { UserStats } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Zap, Star, Target } from 'lucide-react';

interface StatsCardProps {
  stats: UserStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const t = {
    level: 'LEVEL',
    xp: 'POINTS',
    streak: 'STREAK',
    solved: 'SOLVED'
  };

  // Calculate XP progress to next level (assuming 1000 XP per level for visualization)
  const xpInLevel = stats.points % 1000;
  const progress = (xpInLevel / 1000) * 100;

  return (
    <div className="flex flex-wrap gap-5 items-center">
      <StatBadge 
        label={t.level} 
        value={stats.level} 
        icon={<Star size={16} fill="currentColor" />}
        className="bg-neo-purple text-white"
        showProgress={true}
        progress={progress}
        glowColor="rgba(157,126,254,0.4)"
      />
      <StatBadge 
        label={t.xp} 
        value={stats.points} 
        icon={<Trophy size={16} fill="currentColor" />}
        className="bg-neo-yellow text-[#1A1A1A]"
        glowColor="rgba(255,233,0,0.3)"
      />
      <StatBadge 
        label={t.streak} 
        value={stats.streak} 
        icon={<Zap size={16} fill="currentColor" />}
        className="bg-neo-pink text-white"
        pulse={stats.streak > 5}
        glowColor="rgba(255,128,102,0.4)"
      />
      <StatBadge 
        label={t.solved} 
        value={stats.problemsSolved} 
        icon={<Target size={16} fill="currentColor" />}
        className="bg-neo-green text-[#1A1A1A]"
        glowColor="rgba(107,203,119,0.4)"
      />
    </div>
  );
};

const StatBadge = ({ 
  label, 
  value, 
  className, 
  icon, 
  showProgress = false, 
  progress = 0,
  pulse = false,
  glowColor
}: { 
  label: string, 
  value: number, 
  className: string, 
  icon: React.ReactNode,
  showProgress?: boolean,
  progress?: number,
  pulse?: boolean,
  glowColor?: string
}) => (
  <motion.div 
    layout
    whileHover={{ scale: 1.05, y: -4 }}
    className="relative group active:scale-95 transition-all"
  >
    {/* Background Glow */}
    <div 
      className="absolute inset-2 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" 
      style={{ backgroundColor: glowColor }}
    />
    
    <div 
      className={`${className} relative z-10 px-6 py-3 rounded-[24px] border-[5px] border-[#1A1A1A] flex flex-col font-display font-black shadow-neo-sm transition-all group-hover:shadow-neo overflow-hidden ${pulse ? 'animate-pulse' : ''}`}
    >
      {showProgress && (
        <div className="absolute bottom-0 left-0 h-1.5 bg-[#1A1A1A]/10 w-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-white/60"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-black/20 transition-colors">
          {icon}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
             <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] leading-none">{label}</span>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.span 
              key={value}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              className="text-2xl leading-none tracking-tighter italic"
            >
              {value.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </motion.div>
);
