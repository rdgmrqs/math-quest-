import React from 'react';
import { getRandomProblem } from './MathService.ts';
import { ProblemCard } from './components/ProblemCard.tsx';
import { StatsCard } from './components/StatsCard.tsx';
import { MathProblem, UserStats, MathMode } from './types.ts';
import { RefreshCw, Users, Settings, X, Volume2, VolumeX, Trash2, ChevronLeft, ChevronRight, Dices, Target, Trophy, Zap, Brain, Clock, HelpCircle, BookOpen, Play, Star, CheckCircle2, Heart, Hash, Search, ArrowRight, ArrowLeft, Lightbulb, ArrowUpRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_STATS: UserStats = {
  nickname: '',
  points: 0,
  problemsSolved: 0,
  level: 1,
  streak: 0,
};

const ALL_GAMES = [
  { 
    name: "Semaphore", 
    origin: "Strategy", 
    type: "3-in-a-row", 
    description: "A strategic 3-in-a-row game inspired by maritime flag signaling.",
    objective: "Create a straight line of 3 identical symbols.",
    strategy: "Control the center and corners to maximize connection possibilities.",
    rules: [
      "Objective: Get 3 of your shapes in a row (horizontal, vertical, or diagonal).",
      "The board is dynamic and inspired by semaphore flag positions.",
      "Players take turns placing their unique symbols on vacant intersections."
    ]
  },
  { 
    name: "Tracks", 
    origin: "Grid", 
    type: "Movement", 
    description: "A grid-based puzzle where you determine the correct path of animal tracks.",
    objective: "Form a continuous path from start to finish matching row/column counts.",
    strategy: "Start with rows or columns that have 0 or maximum required tracks.",
    rules: [
      "Connect the start and end points using animal tracks.",
      "The numbers on the sides of the grid indicate how many track segments are in that row/column.",
      "Tracks cannot overlap or jump across squares."
    ]
  },
  { 
    name: "Ouri", 
    origin: "Mancala", 
    type: "Seeds", 
    description: "An ancestral sowing game from the Mancala family played in West Africa.",
    objective: "Capture more than half of the total seeds (25 or more).",
    strategy: "Build up large groups of seeds to create multiple capture opportunities in one move.",
    rules: [
      "Sow seeds from one of your pits into subsequent pits in a counter-clockwise direction.",
      "If the last seed falls into an opponent's pit and results in 2 or 3 seeds, you capture them.",
      "The goal is to capture more seeds than your opponent."
    ]
  },
  { 
    name: "Product", 
    origin: "Calculation", 
    type: "Numbers", 
    description: "A mathematical challenge focusing on divisors and multiplication patterns.",
    objective: "Connect 4 numbers horizontally, vertically, or diagonally.",
    strategy: "Analyze which numbers have few prime factors to block your opponent's path.",
    rules: [
      "Select a number from the grid that is a product of two available factors.",
      "Strategically block your opponent by selecting numbers that limit their future options.",
      "Connect 4 numbers in a row to win."
    ]
  },
  { 
    name: "Dominorio", 
    origin: "Addition", 
    type: "Puzzle", 
    description: "A domino-styled puzzle where pieces must be placed to satisfy addition rules.",
    objective: "Complete the grid so all sums and adjacency rules are met.",
    strategy: "Look for high-value sums first as they have fewer possible combinations.",
    rules: [
      "Place dominoes so that adjacent numbers follow the required arithmetic operation.",
      "Maintain the specified sum for rows or columns as indicated.",
      "Fill the entire grid using the provided pieces."
    ]
  },
  { 
    name: "Alquerque", 
    origin: "Ancestral", 
    type: "Classic", 
    description: "An ancient Middle Eastern board game that is a predecessor to checkers.",
    objective: "Capture all opponent pieces or block them from moving.",
    strategy: "Keep your pieces consolidated to avoid giving away easy jumps.",
    rules: [
      "Pieces move along lines to adjacent empty points.",
      "Capture opponent pieces by jumping over them onto an empty point.",
      "Multi-jumps are mandatory if available."
    ]
  },
  { 
    name: "Flume", 
    origin: "Modern", 
    type: "Colors", 
    description: "A modern connection game focused on color flow and topology.",
    objective: "Create a continuous path of flow between the marked edges.",
    strategy: "Focus on the narrowest points of the board to block the opponent's flow early.",
    rules: [
      "Connect opposite sides of the board using a continuous flow of your color.",
      "Colors cannot cross paths but can flow adjacent to each other.",
      "Utilize topological shortcuts to outmaneuver your opponent."
    ]
  },
  { 
    name: "Hex", 
    origin: "Connection", 
    type: "Topology", 
    description: "A deep strategic game of connection where players attempt to complete a path across the board.",
    objective: "Connect your two color-coded sides of the hexagonal board.",
    strategy: "Create 'virtual connections' (two empty spaces that can connect in one move regardless of opponent response).",
    rules: [
      "Red attempts to connect top to bottom; Blue attempts to connect left to right.",
      "The first player to complete a continuous path of their color wins.",
      "Hex cannot end in a draw; one path will always be possible."
    ]
  },
  { 
    name: "Amazons", 
    origin: "Territory", 
    type: "Queens", 
    description: "A territorial conquest game played with chess queens on an oversized board.",
    objective: "Be the last player able to make a move.",
    strategy: "Try to wall off parts of the board where only you have queens present.",
    rules: [
      "Move your Queen like a chess queen to any square.",
      "After moving, the Queen must fire an 'arrow' from its new location to any reachable square.",
      "The target square of the arrow is blocked for the rest of the game."
    ]
  },
  { 
    name: "Advancement", 
    origin: "Race", 
    type: "Strategy", 
    description: "A race-style strategy game where calculated risks lead to victory.",
    objective: "Move all your pieces to the final destination before the opponent.",
    strategy: "Balance your advancement; leaving one piece behind makes it a target.",
    rules: [
      "Advance your pieces toward the finish line using dice rolls.",
      "Choose between moving safely or taking risks for greater advancement.",
      "Landed pieces can be captured if they occupy a vulnerable position."
    ]
  },
  { 
    name: "Labyrinth", 
    origin: "Wall", 
    type: "Logic", 
    description: "A logical navigation challenge through shifting walls and complex routes.",
    objective: "Reach the target exit in the fewest shifts possible.",
    strategy: "Think backwards from the exit to identify which walls must move first.",
    rules: [
      "Navigate from the start to the treasure using logic.",
      "Determine which walls can be shifted or rotated to clear your path.",
      "Avoid traps and dead ends by planning several moves ahead."
    ]
  },
  { 
    name: "Cats and Rats", 
    origin: "Asymmetric", 
    type: "Logic", 
    description: "An asymmetric logic game of pursuit and evasion on a hexagonal grid.",
    objective: "Rats: Escape the board. Cats: Trap all Rats.",
    strategy: "Cats should herd rats toward corners; Rats should stay in central open spaces.",
    rules: [
      "Rats win if they reach the escape holes; Cats win if they trap all rats.",
      "Cats move twice as fast but have limited maneuverability on specific terrain.",
      "Rats must work together to create diversions."
    ]
  },
  { 
    name: "Senet", 
    origin: "Egypt", 
    type: "Board", 
    description: "One of the oldest known board games, originating from Ancient Egypt.",
    objective: "Bear all your pieces off the board first.",
    strategy: "Use the protected squares (Ankh, Water, etc.) to shield your pieces from being swapped back.",
    rules: [
      "Move your pieces across the 30 squares in an S-shaped pattern.",
      "Throw casting sticks to determine movement distance.",
      "Some squares offer protection, while others are traps ('House of Water')."
    ]
  },
  { 
    name: "Alcuin of York", 
    origin: "Middle Ages", 
    type: "Riddles", 
    description: "A collection of river-crossing and distribution riddles from the Carolingian era.",
    objective: "Solve the crossing puzzle with constraints.",
    strategy: "Identify the 'neutral' item that can be left alone with anything (like the cabbage).",
    rules: [
      "Transport all items across the river following strict compatibility rules.",
      "Example: You cannot leave the wolf alone with the goat.",
      "Find the minimum number of trips required to succeed."
    ]
  },
  { 
    name: "Stomachion", 
    origin: "Archimedes", 
    type: "Geometry", 
    description: "A 14-piece geometric dissection puzzle attributed to Archimedes.",
    objective: "Form a square or specified shape using all 14 pieces.",
    strategy: "Place the largest and most irregular pieces first near the corners.",
    rules: [
      "Arrange the 14 irregular shapes into a perfect 12x12 square.",
      "Pieces cannot overlap and must fit exactly within the boundary.",
      "There are 17,152 distinct ways to solve the square!"
    ]
  },
  { 
    name: "15 Puzzle", 
    origin: "Sliding", 
    type: "Classic", 
    description: "The classic sliding tile challenge where you reorder numbers in a 4x4 grid.",
    objective: "Arrange tiles in numerical order from top-left.",
    strategy: "Solve row by row, then the last two rows together column by column.",
    rules: [
      "Slide tiles into the empty space to reorder them.",
      "Organize the tiles from 1 to 15 in sequential order.",
      "The empty space should end up in the bottom-right corner."
    ]
  },
  { 
    name: "Tangram", 
    origin: "China", 
    type: "Geometry", 
    description: "A Chinese dissection puzzle consisting of seven flat shapes called tans.",
    objective: "Recreate a shadow shape using all seven pieces.",
    strategy: "The two large triangles usually form the 'bulk' or the longest straight edge.",
    rules: [
      "Use all seven pieces exactly once to create a specific silhouette.",
      "The pieces must touch but not overlap.",
      "Rotating and flipping pieces is allowed."
    ]
  },
  { 
    name: "Polyminoes", 
    origin: "Tiles", 
    type: "Shapes", 
    description: "A tiling puzzle using shapes made of connected equal-sized squares.",
    objective: "Fit all pieces into a given rectangular area.",
    strategy: "Save the smallest/simplest pieces (like I-tetrominoes) for the end to fill gaps.",
    rules: [
      "Cover a defined area completely using a specific set of polyminoes.",
      "Holes or empty gaps are not permitted.",
      "Try to find the most efficient placement for complex shapes."
    ]
  },
  { 
    name: "Magic Squares", 
    origin: "Numbers", 
    type: "Logic", 
    description: "A numerical grid where columns, rows, and diagonals sum to the same magic constant.",
    objective: "Fill the grid so every row, column and diagonal has the same sum.",
    strategy: "For odd-sized squares, the Siamese method (placing 1 in the top-middle) works every time.",
    rules: [
      "Place integers into the grid so that every row and column sums to the same value.",
      "Include the diagonals in this requirement.",
      "Each number must be used exactly once."
    ]
  },
  { 
    name: "Sam Loyd", 
    origin: "Puzzle", 
    type: "Brain Teaser", 
    description: "Brain-teasers and mathematical curiosities from the famous American puzzler.",
    objective: "Determine the hidden solution to the logic puzzle.",
    strategy: "Think literally first, then metaphorically; Loyd's puzzles often have double meanings.",
    rules: [
      "Read the riddle carefully to identify the hidden logic.",
      "Often involves lateral thinking or wordplay.",
      "Enter the numeric or textual answer to solve."
    ]
  },
  { 
    name: "Einstein's Riddle", 
    origin: "Logic", 
    type: "Deduction", 
    description: "A complex deductive logic puzzle often attributed to Albert Einstein.",
    objective: "Determine which person owns the fish using a set of 15 clues.",
    strategy: "Create a grid of 5x5. Fill in the 'fixed' clues first, then look for 'neighbor' clues that only have one possible location.",
    rules: [
      "Use a grid to cross-reference multiple categories (e.g., color, pet, drink).",
      "Apply the logic clues one by one to eliminate impossibilities.",
      "The goal is to determine which specific person owns the fish."
    ],
    guideSteps: [
      {
        title: "The Base Grid",
        desc: "Start with 5 houses in a row. Each has a color, owner, pet, drink, and cigarette brand.",
        visual: "houses_row"
      },
      {
        title: "The Fixed Clue",
        desc: "Clue 9: 'The Norwegian lives in the first house.' Place 'Norwegian' in House 1 immediately.",
        visual: "fixed_placement"
      },
      {
        title: "Relational Clues",
        desc: "Clue 4: 'The green house is on the left of the white house.' This means they must be at 2-3 or 3-4 or 4-5.",
        visual: "neighbor_deduction"
      },
      {
        title: "The Chain Reaction",
        desc: "Combining 'Norwegian in H1' and 'H2 is blue' (Clue 14) starts a cascade of discoveries.",
        visual: "clue_chain"
      }
    ]
  },
  { 
    name: "Sokoban", 
    origin: "Warehouse", 
    type: "Boxes", 
    description: "A warehouse puzzle where you push boxes to target locations without getting stuck.",
    rules: [
      "Push boxes onto all marked target locations.",
      "You can only push one box at a time and cannot pull them.",
      "Avoid pushing boxes into corners from which they cannot be moved."
    ]
  },
  { 
    name: "Arbusto", 
    origin: "Fractals", 
    type: "Growth", 
    description: "A fractal growth visualization exploring recursive patterns.",
    objective: "Master the parameters of geometric growth to create complex systems.",
    strategy: "Small changes in angle can lead to massive global changes in the fractal. Experiment with ratios.",
    rules: [
      "Select a growth rule (scale and angle) for the branches.",
      "Observe how the shape changes across multiple generations.",
      "Balance complexity and symmetry to create artistic trees."
    ]
  },
  { 
    name: "Chaos Game", 
    origin: "Fractals", 
    type: "Chaos", 
    description: "A method of creating fractals through random points and simple rules.",
    objective: "Generate stable patterns (Attractors) through recursive randomness.",
    strategy: "Ensure the 'jump factor' is set appropriately (usually 0.5) to reveal Sierpinski-like structures.",
    rules: [
      "Pick a starting point inside a polygon.",
      "Roll a die and move halfway toward the corresponding vertex.",
      "Repeat thousands of times to reveal an intricate fractal pattern."
    ]
  },
  { 
    name: "Sudoku", 
    origin: "Japan", 
    type: "Numbers", 
    description: "The world-famous Japanese number placement puzzle based on logic.",
    objective: "Fill all empty cells with numbers 1-9 following grid constraints.",
    strategy: "Use 'Pencil Marks' to track possibilities in each cell. Look for 'Naked Pairs' (two cells in a row with the same two possibilities).",
    rules: [
      "Fill the 9x9 grid so that every row and column contains digits 1-9.",
      "Each of the nine 3x3 subgrids must also contain digits 1-9.",
      "No digit can be repeated in any row, column, or subgrid."
    ],
    guideSteps: [
      {
        title: "Scanning Rows/Cols",
        desc: "Look at a single number (e.g., 5). Follow its row and column to see where it *cannot* be in a 3x3 box.",
        visual: "scanning"
      },
      {
        title: "The Lone Ranger",
        desc: "If only one cell in a 3x3 box can contain a specific number after scanning, that's where it goes!",
        visual: "lone_placement"
      },
      {
        title: "Naked Pairs",
        desc: "If two cells in a row only have two possible numbers (e.g., 2 and 7), you can remove 2 and 7 from all other cells in that row.",
        visual: "naked_pair"
      },
      {
        title: "The 3x3 Restriction",
        desc: "A number must appear exactly once in each 3x3 block. Use this to cross-reference with rows and columns.",
        visual: "box_logic"
      }
    ]
  },
  { 
    name: "Nim", 
    origin: "Theory", 
    type: "Logic", 
    description: "A mathematical game of strategy where players take turns removing objects from piles.",
    objective: "Varies; either take the last object or force the opponent to take it.",
    strategy: "Convert pile counts to binary. If the XOR sum (Nim-Sum) is 0, the current player is in a losing position.",
    rules: [
      "On your turn, remove any number of objects from a single pile.",
      "Normal play: The player who takes the last object wins.",
      "Misere play: The player who takes the last object loses."
    ]
  },
  { 
    name: "Game of 24", 
    origin: "Quick Math", 
    type: "Numbers", 
    description: "A mental math challenge: reach exactly 24 using four numbers and basic operations.",
    objective: "Create an expression that equals 24 using all four numbers.",
    strategy: "Work backward from 24. Think of factors like 8x3, 6x4, or 12x2.",
    rules: [
      "Use all four given numbers exactly once.",
      "Apply addition, subtraction, multiplication, or division.",
      "Parentheses can be used to reorder operations."
    ]
  },
  { 
    name: "Tantrix", 
    origin: "New Zealand", 
    type: "Patterns", 
    description: "A pattern-matching game of colorful connecting loops from New Zealand.",
    objective: "Form the longest possible path or loop of your assigned color.",
    strategy: "Block opponent paths by creating 'Forced Spaces' where only your tile colors can fit.",
    rules: [
      "Place hexagonal tiles so that all touching colors match.",
      "Build toward creating the longest continuous line or loop of your color.",
      "Forced moves must be played immediately."
    ]
  },
  { 
    name: "Azumetria", 
    origin: "Art", 
    type: "Geometry", 
    description: "A journey through geometric art and the math of symmetry.",
    objective: "Identify and complete symmetrical geometric patterns.",
    strategy: "Focus on the central axis or vertex to determine if rotation or reflection is the primary symmetry.",
    rules: [
      "Identify the type of symmetry present in the geometric pattern.",
      "Rotate or reflect elements to restore the pattern's balance.",
      "Explore how light and geometry interact."
    ]
  },
  { 
    name: "Fibonacci (Flower)", 
    origin: "Nature", 
    type: "Patterns", 
    description: "Exploration of the golden ratio and phyllotaxis patterns in nature.",
    objective: "Optimize seed distribution using the Golden Angle (approx 137.5°).",
    strategy: "Change the angle by tiny increments to see how quickly the 'holes' appear or disappear in the distribution.",
    rules: [
      "Adjust the divergence angle to see how seeds pack together.",
      "Count the clockwise and counter-clockwise spirals.",
      "Observe that the counts are almost always consecutive Fibonacci numbers."
    ]
  }
];

interface LeaderboardEntry {
  nickname: string;
  points: number;
  problemsSolved: number;
  streak: number;
  level: number;
}

// Floating FX Components
const LevelUpOverlay: React.FC<{ level: number }> = ({ level }) => {
  const rankInfo = React.useMemo(() => {
    if (level <= 5) return { title: "Novice", color: "bg-neo-blue", icon: "🌱", next: "Arithmetic Patterns" };
    if (level <= 10) return { title: "Apprentice", color: "bg-neo-green", icon: "📜", next: "Geometric Logic" };
    if (level <= 15) return { title: "Adept", color: "bg-neo-yellow", icon: "🛡️", next: "Complex Puzzles" };
    if (level <= 20) return { title: "Scholar", color: "bg-neo-orange", icon: "🏛️", next: "Theory of Nim" };
    if (level <= 25) return { title: "Sage", color: "bg-neo-purple", icon: "🔮", next: "Archimedes' Secrets" };
    return { title: "Grandmaster", color: "bg-neo-pink", icon: "👑", next: "The Infinite Quest" };
  }, [level]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2D3436]/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -20, y: 100 }}
        animate={{ scale: 1, rotate: 0, y: 0 }}
        exit={{ scale: 1.2, opacity: 0, y: -100 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative"
      >
        {/* Background Flare */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
          className="absolute -inset-20 bg-gradient-to-r from-neo-purple/20 via-white/10 to-neo-blue/20 blur-3xl rounded-full"
        />

        <div className="relative bg-white p-12 rounded-[48px] border-[8px] border-[#2D3436] shadow-neo text-center space-y-6 max-w-sm overflow-hidden">
          {/* Confetti Particles */}
          <div className="absolute inset-0 pointer-events-none">
             {[...Array(16)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ scale: 0, x: 0, y: 0 }}
                 animate={{ 
                   scale: [0, 1, 0],
                   x: (Math.random() - 0.5) * 600,
                   y: (Math.random() - 0.5) * 600,
                   rotate: Math.random() * 360
                 }}
                 transition={{ 
                   duration: 2, 
                   delay: (i * 0.1),
                   repeat: Infinity,
                   repeatDelay: 0.5
                 }}
                 className={`absolute left-1/2 top-1/2 w-4 h-4 rounded-sm transform -translate-x-1/2 -translate-y-1/2 ${
                   ['bg-neo-purple', 'bg-neo-pink', 'bg-neo-yellow', 'bg-neo-blue', 'bg-neo-green'][i % 5]
                 } border-2 border-[#2D3436]`}
               />
             ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-28 h-28 ${rankInfo.color} rounded-[32px] mx-auto flex items-center justify-center border-[6px] border-[#2D3436] shadow-neo-sm -mt-24 mb-6 relative z-10 overflow-hidden group`}
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl drop-shadow-sm select-none"
            >
              {rankInfo.icon}
            </motion.div>
          </motion.div>

          <div className="space-y-4 relative z-10">
            <div>
              <motion.h2 
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                className="text-6xl font-black uppercase tracking-tighter italic text-[#2D3436] leading-none mb-1"
              >
                Level Up!
              </motion.h2>
              <div className={`inline-block ${rankInfo.color} text-[#2D3436] px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] border-2 border-[#2D3436] shadow-neo-sm`}>
                Rank: {rankInfo.title}
              </div>
            </div>

            <div className="py-2">
              <span className="text-9xl font-black text-neo-purple tracking-tighter tabular-nums block leading-none">
                {level}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-3xl border-3 border-dashed border-slate-200">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 italic">Incoming Challenge</p>
               <p className="text-sm font-black text-[#2D3436] uppercase">{rankInfo.next}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FloatingXP: React.FC<{ amount: number; onComplete: () => void }> = ({ amount, onComplete }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0.5 }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      y: -250, 
      scale: [0.5, 1.5, 1.5, 1],
      rotate: [0, -5, 5, 0]
    }}
    transition={{ duration: 1, ease: "easeOut" }}
    onAnimationComplete={onComplete}
    className="fixed left-1/2 bottom-1/2 -translate-x-1/2 z-[100] pointer-events-none"
  >
    <div className="bg-neo-yellow text-[#2D3436] px-6 py-3 rounded-2xl border-[4px] border-[#2D3436] font-black shadow-neo flex items-center gap-2 text-2xl">
      <Zap size={24} className="fill-current" />
      +{amount} XP
    </div>
  </motion.div>
);

const FloatingCoin: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      scale: [0, 1.2, 1, 0.5],
      y: -500,
      x: (Math.random() - 0.5) * 600,
      rotate: Math.random() * 360
    }}
    transition={{ duration: 1.5, ease: "circOut" }}
    onAnimationComplete={onComplete}
    className="fixed left-1/2 bottom-[30%] -translate-x-1/2 z-[90] pointer-events-none"
  >
    <div className="w-10 h-10 bg-neo-yellow rounded-full border-[3px] border-[#2D3436] flex items-center justify-center shadow-neo-sm">
      <div className="w-5 h-5 border-2 border-[#2D3436] rounded-full flex items-center justify-center font-black text-[10px]">$</div>
    </div>
  </motion.div>
);

