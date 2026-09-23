import React, { useState, useRef } from 'react';
import { Language } from '../../types';
import {
  StationeryGeneratorState,
  KawaiiThemeId,
  StationeryPageType,
  StationeryPaperFormat,
} from '../../types/stationery';
import { KAWAII_THEMES } from './ThemeLibrary';
import { ThemeIllustrations } from './ThemeIllustrations';
import { StationeryRenderer } from './StationeryRenderer';
import {
  exportToPdf,
  exportMultiPagePdf,
  exportToPng,
  printDirect,
} from '../../utils/exportUtils';
import {
  Sparkles,
  ArrowLeft,
  Printer,
  Download,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Sliders,
  Layers,
  Heart,
  Calendar,
  CheckSquare,
  FileText,
  Tablet,
  Grid,
  Palette,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface Props {
  language: Language;
  onNavigate?: (route: string) => void;
}

export const KawaiiStationeryPage: React.FC<Props> = ({
  language,
  onNavigate,
}) => {
  const isArabic = language === 'ar';

  const [state, setState] = useState<StationeryGeneratorState>(() => ({
    themeId: 'peachy_dreams',
    paperFormat: 'a4',
    pageType: 'lined',
    orientation: 'portrait',

    title: 'Mes Douces Pensées',
    subtitle: 'Collection Papeterie Créative',
    userName: 'Lina',
    dateText: 'Date : ___ / ___ / 2026',

    lineSpacing: 8,
    lineColor: '#FDBA74',
    lineThickness: 1,
    leftMarginLine: true,
    gridSize: 5,
    gridOpacity: 0.7,
    dotSpacing: 5,
    dotSize: 1.5,
    dotOpacity: 0.5,

    showDecorativeFrame: true,
    frameStyle: 'subtle_dots',
    backgroundIllustrationOpacity: 0.08,
    showHeader: true,
    showFooter: true,
    showPageNumbers: true,
    pageNumberPrefix: 'Page',
    startPageNumber: 1,
    pageCount: 3,

    moodTrackerEnabled: true,
    waterIntakeTracker: true,
    habitTrackerEnabled: true,
    customGoals: [],

    isDigitalExportMode: false,
    digitalTabsEnabled: false,
    activeDigitalTab: 'notes',

    printMode: 'home',
    showTrimMarks: false,
    bleedMm: 0,

    zoom: 90,
    activePageIndex: 0,
    isMatchingSetModalOpen: false,
    matchingSetOptions: {
      includeWritingLined: true,
      includeDottedBujo: true,
      includeGridMath: true,
      includeDailyPlanner: true,
      includeWeeklyPlanner: true,
      includeMemoCards: true,
      includeBookmarks: true,
      includeMatchingLabels: true,
    },
  }));

  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'layout' | 'personalize' | 'matching'>('theme');

  const activeSheetRef = useRef<HTMLDivElement>(null);
  const hiddenPagesContainerRef = useRef<HTMLDivElement>(null);

  const activeTheme = KAWAII_THEMES[state.themeId] || KAWAII_THEMES.peachy_dreams;

  // Paper Dimensions calculation
  const paperDimensions = {
    widthMm:
      state.paperFormat === 'a5'
        ? 148
        : state.paperFormat === 'journal'
        ? 176
        : state.paperFormat === 'mini_memo'
        ? 105
        : state.paperFormat === 'square_memo'
        ? 148
        : 210,
    heightMm:
      state.paperFormat === 'a5'
        ? 210
        : state.paperFormat === 'journal'
        ? 250
        : state.paperFormat === 'mini_memo'
        ? 148
        : state.paperFormat === 'square_memo'
        ? 148
        : 297,
  };

  // Export handlers
  const handlePrint = () => {
    printDirect();
  };

  const handleExportSinglePdf = async () => {
    if (!activeSheetRef.current) return;
    setIsExporting(true);
    try {
      await exportToPdf(
        activeSheetRef.current,
        paperDimensions,
        `papeterie_${state.themeId}_page_${state.activePageIndex + 1}.pdf`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFullPdf = async () => {
    if (!hiddenPagesContainerRef.current) return;
    setIsExporting(true);
    try {
      const pageElements: HTMLElement[] = [];
      hiddenPagesContainerRef.current
        .querySelectorAll('.stationery-hidden-page')
        .forEach((node) => {
          if (node instanceof HTMLElement) {
            pageElements.push(node);
          }
        });

      if (pageElements.length > 0) {
        await exportMultiPagePdf(
          pageElements,
          paperDimensions,
          `collection_papeterie_${state.themeId}_${state.pageCount}pages.pdf`
        );
      } else if (activeSheetRef.current) {
        await exportToPdf(
          activeSheetRef.current,
          paperDimensions,
          `papeterie_${state.themeId}.pdf`
        );
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    if (!activeSheetRef.current) return;
    setIsExporting(true);
    try {
      await exportToPng(
        activeSheetRef.current,
        `papeterie_${state.themeId}_page_${state.activePageIndex + 1}.png`
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-gray-900 select-none">
      {/* Top Utility Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
          <div className="flex items-center gap-2">
            <span
              className="p-1.5 rounded-lg border text-white shadow-2xs"
              style={{ backgroundColor: activeTheme.primaryColor, borderColor: activeTheme.borderColor }}
            >
              <Heart className="w-4 h-4 fill-white" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                Studio Papeterie Kawaii & Planners
                <span
                  className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: activeTheme.badgeBg, color: activeTheme.primaryColor }}
                >
                  {activeTheme.name}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Imprimer</span>
          </button>

          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Page PNG</span>
          </button>

          <button
            onClick={handleExportSinglePdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border text-white shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: activeTheme.primaryColor, borderColor: activeTheme.primaryColor }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Page PDF</span>
          </button>

          <button
            onClick={handleExportFullPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-extrabold rounded-lg text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: activeTheme.secondaryColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cahier ({state.pageCount} Pages PDF)</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Customization Panel */}
        <aside className="w-full lg:w-105 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col shrink-0 h-auto lg:h-[calc(100vh-53px)] overflow-y-auto">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 border-b border-gray-200 p-1 bg-gray-50/70 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'theme'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1. Thèmes (12)
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'layout'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              2. Disposition
            </button>
            <button
              onClick={() => setActiveTab('personalize')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'personalize'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3. Textes & Lignes
            </button>
            <button
              onClick={() => setActiveTab('matching')}
              className={`py-2 text-center rounded-lg transition-colors cursor-pointer ${
                activeTab === 'matching'
                  ? 'bg-white text-gray-900 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              4. Lot Assorti
            </button>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {/* TAB 1: THEME GALLERY */}
            {activeTab === 'theme' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-pink-500" />
                    Bibliothèque Exclusive des 12 Thèmes Kawaii
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(KAWAII_THEMES).map((thm) => {
                    const isSelected = thm.id === state.themeId;
                    return (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() =>
                          setState((p) => ({
                            ...p,
                            themeId: thm.id,
                            lineColor: thm.lineColor,
                          }))
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'border-2 shadow-md ring-2 ring-pink-500/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        style={{
                          borderColor: isSelected ? thm.primaryColor : undefined,
                          backgroundColor: isSelected ? thm.bgTint : undefined,
                        }}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <ThemeIllustrations themeId={thm.id} size={28} className="w-7 h-7" />
                          <span className="text-lg">{thm.mascotEmoji}</span>
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-gray-900">
                            {thm.name}
                          </div>
                          <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                            {thm.descriptionFr}
                          </div>
                        </div>

                        {/* Color swatches */}
                        <div className="flex items-center gap-1 mt-2">
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: thm.primaryColor }} />
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: thm.secondaryColor }} />
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: thm.accentColor }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: PAGE LAYOUT & FORMAT */}
            {activeTab === 'layout' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-pink-500" />
                    Format du Papier & Type de Feuille
                  </span>
                </div>

                {/* Paper Format */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Format physique
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'a4', label: 'A4 Standard' },
                      { id: 'a5', label: 'A5 Carnet' },
                      { id: 'journal', label: 'Journal B5' },
                      { id: 'mini_memo', label: 'Mini Mémo' },
                      { id: 'square_memo', label: 'Carré 15×15' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() =>
                          setState((p) => ({ ...p, paperFormat: f.id as StationeryPaperFormat }))
                        }
                        className={`py-1.5 px-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          state.paperFormat === f.id
                            ? 'border-gray-900 bg-gray-900 text-white font-bold'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Page Type / Layout */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Type de lignage ou gabarit
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'lined', label: 'Lignes Simples', icon: '📝' },
                      { id: 'dotted', label: 'Pointillés BuJo', icon: '⁖' },
                      { id: 'grid', label: 'Quadrillage 5mm', icon: '⊞' },
                      { id: 'blank', label: 'Page Blanche Décorée', icon: '📄' },
                      { id: 'checklist', label: 'To-Do / Checklist', icon: '☑' },
                      { id: 'daily_planner', label: 'Planning Journalier', icon: '⏰' },
                      { id: 'weekly_planner', label: 'Semainier 7 Jours', icon: '📅' },
                      { id: 'journal', label: 'Journal & Humeur', icon: '📖' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setState((p) => ({ ...p, pageType: item.id as StationeryPageType }))
                        }
                        className={`p-2 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                          state.pageType === item.id
                            ? 'border-pink-500 bg-pink-50/50 text-pink-900 font-bold'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Pages in booklet */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Nombre de pages à générer</span>
                    <span className="font-bold text-pink-600">{state.pageCount} pages</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={state.pageCount}
                    onChange={(e) =>
                      setState((p) => ({ ...p, pageCount: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full accent-pink-600"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: PERSONALIZATION & RULINGS */}
            {activeTab === 'personalize' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-500" />
                    En-tête, Lignages & Personnalisation
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Titre imprimé
                  </label>
                  <input
                    type="text"
                    value={state.title}
                    onChange={(e) => setState((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Mes Douces Pensées..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nom / Prénom
                    </label>
                    <input
                      type="text"
                      value={state.userName}
                      onChange={(e) => setState((p) => ({ ...p, userName: e.target.value }))}
                      placeholder="Lina..."
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Texte de Date
                    </label>
                    <input
                      type="text"
                      value={state.dateText}
                      onChange={(e) => setState((p) => ({ ...p, dateText: e.target.value }))}
                      placeholder="Date : ___ / ___ / 2026"
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                  <label className="flex items-center justify-between text-gray-800 font-semibold cursor-pointer">
                    <span>Afficher le cadre décoratif</span>
                    <input
                      type="checkbox"
                      checked={state.showDecorativeFrame}
                      onChange={(e) =>
                        setState((p) => ({ ...p, showDecorativeFrame: e.target.checked }))
                      }
                      className="accent-pink-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-gray-800 font-semibold cursor-pointer">
                    <span>Marge rose verticale à gauche (style écolier)</span>
                    <input
                      type="checkbox"
                      checked={state.leftMarginLine}
                      onChange={(e) =>
                        setState((p) => ({ ...p, leftMarginLine: e.target.checked }))
                      }
                      className="accent-pink-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-gray-800 font-semibold cursor-pointer">
                    <span>Numérotation des pages</span>
                    <input
                      type="checkbox"
                      checked={state.showPageNumbers}
                      onChange={(e) =>
                        setState((p) => ({ ...p, showPageNumbers: e.target.checked }))
                      }
                      className="accent-pink-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {/* Illustration Opacity */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Transparence illustration de fond</span>
                    <span className="font-bold text-gray-400">
                      {Math.round((state.backgroundIllustrationOpacity || 0.08) * 100)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0.02"
                    max="0.25"
                    step="0.01"
                    value={state.backgroundIllustrationOpacity}
                    onChange={(e) =>
                      setState((p) => ({
                        ...p,
                        backgroundIllustrationOpacity: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-pink-600"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: MATCHING STATIONERY SET (LOT COORDONNÉ) */}
            {activeTab === 'matching' && (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    Créer la Collection Complète Coordonnée
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-200 text-xs text-pink-900 leading-relaxed">
                  Générez un ensemble coordonné complet avec le même univers artistique ({activeTheme.name}).
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'includeWritingLined', label: 'Papier à lettres ligné' },
                    { key: 'includeDottedBujo', label: 'Papier pointillé Bullet Journal' },
                    { key: 'includeGridMath', label: 'Papier quadrillé notes' },
                    { key: 'includeDailyPlanner', label: 'Planning journalier assorti' },
                    { key: 'includeWeeklyPlanner', label: 'Semainier assorti' },
                    { key: 'includeMemoCards', label: 'Cartes mémo & étiquettes de vœux' },
                    { key: 'includeBookmarks', label: 'Marque-pages à découper' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-gray-200 cursor-pointer"
                    >
                      <span className="font-semibold text-gray-700">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={
                          (state.matchingSetOptions as any)[item.key] ?? true
                        }
                        onChange={(e) => {
                          const val = e.target.checked;
                          setState((p) => ({
                            ...p,
                            matchingSetOptions: {
                              ...p.matchingSetOptions,
                              [item.key]: val,
                            },
                          }));
                        }}
                        className="accent-pink-600 w-4 h-4 rounded cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleExportFullPdf}
                  disabled={isExporting}
                  className="w-full py-2.5 px-4 text-xs font-extrabold text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: activeTheme.primaryColor }}
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter le Coffret Assorti (PDF Multi-pages)</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Live Document Preview Panel */}
        <main className="flex-1 flex flex-col bg-slate-200/80 overflow-y-auto">
          {/* Top Preview Pagination & Navigation Bar */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-1 text-xs">
              <button
                disabled={state.activePageIndex <= 0}
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    activePageIndex: Math.max(0, p.activePageIndex - 1),
                  }))
                }
                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-bold text-gray-800 px-2">
                Page {state.activePageIndex + 1} sur {state.pageCount}
              </span>

              <button
                disabled={state.activePageIndex >= state.pageCount - 1}
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    activePageIndex: Math.min(p.pageCount - 1, p.activePageIndex + 1),
                  }))
                }
                className="p-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <button
                onClick={() => setState((p) => ({ ...p, zoom: Math.max(50, p.zoom - 10) }))}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                title="Dézoomer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-gray-700 min-w-10 text-center">
                {state.zoom}%
              </span>
              <button
                onClick={() => setState((p) => ({ ...p, zoom: Math.min(150, p.zoom + 10) }))}
                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                title="Zoomer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Printable Realistic Paper Canvas */}
          <div className="flex-1 p-4 sm:p-8 flex items-center justify-center overflow-auto">
            <div
              style={{
                transform: `scale(${state.zoom / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <div
                ref={activeSheetRef}
                style={{
                  width: `${paperDimensions.widthMm}mm`,
                  height: `${paperDimensions.heightMm}mm`,
                }}
                className="bg-white shadow-2xl border border-gray-300 relative box-border overflow-hidden"
              >
                <StationeryRenderer
                  state={state}
                  pageNumber={state.activePageIndex + 1}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hidden Container for Multi-Page PDF Generation */}
      <div
        ref={hiddenPagesContainerRef}
        style={{
          position: 'fixed',
          top: -99999,
          left: -99999,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: state.pageCount }).map((_, idx) => (
          <div
            key={idx}
            className="stationery-hidden-page bg-white"
            style={{
              width: `${paperDimensions.widthMm}mm`,
              height: `${paperDimensions.heightMm}mm`,
            }}
          >
            <StationeryRenderer state={state} pageNumber={idx + 1} />
          </div>
        ))}
      </div>
    </div>
  );
};
