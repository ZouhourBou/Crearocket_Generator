import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language } from '../../types';
import {
  GameType,
  GameGeneratorState,
  WordSearchDifficulty,
  WordSearchTheme,
  GameCardCategory,
  SudokuGridSize,
  SudokuDifficulty,
} from '../../types/games';
import {
  generateWordSearch,
  THEME_WORDS,
} from '../../utils/wordSearchGenerator';
import { generateSudokuPuzzle } from '../../utils/sudokuGenerator';
import { DEFAULT_CARDS_BY_CATEGORY } from '../../utils/gameCardsData';
import { WordPuzzleView } from './WordPuzzleView';
import { GameCardsView } from './GameCardsView';
import { SudokuView } from './SudokuView';
import { exportToPdf, exportToPng, printDirect } from '../../utils/exportUtils';
import {
  Gamepad2,
  Grid3X3,
  CreditCard,
  Hash,
  Shuffle,
  RotateCcw,
  Printer,
  Download,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  FileQuestion,
  Sparkles,
  Sliders,
  Scissors,
  Check,
} from 'lucide-react';

interface GamesPageProps {
  language: Language;
  onNavigate?: (route: string) => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({
  language,
  onNavigate,
}) => {
  const isArabic = language === 'ar';
  const paperSheetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Initial State
  const [state, setState] = useState<GameGeneratorState>(() => ({
    activeGame: 'word_search',
    language: (language as 'fr' | 'en' | 'ar') || 'fr',
    paperFormat: 'A4',
    paperOrientation: 'portrait',

    showHeader: true,
    title:
      language === 'ar'
        ? 'لُعْبَةُ الْكَلِمَاتِ الْمُتَقَاطِعَة'
        : language === 'en'
        ? 'WORD SEARCH PUZZLE'
        : 'MOTS MÊLÉS ÉDUCATIFS',
    subtitle:
      language === 'ar'
        ? 'ابحث عن الكلمات في جميع الاتجاهات وضع دائرة حولها'
        : language === 'en'
        ? 'Find and circle all hidden words in the grid'
        : 'Retrouve et entoure tous les mots cachés dans la grille',
    showStudentName: true,
    showDate: true,
    showInstructions: true,

    // Word Search
    wordSearchTheme: 'animals',
    customWordList: '',
    wordSearchGridSize: 10,
    wordSearchDifficulty: 'basic',
    showWordBank: true,
    wordSearchLetterCase: 'upper',

    // Game Cards
    cardsConfig: {
      category: 'vocabulary',
      cardsCount: 6,
      columns: 3,
      showCutMarks: true,
      showCardBorders: true,
      borderRadius: 12,
      cardTheme: 'classic',
      items: DEFAULT_CARDS_BY_CATEGORY.vocabulary[language] || DEFAULT_CARDS_BY_CATEGORY.vocabulary.fr,
    },

    // Sudoku
    sudokuSize: 4,
    sudokuDifficulty: 'basic',
    sudokuPuzzlesCount: 2,
    sudokuCellSize: 'normal',

    activeViewTab: 'game',
    zoom: 100,
  }));

  // Update card items when card category changes or language changes
  useEffect(() => {
    const defaultItems =
      DEFAULT_CARDS_BY_CATEGORY[state.cardsConfig.category]?.[language] ||
      DEFAULT_CARDS_BY_CATEGORY[state.cardsConfig.category]?.fr ||
      [];
    setState((prev) => ({
      ...prev,
      cardsConfig: {
        ...prev.cardsConfig,
        items: defaultItems,
      },
    }));
  }, [state.cardsConfig.category, language]);

  // Word Search Generator Trigger
  const [wordSearchSeed, setWordSearchSeed] = useState(0);
  const wordSearchData = useMemo(() => {
    let words: string[] = [];
    if (state.wordSearchTheme === 'custom') {
      words = state.customWordList
        .split(/[,\n]/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 2);
      if (words.length === 0) {
        words = THEME_WORDS.custom[language] || THEME_WORDS.custom.fr;
      }
    } else {
      words =
        THEME_WORDS[state.wordSearchTheme]?.[language] ||
        THEME_WORDS[state.wordSearchTheme]?.fr ||
        [];
    }

    return generateWordSearch(
      words,
      state.wordSearchGridSize,
      state.wordSearchDifficulty,
      isArabic
    );
  }, [
    state.wordSearchTheme,
    state.customWordList,
    state.wordSearchGridSize,
    state.wordSearchDifficulty,
    language,
    isArabic,
    wordSearchSeed,
  ]);

  // Sudoku Generator Trigger
  const [sudokuSeed, setSudokuSeed] = useState(0);
  const sudokuPuzzles = useMemo(() => {
    const list = [];
    for (let i = 0; i < state.sudokuPuzzlesCount; i++) {
      list.push(
        generateSudokuPuzzle(state.sudokuSize, state.sudokuDifficulty)
      );
    }
    return list;
  }, [
    state.sudokuSize,
    state.sudokuDifficulty,
    state.sudokuPuzzlesCount,
    sudokuSeed,
  ]);

  // Dynamic Page Titles based on game mode
  const handleGameTabChange = (game: GameType) => {
    let newTitle = state.title;
    let newSubtitle = state.subtitle;

    if (game === 'word_search') {
      newTitle =
        language === 'ar'
          ? 'لُعْبَةُ الْكَلِمَاتِ الْمُتَقَاطِعَة'
          : language === 'en'
          ? 'WORD SEARCH PUZZLE'
          : 'MOTS MÊLÉS ÉDUCATIFS';
      newSubtitle =
        language === 'ar'
          ? 'ابحث عن الكلمات في جميع الاتجاهات وضع دائرة حولها'
          : language === 'en'
          ? 'Find and circle all hidden words in the grid'
          : 'Retrouve et entoure tous les mots cachés dans la grille';
    } else if (game === 'game_cards') {
      newTitle =
        language === 'ar'
          ? 'بِطَاقَاتٌ تَعْلِيمِيَّةٌ وَأَلْعَاب'
          : language === 'en'
          ? 'EDUCATIONAL FLASHCARDS'
          : 'CARTES ÉDUCATIVES & JEUX';
      newSubtitle =
        language === 'ar'
          ? 'قص البطاقات على طول الخطوط المتقطعة واستمتع باللعب والتعلم'
          : language === 'en'
          ? 'Cut along dashed lines and enjoy playing and learning'
          : 'Découpe les cartes le long des pointillés pour apprendre en jouant';
    } else if (game === 'sudoku') {
      newTitle =
        language === 'ar'
          ? 'سُودُوكُو الأَبْطَال'
          : language === 'en'
          ? 'SUDOKU FOR KIDS'
          : 'SUDOKU DES CHAMPIONS';
      newSubtitle =
        language === 'ar'
          ? 'املأ المربعات بالأرقام الصحيحة دون تكرار في نفس الصف أو العمود'
          : language === 'en'
          ? 'Fill in the blanks with the correct digits without duplicates'
          : 'Remplis les cases avec les bons chiffres sans répétition';
    }

    setState((prev) => ({
      ...prev,
      activeGame: game,
      title: newTitle,
      subtitle: newSubtitle,
      activeViewTab: 'game',
    }));
  };

  // Export handlers
  const handlePrint = () => {
    printDirect();
  };

  const handleExportPdf = async () => {
    if (!paperSheetRef.current) return;
    setIsExporting(true);
    try {
      const isLandscape = state.paperOrientation === 'landscape';
      const paperDim = {
        widthMm: isLandscape ? 297 : 210,
        heightMm: isLandscape ? 210 : 297,
      };
      await exportToPdf(
        paperSheetRef.current,
        paperDim,
        `${state.activeGame}_${state.activeViewTab}.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    if (!paperSheetRef.current) return;
    setIsExporting(true);
    try {
      await exportToPng(
        paperSheetRef.current,
        `${state.activeGame}_${state.activeViewTab}.png`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="flex-1 flex flex-col bg-slate-100 text-slate-900 font-sans"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* 1. Sub-Header: Breadcrumbs & Game Mode Selector */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => onNavigate?.('/')}
            className="flex items-center gap-1 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
            <span>{isArabic ? 'الرئيسية' : 'Accueil'}</span>
          </button>
          <ChevronRight className={`w-3 h-3 text-slate-400 ${isArabic ? 'rotate-180' : ''}`} />
          <span className="text-slate-900 font-bold">
            {isArabic ? 'مُوَلِّدُ الأَلْعَابِ وَالأَلْغَاز' : 'Jeux & Puzzles Pédagogiques'}
          </span>
        </div>

        {/* 3 Game Categories Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleGameTabChange('word_search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              state.activeGame === 'word_search'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>{isArabic ? 'مots Mêlés' : '1. Mots Mêlés'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleGameTabChange('game_cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              state.activeGame === 'game_cards'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{isArabic ? 'بطاقات تعليمية' : '2. Cartes Éducatives'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleGameTabChange('sudoku')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              state.activeGame === 'sudoku'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>{isArabic ? 'سودوكو أطفال' : '3. Sudoku Enfants'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Studio Workspace: 2 Columns */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Controls & Settings */}
        <aside className="w-full lg:w-96 bg-white border-r border-slate-200/80 flex flex-col h-auto lg:h-[calc(100vh-105px)] overflow-y-auto shrink-0 shadow-sm">
          <div className="p-4 sm:p-5 space-y-6">
            {/* Header: Section Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                  {isArabic ? 'إعدادات اللعبة' : 'Paramètres du jeu'}
                </h3>
              </div>

              {/* Regenerate Button */}
              {state.activeGame === 'word_search' && (
                <button
                  type="button"
                  onClick={() => setWordSearchSeed((s) => s + 1)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  title="Nouvelle grille"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تجديد' : 'Nouveau'}</span>
                </button>
              )}
              {state.activeGame === 'sudoku' && (
                <button
                  type="button"
                  onClick={() => setSudokuSeed((s) => s + 1)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                  title="Nouvelles grilles"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تجديد' : 'Nouveau'}</span>
                </button>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* SPECIFIC CONFIG: 1. WORD SEARCH                      */}
            {/* ---------------------------------------------------- */}
            {state.activeGame === 'word_search' && (
              <div className="space-y-4">
                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'مَوْضُوعُ الْكَلِمَات :' : 'Thème du vocabulaire :'}
                  </label>
                  <select
                    value={state.wordSearchTheme}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        wordSearchTheme: e.target.value as WordSearchTheme,
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
                  >
                    <option value="animals">🦁 {isArabic ? 'حيوانات' : 'Animaux'}</option>
                    <option value="school">🎒 {isArabic ? 'مدرسة وأدوات' : 'École & Fournitures'}</option>
                    <option value="nature">🌳 {isArabic ? 'طبيعة وغابات' : 'Nature & Forêt'}</option>
                    <option value="space">🚀 {isArabic ? 'فضاء وكواكب' : 'Espace & Planètes'}</option>
                    <option value="food">🍎 {isArabic ? 'أغذية وفواكه' : 'Fruits & Aliments'}</option>
                    <option value="colors">🎨 {isArabic ? 'ألوان' : 'Couleurs'}</option>
                    <option value="custom">✏️ {isArabic ? 'قائمة مخصصة...' : 'Mots personnalisés...'}</option>
                  </select>
                </div>

                {/* Custom Word List Textarea */}
                {state.wordSearchTheme === 'custom' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isArabic ? 'الكلمات (مفصولة بفواصل أو أسطر) :' : 'Mots (séparés par virgules ou retours à la ligne) :'}
                    </label>
                    <textarea
                      rows={3}
                      value={state.customWordList}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          customWordList: e.target.value,
                        }))
                      }
                      placeholder="LION, TIGRE, CHAT, CHIEN..."
                      className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
                    />
                  </div>
                )}

                {/* Grid Size Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>{isArabic ? 'حجم الشبكة :' : 'Taille de la grille :'}</span>
                    <span className="text-indigo-600 font-mono">
                      {state.wordSearchGridSize} × {state.wordSearchGridSize}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={16}
                    step={1}
                    value={state.wordSearchGridSize}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        wordSearchGridSize: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                    <span>8×8 (Facile)</span>
                    <span>12×12 (Moyen)</span>
                    <span>16×16 (Expert)</span>
                  </div>
                </div>

                {/* Difficulty Levels */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'مستوى الصعوبة :' : 'Niveau de difficulté :'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'basic', label: 'Basic', desc: 'H + V' },
                      { id: 'intermediate', label: 'Intermédiaire', desc: '+ Diagonales' },
                      { id: 'advanced', label: 'Avancé', desc: '+ Inversé' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            wordSearchDifficulty: lvl.id as WordSearchDifficulty,
                          }))
                        }
                        className={`p-2 rounded-xl border text-center transition-all ${
                          state.wordSearchDifficulty === lvl.id
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 text-xs'
                        }`}
                      >
                        <div className="text-xs font-bold">{lvl.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Bank & Case toggles */}
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={state.showWordBank}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          showWordBank: e.target.checked,
                        }))
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{isArabic ? 'عرض بنك الكلمات أسفل الشبكة' : 'Afficher la liste des mots à retrouver'}</span>
                  </label>

                  {!isArabic && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-medium text-slate-700">Casse des lettres :</span>
                      <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            setState((prev) => ({ ...prev, wordSearchLetterCase: 'upper' }))
                          }
                          className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                            state.wordSearchLetterCase === 'upper'
                              ? 'bg-white text-indigo-600 shadow-xs'
                              : 'text-slate-500'
                          }`}
                        >
                          ABC
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setState((prev) => ({ ...prev, wordSearchLetterCase: 'lower' }))
                          }
                          className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                            state.wordSearchLetterCase === 'lower'
                              ? 'bg-white text-indigo-600 shadow-xs'
                              : 'text-slate-500'
                          }`}
                        >
                          abc
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* SPECIFIC CONFIG: 2. GAME CARDS                       */}
            {/* ---------------------------------------------------- */}
            {state.activeGame === 'game_cards' && (
              <div className="space-y-4">
                {/* Category Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'نوع البطاقات التعليمية :' : 'Type de cartes éducatives :'}
                  </label>
                  <select
                    value={state.cardsConfig.category}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        cardsConfig: {
                          ...prev.cardsConfig,
                          category: e.target.value as GameCardCategory,
                        },
                      }))
                    }
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="vocabulary">📖 {isArabic ? 'بطاقات مفردات وكلمات' : 'Cartes de vocabulaire'}</option>
                    <option value="memory">🧠 {isArabic ? 'لعبة الذاكرة (أزواج متطابقة)' : 'Jeu de mémoire (Paires)'}</option>
                    <option value="qa">❓ {isArabic ? 'أسئلة وأجوبة' : 'Questions & Réponses'}</option>
                    <option value="image_word">🖼️ {isArabic ? 'صورة مع كلمة' : 'Cartes Image / Mot'}</option>
                    <option value="letter_image">🔤 {isArabic ? 'حرف وصورة' : 'Cartes Lettre / Image'}</option>
                    <option value="number_quantity">🔢 {isArabic ? 'عدد وكمية' : 'Cartes Nombre / Quantité'}</option>
                  </select>
                </div>

                {/* Cards Count */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'عدد البطاقات في الصفحة :' : 'Nombre de cartes par page :'}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[4, 6, 8, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            cardsConfig: {
                              ...prev.cardsConfig,
                              cardsCount: num,
                              columns: num <= 4 ? 2 : num <= 8 ? 3 : 4,
                            },
                          }))
                        }
                        className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          state.cardsConfig.cardsCount === num
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {num} cartes
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cutting & Borders toggles */}
                <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={state.cardsConfig.showCutMarks}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          cardsConfig: {
                            ...prev.cardsConfig,
                            showCutMarks: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="flex items-center gap-1">
                      <Scissors className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isArabic ? 'عرض خطوط وعلامات القص' : 'Afficher les repères de découpe (ciseaux)'}</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={state.cardsConfig.showCardBorders}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          cardsConfig: {
                            ...prev.cardsConfig,
                            showCardBorders: e.target.checked,
                          },
                        }))
                      }
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>{isArabic ? 'حدود داكنة واضحة للبطاقات' : 'Bordure nette autour de chaque carte'}</span>
                  </label>
                </div>

                {/* Corner Radius */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>{isArabic ? 'انحناء الزوايا :' : 'Coins arrondis :'}</span>
                    <span className="text-emerald-600 font-mono">
                      {state.cardsConfig.borderRadius}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={4}
                    value={state.cardsConfig.borderRadius}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        cardsConfig: {
                          ...prev.cardsConfig,
                          borderRadius: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* SPECIFIC CONFIG: 3. SUDOKU                           */}
            {/* ---------------------------------------------------- */}
            {state.activeGame === 'sudoku' && (
              <div className="space-y-4">
                {/* Sudoku Grid Size */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'حجم شبكة السودوكو :' : 'Taille de la grille :'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { size: 4, label: '4 × 4', sub: 'Maternelle / CP' },
                      { size: 6, label: '6 × 6', sub: 'CE1 / CE2' },
                      { size: 9, label: '9 × 9', sub: 'CM1 / Adulte' },
                    ].map((item) => (
                      <button
                        key={item.size}
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            sudokuSize: item.size as SudokuGridSize,
                          }))
                        }
                        className={`p-2 rounded-xl border text-center transition-all ${
                          state.sudokuSize === item.size
                            ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Levels */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'مستوى الصعوبة :' : 'Niveau de difficulté :'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'basic', label: 'Facile' },
                      { id: 'intermediate', label: 'Moyen' },
                      { id: 'advanced', label: 'Difficile' },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            sudokuDifficulty: lvl.id as SudokuDifficulty,
                          }))
                        }
                        className={`py-1.5 rounded-xl border text-center text-xs font-bold transition-all ${
                          state.sudokuDifficulty === lvl.id
                            ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Puzzles per Page */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isArabic ? 'عدد الشبكات في الصفحة :' : 'Grilles par page :'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 2, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            sudokuPuzzlesCount: count,
                          }))
                        }
                        className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          state.sudokuPuzzlesCount === count
                            ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {count} {count > 1 ? 'grilles' : 'grille'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instructions toggle */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-xs">
                    <input
                      type="checkbox"
                      checked={state.showInstructions}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          showInstructions: e.target.checked,
                        }))
                      }
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>{isArabic ? 'عرض نص قواعد اللعبة في الأعلى' : 'Afficher les règles du Sudoku en haut'}</span>
                  </label>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* COMMON: Page Header & Texts                          */}
            {/* ---------------------------------------------------- */}
            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {isArabic ? 'عناوين الصفحة' : 'En-tête de la fiche'}
              </h4>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isArabic ? 'العنوان الرئيسي :' : 'Titre principal :'}
                </label>
                <input
                  type="text"
                  value={state.title}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {isArabic ? 'التعليمات / العنوان الفرعي :' : 'Sous-titre / Consignes :'}
                </label>
                <input
                  type="text"
                  value={state.subtitle}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={state.showStudentName}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        showStudentName: e.target.checked,
                      }))
                    }
                    className="rounded text-slate-700 focus:ring-slate-400 w-3.5 h-3.5"
                  />
                  <span>{isArabic ? 'خانة الاسم' : 'Nom / Prénom'}</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={state.showDate}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        showDate: e.target.checked,
                      }))
                    }
                    className="rounded text-slate-700 focus:ring-slate-400 w-3.5 h-3.5"
                  />
                  <span>{isArabic ? 'خانة التاريخ' : 'Date'}</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Studio Live Sheet Preview & Action Toolbar */}
        <main className="flex-1 flex flex-col h-auto lg:h-[calc(100vh-105px)] overflow-hidden">
          {/* Action Toolbar */}
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
            {/* View Tab Selector: Game Sheet vs Answer Key */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() =>
                  setState((prev) => ({ ...prev, activeViewTab: 'game' }))
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  state.activeViewTab === 'game'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileQuestion className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {isArabic
                    ? 'صَفْحَةُ التَّمْرِين (لِلتِّلْمِيذ)'
                    : 'Page d\'Exercice (Élève)'}
                </span>
              </button>

              {state.activeGame !== 'game_cards' && (
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({ ...prev, activeViewTab: 'solution' }))
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    state.activeViewTab === 'solution'
                      ? 'bg-white text-emerald-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {isArabic
                      ? 'صَفْحَةُ الحُلُول (مُفْتَاحُ التَّصْحِيح)'
                      : 'Page de Corrigé (Solution)'}
                  </span>
                </button>
              )}
            </div>

            {/* Zoom & Export Actions */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs text-slate-600">
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      zoom: Math.max(50, prev.zoom - 10),
                    }))
                  }
                  className="p-1.5 hover:text-slate-900 rounded-md"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-mono text-[11px] font-bold">
                  {state.zoom}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      zoom: Math.min(150, prev.zoom + 10),
                    }))
                  }
                  className="p-1.5 hover:text-slate-900 rounded-md"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct Print */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>{isArabic ? 'طباعة' : 'Imprimer'}</span>
              </button>

              {/* Export PNG */}
              <button
                type="button"
                onClick={handleExportPng}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition-all active:scale-95 disabled:opacity-50"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>PNG HD</span>
              </button>

              {/* Export PDF */}
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF (300 DPI)</span>
              </button>
            </div>
          </div>

          {/* Interactive Scrollable Canvas Preview */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-200/60">
            <div
              style={{
                transform: `scale(${state.zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              {/* Authentic Printable A4 Paper Sheet (210mm x 297mm) */}
              <div
                id="printable-games-sheet"
                ref={paperSheetRef}
                className="bg-white shadow-xl border border-slate-300/80 flex flex-col text-slate-900 mx-auto select-none print:shadow-none print:border-none"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '16mm 18mm',
                  boxSizing: 'border-box',
                }}
              >
                {/* 1. Pedagogical Header */}
                {state.showHeader && (
                  <div className="w-full pb-4 mb-5 border-b-2 border-slate-800">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left / Title area */}
                      <div>
                        <h1
                          className={`font-black text-slate-900 tracking-tight leading-none ${
                            isArabic ? 'font-arabic text-2xl' : 'text-2xl'
                          }`}
                        >
                          {state.title}
                        </h1>
                        {state.subtitle && (
                          <p
                            className={`text-xs font-medium text-slate-500 mt-1 ${
                              isArabic ? 'font-arabic' : ''
                            }`}
                          >
                            {state.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Right / Student fields */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 min-w-[170px] shrink-0">
                        {state.showStudentName && (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-700">
                              {isArabic ? 'الاسم :' : 'Nom :'}
                            </span>
                            <span className="flex-1 border-b border-dotted border-slate-400 h-4" />
                          </div>
                        )}
                        {state.showDate && (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-700">
                              {isArabic ? 'التاريخ :' : 'Date :'}
                            </span>
                            <span className="flex-1 border-b border-dotted border-slate-400 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Main Game Body based on activeGame */}
                <div className="flex-1 flex flex-col justify-start">
                  {state.activeGame === 'word_search' && (
                    <WordPuzzleView
                      gridData={wordSearchData}
                      isSolution={state.activeViewTab === 'solution'}
                      language={state.language}
                      letterCase={state.wordSearchLetterCase}
                      showWordBank={state.showWordBank}
                      themeTitle={state.wordSearchTheme}
                    />
                  )}

                  {state.activeGame === 'game_cards' && (
                    <GameCardsView
                      config={state.cardsConfig}
                      language={state.language}
                    />
                  )}

                  {state.activeGame === 'sudoku' && (
                    <SudokuView
                      puzzles={sudokuPuzzles}
                      isSolution={state.activeViewTab === 'solution'}
                      language={state.language}
                      showInstructions={state.showInstructions}
                    />
                  )}
                </div>

                {/* 3. Footer Branding & Page Mark */}
                <div className="w-full mt-auto pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>CreatRocket Generator Pro · Jeux & Puzzles Pédagogiques</span>
                  <span>
                    {state.activeViewTab === 'solution'
                      ? 'CORRIGÉ'
                      : 'FICHE EXERCICE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
