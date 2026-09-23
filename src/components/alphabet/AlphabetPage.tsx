import React, { useState, useRef, useMemo } from 'react';
import { Language } from '../../types';
import {
  AlphabetLanguage,
  PedagogicalLevel,
  AlphabetActivityType,
  AlphabetGeneratorState,
  DocumentStyle,
  PaperFormat,
  PaperOrientation,
} from '../../types/alphabet';
import {
  getAlphabetKeys,
  getLetterMeta,
  getDefaultInstructions,
} from '../../utils/alphabetData';
import { AlphabetSheetRenderer } from './AlphabetSheetRenderer';
import {
  exportToPdf,
  exportMultiPagePdf,
  exportToPng,
  printDirect,
} from '../../utils/exportUtils';
import {
  BookOpen,
  ArrowLeft,
  Printer,
  Download,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Sliders,
  CheckSquare,
  Type,
  Layout,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  Palette,
  Scissors,
  CheckCircle2,
  FileText,
  Smile,
  GraduationCap,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface Props {
  language: Language;
  onNavigate?: (route: string) => void;
}

export const AlphabetPage: React.FC<Props> = ({
  language: initialLang,
  onNavigate,
}) => {
  const isArabicDefault = initialLang === 'ar';
  const defaultAlphabetLang: AlphabetLanguage = isArabicDefault ? 'ar' : 'fr';
  const defaultTargetLetter = isArabicDefault ? 'أ' : 'A';

  // Master State
  const [state, setState] = useState<AlphabetGeneratorState>(() => ({
    language: defaultAlphabetLang,
    targetLetter: defaultTargetLetter,
    pedagogicalLevel: 'ms',
    selectedActivities: [
      'writing',
      'search',
      'coloring',
      'matching',
      'cut_paste',
      'vocabulary',
    ],
    pageCount: 3, // 3 pages booklet by default for a generous, airy, commercial-grade layout
    activePageIndex: 0,
    paperFormat: 'a4',
    paperOrientation: 'portrait',
    documentStyle: 'school_playful',
    zoom: 90,
    showAnswerKey: false,

    headerConfig: {
      showStudentName: true,
      showClass: true,
      showDate: true,
      showSubject: true,
      customTitle: '',
      showPageNumber: true,
      showScoreBox: true,
    },

    instructions: getDefaultInstructions(defaultAlphabetLang, defaultTargetLetter),

    writingConfig: {
      rulingType: 'three_lines',
      showArrows: true,
      caseType: 'both',
      repeatCount: 5,
      showFreeLine: true,
    },

    searchConfig: {
      gridColumns: 5,
      totalLetters: 20,
      targetCount: 6,
      difficulty: 'medium',
    },

    coloringConfig: {
      showUppercase: true,
      showLowercase: true,
      includeIllustration: true,
      style: 'outline',
    },

    matchingConfig: {
      variant: 'letter_image',
      itemCount: 4,
      includeDistractors: true,
    },

    cutPasteConfig: {
      mode: 'complete_words',
    },

    vocabularyConfig: {
      wordsCount: 3,
      showTracing: true,
      highlightColor: '#7c3aed',
    },
  }));

  const isArabic = state.language === 'ar';
  const [activeSidebarTab, setActiveSidebarTab] = useState<'general' | 'activities' | 'config' | 'header'>('general');
  const [isExporting, setIsExporting] = useState(false);

  // References for export
  const activeSheetRef = useRef<HTMLDivElement>(null);
  const hiddenPagesContainerRef = useRef<HTMLDivElement>(null);

  // Alphabet keys for picker
  const alphabetKeys = useMemo(
    () => getAlphabetKeys(state.language),
    [state.language]
  );

  const currentMeta = useMemo(
    () => getLetterMeta(state.language, state.targetLetter),
    [state.language, state.targetLetter]
  );

  // Switch language handler
  const handleLanguageChange = (newLang: AlphabetLanguage) => {
    const newTarget = newLang === 'ar' ? 'أ' : 'A';
    setState((prev) => ({
      ...prev,
      language: newLang,
      targetLetter: newTarget,
      instructions: getDefaultInstructions(newLang, newTarget),
      headerConfig: {
        ...prev.headerConfig,
        customTitle: '',
      },
    }));
  };

  // Switch target letter
  const handleLetterSelect = (letter: string) => {
    setState((prev) => ({
      ...prev,
      targetLetter: letter,
      instructions: getDefaultInstructions(prev.language, letter),
    }));
  };

  // Toggle activity selection
  const toggleActivity = (act: AlphabetActivityType) => {
    setState((prev) => {
      const exists = prev.selectedActivities.includes(act);
      const updated = exists
        ? prev.selectedActivities.filter((a) => a !== act)
        : [...prev.selectedActivities, act];
      return {
        ...prev,
        selectedActivities: updated.length > 0 ? updated : [act],
      };
    });
  };

  // Direct print
  const handlePrint = () => {
    printDirect();
  };

  // Export current page PDF
  const handleExportSinglePdf = async () => {
    if (!activeSheetRef.current) return;
    setIsExporting(true);
    try {
      const isLandscape = state.paperOrientation === 'landscape';
      const paperDim = {
        widthMm: isLandscape ? 297 : 210,
        heightMm: isLandscape ? 210 : 297,
      };
      await exportToPdf(
        activeSheetRef.current,
        paperDim,
        `fiche_lettre_${state.targetLetter}_page_${state.activePageIndex + 1}.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Export full multi-page booklet PDF
  const handleExportFullBookletPdf = async () => {
    if (!hiddenPagesContainerRef.current) return;
    setIsExporting(true);
    try {
      const isLandscape = state.paperOrientation === 'landscape';
      const paperDim = {
        widthMm: isLandscape ? 297 : 210,
        heightMm: isLandscape ? 210 : 297,
      };
      const pageElements: HTMLElement[] = [];
      hiddenPagesContainerRef.current
        .querySelectorAll('.booklet-hidden-page')
        .forEach((node) => {
          if (node instanceof HTMLElement) {
            pageElements.push(node);
          }
        });
      if (pageElements.length > 0) {
        await exportMultiPagePdf(
          pageElements,
          paperDim,
          `cahier_lettre_${state.targetLetter}_complet_${state.pageCount}pages.pdf`
        );
      } else if (activeSheetRef.current) {
        await exportToPdf(
          activeSheetRef.current,
          paperDim,
          `fiche_lettre_${state.targetLetter}.pdf`
        );
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Export PNG
  const handleExportPng = async () => {
    if (!activeSheetRef.current) return;
    setIsExporting(true);
    try {
      await exportToPng(
        activeSheetRef.current,
        `lettre_${state.targetLetter}_page_${state.activePageIndex + 1}.png`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-900 select-none">
      {/* ================= 1. TOP UTILITY HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
        {/* Left: Home Navigation & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isArabic ? 'الرئيسية' : 'Catalogue'}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-gray-900 leading-none">
                {isArabic
                  ? 'مُوَلِّدُ تَعَلُّمِ الحُرُوفِ'
                  : "Générateur d'Apprentissage des Lettres"}
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">
                Alphabet Learning & Activity Booklet Pro
              </p>
            </div>
          </div>
        </div>

        {/* Center: Language & Letter Quick Pills */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center p-0.5 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold">
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`px-3 py-1 rounded-md transition-all ${
                state.language === 'fr'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`px-3 py-1 rounded-md transition-all ${
                state.language === 'ar'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              🇦🇪 العربية
            </button>
          </div>

          {/* Letter Quick Picker */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-md py-0.5 scrollbar-thin">
            {alphabetKeys.map((ltr) => (
              <button
                key={ltr}
                onClick={() => handleLetterSelect(ltr)}
                className={`w-7 h-7 shrink-0 rounded-md text-xs font-black transition-all ${
                  state.targetLetter === ltr
                    ? 'bg-indigo-600 text-white shadow-xs scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300'
                } ${isArabic ? 'font-serif' : ''}`}
              >
                {ltr}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Export & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Answer Key Toggle */}
          <button
            onClick={() =>
              setState((prev) => ({ ...prev, showAnswerKey: !prev.showAnswerKey }))
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
              state.showAnswerKey
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {state.showAnswerKey
                ? isArabic
                  ? 'إخفاء الحلول'
                  : 'Corrigé actif'
                : isArabic
                ? 'عرض الحلول'
                : 'Fiche Élève'}
            </span>
          </button>

          {/* Direct Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-2xs transition-colors"
            title="Imprimer directement"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isArabic ? 'طباعة' : 'Imprimer'}
            </span>
          </button>

          {/* Full Booklet Multi-Page PDF Download */}
          <button
            onClick={handleExportFullBookletPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {isExporting
                ? 'Génération...'
                : isArabic
                ? `تحميل الدفتر كامل (${state.pageCount} صفحة)`
                : `Cahier complet (${state.pageCount} p.)`}
            </span>
          </button>

          {/* PNG Export */}
          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-2xs"
            title="Télécharger image PNG"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>
        </div>
      </header>

      {/* ================= 2. MAIN WORKSPACE WITH SIDEBAR ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Controls */}
        <aside className="w-80 md:w-96 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 p-1.5 bg-gray-50 border-b border-gray-200 gap-1 text-[11px] font-bold">
            <button
              onClick={() => setActiveSidebarTab('general')}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeSidebarTab === 'general'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Général</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('activities')}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeSidebarTab === 'activities'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Activités</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('config')}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeSidebarTab === 'config'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Réglages</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab('header')}
              className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                activeSidebarTab === 'header'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>En-tête</span>
            </button>
          </div>

          {/* Tab 1: General Settings */}
          {activeSidebarTab === 'general' && (
            <div className="p-4 flex flex-col gap-4">
              {/* Language selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Langue d'apprentissage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      state.language === 'fr'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇫🇷</span>
                    <span>Français</span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange('ar')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                      state.language === 'ar'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>🇦🇪</span>
                    <span>العربية</span>
                  </button>
                </div>
              </div>

              {/* Target letter selector */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Lettre cible ({state.targetLetter})
                  </label>
                  <span className="text-[11px] font-medium text-indigo-600">
                    {currentMeta.soundHint}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 max-h-36 overflow-y-auto p-1 border border-gray-200 rounded-xl bg-gray-50/50">
                  {alphabetKeys.map((k) => (
                    <button
                      key={k}
                      onClick={() => handleLetterSelect(k)}
                      className={`h-8 rounded-lg text-sm font-extrabold flex items-center justify-center transition-all ${
                        state.targetLetter === k
                          ? 'bg-indigo-600 text-white shadow-xs scale-105'
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-300'
                      } ${isArabic ? 'font-serif' : ''}`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pedagogical level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Niveau pédagogique
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ps', label: isArabic ? 'روضة أولى (3-4)' : 'Petite Section' },
                    { id: 'ms', label: isArabic ? 'روضة ثانية (4-5)' : 'Moyenne Section' },
                    { id: 'gs', label: isArabic ? 'قسم تحضيري (5-6)' : 'Grande Section' },
                    { id: 'cp', label: isArabic ? 'سنة أولى (6-7)' : 'CP / Débutant' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          pedagogicalLevel: lvl.id as PedagogicalLevel,
                        }))
                      }
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        state.pedagogicalLevel === lvl.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page count (1 page or booklet multi-pages) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Format du document
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {state.pageCount === 1 ? 'Fiche synthèse' : `Mini-Cahier ${state.pageCount} pages`}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 6].map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          pageCount: p as 1 | 2 | 3 | 4 | 6,
                          activePageIndex: 0,
                        }))
                      }
                      className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 ${
                        state.pageCount === p
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span>{p}</span>
                      <span className="text-[9px] font-normal opacity-85">
                        {p === 1 ? 'page' : 'pages'}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 italic mt-0.5">
                  💡 Le mode 3 ou 4 pages offre une aération idéale sans surcharge pour les enfants.
                </p>
              </div>

              {/* Document Style */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Style graphique
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'school_playful', label: '🎨 Scolaire Ludique' },
                    { id: 'minimalist_clean', label: '🖨️ Économique N&B' },
                    { id: 'academic_classic', label: '🏛️ Académique' },
                    { id: 'nature_animals', label: '🌿 Nature & Forêt' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          documentStyle: st.id as DocumentStyle,
                        }))
                      }
                      className={`py-2 px-2 rounded-xl border text-xs text-left truncate font-semibold ${
                        state.documentStyle === st.id
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Format & Orientation */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Papier</label>
                  <select
                    value={state.paperFormat}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        paperFormat: e.target.value as PaperFormat,
                      }))
                    }
                    className="border border-gray-200 rounded-lg p-1.5 text-xs bg-white text-gray-800"
                  >
                    <option value="a4">A4 (210 × 297 mm)</option>
                    <option value="letter">Letter (US)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Orientation</label>
                  <select
                    value={state.paperOrientation}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        paperOrientation: e.target.value as PaperOrientation,
                      }))
                    }
                    className="border border-gray-200 rounded-lg p-1.5 text-xs bg-white text-gray-800"
                  >
                    <option value="portrait">Portrait (Vertical)</option>
                    <option value="landscape">Paysage (Horizontal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Activities Selection */}
          {activeSidebarTab === 'activities' && (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Activités incluses ({state.selectedActivities.length}/6)
                </h3>
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      selectedActivities: [
                        'writing',
                        'search',
                        'coloring',
                        'matching',
                        'cut_paste',
                        'vocabulary',
                      ],
                    }))
                  }
                  className="text-[11px] font-bold text-indigo-600 hover:underline"
                >
                  Tout cocher
                </button>
              </div>

              {/* List of 6 Activities */}
              {[
                {
                  id: 'writing' as AlphabetActivityType,
                  title: '1. Écriture & Traçage',
                  desc: 'Modèle avec flèches, lettres en pointillés, lignes Seyès ou 3-lignes, zone libre.',
                  color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
                },
                {
                  id: 'search' as AlphabetActivityType,
                  title: '2. Recherche de la lettre',
                  desc: 'Retrouver et entourer la lettre cible parmi une grille avec distracteurs et corrigé.',
                  color: 'text-blue-600 bg-blue-50 border-blue-200',
                },
                {
                  id: 'coloring' as AlphabetActivityType,
                  title: '3. Coloriage géant',
                  desc: 'Grande lettre en contour creux adaptée aux feutres avec illustration mascotte.',
                  color: 'text-rose-600 bg-rose-50 border-rose-200',
                },
                {
                  id: 'matching' as AlphabetActivityType,
                  title: '4. Association / Matching',
                  desc: 'Relier la lettre cible aux bonnes images et mots correspondants validés.',
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                },
                {
                  id: 'cut_paste' as AlphabetActivityType,
                  title: '5. Découpage & Collage',
                  desc: 'Lignes de découpe pointillés avec ciseaux et zones de collage étiquettes.',
                  color: 'text-amber-600 bg-amber-50 border-amber-200',
                },
                {
                  id: 'vocabulary' as AlphabetActivityType,
                  title: '6. Vocabulaire & Découverte',
                  desc: 'Mots illustrés commençant par la lettre, lettre en relief et ligne de traçage.',
                  color: 'text-violet-600 bg-violet-50 border-violet-200',
                },
              ].map((act) => {
                const isSelected = state.selectedActivities.includes(act.id);

                return (
                  <div
                    key={act.id}
                    onClick={() => toggleActivity(act.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/20 shadow-xs'
                        : 'border-gray-200 bg-gray-50/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <div className="flex flex-col flex-1">
                      <span className="text-xs font-bold text-gray-900">
                        {act.title}
                      </span>
                      <span className="text-[11px] text-gray-500 leading-snug mt-0.5">
                        {act.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Detailed Configurations */}
          {activeSidebarTab === 'config' && (
            <div className="p-4 flex flex-col gap-4">
              {/* Écriture */}
              <div className="flex flex-col gap-2 p-3 bg-gray-50/70 border border-gray-200 rounded-xl">
                <span className="text-xs font-bold text-indigo-900">
                  ✏️ Paramètres d'Écriture
                </span>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-gray-600">Casse d'affichage :</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'both', label: 'Les deux' },
                      { id: 'uppercase', label: 'Majuscule' },
                      { id: 'lowercase', label: 'Minuscule' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            writingConfig: {
                              ...prev.writingConfig,
                              caseType: c.id as any,
                            },
                          }))
                        }
                        className={`py-1 text-[11px] font-bold rounded-lg border ${
                          state.writingConfig.caseType === c.id
                            ? 'bg-white border-indigo-600 text-indigo-700 shadow-xs'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-700 pt-1">
                  <span>Afficher flèches de tracé</span>
                  <input
                    type="checkbox"
                    checked={state.writingConfig.showArrows}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        writingConfig: {
                          ...prev.writingConfig,
                          showArrows: e.target.checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <span>Ligne d'écriture libre</span>
                  <input
                    type="checkbox"
                    checked={state.writingConfig.showFreeLine}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        writingConfig: {
                          ...prev.writingConfig,
                          showFreeLine: e.target.checked,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Recherche de lettre */}
              <div className="flex flex-col gap-2 p-3 bg-gray-50/70 border border-gray-200 rounded-xl">
                <span className="text-xs font-bold text-blue-900">
                  🔍 Paramètres Recherche de Lettre
                </span>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-600">
                    Nombre total de lettres dans la grille : {state.searchConfig.totalLetters}
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="30"
                    step="5"
                    value={state.searchConfig.totalLetters}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        searchConfig: {
                          ...prev.searchConfig,
                          totalLetters: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="accent-indigo-600"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-gray-600">
                    Difficulté des distracteurs :
                  </label>
                  <select
                    value={state.searchConfig.difficulty}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        searchConfig: {
                          ...prev.searchConfig,
                          difficulty: e.target.value as any,
                        },
                      }))
                    }
                    className="border border-gray-200 rounded-lg p-1 text-xs bg-white"
                  >
                    <option value="easy">Facile (lettres très différentes)</option>
                    <option value="medium">Moyen (alphabet mélangé)</option>
                    <option value="hard">Difficile (formes visuellement proches)</option>
                  </select>
                </div>
              </div>

              {/* Vocabulaire */}
              <div className="flex flex-col gap-2 p-3 bg-gray-50/70 border border-gray-200 rounded-xl">
                <span className="text-xs font-bold text-violet-900">
                  📖 Paramètres Vocabulaire
                </span>
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <span>Mots à afficher</span>
                  <select
                    value={state.vocabularyConfig.wordsCount}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        vocabularyConfig: {
                          ...prev.vocabularyConfig,
                          wordsCount: parseInt(e.target.value),
                        },
                      }))
                    }
                    className="border border-gray-200 rounded-lg p-1 text-xs bg-white"
                  >
                    <option value="2">2 mots</option>
                    <option value="3">3 mots</option>
                    <option value="4">4 mots</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-700">
                  <span>Ligne de traçage du mot</span>
                  <input
                    type="checkbox"
                    checked={state.vocabularyConfig.showTracing}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        vocabularyConfig: {
                          ...prev.vocabularyConfig,
                          showTracing: e.target.checked,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Header & Instructions Customization */}
          {activeSidebarTab === 'header' && (
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Titre personnalisé de la fiche
                </label>
                <input
                  type="text"
                  placeholder={
                    isArabic
                      ? `كُرَّاسَةُ تَعَلُّمِ حَرْفِ (${state.targetLetter})`
                      : `Fiche d'apprentissage : La lettre ${state.targetLetter}`
                  }
                  value={state.headerConfig.customTitle}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      headerConfig: {
                        ...prev.headerConfig,
                        customTitle: e.target.value,
                      },
                    }))
                  }
                  className="border border-gray-200 rounded-xl p-2 text-xs"
                />
              </div>

              {/* Toggles for header fields */}
              <div className="flex flex-col gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-xs font-bold text-gray-700">
                  Champs de l'élève à afficher :
                </span>
                {[
                  { key: 'showStudentName', label: isArabic ? 'اسم التلميذ' : "Nom de l'élève" },
                  { key: 'showClass', label: isArabic ? 'القسم / الصف' : 'Classe' },
                  { key: 'showDate', label: isArabic ? 'التاريخ' : 'Date' },
                  { key: 'showSubject', label: isArabic ? 'المادة' : 'Matière' },
                  { key: 'showPageNumber', label: isArabic ? 'رقم الصفحة' : 'Numéro de page' },
                  { key: 'showScoreBox', label: isArabic ? 'خانة التقييم (النجوم)' : 'Boîte évaluation (étoiles)' },
                ].map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center justify-between text-xs text-gray-700 cursor-pointer"
                  >
                    <span>{f.label}</span>
                    <input
                      type="checkbox"
                      checked={(state.headerConfig as any)[f.key]}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          headerConfig: {
                            ...prev.headerConfig,
                            [f.key]: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              </div>

              {/* Editable Instructions */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-700">
                  Consignes personnalisées des activités :
                </span>
                {(
                  [
                    { id: 'writing', label: '1. Écriture' },
                    { id: 'search', label: '2. Recherche' },
                    { id: 'coloring', label: '3. Coloriage' },
                    { id: 'matching', label: '4. Association' },
                    { id: 'cut_paste', label: '5. Découpage' },
                    { id: 'vocabulary', label: '6. Vocabulaire' },
                  ] as const
                ).map((item) => (
                  <div key={item.id} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-500">
                      {item.label}
                    </span>
                    <input
                      type="text"
                      value={state.instructions[item.id] || ''}
                      onChange={(e) =>
                        setState((prev) => ({
                          ...prev,
                          instructions: {
                            ...prev.instructions,
                            [item.id]: e.target.value,
                          },
                        }))
                      }
                      className="border border-gray-200 rounded-lg p-1.5 text-xs text-gray-800"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center Canvas Preview Area */}
        <main className="flex-1 flex flex-col bg-slate-200/70 overflow-hidden">
          {/* Canvas Sub-bar: Page Navigator & Zoom */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between text-xs font-semibold">
            {/* Page navigation buttons */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Page affichée :</span>
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  disabled={state.activePageIndex <= 0}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      activePageIndex: Math.max(0, prev.activePageIndex - 1),
                    }))
                  }
                  className="p-1 rounded text-gray-600 hover:bg-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-gray-800">
                  {state.activePageIndex + 1} / {state.pageCount}
                </span>
                <button
                  disabled={state.activePageIndex >= state.pageCount - 1}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      activePageIndex: Math.min(
                        prev.pageCount - 1,
                        prev.activePageIndex + 1
                      ),
                    }))
                  }
                  className="p-1 rounded text-gray-600 hover:bg-white disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Single page PDF button */}
              <button
                onClick={handleExportSinglePdf}
                disabled={isExporting}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-2xs"
              >
                <Download className="w-3 h-3" />
                <span>Cette page (PDF)</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    zoom: Math.max(60, prev.zoom - 10),
                  }))
                }
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                title="Zoomer arrière"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-gray-600 w-10 text-center">
                {state.zoom}%
              </span>
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    zoom: Math.min(130, prev.zoom + 10),
                  }))
                }
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                title="Zoomer avant"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Sheet Rendering Stage */}
          <div className="flex-1 overflow-auto p-6 flex justify-center items-start">
            <div
              style={{
                transform: `scale(${state.zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <div ref={activeSheetRef}>
                <AlphabetSheetRenderer
                  state={state}
                  pageIndex={state.activePageIndex}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ================= 3. HIDDEN CONTAINER FOR MULTI-PAGE EXPORT ================= */}
      <div
        ref={hiddenPagesContainerRef}
        style={{
          position: 'fixed',
          top: '-99999px',
          left: '-99999px',
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      >
        {Array.from({ length: state.pageCount }).map((_, idx) => (
          <div key={idx} className="booklet-hidden-page">
            <AlphabetSheetRenderer state={state} pageIndex={idx} />
          </div>
        ))}
      </div>
    </div>
  );
};
