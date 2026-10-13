import React, { useState, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { Language } from '../../types';
import {
  HandwritingState,
  HandwritingActivityType,
  PedagogicalRulingType,
  TracingStyle,
  AlphabetLetterCase,
  LinePatternType,
  LineDifficultyLevel,
  TracingShapeType,
  SchoolGradeLevel,
  RepetitionGradientStyle,
  EditableTextSegment,
  A5AssemblyOrientation,
} from '../../types/handwriting';
import { PedagogicalRulingCanvas } from './PedagogicalRulingCanvas';
import { TracingLineItem, TracingShapeItem } from './TracingLinesRenderer';
import {
  GRADE_TYPOGRAPHY_PRESETS,
  computeHandwritingPageLayout,
  splitTextIntoWordBoundarySegments,
  PageLayoutComputationResult,
  HANDWRITING_FONTS,
  resolveHandwritingFontClass,
  applyTextCase,
  resolveStrokeColor,
} from '../../utils/handwritingLayoutEngine';
import {
  ARABIC_ALPHABET_DATA,
  LATIN_ALPHABET,
  FRENCH_COMMON_WORDS,
  ARABIC_COMMON_WORDS,
  ENGLISH_COMMON_WORDS,
} from '../../utils/arabicTypography';
import { exportToPdf, exportMultiPagePdf, exportToPng, printDirect } from '../../utils/exportUtils';
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
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Scissors,
  Sparkles,
  GraduationCap,
  Sliders,
  LayoutGrid,
  AlertCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from 'lucide-react';

const INITIAL_HANDWRITING_STATE: HandwritingState = {
  activity: 'phrase_name',
  language: 'fr',
  paperFormat: 'A4',
  orientation: 'portrait',
  rulingType: 'seyes',
  showGuidelines: true,
  guidelineColor: '#818cf8',
  rulingScale: 1.15,

  // 4. Niveau de classe & Taille de police automatique
  gradeLevel: 'cp',
  autoFontSize: true,
  manualFontSizePx: null,
  minRepetitionGapPx: 26,

  // 3. Alternance lignes tracées / lignes libres
  alternationPattern: {
    tracedRowsCount: 3,
    freeRowsCount: 1,
  },
  useFourStyleRowGradient: true,

  // 5. Segments multiples éditables
  editableSegments: [],
  maxRowsPerExercise: 12,
  overflowSegmentsCount: 0,

  // 6. Format A5 & Assemblage sur A4 (2 pages A5 max)
  a5Assembly: {
    enabled: false,
    orientation: 'left_right',
    showPreviewModal: false,
    showCutLine: true,
    pageCount: 2,
  },
  subPages: [
    {
      pageId: 'a5-page-1',
      pageNumber: 1,
      titleOverride: "Feuille d'écriture — Page 1",
      rawInputText: 'Lucas',
      segments: [],
      manualFontSizePx: null,
    },
    {
      pageId: 'a5-page-2',
      pageNumber: 2,
      titleOverride: "Feuille d'écriture — Page 2",
      rawInputText: 'Emma écrit une belle phrase.',
      segments: [],
      manualFontSizePx: null,
    },
  ],
  activeSubPageIndex: 0,

  // 1. En-tête à hauteur fixe
  showHeader: true,
  headerTitle: "Feuille d'écriture et de traçage",
  headerStudentName: true,
  headerDate: true,
  headerGrade: true,
  headerShowLogo: true,
  headerLogoText: 'ÉCOLE',

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
  letterCase: 'original',
  textAlignment: 'left',
  strokeColor: 'blue',
  strokeWidth: 1.25,
  letterSpacingPx: 0,
  wordSpacingPx: 0,
  lineSpacingMultiplier: 1.0,

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

export interface HandwritingPageItem extends HandwritingState {
  pageId: string;
  customSegments: EditableTextSegment[] | null;
}

function createDefaultPageItem(
  pageNumber: number,
  globalLang: Language,
  overrides?: Partial<HandwritingPageItem>
): HandwritingPageItem {
  const defaultPhrasesFr = ['Lucas', 'Emma écrit sur son cahier', 'Léo trace de belles lettres', 'Chloé aime lire'];
  const defaultPhrasesAr = ['أَحْمَدُ', 'العِلْمُ نُورٌ', 'مَدْرَسَتِي جَمِيلَةٌ', 'أَنَا أَكْتُبُ بِخَطٍّ جَمِيلٍ'];
  const defaultPhrasesEn = ['Oliver', 'Emma writes neatly', 'Practice makes perfect', 'Learning is fun'];

  const phraseList =
    globalLang === 'ar'
      ? defaultPhrasesAr
      : globalLang === 'en'
      ? defaultPhrasesEn
      : defaultPhrasesFr;
  const initialPhrase = phraseList[(pageNumber - 1) % phraseList.length];

  const initialTitle =
    globalLang === 'ar'
      ? 'كُرَّاسَةُ الخَطِّ وَالكِتَابَة'
      : globalLang === 'en'
      ? 'Handwriting & Tracing Sheet'
      : "Feuille d'écriture et de traçage";

  return {
    ...INITIAL_HANDWRITING_STATE,
    pageId: `hw-page-${Date.now()}-${pageNumber}-${Math.random().toString(36).slice(2, 6)}`,
    language: globalLang === 'ar' ? 'ar' : globalLang === 'en' ? 'en' : 'fr',
    headerTitle: initialTitle,
    phraseInput: initialPhrase,
    customSegments: null,
    currentPage: pageNumber,
    ...overrides,
  };
}

export const HandwritingPage: React.FC<HandwritingPageProps> = ({
  language: globalLang,
  onNavigate,
}) => {
  const isArabicGlobal = globalLang === 'ar';

  // Liste dynamique de pages indépendantes : chaque page possède toutes ses propres propriétés
  const [pages, setPages] = useState<HandwritingPageItem[]>(() => [
    createDefaultPageItem(1, globalLang),
  ]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  const safeActiveIndex = Math.min(activePageIndex, Math.max(0, pages.length - 1));
  const state = pages[safeActiveIndex] || pages[0];

  // 2. Debounce de 300ms sur le texte saisi de la page active pour éviter de relancer le calcul à chaque caractère
  const [debouncedActiveText, setDebouncedActiveText] = useState<string>(state.phraseInput);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  // Mode d'affichage A5 : page A5 seule aux vraies proportions vs aperçu d'assemblage 2xA5 sur A4
  const [showA4AssemblyPreview, setShowA4AssemblyPreview] = useState<boolean>(false);

  const [isExporting, setIsExporting] = useState(false);
  const paperSheetRef = useRef<HTMLDivElement>(null);
  const multiPagePrintRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRefPage1 = useRef<HTMLElement | null>(null);
  const headerRefPage2 = useRef<HTMLElement | null>(null);
  const [measuredHeaderHeightPage1, setMeasuredHeaderHeightPage1] = useState<number>(0);
  const [measuredHeaderHeightPage2, setMeasuredHeaderHeightPage2] = useState<number>(0);

  // 1. Mesurer la hauteur réelle du bloc d'en-tête (titre + Nom/Date) une fois qu'il est rendu dans le DOM
  useLayoutEffect(() => {
    if (!state.showHeader) {
      setMeasuredHeaderHeightPage1(0);
      setMeasuredHeaderHeightPage2(0);
      return;
    }

    const updateHeaderHeights = () => {
      if (headerRefPage1.current) {
        const h1 = Math.ceil(headerRefPage1.current.offsetHeight);
        if (h1 > 0) {
          setMeasuredHeaderHeightPage1((prev) => (prev !== h1 ? h1 : prev));
        }
      }
      if (headerRefPage2.current) {
        const h2 = Math.ceil(headerRefPage2.current.offsetHeight);
        if (h2 > 0) {
          setMeasuredHeaderHeightPage2((prev) => (prev !== h2 ? h2 : prev));
        }
      }
    };

    updateHeaderHeights();

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            updateHeaderHeights();
          })
        : null;

    if (observer) {
      if (headerRefPage1.current) observer.observe(headerRefPage1.current);
      if (headerRefPage2.current) observer.observe(headerRefPage2.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [
    safeActiveIndex,
    pages.length,
    state.showHeader,
    state.headerTitle,
    state.headerStudentName,
    state.headerDate,
    state.headerGrade,
    state.headerShowLogo,
    state.headerLogoText,
    state.paperFormat,
    state.orientation,
    showA4AssemblyPreview,
    state.a5Assembly.orientation,
    state.gradeLevel,
    state.alternationPattern.tracedRowsCount,
    state.alternationPattern.freeRowsCount,
  ]);

  // Synchronise immédiatement debouncedActiveText lors d'un changement de page sélectionnée
  useEffect(() => {
    setDebouncedActiveText(state.phraseInput);
    setIsDebouncing(false);
  }, [safeActiveIndex]);

  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedActiveText(state.phraseInput);
      setIsDebouncing(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [state.phraseInput]);

  // Met à jour uniquement les propriétés de la page actuellement sélectionnée
  const updateState = (updates: Partial<HandwritingState>) => {
    setPages((prev) =>
      prev.map((pageItem, idx) => {
        if (idx === safeActiveIndex) {
          return { ...pageItem, ...updates };
        }
        // Conserver le zoom d'aperçu synchronisé pour le confort visuel
        if (updates.zoom !== undefined) {
          return { ...pageItem, zoom: updates.zoom };
        }
        return pageItem;
      })
    );
  };

  const activeCustomSegments = state.customSegments;
  const setActiveCustomSegments = (nextSegments: EditableTextSegment[] | null) => {
    setPages((prev) =>
      prev.map((pageItem, idx) =>
        idx === safeActiveIndex ? { ...pageItem, customSegments: nextSegments } : pageItem
      )
    );
  };

  // Actions de gestion Multi-Pages (Sélectionner, Ajouter, Dupliquer, Supprimer)
  const handleSelectPage = (index: number) => {
    const clamped = Math.max(0, Math.min(pages.length - 1, index));
    setActivePageIndex(clamped);
  };

  const handleAddPage = () => {
    const nextNumber = pages.length + 1;
    const newPage = createDefaultPageItem(nextNumber, globalLang, {
      paperFormat: state.paperFormat,
      orientation: state.orientation,
      zoom: state.zoom,
    });
    setPages((prev) => [...prev, newPage]);
    setActivePageIndex(pages.length);
  };

  const handleDuplicatePage = (sourceIdx: number = safeActiveIndex) => {
    const sourcePage = pages[sourceIdx] || state;
    const duplicatedPage: HandwritingPageItem = {
      ...sourcePage,
      pageId: `hw-page-${Date.now()}-${pages.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
      customSegments: sourcePage.customSegments
        ? sourcePage.customSegments.map((s, i) => ({ ...s, id: `seg-dup-${Date.now()}-${i}` }))
        : null,
    };
    const nextPages = [...pages];
    nextPages.splice(sourceIdx + 1, 0, duplicatedPage);
    setPages(nextPages);
    setActivePageIndex(sourceIdx + 1);
  };

  const handleDeletePage = (targetIdx: number = safeActiveIndex) => {
    if (pages.length <= 1) return;
    const nextPages = pages.filter((_, idx) => idx !== targetIdx);
    setPages(nextPages);
    setActivePageIndex((prevIdx) => {
      if (prevIdx >= nextPages.length) return nextPages.length - 1;
      if (prevIdx > targetIdx) return prevIdx - 1;
      return prevIdx;
    });
  };

  const isRtl = state.language === 'ar';
  const activeGradePreset =
    GRADE_TYPOGRAPHY_PRESETS[state.gradeLevel] || GRADE_TYPOGRAPHY_PRESETS.cp;

  // Changement de niveau de classe -> ajuste la taille idéale/minimale et le lignage par défaut pour la page active
  const handleSelectGradeLevel = (level: SchoolGradeLevel) => {
    const preset = GRADE_TYPOGRAPHY_PRESETS[level];
    setActiveCustomSegments(null);
    updateState({
      gradeLevel: level,
      manualFontSizePx: null,
      autoFontSize: true,
      rulingType: state.language === 'ar' ? 'arabic_school' : preset.defaultRuling,
      rulingScale: preset.defaultRulingScale,
    });
  };

  // Dimensions réelles de la page active en mm (A4, Letter, ou A5 aux proportions réelles 148x210mm)
  const singlePageDimensionsMm = useMemo(() => {
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

  // Dimensions de la feuille A4 d'assemblage (quand format = A5 et assemblage 2xA5 sur A4 actif)
  const assembledA4DimensionsMm = useMemo(() => {
    if (state.a5Assembly.orientation === 'left_right') {
      return { widthMm: 297, heightMm: 210 };
    }
    return { widthMm: 210, heightMm: 297 };
  }, [state.a5Assembly.orientation]);

  // Calcul du layout indépendant pour chaque page du document
  const allPageLayouts: PageLayoutComputationResult[] = useMemo(() => {
    return pages.map((pageItem, idx) => {
      const isA5 = pageItem.paperFormat === 'A5';
      let baseW = 210;
      let baseH = 297;
      if (pageItem.paperFormat === 'Letter') {
        baseW = 215.9;
        baseH = 279.4;
      } else if (isA5) {
        baseW = 148;
        baseH = 210;
      }
      const dimW = pageItem.orientation === 'landscape' ? baseH : baseW;
      const dimH = pageItem.orientation === 'landscape' ? baseW : baseH;

      const wPx =
        isA5 && showA4AssemblyPreview
          ? state.a5Assembly.orientation === 'left_right'
            ? Math.round(148.5 * 3.78)
            : Math.round(210 * 3.78)
          : Math.round(dimW * 3.78);
      const hPx =
        isA5 && showA4AssemblyPreview
          ? state.a5Assembly.orientation === 'left_right'
            ? Math.round(210 * 3.78)
            : Math.round(148.5 * 3.78)
          : Math.round(dimH * 3.78);

      const rawTextForPage =
        idx === safeActiveIndex ? debouncedActiveText : pageItem.phraseInput;
      const transformedTextForPage = applyTextCase(rawTextForPage, pageItem.letterCase);

      return computeHandwritingPageLayout({
        paperFormat: pageItem.paperFormat,
        paperWidthPx: wPx,
        paperHeightPx: hPx,
        showHeader: pageItem.showHeader,
        measuredHeaderHeightPx:
          idx === safeActiveIndex
            ? measuredHeaderHeightPage1
            : measuredHeaderHeightPage2 || measuredHeaderHeightPage1,
        gradeLevel: pageItem.gradeLevel,
        manualFontSizePx: pageItem.manualFontSizePx,
        minRepetitionGapPx: pageItem.minRepetitionGapPx,
        fontFamily: pageItem.fontFamily,
        language: pageItem.language,
        rawText: transformedTextForPage,
        customSegments: pageItem.customSegments || undefined,
        alternationPattern: pageItem.alternationPattern,
        useFourStyleRowGradient: pageItem.useFourStyleRowGradient,
        rulingType: pageItem.rulingType,
        rulingScale: pageItem.rulingScale,
        letterSpacingPx: pageItem.letterSpacingPx,
        lineSpacingMultiplier: pageItem.lineSpacingMultiplier,
      });
    });
  }, [
    pages,
    safeActiveIndex,
    debouncedActiveText,
    showA4AssemblyPreview,
    state.a5Assembly.orientation,
    measuredHeaderHeightPage1,
    measuredHeaderHeightPage2,
  ]);

  const activeLayout = allPageLayouts[safeActiveIndex] || allPageLayouts[0];
  const companionPageIndex =
    safeActiveIndex + 1 < pages.length
      ? safeActiveIndex + 1
      : pages.length > 1
      ? 0
      : safeActiveIndex;
  const page1Layout = activeLayout;
  const page2Layout = allPageLayouts[companionPageIndex] || activeLayout;
  const companionPageState = pages[companionPageIndex] || state;

  // Liste actuelle des segments éditables pour la page active
  const currentEditableSegments: EditableTextSegment[] = useMemo(() => {
    if (activeCustomSegments && activeCustomSegments.length > 0) {
      return activeCustomSegments;
    }
    const transformedText = applyTextCase(state.phraseInput, state.letterCase);

    return splitTextIntoWordBoundarySegments(
      transformedText,
      activeLayout.effectiveFontSizePx,
      activeLayout.usableWidthPx,
      state.minRepetitionGapPx,
      state.fontFamily,
      state.language,
      state.letterSpacingPx
    );
  }, [
    activeCustomSegments,
    state.phraseInput,
    state.letterCase,
    activeLayout.effectiveFontSizePx,
    activeLayout.usableWidthPx,
    state.minRepetitionGapPx,
    state.fontFamily,
    state.language,
    state.letterSpacingPx,
  ]);

  // Actions d'édition sur les rangées générées (Spec 5) pour la page active
  const handleUpdateSegmentText = (segId: string, newText: string) => {
    const next = currentEditableSegments.map((s) =>
      s.id === segId ? { ...s, text: newText, isManuallyEdited: true } : s
    );
    setActiveCustomSegments(next);
  };

  const handleMoveSegment = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= currentEditableSegments.length) return;
    const next = [...currentEditableSegments];
    const [moved] = next.splice(idx, 1);
    next.splice(targetIdx, 0, moved);
    setActiveCustomSegments(next);
  };

  const handleDeleteSegment = (segId: string) => {
    if (currentEditableSegments.length <= 1) return;
    setActiveCustomSegments(currentEditableSegments.filter((s) => s.id !== segId));
  };

  const handleAddSegment = () => {
    const next: EditableTextSegment[] = [
      ...currentEditableSegments,
      {
        id: `seg-${Date.now()}`,
        text: state.language === 'ar' ? 'كَلِمَةٌ جَدِيدَة' : 'Nouvelle rangée',
        isManuallyEdited: true,
      },
    ];
    setActiveCustomSegments(next);
  };

  const handleSendOverflowToSecondPage = () => {
    if (!activeLayout.hasOverflowForNextPage) return;
    const overflowText = activeLayout.overflowSegments.map((s) => s.text).join(' ');
    const newPage: HandwritingPageItem = {
      ...state,
      pageId: `hw-page-${Date.now()}-${pages.length + 1}`,
      phraseInput: overflowText,
      customSegments: activeLayout.overflowSegments,
    };
    const updatedCurrentPage: HandwritingPageItem = {
      ...state,
      customSegments: activeLayout.activeSegments,
    };
    const nextPages = [...pages];
    nextPages[safeActiveIndex] = updatedCurrentPage;
    nextPages.splice(safeActiveIndex + 1, 0, newPage);
    setPages(nextPages);
    setActivePageIndex(safeActiveIndex + 1);
  };

  const handleExportPdf = async () => {
    if (!paperSheetRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const targetDimensions =
        state.paperFormat === 'A5' && showA4AssemblyPreview
          ? assembledA4DimensionsMm
          : singlePageDimensionsMm;

      if (pages.length > 1 && !(state.paperFormat === 'A5' && showA4AssemblyPreview)) {
        const validElements = multiPagePrintRefs.current
          .slice(0, pages.length)
          .filter((el): el is HTMLDivElement => el !== null);
        if (validElements.length === pages.length) {
          await exportMultiPagePdf(
            validElements,
            targetDimensions,
            `feuilles-ecriture-${pages.length}-pages-${state.paperFormat.toLowerCase()}.pdf`
          );
          return;
        }
      }

      await exportToPdf(
        paperSheetRef.current,
        targetDimensions,
        `feuille-ecriture-page-${safeActiveIndex + 1}-${state.paperFormat.toLowerCase()}.pdf`
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
        `feuille-ecriture-${state.paperFormat.toLowerCase()}-300dpi.png`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    // Si on est en format A5, basculer automatiquement sur l'assemblage A4 (2xA5) pour l'impression
    if (state.paperFormat === 'A5' && !showA4AssemblyPreview) {
      setShowA4AssemblyPreview(true);
      setTimeout(() => {
        printDirect();
      }, 200);
      return;
    }
    printDirect();
  };

  const activities = [
    {
      id: 'phrase_name' as HandwritingActivityType,
      label: isArabicGlobal ? 'الأسماء والجمل' : 'Prénoms & Phrases',
      desc: isArabicGlobal ? 'تدريب على كتابة الكلمات والجمل' : 'Traçage intelligent & progressif',
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

  // Rendu d'une cellule de répétition selon le dégradé des 4 styles (Spec 2) :
  // 'solid' (couleur pleine) -> 'dotted' (pointillé) -> 'light_gray' (gris clair estompé) -> 'blank' (vide)
  const renderRepetitionCell = (
    text: string,
    style: RepetitionGradientStyle,
    fontSizePx: number,
    measuredWidthPx: number,
    pageState: HandwritingState = state
  ) => {
    const fontClass = resolveHandwritingFontClass(pageState.fontFamily, pageState.language);

    if (style === 'blank') {
      // 4e style : Vide (l'élève écrit de manière autonome sur la réglure)
      return (
        <span
          className={`inline-block leading-none select-none relative ${fontClass}`}
          style={{
            width: `${measuredWidthPx}px`,
            fontSize: `${fontSizePx}px`,
          }}
          title="Zone d'écriture autonome (vide)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70 inline-block align-baseline" />
        </span>
      );
    }

    const isSolid = style === 'solid';
    const isDotted = style === 'dotted';
    const isLightGray = style === 'light_gray';
    const resolvedColor = resolveStrokeColor(pageState.strokeColor, pageState.textColor || '#1d4ed8');
    const userStrokeWidth = pageState.strokeWidth || 1.25;

    return (
      <span
        className={`inline-block leading-none select-none ${fontClass}`}
        style={{
          fontSize: `${fontSizePx}px`,
          fontWeight: isSolid ? 700 : 600,
          color: isSolid
            ? resolvedColor
            : isDotted
            ? 'transparent'
            : isLightGray
            ? '#cbd5e1'
            : resolvedColor,
          letterSpacing: pageState.language === 'ar' ? '0px' : pageState.letterSpacingPx > 0 ? `${pageState.letterSpacingPx}px` : '0.08em',
          wordSpacing: pageState.wordSpacingPx > 0 ? `${pageState.wordSpacingPx}px` : undefined,
          WebkitTextStroke: isDotted ? `${userStrokeWidth}px #64748b` : isSolid && userStrokeWidth > 1.4 ? `${(userStrokeWidth - 1) * 0.5}px ${resolvedColor}` : undefined,
          filter: isDotted ? ' contrast(1.05)' : undefined,
          borderBottom: isDotted ? '1.5px dotted #94a3b8' : undefined,
          paddingBottom: '1px',
        }}
      >
        {text}
      </span>
    );
  };

  // Helper pour l'activité Alphabet existante
  const renderLetterItem = (
    text: string,
    style: TracingStyle,
    isFirstSample: boolean = false,
    pageState: HandwritingState = state,
    fontSizePx: number = activeLayout.effectiveFontSizePx
  ) => {
    const isDotted = style === 'dotted' && !isFirstSample;
    const isDashed = style === 'dashed' && !isFirstSample;
    const isGray = style === 'light_gray' && !isFirstSample;
    const isOutline = style === 'outline' && !isFirstSample;
    const fontClass = resolveHandwritingFontClass(pageState.fontFamily, pageState.language);

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
          fontSize: `${fontSizePx}px`,
          color: isDotted || isOutline ? 'transparent' : isGray ? '#cbd5e1' : pageState.textColor,
          letterSpacing: pageState.language === 'ar' ? '0px' : '0.12em',
          WebkitTextStroke: isDotted
            ? '1.2px #64748b'
            : isOutline
            ? '1.5px #475569'
            : undefined,
        }}
      >
        {text}
      </span>
    );
  };

  /**
   * Rendu complet d'une page (A4 ou A5) avec ses propres propriétés (pageState) :
   * - Bloc d'en-tête à hauteur mesurée (titre + Nom/Date + logo) solidaire du bloc de lignes
   * - Réglure parfaitement calée sur les rangées exactes (sans espace vide en bas ni ligne coupée)
   * - Alternance rangées tracées (4 styles) / rangées libres
   */
  const renderSingleWorksheetPage = (
    layout: PageLayoutComputationResult,
    pageNumber: number,
    customTitle?: string,
    pageState: HandwritingState = state,
    measureHeaderSlot?: 1 | 2 | null
  ) => {
    const isA5Page = layout.paperFormat === 'A5';
    const pageIsRtl = pageState.language === 'ar';
    const pageGradePreset =
      GRADE_TYPOGRAPHY_PRESETS[pageState.gradeLevel] || GRADE_TYPOGRAPHY_PRESETS.cp;
    const seyesLeftPaddingPx =
      pageState.rulingType === 'seyes' ? Math.round(42 * pageState.rulingScale) : 0;
    const effectiveRulingHeightPx =
      pageState.activity === 'phrase_name'
        ? layout.renderedContentHeightPx
        : layout.usableHeightPx;
    const maxFittingTracingLines = Math.min(
      pageState.lineRepeats,
      Math.max(1, Math.floor((layout.usableHeightPx - 12) / 60))
    );

    return (
      <div
        dir={pageIsRtl ? 'rtl' : 'ltr'}
        className="bg-white text-slate-900 relative overflow-hidden flex flex-col select-none box-border"
        style={{
          width: `${layout.paperWidthPx}px`,
          height: `${layout.paperHeightPx}px`,
          padding: `${layout.paddingYPx}px ${layout.paddingXPx}px`,
          boxSizing: 'border-box',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        {/* CONTENEUR SOLIDAIRE : EN-TÊTE MESURÉ + BLOC DE LIGNES */}
        <div
          className="flex flex-col w-full h-full overflow-hidden"
          style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
        >
          {/* 1. BLOC D'EN-TÊTE CONTENU DANS SA PROPRE ZONE (Titre, Nom/Date, Logo) */}
          {pageState.showHeader && (
            <header
              ref={(el) => {
                if (measureHeaderSlot === 1) {
                  headerRefPage1.current = el;
                } else if (measureHeaderSlot === 2) {
                  headerRefPage2.current = el;
                }
              }}
              className="relative z-10 w-full flex items-center justify-between gap-3 border-b-2 border-slate-800/80 shrink-0 overflow-hidden box-border"
              style={{
                minHeight: isA5Page ? '52px' : '64px',
                paddingBottom: isA5Page ? '8px' : '10px',
                marginBottom: `${layout.headerBottomMarginPx}px`,
                pageBreakAfter: 'avoid',
                breakAfter: 'avoid',
              }}
            >
              {/* Logo + Titre + Badge Niveau */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {pageState.headerShowLogo && (
                  <div
                    className={`rounded-xl bg-red-600 text-white font-black flex flex-col items-center justify-center shrink-0 shadow-2xs border border-red-700 ${
                      isA5Page ? 'w-9 h-9 text-[8px]' : 'w-11 h-11 text-[9px]'
                    }`}
                  >
                    <GraduationCap className={isA5Page ? 'w-4 h-4' : 'w-5 h-5'} />
                    <span className="tracking-tighter leading-none mt-0.5">
                      {pageState.headerLogoText || 'ÉCOLE'}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h1
                      className={`font-black text-slate-900 tracking-tight truncate leading-tight ${
                        isA5Page ? 'text-sm' : 'text-lg'
                      }`}
                    >
                      {customTitle || pageState.headerTitle}
                    </h1>
                    {pageState.headerGrade && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-[9px] font-extrabold text-slate-700 uppercase shrink-0">
                        {pageIsRtl ? pageGradePreset.labelAr : pageGradePreset.label}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block truncate mt-0.5">
                    {pageIsRtl
                      ? 'تمرين الخط والكتابة المتدرج'
                      : `Modèle progressif • ${pageState.alternationPattern.tracedRowsCount} tracées / ${pageState.alternationPattern.freeRowsCount} libre`}
                  </span>
                </div>
              </div>

              {/* Champs Nom & Date alignés et contenus dans la zone d'en-tête */}
              <div
                className={`flex items-center gap-3 font-bold text-slate-700 shrink-0 ${
                  isA5Page ? 'text-[10px]' : 'text-xs'
                }`}
              >
                {pageState.headerStudentName && (
                  <div className="flex items-baseline gap-1">
                    <span>{pageIsRtl ? 'الاسم :' : 'Nom :'}</span>
                    <span
                      className={`border-b-2 border-dotted border-slate-400 inline-block ${
                        isA5Page ? 'w-20 h-3.5' : 'w-28 h-4'
                      }`}
                    />
                  </div>
                )}
                {pageState.headerDate && (
                  <div className="flex items-baseline gap-1">
                    <span>{pageIsRtl ? 'التاريخ :' : 'Date :'}</span>
                    <span
                      className={`border-b-2 border-dotted border-slate-400 inline-block ${
                        isA5Page ? 'w-14 h-3.5' : 'w-20 h-4'
                      }`}
                    />
                  </div>
                )}
              </div>
            </header>
          )}

          {/* 2. ZONE DES LIGNES D'ÉCRITURE (Contient uniquement les rangées complètes qui rentrent dans usableHeightPx) */}
          <div
            className="relative w-full shrink-0 overflow-hidden"
            style={{
              height: `${layout.usableHeightPx}px`,
            }}
          >
            {/* Réglure du cahier calée exactement sur les rangées complètes */}
            <PedagogicalRulingCanvas
              rulingType={pageState.rulingType}
              width={layout.paperWidthPx - layout.paddingXPx * 2}
              height={effectiveRulingHeightPx}
              scale={pageState.rulingScale}
              isRtl={pageIsRtl}
              exactRowHeightPx={layout.exactRowHeightPx}
              exactRowsCount={layout.totalRowsOnPage}
              paddingXPx={4}
            />

            {/* Contenu selon l'activité */}
            {pageState.activity === 'phrase_name' &&
              (!pageState.phraseInput.trim() ? (
                <div
                  className="relative z-10 w-full flex flex-col items-center justify-center text-center p-8 select-none"
                  style={{
                    height: `${layout.renderedContentHeightPx || 240}px`,
                  }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-500 flex items-center justify-center mb-2 shadow-2xs">
                    <Type className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-700 mb-1">
                    {pageIsRtl ? 'لا يوجد نص مكتوب' : 'Aucun texte saisi'}
                  </div>
                  <div className="text-xs text-slate-400 max-w-sm">
                    {pageIsRtl
                      ? 'اكتب اسماً أو جملة في لوحة التحكم لعرض نموذج الخط والتمارين'
                      : 'Saisissez un prénom, une phrase ou un paragraphe dans la barre latérale pour générer immédiatement la feuille d\'écriture.'}
                  </div>
                </div>
              ) : (
                <div
                  className="relative z-10 w-full flex flex-col overflow-hidden"
                  style={{
                    height: `${layout.renderedContentHeightPx}px`,
                  }}
                >
                  {layout.rows.map((row) => {
                    const isFreeRow = row.type === 'free';
                    // Alignement vertical précis du texte sur la ligne de base (baseline à 75% de la hauteur de rangée)
                    const baselineTopPx = Math.max(
                      0,
                      Math.round(row.rowHeightPx * 0.75 - row.fontSizePx * 0.84)
                    );

                    return (
                      <div
                        key={row.rowId}
                        className="w-full relative shrink-0 overflow-hidden box-border"
                        style={{
                          height: `${row.rowHeightPx}px`,
                          minHeight: `${row.rowHeightPx}px`,
                          maxHeight: `${row.rowHeightPx}px`,
                        }}
                      >
                        {/* Indicateur discret de motif à gauche dans la marge */}
                        {pageState.rulingType === 'seyes' && (
                          <span
                            className="absolute text-[8px] font-bold select-none leading-none"
                            style={{
                              left: pageIsRtl ? undefined : '6px',
                              right: pageIsRtl ? '6px' : undefined,
                              top: `${Math.round(row.rowHeightPx * 0.45)}px`,
                              color: isFreeRow ? '#94a3b8' : '#818cf8',
                            }}
                          >
                            {isFreeRow ? '•' : `${row.indexInPattern + 1}`}
                          </span>
                        )}

                        {/* Si rangée tracée : affiche les répétitions avec dégradé 4 styles */}
                        {/* Si rangée libre : affiche uniquement la réglure du cahier, sans aucun modèle */}
                        {!isFreeRow && (
                          <div
                            className={`w-full flex items-baseline absolute inset-x-0 ${
                              pageState.textAlignment === 'center'
                                ? 'justify-center'
                                : pageState.textAlignment === 'right'
                                ? pageIsRtl ? 'justify-start' : 'justify-end'
                                : pageState.textAlignment === 'left'
                                ? pageIsRtl ? 'justify-end' : 'justify-start'
                                : row.repetitions.length > 1
                                ? 'justify-between'
                                : 'justify-start'
                            }`}
                            style={{
                              top: `${baselineTopPx}px`,
                              paddingLeft: !pageIsRtl ? `${seyesLeftPaddingPx + 8}px` : '8px',
                              paddingRight: pageIsRtl ? `${seyesLeftPaddingPx + 8}px` : '8px',
                              gap: `${pageState.minRepetitionGapPx}px`,
                            }}
                          >
                            {row.repetitions.map((cell) => (
                              <div key={cell.index} className="shrink-0 leading-none">
                                {renderRepetitionCell(
                                  cell.text,
                                  cell.style,
                                  row.fontSizePx,
                                  row.measuredTextWidthPx,
                                  pageState
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

            {/* 2. Alphabet Tracing Activity */}
            {pageState.activity === 'alphabet' && (
              <div className="relative z-10 space-y-4 pt-2 overflow-hidden">
                {pageState.language === 'ar' ? (
                  <div className="space-y-3">
                    {(pageState.alphabetScope === 'single'
                      ? ARABIC_ALPHABET_DATA.filter((x) => x.letter === pageState.singleSelectedLetter)
                      : ARABIC_ALPHABET_DATA.filter((x) => pageState.selectedLetters.includes(x.letter))
                    )
                      .slice(0, Math.max(1, Math.floor((layout.usableHeightPx - 16) / 115)))
                      .map((letterMeta) => (
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
                  <div className="space-y-4">
                    {(pageState.alphabetScope === 'single'
                      ? [pageState.singleSelectedLetter]
                      : pageState.selectedLetters
                    )
                      .slice(0, Math.max(1, Math.floor((layout.usableHeightPx - 16) / 64)))
                      .map((letter) => {
                        const displayText =
                          pageState.alphabetCase === 'upper'
                            ? letter.toUpperCase()
                            : pageState.alphabetCase === 'lower'
                            ? letter.toLowerCase()
                            : `${letter.toUpperCase()} ${letter.toLowerCase()}`;

                        return (
                          <div
                            key={letter}
                            className="flex items-center justify-around py-2 border-b border-slate-200/50"
                          >
                            <div className="w-16 text-center">
                              {renderLetterItem(
                                displayText,
                                'dotted',
                                true,
                                pageState,
                                layout.effectiveFontSizePx
                              )}
                            </div>
                            <div className="flex-1 flex items-center justify-around">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i}>
                                  {renderLetterItem(
                                    displayText,
                                    'dotted',
                                    false,
                                    pageState,
                                    layout.effectiveFontSizePx
                                  )}
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
            {pageState.activity === 'tracing_lines' && (
              <div className="relative z-10 space-y-3 pt-3 overflow-hidden">
                {Array.from({ length: maxFittingTracingLines }).map((_, i) => (
                  <TracingLineItem
                    key={i}
                    type={pageState.lineType}
                    difficulty={pageState.lineDifficulty}
                    strokeWidth={pageState.lineStrokeWidth}
                    dashSize={pageState.lineDashSize}
                    showStartEndPoint={pageState.showStartEndPoint}
                    showDirectionArrows={pageState.showDirectionArrows}
                    width={layout.paperWidthPx - 70}
                    height={48}
                    color="#334155"
                    isRtl={pageIsRtl}
                  />
                ))}
              </div>
            )}

            {/* 4. Shapes Tracing */}
            {pageState.activity === 'shapes' && (
              <div className="relative z-10 pt-3 overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {pageState.selectedShapes.map((shape) => (
                    <div
                      key={shape}
                      className="bg-white/70 p-3 rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-2xs"
                    >
                      <TracingShapeItem
                        shape={shape}
                        size={isA5Page ? 90 : 120}
                        style={pageState.shapeStyle}
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
    );
  };

  // Texte actif de la page sélectionnée
  const activeRawText = state.phraseInput;

  const handleActiveRawTextChange = (newVal: string) => {
    setActiveCustomSegments(null);
    updateState({
      phraseInput: newVal,
    });
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
            <ChevronRight
              className={`w-3.5 h-3.5 text-slate-400 ${isArabicGlobal ? 'rotate-180' : ''}`}
            />
            <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
              {isArabicGlobal
                ? 'مُوَلِّدُ أَوْرَاقِ الخَطِّ وَالتَّدْرِيب'
                : "Module Feuille d'Écriture & de Traçage"}
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

      {/* 2. Activity Type Selector Bar */}
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
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
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

      {/* 3. Main Studio Workspace */}
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
                    {state.activity === 'phrase_name' &&
                      (isArabicGlobal
                        ? `1. النص والتكرار المتدرج (صفحة ${safeActiveIndex + 1})`
                        : `1. Texte & Répétition (Page ${safeActiveIndex + 1}/${pages.length})`)}
                    {state.activity === 'alphabet' &&
                      (isArabicGlobal
                        ? `إعدادات الحروف الأبجدية (صفحة ${safeActiveIndex + 1})`
                        : `Alphabet & Lettres (Page ${safeActiveIndex + 1}/${pages.length})`)}
                    {state.activity === 'tracing_lines' &&
                      (isArabicGlobal
                        ? `أنماط الخطوط والمنحنيات (صفحة ${safeActiveIndex + 1})`
                        : `Lignes & Pré-écriture (Page ${safeActiveIndex + 1}/${pages.length})`)}
                    {state.activity === 'shapes' &&
                      (isArabicGlobal
                        ? `الأشكال الهندسية (صفحة ${safeActiveIndex + 1})`
                        : `Formes géométriques (Page ${safeActiveIndex + 1}/${pages.length})`)}
                  </h3>
                </div>

                {/* Target Language Toggle */}
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
                  {/* Saisie avec textarea multiligne, compteur de caractères et préservation intégrale */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        {isArabicGlobal
                          ? 'النص أو الفقرة المراد كتابتها :'
                          : 'Texte, prénom, phrase ou paragraphe :'}
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {activeRawText.length} car. • {activeRawText.split('\n').length} ligne(s)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCustomSegments(null);
                            updateState({
                              phraseInput: 'Lucas',
                              letterCase: 'original',
                              textAlignment: 'left',
                              strokeColor: 'blue',
                              strokeWidth: 1.25,
                              letterSpacingPx: 0,
                              wordSpacingPx: 0,
                              lineSpacingMultiplier: 1.0,
                              fontFamily: 'Courgette',
                              rulingType: 'seyes',
                              manualFontSizePx: null,
                              autoFontSize: true,
                            });
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-red-600 flex items-center gap-0.5 transition-colors cursor-pointer"
                          title="Réinitialiser les réglages du module Prénoms & Phrases"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Réinitialiser</span>
                        </button>
                      </div>
                    </div>
                    <textarea
                      dir={isRtl ? 'rtl' : 'ltr'}
                      rows={3}
                      value={activeRawText}
                      onChange={(e) => handleActiveRawTextChange(e.target.value)}
                      placeholder={
                        isRtl
                          ? 'اكتب هنا اسماً، كلمة، جملة أو نصاً كاملاً...'
                          : 'Saisissez un prénom, un mot, une phrase ou un paragraphe de plusieurs lignes...'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all resize-y custom-scrollbar"
                    />

                    {/* Exemples rapides organisés (Prénom, Mot, Phrase, Paragraphe) */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-bold shrink-0">Exemples :</span>
                        {(state.language === 'ar'
                          ? [
                              { label: 'اسم', val: 'أَحْمَدُ' },
                              { label: 'كلمة', val: 'مَدْرَسَةٌ' },
                              { label: 'جملة', val: 'العِلْمُ نُورٌ وَالجَهْلُ ظَلَامٌ.' },
                              { label: 'فقرة', val: 'أَنَا تِلْمِيذٌ مُجْتَهِدٌ فِي الصَّفِّ.\nأُحِبُّ القِرَاءَةَ وَأَكْتُبُ بِخَطٍّ جَمِيلٍ.' },
                            ]
                          : state.language === 'en'
                          ? [
                              { label: 'Name', val: 'Oliver' },
                              { label: 'Word', val: 'Beautiful' },
                              { label: 'Sentence', val: 'The quick brown fox jumps over the lazy dog.' },
                              { label: 'Paragraph', val: 'Today is a wonderful day to practice handwriting.\nKeep your back straight and hold your pen gently.' },
                            ]
                          : [
                              { label: 'Prénom', val: 'Lucas' },
                              { label: 'Mot', val: 'Papillon' },
                              { label: 'Phrase', val: "Aujourd'hui, je prépare ma feuille d'écriture avec soin." },
                              { label: 'Paragraphe', val: "Le petit chat dort paisiblement sur le fauteuil du salon.\nLe soleil réchauffe doucement la pièce." },
                            ]
                        ).map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => handleActiveRawTextChange(item.val)}
                            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 text-[11px] font-medium border border-slate-200/80 transition-colors"
                          >
                            <span className="font-bold text-slate-400 mr-1">{item.label} :</span>
                            <span className="truncate max-w-[140px] inline-block align-bottom">{item.val.split('\n')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Catégories de Personnalisation : Style, Casse, Alignement, Trait, Espacements */}
                  <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3.5">
                    {/* A. Style d'écriture & B. Type de lettres (Casse) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Style d'écriture :
                        </label>
                        <select
                          value={state.fontFamily}
                          onChange={(e) => updateState({ fontFamily: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:border-red-500 outline-none cursor-pointer"
                        >
                          {HANDWRITING_FONTS.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Type de lettres (Casse) :
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'original', label: 'Originale' },
                            { id: 'lowercase', label: 'minuscules' },
                            { id: 'uppercase', label: 'MAJUSCULES' },
                          ].map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => updateState({ letterCase: c.id as any })}
                              className={`py-1.5 px-1 rounded-lg border text-[10px] font-bold text-center transition-all cursor-pointer ${
                                state.letterCase === c.id
                                  ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs font-extrabold'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* E. Apparence du trait & F. Alignement */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/70">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Couleur du trait :
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'blue', label: 'Bleu', color: '#1d4ed8' },
                            { id: 'black', label: 'Noir', color: '#0f172a' },
                            { id: 'pencil_gray', label: 'Crayon', color: '#64748b' },
                          ].map((col) => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => updateState({ strokeColor: col.id as any })}
                              className={`py-1 px-1.5 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                state.strokeColor === col.id
                                  ? 'bg-white border-slate-400 text-slate-900 shadow-2xs ring-1 ring-slate-400'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: col.color }}
                              />
                              <span>{col.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Alignement du texte :
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'left', icon: AlignLeft, label: 'Gauche' },
                            { id: 'center', icon: AlignCenter, label: 'Centré' },
                            { id: 'right', icon: AlignRight, label: 'Droite' },
                          ].map((align) => {
                            const IconComponent = align.icon;
                            return (
                              <button
                                key={align.id}
                                type="button"
                                onClick={() => updateState({ textAlignment: align.id as any })}
                                className={`py-1 px-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                  state.textAlignment === align.id
                                    ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs font-extrabold'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <IconComponent className="w-3 h-3" />
                                <span>{align.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* D. Espacements & Épaisseur du trait (Section détaillée) */}
                    <div className="space-y-2 pt-1 border-t border-slate-200/70">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Réglages fins (Espacements & Épaisseur) :</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {/* Espacement des lettres */}
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>Lettres :</span>
                            <span className="text-red-700 font-extrabold">{state.letterSpacingPx}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={8}
                            step={1}
                            value={state.letterSpacingPx}
                            onChange={(e) => updateState({ letterSpacingPx: Number(e.target.value) })}
                            className="w-full accent-red-600 cursor-pointer"
                          />
                        </div>

                        {/* Espacement des mots */}
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>Mots :</span>
                            <span className="text-red-700 font-extrabold">{state.wordSpacingPx}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={16}
                            step={2}
                            value={state.wordSpacingPx}
                            onChange={(e) => updateState({ wordSpacingPx: Number(e.target.value) })}
                            className="w-full accent-red-600 cursor-pointer"
                          />
                        </div>

                        {/* Épaisseur du trait */}
                        <div className="bg-white p-2 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                            <span>Trait :</span>
                            <span className="text-red-700 font-extrabold">{state.strokeWidth}px</span>
                          </div>
                          <input
                            type="range"
                            min={0.75}
                            max={2.5}
                            step={0.25}
                            value={state.strokeWidth}
                            onChange={(e) => updateState({ strokeWidth: Number(e.target.value) })}
                            className="w-full accent-red-600 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur pédagogique discret et professionnel */}
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50/90 rounded-xl border border-slate-200/80 text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Répétitions par rangée :</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[11px] font-black">
                        {activeLayout.rows.find((r) => r.type === 'traced')?.repetitionsCount || 1} ×
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">
                        Dégradé progressif
                      </span>
                    </div>
                  </div>

                  {/* SPEC 5 : Texte trop long -> Lignes multiples éditables (découpage mots entiers) */}
                  <div className="border-t border-slate-100 pt-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 block">
                          Rangées de texte ({currentEditableSegments.length}{' '}
                          {currentEditableSegments.length > 1
                            ? 'rangées découpées par mots entiers'
                            : 'rangée unique'}
                          )
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Chaque rangée est modifiable, déplaçable ou remplaçable indépendamment.
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {activeCustomSegments && (
                          <button
                            type="button"
                            onClick={() => setActiveCustomSegments(null)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center gap-1"
                            title="Réinitialiser le découpage automatique"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Auto</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddSegment}
                          className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Rangée</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {currentEditableSegments.map((seg, idx) => (
                        <div
                          key={seg.id}
                          className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200"
                        >
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-600 flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            dir={isRtl ? 'rtl' : 'ltr'}
                            value={seg.text}
                            onChange={(e) => handleUpdateSegmentText(seg.id, e.target.value)}
                            className="flex-1 min-w-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:border-red-500 outline-none"
                          />
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveSegment(idx, -1)}
                            className="p-1 rounded hover:bg-white text-slate-500 disabled:opacity-30"
                            title="Monter la rangée"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentEditableSegments.length - 1}
                            onClick={() => handleMoveSegment(idx, 1)}
                            className="p-1 rounded hover:bg-white text-slate-500 disabled:opacity-30"
                            title="Descendre la rangée"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {currentEditableSegments.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSegment(seg.id)}
                              className="p-1 rounded hover:bg-red-50 text-red-500"
                              title="Supprimer cette rangée"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Alerte de dépassement -> Proposition automatique d'une nouvelle page */}
                    {activeLayout.hasOverflowForNextPage && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3">
                        <div className="flex items-start gap-2 text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-extrabold">
                              Nombre maximal de rangées atteint ({activeLayout.maxTracedSlotsOnPage}{' '}
                              rangées tracées/page)
                            </div>
                            <div className="text-[11px] text-amber-800">
                              {activeLayout.overflowSegments.length} rangée(s) supplémentaire(s)
                              détectée(s). Basculez l'excédent sur une nouvelle page.
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOverflowToSecondPage}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shrink-0 cursor-pointer shadow-2xs"
                        >
                          Créer Page {safeActiveIndex + 2}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ACTIVITY 2: Alphabet Tracing Controls */}
              {state.activity === 'alphabet' && (
                <div className="space-y-4">
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

                  {state.language === 'ar' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isArabicGlobal
                          ? 'أشكال الحروف العربية بالسياق :'
                          : 'Formes contextuelles arabes :'}
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

              {/* ACTIVITY 3: Tracing Lines */}
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
                </div>
              )}

              {/* ACTIVITY 4: Shapes Tracing */}
              {state.activity === 'shapes' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isArabicGlobal
                        ? 'اختر الأشكال المراد تضمينها :'
                        : 'Formes géométriques à inclure :'}
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
                </div>
              )}
            </div>

            {/* Box 2: SPEC 3 & SPEC 4 — Niveau de classe, Police Automatique & Motif d'alternance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  2. Niveau de Classe, Police Auto & Alternance
                </h3>
              </div>

              {/* Niveau de classe */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Niveau de classe (définit la police idéale et minimale) :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(GRADE_TYPOGRAPHY_PRESETS) as SchoolGradeLevel[]).map((lvlKey) => {
                    const preset = GRADE_TYPOGRAPHY_PRESETS[lvlKey];
                    const isSelected = state.gradeLevel === lvlKey;
                    return (
                      <button
                        key={lvlKey}
                        type="button"
                        onClick={() => handleSelectGradeLevel(lvlKey)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-extrabold truncate">{preset.label}</div>
                        <div className="text-[10px] text-slate-500">
                          Idéal {preset.idealFontSizePx}px • Min {preset.minFontSizePx}px
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Taille de police automatique + Curseur manuel optionnel */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>
                      Taille actuelle :{' '}
                      <strong className="text-red-700">{activeLayout.effectiveFontSizePx}px</strong>{' '}
                      ({state.manualFontSizePx ? 'Manuelle' : 'Automatique'})
                    </span>
                  </div>
                  {state.manualFontSizePx !== null && (
                    <button
                      type="button"
                      onClick={() => updateState({ manualFontSizePx: null, autoFontSize: true })}
                      className="text-[10px] font-extrabold text-red-600 hover:underline cursor-pointer"
                    >
                      Réactiver Auto
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 shrink-0">
                    Curseur manuel :
                  </span>
                  <input
                    type="range"
                    min={14}
                    max={48}
                    step={1}
                    value={state.manualFontSizePx ?? activeLayout.effectiveFontSizePx}
                    onChange={(e) =>
                      updateState({
                        manualFontSizePx: Number(e.target.value),
                        autoFontSize: false,
                      })
                    }
                    className="flex-1 accent-red-600 cursor-pointer"
                  />
                  <span className="text-xs font-extrabold text-slate-700 w-10 text-right">
                    {state.manualFontSizePx ?? activeLayout.effectiveFontSizePx}px
                  </span>
                </div>
              </div>

              {/* SPEC 3 : Motif d'alternance Lignes Tracées / Lignes Libres */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Motif d'alternance (Rangées tracées / Rangées libres) :
                  </label>
                  <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-md border border-indigo-200">
                    {activeLayout.completePatternsCount} motifs entiers ({activeLayout.totalRowsOnPage}{' '}
                    rangées)
                  </span>
                </div>

                {/* Presets rapides de motif */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { traced: 3, free: 1, label: '3 tracées + 1 libre' },
                    { traced: 2, free: 1, label: '2 tracées + 1 libre' },
                    { traced: 1, free: 1, label: '1 tracée + 1 libre' },
                  ].map((pat) => {
                    const isSelected =
                      state.alternationPattern.tracedRowsCount === pat.traced &&
                      state.alternationPattern.freeRowsCount === pat.free;
                    return (
                      <button
                        key={pat.label}
                        type="button"
                        onClick={() =>
                          updateState({
                            alternationPattern: {
                              tracedRowsCount: pat.traced,
                              freeRowsCount: pat.free,
                            },
                          })
                        }
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Rangées tracées par motif :
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={state.alternationPattern.tracedRowsCount}
                      onChange={(e) =>
                        updateState({
                          alternationPattern: {
                            ...state.alternationPattern,
                            tracedRowsCount: Math.max(1, Math.min(6, Number(e.target.value))),
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Rangées libres (réglure seule) :
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={state.alternationPattern.freeRowsCount}
                      onChange={(e) =>
                        updateState({
                          alternationPattern: {
                            ...state.alternationPattern,
                            freeRowsCount: Math.max(0, Math.min(4, Number(e.target.value))),
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Interligne entre les lignes */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                    <span>Interligne entre les lignes :</span>
                    <span className="text-red-700 font-extrabold">{Math.round((state.lineSpacingMultiplier || 1.0) * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0.85}
                      max={1.6}
                      step={0.05}
                      value={state.lineSpacingMultiplier || 1.0}
                      onChange={(e) =>
                        updateState({
                          lineSpacingMultiplier: Number(e.target.value),
                        })
                      }
                      className="flex-1 accent-red-600 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => updateState({ lineSpacingMultiplier: 1.0 })}
                      className="text-[10px] text-slate-400 hover:text-slate-700 font-bold"
                    >
                      Défaut
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Lignage & Format Papier (A4 / A5 avec assemblage 2xA5 sur A4) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  3. Réglure du Cahier & Format Papier (A4 / A5)
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'blank' as PedagogicalRulingType,
                    label: 'Fond blanc',
                    desc: 'Sans réglure (libre)',
                  },
                  {
                    id: 'simple' as PedagogicalRulingType,
                    label: 'Lignes simples',
                    desc: 'Lignes régulières',
                  },
                  {
                    id: 'grid' as PedagogicalRulingType,
                    label: 'Quadrillage',
                    desc: 'Petits carreaux 5mm',
                  },
                  {
                    id: 'seyes' as PedagogicalRulingType,
                    label: 'Réglure Seyès',
                    desc: 'Grands carreaux 8mm',
                  },
                  {
                    id: 'beginner_color' as PedagogicalRulingType,
                    label: 'Ciel / Herbe / Terre',
                    desc: 'Maternelle & CP',
                  },
                  {
                    id: 'three_lines' as PedagogicalRulingType,
                    label: '3 Lignes',
                    desc: 'Médiane pointillée',
                  },
                  {
                    id: 'four_lines' as PedagogicalRulingType,
                    label: '4 Lignes',
                    desc: 'Ascendantes/Desc.',
                  },
                  {
                    id: 'double_line' as PedagogicalRulingType,
                    label: 'Double ligne',
                    desc: 'Maternelle',
                  },
                  {
                    id: 'arabic_school' as PedagogicalRulingType,
                    label: 'Calligraphie Arabe',
                    desc: 'Ligne de base forte',
                  },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => updateState({ rulingType: r.id })}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
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

              {/* Format Papier (A4 / A5) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Format du papier :
                  </label>
                  <select
                    value={state.paperFormat}
                    onChange={(e) => {
                      const nextFmt = e.target.value as 'A4' | 'Letter' | 'A5';
                      updateState({ paperFormat: nextFmt });
                      if (nextFmt !== 'A5') {
                        setShowA4AssemblyPreview(false);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="A5">A5 (148 × 210 mm — 2×A5 sur A4)</option>
                    <option value="Letter">US Letter (216 × 279 mm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Échelle de la réglure :
                  </label>
                  <select
                    value={state.rulingScale}
                    onChange={(e) => updateState({ rulingScale: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value={1.0}>Standard (100%)</option>
                    <option value={1.15}>Agrandie (115% — Recommandé CP)</option>
                    <option value={1.25}>Grande (125% — Maternelle GS)</option>
                    <option value={1.35}>Très grande (135% — Maternelle PS/MS)</option>
                  </select>
                </div>
              </div>

              {/* SPEC 6 : Options d'assemblage A5 sur feuille A4 */}
              {state.paperFormat === 'A5' && (
                <div className="p-3.5 rounded-xl bg-indigo-50/90 border border-indigo-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-950">
                      <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Assemblage automatique de 2 pages A5 sur 1 feuille A4</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        id: 'left_right' as A5AssemblyOrientation,
                        label: 'Gauche / Droite',
                        desc: '2 A5 Portrait côte à côte (A4 Paysage)',
                      },
                      {
                        id: 'top_bottom' as A5AssemblyOrientation,
                        label: 'Haut / Bas',
                        desc: '2 A5 Paysage superposés (A4 Portrait)',
                      },
                    ].map((ori) => {
                      const isSel = state.a5Assembly.orientation === ori.id;
                      return (
                        <button
                          key={ori.id}
                          type="button"
                          onClick={() =>
                            updateState({
                              a5Assembly: { ...state.a5Assembly, orientation: ori.id },
                            })
                          }
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSel
                              ? 'bg-white border-indigo-400 text-indigo-950 shadow-2xs font-bold'
                              : 'bg-indigo-100/50 border-indigo-200 text-indigo-800 hover:bg-white'
                          }`}
                        >
                          <div className="text-xs font-extrabold">{ori.label}</div>
                          <div className="text-[10px] opacity-80">{ori.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowA4AssemblyPreview((prev) => !prev)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                  >
                    {showA4AssemblyPreview
                      ? 'Revenir à l’aperçu A5 individuel (148 × 210 mm)'
                      : 'Aperçu de l’assemblage final sur A4 avant impression'}
                  </button>
                </div>
              )}
            </div>

            {/* Box 4: En-tête à hauteur fixe */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">
                  4. Bloc d'En-tête à Hauteur Fixe (Solidaire)
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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
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
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Texte Logo :
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        value={state.headerLogoText}
                        onChange={(e) => updateState({ headerLogoText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-4 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.headerStudentName}
                        onChange={(e) => updateState({ headerStudentName: e.target.checked })}
                        className="rounded text-red-600"
                      />
                      <span>Champ Nom</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.headerDate}
                        onChange={(e) => updateState({ headerDate: e.target.checked })}
                        className="rounded text-red-600"
                      />
                      <span>Champ Date</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.headerShowLogo}
                        onChange={(e) => updateState({ headerShowLogo: e.target.checked })}
                        className="rounded text-red-600"
                      />
                      <span>Logo École</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Paper Sheet Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Unified Professional Studio Control Bar (Pages, Zoom, Orientation & Export sans répétition) */}
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              {/* 1. Sélecteur de page & pagination épuré */}
              <div className="flex items-center gap-1.5 min-w-0">
                <button
                  type="button"
                  disabled={safeActiveIndex === 0}
                  onClick={() => handleSelectPage(safeActiveIndex - 1)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  title="Page précédente"
                >
                  <ChevronLeft className={`w-3.5 h-3.5 ${isArabicGlobal ? 'rotate-180' : ''}`} />
                </button>

                {/* Onglets compacts de pages */}
                <div className="flex items-center gap-1 overflow-x-auto py-0.5 px-0.5 custom-scrollbar max-w-[280px] sm:max-w-[340px]">
                  {pages.map((pItem, idx) => {
                    const isSelected = safeActiveIndex === idx;
                    const pageTitle =
                      pItem.activity === 'phrase_name'
                        ? pItem.phraseInput?.trim() || 'Sans titre'
                        : pItem.activity === 'alphabet'
                        ? `Lettre ${pItem.singleSelectedLetter}`
                        : pItem.activity === 'tracing_lines'
                        ? 'Lignes'
                        : 'Formes';

                    return (
                      <button
                        key={pItem.pageId}
                        type="button"
                        onClick={() => handleSelectPage(idx)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-2xs font-extrabold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={`Page ${idx + 1} : ${pageTitle}`}
                      >
                        <span>P.{idx + 1}</span>
                        <span
                          className={`text-[10px] max-w-[70px] truncate ${
                            isSelected ? 'text-red-100' : 'text-slate-400'
                          }`}
                        >
                          {pageTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={safeActiveIndex >= pages.length - 1}
                  onClick={() => handleSelectPage(safeActiveIndex + 1)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  title="Page suivante"
                >
                  <ChevronRight className={`w-3.5 h-3.5 ${isArabicGlobal ? 'rotate-180' : ''}`} />
                </button>

                {/* Actions sur les pages : + Page, Dupliquer, Supprimer */}
                <div className="flex items-center gap-1 pl-1 border-l border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={handleAddPage}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold transition-all cursor-pointer"
                    title="Ajouter une page"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Page</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicatePage(safeActiveIndex)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                    title="Dupliquer la page active"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {pages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeletePage(safeActiveIndex)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all cursor-pointer"
                      title="Supprimer la page active"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Contrôles centraux : Zoom & Orientation */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Zoom compact */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => updateState({ zoom: Math.max(50, state.zoom - 10) })}
                    className="p-1 rounded hover:bg-white text-slate-600 transition-all"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-3 h-3" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-700 px-1 w-9 text-center">
                    {state.zoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() => updateState({ zoom: Math.min(140, state.zoom + 10) })}
                    className="p-1 rounded hover:bg-white text-slate-600 transition-all"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </button>
                </div>

                {/* Orientation / Assemblage A5 */}
                {state.paperFormat === 'A5' ? (
                  <div className="flex items-center bg-indigo-50 rounded-lg p-0.5 border border-indigo-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setShowA4AssemblyPreview(false)}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        !showA4AssemblyPreview
                          ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                          : 'text-indigo-600 hover:text-indigo-900'
                      }`}
                    >
                      A5 Seule
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowA4AssemblyPreview(true)}
                      className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                        showA4AssemblyPreview
                          ? 'bg-indigo-600 text-white shadow-2xs font-extrabold'
                          : 'text-indigo-600 hover:text-indigo-900'
                      }`}
                    >
                      2×A5 sur A4
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200/80 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => updateState({ orientation: 'portrait' })}
                      className={`px-2 py-0.5 rounded-md transition-all ${
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
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        state.orientation === 'landscape'
                          ? 'bg-white text-red-600 shadow-2xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paysage
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Boutons d'export épurés (Imprimer, PNG, PDF) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  title="Imprimer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Imprimer</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  title="Télécharger en PNG 300 DPI"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  title="Télécharger le PDF haute résolution"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isExporting
                      ? '...'
                      : pages.length > 1
                      ? `PDF (${pages.length} p.)`
                      : 'PDF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Paper Sheet Viewport */}
            <div className="bg-slate-200/70 p-4 sm:p-8 rounded-2xl border border-slate-300/80 overflow-auto flex items-start justify-center min-h-[680px] custom-scrollbar shadow-inner">
              {(() => {
                const isAssembled = state.paperFormat === 'A5' && showA4AssemblyPreview;
                const rawSheetW = isAssembled
                  ? Math.round(assembledA4DimensionsMm.widthMm * 3.78)
                  : activeLayout.paperWidthPx;
                const rawSheetH = isAssembled
                  ? Math.round(assembledA4DimensionsMm.heightMm * 3.78)
                  : activeLayout.paperHeightPx;
                const scaleFactor = (state.zoom / 100) * 0.8;
                const scaledSheetW = Math.round(rawSheetW * scaleFactor);
                const scaledSheetH = Math.round(rawSheetH * scaleFactor);

                return (
                  <div
                    style={{
                      width: `${scaledSheetW}px`,
                      height: `${scaledSheetH}px`,
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: `${rawSheetW}px`,
                        height: `${rawSheetH}px`,
                        transform: `scale(${scaleFactor})`,
                        transformOrigin: 'top left',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        transition: 'transform 0.15s ease-out',
                      }}
                    >
                      {/* CAS 1 : Assemblage de 2 pages A5 indépendantes sur 1 seule feuille A4 (Gauche/Droite ou Haut/Bas) */}
                      {isAssembled ? (
                        <div
                          ref={paperSheetRef}
                          id="printable-paper-sheet"
                          className={`bg-white shadow-2xl relative flex ${
                            state.a5Assembly.orientation === 'left_right'
                              ? 'flex-row'
                              : 'flex-col'
                          }`}
                          style={{
                            width: `${rawSheetW}px`,
                            height: `${rawSheetH}px`,
                          }}
                        >
                          {/* Demi-feuille A5 n°1 */}
                          <div className="relative flex-1 overflow-hidden">
                            {renderSingleWorksheetPage(
                              page1Layout,
                              safeActiveIndex + 1,
                              `${state.headerTitle} (A5 - ${safeActiveIndex + 1})`,
                              state,
                              1
                            )}
                          </div>

                          {/* Ligne de coupe centrale A4 -> 2xA5 */}
                          {state.a5Assembly.showCutLine && (
                            <div
                              className={
                                state.a5Assembly.orientation === 'left_right'
                                  ? 'w-0 border-l-2 border-dashed border-slate-400 relative z-30'
                                  : 'h-0 border-t-2 border-dashed border-slate-400 relative z-30'
                              }
                            />
                          )}

                          {/* Demi-feuille A5 n°2 (contenu indépendant) */}
                          <div className="relative flex-1 overflow-hidden">
                            {renderSingleWorksheetPage(
                              page2Layout,
                              companionPageIndex + 1,
                              `${companionPageState.headerTitle} (A5 - ${companionPageIndex + 1})`,
                              companionPageState,
                              2
                            )}
                          </div>
                        </div>
                      ) : (
                        /* CAS 2 : Page individuelle aux proportions exactes (A4, Letter, ou A5 natif 148x210mm) */
                        <div
                          ref={paperSheetRef}
                          id="printable-paper-sheet"
                          className="shadow-2xl bg-white"
                          style={{
                            width: `${rawSheetW}px`,
                            height: `${rawSheetH}px`,
                          }}
                        >
                          {renderSingleWorksheetPage(
                            activeLayout,
                            safeActiveIndex + 1,
                            state.headerTitle,
                            state,
                            1
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Conteneur hors-écran pour l'export PDF multi-pages (quand plusieurs pages ont été créées) */}
            {pages.length > 1 && (
              <div
                aria-hidden="true"
                style={{
                  position: 'fixed',
                  left: '-10000px',
                  top: 0,
                  pointerEvents: 'none',
                  opacity: 0,
                }}
              >
                {pages.map((pItem, idx) => {
                  const pLayout = allPageLayouts[idx] || activeLayout;
                  return (
                    <div
                      key={pItem.pageId}
                      ref={(el) => {
                        multiPagePrintRefs.current[idx] = el;
                      }}
                      style={{
                        width: `${pLayout.paperWidthPx}px`,
                        height: `${pLayout.paperHeightPx}px`,
                        background: '#ffffff',
                      }}
                    >
                      {renderSingleWorksheetPage(
                        pLayout,
                        idx + 1,
                        pItem.headerTitle,
                        pItem,
                        null
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
