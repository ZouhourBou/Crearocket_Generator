import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language } from '../../types';
import {
  MathWorksheetState,
  MathOperationType,
  MathLevel,
  MathOrientation,
  AnswerBoxStyle,
  MathProblem,
} from '../../types/math';
import { generateMathWorksheetProblems } from '../../utils/mathGenerator';
import { MathProblemCard } from './MathProblemCard';
import { exportToPdf, exportToPng, printDirect } from '../../utils/exportUtils';
import {
  Plus,
  Minus,
  X as Multiply,
  Divide,
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
  CheckCheck,
  Settings2,
  Sliders,
  Layers,
} from 'lucide-react';

const INITIAL_MATH_STATE: MathWorksheetState = {
  operationType: 'addition',
  level: 'basic',
  orientation: 'horizontal',
  exerciseCount: 20,
  columnsCount: 3,
  spacing: 'normal',
  showExerciseNumbers: true,
  numberingStyle: '1)',
  answerBoxStyle: 'dashed_line',

  minNumber: 1,
  maxNumber: 50,
  digitCount: 2,
  allowDecimals: false,
  decimalPlaces: 1,

  additionTermsCount: 2,
  allowRegroupingAddition: false, // Default: without carry (très demandé par les profs)

  allowRegroupingSubtraction: false, // Default: without borrow
  allowNegativeResult: false,

  multiplicationTables: [2, 3, 4, 5, 10],
  customTablesOnly: false,

  exactDivisionOnly: true,
  divisionStyle: 'european_french',

  paperFormat: 'A4',
  paperOrientation: 'portrait',
  showHeader: true,
  headerTitle: 'Fiche d\'Entraînement Calcul',
  headerSubtitle: 'Additions sans retenue',
  showStudentName: true,
  showDate: true,
  showGradeScore: true,
  scoreMax: 20,

  showAnswerKeyOnSheet: false,
  activePreviewTab: 'exercises',
  zoom: 100,
};

interface MathWorksheetPageProps {
  language: Language;
  onNavigate: (route: string) => void;
}

