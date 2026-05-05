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
  'Semáforo', 
  'Rastros', 
  'Produto', 
  'Dominório', 
  'Ouri', 
  'Avanço', 
  'Gatos e Ratos',
  'Flume',
  'Hex'
];

const getPlaceholder = (type: string) => {
  const map: Record<string, string> = {
    semaforo: 'traffic,lights,grid,logic',
    rastros: 'path,footprints,maze,strategy',
    produto: 'multiplication,numbers,grid,math',
    dominorio: 'dominos,math,numbers,puzzle',
    ouri: 'mancala,seeds,pits,ancient',
    avanco: 'movement,chess,strategy,board',
    gatoseratos: 'cat,mouse,blockage,board',
    hex: 'hexagons,honeycomb,connection,blue,red'
  };
  const keywords = map[type.toLowerCase().replace(/\s/g, '')] || 'math,logic,puzzle';
  return `https://picsum.photos/seed/${keywords}/600/400`;
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

export const getRandomProblem = (selectedDifficulty?: 'easy' | 'medium' | 'hard', level: number = 1): MathProblem => {
  let difficulty: 'easy' | 'medium' | 'hard';
  const randDist = Math.random();

  if (selectedDifficulty) {
    difficulty = selectedDifficulty;
  } else {
    if (level < 3) difficulty = randDist > 0.85 ? 'medium' : 'easy';
    else if (level < 6) difficulty = randDist > 0.7 ? 'medium' : (randDist > 0.9 ? 'hard' : 'easy');
    else difficulty = randDist > 0.5 ? 'hard' : (randDist > 0.2 ? 'medium' : 'easy');
  }

  const game = CNJM_GAMES[Math.floor(Math.random() * CNJM_GAMES.length)];
  return generateProblemByGame(game, difficulty);
};

const generateProblemByGame = (game: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const id = Math.random().toString(36).substring(2, 9);

  switch (game) {
    case 'Semáforo':
      return generateSemaforoProblem(id, difficulty);
    case 'Rastros':
      return generateRastrosProblem(id, difficulty);
    case 'Produto':
      return generateProdutoProblem(id, difficulty);
    case 'Dominório':
      return generateDominorioProblem(id, difficulty);
    case 'Ouri':
      return generateOuriProblem(id, difficulty);
    case 'Avanço':
      return generateAvancoProblem(id, difficulty);
    case 'Gatos e Ratos':
      return generateGatosERatosProblem(id, difficulty);
    default:
      return generateSemaforoProblem(id, 'easy');
  }
};

const generateSemaforoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const options = [1, 2, 3]; // Simplified representation
  if (difficulty === 'easy') {
    return {
      id,
      question: "No Semáforo, tens duas peças amarelas (Y) em linha. Que peça deves colocar na terceira casa para ganhar imediatamente?",
      answer: 2, // Representing Yellow (1:G, 2:Y, 3:R)
      options: [1, 2, 3],
      category: 'Semáforo',
      difficulty: 'easy',
      points: 20,
      imageUrl: getPlaceholder('semaforo'),
      hint: "Regra: 3 peças da mesma cor em linha ganham o jogo. Se já tens duas, completa a linha com a mesma cor!",
      visualData: { type: 'row', row: ['Y', 'Y', '?'] }
    };
  }
  
  return {
    id,
    question: "No Semáforo, qual é a única cor de peça que pode ser colocada sobre uma peça Amarela (Y)?",
    answer: 3, // Red
    options: [1, 2, 3], 
    category: 'Semáforo',
    difficulty: 'medium',
    points: 35,
    imageUrl: getPlaceholder('semaforo'),
    hint: "Ciclo evolutivo: Verde -> Amarela -> Vermelha. As peças Vermelhas são as 'finais'.",
    visualData: { type: 'logic', label: 'Verde → Amarela → ?' }
  };
};

const generateRastrosProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const x = Math.floor(Math.random() * 5) + 2;
  const y = Math.floor(Math.random() * 8) + 2;
  
  if (difficulty === 'easy') {
    return {
      id,
      question: `No Rastros (7x10), a peça central está na casa (${x},${y}). Quantas casas adjacentes (incluindo diagonais) são possíveis movimentos para a peça?`,
      answer: 8,
      options: [4, 6, 8, 9],
      category: 'Rastros',
      difficulty: 'easy',
      points: 20,
      imageUrl: getPlaceholder('rastros'),
      hint: "Regra: A peça move-se para qualquer casa vizinha (vazia). Num tabuleiro aberto, são 8 direções.",
      visualData: { type: 'grid', grid: [['', '', ''], ['', '●', ''], ['', '', '']], label: `Pos: ${x},${y}` }
    };
  }

  return {
    id,
    question: "No Rastros, o Jogador A quer chegar à casa (1,10). Se a peça está em (3,8), qual o número mínimo de movimentos necessários?",
    answer: 2,
    options: [1, 2, 3, 4],
    category: 'Rastros',
    difficulty: 'medium',
    points: 40,
    imageUrl: getPlaceholder('rastros'),
    hint: "As diagonais contam como um único movimento. Move-te na diagonal o máximo possível!",
    visualData: { type: 'logic', label: '(3,8) → (1,10)' }
  };
};

const generateProdutoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const factors = [2, 3, 4, 5, 6, 7, 8, 9];
  const f1 = factors[Math.floor(Math.random() * factors.length)];
  const f2 = factors[Math.floor(Math.random() * factors.length)];
  const target = f1 * f2;

  if (difficulty === 'easy') {
    return {
      id,
      question: `No Produto, os marcadores de fatores estão em ${f1} e (?). Se o jogador ocupou a casa ${target}, qual é o valor do segundo fator?`,
      answer: f2,
      options: generateOptions(f2),
      category: 'Produto',
      difficulty: 'easy',
      points: 25,
      imageUrl: getPlaceholder('produto'),
      hint: `Pensa na tabuada: ${f1} vezes quanto é igual a ${target}?`,
      visualData: { type: 'logic', label: `${f1} x ? = ${target}` }
    };
  }

  return {
    id,
    question: `No Produto, os marcadores estão em 3 e 4. Queres ocupar a casa 21. Qual o marcador que deves mover? (Responde o valor do novo fator necessário)`,
    answer: 7, 
    options: [5, 6, 7, 8],
    category: 'Produto',
    difficulty: 'medium',
    points: 45,
    imageUrl: getPlaceholder('produto'),
    hint: "Podes mover apenas UM fator. Já tens o 3 (que com 7 dá 21).",
    visualData: { type: 'row', row: ['3', '4', '→', '3', '7'] }
  };
};

const generateDominorioProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  const targetSum = 10;
  const val = Math.floor(Math.random() * 6) + 1;
  const needed = targetSum - val;

  return {
    id,
    question: `No Dominório, tens de cobrir pares que somem ${targetSum}. Se uma casa livre tem o número ${val}, que número deve ter a casa ao lado para as cobrires?`,
    answer: needed,
    options: generateOptions(needed),
    category: 'Dominório',
    difficulty: 'medium',
    points: 30,
    imageUrl: getPlaceholder('dominorio'),
    hint: `A soma deve ser ${targetSum}. Faz a conta: ${targetSum} - ${val}.`,
    visualData: { type: 'grid', grid: [[val, '?']], label: `Soma Alvo: ${targetSum}` }
  };
};

const generateOuriProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  if (difficulty === 'easy') {
    return {
      id,
      question: "No Ouri (Mancala), quantas sementes são colocadas em cada uma das 12 casas no início do jogo?",
      answer: 4,
      options: [2, 3, 4, 6],
      category: 'Ouri',
      difficulty: 'easy',
      points: 20,
      imageUrl: getPlaceholder('ouri'),
      hint: "Regra: O jogo começa com um total de 48 sementes distribuídas igualmente.",
      visualData: { type: 'pits', count: 48 }
    };
  }

  return {
    id,
    question: `Tens 4 sementes na tua primeira casa. Se as 'semeares' uma a uma, em que casa cairá a última (recomeçando a contagem na casa seguinte)?`,
    answer: 5,
    options: [3, 4, 5, 6],
    category: 'Ouri',
    difficulty: 'medium',
    points: 45,
    imageUrl: getPlaceholder('ouri'),
    hint: "Semeia na casa 2, 3, 4 e 5. A última fica na 5.",
    visualData: { type: 'row', row: ['(4)', '→', '1', '2', '3', '4', '5'] }
  };
};

const generateAvancoProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "No jogo Avanço, as peças movem-se para a frente. Mas como é que capturam as peças do adversário?",
    answer: 1, // Diagonal
    options: [1, 2, 3], // 1: Diagonalmente, 2: Saltando, 3: Pulando uma casa
    category: 'Avanço',
    difficulty: 'medium',
    points: 35,
    imageUrl: getPlaceholder('avanco'),
    hint: "Pensa nos peões do Xadrez: movem-se em frente, mas capturam de lado (diagonal).",
    visualData: { type: 'logic', label: 'Captura = ?' }
  };
};

const generateGatosERatosProblem = (id: string, difficulty: 'easy' | 'medium' | 'hard'): MathProblem => {
  return {
    id,
    question: "No Gatos e Ratos, qual é o objetivo principal dos Ratos em relação ao Gato?",
    answer: 2, // Bloquear
    options: [1, 2, 3], // 1: Capturar, 2: Bloquear, 3: Fugir do tabuleiro
    category: 'Gatos e Ratos',
    difficulty: 'easy',
    points: 20,
    imageUrl: getPlaceholder('gatoseratos'),
    hint: "Os ratos não podem 'comer' o gato, apenas cercá-lo para que ele não se mova.",
    visualData: { type: 'count', count: 4, icon: '🐭' }
  };
};
