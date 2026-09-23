import {
  AlphabetLanguage,
  LetterMeta,
  LetterVocabularyWord,
  AlphabetActivityType,
} from '../types/alphabet';

// ==========================================
// 1. FRENCH ALPHABET DATABASE (A - Z)
// ==========================================
export const FRENCH_ALPHABET_DATA: Record<string, LetterMeta> = {
  A: {
    letter: 'A',
    lowercase: 'a',
    name: 'A',
    soundHint: '[a] comme dans Avion',
    strokeGuide: ['1. Ligne oblique vers le haut', '2. Ligne oblique vers le bas', '3. Barre horizontale'],
    distractors: ['E', 'O', 'H', 'V', 'D', 'B', 'C', 'M'],
    words: [
      { word: 'Avion', cleanWord: 'Avion', phonetic: '[a.vjɔ̃]', iconName: 'Plane', emoji: '✈️', letters: ['A', 'V', 'I', 'O', 'N'] },
      { word: 'Arbre', cleanWord: 'Arbre', phonetic: '[aʁbʁ]', iconName: 'Trees', emoji: '🌳', letters: ['A', 'R', 'B', 'R', 'E'] },
      { word: 'Abeille', cleanWord: 'Abeille', phonetic: '[a.bɛj]', iconName: 'Bug', emoji: '🐝', letters: ['A', 'B', 'E', 'I', 'L', 'L', 'E'] },
      { word: 'Ananas', cleanWord: 'Ananas', phonetic: '[a.na.na]', iconName: 'Apple', emoji: '🍍', letters: ['A', 'N', 'A', 'N', 'A', 'S'] },
    ],
  },
  B: {
    letter: 'B',
    lowercase: 'b',
    name: 'B',
    soundHint: '[b] comme dans Ballon',
    strokeGuide: ['1. Trait vertical vers le bas', '2. Demi-cercle haut', '3. Demi-cercle bas'],
    distractors: ['D', 'P', 'R', 'E', 'F', 'O', '8', '3'],
    words: [
      { word: 'Ballon', cleanWord: 'Ballon', phonetic: '[ba.lɔ̃]', iconName: 'CircleDot', emoji: '⚽', letters: ['B', 'A', 'L', 'L', 'O', 'N'] },
      { word: 'Bateau', cleanWord: 'Bateau', phonetic: '[ba.to]', iconName: 'Ship', emoji: '⛵', letters: ['B', 'A', 'T', 'E', 'A', 'U'] },
      { word: 'Banane', cleanWord: 'Banane', phonetic: '[ba.nan]', iconName: 'Banana', emoji: '🍌', letters: ['B', 'A', 'N', 'A', 'N', 'E'] },
      { word: 'Bougie', cleanWord: 'Bougie', phonetic: '[bu.ʒi]', iconName: 'Flame', emoji: '🕯️', letters: ['B', 'O', 'U', 'G', 'I', 'E'] },
    ],
  },
  C: {
    letter: 'C',
    lowercase: 'c',
    name: 'C',
    soundHint: '[k] / [s] comme dans Chat',
    strokeGuide: ['1. Arc de cercle ouvert vers la droite'],
    distractors: ['G', 'O', 'Q', 'D', 'U', 'S', 'E', 'B'],
    words: [
      { word: 'Chat', cleanWord: 'Chat', phonetic: '[ʃa]', iconName: 'Cat', emoji: '🐱', letters: ['C', 'H', 'A', 'T'] },
      { word: 'Canard', cleanWord: 'Canard', phonetic: '[ka.naʁ]', iconName: 'Bird', emoji: '🦆', letters: ['C', 'A', 'N', 'A', 'R', 'D'] },
      { word: 'Carotte', cleanWord: 'Carotte', phonetic: '[ka.ʁɔt]', iconName: 'Carrot', emoji: '🥕', letters: ['C', 'A', 'R', 'O', 'T', 'T', 'E'] },
      { word: 'Coeur', cleanWord: 'Coeur', phonetic: '[kœʁ]', iconName: 'Heart', emoji: '❤️', letters: ['C', 'O', 'E', 'U', 'R'] },
    ],
  },
  D: {
    letter: 'D',
    lowercase: 'd',
    name: 'D',
    soundHint: '[d] comme dans Dauphin',
    strokeGuide: ['1. Trait vertical vers le bas', '2. Grand demi-cercle'],
    distractors: ['B', 'P', 'O', 'Q', 'R', 'C', 'U', 'G'],
    words: [
      { word: 'Dauphin', cleanWord: 'Dauphin', phonetic: '[do.fɛ̃]', iconName: 'Fish', emoji: '🐬', letters: ['D', 'A', 'U', 'P', 'H', 'I', 'N'] },
      { word: 'Dinosaure', cleanWord: 'Dinosaure', phonetic: '[di.no.zɔʁ]', iconName: 'Footprints', emoji: '🦕', letters: ['D', 'I', 'N', 'O', 'S', 'A', 'U', 'R', 'E'] },
      { word: 'Dé', cleanWord: 'Dé', phonetic: '[de]', iconName: 'Dices', emoji: '🎲', letters: ['D', 'E'] },
      { word: 'Dent', cleanWord: 'Dent', phonetic: '[dɑ̃]', iconName: 'Smile', emoji: '🦷', letters: ['D', 'E', 'N', 'T'] },
    ],
  },
  E: {
    letter: 'E',
    lowercase: 'e',
    name: 'E',
    soundHint: '[e] / [ɛ] comme dans Étoile',
    strokeGuide: ['1. Trait vertical', '2. Barre en haut', '3. Barre au milieu', '4. Barre en bas'],
    distractors: ['F', 'B', 'L', 'H', 'C', 'T', 'I', 'O'],
    words: [
      { word: 'Étoile', cleanWord: 'Etoile', phonetic: '[e.twal]', iconName: 'Star', emoji: '⭐', letters: ['E', 'T', 'O', 'I', 'L', 'E'] },
      { word: 'Éléphant', cleanWord: 'Elephant', phonetic: '[e.le.fɑ̃]', iconName: 'Sparkles', emoji: '🐘', letters: ['E', 'L', 'E', 'P', 'H', 'A', 'N', 'T'] },
      { word: 'Escargot', cleanWord: 'Escargot', phonetic: '[ɛs.kaʁ.ɡo]', iconName: 'Bug', emoji: '🐌', letters: ['E', 'S', 'C', 'A', 'R', 'G', 'O', 'T'] },
      { word: 'Éclair', cleanWord: 'Eclair', phonetic: '[e.klɛʁ]', iconName: 'Zap', emoji: '⚡', letters: ['E', 'C', 'L', 'A', 'I', 'R'] },
    ],
  },
  F: {
    letter: 'F',
    lowercase: 'f',
    name: 'F',
    soundHint: '[f] comme dans Fleur',
    strokeGuide: ['1. Trait vertical', '2. Barre en haut', '3. Barre au milieu'],
    distractors: ['E', 'P', 'T', 'L', 'H', 'I', 'B', 'R'],
    words: [
      { word: 'Fleur', cleanWord: 'Fleur', phonetic: '[flœʁ]', iconName: 'Flower2', emoji: '🌸', letters: ['F', 'L', 'E', 'U', 'R'] },
      { word: 'Fusée', cleanWord: 'Fusee', phonetic: '[fy.ze]', iconName: 'Rocket', emoji: '🚀', letters: ['F', 'U', 'S', 'E', 'E'] },
      { word: 'Fraise', cleanWord: 'Fraise', phonetic: '[fʁɛz]', iconName: 'Cherry', emoji: '🍓', letters: ['F', 'R', 'A', 'I', 'S', 'E'] },
      { word: 'Feu', cleanWord: 'Feu', phonetic: '[fø]', iconName: 'Flame', emoji: '🔥', letters: ['F', 'E', 'U'] },
    ],
  },
  G: {
    letter: 'G',
    lowercase: 'g',
    name: 'G',
    soundHint: '[g] / [ʒ] comme dans Gâteau',
    strokeGuide: ['1. Grand arc de cercle', '2. Petit crochet intérieur'],
    distractors: ['C', 'O', 'Q', 'D', 'U', 'S', '6', 'B'],
    words: [
      { word: 'Gâteau', cleanWord: 'Gateau', phonetic: '[ɡɑ.to]', iconName: 'Cake', emoji: '🎂', letters: ['G', 'A', 'T', 'E', 'A', 'U'] },
      { word: 'Girafe', cleanWord: 'Girafe', phonetic: '[ʒi.ʁaf]', iconName: 'Camera', emoji: '🦒', letters: ['G', 'I', 'R', 'A', 'F', 'E'] },
      { word: 'Guitare', cleanWord: 'Guitare', phonetic: '[ɡi.taʁ]', iconName: 'Music', emoji: '🎸', letters: ['G', 'U', 'I', 'T', 'A', 'R', 'E'] },
      { word: 'Glace', cleanWord: 'Glace', phonetic: '[ɡlas]', iconName: 'IceCream', emoji: '🍦', letters: ['G', 'L', 'A', 'C', 'E'] },
    ],
  },
  H: {
    letter: 'H',
    lowercase: 'h',
    name: 'H',
    soundHint: 'Lettre muette comme dans Hibou',
    strokeGuide: ['1. Trait vertical gauche', '2. Trait vertical droit', '3. Barre centrale'],
    distractors: ['M', 'N', 'A', 'E', 'F', 'I', 'K', 'T'],
    words: [
      { word: 'Hibou', cleanWord: 'Hibou', phonetic: '[i.bu]', iconName: 'Bird', emoji: '🦉', letters: ['H', 'I', 'B', 'O', 'U'] },
      { word: 'Hélicoptère', cleanWord: 'Helicoptere', phonetic: '[e.li.kɔp.tɛʁ]', iconName: 'Plane', emoji: '🚁', letters: ['H', 'E', 'L', 'I', 'C', 'O', 'P', 'T', 'E', 'R', 'E'] },
      { word: 'Horloge', cleanWord: 'Horloge', phonetic: '[ɔʁ.lɔʒ]', iconName: 'Clock', emoji: '⏰', letters: ['H', 'O', 'R', 'L', 'O', 'G', 'E'] },
      { word: 'Hérisson', cleanWord: 'Herisson', phonetic: '[e.ʁi.sɔ̃]', iconName: 'Bug', emoji: '🦔', letters: ['H', 'E', 'R', 'I', 'S', 'S', 'O', 'N'] },
    ],
  },
  I: {
    letter: 'I',
    lowercase: 'i',
    name: 'I',
    soundHint: '[i] comme dans Île',
    strokeGuide: ['1. Trait vertical droit'],
    distractors: ['L', 'T', 'J', '1', 'H', 'F', 'E', 'U'],
    words: [
      { word: 'Île', cleanWord: 'Ile', phonetic: '[il]', iconName: 'Palmtree', emoji: '🏝️', letters: ['I', 'L', 'E'] },
      { word: 'Igloo', cleanWord: 'Igloo', phonetic: '[i.ɡlu]', iconName: 'Home', emoji: '🧊', letters: ['I', 'G', 'L', 'O', 'O'] },
      { word: 'Insecte', cleanWord: 'Insecte', phonetic: '[ɛ̃.sɛkt]', iconName: 'Bug', emoji: '🐛', letters: ['I', 'N', 'S', 'E', 'C', 'T', 'E'] },
      { word: 'Iris', cleanWord: 'Iris', phonetic: '[i.ʁis]', iconName: 'Flower', emoji: '🌺', letters: ['I', 'R', 'I', 'S'] },
    ],
  },
  J: {
    letter: 'J',
    lowercase: 'j',
    name: 'J',
    soundHint: '[ʒ] comme dans Jardin',
    strokeGuide: ['1. Trait vertical descendant qui s’arrondit vers la gauche'],
    distractors: ['I', 'L', 'U', 'T', 'C', 'G', 'Y', 'F'],
    words: [
      { word: 'Jardin', cleanWord: 'Jardin', phonetic: '[ʒaʁ.dɛ̃]', iconName: 'Trees', emoji: '🏡', letters: ['J', 'A', 'R', 'D', 'I', 'N'] },
      { word: 'Jus', cleanWord: 'Jus', phonetic: '[ʒy]', iconName: 'CupSoda', emoji: '🧃', letters: ['J', 'U', 'S'] },
      { word: 'Jouet', cleanWord: 'Jouet', phonetic: '[ʒwɛ]', iconName: 'Gamepad', emoji: '🧸', letters: ['J', 'O', 'U', 'E', 'T'] },
      { word: 'Jupe', cleanWord: 'Jupe', phonetic: '[ʒyp]', iconName: 'Shirt', emoji: '👗', letters: ['J', 'U', 'P', 'E'] },
    ],
  },
  K: {
    letter: 'K',
    lowercase: 'k',
    name: 'K',
    soundHint: '[k] comme dans Koala',
    strokeGuide: ['1. Trait vertical', '2. Diagonale descendante vers le centre', '3. Diagonale descendante vers le bas'],
    distractors: ['X', 'H', 'Y', 'R', 'N', 'F', 'T', 'A'],
    words: [
      { word: 'Koala', cleanWord: 'Koala', phonetic: '[kɔ.a.la]', iconName: 'Heart', emoji: '🐨', letters: ['K', 'O', 'A', 'L', 'A'] },
      { word: 'Kangourou', cleanWord: 'Kangourou', phonetic: '[kɑ̃.ɡu.ʁu]', iconName: 'Footprints', emoji: '🦘', letters: ['K', 'A', 'N', 'G', 'O', 'U', 'R', 'O', 'U'] },
      { word: 'Kiwi', cleanWord: 'Kiwi', phonetic: '[ki.wi]', iconName: 'Apple', emoji: '🥝', letters: ['K', 'I', 'W', 'I'] },
      { word: 'Kayak', cleanWord: 'Kayak', phonetic: '[ka.jak]', iconName: 'Ship', emoji: '🛶', letters: ['K', 'A', 'Y', 'A', 'K'] },
    ],
  },
  L: {
    letter: 'L',
    lowercase: 'l',
    name: 'L',
    soundHint: '[l] comme dans Lion',
    strokeGuide: ['1. Trait vertical vers le bas', '2. Trait horizontal vers la droite'],
    distractors: ['I', 'T', 'E', 'F', 'J', 'U', 'C', 'H'],
    words: [
      { word: 'Lion', cleanWord: 'Lion', phonetic: '[ljɔ̃]', iconName: 'Crown', emoji: '🦁', letters: ['L', 'I', 'O', 'N'] },
      { word: 'Lune', cleanWord: 'Lune', phonetic: '[lyn]', iconName: 'Moon', emoji: '🌙', letters: ['L', 'U', 'N', 'E'] },
      { word: 'Livre', cleanWord: 'Livre', phonetic: '[livʁ]', iconName: 'BookOpen', emoji: '📖', letters: ['L', 'I', 'V', 'R', 'E'] },
      { word: 'Lapin', cleanWord: 'Lapin', phonetic: '[la.pɛ̃]', iconName: 'Footprints', emoji: '🐰', letters: ['L', 'A', 'P', 'I', 'N'] },
    ],
  },
  M: {
    letter: 'M',
    lowercase: 'm',
    name: 'M',
    soundHint: '[m] comme dans Maison',
    strokeGuide: ['1. Trait vertical haut', '2. Diagonale bas', '3. Diagonale haut', '4. Trait vertical bas'],
    distractors: ['N', 'W', 'H', 'V', 'A', 'U', 'B', 'E'],
    words: [
      { word: 'Maison', cleanWord: 'Maison', phonetic: '[mɛ.zɔ̃]', iconName: 'Home', emoji: '🏠', letters: ['M', 'A', 'I', 'S', 'O', 'N'] },
      { word: 'Maman', cleanWord: 'Maman', phonetic: '[ma.mɑ̃]', iconName: 'Heart', emoji: '👩', letters: ['M', 'A', 'M', 'A', 'N'] },
      { word: 'Mouton', cleanWord: 'Mouton', phonetic: '[mu.tɔ̃]', iconName: 'Cloud', emoji: '🐑', letters: ['M', 'O', 'U', 'T', 'O', 'N'] },
      { word: 'Montre', cleanWord: 'Montre', phonetic: '[mɔ̃tʁ]', iconName: 'Watch', emoji: '⌚', letters: ['M', 'O', 'N', 'T', 'R', 'E'] },
    ],
  },
  N: {
    letter: 'N',
    lowercase: 'n',
    name: 'N',
    soundHint: '[n] comme dans Nuage',
    strokeGuide: ['1. Trait vertical haut', '2. Diagonale bas droite', '3. Trait vertical haut'],
    distractors: ['M', 'H', 'Z', 'U', 'V', 'I', 'A', 'W'],
    words: [
      { word: 'Nuage', cleanWord: 'Nuage', phonetic: '[nɥaʒ]', iconName: 'Cloud', emoji: '☁️', letters: ['N', 'U', 'A', 'G', 'E'] },
      { word: 'Nid', cleanWord: 'Nid', phonetic: '[ni]', iconName: 'Egg', emoji: '🪹', letters: ['N', 'I', 'D'] },
      { word: 'Navire', cleanWord: 'Navire', phonetic: '[na.viʁ]', iconName: 'Ship', emoji: '🚢', letters: ['N', 'A', 'V', 'I', 'R', 'E'] },
      { word: 'Neige', cleanWord: 'Neige', phonetic: '[nɛʒ]', iconName: 'Snowflake', emoji: '❄️', letters: ['N', 'E', 'I', 'G', 'E'] },
    ],
  },
  O: {
    letter: 'O',
    lowercase: 'o',
    name: 'O',
    soundHint: '[o] / [ɔ] comme dans Orange',
    strokeGuide: ['1. Cercle fermé tracé dans le sens anti-horaire'],
    distractors: ['Q', 'C', 'D', 'G', '0', 'U', 'B', 'P'],
    words: [
      { word: 'Orange', cleanWord: 'Orange', phonetic: '[ɔ.ʁɑ̃ʒ]', iconName: 'Circle', emoji: '🍊', letters: ['O', 'R', 'A', 'N', 'G', 'E'] },
      { word: 'Oiseau', cleanWord: 'Oiseau', phonetic: '[wa.zo]', iconName: 'Bird', emoji: '🐦', letters: ['O', 'I', 'S', 'E', 'A', 'U'] },
      { word: 'Ours', cleanWord: 'Ours', phonetic: '[uʁs]', iconName: 'Footprints', emoji: '🐻', letters: ['O', 'U', 'R', 'S'] },
      { word: 'Ordinateur', cleanWord: 'Ordinateur', phonetic: '[ɔʁ.di.na.tœʁ]', iconName: 'Laptop', emoji: '💻', letters: ['O', 'R', 'D', 'I', 'N', 'A', 'T', 'E', 'U', 'R'] },
    ],
  },
  P: {
    letter: 'P',
    lowercase: 'p',
    name: 'P',
    soundHint: '[p] comme dans Papillon',
    strokeGuide: ['1. Trait vertical vers le bas', '2. Demi-cercle supérieur vers la droite'],
    distractors: ['B', 'D', 'R', 'F', 'q', 'b', 'd', 'O'],
    words: [
      { word: 'Papillon', cleanWord: 'Papillon', phonetic: '[pa.pi.jɔ̃]', iconName: 'Sparkles', emoji: '🦋', letters: ['P', 'A', 'P', 'I', 'L', 'L', 'O', 'N'] },
      { word: 'Pomme', cleanWord: 'Pomme', phonetic: '[pɔm]', iconName: 'Apple', emoji: '🍎', letters: ['P', 'O', 'M', 'M', 'E'] },
      { word: 'Poisson', cleanWord: 'Poisson', phonetic: '[pwa.sɔ̃]', iconName: 'Fish', emoji: '🐟', letters: ['P', 'O', 'I', 'S', 'S', 'O', 'N'] },
      { word: 'Parapluie', cleanWord: 'Parapluie', phonetic: '[pa.ʁa.plɥi]', iconName: 'Umbrella', emoji: '☂️', letters: ['P', 'A', 'R', 'A', 'P', 'L', 'U', 'I', 'E'] },
    ],
  },
  Q: {
    letter: 'Q',
    lowercase: 'q',
    name: 'Q',
    soundHint: '[k] comme dans Quatre',
    strokeGuide: ['1. Cercle fermé', '2. Petit trait oblique en bas à droite'],
    distractors: ['O', 'C', 'G', 'D', 'p', 'b', 'd', 'U'],
    words: [
      { word: 'Quatre', cleanWord: 'Quatre', phonetic: '[katʁ]', iconName: 'Hash', emoji: '4️⃣', letters: ['Q', 'U', 'A', 'T', 'R', 'E'] },
      { word: 'Quille', cleanWord: 'Quille', phonetic: '[kij]', iconName: 'CircleDot', emoji: '🎳', letters: ['Q', 'U', 'I', 'L', 'L', 'E'] },
      { word: 'Question', cleanWord: 'Question', phonetic: '[kɛs.tjɔ̃]', iconName: 'HelpCircle', emoji: '❓', letters: ['Q', 'U', 'E', 'S', 'T', 'I', 'O', 'N'] },
      { word: 'Queue', cleanWord: 'Queue', phonetic: '[kø]', iconName: 'Cat', emoji: '🐈', letters: ['Q', 'U', 'E', 'U', 'E'] },
    ],
  },
  R: {
    letter: 'R',
    lowercase: 'r',
    name: 'R',
    soundHint: '[ʁ] comme dans Robot',
    strokeGuide: ['1. Trait vertical', '2. Demi-cercle haut', '3. Jambe oblique bas droite'],
    distractors: ['P', 'B', 'D', 'K', 'A', 'F', 'E', 'H'],
    words: [
      { word: 'Robot', cleanWord: 'Robot', phonetic: '[ʁo.bo]', iconName: 'Bot', emoji: '🤖', letters: ['R', 'O', 'B', 'O', 'T'] },
      { word: 'Renard', cleanWord: 'Renard', phonetic: '[ʁə.naʁ]', iconName: 'Footprints', emoji: '🦊', letters: ['R', 'E', 'N', 'A', 'R', 'D'] },
      { word: 'Rose', cleanWord: 'Rose', phonetic: '[ʁoz]', iconName: 'Flower2', emoji: '🌹', letters: ['R', 'O', 'S', 'E'] },
      { word: 'Roue', cleanWord: 'Roue', phonetic: '[ʁu]', iconName: 'Circle', emoji: '🛞', letters: ['R', 'O', 'U', 'E'] },
    ],
  },
  S: {
    letter: 'S',
    lowercase: 's',
    name: 'S',
    soundHint: '[s] comme dans Soleil',
    strokeGuide: ['1. Courbe vers la gauche', '2. Courbe vers la droite en forme de serpent'],
    distractors: ['5', '8', 'C', 'Z', 'G', 'O', 'E', 'B'],
    words: [
      { word: 'Soleil', cleanWord: 'Soleil', phonetic: '[sɔ.lɛj]', iconName: 'Sun', emoji: '☀️', letters: ['S', 'O', 'L', 'E', 'I', 'L'] },
      { word: 'Serpent', cleanWord: 'Serpent', phonetic: '[sɛʁ.pɑ̃]', iconName: 'Zap', emoji: '🐍', letters: ['S', 'E', 'R', 'P', 'E', 'N', 'T'] },
      { word: 'Sapin', cleanWord: 'Sapin', phonetic: '[sa.pɛ̃]', iconName: 'Trees', emoji: '🌲', letters: ['S', 'A', 'P', 'I', 'N'] },
      { word: 'Souris', cleanWord: 'Souris', phonetic: '[su.ʁi]', iconName: 'Mouse', emoji: '🐭', letters: ['S', 'O', 'U', 'R', 'I', 'S'] },
    ],
  },
  T: {
    letter: 'T',
    lowercase: 't',
    name: 'T',
    soundHint: '[t] comme dans Tortue',
    strokeGuide: ['1. Barre horizontale en haut', '2. Trait vertical centré vers le bas'],
    distractors: ['I', 'L', 'F', 'E', 'H', 'Y', 'J', 'D'],
    words: [
      { word: 'Tortue', cleanWord: 'Tortue', phonetic: '[tɔʁ.ty]', iconName: 'Shield', emoji: '🐢', letters: ['T', 'O', 'R', 'T', 'U', 'E'] },
      { word: 'Train', cleanWord: 'Train', phonetic: '[tʁɛ̃]', iconName: 'Train', emoji: '🚂', letters: ['T', 'R', 'A', 'I', 'N'] },
      { word: 'Tigre', cleanWord: 'Tigre', phonetic: '[tiɡʁ]', iconName: 'Flame', emoji: '🐯', letters: ['T', 'I', 'G', 'R', 'E'] },
      { word: 'Téléphone', cleanWord: 'Telephone', phonetic: '[te.le.fɔn]', iconName: 'Phone', emoji: '📱', letters: ['T', 'E', 'L', 'E', 'P', 'H', 'O', 'N', 'E'] },
    ],
  },
  U: {
    letter: 'U',
    lowercase: 'u',
    name: 'U',
    soundHint: '[y] comme dans Usine',
    strokeGuide: ['1. Trait descendant', '2. Courbe en bas', '3. Trait remontant droit'],
    distractors: ['V', 'O', 'C', 'J', 'W', 'N', 'D', 'L'],
    words: [
      { word: 'Usine', cleanWord: 'Usine', phonetic: '[y.zin]', iconName: 'Building', emoji: '🏭', letters: ['U', 'S', 'I', 'N', 'E'] },
      { word: 'Uniforme', cleanWord: 'Uniforme', phonetic: '[y.ni.fɔʁm]', iconName: 'Shirt', emoji: '🥋', letters: ['U', 'N', 'I', 'F', 'O', 'R', 'M', 'E'] },
      { word: 'Univers', cleanWord: 'Univers', phonetic: '[y.ni.vɛʁ]', iconName: 'Sparkles', emoji: '🌌', letters: ['U', 'N', 'I', 'V', 'E', 'R', 'S'] },
      { word: 'Un', cleanWord: 'Un', phonetic: '[œ̃]', iconName: 'Hash', emoji: '1️⃣', letters: ['U', 'N'] },
    ],
  },
  V: {
    letter: 'V',
    lowercase: 'v',
    name: 'V',
    soundHint: '[v] comme dans Voiture',
    strokeGuide: ['1. Trait oblique descendant vers la pointe', '2. Trait oblique remontant'],
    distractors: ['U', 'W', 'Y', 'A', 'T', 'X', 'N', 'L'],
    words: [
      { word: 'Voiture', cleanWord: 'Voiture', phonetic: '[vwa.tyʁ]', iconName: 'Car', emoji: '🚗', letters: ['V', 'O', 'I', 'T', 'U', 'R', 'E'] },
      { word: 'Vélo', cleanWord: 'Velo', phonetic: '[ve.lo]', iconName: 'Bike', emoji: '🚲', letters: ['V', 'E', 'L', 'O'] },
      { word: 'Violon', cleanWord: 'Violon', phonetic: '[vjɔ.lɔ̃]', iconName: 'Music', emoji: '🎻', letters: ['V', 'I', 'O', 'L', 'O', 'N'] },
      { word: 'Vache', cleanWord: 'Vache', phonetic: '[vaʃ]', iconName: 'Footprints', emoji: '🐄', letters: ['V', 'A', 'C', 'H', 'E'] },
    ],
  },
  W: {
    letter: 'W',
    lowercase: 'w',
    name: 'W',
    soundHint: '[w] / [v] comme dans Wagon',
    strokeGuide: ['1. Deux V accolés l’un à côté de l’autre'],
    distractors: ['M', 'V', 'N', 'U', 'X', 'H', 'A', 'Y'],
    words: [
      { word: 'Wagon', cleanWord: 'Wagon', phonetic: '[va.ɡɔ̃]', iconName: 'Train', emoji: '🚃', letters: ['W', 'A', 'G', 'O', 'N'] },
      { word: 'Wifi', cleanWord: 'Wifi', phonetic: '[wi.fi]', iconName: 'Wifi', emoji: '📶', letters: ['W', 'I', 'F', 'I'] },
      { word: 'Wallaby', cleanWord: 'Wallaby', phonetic: '[wa.la.bi]', iconName: 'Footprints', emoji: '🦘', letters: ['W', 'A', 'L', 'L', 'A', 'B', 'Y'] },
      { word: 'Web', cleanWord: 'Web', phonetic: '[wɛb]', iconName: 'Globe', emoji: '🌐', letters: ['W', 'E', 'B'] },
    ],
  },
  X: {
    letter: 'X',
    lowercase: 'x',
    name: 'X',
    soundHint: '[ks] / [gz] comme dans Xylophone',
    strokeGuide: ['1. Diagonale de gauche à droite', '2. Diagonale croisée de droite à gauche'],
    distractors: ['K', 'Y', 'Z', 'T', 'H', 'V', 'W', '+'],
    words: [
      { word: 'Xylophone', cleanWord: 'Xylophone', phonetic: '[ɡzi.lɔ.fɔn]', iconName: 'Music', emoji: '🎶', letters: ['X', 'Y', 'L', 'O', 'P', 'H', 'O', 'N', 'E'] },
      { word: 'Xipho', cleanWord: 'Xipho', phonetic: '[ɡzi.fo]', iconName: 'Fish', emoji: '🐠', letters: ['X', 'I', 'P', 'H', 'O'] },
      { word: 'Xérès', cleanWord: 'Xeres', phonetic: '[kse.ʁɛs]', iconName: 'GlassWater', emoji: '🍷', letters: ['X', 'E', 'R', 'E', 'S'] },
      { word: 'Xylocope', cleanWord: 'Xylocope', phonetic: '[ɡzi.lɔ.kɔp]', iconName: 'Bug', emoji: '🐝', letters: ['X', 'Y', 'L', 'O', 'C', 'O', 'P', 'E'] },
    ],
  },
  Y: {
    letter: 'Y',
    lowercase: 'y',
    name: 'Y',
    soundHint: '[j] / [i] comme dans Yaourt',
    strokeGuide: ['1. Petite diagonale gauche', '2. Petite diagonale droite', '3. Trait vertical vers le bas'],
    distractors: ['V', 'T', 'X', 'I', 'J', 'U', 'K', 'L'],
    words: [
      { word: 'Yaourt', cleanWord: 'Yaourt', phonetic: '[ja.uʁt]', iconName: 'Milk', emoji: '🥛', letters: ['Y', 'A', 'O', 'U', 'R', 'T'] },
      { word: 'Yoyo', cleanWord: 'Yoyo', phonetic: '[jɔ.jo]', iconName: 'Circle', emoji: '🪀', letters: ['Y', 'O', 'Y', 'O'] },
      { word: 'Yacht', cleanWord: 'Yacht', phonetic: '[jɔt]', iconName: 'Ship', emoji: '🛥️', letters: ['Y', 'A', 'C', 'H', 'T'] },
      { word: 'Yoga', cleanWord: 'Yoga', phonetic: '[jɔ.ɡa]', iconName: 'Heart', emoji: '🧘', letters: ['Y', 'O', 'G', 'A'] },
    ],
  },
  Z: {
    letter: 'Z',
    lowercase: 'z',
    name: 'Z',
    soundHint: '[z] comme dans Zèbre',
    strokeGuide: ['1. Barre horizontale en haut', '2. Diagonale vers le bas gauche', '3. Barre horizontale en bas'],
    distractors: ['S', 'N', 'X', '7', 'E', 'T', 'I', '2'],
    words: [
      { word: 'Zèbre', cleanWord: 'Zebre', phonetic: '[zɛbʁ]', iconName: 'Footprints', emoji: '🦓', letters: ['Z', 'E', 'B', 'R', 'E'] },
      { word: 'Zéro', cleanWord: 'Zero', phonetic: '[ze.ʁo]', iconName: 'Circle', emoji: '0️⃣', letters: ['Z', 'E', 'R', 'O'] },
      { word: 'Zoo', cleanWord: 'Zoo', phonetic: '[zo]', iconName: 'Trees', emoji: '🦁', letters: ['Z', 'O', 'O'] },
      { word: 'Zigzag', cleanWord: 'Zigzag', phonetic: '[ziɡ.zaɡ]', iconName: 'Zap', emoji: '⚡', letters: ['Z', 'I', 'G', 'Z', 'A', 'G'] },
    ],
  },
};