const GameCard: React.FC<{ 
  game: typeof ALL_GAMES[0]; 
  isSelected: boolean; 
  onSelect: () => void;
  onHelp: () => void;
  playSfx: (type: 'success' | 'error' | 'click' | 'level-up') => void;
}> = ({ game, isSelected, onSelect, onHelp, playSfx }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const showDetail = isSelected || isHovered;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        playSfx('click');
        onSelect();
      }}
      className={`neo-card p-5 cursor-pointer transition-all border-[4px] h-full relative ${
        isSelected 
          ? 'bg-neo-purple text-white border-[#2D3436] shadow-[0_0_20px_rgba(155,126,255,0.4)] ring-4 ring-neo-purple/20' 
          : 'bg-white hover:bg-slate-50 border-[#2D3436]/10 hover:border-[#2D3436]/30'
      }`}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          playSfx('click');
          onHelp();
        }}
        className={`absolute top-4 right-4 p-2 rounded-xl border-2 transition-all z-10 ${
          isSelected 
            ? 'bg-white/20 border-white/40 hover:bg-white/30' 
            : 'bg-slate-50 border-slate-200 hover:border-neo-purple text-neo-purple'
        }`}
        title="View Rules"
      >
        <HelpCircle size={16} />
      </button>

      <div className="flex justify-between items-start mb-3">
        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
          isSelected ? 'bg-white/20 border-white/40' : 'bg-[#2D3436]/5 border-[#2D3436]/10'
        }`}>
          {game.type}
        </span>
        <span className="text-[8px] font-bold opacity-40 uppercase mr-8">{game.origin}</span>
      </div>
      <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">{game.name}</h4>
      
      <p className={`text-xs font-bold leading-relaxed mb-4 line-clamp-2 ${isSelected ? 'opacity-90' : 'opacity-60'}`}>
        {game.description}
      </p>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-[#2D3436]/5">
        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-neo-purple'}`} />
        <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-500'}`}>
          {isSelected ? 'Currently Selected' : `Explore ${game.type}`}
        </span>
      </div>
    </motion.div>
  );
};

