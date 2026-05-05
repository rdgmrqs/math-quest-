import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MathProblem } from '../types.ts';
// No lucide imports needed

interface ProblemCardProps {
  problem: MathProblem;
  onSolve: (isCorrect: boolean) => void;
}

const MathVisualAid: React.FC<{ data: NonNullable<MathProblem['visualData']> }> = ({ data }) => {
  const getCellContent = (cell: string) => {
    if (cell === '●' || cell === '○') {
      return (
        <div className={`w-8 h-8 rounded-full border-[3px] border-[#2D3436] shadow-sm ${cell === '●' ? 'bg-neo-purple' : 'bg-white'}`} />
      );
    }
    if (cell === '웃') return <span className="text-3xl">웃</span>;
    if (cell === '▣') return <div className="w-8 h-8 bg-neo-pink border-[3px] border-[#2D3436] rounded-sm transform rotate-12" />;
    if (cell === 'target') return <div className="w-8 h-8 border-[3px] border-[#2D3436] border-dashed rounded-full" />;
    if (cell === '▩') return <div className="w-10 h-10 bg-neo-blue border-2 border-[#2D3436] grid grid-cols-2 p-1"><div className="bg-white/20" /><div /><div /><div className="bg-white/20" /></div>;
    return cell;
  };

  if (data.type === 'row' && data.row) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 bg-slate-100/30 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-slate-300 w-full overflow-hidden">
        <div className="flex gap-4 justify-center flex-wrap px-6">
          {data.row.map((item, i) => {
            const isMarker = item === 'Y' || item === 'G' || item === 'R' || item === 'A' || item === 'V' || item === 'Vml';
            const colorClass = (item === 'G' || item === 'V') ? 'bg-neo-green' : 
                             (item === 'Y' || item === 'A') ? 'bg-neo-yellow' : 
                             (item === 'R' || item === 'Vml') ? 'bg-neo-pink' : 'bg-white';
            
            return (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className={`w-16 h-16 md:w-20 md:h-20 border-[4px] border-[#2D3436] rounded-2xl flex items-center justify-center font-black shadow-neo-sm text-2xl ${colorClass}`}
              >
                {isMarker ? '' : getCellContent(item)}
              </motion.div>
            );
          })}
        </div>
        <p className="text-xs font-black uppercase text-slate-500 tracking-widest mt-4">{data.label || 'SEQUENCE.LOGIC'}</p>
      </div>
    );
  }

  if (data.type === 'grid' && data.grid) {
    const rows = data.grid.length;
    const cols = data.grid[0].length;
    return (
      <div className="flex flex-col items-center gap-4 py-10 bg-slate-50/50 rounded-[40px] border-[4px] border-[#2D3436] shadow-neo-sm w-full relative overflow-hidden">
        <div 
          className="grid gap-3 p-6 bg-white border-[3px] border-[#2D3436] rounded-3xl shadow-neo-sm"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` 
          }}
        >
          {data.grid.flat().map((cell, i) => (
            <div 
              key={i} 
              className="w-14 h-14 md:w-20 md:h-20 bg-slate-50 border-[3px] border-[#2D3436] rounded-2xl flex items-center justify-center font-display font-black shadow-neo-sm text-2xl relative"
            >
              {getCellContent(cell)}
            </div>
          ))}
        </div>
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4 bg-white px-6 py-2 rounded-full border-2 border-[#2D3436]">
           {data.label || 'STRATEGIC.MAP.v1'}
        </p>
      </div>
    );
  }

  if (data.type === 'pits' && data.count !== undefined) {
    // Ouri Board Visualization
    return (
      <div className="flex flex-col items-center gap-6 py-8 bg-[#8B4513]/20 rounded-[40px] border-[4px] border-[#2D3436] shadow-inner w-full">
        <div className="grid grid-cols-6 gap-3 md:gap-6 px-10">
          {/* Row 1 */}
          {Array.from({ length: 6 }).map((_, i) => (
             <div key={`p1-${i}`} className="w-12 h-12 md:w-16 md:h-16 bg-[#2D3436]/5 border-[3px] border-[#2D3436] rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
                <div className="flex flex-wrap gap-0.5 justify-center p-2">
                  {Array.from({ length: data.count || 0 }).map((_, j) => (
                    <div key={j} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-700 rounded-full shadow-sm" />
                  ))}
                </div>
             </div>
          ))}
          {/* Row 2 */}
          {Array.from({ length: 6 }).map((_, i) => (
             <div key={`p2-${i}`} className="w-12 h-12 md:w-16 md:h-16 bg-[#2D3436]/5 border-[3px] border-[#2D3436] rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
                <div className="flex flex-wrap gap-0.5 justify-center p-2">
                  {/* Empty or can vary based on state */}
                </div>
             </div>
          ))}
        </div>
        <div className="flex justify-between w-full px-16">
          <div className="w-16 h-20 bg-[#2D3436]/10 border-[3px] border-[#2D3436] rounded-3xl flex items-center justify-center font-black opacity-40">STORAGE</div>
          <p className="text-[10px] font-black text-[#2D3436]/60 uppercase tracking-[0.3em] self-center">OURI.SIMULATION</p>
          <div className="w-16 h-20 bg-[#2D3436]/10 border-[3px] border-[#2D3436] rounded-3xl flex items-center justify-center font-black opacity-40">STORAGE</div>
        </div>
      </div>
    );
  }

  if (data.type === 'logic' && data.label) {
    return (
      <div className="flex flex-col items-center justify-center p-14 bg-white rounded-[40px] border-[6px] border-[#2D3436] shadow-neo w-full relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="text-4xl md:text-6xl font-black text-[#2D3436] tracking-tighter text-center uppercase leading-tight">
            {data.label}
          </span>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-neo-green animate-pulse rounded-full" />
            <div className="w-2 h-2 bg-neo-green animate-pulse delay-100 rounded-full" />
            <div className="w-2 h-2 bg-neo-green animate-pulse delay-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (data.type === 'shape' && data.shape === 'hexagon') {
    return (
      <div className="flex flex-col items-center gap-6 py-10 bg-slate-900 rounded-[32px] border-[4px] border-[#2D3436] shadow-neo-sm w-full">
        <div className="grid grid-cols-2 gap-8">
           <div className="w-24 h-24 bg-neo-blue border-[4px] border-[#2D3436] shadow-neo-sm flex items-center justify-center" 
                style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
           <div className="w-24 h-24 bg-neo-pink border-[4px] border-[#2D3436] shadow-neo-sm flex items-center justify-center" 
                style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
        </div>
        <p className="text-xs font-black text-neo-green uppercase tracking-[0.5em] mt-6 animate-pulse">HEX.CONNECT.v2</p>
      </div>
    );
  }

  if (data.type === 'count' && data.count && data.icon) {
    return (
      <div className="flex flex-col items-center p-8 bg-white border-[4px] border-[#2D3436] rounded-[32px] shadow-inner w-full">
        <div className="flex flex-wrap justify-center gap-4">
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
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-8">ENTITY.COUNT: {data.count}</p>
      </div>
    );
  }

  return null;
};

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSolve }) => {
  const [userInput, setUserInput] = React.useState('');
  const [feedback, setFeedback] = React.useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = React.useState(false);

  const t = {
    challenge: 'CHALLENGE',
    hintShow: 'Game Logic',
    hintHide: 'Hide Details',
    placeholder: 'Solve here...',
    submit: 'SUBMIT',
    pointsUp: 'pts for grabs',
    correct: 'EXCELLENT!',
    incorrect: 'INCORRECT',
    difficulty: {
      easy: 'EASY',
      medium: 'MEDIUM',
      hard: 'HARD',
    }
  };

  React.useEffect(() => {
    setShowHint(false);
  }, [problem.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput) return;
    
    let isCorrect = false;
    if (typeof problem.answer === 'number') {
      isCorrect = parseFloat(userInput) === problem.answer;
    } else {
      isCorrect = userInput.trim().toLowerCase() === problem.answer.toString().toLowerCase();
    }
    
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

  const choiceLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-card p-8 md:p-14 relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
        <div className="flex items-center gap-3">
          <div className="group relative">
            <div className={`px-5 py-2 rounded-xl border-[3px] border-[#2D3436] font-black text-sm uppercase shadow-neo-sm ${
              problem.difficulty === 'easy' ? 'bg-neo-green text-white' :
              problem.difficulty === 'medium' ? 'bg-neo-yellow text-[#2D3436]' :
              'bg-neo-pink text-white'
            }`}>
              {t.difficulty[problem.difficulty]}
            </div>
          </div>
          <div className="font-mono font-bold text-[#2D3436]/60 uppercase text-xs tracking-widest bg-slate-50 px-5 py-3 rounded-xl border-2 border-dashed border-slate-300">
            {problem.category}
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-2 bg-[#2D3436] border-[3px] border-[#2D3436] rounded-xl text-white font-black shadow-neo-sm">
           <span className="font-mono text-sm">{problem.points} XP</span>
        </div>
      </div>

      <div className="mb-14 border-l-[12px] border-neo-purple pl-10">
        <h2 className="text-4xl md:text-6xl lg:text-7xl text-[#2D3436] leading-[0.95] tracking-tighter font-black uppercase">
          {problem.question}
        </h2>
      </div>

      {problem.visualData && (
        <div className="mb-14">
          <MathVisualAid data={problem.visualData} />
        </div>
      )}


      <div className="mt-auto">
        {problem.inputType === 'choice' && problem.options && problem.options.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problem.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setUserInput(opt.toString());
                  let isCorrect = false;
                  if (typeof problem.answer === 'number') {
                    isCorrect = parseFloat(opt.toString()) === problem.answer;
                  } else {
                    isCorrect = opt.toString().trim().toLowerCase() === problem.answer.toString().toLowerCase();
                  }

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
                className={`neo-btn min-h-[80px] p-6 text-xl md:text-2xl font-black shadow-neo flex items-center justify-start gap-4 active:shadow-none hover:shadow-neo-hover transition-all text-left ${
                  feedback === 'incorrect' && userInput === opt.toString() ? 'bg-neo-pink text-white shake scale-95' : 
                  feedback === 'correct' && (typeof problem.answer === 'number' ? parseFloat(opt.toString()) === problem.answer : opt.toString().toLowerCase() === problem.answer.toString().toLowerCase()) ? 'bg-neo-green text-white active:translate-y-0 translate-y-0 shadow-neo scale-105' : 'bg-white hover:bg-slate-50'
                }`}
              >
                <span className="bg-[#2D3436]/10 px-3 py-1 rounded-[12px] min-w-[40px] text-center">{choiceLabels[i]})</span>
                <span className="flex-1">{opt}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col sm:flex-row gap-6">
              <input
                autoFocus
                type={typeof problem.answer === 'number' ? "number" : "text"}
                step="any"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={feedback === 'correct'}
                placeholder={t.placeholder}
                className={`flex-1 bg-white border-[4px] border-[#2D3436] rounded-3xl px-8 py-8 text-4xl font-black focus:outline-none transition-all placeholder:text-slate-200 shadow-inner ${
                  feedback === 'correct' ? 'text-neo-green' : 
                  feedback === 'incorrect' ? 'text-neo-pink shake' :
                  'focus:ring-8 focus:ring-neo-purple/10'
                }`}
              />
              <button
                type="submit"
                disabled={!userInput || feedback === 'correct'}
                className="neo-btn bg-neo-purple text-white px-12 py-8 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:shadow-neo-sm h-[104px] text-2xl font-black"
              >
                <span>{t.submit}</span>
              </button>
            </div>
          </form>
        )}

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -20, rotate: feedback === 'correct' ? 5 : -5 }}
              animate={{ opacity: 1, scale: 1.1, y: -60, rotate: feedback === 'correct' ? 10 : -10 }}
              exit={{ opacity: 0, scale: 0.5, y: -100 }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 px-16 py-10 rounded-[40px] border-[6px] border-[#2D3436] shadow-neo z-50 ${
                feedback === 'correct' ? 'bg-neo-green' : 'bg-neo-pink text-white'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <span className="text-7xl font-black text-white">✓</span>
                  <span className="text-5xl font-black uppercase tracking-tight text-white">{t.correct}</span>
                  <div className="bg-white/20 px-6 py-2 rounded-full font-black text-white">+{problem.points} XP</div>
                </>
              ) : (
                <>
                  <span className="text-7xl font-black text-white">×</span>
                  <span className="text-4xl font-black uppercase tracking-tight text-white">{t.incorrect}</span>
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
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(4px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
          40%, 60% { transform: translate3d(6px, 0, 0); }
        }
      `}</style>
    </motion.div>
  );
};