// ==========================================
// 2. ARABIC ALPHABET DATABASE (أ - ي)
// ==========================================
export const ARABIC_ALPHABET_DATA_RICH: Record<string, LetterMeta> = {
  أ: {
    letter: 'أ',
    name: 'Alif',
    nameAr: 'أَلِف',
    soundHint: 'صوت الهمزة مع الألف [a]',
    strokeGuide: ['1. خط رأسي مستقيم من الأعلى إلى الأسفل', '2. رسم الهمزة فوق الرأس'],
    contextualForms: {
      isolated: 'أ',
      initial: 'أ',
      medial: 'ـأ',
      final: 'ـأ',
    },
    distractors: ['إ', 'آ', 'ا', 'ل', 'د', 'و', 'ك', 'ط'],
    words: [
      { word: 'أَسَدٌ', cleanWord: 'اسد', translation: 'Lion', iconName: 'Crown', emoji: '🦁', letters: ['أ', 'س', 'د'] },
      { word: 'أَرْنَبٌ', cleanWord: 'ارنب', translation: 'Lapin', iconName: 'Footprints', emoji: '🐰', letters: ['أ', 'ر', 'ن', 'ب'] },
      { word: 'أَنَانَاسٌ', cleanWord: 'اناناس', translation: 'Ananas', iconName: 'Apple', emoji: '🍍', letters: ['أ', 'ن', 'ا', 'ن', 'ا', 'س'] },
      { word: 'أُمِّي', cleanWord: 'امي', translation: 'Maman', iconName: 'Heart', emoji: '👩', letters: ['أ', 'م', 'ي'] },
    ],
  },
  ب: {
    letter: 'ب',
    name: 'Baa',
    nameAr: 'بَاء',
    soundHint: 'صوت الباء [b] بنقطة في الأسفل',
    strokeGuide: ['1. خط قصير مائل من اليمين', '2. استقرار على السطر', '3. صعود يساراً ونقطة تحت السطر'],
    contextualForms: {
      isolated: 'ب',
      initial: 'بـ',
      medial: 'ـبـ',
      final: 'ـب',
    },
    distractors: ['ت', 'ث', 'ن', 'ي', 'ف', 'ل', 'ك', 'س'],
    words: [
      { word: 'بَطَّةٌ', cleanWord: 'بطة', translation: 'Canard', iconName: 'Bird', emoji: '🦆', letters: ['ب', 'ط', 'ة'] },
      { word: 'بَيْتٌ', cleanWord: 'بيت', translation: 'Maison', iconName: 'Home', emoji: '🏠', letters: ['ب', 'ي', 'ت'] },
      { word: 'بُرْتُقَالٌ', cleanWord: 'برتقال', translation: 'Orange', iconName: 'Circle', emoji: '🍊', letters: ['ب', 'ر', 'ت', 'ق', 'ا', 'ل'] },
      { word: 'بَابٌ', cleanWord: 'باب', translation: 'Porte', iconName: 'DoorClosed', emoji: '🚪', letters: ['ب', 'ا', 'ب'] },
    ],
  },
  ت: {
    letter: 'ت',
    name: 'Taa',
    nameAr: 'تَاء',
    soundHint: 'صوت التاء [t] بنقطتين في الأعلى',
    strokeGuide: ['1. رسم الطبق على السطر', '2. وضع نقطتين فوق السطر'],
    contextualForms: {
      isolated: 'ت',
      initial: 'تـ',
      medial: 'ـتـ',
      final: 'ـت',
    },
    distractors: ['ب', 'ث', 'ن', 'ي', 'ة', 'ف', 'ق', 'ك'],
    words: [
      { word: 'تُفَّاحٌ', cleanWord: 'تفاح', translation: 'Pomme', iconName: 'Apple', emoji: '🍎', letters: ['ت', 'ف', 'ا', 'ح'] },
      { word: 'تِمْسَاحٌ', cleanWord: 'تمساح', translation: 'Crocodile', iconName: 'Footprints', emoji: '🐊', letters: ['ت', 'م', 'س', 'ا', 'ح'] },
      { word: 'تَاجٌ', cleanWord: 'تاج', translation: 'Couronne', iconName: 'Crown', emoji: '👑', letters: ['ت', 'ا', 'ج'] },
      { word: 'تَمْرٌ', cleanWord: 'تمر', translation: 'Dattes', iconName: 'Palmtree', emoji: '🌴', letters: ['ت', 'م', 'ر'] },
    ],
  },
  ث: {
    letter: 'ث',
    name: 'Thaa',
    nameAr: 'ثَاء',
    soundHint: 'صوت الثاء اللثوي [θ] بثلاث نقاط',
    strokeGuide: ['1. رسم الطبق', '2. وضع ثلاث نقاط مثلثة في الأعلى'],
    contextualForms: {
      isolated: 'ث',
      initial: 'ثـ',
      medial: 'ـثـ',
      final: 'ـث',
    },
    distractors: ['ت', 'ب', 'ن', 'ش', 'س', 'ي', 'ف', 'ذ'],
    words: [
      { word: 'ثَعْلَبٌ', cleanWord: 'ثعلب', translation: 'Renard', iconName: 'Footprints', emoji: '🦊', letters: ['ث', 'ع', 'ل', 'ب'] },
      { word: 'ثَلْجٌ', cleanWord: 'ثلج', translation: 'Neige', iconName: 'Snowflake', emoji: '❄️', letters: ['ث', 'ل', 'ج'] },
      { word: 'ثُعْبَانٌ', cleanWord: 'ثعبان', translation: 'Serpent', iconName: 'Zap', emoji: '🐍', letters: ['ث', 'ع', 'ب', 'ا', 'ن'] },
      { word: 'ثَوْبٌ', cleanWord: 'ثوب', translation: 'Robe', iconName: 'Shirt', emoji: '👗', letters: ['ث', 'و', 'ب'] },
    ],
  },
  ج: {
    letter: 'ج',
    name: 'Jeem',
    nameAr: 'جِيم',
    soundHint: 'صوت الجيم [dʒ] بنقطة في بطنها',
    strokeGuide: ['1. حاجب مقوس في الأعلى', '2. نصف دائرة تنزل تحت السطر مع نقطة'],
    contextualForms: {
      isolated: 'ج',
      initial: 'جـ',
      medial: 'ـجـ',
      final: 'ـج',
    },
    distractors: ['ح', 'خ', 'ع', 'غ', 'م', 'ص', 'ض', 'ب'],
    words: [
      { word: 'جَمَلٌ', cleanWord: 'جمل', translation: 'Chameau', iconName: 'Footprints', emoji: '🐪', letters: ['ج', 'م', 'ل'] },
      { word: 'جَزَرٌ', cleanWord: 'جزر', translation: 'Carotte', iconName: 'Carrot', emoji: '🥕', letters: ['ج', 'ز', 'ر'] },
      { word: 'جَبَلٌ', cleanWord: 'جبل', translation: 'Montagne', iconName: 'Mountain', emoji: '⛰️', letters: ['ج', 'ب', 'ل'] },
      { word: 'جُبْنٌ', cleanWord: 'جبن', translation: 'Fromage', iconName: 'Sparkles', emoji: '🧀', letters: ['ج', 'ب', 'ن'] },
    ],
  },
  ح: {
    letter: 'ح',
    name: 'Haa',
    nameAr: 'حَاء',
    soundHint: 'صوت الحاء الحلقي [ħ] بدون نقاط',
    strokeGuide: ['1. حاجب مقوس علوي', '2. نصف دائرة مقوسة بدون نقاط'],
    contextualForms: {
      isolated: 'ح',
      initial: 'حـ',
      medial: 'ـحـ',
      final: 'ـح',
    },
    distractors: ['ج', 'خ', 'ع', 'غ', 'م', 'هـ', 'ص', 'ق'],
    words: [
      { word: 'حِصَانٌ', cleanWord: 'حصان', translation: 'Cheval', iconName: 'Footprints', emoji: '🐴', letters: ['ح', 'ص', 'ا', 'ن'] },
      { word: 'حَلِيبٌ', cleanWord: 'حليب', translation: 'Lait', iconName: 'Milk', emoji: '🥛', letters: ['ح', 'ل', 'ي', 'ب'] },
      { word: 'حُوتٌ', cleanWord: 'حوت', translation: 'Baleine', iconName: 'Fish', emoji: '🐋', letters: ['ح', 'و', 'ت'] },
      { word: 'حَقِيبَةٌ', cleanWord: 'حقيبة', translation: 'Cartable', iconName: 'Briefcase', emoji: '🎒', letters: ['ح', 'ق', 'ي', 'ب', 'ة'] },
    ],
  },
  خ: {
    letter: 'خ',
    name: 'Khaa',
    nameAr: 'خَاء',
    soundHint: 'صوت الخاء المفخم [x] بنقطة فوق رأسها',
    strokeGuide: ['1. حاجب مقوس', '2. نصف دائرة تنزل تحت السطر', '3. نقطة فوق الرأس'],
    contextualForms: {
      isolated: 'خ',
      initial: 'خـ',
      medial: 'ـخـ',
      final: 'ـخ',
    },
    distractors: ['ح', 'ج', 'غ', 'ع', 'ف', 'ق', 'ك', 'ض'],
    words: [
      { word: 'خَرُوفٌ', cleanWord: 'خروف', translation: 'Mouton', iconName: 'Cloud', emoji: '🐑', letters: ['خ', 'ر', 'و', 'ف'] },
      { word: 'خُبْزٌ', cleanWord: 'خبز', translation: 'Pain', iconName: 'Sparkles', emoji: '🍞', letters: ['خ', 'ب', 'ز'] },
      { word: 'خِيَارٌ', cleanWord: 'خيار', translation: 'Concombre', iconName: 'Apple', emoji: '🥒', letters: ['خ', 'ي', 'ا', 'ر'] },
      { word: 'خَاتَمٌ', cleanWord: 'خاتم', translation: 'Bague', iconName: 'Circle', emoji: '💍', letters: ['خ', 'ا', 'ت', 'م'] },
    ],
  },
  د: {
    letter: 'د',
    name: 'Daal',
    nameAr: 'دَال',
    soundHint: 'صوت الدال [d] من حروف الانفصال',
    strokeGuide: ['1. خط مائل من الأعلى لليمين', '2. زاوية واستقرار أفقي على السطر'],
    contextualForms: {
      isolated: 'د',
      initial: 'د',
      medial: 'ـد',
      final: 'ـد',
    },
    distractors: ['ذ', 'ر', 'ز', 'و', 'ك', 'ا', 'ل', 'ن'],
    words: [
      { word: 'دُبٌّ', cleanWord: 'دب', translation: 'Ours', iconName: 'Footprints', emoji: '🐻', letters: ['د', 'ب'] },
      { word: 'دَرَّاجَةٌ', cleanWord: 'دراجة', translation: 'Vélo', iconName: 'Bike', emoji: '🚲', letters: ['د', 'ر', 'ا', 'ج', 'ة'] },
      { word: 'دِيكٌ', cleanWord: 'ديك', translation: 'Coq', iconName: 'Bird', emoji: '🐓', letters: ['د', 'ي', 'ك'] },
      { word: 'دَارٌ', cleanWord: 'دار', translation: 'Maison', iconName: 'Home', emoji: '🏡', letters: ['د', 'ا', 'ر'] },
    ],
  },
  ذ: {
    letter: 'ذ',
    name: 'Dhaal',
    nameAr: 'ذَال',
    soundHint: 'صوت الذال اللثوي [ð] بنقطة فوقه',
    strokeGuide: ['1. خط مائل مع زاوية على السطر', '2. نقطة واحدة في الأعلى'],
    contextualForms: {
      isolated: 'ذ',
      initial: 'ذ',
      medial: 'ـذ',
      final: 'ـذ',
    },
    distractors: ['د', 'ز', 'ر', 'و', 'ن', 'ث', 'ظ', 'ك'],
    words: [
      { word: 'ذِئْبٌ', cleanWord: 'ذئب', translation: 'Loup', iconName: 'Footprints', emoji: '🐺', letters: ['ذ', 'ئ', 'ب'] },
      { word: 'ذُرَةٌ', cleanWord: 'ذرة', translation: 'Maïs', iconName: 'Apple', emoji: '🌽', letters: ['ذ', 'ر', 'ة'] },
      { word: 'ذُبَابَةٌ', cleanWord: 'ذبابة', translation: 'Mouche', iconName: 'Bug', emoji: '🪰', letters: ['ذ', 'ب', 'ا', 'ب', 'ة'] },
      { word: 'ذَيْلٌ', cleanWord: 'ذيل', translation: 'Queue', iconName: 'Cat', emoji: '🐈', letters: ['ذ', 'ي', 'ل'] },
    ],
  },
  ر: {
    letter: 'ر',
    name: 'Raa',
    nameAr: 'رَاء',
    soundHint: 'صوت الراء [r] يتزحلق تحت السطر',
    strokeGuide: ['1. سن قصير فوق السطر', '2. هلال مائل يتزحلق تحت السطر'],
    contextualForms: {
      isolated: 'ر',
      initial: 'ر',
      medial: 'ـر',
      final: 'ـر',
    },
    distractors: ['ز', 'د', 'ذ', 'و', 'ل', 'ن', 'ي', 'ا'],
    words: [
      { word: 'رِيشَةٌ', cleanWord: 'ريشة', translation: 'Plume', iconName: 'Feather', emoji: '🪶', letters: ['ر', 'ي', 'ش', 'ة'] },
      { word: 'رُمَّانٌ', cleanWord: 'رمان', translation: 'Grenade', iconName: 'Apple', emoji: '🍎', letters: ['ر', 'م', 'ا', 'ن'] },
      { word: 'رَجُلٌ آلِيٌّ', cleanWord: 'رجل الي', translation: 'Robot', iconName: 'Bot', emoji: '🤖', letters: ['ر', 'ج', 'ل'] },
      { word: 'رِسَالَةٌ', cleanWord: 'رسالة', translation: 'Lettre', iconName: 'Mail', emoji: '✉️', letters: ['ر', 'س', 'ا', 'ل', 'ة'] },
    ],
  },
  ز: {
    letter: 'ز',
    name: 'Zaay',
    nameAr: 'زَاي',
    soundHint: 'صوت الزاي [z] بنقطة فوقه',
    strokeGuide: ['1. سن فوق السطر وهلال تحته', '2. نقطة في الأعلى'],
    contextualForms: {
      isolated: 'ز',
      initial: 'ز',
      medial: 'ـز',
      final: 'ـز',
    },
    distractors: ['ر', 'ذ', 'د', 'و', 'ن', 'س', 'ش', 'ف'],
    words: [
      { word: 'زَرَافَةٌ', cleanWord: 'زرافة', translation: 'Girafe', iconName: 'Camera', emoji: '🦒', letters: ['ز', 'ر', 'ا', 'ف', 'ة'] },
      { word: 'زَهْرَةٌ', cleanWord: 'زهرة', translation: 'Fleur', iconName: 'Flower2', emoji: '🌸', letters: ['ز', 'ه', 'ر', 'ة'] },
      { word: 'زَيْتُونٌ', cleanWord: 'زيتون', translation: 'Olive', iconName: 'Circle', emoji: '🫒', letters: ['ز', 'ي', 'ت', 'و', 'ن'] },
      { word: 'زِرٌّ', cleanWord: 'زر', translation: 'Bouton', iconName: 'CircleDot', emoji: '🔘', letters: ['ز', 'ر'] },
    ],
  },
  س: {
    letter: 'س',
    name: 'Seen',
    nameAr: 'سِين',
    soundHint: 'صوت السين الصافر [s] بثلاثة أسنان',
    strokeGuide: ['1. السن الأول', '2. السن الثاني', '3. كاسة مقوسة تنزل تحت السطر'],
    contextualForms: {
      isolated: 'س',
      initial: 'سـ',
      medial: 'ـسـ',
      final: 'ـس',
    },
    distractors: ['ش', 'ص', 'ض', 'ب', 'ت', 'ث', 'ن', 'ي'],
    words: [
      { word: 'سَيَّارَةٌ', cleanWord: 'سيارة', translation: 'Voiture', iconName: 'Car', emoji: '🚗', letters: ['س', 'ي', 'ا', 'ر', 'ة'] },
      { word: 'سَمَكَةٌ', cleanWord: 'سمكة', translation: 'Poisson', iconName: 'Fish', emoji: '🐟', letters: ['س', 'م', 'ك', 'ة'] },
      { word: 'سَاعَةٌ', cleanWord: 'ساعة', translation: 'Horloge', iconName: 'Clock', emoji: '⏰', letters: ['س', 'ا', 'ع', 'ة'] },
      { word: 'سُلَحْفَاةٌ', cleanWord: 'سلحفاة', translation: 'Tortue', iconName: 'Shield', emoji: '🐢', letters: ['س', 'ل', 'ح', 'ف', 'ا', 'ة'] },
    ],
  },
  ش: {
    letter: 'ش',
    name: 'Sheen',
    nameAr: 'شِين',
    soundHint: 'صوت الشين التفشي [ʃ] بثلاث نقاط',
    strokeGuide: ['1. ثلاثة أسنان على السطر', '2. كاسة تحت السطر', '3. ثلاث نقاط مثلثة'],
    contextualForms: {
      isolated: 'ش',
      initial: 'شـ',
      medial: 'ـشـ',
      final: 'ـش',
    },
    distractors: ['س', 'ص', 'ض', 'ث', 'ف', 'ق', 'ن', 'ي'],
    words: [
      { word: 'شَمْسٌ', cleanWord: 'شمس', translation: 'Soleil', iconName: 'Sun', emoji: '☀️', letters: ['ش', 'م', 'س'] },
      { word: 'شَجَرَةٌ', cleanWord: 'شجرة', translation: 'Arbre', iconName: 'Trees', emoji: '🌳', letters: ['ش', 'ج', 'ر', 'ة'] },
      { word: 'شَمْعَةٌ', cleanWord: 'شمعة', translation: 'Bougie', iconName: 'Flame', emoji: '🕯️', letters: ['ش', 'م', 'ع', 'ة'] },
      { word: 'شَوْكَةٌ', cleanWord: 'شوكة', translation: 'Fourchette', iconName: 'Utensils', emoji: '🍴', letters: ['ش', 'و', 'ك', 'ة'] },
    ],
  },
  ص: {
    letter: 'ص',
    name: 'Saad',
    nameAr: 'صَاد',
    soundHint: 'صوت الصاد المفخم [sˤ]',
    strokeGuide: ['1. صعود بيضاوي مائل', '2. سن صغير ملاصق', '3. كاسة عميقة'],
    contextualForms: {
      isolated: 'ص',
      initial: 'صـ',
      medial: 'ـصـ',
      final: 'ـص',
    },
    distractors: ['ض', 'ط', 'ظ', 'س', 'ش', 'ق', 'ف', 'ع'],
    words: [
      { word: 'صَقْرٌ', cleanWord: 'صقر', translation: 'Faucon', iconName: 'Bird', emoji: '🦅', letters: ['ص', 'ق', 'ر'] },
      { word: 'صُنْدُوقٌ', cleanWord: 'صندوق', translation: 'Boîte', iconName: 'Package', emoji: '📦', letters: ['ص', 'ن', 'د', 'و', 'ق'] },
      { word: 'صَابُونٌ', cleanWord: 'صابون', translation: 'Savon', iconName: 'Sparkles', emoji: '🧼', letters: ['ص', 'ا', 'ب', 'و', 'ن'] },
      { word: 'صَارُوخٌ', cleanWord: 'صاروخ', translation: 'Fusée', iconName: 'Rocket', emoji: '🚀', letters: ['ص', 'ا', 'ر', 'و', 'خ'] },
    ],
  },
  ض: {
    letter: 'ض',
    name: 'Daad',
    nameAr: 'ضَاد',
    soundHint: 'حرف الضاد المفخم لغة الضاد [dˤ]',
    strokeGuide: ['1. رأس بيضاوي مع سن', '2. كاسة تحت السطر', '3. نقطة فوق الرأس'],
    contextualForms: {
      isolated: 'ض',
      initial: 'ضـ',
      medial: 'ـضـ',
      final: 'ـض',
    },
    distractors: ['ص', 'ظ', 'ط', 'ش', 'س', 'ق', 'ف', 'غ'],
    words: [
      { word: 'ضِفْدَعٌ', cleanWord: 'ضفدع', translation: 'Grenouille', iconName: 'Footprints', emoji: '🐸', letters: ['ض', 'ف', 'د', 'ع'] },
      { word: 'ضِرْسٌ', cleanWord: 'ضرس', translation: 'Dent', iconName: 'Smile', emoji: '🦷', letters: ['ض', 'ر', 'س'] },
      { word: 'ضَوْءٌ', cleanWord: 'ضوء', translation: 'Lumière', iconName: 'Sun', emoji: '💡', letters: ['ض', 'و', 'ء'] },
      { word: 'ضَبَابٌ', cleanWord: 'ضباب', translation: 'Brouillard', iconName: 'Cloud', emoji: '🌫️', letters: ['ض', 'ب', 'ا', 'ب'] },
    ],
  },
  ط: {
    letter: 'ط',
    name: 'Taa (Emphatique)',
    nameAr: 'طَاء',
    soundHint: 'صوت الطاء المفخم [tˤ] مع عصا قائمة',
    strokeGuide: ['1. رأس بيضاوي يستقر على السطر', '2. ألف قائمة تنزل عمودياً على مؤخرة الرأس'],
    contextualForms: {
      isolated: 'ط',
      initial: 'طـ',
      medial: 'ـطـ',
      final: 'ـط',
    },
    distractors: ['ظ', 'ص', 'ض', 'ك', 'ل', 'د', 'ع', 'ق'],
    words: [
      { word: 'طَائِرَةٌ', cleanWord: 'طائرة', translation: 'Avion', iconName: 'Plane', emoji: '✈️', letters: ['ط', 'ا', 'ئ', 'ر', 'ة'] },
      { word: 'طَمَاطِمُ', cleanWord: 'طماطم', translation: 'Tomate', iconName: 'Apple', emoji: '🍅', letters: ['ط', 'م', 'ا', 'ط', 'م'] },
      { word: 'طَبْلٌ', cleanWord: 'طبل', translation: 'Tambour', iconName: 'Music', emoji: '🥁', letters: ['ط', 'ب', 'ل'] },
      { word: 'طَائِرٌ', cleanWord: 'طائر', translation: 'Oiseau', iconName: 'Bird', emoji: '🐦', letters: ['ط', 'ا', 'ئ', 'ر'] },
    ],
  },
  ظ: {
    letter: 'ظ',
    name: 'Zhaa',
    nameAr: 'ظَاء',
    soundHint: 'صوت الظاء اللثوي المفخم [ðˤ] بنقطة',
    strokeGuide: ['1. رأس بيضاوي مع عصا قائمة', '2. نقطة واضحة في الأعلى'],
    contextualForms: {
      isolated: 'ظ',
      initial: 'ظـ',
      medial: 'ـظـ',
      final: 'ـظ',
    },
    distractors: ['ط', 'ض', 'ص', 'ذ', 'ز', 'غ', 'ف', 'ك'],
    words: [
      { word: 'ظَبْيٌ', cleanWord: 'ظبي', translation: 'Gazelle', iconName: 'Footprints', emoji: '🦌', letters: ['ظ', 'ب', 'ي'] },
      { word: 'ظَرْفٌ', cleanWord: 'ظرف', translation: 'Enveloppe', iconName: 'Mail', emoji: '✉️', letters: ['ظ', 'ر', 'ف'] },
      { word: 'ظُفْرٌ', cleanWord: 'ظفر', translation: 'Ongle', iconName: 'Sparkles', emoji: '💅', letters: ['ظ', 'ف', 'ر'] },
      { word: 'ظِلٌّ', cleanWord: 'ظل', translation: 'Ombre', iconName: 'Sun', emoji: '👥', letters: ['ظ', 'ل'] },
    ],
  },
  ع: {
    letter: 'ع',
    name: 'Ayn',
    nameAr: 'عَيْن',
    soundHint: 'صوت العين الحلقي الفريد [ʕ]',
    strokeGuide: ['1. نصف دائرة صغيرة فوق السطر', '2. نصف دائرة كبيرة تحت السطر'],
    contextualForms: {
      isolated: 'ع',
      initial: 'عـ',
      medial: 'ـعـ',
      final: 'ـع',
    },
    distractors: ['غ', 'ح', 'ج', 'خ', 'ء', 'م', 'ق', 'هـ'],
    words: [
      { word: 'عُصْفُورٌ', cleanWord: 'عصفور', translation: 'Oiseau', iconName: 'Bird', emoji: '🐦', letters: ['ع', 'ص', 'ف', 'و', 'ر'] },
      { word: 'عِنَبٌ', cleanWord: 'عنب', translation: 'Raisin', iconName: 'Cherry', emoji: '🍇', letters: ['ع', 'ن', 'ب'] },
      { word: 'عَيْنٌ', cleanWord: 'عين', translation: 'Œil', iconName: 'Eye', emoji: '👁️', letters: ['ع', 'ي', 'ن'] },
      { word: 'عَسَلٌ', cleanWord: 'عسل', translation: 'Miel', iconName: 'Heart', emoji: '🍯', letters: ['ع', 'س', 'ل'] },
    ],
  },
  غ: {
    letter: 'غ',
    name: 'Ghayn',
    nameAr: 'غَيْن',
    soundHint: 'صوت الغين الحلقي [ɣ] بنقطة في الأعلى',
    strokeGuide: ['1. نصف دائرة صغيرة علوية', '2. نصف دائرة سفلية', '3. نقطة فوق الرأس'],
    contextualForms: {
      isolated: 'غ',
      initial: 'غـ',
      medial: 'ـغـ',
      final: 'ـغ',
    },
    distractors: ['ع', 'خ', 'ف', 'ق', 'ض', 'ح', 'ظ', 'ن'],
    words: [
      { word: 'غَزَالٌ', cleanWord: 'غزال', translation: 'Gazelle', iconName: 'Footprints', emoji: '🦌', letters: ['غ', 'ز', 'ا', 'ل'] },
      { word: 'غَيْمَةٌ', cleanWord: 'غيمة', translation: 'Nuage', iconName: 'Cloud', emoji: '☁️', letters: ['غ', 'ي', 'م', 'ة'] },
      { word: 'غُرَابٌ', cleanWord: 'غراب', translation: 'Corbeau', iconName: 'Bird', emoji: '🦅', letters: ['غ', 'ر', 'ا', 'ب'] },
      { word: 'غَابَةٌ', cleanWord: 'غابة', translation: 'Forêt', iconName: 'Trees', emoji: '🌲', letters: ['غ', 'ا', 'ب', 'ة'] },
    ],
  },
  ف: {
    letter: 'ف',
    name: 'Faa',
    nameAr: 'فَاء',
    soundHint: 'صوت الفاء [f] برأس دائري ونقطة واحدة',
    strokeGuide: ['1. دائرة صغيرة تستقر على عنق قصير', '2. جسم أفقي كالباء مع نقطة فوق الرأس'],
    contextualForms: {
      isolated: 'ف',
      initial: 'فـ',
      medial: 'ـفـ',
      final: 'ـف',
    },
    distractors: ['ق', 'و', 'ب', 'ت', 'ث', 'ن', 'ك', 'م'],
    words: [
      { word: 'فَرَاشَةٌ', cleanWord: 'فراشة', translation: 'Papillon', iconName: 'Sparkles', emoji: '🦋', letters: ['ف', 'ر', 'ا', 'ش', 'ة'] },
      { word: 'فِيلٌ', cleanWord: 'فيل', translation: 'Éléphant', iconName: 'Sparkles', emoji: '🐘', letters: ['ف', 'ي', 'ل'] },
      { word: 'فَوَاكِهُ', cleanWord: 'فواكه', translation: 'Fruits', iconName: 'Apple', emoji: '🍎', letters: ['ف', 'و', 'ا', 'ك', 'ه'] },
      { word: 'فُسْتَانٌ', cleanWord: 'فستان', translation: 'Robe', iconName: 'Shirt', emoji: '👗', letters: ['ف', 'س', 'ت', 'ا', 'ن'] },
    ],
  },
  ق: {
    letter: 'ق',
    name: 'Qaaf',
    nameAr: 'قَاف',
    soundHint: 'صوت القاف اللهوي المفخم [q] بنقطتين',
    strokeGuide: ['1. رأس دائري', '2. كاسة عميقة تنزل تحت السطر', '3. نقطتان في الأعلى'],
    contextualForms: {
      isolated: 'ق',
      initial: 'قـ',
      medial: 'ـقـ',
      final: 'ـق',
    },
    distractors: ['ف', 'ك', 'و', 'ن', 'ل', 'ع', 'غ', 'م'],
    words: [
      { word: 'قِطَّةٌ', cleanWord: 'قطة', translation: 'Chat', iconName: 'Cat', emoji: '🐱', letters: ['ق', 'ط', 'ة'] },
      { word: 'قَلَمٌ', cleanWord: 'قلم', translation: 'Crayon', iconName: 'PenTool', emoji: '✏️', letters: ['ق', 'ل', 'م'] },
      { word: 'قَمَرٌ', cleanWord: 'قمر', translation: 'Lune', iconName: 'Moon', emoji: '🌙', letters: ['ق', 'م', 'ر'] },
      { word: 'قُبَّعَةٌ', cleanWord: 'قبعة', translation: 'Chapeau', iconName: 'Crown', emoji: '👒', letters: ['ق', 'ب', 'ع', 'ة'] },
    ],
  },
  ك: {
    letter: 'ك',
    name: 'Kaaf',
    nameAr: 'كَاف',
    soundHint: 'صوت الكاف المرقق [k] وفي داخله كاف صغيرة',
    strokeGuide: ['1. ألف طويلة قائمة', '2. خط أفقي مستقر', '3. صعود يسير وشارة صغيرة بالداخل'],
    contextualForms: {
      isolated: 'ك',
      initial: 'كـ',
      medial: 'ـكـ',
      final: 'ـك',
    },
    distractors: ['ل', 'ط', 'د', 'ق', 'أ', 'ع', 'ح', 'م'],
    words: [
      { word: 'كِتَابٌ', cleanWord: 'كتاب', translation: 'Livre', iconName: 'BookOpen', emoji: '📖', letters: ['ك', 'ت', 'ا', 'ب'] },
      { word: 'كَلْبٌ', cleanWord: 'كلب', translation: 'Chien', iconName: 'Footprints', emoji: '🐶', letters: ['ك', 'ل', 'ب'] },
      { word: 'كَعْكَةٌ', cleanWord: 'كعكة', translation: 'Gâteau', iconName: 'Cake', emoji: '🎂', letters: ['ك', 'ع', 'ك', 'ة'] },
      { word: 'كُرَةٌ', cleanWord: 'كرة', translation: 'Ballon', iconName: 'CircleDot', emoji: '⚽', letters: ['ك', 'ر', 'ة'] },
    ],
  },
  ل: {
    letter: 'ل',
    name: 'Laam',
    nameAr: 'لاَم',
    soundHint: 'صوت اللام [l] كعكاز ينزل تحت السطر',
    strokeGuide: ['1. عصا قائمة طويلة', '2. تقويس نصف دائري ينزل تحت السطر ويصعد'],
    contextualForms: {
      isolated: 'ل',
      initial: 'لـ',
      medial: 'ـلـ',
      final: 'ـل',
    },
    distractors: ['ك', 'ا', 'أ', 'ن', 'ي', 'ط', 'ج', 'د'],
    words: [
      { word: 'لَيْمُونٌ', cleanWord: 'ليمون', translation: 'Citron', iconName: 'Apple', emoji: '🍋', letters: ['ل', 'ي', 'م', 'و', 'ن'] },
      { word: 'لُعْبَةٌ', cleanWord: 'لعبة', translation: 'Jouet', iconName: 'Gamepad', emoji: '🧸', letters: ['ل', 'ع', 'ب', 'ة'] },
      { word: 'لِسَانٌ', cleanWord: 'لسان', translation: 'Langue', iconName: 'Smile', emoji: '👅', letters: ['ل', 'س', 'ا', 'ن'] },
      { word: 'لَوْحَةٌ', cleanWord: 'لوحة', translation: 'Tableau', iconName: 'Image', emoji: '🎨', letters: ['ل', 'و', 'ح', 'ة'] },
    ],
  },
  م: {
    letter: 'م',
    name: 'Meem',
    nameAr: 'مِيم',
    soundHint: 'صوت الميم الغنة الشفوية [m]',
    strokeGuide: ['1. دائرة صغيرة فوق السطر', '2. خط أفقي قصير ثم نزول رأسي تحت السطر'],
    contextualForms: {
      isolated: 'م',
      initial: 'مـ',
      medial: 'ـمـ',
      final: 'ـم',
    },
    distractors: ['هـ', 'ف', 'ق', 'ع', 'و', 'ن', 'ح', 'ص'],
    words: [
      { word: 'مَوْزٌ', cleanWord: 'موز', translation: 'Banane', iconName: 'Banana', emoji: '🍌', letters: ['م', 'و', 'ز'] },
      { word: 'مِظَلَّةٌ', cleanWord: 'مظلة', translation: 'Parapluie', iconName: 'Umbrella', emoji: '☂️', letters: ['م', 'ظ', 'ل', 'ة'] },
      { word: 'مِفْتَاحٌ', cleanWord: 'مفتاح', translation: 'Clé', iconName: 'Key', emoji: '🔑', letters: ['م', 'ف', 'ت', 'ا', 'ح'] },
      { word: 'مَسْجِدٌ', cleanWord: 'مسجد', translation: 'Mosquée', iconName: 'Building', emoji: '🕌', letters: ['م', 'س', 'ج', 'د'] },
    ],
  },
  ن: {
    letter: 'ن',
    name: 'Noon',
    nameAr: 'نُون',
    soundHint: 'صوت النون الغنة [n] بنقطة واحدة بالوسط',
    strokeGuide: ['1. كاسة نصف دائرية عميقة تحت السطر', '2. نقطة واحدة في منتصف الكاسة'],
    contextualForms: {
      isolated: 'ن',
      initial: 'نـ',
      medial: 'ـنـ',
      final: 'ـن',
    },
    distractors: ['ب', 'ت', 'ث', 'ي', 'ز', 'ل', 'ق', 'ف'],
    words: [
      { word: 'نَجْمَةٌ', cleanWord: 'نجمة', translation: 'Étoile', iconName: 'Star', emoji: '⭐', letters: ['ن', 'ج', 'م', 'ة'] },
      { word: 'نَحْلَةٌ', cleanWord: 'نحلة', translation: 'Abeille', iconName: 'Bug', emoji: '🐝', letters: ['ن', 'ح', 'ل', 'ة'] },
      { word: 'نَمِرٌ', cleanWord: 'نمر', translation: 'Tigre', iconName: 'Footprints', emoji: '🐯', letters: ['ن', 'م', 'ر'] },
      { word: 'نَظَّارَةٌ', cleanWord: 'نظارة', translation: 'Lunettes', iconName: 'Glasses', emoji: '👓', letters: ['ن', 'ظ', 'ا', 'ر', 'ة'] },
    ],
  },
  هـ: {
    letter: 'هـ',
    name: 'Haa (Légère)',
    nameAr: 'هَاء',
    soundHint: 'صوت الهاء الهوائي الخفيف [h]',
    strokeGuide: ['1. قوس كبير منحنٍ', '2. دائرة داخلية مكملة للرسم'],
    contextualForms: {
      isolated: 'هـ',
      initial: 'هـ',
      medial: 'ـهـ',
      final: 'ـه',
    },
    distractors: ['ة', 'م', 'ع', 'و', 'ح', 'ف', 'ق', 'ن'],
    words: [
      { word: 'هِلَالٌ', cleanWord: 'هلال', translation: 'Croissant', iconName: 'Moon', emoji: '🌙', letters: ['ه', 'ل', 'ا', 'ل'] },
      { word: 'هَدِيَّةٌ', cleanWord: 'هدية', translation: 'Cadeau', iconName: 'Gift', emoji: '🎁', letters: ['ه', 'د', 'ي', 'ة'] },
      { word: 'هَاتِفٌ', cleanWord: 'هاتف', translation: 'Téléphone', iconName: 'Phone', emoji: '📱', letters: ['ه', 'ا', 'ت', 'ف'] },
      { word: 'هَرَمٌ', cleanWord: 'هرم', translation: 'Pyramide', iconName: 'Mountain', emoji: '🔺', letters: ['ه', 'ر', 'م'] },
    ],
  },
  و: {
    letter: 'و',
    name: 'Waaw',
    nameAr: 'وَاو',
    soundHint: 'صوت الواو وحرف المد [w] / [uː]',
    strokeGuide: ['1. رأس دائري فوق السطر', '2. ذيل هلالي مقوس يتزحلق تحت السطر كالراء'],
    contextualForms: {
      isolated: 'و',
      initial: 'و',
      medial: 'ـو',
      final: 'ـو',
    },
    distractors: ['ف', 'ق', 'ر', 'ز', 'د', 'م', 'ن', 'ي'],
    words: [
      { word: 'وَرْدَةٌ', cleanWord: 'وردة', translation: 'Rose', iconName: 'Flower2', emoji: '🌹', letters: ['و', 'ر', 'د', 'ة'] },
      { word: 'وِسَادَةٌ', cleanWord: 'وسادة', translation: 'Coussin', iconName: 'Heart', emoji: '🛋️', letters: ['و', 'س', 'ا', 'د', 'ة'] },
      { word: 'وَجْهٌ', cleanWord: 'وجه', translation: 'Visage', iconName: 'Smile', emoji: '😊', letters: ['و', 'ج', 'ه'] },
      { word: 'وَلَدٌ', cleanWord: 'ولد', translation: 'Garçon', iconName: 'Footprints', emoji: '👦', letters: ['و', 'ل', 'د'] },
    ],
  },
  ي: {
    letter: 'ي',
    name: 'Yaa',
    nameAr: 'يَاء',
    soundHint: 'صوت الياء الشبيه بالبطة [j] / [iː] بنقطتين تحته',
    strokeGuide: ['1. رأس منحنٍ يشبه عنق البطة', '2. بطن كبير مقوس تحت السطر ونقطتان تحته'],
    contextualForms: {
      isolated: 'ي',
      initial: 'يـ',
      medial: 'ـيـ',
      final: 'ـي',
    },
    distractors: ['ب', 'ت', 'ث', 'ن', 'ى', 'ل', 'س', 'ش'],
    words: [
      { word: 'يَدٌ', cleanWord: 'يد', translation: 'Main', iconName: 'Hand', emoji: '✋', letters: ['ي', 'د'] },
      { word: 'يَاسَمِينٌ', cleanWord: 'ياسمين', translation: 'Jasmin', iconName: 'Flower2', emoji: '🌼', letters: ['ي', 'ا', 'س', 'م', 'ي', 'ن'] },
      { word: 'يَمَامَةٌ', cleanWord: 'يمامة', translation: 'Colombe', iconName: 'Bird', emoji: '🕊️', letters: ['ي', 'م', 'ا', 'م', 'ة'] },
      { word: 'يَخْتٌ', cleanWord: 'يخت', translation: 'Yacht', iconName: 'Ship', emoji: '🛥️', letters: ['ي', 'خ', 'ت'] },
    ],
  },
};

