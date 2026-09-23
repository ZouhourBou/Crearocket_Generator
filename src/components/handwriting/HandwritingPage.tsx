import React, { useState, useRef, useMemo } from 'react';
import { Language } from '../../types';
import {
  HandwritingState,
  HandwritingActivityType,
  PedagogicalRulingType,
  TracingStyle,
  PhraseTracingMode,
  AlphabetLetterCase,
  ArabicContextualForm,
  LinePatternType,
  LineDifficultyLevel,
  TracingShapeType,
} from '../../types/handwriting';
import { PedagogicalRulingCanvas } from './PedagogicalRulingCanvas';
import { TracingLineItem, TracingShapeItem } from './TracingLinesRenderer';
import {
  ARABIC_ALPHABET_DATA,
  LATIN_ALPHABET,
  FRENCH_COMMON_WORDS,
  ARABIC_COMMON_WORDS,
  ENGLISH_COMMON_WORDS,
} from '../../utils/arabicTypography';
import { exportToPdf, exportToPng, printDirect } from '../../utils/exportUtils';
import {
  FileText,
  Type,
  Spline,
  Shapes,
  Printer,
  Download,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Layers,
  HelpCircle,
  RotateCcw,
  Check,
} from 'lucide-react';

const INITIAL_HANDWRITING_STATE: HandwritingState = {
  activity: 'phrase_name',
  language: 'fr',
  paperFormat: 'A4',
  orientation: 'portrait',
  rulingType: 'seyes',
  showGuidelines: true,
  guidelineColor: '#818cf8',
  rulingScale: 1.0,

  showHeader: true,
  headerTitle: 'Feuille d\'écriture',
  headerStudentName: true,
  headerDate: true,
  headerGrade: false,

  fontFamily: 'Schoolbell',
  textColor: '#1e293b',
  tracingOpacity: 0.85,
  fontSize: 28,
  lineSpacing: 1.2,

  // Phrase & Name
  phraseInput: 'Lucas',
  phraseMode: 'progressive',
  phraseTracingStyle: 'dotted',
  repetitionsPerLine: 4,
  totalLines: 8,

  // Alphabet
  alphabetScope: 'single',
  selectedLetters: ['A', 'B', 'C', 'D'],
  singleSelectedLetter: 'A',
  alphabetCase: 'both',
  arabicFormsMode: 'all',
  alphabetLinesPerLetter: 2,

  // Tracing Lines
  lineType: 'wave',
  lineDifficulty: 'basic',
  lineStrokeWidth: 3.5,
  lineDashSize: 6,
  lineRepeats: 7,
  showStartEndPoint: true,
  showDirectionArrows: true,

  // Shapes
  selectedShapes: ['circle', 'square', 'triangle', 'star', 'heart'],
  shapeMode: 'repeated',
  shapeCount: 5,
  shapeStyle: 'dotted',

  zoom: 100,
  currentPage: 1,
  totalPages: 1,
};

interface HandwritingPageProps {
  language: Language;
  onNavigate: (route: string) => void;
}

