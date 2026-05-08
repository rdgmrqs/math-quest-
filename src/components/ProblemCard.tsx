import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MathProblem } from '../types.ts';
import { CheckCircle2, XCircle, ChevronRight, Zap, Brain, Hash, Layers } from 'lucide-react';

interface ProblemCardProps {
  problem: MathProblem;
  onSolve: (isCorrect: boolean) => void;
}

const MathVisualAid: React.FC<{ data: NonNullable<MathProblem['visualData']> }> = ({ data }) => {
  const getCellContent = (cell: string | number | null) => {
    if (cell === null || cell === '') return null;
    const strCell = cell.toString();

    if (strCell === '●' || strCell === '○') {
      return (
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-[3px] border-[#2D3436] shadow-sm ${strCell === '●' ? 'bg-neo-purple' : 'bg-white'}`} />
      );
    }
    if (strCell === '웃') return <span className="text-3xl md:text-4xl">웃</span>;
    if (strCell === '▣') return <div className="w-8 h-8 bg-neo-pink border-[3px] border-[#2D3436] rounded-sm transform rotate-12 shadow-neo-sm" />;
    if (strCell === 'target') return <div className="w-8 h-8 border-[3px] border-[#2D3436] border-dashed rounded-full opacity-30" />;
    if (strCell === '▩') return <div className="w-10 h-10 bg-neo-blue border-2 border-[#2D3436] grid grid-cols-2 p-1 shadow-neo-sm"><div className="bg-white/20" /><div /><div /><div className="bg-white/20" /></div>;
    if (strCell === '🥢') return <span className="text-4xl transform rotate-45 inline-block">🥢</span>;
    if (strCell === '|') return <div className="w-1.5 h-full bg-[#2D3436] opacity-40 rounded-full" />;
    if (strCell === '-') return <div className="h-1.5 w-full bg-[#2D3436] opacity-40 rounded-full" />;
    
    if (strCell === '🌊') return <span className="text-3xl animate-pulse">🌊</span>;
    if (strCell === '☆') return <span className="text-3xl text-neo-yellow drop-shadow-sm">★</span>;
    if (strCell === '☉') return <span className="text-3xl text-neo-pink">☉</span>;
    
    // Game Pieces
    const pieceMap: Record<string, string> = {
      'pawn': '♟', 'knight': '♞', 'bishop': '♝', 'rook': '♜', 'queen': '♛', 'king': '♚',
      'w-pawn': '♙', 'w-knight': '♘', 'w-bishop': '♗', 'w-rook': '♖', 'w-queen': '♕', 'w-king': '♔',
      'star': '★', 'diamond': '◆', 'circle': '●', 'square': '■'
    };

    if (pieceMap[strCell]) {
      return (
        <span className={`text-4xl md:text-6xl select-none  ${strCell.startsWith('w-') ? 'text-slate-400 drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]' : 'text-[#2D3436] drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]'}`}>
          {pieceMap[strCell]}
        </span>
      );
    }

    return <span className="text-xl md:text-2xl font-black drop-shadow-sm">{strCell}</span>;
  };

  if (data.type === 'row' && data.row) {
    return (
      <div className="flex flex-col items-center gap-6 py-10 bg-slate-100/30 backdrop-blur-sm rounded-[48px] border-4 border-dashed border-slate-200 w-full overflow-hidden relative">
        <div className="absolute top-4 left-6 flex items-center gap-2 opacity-30">
          <Layers size={14} className="text-[#2D3436]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pattern_Stream</span>
        </div>
        <div className="flex gap-4 justify-center flex-wrap px-8">
          {data.row.map((item, i) => {
            const isMarker = item === 'Y' || item === 'G' || item === 'R' || item === 'A' || item === 'V' || item === 'Vml';
            const colorClass = (item === 'G' || item === 'V') ? 'bg-neo-green' : 
                             (item === 'Y' || item === 'A') ? 'bg-neo-yellow' : 
                             (item === 'R' || item === 'Vml') ? 'bg-neo-pink' : 'bg-white';
            
            return (
              <motion.div 
                initial={{ y: 20, rotate: -5, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 12, delay: i * 0.05 }}
                key={i} 
                className={`w-20 h-20 md:w-24 md:h-24 border-[5px] border-[#2D3436] rounded-3xl flex items-center justify-center font-black shadow-neo-sm text-3xl ${colorClass} hover:-translate-y-1 transition-transform cursor-default relative group`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                {isMarker ? '' : getCellContent(item)}
              </motion.div>
            );
          })}
        </div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mt-2 italic">{data.label || 'SEQUENCE.LOGIC.INIT'}</p>
      </div>
    );
  }

  if (data.type === 'grid' && data.grid) {
    const rows = data.grid.length;
    const cols = data.grid[0].length;
    const isBoard = data.style === 'chess' || data.style === 'checkers' || data.style === 'senet' || data.style === 'yote';
    
    return (
      <div className={`flex flex-col items-center gap-6 py-12 rounded-[56px] border-[6px] border-[#2D3436] shadow-neo w-full relative overflow-hidden ${isBoard ? 'bg-[#1e293b]' : 'bg-white'}`}>
        <div className="absolute top-6 left-8 flex items-center gap-2 opacity-20">
          <Hash size={16} className={isBoard ? 'text-white' : 'text-[#2D3436]'} />
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isBoard ? 'text-white' : 'text-[#2D3436]'}`}>Matrix_Resolve</span>
        </div>

        <div 
          className={`grid p-8 border-[4px] border-[#2D3436] rounded-[40px] shadow-neo-sm relative z-10 ${isBoard ? 'gap-0 bg-slate-200' : 'gap-4 bg-slate-50'}`}
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` 
          }}
        >
          {data.grid.flat().map((cell, i) => {
            const rowIdx = Math.floor(i / cols);
            const colIdx = i % cols;
            const isDark = (rowIdx + colIdx) % 2 === 1;
            
            let cellBg = isBoard ? (isDark ? 'bg-slate-400' : 'bg-slate-100') : 'bg-white border-[4px] border-[#2D3436] font-display font-black shadow-neo-sm rounded-2xl hover:bg-slate-50 transition-colors';
            if (data.style === 'senet') {
              cellBg = isDark ? 'bg-[#D2B48C]' : 'bg-[#F5DEB3]';
              if (i === 26) cellBg = 'bg-blue-300';
              if (i === 25) cellBg = 'bg-yellow-200';
            }

            if (cell === null) cellBg = 'bg-transparent border-none shadow-none font-black text-slate-100';

            return (
              <div 
                key={i} 
                className={`${isBoard ? 'w-12 h-12 md:w-20 md:h-20' : 'w-16 h-16 md:w-24 md:h-24'} ${cell === null ? '' : 'border-[1px] border-[#2D3436]/10'} flex items-center justify-center relative overflow-hidden transition-all group ${cellBg}`}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.02 + 0.3 }}
                  className="z-10 group-hover:scale-110 transition-transform"
                >
                  {getCellContent(cell)}
                </motion.div>
                {isBoard && (
                   <span className="absolute bottom-1 right-2 text-[8px] opacity-10 font-mono font-black italic">
                     {String.fromCharCode(65 + colIdx)}{rows - rowIdx}
                   </span>
                )}
              </div>
            );
          })}
        </div>
        <div className={`text-[10px] font-black uppercase tracking-[0.5em] px-8 py-3 rounded-full border-[3px] border-[#2D3436] shadow-neo-sm z-10 ${isBoard ? 'bg-neo-yellow text-[#2D3436] rotate-1' : 'bg-white text-[#2D3436] -rotate-1'}`}>
           {data.label || (isBoard ? 'STRATEGIC_SIM_v4.2' : 'LOGIC_MAPPING_v1.0')}
        </div>
      </div>
    );
  }

  // Simplified other variants for size
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
      }, 2000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        onSolve(false);
        setFeedback(null);
      }, 1000);
    }
  };

  const choiceLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[48px] border-[10px] border-[#2D3436] shadow-neo-lg relative overflow-hidden flex flex-col min-h-[600px]"
    >
      {/* Decorative System Header */}
      <div className="bg-[#2D3436] px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-neo-pink" />
            <div className="w-2 h-2 rounded-full bg-neo-yellow" />
            <div className="w-2 h-2 rounded-full bg-neo-green" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-mono italic">Task.Simulation_OS.v4</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-[9px] font-black text-neo-green uppercase tracking-[0.3em] font-mono animate-pulse">Status: Processing</div>
        </div>
      </div>

      <div className="p-8 md:p-12 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`px-5 py-2.5 rounded-xl border-[3px] border-[#2D3436] font-black text-[10px] uppercase tracking-[0.2em] shadow-neo-sm italic ${
              problem.difficulty === 'easy' ? 'bg-neo-green text-[#2D3436]' :
              problem.difficulty === 'medium' ? 'bg-neo-yellow text-[#2D3436]' :
              'bg-neo-pink text-white'
            }`}>
              {t.difficulty[problem.difficulty]}
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-2.5 bg-[#2D3436] rounded-xl text-white font-black shadow-neo-sm">
             <Zap size={14} fill="currentColor" className="text-neo-yellow" />
             <span className="font-mono text-xs tracking-tighter uppercase">{problem.points} XP</span>
          </div>
        </div>

        <div className="mb-14 relative shrink-0">
          <div className="bg-slate-50 rounded-[32px] p-8 md:p-12 border-[4px] border-[#2D3436] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Brain size={160} />
            </div>
            <div className="flex flex-col gap-6 relative z-10">
              <h2 className="text-3xl md:text-5xl lg:text-7xl text-[#2D3436] leading-[0.85] tracking-tighter font-black uppercase italic">
                {problem.question}
              </h2>
            </div>
          </div>
        </div>

        {problem.visualData && (
          <div className="mb-14 flex-1">
            <MathVisualAid data={problem.visualData} />
          </div>
        )}

        <div className="mt-auto pt-10 shrink-0">
          {problem.inputType === 'choice' && problem.options && problem.options.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problem.options.map((opt, i) => (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
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
                      }, 2000);
                    } else {
                      setFeedback('incorrect');
                      setTimeout(() => {
                        onSolve(false);
                        setFeedback(null);
                      }, 1000);
                    }
                  }}
                  disabled={feedback === 'correct'}
                  className={`neo-btn min-h-[100px] p-6 text-xl md:text-3xl font-black shadow-neo-sm flex items-center justify-start gap-6 active:shadow-none transition-all text-left group overflow-hidden border-[6px] ${
                    feedback === 'incorrect' && userInput === opt.toString() ? 'bg-neo-pink text-white shake border-[#2D3436]' : 
                    feedback === 'correct' && (typeof problem.answer === 'number' ? parseFloat(opt.toString()) === problem.answer : opt.toString().toLowerCase() === problem.answer.toString().toLowerCase()) ? 'bg-neo-green text-white border-[#2D3436]' : 'bg-white hover:bg-slate-50 border-[#2D3436]'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-colors border-[4px] border-[#2D3436] ${
                    feedback === 'incorrect' && userInput === opt.toString() || feedback === 'correct' && (typeof problem.answer === 'number' ? parseFloat(opt.toString()) === problem.answer : opt.toString().toLowerCase() === problem.answer.toString().toLowerCase())
                    ? 'bg-black/20' : 'bg-white shadow-neo-sm'
                  }`}>
                    {choiceLabels[i]}
                  </div>
                  <span className="flex-1 tracking-tighter uppercase italic">{opt}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative group">
              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <input
                  autoFocus
                  type={typeof problem.answer === 'number' ? "number" : "text"}
                  step="any"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={feedback === 'correct'}
                  placeholder={t.placeholder}
                  className={`flex-1 bg-slate-50 border-[6px] border-[#2D3436] rounded-[40px] px-10 py-10 text-5xl md:text-7xl font-black focus:outline-none transition-all shadow-neo-sm tracking-tighter italic uppercase ${
                    feedback === 'correct' ? 'text-neo-green border-neo-green' : 
                    feedback === 'incorrect' ? 'text-neo-pink shake border-neo-pink' :
                    'focus:bg-white focus:shadow-neo'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!userInput || feedback === 'correct'}
                  className="bg-neo-purple text-white px-14 py-8 rounded-[40px] border-[6px] border-[#2D3436] flex items-center justify-center gap-4 h-auto text-4xl font-black italic uppercase tracking-tighter shadow-neo transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{t.submit}</span>
                  <CheckCircle2 size={40} strokeWidth={4} className="fill-current" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1.2, y: -80 }}
            exit={{ opacity: 0, scale: 0.5, y: -120 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 px-24 py-16 rounded-[64px] border-[10px] border-[#2D3436] shadow-neo z-[150] ${
              feedback === 'correct' ? 'bg-neo-green' : 'bg-neo-pink'
            }`}
          >
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 size={80} className="text-white" />
                <span className="text-6xl font-black uppercase tracking-tighter text-white block">{t.correct}</span>
              </>
            ) : (
              <>
                <XCircle size={80} className="text-white" />
                <span className="text-5xl font-black uppercase tracking-tighter text-white">{t.incorrect}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-3 flex shrink-0">
         <div className="flex-1 bg-neo-purple" />
         <div className="flex-1 bg-neo-pink" />
         <div className="flex-1 bg-neo-yellow" />
         <div className="flex-1 bg-neo-green" />
      </div>

      <style>{`
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
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
