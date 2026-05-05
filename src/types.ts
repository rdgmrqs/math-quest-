export interface MathProblem {
  id: string;
  question: string;
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: string;
  imageUrl?: string;
  hint?: string;
  options?: number[];
  visualData?: {
    type: 'shape' | 'count' | 'grid' | 'logic' | 'board' | 'pits' | 'stack' | 'row';
    shape?: 'rectangle' | 'circle' | 'triangle' | 'hexagon';
    dimensions?: { width?: number; height?: number; radius?: number };
    count?: number;
    icon?: string;
    grid?: (number | string | null)[][];
    stack?: number[]; // For Tower of Hanoi or similar (disk sizes)
    row?: string[];   // For simple sequences of icons/labels
    label?: string;
    markerPosition?: { x: number, y: number }; // For board games
  };
}

export interface UserStats {
  nickname: string;
  points: number;
  problemsSolved: number;
  level: number;
  streak: number;
}
