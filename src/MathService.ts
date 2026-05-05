import { MathProblem } from './types.ts';

const generateOptions = (answer: number): number[] => {
  const options = new Set<number>();
  options.add(answer);
  while (options.size < 4) {
    const diff = Math.floor(Math.random() * 10) - 5;
    if (diff !== 0) options.add(answer + diff);
  }
  return Array.from(options).sort((a, b) => a - b);
};

const CNJM_GAMES = [
  'Semaphore', 'Tracks', 'Product', 'Dominorio', 'Ouri', 'Advancement', 'Cats and Rats',
  'Flume', 'Hex', 'Amazons', 'Alquerque', 'Labyrinth', 'Senet', 'Alcuin of York',
  'Stomachion', '15 Puzzle', 'Tangram', 'Polyminoes', 'Magic Squares', 'Sam Loyd',
  'Einstein\'s Riddle', 'Sokoban', 'Arbusto', 'Chaos Game', 'Sudoku', 'Nim',
  'Game of 24', 'Tantrix', 'Azumetria', 'Fibonacci', 'Dots and Boxes', 'Solitaire',
  'Frog', 'Life Game', 'Peoes', 'Checkers', 'Chess', 'Yote', 'Pentalfa', 'Sesqui',
  'Hexiamante', 'Meta'
];

export const getDailyProblem = (): MathProblem => {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  const game = CNJM_GAMES[Math.floor(pseudoRandom(1) * CNJM_GAMES.length)];
  const difficulty: 'easy' | 'medium' | 'hard' = pseudoRandom(2) > 0.7 ? 'hard' : (pseudoRandom(2) > 0.3 ? 'medium' : 'easy');
  
  const problem = generateProblemByGame(game, difficulty);
  problem.id = `daily-${seed}`;
  problem.points = 100;
  return problem;
};

export const getRandomProblem = (
  selectedDifficulty?: 'easy' | 'medium' | 'hard', 
  level: number = 1,
  mode: 'mixed' | 'classic' | 'story' | 'puzzle' = 'mixed',
  specificGame?: string
): MathProblem => {
  let difficulty: 'easy' | 'medium' | 'hard';
  const randDist = Math.random();

  if (selectedDifficulty) {
    difficulty = selectedDifficulty;
  } else {
    if (level < 3) difficulty = randDist > 0.85 ? 'medium' : 'easy';
    else if (level < 6) difficulty = randDist > 0.7 ? 'medium' : (randDist > 0.9 ? 'hard' : 'easy');
    else difficulty = randDist > 0.5 ? 'hard' : (randDist > 0.2 ? 'medium' : 'easy');
  }

  const game = specificGame || CNJM_GAMES[Math.floor(Math.random() * CNJM_GAMES.length)];
  return generateProblemByGame(game, difficulty);
};

const generateProblemByGame = (game: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const id = Math.random().toString(36).substring(2, 9);
  
  switch (game) {
    case 'Semaphore': return generateSemaforoProblem(id, difficulty);
    case 'Tracks': return generateRastrosProblem(id, difficulty);
    case 'Product': return generateProdutoProblem(id, difficulty);
    case 'Dominorio': return generateDominorioProblem(id, difficulty);
    case 'Ouri': return generateOuriProblem(id, difficulty);
    case 'Advancement': return generateAvancoProblem(id, difficulty);
    case 'Cats and Rats': return generateGatosERatosProblem(id, difficulty);
    case 'Hex': return generateHexProblem(id, difficulty);
    case 'Amazons': return generateAmazonasProblem(id, difficulty);
    case 'Alquerque': return generateAlquerqueProblem(id, difficulty);
    case 'Labyrinth': return generateLabirintoProblem(id, difficulty);
    case 'Senet': return generateSenetProblem(id, difficulty);
    case 'Alcuin of York': return generateAlcuinoProblem(id, difficulty);
    case 'Stomachion': return generateStomachionProblem(id, difficulty);
    case '15 Puzzle': return generate15PuzzleProblem(id, difficulty);
    case 'Tangram': return generateTangramProblem(id, difficulty);
    case 'Polyminoes': return generatePoliminosProblem(id, difficulty);
    case 'Magic Squares': return generateMagicSquaresProblem(id, difficulty);
    case 'Sam Loyd': return generateSamLoydProblem(id, difficulty);
    case 'Einstein\'s Riddle': return generateEinsteinProblem(id, difficulty);
    case 'Sokoban': return generateSokobanProblem(id, difficulty);
    case 'Arbusto': return generateArbustoProblem(id, difficulty);
    case 'Chaos Game': return generateChaosGameProblem(id, difficulty);
    case 'Sudoku': return generateSudokuProblem(id, difficulty);
    case 'Nim': return generateNimProblem(id, difficulty);
    case 'Game of 24': return generate24Problem(id, difficulty);
    case 'Tantrix': return generateTantrixProblem(id, difficulty);
    case 'Azumetria': return generateAzumetriaProblem(id, difficulty);
    case 'Dots and Boxes': return generateDotsAndBoxesProblem(id, difficulty);
    case 'Fibonacci': return generateFibonacciProblem(id, difficulty);
    case 'Solitaire': return generateSolitaireProblem(id, difficulty);
    case 'Frog': return generateFrogProblem(id, difficulty);
    case 'Life Game': return generateLifeGameProblem(id, difficulty);
    case 'Peoes': return generatePeoesProblem(id, difficulty);
    case 'Checkers': return generateCheckersProblem(id, difficulty);
    case 'Chess': return generateChessProblem(id, difficulty);
    case 'Yote': return generateYoteProblem(id, difficulty);
    case 'Pentalfa': return generatePentalfaProblem(id, difficulty);
    case 'Sesqui': return generateSesquiProblem(id, difficulty);
    case 'Hexiamante': return generateHexiamanteProblem(id, difficulty);
    case 'Meta': return generateMetaProblem(id, difficulty);
    default: return generateSemaforoProblem(id, 'easy');
  }
};

const generateSemaforoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  if (difficulty === 'easy') {
    return {
      id,
      question: "In Semaphore, you have two Yellow (Y) pieces in a row. What piece should you place in the third space to win immediately?",
      answer: "Yellow",
      options: ["Green", "Yellow", "Red"],
      inputType: 'choice',
      category: 'Semaphore',
      difficulty: 'easy',
      points: 20,
      hint: "Rule: You win by completing a line of 3 pieces of the same color.",
      visualData: { type: 'row', row: ['Y', 'Y', '?'] }
    };
  }
  return {
    id,
    question: "In Semaphore, following the piece cycle, which color can be placed on top of a Yellow (Y) piece?",
    answer: "Red",
    options: ["Green", "Yellow", "Red"],
    inputType: 'choice',
    category: 'Semaphore',
    difficulty: 'medium',
    points: 30,
    hint: "Cycle: Green -> Yellow -> Red.",
    visualData: { type: 'logic', label: 'G → Y → ?' }
  };
};

const generateRastrosProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: difficulty === 'easy' ? "In the game Tracks (Rastros), starting from a central square, how many possible movement directions are there?" : "On a 7x10 board, what is the minimum number of moves from (3,3) to the (1,1) square?",
    answer: difficulty === 'easy' ? 8 : 2,
    inputType: 'text',
    category: 'Tracks',
    difficulty,
    points: difficulty === 'easy' ? 20 : 40,
    hint: "Diagonals count as directions.",
    visualData: { type: 'grid', grid: [['', '', ''], ['', '●', ''], ['', '', '']] }
  };
};

const generateProdutoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the Product game, if the markers are at 3 and 4, the product is 12. If you want to occupy square 21, to what new value should you move one of the factors?",
    answer: 7,
    inputType: 'text',
    category: 'Product',
    difficulty,
    points: 30,
    hint: "Think of the multiplication table: 3 x ? = 21",
    visualData: { type: 'logic', label: '3 x ? = 21' }
  };
};

const generateDominorioProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Dominorio, if you want to cover squares with sum 10 and one square has the number 4, what must be the value of the neighboring square?",
    answer: 6,
    inputType: 'text',
    category: 'Dominorio',
    difficulty,
    points: 25,
    hint: "10 - 4 = ?",
    visualData: { type: 'grid', grid: [[4, '?']] }
  };
};

const generateOuriProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: difficulty === 'easy' ? "With how many seeds in each pit does the game Ouri begin?" : "You have 4 seeds in pit A. Where will the last one land when sowing counter-clockwise?",
    answer: difficulty === 'easy' ? 4 : 5,
    inputType: 'text',
    category: 'Ouri',
    difficulty,
    points: difficulty === 'easy' ? 20 : 45,
    hint: "The game starts with 48 seeds in total.",
    visualData: { type: 'pits', count: 4 }
  };
};

const generateAvancoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "How do you capture an opponent's piece in the game Advancement?",
    answer: "Diagonally",
    options: ["Diagonally", "By jumping", "Moving backwards", "Forward"],
    inputType: 'choice',
    category: 'Advancement',
    difficulty,
    points: 30,
    hint: "Same as a pawn in Chess.",
    visualData: { type: 'logic', label: 'Cap: ↖ or ↗' }
  };
};

const generateGatosERatosProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "What is the main objective of the Rats to defeat the Cat?",
    answer: "Block the Cat",
    options: ["Capture the Cat", "Block the Cat", "Escape the board"],
    inputType: 'choice',
    category: 'Cats & Rats',
    difficulty,
    points: 25,
    visualData: { type: 'grid', grid: [['웃', ' ', ' '], ['', '●', ''], ['', '', '●']] }
  };
};

const generateHexProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "What is the final goal in the game Hex?",
    answer: "Connect the two sides of your color",
    options: ["Capture pieces", "Connect the two sides of your color", "Block the center"],
    inputType: 'choice',
    category: 'Hex',
    difficulty,
    points: 25,
    visualData: { type: 'shape', shape: 'hexagon', count: 1 }
  };
};

const generateAmazonasProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Amazonas, what does the piece do after moving?",
    answer: "Shoots an arrow",
    options: ["Jumps another piece", "Captures", "Shoots an arrow", "Blocks the king"],
    inputType: 'choice',
    category: 'Amazons',
    difficulty,
    points: 35,
    visualData: { type: 'logic', label: 'Move + Shoot' }
  };
};

const generateAlquerqueProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "Alquerque is the ancestor of which modern game?",
    answer: "Checkers",
    options: ["Chess", "Checkers", "Go", "Ludo"],
    inputType: 'choice',
    category: 'Alquerque',
    difficulty,
    points: 20
  };
};

const generateLabirintoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the game Labyrinth, what is the maximum number of walls you can place at once?",
    answer: 1,
    inputType: 'text',
    category: 'Labyrinth',
    difficulty,
    points: 20
  };
};

const generateSenetProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "How many squares does the Senet board have (Ancient Egypt)?",
    answer: 30,
    inputType: 'text',
    category: 'Senet',
    difficulty,
    points: 20
  };
};

const generateAlcuinoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the Wolf, Goat and Cabbage problem, who cannot be left alone with the Goat?",
    answer: "Wolf",
    options: ["Wolf", "Cabbage", "Nobody"],
    inputType: 'choice',
    category: 'Alcuin',
    difficulty,
    points: 30
  };
};

const generateStomachionProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "How many pieces make up Archimedes' Stomachion puzzle?",
    answer: 14,
    inputType: 'text',
    category: 'Stomachion',
    difficulty,
    points: 40
  };
};

const generate15PuzzleProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the 15 Puzzle (4x4), how many empty spaces are there?",
    answer: 1,
    inputType: 'text',
    category: '15 Puzzle',
    difficulty,
    points: 15
  };
};

const generateTangramProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "How many pieces are in a classic Tangram?",
    answer: 7,
    inputType: 'text',
    category: 'Tangram',
    difficulty,
    points: 20
  };
};

const generatePoliminosProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "What is a polyomino made of 5 squares called?",
    answer: "Pentomino",
    options: ["Tetromino", "Pentomino", "Hexomino"],
    inputType: 'choice',
    category: 'Polyminoes',
    difficulty,
    points: 25
  };
};

const generateMagicSquaresProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In a 3x3 magic square (1-9), what is the sum of each row?",
    answer: 15,
    inputType: 'text',
    category: 'Magic Squares',
    difficulty,
    points: 40
  };
};

const generateSamLoydProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "Which country was the famous Sam Loyd from?",
    answer: "USA",
    options: ["England", "USA", "France"],
    inputType: 'choice',
    category: 'Sam Loyd',
    difficulty,
    points: 20
  };
};

const generateEinsteinProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Einstein's riddle, if you have 5 houses and 5 colors, how many possible combinations are there?",
    answer: 120,
    inputType: 'text',
    category: 'Einstein',
    difficulty,
    points: 50
  };
};

const generateSokobanProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Sokoban, what can you NEVER do with the boxes?",
    answer: "Pull",
    options: ["Push", "Pull", "Rotate"],
    inputType: 'choice',
    category: 'Sokoban',
    difficulty,
    points: 25
  };
};

const generateArbustoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "If a fractal bush divides each branch into 2 and you have 3 levels, how many final branches exist?",
    answer: 8,
    inputType: 'text',
    category: 'Arbusto',
    difficulty,
    points: 30
  };
};

const generateChaosGameProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "Which fractal emerges in the Chaos Game with a triangle?",
    answer: "Sierpinski Triangle",
    options: ["Koch Curve", "Sierpinski Triangle", "Mandelbrot Set"],
    inputType: 'choice',
    category: 'Chaos Game',
    difficulty,
    points: 50
  };
};

const generateSudokuProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In a 9x9 Sudoku, what is the sum of each row (1-9)?",
    answer: 45,
    inputType: 'text',
    category: 'Sudoku',
    difficulty,
    points: 35
  };
};

const generateNimProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "You have 15 matches and can take 1, 2, or 3. What is the 'safe' multiple to leave for your opponent?",
    answer: 4,
    inputType: 'text',
    category: 'Nim',
    difficulty,
    points: 45
  };
};

const generate24Problem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "With 6, 4, 3, 2, how do you reach 24 quickly?",
    answer: "6*4",
    options: ["6*4", "3*4*2", "All of them"],
    inputType: 'choice',
    category: 'Game of 24',
    difficulty,
    points: 20
  };
};

const generateTantrixProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Tantrix, what is the main color of the connection line?",
    answer: "Red",
    options: ["Blue", "Red", "Yellow"],
    inputType: 'choice',
    category: 'Tantrix',
    difficulty,
    points: 30
  };
};

const generateAzumetriaProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "What is the base element of the game Azumetria?",
    answer: "Tile",
    options: ["Circle", "Tile", "Line"],
    inputType: 'choice',
    category: 'Azumetria',
    difficulty,
    points: 20
  };
};

const generateDotsAndBoxesProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "Who wins the point for a square in Dots and Boxes?",
    answer: "The one who closes the 4th side",
    options: ["The one who closes the 4th side", "The one who started the line", "The one with more pieces"],
    inputType: 'choice',
    category: 'Dots & Boxes',
    difficulty,
    points: 25
  };
};

const generateFibonacciProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the Fibonacci sequence (1, 1, 2, 3, 5, 8...), what is the next number?",
    answer: 13,
    inputType: 'text',
    category: 'Fibonacci',
    difficulty,
    points: 40
  };
};

const generateSolitaireProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Solitaire, how many pieces remain in a perfect victory?",
    answer: 1,
    inputType: 'text',
    category: 'Solitaire',
    difficulty,
    points: 25
  };
};

const generateFrogProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the Frogs puzzle (3 on each side), what is the minimum number of jumps to swap them?",
    answer: 15,
    inputType: 'text',
    category: 'Frog',
    difficulty,
    points: 50
  };
};

const generateLifeGameProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the Game of Life, what happens to a cell with 1 neighbor?",
    answer: "Dies of isolation",
    options: ["Survives", "Dies of isolation", "Reproduces"],
    inputType: 'choice',
    category: 'Life Game',
    difficulty,
    points: 35
  };
};

const generatePeoesProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the game of Pawns, what happens when you reach the end of the board?",
    answer: "Win the game",
    options: ["Promote to Queen", "Win the game", "Get blocked"],
    inputType: 'choice',
    category: 'Pawns',
    difficulty,
    points: 20
  };
};

const generateCheckersProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Portuguese Checkers, does 'blowing' (removing a piece for not capturing) exist?",
    answer: "No",
    options: ["Yes", "No"],
    inputType: 'choice',
    category: 'Checkers',
    difficulty,
    points: 15
  };
};

const generateChessProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Chess, which is the only piece that can jump over others?",
    answer: "Knight",
    options: ["Rook", "Bishop", "Knight"],
    inputType: 'choice',
    category: 'Chess',
    difficulty,
    points: 15
  };
};

const generateYoteProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Yoté, does capturing a piece allow you to remove another one of your choice?",
    answer: "Yes",
    options: ["Yes", "No"],
    inputType: 'choice',
    category: 'Yoté',
    difficulty,
    points: 40
  };
};

const generatePentalfaProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Pentalfa, how many pieces should you place on the star?",
    answer: 9,
    inputType: 'text',
    category: 'Pentalfa',
    difficulty,
    points: 40
  };
};

const generateSesquiProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "What mathematical concept is the game Sesqui based on?",
    answer: "Parity",
    options: ["Primes", "Parity", "Fractions"],
    inputType: 'choice',
    category: 'Sesqui',
    difficulty,
    points: 35
  };
};

const generateHexiamanteProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "How many triangles make up a Hexiamond?",
    answer: 6,
    inputType: 'text',
    category: 'Hexiamante',
    difficulty,
    points: 25
  };
};

const generateMetaProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In Meta, what type are the boards?",
    answer: "Concentric",
    options: ["Parallel", "Concentric", "Crossed"],
    inputType: 'choice',
    category: 'Meta',
    difficulty,
    points: 35
  };
};