const GameInteractivePreview: React.FC<{ type: string; gameName: string }> = ({ type, gameName }) => {
  // A small interactive preview that shows the core "logic" of the game type
  const [step, setStep] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  if (type === '3-in-a-row' || type === 'Connection' || type === 'Topology') {
    return (
      <div className="w-full h-32 bg-slate-100 rounded-2xl border-2 border-[#2D3436] flex items-center justify-center gap-2 overflow-hidden relative group">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ 
              scale: step >= i ? 1 : 0.8,
              opacity: step >= i ? 1 : 0.2,
              backgroundColor: step === 3 && i === 2 ? '#B9FF33' : (i % 2 === 0 ? '#9D7EFE' : '#FF7EB6')
            }}
            className="w-12 h-12 rounded-xl border-4 border-[#2D3436] shadow-neo-sm"
          />
        ))}
        {step === 3 && (
          <motion.div 
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1 }} 
            className="absolute h-2 w-48 bg-[#2D3436] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full origin-left"
          />
        )}
      </div>
    );
  }

  if (type === 'Numbers' || type === 'Calculation') {
    return (
      <div className="w-full h-32 bg-slate-900 rounded-2xl border-2 border-[#2D3436] flex flex-col items-center justify-center p-4">
        <div className="flex gap-2">
           <motion.div animate={{ y: step === 0 ? -10 : 0 }} className="text-2xl font-black text-neo-blue">12</motion.div>
           <div className="text-2xl font-black text-white">×</div>
           <motion.div animate={{ y: step === 1 ? -10 : 0 }} className="text-2xl font-black text-neo-pink">?</motion.div>
           <div className="text-2xl font-black text-white">=</div>
           <motion.div animate={{ scale: step === 2 ? 1.2 : 1 }} className="text-2xl font-black text-neo-green">24</motion.div>
        </div>
        <div className="text-[10px] font-black text-slate-500 mt-2 uppercase tracking-[0.3em]">CALC.MODE.ACTIVE</div>
      </div>
    );
  }

  if (type === 'Sliding' || type === 'Movement') {
    return (
      <div className="w-full h-32 bg-slate-100 rounded-2xl border-2 border-[#2D3436] grid grid-cols-3 p-2 gap-1 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              x: i === 4 && step === 1 ? 40 : (i === 5 && step === 1 ? -40 : 0),
              backgroundColor: i === 8 ? 'transparent' : '#fff'
            }}
            className={`w-full h-full rounded border-2 border-[#2D3436] flex items-center justify-center ${i === 8 ? 'border-dashed opacity-20' : ''}`}
          >
            {i !== 8 && <span className="text-xs font-black">{i + 1}</span>}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-32 bg-slate-50 rounded-2xl border-2 border-[#2D3436] border-dashed flex flex-col items-center justify-center p-4">
      <div className="flex gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
           <Dices size={32} className="text-neo-purple" />
        </motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
           <Brain size={32} className="text-neo-pink" />
        </motion.div>
      </div>
      <span className="text-[8px] font-black uppercase mt-3 opacity-30 italic">Interactive simulation of {gameName} logic</span>
    </div>
  );
};

