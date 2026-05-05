import React from 'react';
import { UserStats } from '../types.ts';
import { Trophy, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StatsCardProps {
  stats: UserStats;
  language: 'en' | 'pt';
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats, language }) => {
  const t = {
    level: language === 'en' ? 'LVL' : 'NVL',
    xp: 'XP',
    streak: language === 'en' ? 'STR' : 'CMB',
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <StatBadge 
        icon={<Zap size={16} fill="currentColor" />} 
        label={t.level} 
        value={stats.level} 
        className="bg-neo-purple text-white"
      />
      <StatBadge 
        icon={<Trophy size={16} />} 
        label={t.xp} 
        value={stats.points} 
        className="bg-neo-yellow"
      />
      <StatBadge 
        icon={<Star size={16} fill="currentColor" />} 
        label={t.streak} 
        value={stats.streak} 
        className="bg-neo-pink text-white"
      />
    </div>
  );
};

const StatBadge = ({ icon, label, value, className }: { icon: React.ReactNode, label: string, value: number, className: string }) => (
  <motion.div 
    layout
    whileHover={{ scale: 1.05 }}
    className={`${className} px-4 py-2 rounded-2xl border-[3px] border-[#2D3436] flex items-center gap-3 font-display font-black shadow-neo-sm transition-transform active:scale-95`}
  >
    <div className="flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[8px] font-black uppercase opacity-60 tracking-widest leading-none mb-0.5">{label}</span>
      <AnimatePresence mode="popLayout">
        <motion.span 
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          className="text-sm math-mono leading-none"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  </motion.div>
);
