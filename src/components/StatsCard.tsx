import React from 'react';
import { UserStats } from '../types.ts';
// No lucide imports needed
import { motion, AnimatePresence } from 'motion/react';

interface StatsCardProps {
  stats: UserStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const t = {
    level: 'LEVEL',
    xp: 'POINTS',
    streak: 'STREAK',
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <StatBadge 
        label={t.level} 
        value={stats.level} 
        className="bg-neo-purple text-white"
      />
      <StatBadge 
        label={t.xp} 
        value={stats.points} 
        className="bg-neo-yellow text-[#1A1A1A]"
      />
      <StatBadge 
        label={t.streak} 
        value={stats.streak} 
        className="bg-neo-pink text-white"
      />
    </div>
  );
};

const StatBadge = ({ label, value, className }: { icon?: React.ReactNode, label: string, value: number, className: string }) => (
  <motion.div 
    layout
    whileHover={{ scale: 1.05, y: -2 }}
    className={`${className} px-6 py-3 rounded-2xl border-[4px] border-[#1A1A1A] flex flex-col font-display font-black shadow-neo-sm transition-all active:scale-95 active:shadow-none hover:shadow-neo`}
  >
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] leading-none mb-1">{label}</span>
      <AnimatePresence mode="popLayout">
        <motion.span 
          key={value}
          initial={{ y: 10, opacity: 0, rotateX: 90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -10, opacity: 0, rotateX: -90 }}
          className="text-xl math-mono leading-none tracking-tighter"
        >
          {value.toLocaleString()}
        </motion.span>
      </AnimatePresence>
    </div>
  </motion.div>
);