export const MathWorksheetPage: React.FC<MathWorksheetPageProps> = ({
  language: globalLang,
  onNavigate,
}) => {
  const isArabicGlobal = globalLang === 'ar';
  const [state, setState] = useState<MathWorksheetState>({
    ...INITIAL_MATH_STATE,
    headerTitle:
      globalLang === 'ar'
        ? 'بِطَاقَةُ الحِسَابِ وَالعَمَلِيَّات'
        : globalLang === 'en'
        ? 'Math Operations Practice Sheet'
        : 'Fiche d\'Entraînement au Calcul',
    headerSubtitle:
      globalLang === 'ar'
        ? 'تَمَارِينُ الجَمْعِ دُونَ احْتِفَاظ'
        : globalLang === 'en'
        ? 'Addition without regrouping'
        : 'Additions sans retenue',
  });

  // Generated problems stored in state
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const paperSheetRef = useRef<HTMLDivElement>(null);

  // Regenerate problems whenever relevant parameters change
  const refreshProblems = (currentState: MathWorksheetState) => {
    const list = generateMathWorksheetProblems(currentState);
    setProblems(list);
  };

  useEffect(() => {
    refreshProblems(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.operationType,
    state.level,
    state.exerciseCount,
    state.minNumber,
    state.maxNumber,
    state.allowRegroupingAddition,
    state.allowRegroupingSubtraction,
    state.exactDivisionOnly,
    state.customTablesOnly,
    state.multiplicationTables,
    state.allowDecimals,
  ]);

  const updateState = (updates: Partial<MathWorksheetState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  };

  // Dimensions
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
    if (state.paperOrientation === 'landscape') {
      return { widthMm: h, heightMm: w };
    }
    return { widthMm: w, heightMm: h };
  }, [state.paperFormat, state.paperOrientation]);

  const paperWidthPx = Math.round(paperDimensionsMm.widthMm * 3.78);
  const paperHeightPx = Math.round(paperDimensionsMm.heightMm * 3.78);

  const handleExportPdf = async () => {
    if (!paperSheetRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await exportToPdf(
        paperSheetRef.current,
        paperDimensionsMm,
        `fiche-maths-${state.operationType}-${state.activePreviewTab}.pdf`
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
        `fiche-maths-${state.operationType}-300dpi.png`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const operations = [
    {
      id: 'addition' as MathOperationType,
      label: isArabicGlobal ? 'الجمع' : 'Addition',
      desc: isArabicGlobal ? 'مع أو دون احتفاظ' : 'Avec ou sans retenue',
      icon: <Plus className="w-4 h-4" />,
    },
    {
      id: 'subtraction' as MathOperationType,
      label: isArabicGlobal ? 'الطرح' : 'Soustraction',
      desc: isArabicGlobal ? 'مع أو دون استلاف' : 'Sans emprunt / Avec emprunt',
      icon: <Minus className="w-4 h-4" />,
    },
    {
      id: 'multiplication' as MathOperationType,
      label: isArabicGlobal ? 'الضرب' : 'Multiplication',
      desc: isArabicGlobal ? 'جداول 1-12 أو أرقام متعددة' : 'Tables 1 à 12 & posées',
      icon: <Multiply className="w-4 h-4" />,
    },
    {
      id: 'division' as MathOperationType,
      label: isArabicGlobal ? 'القسمة' : 'Division',
      desc: isArabicGlobal ? 'قسمة مضبوطة أو مع باقٍ' : 'Exacte ou avec reste',
      icon: <Divide className="w-4 h-4" />,
    },
    {
      id: 'mixed' as MathOperationType,
      label: isArabicGlobal ? 'عمليات مختلطة' : 'Opérations Mixtes',
      desc: isArabicGlobal ? 'اختبار شامل للعمليات' : '+, −, ×, ÷ combinées',
      icon: <Shuffle className="w-4 h-4" />,
    },
  ];

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
              {isArabicGlobal ? 'مُوَلِّدُ التَّمَارِينِ الرِّيَاضِيَّة' : 'Générateur de Fiches de Mathématiques'}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refreshProblems(state)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer shadow-2xs"
              title="Générer de nouveaux calculs avec les mêmes paramètres"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isArabicGlobal ? 'توليد أرقام جديدة' : 'Nouvelle série'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isArabicGlobal ? 'rotate-180' : ''}`} />
              <span>{isArabicGlobal ? 'الكتالوج' : 'Catalogue'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Operations Selector Bar (5 buttons) */}
      <div className="bg-white border-b border-slate-200/80 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {operations.map((op) => {
              const isActive = state.operationType === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => updateState({ operationType: op.id })}
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
                    {op.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{op.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{op.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Controls & Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Box 1: Difficulty & Specific Mathematical Rules */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {isArabicGlobal ? 'قواعد العملية الحسابية' : 'Règles Mathématiques & Niveau'}
                  </h3>
                </div>

                {/* Level Toggle: Basic vs Advanced */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-bold">
                  {(['basic', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updateState({ level: lvl })}
                      className={`px-3 py-1 rounded-md transition-all capitalize ${
                        state.level === lvl
                          ? 'bg-white text-red-600 shadow-2xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl === 'basic' ? (isArabicGlobal ? 'مستوى 1' : 'Niveau 1') : (isArabicGlobal ? 'مستوى 2' : 'Avancé')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valeur Min :
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={state.minNumber}
                    onChange={(e) => updateState({ minNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Valeur Max :
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={9999}
                    value={state.maxNumber}
                    onChange={(e) => updateState({ maxNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Specific Operation Controls */}
              {state.operationType === 'addition' && (
                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={state.allowRegroupingAddition}
                      onChange={(e) => updateState({ allowRegroupingAddition: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Autoriser la retenue (Avec retenue)</span>
                  </label>
                  {!state.allowRegroupingAddition && (
                    <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      ✓ Additions garanties STRICTEMENT sans retenue (CP/CE1)
                    </div>
                  )}

                  {state.level === 'advanced' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre de termes à additionner :
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[2, 3, 4].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => updateState({ additionTermsCount: t as any })}
                            className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                              state.additionTermsCount === t
                                ? 'bg-red-50 border-red-300 text-red-900 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {t} termes
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {state.operationType === 'subtraction' && (
                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={state.allowRegroupingSubtraction}
                      onChange={(e) => updateState({ allowRegroupingSubtraction: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Autoriser l'emprunt (Avec retenue / emprunt)</span>
                  </label>
                  {!state.allowRegroupingSubtraction && (
                    <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      ✓ Soustractions garanties STRICTEMENT sans emprunt
                    </div>
                  )}
                </div>
              )}

              {state.operationType === 'multiplication' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Tables de multiplication (1 à 12) :
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateState({
                          multiplicationTables:
                            state.multiplicationTables.length === 12
                              ? [2, 3, 5]
                              : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                          customTablesOnly: true,
                        })
                      }
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      {state.multiplicationTables.length === 12 ? 'Réinitialiser' : 'Tout cocher'}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const tableNum = i + 1;
                      const isChecked = state.multiplicationTables.includes(tableNum);
                      return (
                        <button
                          key={tableNum}
                          type="button"
                          onClick={() => {
                            const next = isChecked
                              ? state.multiplicationTables.filter((t) => t !== tableNum)
                              : [...state.multiplicationTables, tableNum];
                            updateState({
                              multiplicationTables: next.length > 0 ? next : [2],
                              customTablesOnly: true,
                            });
                          }}
                          className={`p-2 rounded-lg border text-xs font-bold text-center transition-all ${
                            isChecked
                              ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          ×{tableNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {state.operationType === 'division' && (
                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={state.exactDivisionOnly}
                      onChange={(e) => updateState({ exactDivisionOnly: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500"
                    />
                    <span>Divisions exactes uniquement (Sans reste, reste = 0)</span>
                  </label>
                  {!state.exactDivisionOnly && (
                    <div className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                      ℹ Calculs avec quotient et reste (ex: 27 ÷ 4 = 6 R 3)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Box 2: Disposition, Columns & Answer boxes */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-red-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  {isArabicGlobal ? 'التنسيق والتخطيط' : 'Disposition & Présentation'}
                </h3>
              </div>

              {/* Orientation: Horizontale vs Verticale posée */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Orientation des opérations :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateState({ orientation: 'horizontal' })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      state.orientation === 'horizontal'
                        ? 'bg-red-50 border-red-300 text-red-900 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">Horizontale en ligne</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">25 + 13 = [ ]</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateState({ orientation: 'vertical' })}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      state.orientation === 'vertical'
                        ? 'bg-red-50 border-red-300 text-red-900 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs font-bold">Opération posée</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Alignée par colonnes</div>
                  </button>
                </div>
              </div>

              {/* Count & Columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre d'exercices :
                  </label>
                  <select
                    value={state.exerciseCount}
                    onChange={(e) => updateState({ exerciseCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value={8}>8 exercices</option>
                    <option value={12}>12 exercices</option>
                    <option value={16}>16 exercices</option>
                    <option value={20}>20 exercices (Recommandé)</option>
                    <option value={24}>24 exercices</option>
                    <option value={30}>30 exercices</option>
                    <option value={36}>36 exercices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre de colonnes :
                  </label>
                  <select
                    value={state.columnsCount}
                    onChange={(e) => updateState({ columnsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value={1}>1 colonne</option>
                    <option value={2}>2 colonnes</option>
                    <option value={3}>3 colonnes</option>
                    <option value={4}>4 colonnes</option>
                    <option value={5}>5 colonnes</option>
                  </select>
                </div>
              </div>

              {/* Box style & Numbering */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Zone de réponse :
                  </label>
                  <select
                    value={state.answerBoxStyle}
                    onChange={(e) => updateState({ answerBoxStyle: e.target.value as AnswerBoxStyle })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="dashed_line">Ligne pointillée (___)</option>
                    <option value="solid_box">Boîte rectangulaire [ ]</option>
                    <option value="grid_box">Quadrillage par chiffre</option>
                    <option value="none">Espace libre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numérotation :
                  </label>
                  <select
                    value={state.numberingStyle}
                    onChange={(e) => updateState({ numberingStyle: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="1)">1), 2), 3)...</option>
                    <option value="1.">1., 2., 3....</option>
                    <option value="A)">A), B), C)...</option>
                    <option value="#1">#1, #2, #3...</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Box 3: Header & Scoring */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">
                  {isArabicGlobal ? 'معلومات الرأس والتقييم' : 'En-tête & Évaluation'}
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
                      Titre principal :
                    </label>
                    <input
                      type="text"
                      value={state.headerTitle}
                      onChange={(e) => updateState({ headerTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.showGradeScore}
                        onChange={(e) => updateState({ showGradeScore: e.target.checked })}
                        className="rounded text-red-600"
                      />
                      <span>Zone Score / Note (sur 20)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Realistic Live Paper Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Preview Action Bar */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3 flex-wrap">
              {/* Sheet Switcher (Exercices vs Corrigé) */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => updateState({ activePreviewTab: 'exercises' })}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    state.activePreviewTab === 'exercises'
                      ? 'bg-white text-slate-900 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileQuestion className="w-3.5 h-3.5 text-red-600" />
                  <span>Fiche Élève (Page 1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateState({ activePreviewTab: 'answers' })}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    state.activePreviewTab === 'answers'
                      ? 'bg-emerald-600 text-white shadow-2xs font-black'
                      : 'text-emerald-700 hover:text-emerald-800'
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Corrigé / Solutions (Page 2)</span>
                </button>
              </div>

              {/* Zoom & Export Actions */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => updateState({ zoom: Math.max(50, state.zoom - 10) })}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-700 px-1 w-9 text-center">
                    {state.zoom}%
                  </span>
                  <button
                    type="button"
                    onClick={() => updateState({ zoom: Math.min(150, state.zoom + 10) })}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-700"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

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
                  title="Exporter en image"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50"
                  title="Télécharger le fichier PDF prêt à imprimer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Prêt</span>
                </button>
              </div>
            </div>

            {/* Paper Preview viewport */}
            <div className="bg-slate-200/70 p-4 sm:p-8 rounded-2xl border border-slate-300/80 overflow-auto flex items-center justify-center min-h-[640px] custom-scrollbar shadow-inner">
              <div
                style={{
                  transform: `scale(${state.zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {/* THE AUTHENTIC PRINTABLE PAPER SHEET */}
                <div
                  ref={paperSheetRef}
                  id="printable-paper-sheet"
                  className="bg-white text-slate-900 shadow-2xl relative transition-all overflow-hidden flex flex-col justify-between"
                  style={{
                    width: `${paperWidthPx}px`,
                    height: `${paperHeightPx}px`,
                    padding: '28px 32px',
                  }}
                >
                  {/* Top Header */}
                  <div>
                    {state.showHeader && (
                      <div className="border-b-2 border-slate-800 pb-3 mb-6 flex items-end justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">
                              {state.headerTitle}
                            </h1>
                            {state.activePreviewTab === 'answers' && (
                              <span className="bg-emerald-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                Corrigé officiel
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-600 mt-0.5">
                            {state.headerSubtitle || 'Fiche d\'activités imprimable'}
                          </p>
                        </div>

                        {/* Student meta fields */}
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-800">
                          {state.showStudentName && (
                            <div className="flex items-center gap-1.5">
                              <span>Nom :</span>
                              <span className="w-32 border-b-2 border-slate-400 inline-block h-4" />
                            </div>
                          )}
                          {state.showDate && (
                            <div className="flex items-center gap-1.5">
                              <span>Date :</span>
                              <span className="w-20 border-b-2 border-slate-400 inline-block h-4" />
                            </div>
                          )}
                          {state.showGradeScore && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md border border-slate-300">
                              <span>Score :</span>
                              <span className="font-mono font-black text-red-600">___ / {state.scoreMax}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Exercises Grid */}
                    <div
                      className="grid gap-3 pt-2"
                      style={{
                        gridTemplateColumns: `repeat(${state.columnsCount}, minmax(0, 1fr))`,
                      }}
                    >
                      {problems.map((prob, idx) => (
                        <MathProblemCard
                          key={prob.id}
                          problem={prob}
                          index={idx}
                          orientation={state.orientation}
                          showNumber={state.showExerciseNumbers}
                          numberingStyle={state.numberingStyle}
                          answerBoxStyle={state.answerBoxStyle}
                          showAnswer={state.activePreviewTab === 'answers'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Worksheet Footer */}
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>CreatRocket Math Worksheets Generator Pro</span>
                    <span>
                      {state.activePreviewTab === 'answers' ? 'Solutions / Clé de correction' : 'Fiche d\'exercices'}
                    </span>
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
