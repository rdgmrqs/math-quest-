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

const BROAD_CATEGORIES: Record<string, string[]> = {
  'Arithmetic': ['Product', 'Dominorio', 'Ouri', 'Magic Squares', 'Game of 24', 'Fibonacci', 'Sesqui'],
  'Algebra': ['Sam Loyd', 'Einstein\'s Riddle', 'Meta', 'Polyminoes'],
  'Geometry': ['Tracks', 'Advancement', 'Cats and Rats', 'Hex', 'Amazons', 'Tangram', 'Stomachion', 'Azumetria', 'Chaos Game', 'Arbusto', 'Chess', 'Checkers', 'Yote', 'Pentalfa', 'Hexiamante', 'Labyrinth'],
  'Logic': ['Semaphore', 'Alcuin of York', '15 Puzzle', 'Sokoban', 'Sudoku', 'Nim', 'Tantrix', 'Dots and Boxes', 'Solitaire', 'Frog', 'Life Game', 'Peoes', 'Alquerque', 'Senet']
};

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
  mode: 'mixed' | 'classic' | 'story' | 'puzzle' | 'timed' | 'survival' = 'mixed',
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

  const gamesPool = CNJM_GAMES;
  const game = specificGame || gamesPool[Math.floor(Math.random() * gamesPool.length)];
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
      question: "In a repeating sequence Green (1), Yellow (2), Red (3), Green (1)... what is the sum of the first 4 terms?",
      answer: 7,
      options: ["6", "7", "8", "9"],
      inputType: 'choice',
      category: 'Semaphore',
      difficulty: 'easy',
      points: 20,
      hint: "1 + 2 + 3 + 1 = ?"
    };
  }
  return {
    id,
    question: "A sequence follows the rule: G → Y → R. If G=1, Y=2, R=3, and the sequence repeats, what is the 10th term?",
    answer: 1,
    options: ["1", "2", "3"],
    inputType: 'choice',
    category: 'Semaphore',
    difficulty: 'medium',
    points: 30,
    hint: "10 mod 3 = ?",
    visualData: { type: 'logic', label: '1, 2, 3, 1, 2, 3...' }
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
    visualData: { 
      type: 'grid', 
      grid: [['4', '▣']],
      label: 'DOMINO.COVER.v1'
    }
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
    question: "A piece moves diagonally from square (1,1) to (3,3). What is the total number of squares it passed through (including start and end)?",
    answer: 3,
    inputType: 'text',
    category: 'Advancement',
    difficulty,
    points: 30,
    hint: "Counts squares: (1,1), (2,2), (3,3)",
    visualData: { type: 'logic', label: '(1,1) → (3,3)' }
  };
};

const generateGatosERatosProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "If a Cat is at (2,2) and a Rat is at (5,6) on a grid, what is the Manhattan distance (horizontal + vertical steps) between them?",
    answer: 7,
    inputType: 'text',
    category: 'Cats & Rats',
    difficulty,
    points: 25,
    hint: "|2-5| + |2-6| = ?",
    visualData: { type: 'grid', grid: [['C', '', ''], ['', '', ''], ['', '', 'R']] }
  };
};

const generateHexProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "On an 11x11 hexagonal board, what is the total number of hex cells?",
    answer: 121,
    inputType: 'text',
    category: 'Hex',
    difficulty,
    points: 25,
    hint: "Area of a rhombus/square: base x height",
    visualData: { type: 'shape', shape: 'hexagon', count: 11 }
  };
};

const generateAmazonasProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const grid = Array(8).fill(null).map(() => Array(8).fill(''));
  grid[3][3] = 'queen'; // Represent Amazon as a Queen
  
  return {
    id,
    question: "An Amazon moves like a Queen. From (4,4) on an 8x8 board, how many adjacent squares (one step away) can it move to?",
    answer: 8,
    inputType: 'text',
    category: 'Amazons',
    difficulty,
    points: 35,
    hint: "Think about the squares surrounding it.",
    visualData: { 
      type: 'grid', 
      grid: grid,
      style: 'chess',
      label: 'AMAZON.POSTURE.v1'
    }
  };
};

const generateAlquerqueProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "If two players start with 12 pieces each, and 5 are captured from one and 3 from the other, how many pieces remain on the board?",
    answer: 16,
    inputType: 'text',
    category: 'Alquerque',
    difficulty,
    points: 20,
    hint: "Total start - total captured."
  };
};

const generateLabirintoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In a 4x4 grid of squares, how many internal vertical lines can you draw to separate squares?",
    answer: 12,
    inputType: 'text',
    category: 'Labyrinth',
    difficulty,
    points: 20,
    hint: "3 lines per row, 4 rows total.",
    visualData: { 
      type: 'grid', 
      grid: [
        ['', '|', '', '|', '', '|', ''],
        ['', '|', '', '|', '', '|', ''],
        ['', '|', '', '|', '', '|', ''],
        ['', '|', '', '|', '', '|', '']
      ],
      label: 'INTERNAL.STRUCTURE'
    }
  };
};

const generateSenetProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A Senet board is a 3x10 grid of squares. If you move a piece 15 spaces from the first square (1,1), in which row will it land (assuming rows of 10)?",
    answer: 2,
    inputType: 'text',
    category: 'Senet',
    difficulty,
    points: 20,
    hint: "Squares 1-10 are row 1, 11-20 are row 2.",
    visualData: {
      type: 'grid',
      style: 'senet',
      grid: [
         ['', '', '', '', '', '', '', '', '', ''],
         ['', '', '', '', '', 'pawn', '', '', '', ''],
         ['', '', '', '', '', '☆', '🌊', 'III', 'II', '☉']
      ],
      label: 'SENET.JOURNEY.v1'
    }
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
    points: 30,
    visualData: {
      type: 'row',
      row: ['🐺', '🐐', '🥬', '|', '🚣'],
      label: 'RIVER.CROSSING.v1'
    }
  };
};

const generateStomachionProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "Stomachion is a 12x12 square divided into 14 pieces. What is the total area of the puzzle?",
    answer: 144,
    inputType: 'text',
    category: 'Stomachion',
    difficulty,
    points: 40,
    hint: "Area = Side x Side",
    visualData: {
      type: 'logic',
      label: '12 x 12'
    }
  };
};

const generate15PuzzleProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A 4x4 grid has 16 slots. If 15 slots are occupied by tiles, what fraction of the board is empty?",
    answer: "1/16",
    inputType: 'text',
    category: '15 Puzzle',
    difficulty,
    points: 15,
    hint: "One empty slot out of sixteen total slots.",
    visualData: {
      type: 'grid',
      grid: [
        ['1', '2', '3', '4'],
        ['5', '6', '7', '8'],
        ['9', '10', '11', '12'],
        ['13', '14', '15', '']
      ],
      label: 'NUMERIC.SLIDE.v1'
    }
  };
};

const generateTangramProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A Tangram set has 7 pieces that form a square. If the total area is 64 cm², and the two large triangles each represent 1/4 of that area, what is the area of one large triangle?",
    answer: 16,
    inputType: 'text',
    category: 'Tangram',
    difficulty,
    points: 20,
    hint: "Divide 64 by 4."
  };
};

const generatePoliminosProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "If a pentomino is made of 5 squares and a tetromino is made of 4, how many squares are there in 3 pentominoes and 2 tetrominoes?",
    answer: 23,
    inputType: 'text',
    category: 'Polyminoes',
    difficulty,
    points: 25,
    hint: "(3 x 5) + (2 x 4) = ?"
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
    points: 40,
    visualData: {
      type: 'grid',
      grid: [
        ['?', '1', '?'],
        ['?', '5', '7'],
        ['4', '9', '2']
      ],
      label: 'HE-TU.MAGIC_SQUARE'
    }
  };
};

const generateSamLoydProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "Sam Loyd posed a puzzle: If 1.5 hens lay 1.5 eggs in 1.5 days, how many eggs does one hen lay in one day?",
    answer: "2/3",
    options: ["1", "2/3", "1/2", "0.5"],
    inputType: 'choice',
    category: 'Sam Loyd',
    difficulty,
    points: 20,
    hint: "Think about the rates."
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
    question: "To move a box from (1,1) to (4,3), what is the minimum number of steps required?",
    answer: 5,
    inputType: 'text',
    category: 'Sokoban',
    difficulty,
    points: 25,
    hint: "|4-1| + |3-1| = ?"
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
    points: 35,
    visualData: {
      type: 'grid',
      grid: [
        ['5', '3', ''],
        ['6', '', ''],
        ['', '9', '8']
      ],
      label: 'SUDOKU.PARTIAL.9x9'
    }
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
    points: 45,
    visualData: { type: 'count', count: 15, icon: '🥢' }
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
    question: "A hexagonal tile has 6 edges. If 3 paths connect these edges in pairs, how many endpoints are there total across all paths on one tile?",
    answer: 6,
    inputType: 'text',
    category: 'Tantrix',
    difficulty,
    points: 30,
    hint: "Every path endpoint is on an edge.",
    visualData: {
      type: 'shape',
      shape: 'hexagon',
      label: 'TANTRIX.UNIT.v2'
    }
  };
};

const generateAzumetriaProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A square tile has 4-fold rotational symmetry. If you rotate it by 90 degrees 7 times, what is the net rotation in degrees relative to the original position?",
    answer: 270,
    inputType: 'text',
    category: 'Azumetria',
    difficulty,
    points: 20,
    hint: "(7 x 90) mod 360 = ?"
  };
};

const generateDotsAndBoxesProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In a 3x3 array of dots, how many possible horizontal lines can you draw between adjacent dots?",
    answer: 6,
    inputType: 'text',
    category: 'Dots & Boxes',
    difficulty,
    points: 25,
    hint: "2 segments per row, 3 rows total.",
    visualData: {
      type: 'grid',
      grid: [
        ['●', '-', '●', '-', '●'],
        ['', '', '', '', ''],
        ['●', '', '●', '', '●'],
        ['', '', '', '', ''],
        ['●', '', '●', '', '●']
      ],
      label: 'DOTS.AND.BOXES.MAP'
    }
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
    points: 25,
    visualData: {
      type: 'grid',
      grid: [
        [null, null, '●', '●', '●', null, null],
        [null, null, '●', '●', '●', null, null],
        ['●', '●', '●', '●', '●', '●', '●'],
        ['●', '●', '●', '', '●', '●', '●'],
        ['●', '●', '●', '●', '●', '●', '●'],
        [null, null, '●', '●', '●', null, null],
        [null, null, '●', '●', '●', null, null]
      ],
      label: 'SOLITAIRE.HALO.v1'
    }
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
    points: 50,
    visualData: {
      type: 'row',
      row: ['웃', '웃', '웃', '', '▣', '▣', '▣'],
      label: 'FROG.JUMP.SIM'
    }
  };
};

const generateLifeGameProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In the Game of Life, a cell with 4 or more neighbors dies from overpopulation. If a cell is surrounded by an 'X' pattern (4 diagonal neighbors), will it survive?",
    answer: "No",
    options: ["Yes", "No"],
    inputType: 'choice',
    category: 'Life Game',
    difficulty,
    points: 35,
    hint: "4 neighbors > 3."
  };
};

const generatePeoesProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "On an 8x8 board, a Pawn moves forward 1 square per turn. If it starts at row 2, what is the minimum number of moves to reach row 8?",
    answer: 6,
    inputType: 'text',
    category: 'Pawns',
    difficulty,
    points: 20,
    hint: "8 - 2 = ?"
  };
};

const generateCheckersProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "In an 8x8 Checkerboard, how many squares are black if the pattern alternates starting with white?",
    answer: 32,
    inputType: 'text',
    category: 'Checkers',
    difficulty,
    points: 15,
    hint: "Half of 64.",
    visualData: {
      type: 'grid',
      grid: [
        ['●', '', '●', ''],
        ['', '●', '', '●'],
        ['○', '', '○', ''],
        ['', '○', '', '○']
      ],
      style: 'checkers',
      label: 'DRAUGHTS.v1'
    }
  };
};

const generateChessProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const grid = [
    ['rook', 'knight', 'bishop', 'queen', 'king'],
    ['pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
    ['', '', '', '', ''],
    ['w-pawn', 'w-pawn', 'w-pawn', 'w-pawn', 'w-pawn'],
    ['w-rook', 'w-knight', 'w-bishop', 'w-queen', 'w-king']
  ];
  return {
    id,
    question: "A Knight moves 2 squares in one direction and 1 square perpendicularly. From (0,0), can it reach (1,1) in exactly two moves?",
    answer: "Yes",
    options: ["Yes", "No"],
    inputType: 'choice',
    category: 'Chess',
    difficulty,
    points: 15,
    hint: "(0,1) -> (2,2) -> (1,0) ... wait, check the coordinates.",
    visualData: {
      type: 'grid',
      grid: grid,
      style: 'chess',
      label: 'CHESS.ENGINE.ALPHA'
    }
  };
};

const generateYoteProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A Yote board is 5 rows by 6 columns. What is the total number of squares?",
    answer: 30,
    inputType: 'text',
    category: 'Yoté',
    difficulty,
    points: 40,
    hint: "Multiply rows by columns.",
    visualData: {
      type: 'grid',
      grid: Array(5).fill(Array(6).fill(''))
    }
  };
};

const generatePentalfaProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A Pentalfa star has 5 outer vertices and 5 inner vertices. What is the total number of points in the figure?",
    answer: 10,
    inputType: 'text',
    category: 'Pentalfa',
    difficulty,
    points: 40,
    hint: "5 + 5 = ?",
    visualData: {
      type: 'count',
      count: 10,
      icon: '★'
    }
  };
};

const generateSesquiProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A game uses parity logic. If you have a pile of 17 tokens and add 14 more, is the total number of tokens even or odd?",
    answer: "Odd",
    options: ["Even", "Odd"],
    inputType: 'choice',
    category: 'Sesqui',
    difficulty,
    points: 35,
    hint: "Odd + Even = ?"
  };
};

const generateHexiamanteProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "A Hexiamond is made of 6 equilateral triangles. If one triangle has area 5 cm², what is the total area of the Hexiamond?",
    answer: 30,
    inputType: 'text',
    category: 'Hexiamante',
    difficulty,
    points: 25,
    hint: "6 x 5 = ?"
  };
};

const generateMetaProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "Three concentric squares have side lengths 2, 4, and 6. What is the perimeter of the middle square?",
    answer: 16,
    inputType: 'text',
    category: 'Meta',
    difficulty,
    points: 35,
    hint: "Perimeter = 4 x Side"
  };
};