const GameGuideVisual: React.FC<{ gameName: string; step: number; visualType: string }> = ({ gameName, step, visualType }) => {
  if (gameName === 'Sudoku') {
    return (
      <div className="relative w-full aspect-square max-w-[200px] grid grid-cols-3 grid-rows-3 gap-1 bg-[#2D3436] p-1 rounded-sm">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className={`bg-white rounded-[2px] flex items-center justify-center font-black text-xl relative ${
              visualType === 'scanning' && (i === 1 || i === 4 || i === 7 || i === 3 || i === 4 || i === 5) ? 'bg-rose-100' : ''
            }`}
          >
            {i === 4 && visualType === 'scanning' && <span className="text-[#2D3436] opacity-20">5?</span>}
            {i === 4 && visualType === 'lone_placement' && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-neo-pink">5</motion.span>
            )}
            {i === 0 && visualType === 'naked_pair' && <span className="text-[10px] text-slate-400">2,7</span>}
            {i === 1 && visualType === 'naked_pair' && <span className="text-[10px] text-slate-400">2,7</span>}
            {visualType === 'box_logic' && i === 8 && <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity }} className="w-full h-full bg-neo-yellow/30" />}
          </motion.div>
        ))}
        {visualType === 'scanning' && (
          <>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="absolute h-1 bg-neo-pink/40 top-1/2 left-0 right-0 -translate-y-1/2" />
            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="absolute w-1 bg-neo-pink/40 top-0 bottom-0 left-1/2 -track-x-1/2" />
          </>
        )}
      </div>
    );
  }

  if (gameName === "Einstein's Riddle") {
    return (
      <div className="flex gap-2 items-end justify-center w-full max-w-sm h-32">
        {[1, 2, 3, 4, 5].map((h) => (
          <motion.div
            key={h}
            animate={{ 
              height: h === 1 && visualType === 'fixed_placement' ? '100%' : '60%',
              backgroundColor: h === 2 && visualType === 'neighbor_deduction' ? '#FF7EB6' : (h === 3 && visualType === 'neighbor_deduction' ? '#fff' : '#fff'),
              borderColor: (h === 1 && visualType === 'fixed_placement') || ((h === 2 || h === 3) && visualType === 'neighbor_deduction') ? '#2D3436' : '#2D343633'
            }}
            className="w-12 border-4 border-b-0 rounded-t-xl relative flex flex-col items-center justify-end p-2"
          >
            <span className="text-[8px] font-black opacity-20 absolute -top-4">H{h}</span>
            {h === 1 && visualType === 'houses_row' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs">🏠</motion.div>}
            {h === 1 && (visualType === 'fixed_placement' || visualType === 'clue_chain') && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[8px] font-black text-neo-purple text-center leading-tight">NORW.</motion.div>
            )}
            {h === 2 && visualType === 'clue_chain' && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-[8px] font-black text-neo-blue text-center leading-tight">BLUE</motion.div>
            )}
            {visualType === 'neighbor_deduction' && h === 2 && <span className="text-[8px] font-black text-white">GREEN</span>}
            {visualType === 'neighbor_deduction' && h === 3 && <span className="text-[8px] font-black">WHITE</span>}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
         <Dices size={32} className="text-neo-purple" />
      </motion.div>
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
         <Brain size={32} className="text-neo-pink" />
      </motion.div>
    </div>
  );
};

const GameTutorialModal: React.FC<{ 
  game: typeof ALL_GAMES[0]; 
  onClose: () => void;
  onStart?: (game: typeof ALL_GAMES[0]) => void;
  playSfx: (type: 'success' | 'error' | 'click' | 'level-up') => void;
  t: any;
}> = ({ game, onClose, onStart, playSfx, t }) => {
  const [activeTab, setActiveTab] = React.useState<'rules' | 'strategy' | 'guide'>('rules');
  const [guideStep, setGuideStep] = React.useState(0);

  const hasGuide = !!(game as any).guideSteps;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2D3436]/95 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, rotate: 1 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        className="bg-white rounded-[48px] border-[10px] border-[#2D3436] shadow-neo-lg max-w-xl w-full relative h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Modal System Header */}
        <div className="bg-[#2D3436] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neo-purple" />
              <div className="w-2 h-2 rounded-full bg-neo-pink" />
              <div className="w-2 h-2 rounded-full bg-neo-yellow" />
            </div>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-mono italic">Game.Guide_Module.v1</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[9px] font-black text-neo-purple uppercase tracking-[0.3em] font-mono whitespace-nowrap">ID_{game.name.substring(0, 3).toUpperCase()}</div>
          </div>
        </div>

        {/* Header Section */}
        <div className="p-8 pb-4 relative shrink-0">
          <button 
            onClick={() => {
              playSfx('click');
              onClose();
            }}
            className="absolute top-6 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all hover:rotate-90 z-20 shadow-sm"
          >
            <X size={24} className="text-[#2D3436]" />
          </button>

          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              className="w-20 h-20 bg-neo-purple rounded-3xl flex items-center justify-center border-[5px] border-[#2D3436] shadow-neo-sm shrink-0"
            >
              <BookOpen size={36} className="text-white" />
            </motion.div>
            <div className="flex flex-col">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-[#2D3436]">
                {game.name}
              </h2>
              <div className="flex gap-3 mt-3">
                <span className="text-[10px] font-black uppercase px-3 py-1 bg-neo-blue/10 text-neo-blue rounded-full border-2 border-neo-blue/20">{game.type}</span>
                <span className="text-[10px] font-black uppercase px-3 py-1 bg-slate-50 text-slate-500 rounded-full border-2 border-slate-200">{game.origin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-10 border-b-4 border-[#2D3436]/10 shrink-0 overflow-x-auto no-scrollbar gap-2">
          <button 
            onClick={() => { playSfx('click'); setActiveTab('rules'); }}
            className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap group ${activeTab === 'rules' ? 'text-neo-purple' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="relative z-10">{t.tutorial.howToPlay}</span>
            {activeTab === 'rules' && <motion.div layoutId="tab-pill" className="absolute inset-0 bg-neo-purple/10 rounded-t-xl" />}
            {activeTab === 'rules' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-neo-purple rounded-full" />}
          </button>
          
          {hasGuide && (
            <button 
              onClick={() => { playSfx('click'); setActiveTab('guide'); }}
              className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap group ${activeTab === 'guide' ? 'text-neo-pink' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className="relative z-10">Training Guide</span>
              {activeTab === 'guide' && <motion.div layoutId="tab-pill" className="absolute inset-0 bg-neo-pink/10 rounded-t-xl" />}
              {activeTab === 'guide' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-neo-pink rounded-full" />}
            </button>
          )}

          <button 
            onClick={() => { playSfx('click'); setActiveTab('strategy'); }}
            className={`px-6 py-5 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap group ${activeTab === 'strategy' ? 'text-neo-purple' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="relative z-10">{t.tutorial.strategyTab}</span>
            {activeTab === 'strategy' && <motion.div layoutId="tab-pill" className="absolute inset-0 bg-neo-purple/10 rounded-t-xl" />}
            {activeTab === 'strategy' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-neo-purple rounded-full" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar text-[#2D3436]">
          <AnimatePresence mode="wait">
            {activeTab === 'rules' ? (
              <motion.div 
                key="rules"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="p-8 bg-slate-50 rounded-[32px] border-[4px] border-dashed border-[#2D3436]/10 relative group overflow-hidden">
                  <Quote size={80} className="absolute -top-4 -right-4 text-[#2D3436]/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                  <p className="text-slate-600 font-bold text-xl md:text-2xl italic leading-tight relative z-10">
                    "{game.description}"
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neo-pink rounded-full" />
                    <h3 className="text-xl font-black uppercase tracking-tight italic">
                      Logic Parameters
                    </h3>
                  </div>
                  <ul className="grid gap-4">
                    {(game as any).rules?.map((rule: string, i: number) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 bg-white border-[4px] border-[#2D3436] rounded-3xl shadow-neo-sm flex gap-6 items-center group hover:bg-slate-50 transition-all hover:-translate-x-1"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-[#2D3436] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-neo-sm transform -rotate-3 group-hover:rotate-0 transition-transform">{i + 1}</div>
                        <span className="text-base font-black tracking-tight leading-tight">{rule}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : activeTab === 'guide' ? (
              <motion.div
                key="guide"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 space-y-10">
                  <div className="flex items-center justify-between bg-neo-pink/5 p-4 rounded-2xl border-2 border-dashed border-neo-pink/20">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic text-neo-pink leading-none">
                      { (game as any).guideSteps[guideStep].title }
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black bg-[#2D3436] text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-neo-sm">
                        Step 0{guideStep + 1}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-[#2D3436] rounded-[48px] border-[8px] border-[#2D3436] overflow-hidden shadow-neo-lg min-h-[260px] flex items-center justify-center relative p-10 group">
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[length:30px_30px] group-hover:scale-110 transition-transform duration-1000" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)' }} />
                    <GameGuideVisual 
                      gameName={game.name} 
                      step={guideStep} 
                      visualType={(game as any).guideSteps[guideStep].visual} 
                    />
                  </div>

                  <div className="p-8 bg-rose-50 border-[5px] border-[#2D3436] rounded-[32px] relative shadow-neo-sm">
                    <div className="absolute -top-5 left-8 w-12 h-12 bg-neo-pink border-[4px] border-[#2D3436] rounded-2xl flex items-center justify-center shadow-neo transform -rotate-12 group-hover:rotate-0 transition-transform">
                      <Lightbulb size={24} className="text-white" />
                    </div>
                    <p className="font-bold text-[#2D3436] text-lg md:text-xl leading-snug italic pt-2">
                      { (game as any).guideSteps[guideStep].desc }
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 mt-12 pt-8 border-t-4 border-slate-50 shrink-0">
                  <button
                    onClick={() => { playSfx('click'); setGuideStep(s => Math.max(0, s - 1)); }}
                    disabled={guideStep === 0}
                    className="p-6 bg-white border-[5px] border-[#2D3436] rounded-3xl shadow-neo hover:-translate-y-2 transition-all active:translate-y-0 disabled:opacity-30 disabled:hover:translate-y-0 disabled:shadow-none"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={() => {
                      playSfx('click');
                      if (guideStep < (game as any).guideSteps.length - 1) {
                        setGuideStep(s => s + 1);
                      } else {
                        setActiveTab('rules');
                      }
                    }}
                    className="flex-1 p-6 bg-neo-pink text-white border-[5px] border-[#2D3436] rounded-3xl shadow-neo font-black uppercase text-base tracking-widest hover:-translate-y-2 transition-all active:translate-y-0 flex items-center justify-center gap-4"
                  >
                    <span className="italic">{guideStep < (game as any).guideSteps.length - 1 ? 'Execute Next Phase' : 'Data Synchronized'}</span>
                    <ChevronRight size={28} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="strategy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neo-yellow rounded-full" />
                    <h3 className="text-xl font-black uppercase tracking-tight italic">
                      Mission Objective
                    </h3>
                  </div>
                  <div className="p-8 bg-neo-yellow/10 border-[5px] border-[#2D3436] rounded-[40px] relative overflow-hidden group shadow-neo-sm hover:shadow-neo transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neo-yellow opacity-10 rounded-bl-full transform transition-transform group-hover:scale-125" />
                    <p className="text-xl md:text-2xl font-black tracking-tight text-[#2D3436] leading-tight flex gap-6 italic">
                       <span className="text-4xl">🎯</span>
                       {(game as any).objective || "Achieve the target state using strategic logic."}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-neo-purple rounded-full" />
                    <h3 className="text-xl font-black uppercase tracking-tight italic leading-tight">
                      System Simulation
                    </h3>
                  </div>
                  
                  {/* Real Interactive Preview */}
                  <div className="border-[6px] border-[#2D3436] rounded-[48px] overflow-hidden shadow-neo-sm transform hover:scale-[1.01] transition-transform">
                    <GameInteractivePreview type={game.type} gameName={game.name} />
                  </div>

                  <div className="p-8 bg-neo-purple/5 border-4 border-dashed border-neo-purple/20 rounded-[40px] mt-8 group">
                    <div className="flex gap-6">
                      <div className="w-16 h-16 bg-white border-[4px] border-[#2D3436] rounded-[24px] flex items-center justify-center shrink-0 shadow-neo-sm group-hover:rotate-6 transition-transform">
                         <Brain size={32} className="text-neo-purple" />
                      </div>
                      <p className="text-base md:text-lg font-bold text-slate-700 leading-snug pt-1 italic">
                        {(game as any).strategy || "Explore the mathematical patterns within the game to find the optimal path to victory."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-10 pt-0 shrink-0 text-[#2D3436]">
          <button
            onClick={() => {
              playSfx('click');
              if (onStart) {
                onStart(game);
              } else {
                onClose();
              }
            }}
            className="bg-neo-green text-[#2D3436] w-full py-6 rounded-[32px] border-[6px] border-[#2D3436] text-2xl font-black flex items-center justify-center gap-4 transition-all shadow-neo hover:-translate-y-2 active:translate-y-0 italic uppercase tracking-tighter"
          >
            <Play size={28} fill="currentColor" />
            <span>{t.tutorial.readyToPlay}</span>
          </button>
        </div>

        {/* Bottom Deco Bar */}
        <div className="h-4 flex shrink-0 mt-auto border-t-[4px] border-[#2D3436]">
          <div className="flex-1 bg-neo-purple" />
          <div className="flex-1 bg-neo-pink" />
          <div className="flex-1 bg-neo-yellow" />
          <div className="flex-1 bg-neo-green" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [stats, setStats] = React.useState<UserStats>(() => {
    const saved = localStorage.getItem('math-quest-stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard' | 'random'>('random');
  const [gameMode, setGameMode] = React.useState<MathMode>('mixed');
  const [currentProblem, setCurrentProblem] = React.useState<MathProblem>(() => {
    const saved = localStorage.getItem('math-quest-stats');
    const level = saved ? JSON.parse(saved).level : 1;
    return getRandomProblem(undefined, level, 'mixed');
  });
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = React.useState(false);
  const [nicknameInput, setNicknameInput] = React.useState('');
  const [nicknameError, setNicknameError] = React.useState<string | null>(null);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [isStatsReady, setIsStatsReady] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'landing' | 'game' | 'rankings' | 'library'>('landing');
  const [showSettings, setShowSettings] = React.useState(false);
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [showGameTutorial, setShowGameTutorial] = React.useState<typeof ALL_GAMES[0] | null>(null);
  const [tutorialStep, setTutorialStep] = React.useState(0);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [libraryPage, setLibraryPage] = React.useState(0);
  const [leaderboardPage, setLeaderboardPage] = React.useState(0);
  const [selectedGame, setSelectedGame] = React.useState<typeof ALL_GAMES[0] | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('ALL');

  const [activeXP, setActiveXP] = React.useState<{ id: number; amount: number }[]>([]);
  const [activeCoins, setActiveCoins] = React.useState<number[]>([]);

  // New game mode states
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [sessionStats, setSessionStats] = React.useState({ solved: 0, points: 0 });

  React.useEffect(() => {
    let timer: any;
    if (gameMode === 'timed' && timeLeft > 0 && !isGameOver && currentView === 'game') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameMode, timeLeft, isGameOver, currentView]);

  const playSfx = React.useCallback((type: 'success' | 'error' | 'click' | 'level-up') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      const playTone = (freq: number, type: OscillatorType, duration: number, volume: number, ramp = true) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        if (ramp) {
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        }
        osc.start();
        osc.stop(ctx.currentTime + duration);
        return { osc, gain };
      };

      if (type === 'success') {
        playTone(523.25, 'sine', 0.15, 0.1); // C5
        setTimeout(() => playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
      } else if (type === 'error') {
        playTone(220, 'sawtooth', 0.4, 0.08); // A3
        playTone(110, 'sawtooth', 0.4, 0.05); // A2
      } else if (type === 'click') {
        playTone(800, 'sine', 0.05, 0.05); 
      } else if (type === 'level-up') {
        const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        tones.forEach((t, i) => {
          setTimeout(() => playTone(t, 'sine', 0.5, 0.1 - (i * 0.01)), i * 150);
        });
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
    timedOut: 'TIME EXPIRED!',
    survivalEnded: 'QUEST OVER!',
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    tryAgain: 'Try Again',
    modes: {
      mixed: 'All Mixed',
      classic: 'Classic',
      story: 'Stories',
      puzzle: 'Puzzles',
      timed: 'Timed Run',
      survival: 'Survival',
      custom: 'Custom Challenge',
    },
    library: 'Logic & Games Library',
    randomGame: 'Random Game',
    explore: 'Explore more: Stomachion, Magic Squares, Game of 24, Nim, Hex, Amazon, Alquerque, and Sam Loyd\'s puzzles. Learn the history and logic behind math!',
    player: 'Player',
    editName: 'Edit Name',
    tutorial: {
      title: 'Academy Training',
      next: 'Next',
      back: 'Back',
      finish: 'Let\'s Go!',
      howToPlay: 'How to Play',
      strategyTab: 'Strategy & Objective',
      objectiveTitle: 'Primary Objective',
      proHints: 'Pro Strategies & Hints',
      readyToPlay: 'START LEARNING',
      steps: [
        {
          title: 'Enter the Zenith',
          desc: 'Welcome to your intellectual odyssey. This is where logic meets the artistry of ancient and modern math games. Your mission is to synchronize your neural patterns with the simulation.',
          icon: '🧠'
        },
        {
          title: 'Decipher the Logic',
          desc: 'Analyze challenges from Nim to Hex. Use visual archetypes—grids, rows, and sequences—plus surgical hints to unlock the mathematical secrets embedded in every task.',
          icon: '🎯'
        },
        {
          title: 'The Knowledge Archive',
          desc: 'Use the "Quest Library" to manually engage any game archetype. Filter by complexity nodes to sharpen specific cognitive sectors like Topology, Deduction, or Geometry.',
          icon: '📚'
        },
        {
          title: 'Interactive Mastery',
          desc: 'Stuck in a logical loop? Use the System-Integrated Guide inside any game for real-time tactical simulations, step-by-step breakdowns, and expert strategy protocols.',
          icon: '🧭'
        },
        {
          title: 'Mechanical Evolution',
          desc: 'Every 5 successful solves triggers a level evolution. Higher levels unlock legendary paradoxes, deeper complexity layers, and high-frequency logic challenges.',
          icon: '⚡'
        },
        {
          title: 'Neural Streaks',
          desc: 'Maintain a solve streak to trigger XP multipliers. Precision is key: solving without auxiliary hints maximizes your XP efficiency and accelerates your rank ascension.',
          icon: '🔥'
        },
        {
          title: 'Combat Protocols',
          desc: 'Engage "Timed Run" for high-velocity logic or "Survival" for tactical zero-error precision. Master the "Mixed" stream to experience the full spectrum of the simulation.',
          icon: '🕹️'
        },
        {
          title: 'Global Hall of Fame',
          desc: 'Your accumulated XP defines your legacy. Standardize your skills to rise from a basic Logic Scholar to a supreme Grandmaster in the global architecture.',
          icon: '🏆'
        }
      ]
    }
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
        { nickname: "MathMaster", points: 4450, problemsSolved: 180, streak: 25, level: 35 },
        { nickname: "Euler_Fan", points: 3980, problemsSolved: 145, streak: 12, level: 28 },
        { nickname: "LogicNinja", points: 3500, problemsSolved: 125, streak: 18, level: 22 },
        { nickname: "Pythagoras", points: 2800, problemsSolved: 90, streak: 8, level: 18 },
        { nickname: "Newtonian", points: 2400, problemsSolved: 75, streak: 10, level: 15 },
        { nickname: "Gauss_Ghost", points: 1900, problemsSolved: 60, streak: 3, level: 12 },
        { nickname: "Nightingale", points: 1500, problemsSolved: 45, streak: 5, level: 10 },
        { nickname: "Alcuin", points: 1200, problemsSolved: 35, streak: 4, level: 8 }
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
    const trimmed = nicknameInput.trim();
    const error = validateNickname(trimmed);
    if (!error && trimmed) {
      playSfx('success');
      setStats(prev => ({ ...prev, nickname: trimmed }));
    } else if (error) {
      playSfx('error');
      setNicknameError(error);
    }
  };

  const validateNickname = (name: string) => {
    if (name.length === 0) return null;
    if (name.length < 3) return 'Too short (min 3 characters)';
    if (name.length > 15) return 'Too long (max 15 characters)';
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return 'Alphanumeric and underscores only';
    return null;
  };

  const handleNicknameChange = (val: string) => {
    setNicknameInput(val);
    setNicknameError(validateNickname(val.trim()));
  };

  const handleNextProblem = (forcedDifficulty?: 'easy' | 'medium' | 'hard', forcedLevel?: number, isProgression = false, forcedMode?: MathMode, specificGame?: string) => {
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
    playSfx('click');
    setDifficulty(newDiff);
    handleNextProblem(newDiff === 'random' ? undefined : newDiff);
  };

  const changeGameMode = (newMode: MathMode) => {
    playSfx('click');
    setGameMode(newMode);
    setIsGameOver(false);
    setSessionStats({ solved: 0, points: 0 });
    
    if (newMode === 'timed') {
      setTimeLeft(60);
    } else if (newMode === 'survival') {
      setLives(3);
    }

    handleNextProblem(undefined, undefined, false, newMode);
  };

  const handleSolve = (isCorrect: boolean) => {
    if (isCorrect) {
      playSfx('success');
      
      const multiplier = Math.min(3, 1 + Math.floor(stats.streak / 5) * 0.5);
      const earnedPoints = Math.round(currentProblem.points * multiplier);

      const animId = Date.now();
      setActiveXP(prev => [...prev, { id: animId, amount: earnedPoints }]);
      setActiveCoins(prev => [...prev, animId, animId + 1, animId + 2]);

      if (gameMode === 'timed' || gameMode === 'survival') {
        setSessionStats(prev => ({
          solved: prev.solved + 1,
          points: prev.points + earnedPoints
        }));
      }

      setStats(prev => {
        const newPoints = prev.points + earnedPoints;
        const newSolved = prev.problemsSolved + 1;
        const newLevel = Math.floor(newSolved / 5) + 1;
        const newStreak = prev.streak + 1;
        
        if (newLevel > prev.level) {
          setShowLevelUp(true);
          playSfx('level-up');
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

      if (gameMode === 'survival') {
        setLives(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
        
        handleNextProblem(undefined, undefined, true); 
      }
    }
  };

  const handleEditNickname = () => {
    setStats(prev => ({ ...prev, nickname: '' }));
  };

  const handleStartGame = () => {
    playSfx('click');
    localStorage.setItem('math-quest-intro-seen', 'true');
    setCurrentView('library');
  };

  const resetGame = () => {
    playSfx('error');
    localStorage.removeItem('math-quest-stats');
    localStorage.removeItem('math-quest-intro-seen');
    setStats(INITIAL_STATS);
    setDifficulty('random');
    setIsConfirmingReset(false);
    handleNextProblem(undefined, INITIAL_STATS.level);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen p-4 md:p-10 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed inset-0 z-[60] bg-math-bg overflow-y-auto overflow-x-hidden dotted-grid"
          >
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {/* Grid Pattern */}
               <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2D3436 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               
               {/* Animated Geometric Shapes */}
               <motion.div 
                 animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-20 -left-20 w-96 h-96 border-[3px] border-neo-purple/15 rounded-full"
               />
               <motion.div 
                 animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                 transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                 className="absolute top-[40%] -right-20 w-[500px] h-[500px] border-[3px] border-neo-pink/15 rounded-[80px]"
               />
               
               {/* Dynamic Accents */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-[15%] left-[25%] w-32 h-32 border-[2px] border-neo-blue/20 rotate-45 rounded-xl block md:hidden lg:block"
               />
               <motion.div 
                 animate={{ y: [0, 30, 0] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute bottom-[20%] right-[30%] w-24 h-24 bg-neo-yellow/5 rounded-full blur-2xl"
               />

               <div className="absolute top-[20%] left-[30%] w-64 h-64 bg-neo-yellow/5 blur-3xl rounded-full" />
               <div className="absolute bottom-[10%] right-[20%] w-80 h-80 bg-neo-blue/5 blur-3xl rounded-full" />

               {/* Mathematical Glyphs */}
               <div className="floating-symbol top-[10%] left-[10%] animate-math-float text-neo-purple/20" style={{ animationDelay: '0s' }}>Σ</div>
               <div className="floating-symbol top-[20%] right-[15%] animate-math-float text-neo-pink/20" style={{ animationDelay: '2s' }}>√</div>
               <div className="floating-symbol bottom-[15%] left-[15%] animate-math-float text-neo-blue/20" style={{ animationDelay: '4s' }}>π</div>
               <div className="floating-symbol bottom-[25%] right-[10%] animate-math-float text-neo-yellow/20" style={{ animationDelay: '1s' }}>∞</div>
               <div className="floating-symbol top-[40%] left-[40%] animate-math-float opacity-[0.03]" style={{ animationDelay: '3s' }}>∫</div>
            </div>

            <div className="relative max-w-6xl mx-auto py-12 px-6 md:py-24 flex flex-col items-center min-h-screen justify-center">
              
              {/* Status Indicator / User Nickname */}
              {stats.nickname && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute top-10 flex items-center gap-3 bg-white px-6 py-2.5 rounded-full border-[3px] border-[#2D3436] shadow-neo-sm z-50 cursor-default"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neo-green animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none text-[#2D3436]/40">System_Online</span>
                  </div>
                  <div className="w-[2px] h-3 bg-[#2D3436]/10" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                    Scholar: <span className="text-neo-purple">{stats.nickname}</span>
                  </span>
                  <button 
                    onClick={handleEditNickname}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-[#2D3436]/40 hover:text-[#2D3436]"
                  >
                    <Settings size={14} />
                  </button>
                </motion.div>
              )}
              
              {/* Editorial Header */}
              <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-between mb-20 gap-12 relative">
                <div className="flex flex-col items-center md:items-start text-center md:text-left relative">
                  {/* Decorative Scanline for Logo Area */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-white/10 blur-[1px] z-30 pointer-events-none hidden md:block"
                  />
                  
                  {/* Massive Layered Logo */}
                  <div className="relative flex flex-col leading-[0.75] font-black uppercase text-[#2D3436]">
                    <motion.div 
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 12, delay: 0.2 }}
                      className="flex flex-col relative"
                    >
                      <span className="text-7xl md:text-[140px] tracking-tighter hover:text-neo-purple transition-colors duration-500 relative">
                        Math
                      </span>
                      <span className="text-7xl md:text-[140px] tracking-tighter relative z-10 -mt-6">Quest</span>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                      animate={{ scale: 1, rotate: -3, opacity: 1 }}
                      transition={{ type: "spring", damping: 10, delay: 0.5 }}
                      className="absolute -bottom-6 -right-4 md:right-0 z-20"
                    >
                      <motion.div 
                        whileHover={{ rotate: 1, scale: 1.05 }}
                        className="relative cursor-default"
                      >
                        <span className="text-5xl md:text-8xl tracking-tighter text-white drop-shadow-[5px_5px_0px_#2D3436] italic leading-none">LOGIC</span>
                        <motion.div 
                          animate={{ scaleX: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-x-0 h-[70%] bottom-0 bg-neo-pink -z-10 -rotate-2 rounded-2xl shadow-neo-sm transform" 
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Top Challenger Card Preview */}
                {leaderboard.length > 0 && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, rotate: 10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 3 }}
                    transition={{ type: "spring", damping: 15, delay: 0.7 }}
                    className="bg-white p-8 rounded-[40px] border-[6px] border-[#2D3436] shadow-neo transform max-w-[280px] w-full hidden lg:block hover:rotate-0 transition-transform cursor-default"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-neo-yellow border-4 border-[#2D3436] rounded-2xl flex items-center justify-center font-black text-xl shadow-neo-sm">1</div>
                      <Trophy size={24} className="text-neo-yellow animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2D3436]/30 mb-1">Current Leader</p>
                    <h3 className="text-2xl font-black truncate uppercase tracking-tighter mb-4">{leaderboard[0].nickname}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Power Level</span>
                        <span className="text-neo-purple">{leaderboard[0].points} XP</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-lg border-2 border-[#2D3436] overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: "85%" }}
                           transition={{ duration: 1.5, delay: 1 }}
                           className="h-full bg-neo-green border-r-2 border-[#2D3436]" 
                         />
                      </div>
                      <p className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest">Top {(stats.level <= 5) ? '1%' : '5%'} of scholars worldwide</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Start Button Block */}
              <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">
                <motion.button
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartGame}
                  className="md:col-span-8 bg-[#2D3436] p-1 rounded-[48px] border-[8px] border-[#2D3436] shadow-neo group cursor-pointer relative overflow-hidden"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-20 bg-[conic-gradient(from_0deg,transparent,rgba(157,126,254,0.3),transparent)] pointer-events-none"
                  />
                  
                  <div className="absolute inset-0 opacity-20 overflow-hidden">
                    <div className="h-full w-full bg-[radial-gradient(#fff_2px,transparent_2px)] bg-[length:24px_24px] group-hover:scale-150 transition-transform duration-1000" />
                  </div>

                  <div className="relative z-10 py-10 px-12 flex items-center justify-between">
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-3 h-3 bg-neo-green rounded-full shadow-[0_0_10px_#6BCB77]" 
                        />
                        <div className="text-[11px] font-black text-white/70 uppercase tracking-[0.5em] font-mono">System.Ready()</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.8] group-hover:text-neo-yellow transition-colors group-hover:drop-shadow-[0_0_20px_rgba(255,233,0,0.3)]">Start</span>
                        <span className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.8] group-hover:text-neo-yellow transition-colors group-hover:drop-shadow-[0_0_20px_rgba(255,233,0,0.3)]">Quest</span>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center justify-center">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                          boxShadow: ["0 0 20px rgba(157,126,254,0.2)", "0 0 50px rgba(157,126,254,0.5)", "0 0 20px rgba(157,126,254,0.2)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="bg-white p-8 rounded-[32px] border-[6px] border-[#2D3436] shadow-neo-sm relative z-20 group-hover:bg-neo-yellow transition-all duration-300 transform group-hover:scale-110"
                      >
                        <Play className="text-[#2D3436] fill-current" size={48} />
                      </motion.div>
                      
                      {/* Decorative elements behind button */}
                      <div className="absolute -inset-10 bg-neo-purple/20 blur-3xl rounded-full group-hover:bg-neo-yellow/30 transition-colors duration-500" />
                      
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2 border-2 border-dashed border-white/20 rounded-full pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-2 flex">
                    <div className="flex-1 bg-neo-purple" />
                    <div className="flex-1 bg-neo-pink" />
                    <div className="flex-1 bg-neo-yellow" />
                    <div className="flex-1 bg-neo-green" />
                  </div>
                </motion.button>
                
                <div className="md:col-span-4 flex flex-col gap-6">
                  <motion.button
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 }}
                    onClick={() => {
                      playSfx('click');
                      const randomGame = ALL_GAMES[Math.floor(Math.random() * ALL_GAMES.length)];
                      setShowGameTutorial(randomGame);
                    }}
                    className="flex-1 bg-[#2D3436] p-4 rounded-[32px] border-[5px] border-[#2D3436] text-white font-black uppercase text-sm tracking-[0.2em] hover:bg-neo-pink transition-all shadow-neo flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:12px_12px]" />
                    <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors relative z-10">
                      <Dices size={20} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <span className="relative z-10">Random Game</span>
                  </motion.button>

                  <motion.button
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => {
                      playSfx('click');
                      setShowTutorial(true);
                    }}
                    className="flex-1 bg-white p-4 rounded-[32px] border-[5px] border-[#2D3436] text-[#2D3436] font-black uppercase text-sm tracking-[0.2em] hover:bg-neo-blue hover:text-white transition-all shadow-neo flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="p-2 bg-neo-blue/10 rounded-xl group-hover:bg-white/20 transition-colors">
                      <Brain size={20} className="group-hover:scale-125 transition-transform" />
                    </div>
                    {t.howToPlay}
                  </motion.button>

                  <motion.button
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => {
                      playSfx('click');
                      setCurrentView('rankings');
                    }}
                    className="flex-1 bg-white p-4 rounded-[32px] border-[5px] border-[#2D3436] text-[#2D3436] font-black uppercase text-sm tracking-[0.2em] hover:bg-neo-yellow transition-all shadow-neo flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="p-2 bg-neo-yellow/10 rounded-xl group-hover:bg-neo-yellow/30 transition-colors">
                      <Trophy size={20} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    Global Hall
                  </motion.button>
                </div>
              </div>

              {/* Progress Peek */}
              {stats.problemsSolved > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 flex items-center gap-6 text-[#2D3436]/40 text-[10px] font-black uppercase tracking-[0.3em]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#2D3436]">{stats.problemsSolved}</span> Puzzles Masters
                  </div>
                  <div className="w-1 h-1 bg-[#2D3436]/20 rounded-full" />
                  <div className="flex items-center gap-2">
                    Level <span className="text-[#2D3436]">{stats.level}</span>
                  </div>
                </motion.div>
              )}

              {/* Scrolling Terminal Ticker */}
              <div className="w-full mt-20 border-t-4 border-b-4 border-[#2D3436] bg-white overflow-hidden py-2 hidden md:block">
                <motion.div 
                  animate={{ x: [0, -1000] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="whitespace-nowrap flex gap-12"
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex gap-12 items-center text-[10px] font-black uppercase tracking-[0.4em] text-[#2D3436]">
                      <span>System_Healthy</span>
                      <span className="w-1 h-1 bg-neo-pink rounded-full" />
                      <span>Logic_Puzzles_Refreshed</span>
                      <span className="w-1 h-1 bg-neo-purple rounded-full" />
                      <span>Sync_Active: {new Date().toLocaleTimeString()}</span>
                      <span className="w-1 h-1 bg-neo-green rounded-full" />
                      <span>{stats.problemsSolved} SOLVED</span>
                      <span className="w-1 h-1 bg-neo-yellow rounded-full" />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Floating Effects */}
        <AnimatePresence>
          {activeXP.map(xp => (
            <FloatingXP 
              key={xp.id} 
              amount={xp.amount} 
              onComplete={() => setActiveXP(prev => prev.filter(f => f.id !== xp.id))} 
            />
          ))}
          {activeCoins.map(id => (
            <FloatingCoin 
              key={id} 
              onComplete={() => setActiveCoins(prev => prev.filter(cid => cid !== id))} 
            />
          ))}
        </AnimatePresence>

        {/* Nickname Modal */}
        <AnimatePresence mode="wait">
          {isStatsReady && !stats.nickname && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#2D3436]/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, y: 40, rotate: -2 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="bg-white p-1 md:p-2 rounded-[56px] border-[8px] border-[#2D3436] shadow-neo max-w-lg w-full relative overflow-hidden"
              >
                {/* Decorative Pattern inside Modal */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-neo-purple/5 -rotate-12 translate-x-12 -translate-y-12 rounded-full border-2 border-neo-purple/10 border-dashed" />
                
                <div className="p-8 md:p-12 space-y-10 relative z-10 text-center">
                  <div className="space-y-4">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 bg-neo-pink rounded-[32px] mb-6 flex items-center justify-center border-[6px] border-[#2D3436] mx-auto shadow-neo-sm transform rotate-3"
                    >
                      <Target size={48} className="text-white" />
                    </motion.div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Challenger<br/>Found!</h2>
                    <p className="font-bold text-[#2D3436]/50 uppercase text-[10px] tracking-[0.3em]">Module 00: Biological Identity Scan</p>
                  </div>

                  <form onSubmit={handleSetNickname} className="space-y-8">
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-neo-purple opacity-0 group-focus-within:opacity-10 transition-opacity rounded-3xl blur-xl" />
                      <input
                        autoFocus
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => handleNicknameChange(e.target.value.toUpperCase())}
                        placeholder="INIT_USER_CODE"
                        maxLength={15}
                        className={`w-full px-8 py-6 rounded-3xl border-[6px] text-3xl font-black uppercase placeholder:text-slate-200 focus:outline-none focus:shadow-neo transition-all relative z-10 ${
                          nicknameError 
                            ? 'border-neo-pink bg-neo-pink/5 text-neo-pink' 
                            : 'border-[#2D3436] focus:border-neo-purple focus:-translate-y-1'
                        }`}
                      />
                      <AnimatePresence>
                        {nicknameError && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="absolute -bottom-10 inset-x-0 flex items-center justify-center"
                          >
                             <div className="bg-neo-pink text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-[#2D3436] shadow-neo-sm">
                               Error: {nicknameError}
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={!!nicknameError || !nicknameInput.trim()}
                        className={`neo-btn w-full py-6 text-2xl font-black flex items-center justify-center gap-4 transition-all uppercase italic ${
                          !!nicknameError || !nicknameInput.trim()
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95 opacity-50'
                            : 'bg-neo-green text-[#2D3436] hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        <Zap size={28} className="fill-current" />
                        Enter Simulation
                      </button>
                      <p className="mt-6 text-[9px] font-black text-[#2D3436]/30 uppercase tracking-[0.2em] leading-relaxed max-w-[240px] mx-auto">
                        By proceeding, you agree to the laws of mathematical logic and strategic pursuit.
                      </p>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGameTutorial && (
            <GameTutorialModal 
              game={showGameTutorial} 
              onClose={() => setShowGameTutorial(null)} 
              onStart={(game) => {
                setShowGameTutorial(null);
                setSelectedGame(game);
                const problem = getRandomProblem('easy', stats.level, 'mixed', game.name);
                setCurrentProblem(problem);
                setCurrentView('game');
              }}
              playSfx={playSfx}
              t={t}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-[#2D3436]/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, rotate: -1 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="bg-white rounded-[48px] border-[8px] border-[#2D3436] shadow-neo-lg max-w-xl w-full relative overflow-hidden flex flex-col"
              >
                {/* Modal System Header */}
                <div className="bg-[#2D3436] px-8 py-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-neo-purple" />
                      <div className="w-2 h-2 rounded-full bg-neo-pink" />
                      <div className="w-2 h-2 rounded-full bg-neo-yellow" />
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-2" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] font-mono italic">Tutorial.Module_OS.v1</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="text-[9px] font-black text-neo-purple uppercase tracking-[0.3em] font-mono">Step_0{tutorialStep + 1}</div>
                  </div>
                </div>

                <div className="absolute top-12 left-0 w-full h-1.5 bg-slate-100 shrink-0">
                  <motion.div 
                    className="h-full bg-neo-purple shadow-[0_0_15px_rgba(157,126,254,0.6)]"
                    animate={{ width: `${((tutorialStep + 1) / t.tutorial.steps.length) * 100}%` }}
                    transition={{ type: "spring", damping: 20 }}
                  />
                </div>

                <button 
                  onClick={() => {
                    playSfx('click');
                    setShowTutorial(false);
                    setTutorialStep(0);
                  }}
                  className="absolute top-16 right-8 p-3 hover:bg-slate-100 rounded-2xl transition-all hover:rotate-90 z-20"
                >
                  <X size={24} className="text-[#2D3436]" />
                </button>

                <div className="p-10 pt-20 flex flex-col items-center text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tutorialStep}
                      initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
                      className="w-32 h-32 bg-slate-50 rounded-[40px] mb-8 flex items-center justify-center border-[5px] border-[#2D3436] shadow-neo-sm relative group"
                    >
                      <div className="absolute inset-0 bg-neo-purple/5 rounded-[35px] animate-pulse" />
                      <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                        {t.tutorial.steps[tutorialStep].icon}
                      </span>
                      
                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-neo-yellow rounded-xl border-[3px] border-[#2D3436] flex items-center justify-center rotate-12 shadow-neo-sm">
                         <span className="text-xs font-black text-[#2D3436] italic">{tutorialStep + 1}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="space-y-6 max-w-sm mb-12">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tutorialStep}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                      >
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none mb-4 text-[#2D3436]">
                          {t.tutorial.steps[tutorialStep].title}
                        </h2>
                        <p className="text-[#2D3436]/60 font-bold text-lg md:text-xl leading-snug italic">
                          {t.tutorial.steps[tutorialStep].desc}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-6 w-full max-w-md pt-4">
                    {tutorialStep > 0 && (
                      <button
                        onClick={() => {
                          playSfx('click');
                          setTutorialStep(s => s - 1);
                        }}
                        className="bg-white px-8 py-5 rounded-3xl border-[4px] border-[#2D3436] font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all shadow-neo-sm active:shadow-none active:translate-y-1"
                      >
                        {t.tutorial.back}
                      </button>
                    )}
                    {tutorialStep < t.tutorial.steps.length - 1 ? (
                      <button
                        onClick={() => {
                          playSfx('click');
                          setTutorialStep(s => s + 1);
                        }}
                        className="bg-neo-purple text-white flex-1 py-5 rounded-3xl border-[4px] border-[#2D3436] font-black uppercase text-sm tracking-widest shadow-neo hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-neo-sm flex items-center justify-center gap-3"
                      >
                        <span>{t.tutorial.next}</span>
                        <ChevronRight size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playSfx('click');
                          setShowTutorial(false);
                          setTutorialStep(0);
                        }}
                        className="bg-neo-green text-[#2D3436] flex-1 py-5 rounded-3xl border-[4px] border-[#2D3436] font-black uppercase text-sm tracking-widest shadow-neo hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-neo-sm flex items-center justify-center gap-3"
                      >
                        <span>{t.tutorial.finish}</span>
                        <Zap size={20} fill="currentColor" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Deco Bar */}
                <div className="h-4 flex shrink-0 mt-auto border-t-[4px] border-[#2D3436]">
                  <div className="flex-1 bg-neo-purple" />
                  <div className="flex-1 bg-neo-pink" />
                  <div className="flex-1 bg-neo-yellow" />
                  <div className="flex-1 bg-neo-green" />
                </div>
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
                  {/* Tutorial Trigger */}
                  <button 
                    onClick={() => {
                      setShowSettings(false);
                      setShowTutorial(true);
                    }}
                    className="w-full flex items-center justify-between p-4 bg-neo-blue/10 border-[3px] border-neo-blue rounded-2xl group transition-all hover:bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="text-neo-blue" />
                      <span className="font-black uppercase text-sm tracking-tight">{t.howToPlay}</span>
                    </div>
                    <ChevronRight size={18} className="text-neo-blue" />
                  </button>

                  {/* Sound Toggle */}
                  <button 
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      if (next) {
                        // Play a brief success sound to confirm it's now ON
                        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                        if (AudioContext) {
                          const ctx = new AudioContext();
                          const osc = ctx.createOscillator();
                          const gain = ctx.createGain();
                          osc.connect(gain);
                          gain.connect(ctx.destination);
                          osc.frequency.setValueAtTime(880, ctx.currentTime);
                          gain.gain.setValueAtTime(0.05, ctx.currentTime);
                          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                          osc.start();
                          osc.stop(ctx.currentTime + 0.1);
                        }
                      }
                    }}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Level Up Notification */}
        <AnimatePresence>
          {showLevelUp && (
            <LevelUpOverlay level={stats.level} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
          {currentView === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="fixed inset-0 z-[70] bg-math-bg overflow-y-auto dotted-grid p-6 md:p-12"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                  <button 
                    onClick={() => {
                      playSfx('click');
                      setCurrentView('landing');
                    }}
                    className="neo-btn bg-white px-6 py-3 flex items-center gap-2 font-black uppercase text-sm tracking-widest"
                  >
                    <ChevronLeft size={20} />
                    Back to Home
                  </button>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-[#2D3436] text-white px-3 py-1 rounded">Live Rankings</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D3436]/40 italic mt-1">Updated every 30s</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-[#2D3436] rounded-[24px] flex items-center justify-center border-[4px] border-[#2D3436] shadow-neo-sm">
                        <Trophy size={32} className="text-neo-yellow" />
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Global Hall of Fame</h2>
                    </div>
                    <p className="text-[#2D3436]/60 font-black uppercase text-xs tracking-[0.3em] ml-1">The greatest minds in logic history</p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          playSfx('click');
                          setLeaderboardPage(p => Math.max(0, p - 1));
                        }}
                        disabled={leaderboardPage === 0}
                        className="w-14 h-14 neo-btn bg-white flex items-center justify-center disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none hover:bg-neo-purple hover:text-white transition-all shadow-neo-sm"
                      >
                        <ChevronLeft size={28} />
                      </button>
                      
                      <div className="flex items-center gap-3 px-8">
                        {Array.from({ length: Math.ceil(leaderboard.length / 5) }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              playSfx('click');
                              setLeaderboardPage(i);
                            }}
                            className={`w-4 h-4 rounded-full transition-all border-2 border-[#2D3436] shadow-sm ${
                              leaderboardPage === i 
                                ? 'bg-neo-purple scale-125' 
                                : 'bg-white hover:opacity-100 opacity-30 shadow-none'
                            }`}
                          />
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          playSfx('click');
                          setLeaderboardPage(p => Math.min(Math.max(0, Math.ceil(leaderboard.length / 5) - 1), p + 1));
                        }}
                        disabled={leaderboardPage >= Math.ceil(leaderboard.length / 5) - 1}
                        className="w-14 h-14 neo-btn bg-white flex items-center justify-center disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none hover:bg-neo-purple hover:text-white transition-all shadow-neo-sm"
                      >
                        <ChevronRight size={28} />
                      </button>
                    </div>
                    <div className="bg-[#2D3436] text-white px-5 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-neo-sm drop-shadow-sm">
                      Page {leaderboardPage + 1} of {Math.max(1, Math.ceil(leaderboard.length / 5))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-20">
                  {leaderboard.slice(leaderboardPage * 5, (leaderboardPage + 1) * 5).map((entry, idx) => {
                    const rank = leaderboardPage * 5 + idx + 1;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={`${entry.nickname}-${idx}`}
                        className={`mini-neo-card flex items-center gap-6 p-6 border-[4px] border-[#2D3436] transition-all hover:-translate-y-1 ${
                          entry.nickname === stats.nickname ? 'bg-neo-blue/10' : 'bg-white'
                        } rounded-[32px]`}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-[4px] border-[#2D3436] shadow-neo-sm shrink-0 ${
                          rank === 1 ? 'bg-neo-yellow scale-110 -rotate-3' : rank === 2 ? 'bg-slate-100' : rank === 3 ? 'bg-neo-orange/40 text-[#2D3436]/70' : 'bg-slate-50 text-[#2D3436]/20'
                        }`}>
                          {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-black text-2xl uppercase italic tracking-tight truncate">{entry.nickname}</span>
                            {entry.nickname === stats.nickname && (
                              <span className="bg-neo-purple text-white text-[10px] font-black px-3 py-1 rounded italic shadow-neo-sm shrink-0">CHAMPION</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none italic">
                            <span>LVL {entry.level}</span>
                            <span>{entry.problemsSolved} Solved</span>
                            <span className="text-neo-pink">🔥 {entry.streak} Max Streak</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-4xl font-black text-neo-purple block leading-[0.8] mb-1">{entry.points.toLocaleString()}</span>
                          <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Mastery XP</span>
                        </div>
                      </motion.div>
                    );
                  })}

                  {leaderboard.length === 0 && (
                    <div className="neo-card p-24 text-center bg-white/50 border-dashed border-[#2D3436]/20 border-[4px] rounded-[48px]">
                      <span className="text-6xl block mb-6">🏜️</span>
                      <p className="font-black text-[#2D3436]/30 uppercase tracking-[0.3em]">The records consist of nothing but dust... for now.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentView === 'library' && (
          <motion.div
            key="library-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-[60] bg-math-bg overflow-y-auto overflow-x-hidden dotted-grid pt-12 pb-24"
          >
            <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex flex-col min-h-screen">
              <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-16 px-4">
                <div 
                  className="flex items-center gap-6 cursor-pointer group"
                  onClick={() => {
                    playSfx('click');
                    setCurrentView('landing');
                  }}
                >
                  <div className="w-14 h-14 bg-[#2D3436] rounded-2xl flex items-center justify-center border-[4px] border-[#2D3436] shadow-neo-sm group-hover:-translate-y-1 transition-transform overflow-hidden relative">
                    <div className="absolute inset-0 bg-neo-purple opacity-20" />
                    <ChevronLeft size={32} className="text-white relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{t.library}</h2>
                    <div className="text-neo-purple font-black uppercase text-[10px] tracking-[0.4em] mt-2 italic flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-neo-purple animate-pulse" />
                       Browse_All_Challenges.zip
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:max-w-2xl">
                  <div className="relative flex-1 group w-full">
                    <div className="absolute -inset-1 bg-neo-purple opacity-5 blur-xl group-focus-within:opacity-20 transition-opacity" />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2D3436]/30 group-focus-within:text-neo-purple transition-colors" size={20} />
                    <input 
                      type="text"
                      placeholder="Search by name, type or math concept..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                      className="w-full pl-14 pr-6 py-5 bg-white border-[4px] border-[#2D3436] rounded-3xl font-black uppercase text-xs tracking-widest focus:outline-none focus:shadow-neo transition-all placeholder:text-[#2D3436]/10"
                    />
                  </div>
                </div>
              </header>

              {/* System Protocol Specs - Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4 italic">
                {[
                  { label: 'Solve Protocol', value: 'Decode 100+ Logic Archetypes', icon: <Brain size={20} />, color: 'bg-neo-purple' },
                  { label: 'Efficiency Gain', value: 'XP Multipliers active at Level 5+', icon: <Zap size={20} />, color: 'bg-neo-pink' },
                  { label: 'Rank Structure', value: 'From Scholar to Apex Grandmaster', icon: <Trophy size={20} />, color: 'bg-neo-yellow' }
                ].map((spec, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-center gap-5 p-6 bg-white border-[4px] border-[#2D3436] rounded-[32px] shadow-neo-sm group hover:-translate-y-1 transition-all"
                  >
                    <div className={`w-14 h-14 ${spec.color} rounded-2xl flex items-center justify-center border-[3px] border-[#2D3436] shadow-neo-sm shrink-0 group-hover:rotate-6 transition-transform`}>
                      <div className="text-white">{spec.icon}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#2D3436]/40 leading-none mb-1.5 italic">{spec.label}</div>
                      <div className="text-sm font-black uppercase tracking-tight text-[#2D3436] italic">{spec.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-12 px-4">
                {['ALL', 'LOGIC', 'MATH', 'MEMORY', 'PATTERN'].map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playSfx('click');
                      setActiveCategory(cat);
                    }}
                    className={`px-6 py-3 rounded-2xl font-black text-[10px] tracking-[0.2em] border-[3px] border-[#2D3436] transition-all
                      ${activeCategory === cat 
                        ? 'bg-[#2D3436] text-white shadow-neo-sm' 
                        : 'bg-white text-[#2D3436] hover:bg-neo-purple/5 shadow-sm'
                      }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Enhanced Random Game Feature */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 px-4">
                <motion.button
                  whileHover={{ scale: 1.01, y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    playSfx('click');
                    const randomGame = ALL_GAMES[Math.floor(Math.random() * ALL_GAMES.length)];
                    setShowGameTutorial(randomGame);
                  }}
                  className="lg:col-span-8 bg-neo-yellow p-10 md:p-12 rounded-[56px] border-[8px] border-[#2D3436] shadow-neo-lg flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2d3436_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="w-24 h-24 md:w-32 md:h-32 bg-white border-[6px] border-[#2D3436] rounded-[40px] flex items-center justify-center group-hover:rotate-12 transition-transform shadow-neo-sm"
                      >
                        <Dices size={56} className="text-[#2D3436]" />
                      </motion.div>
                      <div className="absolute -top-4 -right-4 bg-neo-pink text-white w-12 h-12 rounded-full border-[4px] border-[#2D3436] flex items-center justify-center font-black italic rotate-12 shadow-neo-sm">
                        !!
                      </div>
                    </div>

                    <div className="text-center md:text-left space-y-2">
                       <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none block text-[#2D3436]">{t.randomGame}</span>
                       <p className="text-[#2D3436]/60 font-bold uppercase text-[10px] tracking-widest">Let Destiny Sequence Your Session</p>
                       <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                          <div className="flex items-center gap-2 bg-[#2D3436] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                            <Zap size={12} className="fill-current" />
                            Ultra_Fast_Match
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-2 relative z-10 shrink-0">
                    <div className="bg-white/40 backdrop-blur-sm px-6 py-4 rounded-3xl border-[4px] border-[#2D3436]/10 text-right">
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">System_Load</div>
                      <div className="text-2xl font-black italic">98.4%</div>
                    </div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-2 h-8 bg-[#2D3436]/10 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ height: [`${20+i*10}%`, `${80-i*5}%`, `${20+i*10}%`] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i*0.1 }}
                            className="w-full bg-neo-purple rounded-full" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute right-[-5%] bottom-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={240} strokeWidth={8} />
                  </div>
                </motion.button>

                <div className="lg:col-span-4 flex flex-col gap-8">
                  <div className="flex-1 bg-white border-[6px] border-[#2D3436] rounded-[48px] p-8 shadow-neo-sm relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Trophy size={64} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-neo-purple mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neo-purple" />
                        Session_Stat.log
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic mb-2">Top Performer</h3>
                      <p className="text-xs font-bold text-[#2D3436]/50 uppercase tracking-widest">{leaderboard[0]?.name || 'No Data Found'}</p>
                    </div>
                    <div className="mt-6 flex items-end justify-between">
                      <div className="text-5xl font-black italic tracking-tighter">{leaderboard[0]?.xp || '0'}<span className="text-lg opacity-20 ml-2">XP</span></div>
                      <div className="bg-[#2D3436] text-white p-3 rounded-2xl">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection Label */}
              <div className="flex items-center gap-4 mb-10 px-4">
                <div className="h-[4px] flex-1 bg-[#2D3436]/5 rounded-full" />
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[#2D3436]/30 italic shrink-0">Grid_Sequence_07</span>
                </div>
                <div className="h-[4px] flex-1 bg-[#2D3436]/5 rounded-full" />
              </div>

              {/* Game Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                {ALL_GAMES.filter(g => {
                  const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                       g.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                       g.description.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesCategory = activeCategory === 'ALL' || g.type.toUpperCase() === activeCategory;
                  return matchesSearch && matchesCategory;
                }).map((game, i) => (
                  <motion.div
                    key={game.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <GameCard 
                      game={game}
                      isSelected={selectedGame?.name === game.name}
                      onSelect={() => {
                        playSfx('click');
                        setSelectedGame(game);
                        const problem = getRandomProblem('easy', stats.level, 'mixed', game.name);
                        setCurrentProblem(problem);
                        setCurrentView('game');
                      }}
                      onHelp={() => {
                        playSfx('click');
                        setShowGameTutorial(game);
                      }}
                      playSfx={playSfx}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Footer Decoration */}
              <div className="mt-32 pt-16 border-t-[8px] border-dotted border-[#2D3436]/10 text-center mb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto opacity-10 mb-16">
                  {[
                    { label: 'Latency', value: '4ms' },
                    { label: 'Uptime', value: '99.9%' },
                    { label: 'Packets', value: '0 Lost' },
                    { label: 'Security', value: 'AES-256' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                       <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</div>
                       <div className="text-3xl font-black italic">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <p className="max-w-3xl mx-auto text-xl font-bold text-[#2D3436]/20 italic leading-relaxed uppercase tracking-widest">
                  {t.explore}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'game' && (
          <motion.div 
            key="game-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-math-bg overflow-y-auto overflow-x-hidden dotted-grid"
          >
             {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
               <div className="floating-symbol top-[15%] left-[5%] animate-math-float text-neo-purple/20 text-6xl" style={{ animationDelay: '0s' }}>Δ</div>
               <div className="floating-symbol top-[25%] right-[10%] animate-math-float text-neo-pink/20 text-5xl" style={{ animationDelay: '1.5s' }}>λ</div>
               <div className="floating-symbol bottom-[20%] left-[12%] animate-math-float text-neo-blue/20 text-7xl" style={{ animationDelay: '3s' }}>Ω</div>
               <div className="floating-symbol bottom-[30%] right-[15%] animate-math-float text-neo-yellow/20 text-5xl" style={{ animationDelay: '0.8s' }}>φ</div>
               <div className="floating-symbol top-[45%] left-[35%] animate-math-float opacity-[0.05] text-9xl text-[#2D3436]" style={{ animationDelay: '2.5s' }}>θ</div>
               
               {/* Vertical Data Streams */}
               <div className="absolute top-0 bottom-0 left-[20%] w-px bg-current opacity-[0.05]" />
               <div className="absolute top-0 bottom-0 left-[40%] w-px bg-current opacity-[0.05]" />
               <div className="absolute top-0 bottom-0 left-[60%] w-px bg-current opacity-[0.05]" />
               <div className="absolute top-0 bottom-0 left-[80%] w-px bg-current opacity-[0.05]" />

               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-[1px] border-[#2D3436]/5 rounded-full"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[1px] border-[#2D3436]/5 rounded-[200px]"
               />
            </div>

            <div className="relative max-w-7xl mx-auto min-h-screen flex flex-col">
              {/* Header */}
              <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-10 px-8 lg:px-12 relative z-20">
                <div 
                  className="flex items-center gap-6 group cursor-pointer" 
                  onClick={() => {
                    playSfx('click');
                    setCurrentView('landing');
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-x-0 h-full bg-[#2D3436] rounded-2xl translate-y-2" />
                    <div className="relative w-16 h-16 bg-[#2D3436] rounded-2xl flex items-center justify-center border-[4px] border-[#2D3436] group-hover:-translate-y-1 transition-transform overflow-hidden shadow-neo-sm">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="text-3xl"
                      >
                        ⚙️
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[#2D3436] uppercase italic leading-none">Simulation</h1>
                    <div className="text-neo-purple font-black uppercase text-[10px] tracking-[0.4em] mt-2 italic flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-neo-green animate-pulse" />
                       Active_Process.v1
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 self-center lg:self-auto">
                  <div className="hidden md:block">
                    <StatsCard stats={stats} />
                  </div>
                  <div className="flex gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playSfx('click');
                        handleNextProblem();
                      }} 
                      title={t.newProblem}
                      className="neo-btn bg-neo-green p-4 shadow-neo-sm border-[4px] border-[#2D3436] text-[#2D3436]"
                    >
                      <RefreshCw size={24} strokeWidth={4} className={isRefreshing ? 'animate-spin' : ''} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playSfx('click');
                        setShowSettings(true);
                      }} 
                      title={t.settings}
                      className="neo-btn bg-white p-4 shadow-neo-sm border-[4px] border-[#2D3436] text-[#2D3436]"
                    >
                      <Settings size={24} strokeWidth={4} />
                    </motion.button>
                  </div>
                </div>
              </header>

              <div className="flex-1 flex flex-col xl:flex-row gap-12 px-8 lg:px-12 pb-12 relative z-10">
                {/* Fixed Control Panel */}
                <aside className="xl:w-72 space-y-12 shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-neo-purple rounded-full shadow-[0_0_15px_rgba(157,126,254,0.4)]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D3436]/40 italic leading-none mb-1">{t.gameMode}</span>
                        <span className="text-[8px] font-black text-neo-purple/40 uppercase tracking-[0.2em] font-mono whitespace-nowrap">Selector_Module_v1.0</span>
                      </div>
                    </div>
                    <nav className="flex flex-col gap-4">
                      {(['mixed', 'timed', 'survival'] as const).map((m) => (
                        <button 
                          key={m} 
                          onClick={() => changeGameMode(m)} 
                          className={`neo-btn text-[11px] px-8 py-5 font-black uppercase text-left flex items-center justify-between group transition-all relative overflow-hidden ${
                            gameMode === m ? 'bg-neo-purple text-white shadow-neo -rotate-1 translate-x-3 border-[#2D3436]' : 'bg-white hover:bg-slate-50 border-[#2D3436]/10'
                          }`}
                        >
                          <span className="relative z-10 tracking-widest italic">{t.modes[m]}</span>
                          <div className={`w-3 h-3 rounded-full border-[3px] border-current transition-all relative z-10 ${gameMode === m ? 'bg-white scale-125 shadow-[0_0_10px_white]' : 'bg-transparent opacity-20'}`} />
                          {gameMode === m && (
                            <motion.div 
                              layoutId="active-mode-bg"
                              className="absolute inset-0 bg-white/5 pointer-events-none"
                            />
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-neo-pink rounded-full shadow-[0_0_15px_rgba(255,128,102,0.4)]" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D3436]/40 italic leading-none mb-1">{t.difficultyLabel}</span>
                        <span className="text-[8px] font-black text-neo-pink/40 uppercase tracking-[0.2em] font-mono whitespace-nowrap">Complexity_Node_v4.2</span>
                      </div>
                    </div>
                    <nav className="flex flex-col gap-4">
                      {(['random', 'easy', 'medium', 'hard'] as const).map((d) => (
                        <button 
                          key={d} 
                          onClick={() => changeDifficulty(d)} 
                          className={`neo-btn text-[11px] px-8 py-5 font-black uppercase text-left flex items-center justify-between transition-all relative overflow-hidden ${
                            difficulty === d ? 'bg-neo-pink text-white shadow-neo rotate-1 translate-x-3 border-[#2D3436]' : 'bg-white hover:bg-slate-50 border-[#2D3436]/10'
                          }`}
                        >
                          <span className="relative z-10 tracking-widest italic">{d === 'random' ? `${t.mixed}` : d}</span>
                          <Hash size={16} strokeWidth={3} className={`relative z-10 ${difficulty === d ? 'opacity-100' : 'opacity-20'}`} />
                          {difficulty === d && (
                            <motion.div 
                              layoutId="active-diff-bg"
                              className="absolute inset-0 bg-white/5 pointer-events-none"
                            />
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {(gameMode === 'timed' || gameMode === 'survival') && (
                    <motion.div 
                      key={gameMode}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="pt-6"
                    >
                      {gameMode === 'timed' && (
                        <div className={`neo-card px-8 py-8 flex flex-col items-center gap-3 border-[6px] border-[#2D3436] transition-all relative overflow-hidden shadow-neo ${timeLeft < 10 && timeLeft > 0 ? 'bg-neo-pink text-white animate-pulse' : 'bg-white'}`}>
                          <div className="absolute top-2 left-2 opacity-5">
                            <Clock size={64} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">System_Timer</span>
                          <span className="font-black text-6xl italic leading-none tracking-tighter tabular-nums">{timeLeft}<span className="text-xl ml-1 not-italic opacity-40">S</span></span>
                        </div>
                      )}
                      
                      {gameMode === 'survival' && (
                        <div className="neo-card px-8 py-8 flex flex-col items-center gap-4 border-[6px] border-[#2D3436] bg-slate-900 text-white shadow-neo">
                           <div className="flex gap-2">
                             {[...Array(3)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ 
                                   scale: i < lives ? [1, 1.2, 1] : 0.8,
                                   opacity: i < lives ? 1 : 0.2
                                 }}
                                 transition={i < lives ? { duration: 2, repeat: Infinity } : {}}
                               >
                                 <Heart size={32} fill={i < lives ? "#ff4757" : "transparent"} className={i < lives ? 'text-[#ff4757]' : 'text-slate-600'} />
                               </motion.div>
                             ))}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-neo-pink">Integrity_Shield</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </aside>

                {/* Main Interaction Zone */}
                <main className="flex-1 min-w-0 relative">
                   <div className="absolute -inset-10 bg-neo-purple/5 blur-[100px] -z-10 rounded-full" />
                   
                   {/* Floating Multiplier */}
                   {stats.streak >= 3 && !isGameOver && (
                     <motion.div 
                       initial={{ scale: 0, x: 20, rotate: 10 }}
                       animate={{ scale: 1, x: 0, rotate: -5 }}
                       className="absolute -top-12 -right-8 z-30"
                     >
                        <div className="neo-card bg-neo-yellow px-6 py-3 border-[4px] border-[#2D3436] shadow-neo transform hover:rotate-3 transition-transform">
                           <div className="flex items-center gap-2">
                              <Zap size={20} fill="#2D3436" />
                              <span className="text-2xl font-black italic tracking-tighter">COMBO_x{1 + Math.floor(stats.streak / 5) * 0.5}</span>
                           </div>
                           <div className="mt-1 h-1 w-full bg-black/10 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(stats.streak % 5) * 20}%` }}
                                className="h-full bg-[#2D3436]"
                              />
                           </div>
                        </div>
                     </motion.div>
                   )}

                   <AnimatePresence mode="wait">
                     {isGameOver ? (
                       <motion.div 
                         key="gameover" 
                         initial={{ opacity: 0, y: 50, rotate: -2 }} 
                         animate={{ opacity: 1, y: 0, rotate: 0 }} 
                         exit={{ opacity: 0, scale: 0.9 }}
                         className="bg-white p-12 md:p-16 rounded-[64px] border-[10px] border-[#2D3436] shadow-neo text-center space-y-10 relative overflow-hidden"
                       >
                         {/* Results confetti decoration placeholder with symbols */}
                         <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none text-4xl">
                            {Array.from({ length: 40 }).map((_, i) => (
                              <div key={i} className="absolute" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: `rotate(${Math.random() * 360}deg)` }}>
                                {['+', '-', '*', '/', '=', '?', '%'][Math.floor(Math.random() * 7)]}
                              </div>
                            ))}
                         </div>

                         <div className="space-y-4 relative z-10">
                           <div className="w-28 h-28 bg-neo-yellow rounded-[40px] mx-auto flex items-center justify-center border-[6px] border-[#2D3436] shadow-neo-sm transform -rotate-3 mb-6">
                             <Trophy className="text-[#2D3436]" size={56} />
                           </div>
                           <h2 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter italic shadow-neo-sm text-white drop-shadow-[5px_5px_0px_#2D3436]">
                             {gameMode === 'timed' ? 'TIME_OUT' : 'SHIELD_0%'}
                           </h2>
                           <div className="flex justify-center gap-2">
                             {['SYSTEM', 'FAILURE', 'DETECTED'].map((word, i) => (
                               <motion.span 
                                 key={word}
                                 animate={{ opacity: [0, 1, 0] }}
                                 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                 className="text-[10px] font-black text-neo-pink uppercase tracking-[0.4em]"
                               >
                                 {word}
                               </motion.span>
                             ))}
                           </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                           <div className="neo-card p-8 bg-slate-50 border-[6px] border-[#2D3436] shadow-neo-sm relative group overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <CheckCircle2 size={100} />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D3436]/40 block mb-4 italic">Solutions</span>
                             <span className="text-5xl font-black italic tracking-tighter">{sessionStats.solved}</span>
                           </div>
                           <div className="neo-card p-8 bg-neo-purple/5 border-[6px] border-[#2D3436] shadow-neo-sm group overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Zap size={100} className="text-neo-purple" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neo-purple/40 block mb-4 italic">EXP_Gain</span>
                             <span className="text-5xl font-black text-neo-purple italic tracking-tighter">+{sessionStats.points}</span>
                           </div>
                           <div className="neo-card p-8 bg-neo-yellow/5 border-[6px] border-[#2D3436] shadow-neo-sm group overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Star size={100} className="text-neo-yellow" />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neo-yellow/40 block mb-4 italic">Final_Level</span>
                             <span className="text-5xl font-black text-[#2D3436] italic tracking-tighter">{stats.level}</span>
                           </div>
                         </div>

                         <div className="pt-6 relative z-10">
                           <button onClick={() => {
                               playSfx('click');
                               changeGameMode(gameMode);
                           }} className="neo-btn bg-neo-green text-[#2D3436] w-full py-8 text-3xl font-black uppercase italic shadow-neo hover:scale-[1.02] active:scale-[0.98] transition-transform">
                             RESTART_QUEST
                           </button>
                         </div>
                       </motion.div>
                     ) : (
                       <motion.div 
                         key={isRefreshing ? 'refreshing' : currentProblem.id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                       >
                         {isRefreshing ? (
                           <div className="min-h-[500px] flex flex-col items-center justify-center gap-8 bg-white/50 backdrop-blur-sm rounded-[64px] border-[10px] border-[#2D3436] border-dashed">
                              <RefreshCw className="animate-spin text-neo-purple" size={80} strokeWidth={6} />
                              <div className="text-center">
                                <span className="text-xl font-black uppercase tracking-[0.5em] text-[#2D3436]/40 animate-pulse">Scanning_Data_Stream</span>
                                <div className="flex gap-2 mt-4 justify-center">
                                  {[1,2,3].map(i => <div key={i} className="w-3 h-3 bg-neo-purple rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                                </div>
                              </div>
                           </div>
                         ) : (
                           <ProblemCard 
                             problem={currentProblem} 
                             onSolve={handleSolve} 
                           />
                         )}
                       </motion.div>
                     )}
                   </AnimatePresence>

                   {!isGameOver && (
                     <div className="mt-12 flex justify-between items-center px-10">
                        <div className="flex items-center gap-4 text-[#2D3436]/30 text-[10px] font-black uppercase tracking-[0.5em]">
                           <span className="w-2 h-2 rounded-full bg-neo-green" />
                           Simulation_Active
                        </div>
                        <div className="flex items-center gap-2 group cursor-help relative">
                          <span className="text-[#2D3436]/30 text-[10px] font-black uppercase tracking-[0.5em]">Logic_Buffer: Stable</span>
                          <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                             <motion.div 
                               animate={{ width: ["20%", "80%", "40%"] }} 
                               transition={{ duration: 5, repeat: Infinity }}
                               className="h-full bg-neo-purple" 
                             />
                          </div>
                        </div>
                     </div>
                   )}
                </main>
              </div>
            </div>
          </motion.div>
        )}
    </div>
  </div>
);
};
