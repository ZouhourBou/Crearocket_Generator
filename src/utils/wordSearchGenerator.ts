import {
  WordSearchGrid,
  WordPlacement,
  WordSearchDifficulty,
  WordSearchTheme,
} from '../types/games';

export const THEME_WORDS: Record<
  WordSearchTheme,
  { fr: string[]; en: string[]; ar: string[] }
> = {
  animals: {
    fr: ['LION', 'TIGRE', 'OURS', 'CHAT', 'CHIEN', 'ZEBRE', 'GIRAFE', 'SINGE', 'LOUP', 'RENARD'],
    en: ['LION', 'TIGER', 'BEAR', 'CAT', 'DOG', 'ZEBRA', 'GIRAFFE', 'MONKEY', 'WOLF', 'FOX'],
    ar: ['أسد', 'نمر', 'دب', 'قط', 'كلب', 'حمار', 'زرافة', 'قرد', 'ذئب', 'ثعلب'],
  },
  school: {
    fr: ['STYLO', 'CAHIER', 'LIVRE', 'CLASSE', 'REGLE', 'GOMME', 'CRAYON', 'ECOLE', 'TABLE', 'BUREAU'],
    en: ['PEN', 'NOTEBOOK', 'BOOK', 'CLASS', 'RULER', 'ERASER', 'PENCIL', 'SCHOOL', 'DESK', 'CHAIR'],
    ar: ['قلم', 'دفتر', 'كتاب', 'فصل', 'مسطرة', 'ممحاة', 'مرسام', 'مدرسة', 'طاولة', 'مكتب'],
  },
  nature: {
    fr: ['ARBRE', 'FLEUR', 'FORET', 'RIVIERE', 'SOLEIL', 'PLUIE', 'VENT', 'MONTAGNE', 'HERBE', 'NUAGE'],
    en: ['TREE', 'FLOWER', 'FOREST', 'RIVER', 'SUN', 'RAIN', 'WIND', 'MOUNTAIN', 'GRASS', 'CLOUD'],
    ar: ['شجرة', 'زهرة', 'غابة', 'نهر', 'شمس', 'مطر', 'ريح', 'جبل', 'عشب', 'سحاب'],
  },
  space: {
    fr: ['LUNE', 'TERRE', 'ETOILE', 'FUSEE', 'PLANETE', 'MARS', 'ESPACE', 'ORBITE', 'COMETE', 'SOLEIL'],
    en: ['MOON', 'EARTH', 'STAR', 'ROCKET', 'PLANET', 'MARS', 'SPACE', 'ORBIT', 'COMET', 'SUN'],
    ar: ['قمر', 'أرض', 'نجمة', 'صاروخ', 'كوكب', 'مريخ', 'فضاء', 'مدار', 'مذنب', 'شمس'],
  },
  food: {
    fr: ['POMME', 'PAIN', 'BANANE', 'FROMAGE', 'FRAISE', 'ORANGE', 'LAIT', 'GATEAU', 'POIRE', 'CITRON'],
    en: ['APPLE', 'BREAD', 'BANANA', 'CHEESE', 'BERRY', 'ORANGE', 'MILK', 'CAKE', 'PEAR', 'LEMON'],
    ar: ['تفاح', 'خبز', 'موز', 'جبن', 'فراولة', 'برتقال', 'حليب', 'كعك', 'إجاص', 'ليمون'],
  },
  colors: {
    fr: ['ROUGE', 'BLEU', 'VERT', 'JAUNE', 'NOIR', 'BLANC', 'ROSE', 'VIOLET', 'ORANGE', 'GRIS'],
    en: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'WHITE', 'PINK', 'PURPLE', 'ORANGE', 'GRAY'],
    ar: ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'أسود', 'أبيض', 'وردي', 'بنفسجي', 'برتقالي', 'رمادي'],
  },
  custom: {
    fr: ['AMIS', 'JEU', 'SOURIS', 'LIVRE', 'JOIE'],
    en: ['FRIEND', 'PLAY', 'SMILE', 'BOOK', 'JOY'],
    ar: ['صديق', 'لعب', 'فرح', 'كتاب', 'بسمة'],
  },
};

const HIGHLIGHT_COLORS = [
  '#fecaca', // red
  '#fed7aa', // orange
  '#fef08a', // yellow
  '#bbf7d0', // green
  '#a5f3fc', // cyan
  '#bfdbfe', // blue
  '#ddd6fe', // violet
  '#fbcfe8', // pink
  '#cbd5e1', // slate
];