export const HandwritingPage: React.FC<HandwritingPageProps> = ({
  language: globalLang,
  onNavigate,
}) => {
  const isArabicGlobal = globalLang === 'ar';
  const [state, setState] = useState<HandwritingState>({
    ...INITIAL_HANDWRITING_STATE,
    language: globalLang === 'ar' ? 'ar' : globalLang === 'en' ? 'en' : 'fr',
    headerTitle:
      globalLang === 'ar'
        ? 'كُرَّاسَةُ الخَطِّ وَالكِتَابَة'
        : globalLang === 'en'
        ? 'Handwriting Practice Worksheet'
        : 'Feuille d\'écriture et de graphisme',
    phraseInput:
      globalLang === 'ar'
        ? 'مَرْحَبًا بِكُمْ فِي المَدْرَسَة'
        : globalLang === 'en'
        ? 'Oliver'
        : 'Lucas',
  });

  const [isExporting, setIsExporting] = useState(false);
  const paperSheetRef = useRef<HTMLDivElement>(null);

  const updateState = (updates: Partial<HandwritingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const isRtl = state.language === 'ar';

  // Standard paper dimensions in mm
  const paperDimensionsMm = useMemo(() => {
    let w = 210;
    let h = 297;
    if (state.paperFormat === 'Letter') {
      w = 215.9;
      h = 279.4;
    } else if (state.paperFormat === 'A5') {
      w = 148;
      h = 210;
    }
    if (state.orientation === 'landscape') {
      return { widthMm: h, heightMm: w };
    }
    return { widthMm: w, heightMm: h };
  }, [state.paperFormat, state.orientation]);

  // Scaled dimensions in pixels for accurate screen display (at 3.78 px/mm ~= 96 DPI)
  const paperWidthPx = Math.round(paperDimensionsMm.widthMm * 3.78);
  const paperHeightPx = Math.round(paperDimensionsMm.heightMm * 3.78);

  const handleExportPdf = async () => {
    if (!paperSheetRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await exportToPdf(
        paperSheetRef.current,
        paperDimensionsMm,
        `feuille-ecriture-${state.activity}.pdf`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    if (!paperSheetRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await exportToPng(
        paperSheetRef.current,
        `feuille-ecriture-${state.activity}-300dpi.png`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const activities = [
    {
      id: 'phrase_name' as HandwritingActivityType,
      label: isArabicGlobal ? 'الأسماء والجمل' : 'Prénoms & Phrases',
      desc: isArabicGlobal ? 'تدريب على كتابة الكلمات والجمل' : 'Traçage personnalisé',
      icon: <Type className="w-4 h-4" />,
    },
    {
      id: 'alphabet' as HandwritingActivityType,
      label: isArabicGlobal ? 'الحروف الأبجدية' : 'Alphabet & Lettres',
      desc: isArabicGlobal ? 'الحروف بأشكالها المختلفة' : 'Majuscules, minuscules & arabe',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'tracing_lines' as HandwritingActivityType,
      label: isArabicGlobal ? 'خطوط ما قبل الكتابة' : 'Lignes & Graphisme',
      desc: isArabicGlobal ? 'تمارين تمهيدية للأطفال' : 'Pré-écriture maternelle',
      icon: <Spline className="w-4 h-4" />,
    },
    {
      id: 'shapes' as HandwritingActivityType,
      label: isArabicGlobal ? 'الأشكال الهندسية' : 'Formes & Motifs',
      desc: isArabicGlobal ? 'دوائر، مربعات، نجوم' : 'Traçage géométrique',
      icon: <Shapes className="w-4 h-4" />,
    },
  ];

  // Helper to render letter tracing row
  const renderLetterItem = (
    text: string,
    style: TracingStyle,
    isFirstSample: boolean = false
  ) => {
    const isDotted = style === 'dotted' && !isFirstSample;
    const isDashed = style === 'dashed' && !isFirstSample;
    const isGray = style === 'light_gray' && !isFirstSample;
    const isOutline = style === 'outline' && !isFirstSample;

    let fontClass = 'font-schoolbell';
    if (state.language === 'ar') fontClass = 'font-amiri font-arabic';
    else if (state.fontFamily === 'Comic Neue') fontClass = 'font-comic';
    else if (state.fontFamily === 'Patrick Hand') fontClass = 'font-patrick';
    else if (state.fontFamily === 'Mali') fontClass = 'font-mali';

    return (
      <span
        className={`inline-block transition-all ${fontClass} ${
          isDotted
            ? 'border-b-2 border-dashed border-slate-400'
            : isDashed
            ? 'opacity-70'
            : isGray
            ? 'text-slate-300'
            : ''
        }`}
        style={{
          fontSize: `${state.fontSize}px`,
          color: isDotted || isOutline ? 'transparent' : isGray ? '#cbd5e1' : state.textColor,
          letterSpacing: state.language === 'ar' ? '0px' : '0.12em',
          WebkitTextStroke: isDotted
            ? '1.2px #64748b'
            : isOutline
            ? '1.5px #475569'
            : undefined,
          strokeDasharray: isDotted ? '2 3' : undefined,
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div
      className="flex-1 flex flex-col bg-slate-50 text-slate-900 font-sans"
      dir={isArabicGlobal ? 'rtl' : 'ltr'}
    >
      {/* 1. Top Breadcrumb Bar */}
      <div className="bg-white/95 backdrop-blur-xs border-b border-slate-200/80 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>CreatRocket Pro</span>
            </button>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ${isArabicGlobal ? 'rotate-180' : ''}`} />
            <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              {isArabicGlobal ? 'مُوَلِّدُ أَوْرَاقِ الخَطِّ وَالتَّدْرِيب' : 'Générateur de Feuilles d\'Écriture'}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isArabicGlobal ? 'rotate-180' : ''}`} />
              <span>{isArabicGlobal ? 'العودة للمنصة' : 'Retour au catalogue'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Activity Type Selector Bar (4 blocks) */}
      <div className="bg-white border-b border-slate-200/80 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activities.map((act) => {
              const isActive = state.activity === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => updateState({ activity: act.id })}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-50 border-red-300 text-red-900 shadow-xs ring-2 ring-red-400/20'
                      : 'bg-slate-50/70 border-slate-200/70 text-slate-700 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isActive ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {act.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{act.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{act.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Studio Workspace: Left (Settings) / Right (Paper Preview) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Settings Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Box 1: Activity-specific content & options */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {state.activity === 'phrase_name' && (isArabicGlobal ? 'إعدادات الجمل والأسماء' : 'Texte & Phrases à tracer')}
                    {state.activity === 'alphabet' && (isArabicGlobal ? 'إعدادات الحروف الأبجدية' : 'Alphabet & Lettres')}
                    {state.activity === 'tracing_lines' && (isArabicGlobal ? 'أنماط الخطوط والمنحنيات' : 'Lignes & Pré-écriture')}
                    {state.activity === 'shapes' && (isArabicGlobal ? 'الأشكال الهندسية' : 'Formes géométriques')}
                  </h3>
                </div>

                {/* Target Language Toggle for Content */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-bold">
                  {(['fr', 'ar', 'en'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => updateState({ language: l })}
                      className={`px-2 py-0.5 rounded-md transition-all uppercase ${
                        state.language === l
                          ? 'bg-white text-red-600 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVITY 1: Phrase & Name Tracing Controls */}
              {state.activity === 'phrase_name' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isArabicGlobal ? 'النص أو الاسم المراد كتابته :' : 'Texte ou prénom à écrire :'}
                    </label>
                    <input
                      type="text"
                      dir={isRtl ? 'rtl' : 'ltr'}
                      value={state.phraseInput}
                      onChange={(e) => updateState({ phraseInput: e.target.value })}
                      placeholder={isRtl ? 'اكتب هنا...' : 'Ex: Lucas ou Ma première phrase...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                    />

                    {/* Quick word suggestions */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      <span className="text-[10px] text-slate-400 font-bold">Exemples :</span>
                      {(state.language === 'ar'
                        ? ARABIC_COMMON_WORDS
                        : state.language === 'en'
                        ? ENGLISH_COMMON_WORDS
                        : FRENCH_COMMON_WORDS
                      ).slice(0, 5).map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => updateState({ phraseInput: w })}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-[11px] font-medium border border-slate-200/80 transition-colors"
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3 Modes d'exercice */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal ? 'نمط التمرين :' : 'Mode d\'exercice :'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        {
                          id: 'example_trace' as PhraseTracingMode,
                          label: 'Exemple + traçage',
                          desc: 'Ligne modèle puis pointillés',
                        },
                        {
                          id: 'progressive' as PhraseTracingMode,
                          label: 'Traçage progressif',
                          desc: 'Normal → Pointillés → Gris → Libre',
                        },
                        {
                          id: 'free' as PhraseTracingMode,
                          label: 'Écriture libre',
                          desc: 'Modèle en haut + lignes vierges',
                        },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => updateState({ phraseMode: m.id })}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            state.phraseMode === m.id
                              ? 'bg-red-50/80 border-red-300 text-red-900 font-bold shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs font-bold">{m.label}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{m.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style de traçage */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isArabicGlobal ? 'نمط الخط المنقط :' : 'Style de traçage :'}
                      </label>
                      <select
                        value={state.phraseTracingStyle}
                        onChange={(e) => updateState({ phraseTracingStyle: e.target.value as TracingStyle })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                      >
                        <option value="dotted">Pointillés classiques (• • •)</option>
                        <option value="dashed">Tirets légers (- - -)</option>
                        <option value="outline">Contour creux à colorier</option>
                        <option value="light_gray">Gris clair estompé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isArabicGlobal ? 'عدد الأسطر :' : 'Nombre de lignes :'}
                      </label>
                      <input
                        type="number"
                        min={3}
                        max={14}
                        value={state.totalLines}
                        onChange={(e) => updateState({ totalLines: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVITY 2: Alphabet Tracing Controls */}
              {state.activity === 'alphabet' && (
                <div className="space-y-4">
                  {/* Scope: Full, Single, Custom */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal ? 'نطاق الحروف :' : 'Sélection des lettres :'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'single', label: 'Une seule lettre' },
                        { id: 'custom', label: 'Sélection multiple' },
                        { id: 'full', label: 'Alphabet complet' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => updateState({ alphabetScope: s.id as any })}
                          className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                            state.alphabetScope === s.id
                              ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Case / Forms */}
                  {state.language === 'ar' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isArabicGlobal ? 'أشكال الحروف العربية بالسياق :' : 'Formes contextuelles arabes :'}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { id: 'all', label: 'جميع الأشكال' },
                          { id: 'isolated', label: 'مُنْفَصِل (Seule)' },
                          { id: 'initial', label: 'بِدَايَة (Début)' },
                          { id: 'medial', label: 'وَسَط (Milieu)' },
                          { id: 'final', label: 'نِهَايَة (Fin)' },
                        ].map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => updateState({ arabicFormsMode: f.id as any })}
                            className={`p-1.5 rounded-lg border text-xs font-bold text-center transition-all ${
                              state.arabicFormsMode === f.id
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isArabicGlobal ? 'حالة الأحرف :' : 'Casse des lettres :'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'both', label: 'A a (Combinées)' },
                          { id: 'upper', label: 'A B C (Majuscules)' },
                          { id: 'lower', label: 'a b c (Minuscules)' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => updateState({ alphabetCase: c.id as AlphabetLetterCase })}
                            className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                              state.alphabetCase === c.id
                                ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Letter Picker Grid */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal ? 'اختر الحرف :' : 'Choisir la lettre :'}
                    </label>
                    <div className="max-h-36 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap gap-1.5 custom-scrollbar">
                      {state.language === 'ar'
                        ? ARABIC_ALPHABET_DATA.map((item) => {
                            const isSelected =
                              state.alphabetScope === 'single'
                                ? state.singleSelectedLetter === item.letter
                                : state.selectedLetters.includes(item.letter);
                            return (
                              <button
                                key={item.letter}
                                type="button"
                                onClick={() => {
                                  if (state.alphabetScope === 'single') {
                                    updateState({ singleSelectedLetter: item.letter });
                                  } else {
                                    const next = state.selectedLetters.includes(item.letter)
                                      ? state.selectedLetters.filter((l) => l !== item.letter)
                                      : [...state.selectedLetters, item.letter];
                                    updateState({ selectedLetters: next });
                                  }
                                }}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-amiri font-bold text-base transition-all ${
                                  isSelected
                                    ? 'bg-red-600 text-white shadow-xs'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300'
                                }`}
                              >
                                {item.letter}
                              </button>
                            );
                          })
                        : LATIN_ALPHABET.map((letter) => {
                            const isSelected =
                              state.alphabetScope === 'single'
                                ? state.singleSelectedLetter === letter
                                : state.selectedLetters.includes(letter);
                            return (
                              <button
                                key={letter}
                                type="button"
                                onClick={() => {
                                  if (state.alphabetScope === 'single') {
                                    updateState({ singleSelectedLetter: letter });
                                  } else {
                                    const next = state.selectedLetters.includes(letter)
                                      ? state.selectedLetters.filter((l) => l !== letter)
                                      : [...state.selectedLetters, letter];
                                    updateState({ selectedLetters: next });
                                  }
                                }}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                                  isSelected
                                    ? 'bg-red-600 text-white shadow-xs'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-red-300'
                                }`}
                              >
                                {letter}
                              </button>
                            );
                          })}
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVITY 3: Tracing Lines (Graphisme) */}
              {state.activity === 'tracing_lines' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal ? 'نوع المسار / الخط :' : 'Type de tracé :'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'wave' as LinePatternType, label: 'Vagues (Courbes)' },
                        { id: 'zigzag' as LinePatternType, label: 'Zigzag' },
                        { id: 'loops_up' as LinePatternType, label: 'Boucles hautes' },
                        { id: 'loops_down' as LinePatternType, label: 'Boucles basses' },
                        { id: 'diagonal' as LinePatternType, label: 'Diagonales' },
                        { id: 'spiral' as LinePatternType, label: 'Spirales' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => updateState({ lineType: p.id })}
                          className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                            state.lineType === p.id
                              ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal ? 'مستوى الصعوبة :' : 'Niveau de précision :'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'basic', label: 'Basic (Large)' },
                        { id: 'intermediate', label: 'Intermédiaire' },
                        { id: 'advanced', label: 'Avancé (Fin)' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => updateState({ lineDifficulty: d.id as LineDifficultyLevel })}
                          className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                            state.lineDifficulty === d.id
                              ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guides Start / End points & Arrows */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={state.showStartEndPoint}
                        onChange={(e) => updateState({ showStartEndPoint: e.target.checked })}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Points départ / arrivée</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={state.showDirectionArrows}
                        onChange={(e) => updateState({ showDirectionArrows: e.target.checked })}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>Flèches de direction</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ACTIVITY 4: Shapes Tracing */}
              {state.activity === 'shapes' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal ? 'اختر الأشكال المراد تضمينها :' : 'Formes géométriques à inclure :'}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'circle' as TracingShapeType, label: 'Cercle' },
                        { id: 'square' as TracingShapeType, label: 'Carré' },
                        { id: 'triangle' as TracingShapeType, label: 'Triangle' },
                        { id: 'rectangle' as TracingShapeType, label: 'Rectangle' },
                        { id: 'star' as TracingShapeType, label: 'Étoile' },
                        { id: 'diamond' as TracingShapeType, label: 'Losange' },
                        { id: 'heart' as TracingShapeType, label: 'Cœur' },
                        { id: 'oval' as TracingShapeType, label: 'Ovale' },
                        { id: 'pentagon' as TracingShapeType, label: 'Pentagone' },
                        { id: 'hexagon' as TracingShapeType, label: 'Hexagone' },
                      ].map((s) => {
                        const isSelected = state.selectedShapes.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              const next = isSelected
                                ? state.selectedShapes.filter((x) => x !== s.id)
                                : [...state.selectedShapes, s.id];
                              updateState({ selectedShapes: next.length > 0 ? next : ['circle'] });
                            }}
                            className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                              isSelected
                                ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mode de formes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal ? 'ترتيب الأشكال :' : 'Mode de disposition :'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'repeated', label: 'Répétition alignée' },
                        { id: 'progressive_size', label: 'Progression de taille' },
                        { id: 'multiple', label: 'Formes mélangées' },
                        { id: 'free_reproduce', label: 'Modèle + case vide' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => updateState({ shapeMode: m.id as any })}
                          className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                            state.shapeMode === m.id
                              ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Box 2: Pedagogical Ruling (Lignages) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  {isArabicGlobal ? 'نوع التسطير البيداغوجي (Lignage)' : 'Type de Lignage Pédagogique'}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'seyes' as PedagogicalRulingType,
                    label: 'Seyès Français',
                    desc: 'Grands carreaux authentiques',
                  },
                  {
                    id: 'beginner_color' as PedagogicalRulingType,
                    label: 'Ciel / Herbe / Terre',
                    desc: 'Idéal maternelle & CP',
                  },
                  {
                    id: 'three_lines' as PedagogicalRulingType,
                    label: '3 Lignes',
                    desc: 'Ligne médiane pointillée',
                  },
                  {
                    id: 'four_lines' as PedagogicalRulingType,
                    label: '4 Lignes',
                    desc: 'Ascendantes / Descendantes',
                  },
                  {
                    id: 'double_line' as PedagogicalRulingType,
                    label: 'Double ligne',
                    desc: 'Maternelle / Pré-CP',
                  },
                  {
                    id: 'arabic_school' as PedagogicalRulingType,
                    label: 'Calligraphie Arabe',
                    desc: 'Ligne de base renforcée',
                  },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => updateState({ rulingType: r.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      state.rulingType === r.id
                        ? 'bg-red-50 border-red-300 text-red-900 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{r.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{r.desc}</div>
                  </button>
                ))}
              </div>

              {/* Ruling Scale & Guides toggle */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Échelle du lignage :
                  </label>
                  <select
                    value={state.rulingScale}
                    onChange={(e) => updateState({ rulingScale: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value={0.85}>Fin / Primaire (0.85x)</option>
                    <option value={1.0}>Standard (1.0x)</option>
                    <option value={1.25}>Grand / Maternelle (1.25x)</option>
                    <option value={1.5}>Très grand / Débutants (1.5x)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Format du papier :
                  </label>
                  <select
                    value={state.paperFormat}
                    onChange={(e) => updateState({ paperFormat: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="Letter">US Letter (216 × 279 mm)</option>
                    <option value="A5">A5 (148 × 210 mm)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Box 3: Header & Student info */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">
                  {isArabicGlobal ? 'ترويسة الصفحة ومعلومات التلميذ' : 'En-tête & Informations élève'}
                </h3>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.showHeader}
                    onChange={(e) => updateState({ showHeader: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs font-bold text-slate-600">Afficher</span>
                </label>
              </div>

              {state.showHeader && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Titre de la fiche :
                    </label>
                    <input
                      type="text"
                      dir={isRtl ? 'rtl' : 'ltr'}
                      value={state.headerTitle}
                      onChange={(e) => updateState({ headerTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.headerStudentName}
                        onChange={(e) => updateState({ headerStudentName: e.target.checked })}
                        className="rounded text-red-600"
                      />
                      <span>Zone Nom / Prénom</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.headerDate}
                        onChange={(e) => updateState({ headerDate: e.target.checked })}
                        className="rounded text-red-600"
                      />
                      <span>Zone Date</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Real Paper Sheet Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Toolbar: Zoom & Export actions */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              {/* Zoom controls */}
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1 border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => updateState({ zoom: Math.max(50, state.zoom - 10) })}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:shadow-2xs transition-all"
                  title="Zoom arrière"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-slate-700 px-1 w-10 text-center">
                  {state.zoom}%
                </span>
                <button
                  type="button"
                  onClick={() => updateState({ zoom: Math.min(150, state.zoom + 10) })}
                  className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:shadow-2xs transition-all"
                  title="Zoom avant"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ zoom: 100 })}
                  className="px-2 py-1 rounded-lg hover:bg-white text-[11px] font-bold text-slate-600 transition-all"
                  title="100%"
                >
                  100%
                </button>
              </div>

              {/* Orientation toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => updateState({ orientation: 'portrait' })}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    state.orientation === 'portrait'
                      ? 'bg-white text-red-600 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ orientation: 'landscape' })}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    state.orientation === 'landscape'
                      ? 'bg-white text-red-600 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Paysage
                </button>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={printDirect}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  title="Imprimer directement"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  title="Exporter en image haute résolution PNG"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/20 disabled:opacity-50 active:scale-95"
                  title="Télécharger le fichier PDF haute qualité prêt pour impression"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Génération...' : 'PDF Prêt'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Container with Realistic Paper Sheet Display */}
            <div className="bg-slate-200/70 p-4 sm:p-8 rounded-2xl border border-slate-300/80 overflow-auto flex items-center justify-center min-h-[640px] custom-scrollbar shadow-inner">
              <div
                style={{
                  transform: `scale(${state.zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {/* THE AUTHENTIC PAPER SHEET */}
                <div
                  ref={paperSheetRef}
                  id="printable-paper-sheet"
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className="bg-white text-slate-900 shadow-2xl relative transition-all overflow-hidden"
                  style={{
                    width: `${paperWidthPx}px`,
                    height: `${paperHeightPx}px`,
                    padding: '24px 28px',
                  }}
                >
                  {/* Pedagogical Ruling Background (Seyès, 3 lines, beginner color, etc.) */}
                  <PedagogicalRulingCanvas
                    rulingType={state.rulingType}
                    width={paperWidthPx}
                    height={paperHeightPx}
                    scale={state.rulingScale}
                    isRtl={isRtl}
                  />

                  {/* Worksheet Header */}
                  {state.showHeader && (
                    <div className="relative z-10 flex items-center justify-between border-b-2 border-slate-300 pb-3 mb-6">
                      <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight">
                          {state.headerTitle}
                        </h1>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          CreatRocket Pédagogique
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                        {state.headerStudentName && (
                          <div className="flex items-center gap-1.5">
                            <span>{isRtl ? 'الاسم :' : 'Nom :'}</span>
                            <span className="w-36 border-b-2 border-dotted border-slate-400 inline-block h-4" />
                          </div>
                        )}
                        {state.headerDate && (
                          <div className="flex items-center gap-1.5">
                            <span>{isRtl ? 'التاريخ :' : 'Date :'}</span>
                            <span className="w-24 border-b-2 border-dotted border-slate-400 inline-block h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* WORKSHEET BODY CONTENT */}
                  <div className="relative z-10 space-y-4">
                    
                    {/* 1. Phrase & Name Tracing Activity */}
                    {state.activity === 'phrase_name' && (
                      <div className="space-y-4 pt-2">
                        {Array.from({ length: state.totalLines }).map((_, lineIdx) => {
                          const isFirst = lineIdx === 0;
                          
                          // Determine mode representation
                          let lineStyle: TracingStyle = 'dotted';
                          let isBlank = false;

                          if (state.phraseMode === 'example_trace') {
                            lineStyle = isFirst ? 'dotted' : state.phraseTracingStyle;
                          } else if (state.phraseMode === 'progressive') {
                            if (lineIdx === 0) lineStyle = 'dotted'; // normal model
                            else if (lineIdx === 1 || lineIdx === 2) lineStyle = state.phraseTracingStyle;
                            else if (lineIdx === 3) lineStyle = 'light_gray';
                            else isBlank = true;
                          } else if (state.phraseMode === 'free') {
                            if (lineIdx === 0) lineStyle = 'dotted';
                            else isBlank = true;
                          }

                          return (
                            <div
                              key={lineIdx}
                              className="flex items-center justify-between border-b border-transparent py-1.5 min-h-[44px]"
                            >
                              {!isBlank && (
                                <div className="flex items-center justify-around w-full gap-4">
                                  {Array.from({ length: state.repetitionsPerLine }).map((__, repIdx) => {
                                    const isModel = lineIdx === 0 && repIdx === 0;
                                    return (
                                      <div key={repIdx} className="px-2">
                                        {renderLetterItem(
                                          state.phraseInput || 'A',
                                          isModel ? 'dotted' : lineStyle,
                                          isModel
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 2. Alphabet Tracing Activity */}
                    {state.activity === 'alphabet' && (
                      <div className="space-y-4 pt-2">
                        {state.language === 'ar' ? (
                          // Arabic Contextual Forms View
                          <div className="space-y-3">
                            {(state.alphabetScope === 'single'
                              ? ARABIC_ALPHABET_DATA.filter((x) => x.letter === state.singleSelectedLetter)
                              : ARABIC_ALPHABET_DATA.filter((x) => state.selectedLetters.includes(x.letter))
                            ).map((letterMeta) => (
                              <div
                                key={letterMeta.letter}
                                className="bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-slate-200/80 shadow-2xs space-y-2"
                              >
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                                  <span className="font-amiri font-bold text-lg text-red-700">
                                    حرف {letterMeta.nameAr} ({letterMeta.letter})
                                  </span>
                                  {!letterMeta.canConnectLeft && (
                                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                                      حرف انفصال (لا يتصل من اليسار)
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-4 gap-2 text-center">
                                  <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-bold mb-1">مُنْفَصِل</div>
                                    <span className="font-amiri font-bold text-2xl text-slate-900">
                                      {letterMeta.isolated}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-bold mb-1">بِدَايَة</div>
                                    <span className="font-amiri font-bold text-2xl text-slate-900">
                                      {letterMeta.initial}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-bold mb-1">وَسَط</div>
                                    <span className="font-amiri font-bold text-2xl text-slate-900">
                                      {letterMeta.medial}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-[10px] text-slate-500 font-bold mb-1">نِهَايَة</div>
                                    <span className="font-amiri font-bold text-2xl text-slate-900">
                                      {letterMeta.final}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Latin Letters
                          <div className="space-y-4">
                            {(state.alphabetScope === 'single'
                              ? [state.singleSelectedLetter]
                              : state.selectedLetters
                            ).map((letter) => {
                              const displayText =
                                state.alphabetCase === 'upper'
                                  ? letter.toUpperCase()
                                  : state.alphabetCase === 'lower'
                                  ? letter.toLowerCase()
                                  : `${letter.toUpperCase()} ${letter.toLowerCase()}`;

                              return (
                                <div key={letter} className="flex items-center justify-around py-2 border-b border-slate-200/50">
                                  {/* Model letter */}
                                  <div className="w-16 text-center">
                                    {renderLetterItem(displayText, 'dotted', true)}
                                  </div>

                                  {/* Tracing repetitions */}
                                  <div className="flex-1 flex items-center justify-around">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                      <div key={i}>
                                        {renderLetterItem(displayText, 'dotted', false)}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3. Tracing Lines (Graphisme) */}
                    {state.activity === 'tracing_lines' && (
                      <div className="space-y-3 pt-3">
                        {Array.from({ length: state.lineRepeats }).map((_, i) => (
                          <TracingLineItem
                            key={i}
                            type={state.lineType}
                            difficulty={state.lineDifficulty}
                            strokeWidth={state.lineStrokeWidth}
                            dashSize={state.lineDashSize}
                            showStartEndPoint={state.showStartEndPoint}
                            showDirectionArrows={state.showDirectionArrows}
                            width={paperWidthPx - 70}
                            height={48}
                            color="#334155"
                            isRtl={isRtl}
                          />
                        ))}
                      </div>
                    )}

                    {/* 4. Shapes Tracing */}
                    {state.activity === 'shapes' && (
                      <div className="pt-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {state.selectedShapes.map((shape) => (
                            <div
                              key={shape}
                              className="bg-white/70 p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-2xs"
                            >
                              <TracingShapeItem
                                shape={shape}
                                size={120}
                                style={state.shapeStyle}
                                color="#334155"
                                strokeWidth={2.8}
                                label={shape.toUpperCase()}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