// ==========================================
// 3. HELPER ACCESSORS & UTILITIES
// ==========================================

export function getAlphabetKeys(language: AlphabetLanguage): string[] {
  if (language === 'ar') {
    return Object.keys(ARABIC_ALPHABET_DATA_RICH);
  }
  return Object.keys(FRENCH_ALPHABET_DATA);
}

export function getLetterMeta(language: AlphabetLanguage, letterKey: string): LetterMeta {
  if (language === 'ar') {
    return (
      ARABIC_ALPHABET_DATA_RICH[letterKey] ||
      ARABIC_ALPHABET_DATA_RICH['أ']
    );
  }
  const upper = letterKey.toUpperCase();
  return FRENCH_ALPHABET_DATA[upper] || FRENCH_ALPHABET_DATA['A'];
}

export function getDefaultInstructions(
  language: AlphabetLanguage,
  letterKey: string
): Record<AlphabetActivityType, string> {
  const isArabic = language === 'ar';
  const meta = getLetterMeta(language, letterKey);
  const letterDisplay = isArabic ? meta.letter : `${meta.letter} / ${meta.lowercase}`;

  if (isArabic) {
    return {
      writing: `تتبّع النّقاط واكتب حرف (${meta.letter}) بأشكاله الصّحيحة`,
      search: `ابحث عن حرف (${meta.letter}) وحوّط عليه أينما وجدته`,
      coloring: `لوّن الحرف الجميل (${meta.letter}) مع الصّورة المرافقة`,
      matching: `صِلْ بين حرف (${meta.letter}) والصّور أو الكلمات المناسبة`,
      cut_paste: `قُصَّ البطاقات في الأسفل وألصقها في المكان الصّحيح`,
      vocabulary: `اكتشف كلمات تبدأ بحرف (${meta.letter}) وتدرّب على قراءتها وكتابتها`,
    };
  }

  return {
    writing: `Trace et écris la lettre ${letterDisplay} en respectant les lignes`,
    search: `Retrouve et entoure toutes les lettres ${meta.letter}`,
    coloring: `Colorie la grande lettre ${letterDisplay} et l'illustration`,
    matching: `Relie la lettre ${meta.letter} aux images qui commencent par ce son`,
    cut_paste: `Découpe les étiquettes et colle-les dans les bonnes cases`,
    vocabulary: `Découvre des mots qui commencent par la lettre ${meta.letter}`,
  };
}

