import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MathProblem } from '../types.ts';
import { CheckCircle2, XCircle, Send, HelpCircle, Trophy, Lightbulb } from 'lucide-react';

interface ProblemCardProps {
  problem: MathProblem;
  onSolve: (isCorrect: boolean) => void;
  language: 'en' | 'pt';
}

const MathVisualAid: React.FC<{ data: NonNullable<MathProblem['visualData']> }> = ({ data }) => {
  if (data.type === 'stack' && data.stack) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 bg-slate-900 rounded-[32px] border-4 border-[#2D3436] shadow-inner w-full max-w-xs mx-auto overflow-hidden">
        <div className="flex flex-col-reverse items-center w-full px-12 relative h-48">
          <div className="w-full h-3 bg-slate-700/50 rounded-full mb-[-6px] z-10" />
          <div className="w-2 h-40 bg-slate-700/50 rounded-full" />
          <div className="absolute flex flex-col-reverse items-center justify-end h-40 pb-2 z-20">
            {data.stack.map((size, i) => (
              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="h-6 rounded-lg border-2 border-[#2D3436] shadow-sm mb-1 flex items-center justify-center overflow-hidden"
                style={{ 
                  width: `${size * 25}px`,
                  backgroundColor: ['#FF7675', '#00B894', '#FFDE59', '#6C5CE7', '#E17055'][i % 5]
                }}
              >
                <div className="w-full h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 4px)', backgroundSize: '4px 4px' }} />
              </motion.div>
            ))}
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neo-green font-mono bg-neo-green/10 px-3 py-1 rounded-full animate-pulse">Recursive.Analysis.v3</p>
      </div>
    );
  }

  if (data.type === 'row' && data.row) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 bg-slate-100/50 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-slate-300 overflow-x-auto w-full">
        <div className="flex gap-4 px-6">
          {data.row.map((item, i) => (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="px-6 py-3 bg-white border-[3px] border-[#2D3436] rounded-2xl flex items-center justify-center font-black shadow-neo-sm whitespace-nowrap text-lg"
            >
              {item}
            </motion.div>
          ))}
        </div>
        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-display">Sequence.Execution.Active</p>
      </div>
    );
  }

  if (data.type === 'board' && data.grid) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 bg-[#E4E3E0] rounded-[32px] border-[4px] border-[#2D3436] shadow-inner overflow-auto max-w-full">
        <div 
          className="grid gap-px bg-[#2D3436] border-[2px] border-[#2D3436] rounded-lg overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${data.grid[0].length}, minmax(0, 1fr))` }}
        >
          {data.grid.map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`${x}-${y}`} 
                className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-xl font-black relative ${
                  (x + y) % 2 === 0 ? 'bg-white' : 'bg-slate-200'
                }`}
              >
                {cell}
                {data.markerPosition?.x === x && data.markerPosition?.y === y && (
                   <motion.div 
                     animate={{ scale: [1, 1.2, 1] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute inset-0 border-4 border-neo-purple mix-blend-multiply opacity-50 bg-neo-purple/10" 
                   />
                )}
              </div>
            ))
          )}
        </div>
        <p className="text-[9px] font-black uppercase tracking-widest text-[#2D3436]/40 font-display">Tactical.Simulation.Grid</p>
      </div>
    );
  }

  if (data.type === 'grid' && data.grid) {
    const cols = data.grid[0].length;
    return (
      <div className="flex flex-col items-center gap-4 py-8 bg-slate-50 rounded-[32px] border-[4px] border-[#2D3436] shadow-inner">
        <div 
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {data.grid.flat().map((cell, i) => (
            <div 
              key={i} 
              className={`${cols > 3 ? 'w-10 h-10 md:w-12 md:h-12 text-base' : 'w-16 h-16 md:w-20 md:h-20 text-2xl'} bg-white border-[3px] border-[#2D3436] rounded-2xl flex items-center justify-center font-display font-black shadow-neo-sm`}
            >
              {cell}
            </div>
          ))}
        </div>
        <p className="text-[10px] font-display italic text-slate-400 uppercase tracking-[0.2em] mt-2">
           Data.Structure: {data.label || 'Standard'}
        </p>
      </div>
    );
  }

  if (data.type === 'logic' && data.label) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#2D3436] rounded-[32px] border-[4px] border-[#2D3436] shadow-neo relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="font-display text-2xl md:text-4xl font-black text-neo-yellow tracking-tighter text-center uppercase z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
          {data.label}
        </div>
        <div className="mt-8 pt-4 border-t border-white/10 w-full flex items-center justify-between z-10">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Neural.Logic.Core</span>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-neo-green animate-pulse rounded-full" />
            <div className="w-2 h-2 bg-neo-green animate-pulse delay-75 rounded-full" />
            <div className="w-2 h-2 bg-neo-green animate-pulse delay-150 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (data.type === 'shape' && data.shape === 'hexagon') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 bg-white/50 rounded-[32px] border-[4px] border-[#2D3436] shadow-neo-sm">
        <div className="w-32 h-32 bg-neo-yellow border-[4px] border-[#2D3436] shadow-neo-sm relative flex items-center justify-center" 
             style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
             <span className="font-black text-2xl">HEX</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Hexagonal.Geometry.Primitive</p>
      </div>
    );
  }

  if (data.type === 'shape' && data.shape === 'rectangle' && data.dimensions) {
    const { width = 1, height = 1 } = data.dimensions;
    const ratio = width / height;
    const boxWidth = 200;
    const boxHeight = Math.min(250, boxWidth / ratio);

    return (
      <div className="flex flex-col items-center gap-8 py-10 bg-slate-50 rounded-[32px] border-[4px] border-[#2D3436] shadow-inner relative overflow-hidden">
        <div 
          className="bg-neo-yellow border-[4px] border-[#2D3436] relative flex items-center justify-center shadow-neo-sm z-10"
          style={{ width: boxWidth, height: boxHeight }}
        >
          <span className="absolute -top-8 font-black uppercase text-xs bg-[#2D3436] text-white px-2 py-0.5 rounded-md">W: {width}</span>
          <span className="absolute -left-14 rotate-[-90deg] font-black uppercase text-xs bg-[#2D3436] text-white px-2 py-0.5 rounded-md">H: {height}</span>
          <div className="w-8 h-8 rounded-full border-4 border-[#2D3436] flex items-center justify-center font-black bg-white">?</div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Euclidean.Diagram.v1</p>
      </div>
    );
  }

  if (data.type === 'count' && data.count && data.icon) {
    return (
      <div className="flex flex-wrap justify-center gap-4 p-10 bg-slate-100 rounded-[32px] border-[4px] border-[#2D3436] shadow-inner">
        {Array.from({ length: data.count }).map((_, i) => (
          <motion.span 
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: Math.random() * 20 - 10 }}
            transition={{ type: 'spring', stiffness: 200, delay: i * 0.05 }}
            key={i} 
            className="text-5xl drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
          >
            {data.icon}
          </motion.span>
        ))}
      </div>
    );
  }

  if (data.type === 'pits' && data.count) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 bg-[#D2B48C]/30 rounded-[32px] border-[4px] border-[#2D3436] shadow-inner">
        <div className="grid grid-cols-6 gap-4 px-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-12 h-12 md:w-16 md:h-16 bg-[#2D3436]/10 border-[3px] border-[#2D3436] rounded-full flex items-center justify-center relative overflow-hidden">
               <div className="flex flex-wrap gap-0.5 justify-center p-1">
                  {i === 0 && Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="w-2 h-2 bg-slate-600 rounded-full" />
                  ))}
               </div>
               <span className="absolute bottom-1 right-2 text-[8px] font-black opacity-30">{i + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-black text-[#2D3436]/40 uppercase tracking-widest mt-2">Ouri.Seeds.Simulation</p>
      </div>
    );
  }

  return null;
};

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSolve, language }) => {
  const [userInput, setUserInput] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = React.useState(false);

  const t = {
    challenge: language === 'en' ? 'CHALLENGE' : 'DESAFIO',
    hintShow: language === 'en' ? 'Use Hint' : 'Explicação',
    hintHide: language === 'en' ? 'Hide Hint' : 'Esconder Dica',
    placeholder: language === 'en' ? 'Solve here...' : 'Resolve aqui...',
    submit: language === 'en' ? 'SUBMIT' : 'ENVIAR',
    pointsUp: language === 'en' ? 'pts for grabs' : 'pontos em jogo',
    correct: language === 'en' ? 'PERFECT!' : 'PERFEITO!',
    incorrect: language === 'en' ? 'TRY AGAIN' : 'TENTA DE NOVO',
    difficulty: {
      easy: language === 'en' ? 'EASY' : 'FÁCIL',
      medium: language === 'en' ? 'MEDIUM' : 'MÉDIO',
      hard: language === 'en' ? 'HARD' : 'DIFÍCIL',
    }
  };

  React.useEffect(() => {
    setShowHint(false);
  }, [problem.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput) return;
    const isCorrect = parseFloat(userInput) === problem.answer;
    
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => {
        onSolve(true);
        setUserInput('');
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback('incorrect');
      onSolve(false);
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
      className="neo-card p-8 md:p-12 relative overflow-hidden"
    >
      {/* Decorative dots in corners */}
      <div className="absolute top-4 left-4 flex gap-1 opacity-20">
        <div className="w-1.5 h-1.5 rounded-full bg-[#2D3436]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#2D3436]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#2D3436]" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="group relative">
            <div className={`px-4 py-1.5 rounded-xl border-[3px] border-[#2D3436] font-black text-xs uppercase shadow-neo-sm ${
              problem.difficulty === 'easy' ? 'bg-neo-green text-white' :
              problem.difficulty === 'medium' ? 'bg-neo-yellow text-[#2D3436]' :
              'bg-neo-pink text-white'
            }`}>
              {t.difficulty[problem.difficulty]}
            </div>
          </div>
          <div className="math-mono font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] bg-slate-100 px-3 py-1.5 rounded-xl border-2 border-[#2D3436]/10">
            {problem.category}
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#2D3436] border-[3px] border-[#2D3436] rounded-xl text-white font-black shadow-neo-sm">
           <Trophy size={16} className="text-neo-yellow animate-bounce" />
           <span className="math-mono text-sm">{problem.points} PT</span>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl lg:text-7xl text-[#2D3436] leading-[1] tracking-tighter mb-4">
          {problem.question}
        </h2>
        <div className="w-20 h-2 bg-neo-purple rounded-full" />
      </div>

      {problem.imageUrl && (
        <div className="mb-12 relative group">
          <div className="absolute -inset-2 bg-neo-blue rounded-[36px] border-[4px] border-[#2D3436] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
          <div className="relative rounded-[32px] overflow-hidden border-[4px] border-[#2D3436] bg-white">
            <img 
              src={problem.imageUrl} 
              alt="Challenge context" 
              className="w-full h-auto object-cover max-h-[300px] grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            {problem.hint && (
              <div className="p-5 bg-white border-t-[4px] border-[#2D3436]">
                <div className="flex gap-4 items-start">
                  <div className="bg-neo-yellow p-3 rounded-2xl border-[3px] border-[#2D3436] shadow-neo-sm">
                    <Lightbulb size={24} className="text-[#2D3436]" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-[10px] text-slate-400 mb-1 tracking-widest">{language === 'pt' ? 'Dica Estratégica' : 'Strategic Hint'}</h4>
                    <p className="text-sm font-bold text-[#2D3436] leading-snug">
                      {problem.hint}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {problem.visualData && (
        <div className="mb-12">
          <MathVisualAid data={problem.visualData} />
        </div>
      )}

      {!problem.imageUrl && problem.hint && (
        <div className="mb-10">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 group cursor-pointer mb-2"
          >
            <div className="p-2 bg-neo-purple rounded-lg border-2 border-[#2D3436] shadow-neo-sm group-hover:-translate-y-0.5 transition-transform">
              <HelpCircle size={14} className="text-white" />
            </div>
            <span className="font-black uppercase text-[10px] tracking-widest text-neo-purple">
               {showHint ? t.hintHide : t.hintShow}
            </span>
          </button>
          
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-slate-50 border-[3px] border-dashed border-slate-300 rounded-[24px] mt-4">
                  <p className="font-bold text-slate-600 leading-relaxed italic">
                    {problem.hint}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-auto">
        {problem.options && problem.options.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 pb-2">
            {problem.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setUserInput(opt.toString());
                  const isCorrect = opt === problem.answer;
                  if (isCorrect) {
                    setFeedback('correct');
                    setTimeout(() => {
                      onSolve(true);
                      setUserInput('');
                      setFeedback(null);
                    }, 1500);
                  } else {
                    setFeedback('incorrect');
                    onSolve(false);
                    setTimeout(() => {
                      setFeedback(null);
                    }, 1000);
                  }
                }}
                disabled={feedback === 'correct'}
                className={`neo-btn math-mono text-3xl h-24 shadow-neo flex items-center justify-center active:shadow-none hover:shadow-neo-hover ${
                  feedback === 'incorrect' && userInput === opt.toString() ? 'bg-neo-pink text-white shake' : 
                  feedback === 'correct' && opt === problem.answer ? 'bg-neo-green text-white active:translate-y-0 translate-y-0 shadow-neo' : 'bg-white hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative pb-2">
            <div className="flex flex-col sm:flex-row gap-6">
              <input
                autoFocus
                type="number"
                step="any"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={feedback === 'correct'}
                placeholder={t.placeholder}
                className={`flex-1 bg-white border-[4px] border-[#2D3436] rounded-3xl px-8 py-6 text-4xl math-mono font-black focus:outline-none transition-all placeholder:text-slate-200 shadow-inner ${
                  feedback === 'correct' ? 'text-neo-green' : 
                  feedback === 'incorrect' ? 'text-neo-pink shake' :
                  'focus:ring-8 focus:ring-neo-purple/10'
                }`}
              />
              <button
                type="submit"
                disabled={!userInput || feedback === 'correct'}
                className="neo-btn bg-neo-purple text-white px-12 py-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:shadow-neo-sm h-[88px] text-xl"
              >
                <span>{t.submit}</span>
                <Send size={24} strokeWidth={3} className={feedback === 'correct' ? 'animate-bounce' : ''} />
              </button>
            </div>
          </form>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: -20 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 px-12 py-8 rounded-[36px] border-[6px] border-[#2D3436] shadow-neo z-50 ${
                feedback === 'correct' ? 'bg-neo-green' : 'bg-neo-pink text-white'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 size={64} strokeWidth={3} />
                  <span className="text-4xl font-black uppercase tracking-tight">{t.correct}</span>
                  <span className="font-black text-xl">+{problem.points} PT</span>
                </>
              ) : (
                <>
                  <XCircle size={64} strokeWidth={3} />
                  <span className="text-3xl font-black uppercase tracking-tight">{t.incorrect}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </motion.div>
  );
};