/**
 * Strips accents from Latin words and normalizes case
 */
export function normalizeWord(word: string, isArabic: boolean): string {
  if (isArabic) {
    // Remove Arabic tashkeel (diacritics) and normalize
    return word
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[إأآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .trim();
  }
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .trim();
}

/**
 * Generate a Word Search Puzzle
 */
export function generateWordSearch(
  wordsToPlace: string[],
  gridSize: number = 10,
  difficulty: WordSearchDifficulty = 'basic',
  isArabic: boolean = false
): WordSearchGrid {
  // Initialize empty grid
  const grid: string[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill('')
  );

  const placedWords: WordPlacement[] = [];
  const unplacedWords: string[] = [];

  // Available directions based on difficulty
  type DirTuple = [number, number, WordPlacement['direction']];
  const directions: DirTuple[] = [];

  if (!isArabic) {
    // Latin Directions
    // Horizontal LTR & Vertical Down
    directions.push([0, 1, 'H']);
    directions.push([1, 0, 'V']);

    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      directions.push([1, 1, 'D']); // Down-Right
      directions.push([1, -1, 'D']); // Down-Left
    }

    if (difficulty === 'advanced') {
      directions.push([0, -1, 'H_REV']); // Reversed Horizontal
      directions.push([-1, 0, 'V_REV']); // Reversed Vertical
      directions.push([-1, -1, 'D_REV']); // Reversed Diagonal Up-Left
      directions.push([-1, 1, 'D_REV']); // Reversed Diagonal Up-Right
    }
  } else {
    // Arabic Directions: horizontal moves Right to Left (0, -1)
    directions.push([0, -1, 'H']);
    directions.push([1, 0, 'V']);

    if (difficulty === 'intermediate' || difficulty === 'advanced') {
      directions.push([1, -1, 'D']); // Down-Left
      directions.push([1, 1, 'D']); // Down-Right
    }

    if (difficulty === 'advanced') {
      directions.push([0, 1, 'H_REV']); // Reversed RTL (Left to Right)
      directions.push([-1, 0, 'V_REV']); // Reversed Vertical
    }
  }

  // Sort words from longest to shortest for optimal placement
  const sortedWords = [...wordsToPlace]
    .map((w) => ({
      original: w,
      clean: normalizeWord(w, isArabic),
    }))
    .filter((w) => w.clean.length >= 2 && w.clean.length <= gridSize)
    .sort((a, b) => b.clean.length - a.clean.length);

  for (let wIndex = 0; wIndex < sortedWords.length; wIndex++) {
    const { original, clean } = sortedWords[wIndex];
    let placed = false;
    let attempts = 0;
    const maxAttempts = 250;

    while (!placed && attempts < maxAttempts) {
      attempts++;
      const [dRow, dCol, dirType] =
        directions[Math.floor(Math.random() * directions.length)];

      // Random starting row & col
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      const endRow = startRow + dRow * (clean.length - 1);
      const endCol = startCol + dCol * (clean.length - 1);

      // Check bounds
      if (
        endRow < 0 ||
        endRow >= gridSize ||
        endCol < 0 ||
        endCol >= gridSize
      ) {
        continue;
      }

      // Check letter conflicts
      let canPlace = true;
      for (let i = 0; i < clean.length; i++) {
        const r = startRow + dRow * i;
        const c = startCol + dCol * i;
        const cell = grid[r][c];
        if (cell !== '' && cell !== clean[i]) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        // Place letters
        for (let i = 0; i < clean.length; i++) {
          const r = startRow + dRow * i;
          const c = startCol + dCol * i;
          grid[r][c] = clean[i];
        }

        placedWords.push({
          word: clean,
          originalWord: original,
          startRow,
          startCol,
          endRow,
          endCol,
          direction: dirType,
          color: HIGHLIGHT_COLORS[placedWords.length % HIGHLIGHT_COLORS.length],
        });
        placed = true;
      }
    }

    if (!placed) {
      unplacedWords.push(original);
    }
  }

  // Fill empty cells with random letters
  const latinLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const arabicLetters = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        const chars = isArabic ? arabicLetters : latinLetters;
        grid[r][c] = chars[Math.floor(Math.random() * chars.length)];
      }
    }
  }

  return {
    size: gridSize,
    grid,
    placedWords,
    unplacedWords,
  };
}