/**
 * Generates an educational letter search grid with the target letter and distractors
 */
export function generateLetterSearchGrid(
  language: AlphabetLanguage,
  targetLetter: string,
  totalItems: number = 20,
  targetCount: number = 6,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): { id: string; char: string; isTarget: boolean }[] {
  const meta = getLetterMeta(language, targetLetter);
  const targetChar = meta.letter;
  const isArabic = language === 'ar';

  // Pool of distractors
  const distractorsPool =
    difficulty === 'hard'
      ? meta.distractors
      : isArabic
      ? ['أ', 'ب', 'ت', 'ج', 'د', 'ر', 'س', 'ع', 'ف', 'ل', 'م', 'ن', 'هـ', 'و', 'ي']
      : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T'];

  const filteredDistractors = distractorsPool.filter((d) => d !== targetChar);

  // Generate target indices
  const count = Math.min(targetCount, totalItems - 2);
  const items: { id: string; char: string; isTarget: boolean }[] = [];

  // Populate target letters
  for (let i = 0; i < count; i++) {
    items.push({
      id: `target-${i}`,
      char: targetChar,
      isTarget: true,
    });
  }

  // Populate distractor letters
  for (let i = count; i < totalItems; i++) {
    const randomChar =
      filteredDistractors[Math.floor(Math.random() * filteredDistractors.length)];
    items.push({
      id: `distractor-${i}`,
      char: randomChar,
      isTarget: false,
    });
  }

  // Shuffle thoroughly using Fisher-Yates
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}
