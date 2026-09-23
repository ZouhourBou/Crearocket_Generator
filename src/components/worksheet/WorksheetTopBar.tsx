import React from 'react';
import { PageOrientation, DocumentLanguage } from '../../types/worksheet';
import { SUPPORTED_LANGUAGES } from '../../utils/multilingual';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  FileText,
  Eye,
  ArrowLeft,
  LayoutGrid,
  Copy,
  Globe,
} from 'lucide-react';

interface WorksheetTopBarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  orientation: PageOrientation;
  onOrientationChange: (orientation: PageOrientation) => void;
  activeLanguage?: DocumentLanguage;
  onLanguageChange: (lang: DocumentLanguage) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  currentPageIndex: number;
  totalPages: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDeleteCurrentPage: () => void;
  isCurrentPageIndependentArabic?: boolean;
  onDuplicatePageAsIndependentArabic?: () => void;
  viewMode?: 'single' | 'continuous';
  onToggleViewMode?: () => void;
  isGridMode?: boolean;
  onToggleGridMode?: () => void;
  isLeftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  isRightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  onTogglePreview: () => void;
  onBackToHome?: () => void;
}

export const WorksheetTopBar: React.FC<WorksheetTopBarProps> = ({
  title,
  onTitleChange,
  orientation,
  onOrientationChange,
  activeLanguage = 'fr',
  onLanguageChange,
  zoom,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  currentPageIndex,
  totalPages,
  onSelectPage,
  onAddPage,
  onDeleteCurrentPage,
  isCurrentPageIndependentArabic = false,
  onDuplicatePageAsIndependentArabic,
  viewMode,
  onToggleViewMode,
  isGridMode = false,
  onToggleGridMode,
  isLeftPanelOpen,
  onToggleLeftPanel,
  isRightPanelOpen,
  onToggleRightPanel,
  onTogglePreview,
  onBackToHome,
}) => {
  const zoomOptions = [50, 75, 100, 125, 150];

  const handleZoomIn = () => {
    const next = zoomOptions.find((z) => z > zoom);
    if (next) onZoomChange(next);
    else onZoomChange(Math.min(200, zoom + 25));
  };

  const handleZoomOut = () => {
    const prev = [...zoomOptions].reverse().find((z) => z < zoom);
    if (prev) onZoomChange(prev);
    else onZoomChange(Math.max(50, zoom - 25));
  };

  return (
    <div className="bg-white border-b border-slate-200/90 px-2 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-2.5 select-none z-30 shadow-2xs shrink-0">
      {/* Left Group: Back Button, Left Panel Toggle & Document Title */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            title="Retour aux générateurs (Accueil)"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onToggleLeftPanel}
          title={isLeftPanelOpen ? 'Masquer la bibliothèque (Ctrl+B)' : 'Ouvrir la bibliothèque'}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
            isLeftPanelOpen
              ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
          }`}
        >
          {isLeftPanelOpen ? (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span className="hidden xl:inline">Bibliothèque</span>
            </>
          ) : (
            <>
              <PanelLeftOpen className="w-4 h-4" />
              <span className="hidden xl:inline">Bibliothèque</span>
            </>
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

        {/* Editable Title */}
        <div className="flex items-center gap-1 min-w-0">
          <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0 hidden md:block" />
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Nom de la fiche…"
            className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent hover:border-slate-200 focus:border-indigo-400 rounded-md px-1.5 py-1 outline-none transition-all truncate min-w-0 max-w-[110px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[260px]"
            title="Cliquez pour renommer le document"
          />
        </div>
      </div>

      {/* Center Group: Undo/Redo, Orientation & Zoom */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Undo & Redo */}
        <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/80">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Annuler (Ctrl+Z)"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Rétablir (Ctrl+Y)"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orientation: Portrait / Paysage */}
        <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/80 text-[11px] sm:text-xs font-semibold">
          <button
            type="button"
            onClick={() => onOrientationChange('portrait')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              orientation === 'portrait'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Format A4 Portrait (210 × 297 mm)"
          >
            Portrait
          </button>
          <button
            type="button"
            onClick={() => onOrientationChange('landscape')}
            className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
              orientation === 'landscape'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Format A4 Paysage (297 × 210 mm)"
          >
            Paysage
          </button>
        </div>

        {/* Global Document Language Selector: Français / English / العربية */}
        <div
          className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/80 text-[11px] sm:text-xs font-semibold"
          title="Langue globale du document (met à jour tous les blocs et la direction LTR/RTL)"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = activeLanguage === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => onLanguageChange(lang.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold ring-1 ring-indigo-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={`Afficher le document en ${lang.name} (${lang.dir.toUpperCase()})`}
              >
                <span>{lang.flag}</span>
                <span className="hidden md:inline">{lang.nativeName}</span>
                <span className="md:hidden">{lang.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom Controls: [-] 100% [+] */}
        <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            title="Zoom arrière"
            className="p-1 sm:p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(100)}
            title="Réinitialiser le zoom à 100%"
            className="px-1.5 py-1 text-slate-700 hover:text-indigo-600 font-bold min-w-[42px] text-center text-[11px] sm:text-xs"
          >
            {zoom}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            title="Zoom avant"
            className="p-1 sm:p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Group: Page Navigation, Eye Preview & Right Panel Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Multi-page Navigation */}
        <div className="flex items-center gap-0.5 bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/80 text-xs shrink-0">
          <button
            type="button"
            onClick={() => onSelectPage(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            title="Page précédente"
            className="p-1 sm:p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="px-1 sm:px-1.5 font-bold text-slate-700 whitespace-nowrap text-[11px] sm:text-xs">
            {currentPageIndex + 1} / {totalPages}
          </span>

          {isCurrentPageIndependentArabic && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap"
              title="Cette page est une version Arabe autonome (structure et blocs indépendants de la version FR/EN)"
            >
              🇹🇳 AR Indépendante
            </span>
          )}

          <button
            type="button"
            onClick={() => onSelectPage(Math.min(totalPages - 1, currentPageIndex + 1))}
            disabled={currentPageIndex >= totalPages - 1}
            title="Page suivante"
            className="p-1 sm:p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onAddPage}
            title="Ajouter une nouvelle page A4"
            className="flex items-center gap-1 px-1.5 py-1 rounded-md text-indigo-700 bg-white hover:bg-indigo-50 font-bold border border-indigo-200 shadow-2xs transition-all cursor-pointer ml-0.5"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden xl:inline">Page</span>
          </button>

          {onDuplicatePageAsIndependentArabic && (
            <button
              type="button"
              onClick={onDuplicatePageAsIndependentArabic}
              title="Dupliquer cette page en tant que version Arabe indépendante (autonome, non liée à la version FR/EN)"
              className="flex items-center gap-1 px-1.5 py-1 rounded-md text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-300/80 shadow-2xs transition-all cursor-pointer"
            >
              <Copy className="w-3 h-3 text-emerald-700" />
              <span className="text-[11px] hidden 2xl:inline">Copie AR autonome</span>
            </button>
          )}

          {totalPages > 1 && (
            <button
              type="button"
              onClick={onDeleteCurrentPage}
              title="Supprimer la page actuelle"
              className="p-1 sm:p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Mode Grille des pages (Canva) */}
        <button
          type="button"
          onClick={onToggleGridMode || onToggleViewMode}
          title={
            isGridMode
              ? 'Fermer la vue grille (revenir au mode normal)'
              : 'Afficher toutes les pages en vue grille de miniatures (Canva)'
          }
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shrink-0 ${
            isGridMode
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayoutGrid
            className={`w-3.5 h-3.5 shrink-0 ${
              isGridMode ? 'text-white' : 'text-indigo-600'
            }`}
          />
          <span className="hidden xl:inline">
            {isGridMode ? 'Grille active' : 'Vue grille'}
          </span>
        </button>

        {/* Eye Preview Icon Button — Point 3 (Right next to Page selector) */}
        <button
          type="button"
          onClick={onTogglePreview}
          title="Aperçu avant impression (fiche propre)"
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-300/90 hover:border-indigo-300 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="hidden xl:inline">Aperçu</span>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

        {/* Right Panel Toggle */}
        <button
          type="button"
          onClick={onToggleRightPanel}
          title={isRightPanelOpen ? 'Masquer les propriétés' : 'Ouvrir les propriétés'}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
            isRightPanelOpen
              ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
          }`}
        >
          {isRightPanelOpen ? (
            <>
              <span className="hidden xl:inline">Propriétés</span>
              <PanelRightClose className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="hidden xl:inline">Propriétés</span>
              <PanelRightOpen className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

