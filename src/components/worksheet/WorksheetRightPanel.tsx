import React, { useState } from 'react';
import {
  WorksheetBlock,
  DocumentSettings,
  PageOrientation,
  QCMExamQuestion,
  QCMExamOption,
} from '../../types/worksheet';
import {
  ChevronRight,
  ChevronDown,
  Settings,
  Palette,
  Sliders,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Square,
  Circle,
  Upload,
  Layers,
  Sparkles,
  Maximize2,
  ArrowLeftRight,
  Bookmark,
  PenLine,
  CheckSquare,
  Languages,
  Trash2,
  Star,
  ArrowRight,
  ArrowLeft,
  Check,
  Diamond,
  CircleDot,
  Plus,
  Undo2,
  MousePointerClick,
  ListOrdered,
  Ban,
  Sigma,
} from 'lucide-react';
import { TITLE_NUMBERING_OPTIONS, TitleNumberingModel } from '../../utils/titleNumbering';
import { MathSymbolLibraryModal } from './blocks/MathSymbolLibraryModal';

interface WorksheetRightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  onStartResize?: (e: React.PointerEvent) => void;
  isResizing?: boolean;
  selectedBlock: WorksheetBlock | null;
  documentSettings: DocumentSettings;
  onUpdateDocumentSettings: (settings: Partial<DocumentSettings>) => void;
  onUpdateSelectedBlock: (updates: Partial<WorksheetBlock>) => void;
  onUpdateBlockStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateBlockContent: (content: Partial<WorksheetBlock['content']>) => void;
}

export const WorksheetRightPanel: React.FC<WorksheetRightPanelProps> = ({
  isOpen,
  onClose,
  width = 240,
  onStartResize,
  isResizing = false,
  selectedBlock,
  documentSettings,
  onUpdateDocumentSettings,
  onUpdateSelectedBlock,
  onUpdateBlockStyles,
  onUpdateBlockContent,
}) => {
  // Collapsible section state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    document: true,
    geometry: true,
    typography: true,
    specific: true,
    appearance: true,
  });

  const [isMathModalOpenRight, setIsMathModalOpenRight] = useState(false);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateBlockContent({ src: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fonts = [
    { label: 'Standard (Outfit)', value: 'Outfit, sans-serif' },
    { label: 'Écolier / Cursive', value: 'system-ui, sans-serif' },
    { label: 'Classique (Serif)', value: 'Georgia, serif' },
    { label: 'Machine à écrire', value: 'Courier New, monospace' },
    { label: 'Arabe & Français', value: 'Cairo, Outfit, sans-serif' },
  ];

  const isArabicContext =
    documentSettings?.activeLanguage === 'ar' ||
    documentSettings?.languageMode === 'ar' ||
    selectedBlock?.styles?.textDirection === 'rtl' ||
    selectedBlock?.styles?.languageMode === 'ar';

  return (
    <aside
      id="worksheet-right-panel"
      style={{ width: `${width}px`, minWidth: `${width}px` }}
      className="relative bg-white border-l border-slate-200/90 flex flex-col h-full shrink-0 select-none z-20 shadow-xs"
    >
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
        {/* Top Header */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {selectedBlock ? 'Propriétés du bloc' : 'Propriétés du document'}
            </h2>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
              {selectedBlock ? selectedBlock.type.toUpperCase() : 'Format A4'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          title="Réduire le panneau (›)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
        {/* CASE 1: NO BLOCK SELECTED -> DOCUMENT PROPERTIES */}
        {!selectedBlock && (
          <div className="space-y-4">
            {/* Format & Orientation */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() => toggleSection('document')}
                className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <span>Format & Orientation</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openSections.document ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {openSections.document && (
                <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Format du papier
                    </label>
                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-bold flex items-center justify-between">
                      <span>A4 Standard</span>
                      <span className="text-[10px] text-slate-400 font-normal">210 × 297 mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Orientation de la page
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateDocumentSettings({ orientation: 'portrait' })}
                        className={`py-1.5 px-2 rounded-lg font-bold border transition-all cursor-pointer ${
                          documentSettings.orientation === 'portrait'
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Portrait
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateDocumentSettings({ orientation: 'landscape' })}
                        className={`py-1.5 px-2 rounded-lg font-bold border transition-all cursor-pointer ${
                          documentSettings.orientation === 'landscape'
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Paysage
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Couleur du papier
                    </label>
                    <div className="flex items-center gap-2">
                      {[
                        { label: 'Blanc', value: '#ffffff' },
                        { label: 'Ivoire doux', value: '#faf8f5' },
                        { label: 'Gris doux', value: '#f8fafc' },
                      ].map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => onUpdateDocumentSettings({ backgroundColor: c.value })}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                            documentSettings.backgroundColor === c.value
                              ? 'border-indigo-600 scale-110 shadow-2xs'
                              : 'border-slate-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Version linguistique du document (Bilingue FR/AR) */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Version du document</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {documentSettings.defaultTextDirection === 'rtl'
                          ? 'Arabe (RTL)'
                          : documentSettings.defaultTextDirection === 'ltr'
                          ? 'Français (LTR)'
                          : 'Auto'}
                      </span>
                    </label>

                    <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateDocumentSettings({
                            languageMode: 'fr',
                            defaultTextDirection: 'ltr',
                          })
                        }
                        className={`py-2 px-2 rounded-lg font-bold border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                          documentSettings.defaultTextDirection === 'ltr'
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-sm">🇫🇷</span>
                        <span className="text-[11px]">Version Français</span>
                        <span className="text-[9px] text-slate-400 font-normal">Texte LTR • Maths LTR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateDocumentSettings({
                            languageMode: 'ar',
                            defaultTextDirection: 'rtl',
                          })
                        }
                        className={`py-2 px-2 rounded-lg font-bold border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                          documentSettings.defaultTextDirection === 'rtl'
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-sm">🇹🇳</span>
                        <span className="text-[11px]">Version Arabe</span>
                        <span className="text-[9px] text-slate-400 font-normal">Texte RTL • Maths LTR</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateDocumentSettings({
                          languageMode: undefined,
                          defaultTextDirection: 'auto',
                        })
                      }
                      className={`w-full py-1 text-[11px] rounded-md font-medium border text-center transition-colors cursor-pointer ${
                        !documentSettings.defaultTextDirection ||
                        documentSettings.defaultTextDirection === 'auto'
                          ? 'bg-slate-100 border-slate-300 text-slate-700 font-bold'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Mode Automatique (détecte la langue bloc par bloc)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Marges de la page */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() => toggleSection('margins')}
                className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <span>Marges d'impression</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openSections.margins !== false ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {openSections.margins !== false && (
                <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: 'Étroites', value: 35 },
                      { label: 'Normales', value: 50 },
                      { label: 'Larges', value: 65 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          onUpdateDocumentSettings({
                            margins: {
                              top: preset.value,
                              right: preset.value,
                              bottom: preset.value,
                              left: preset.value,
                            },
                          })
                        }
                        className={`py-1 px-1.5 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                          documentSettings.margins.top === preset.value
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Afficher repères visuels</span>
                    <input
                      type="checkbox"
                      checked={documentSettings.showMarginGuides}
                      onChange={(e) =>
                        onUpdateDocumentSettings({ showMarginGuides: e.target.checked })
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-600 text-center">
              <Sparkles className="w-4 h-4 text-indigo-600 mx-auto mb-1.5" />
              <div className="font-bold text-slate-800">Astuce enseignant</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sélectionnez n'importe quel bloc sur la feuille ou ajoutez-en un depuis le panneau
                gauche pour personnaliser ses propriétés.
              </p>
            </div>
          </div>
        )}

        {/* CASE 2: BLOCK IS SELECTED -> CONTEXTUAL PROPERTIES */}
        {selectedBlock && (
          <div className="space-y-3">
            {/* 1. Position & Dimensions */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() => toggleSection('geometry')}
                className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <span>Position & Dimensions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openSections.geometry ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {openSections.geometry && (
                <div className="p-3 bg-white border-t border-slate-200/70 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Largeur (px)
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="1120"
                        value={Math.round(selectedBlock.width)}
                        onChange={(e) =>
                          onUpdateSelectedBlock({ width: Math.max(20, Number(e.target.value)) })
                        }
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Hauteur (px)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="1120"
                        value={Math.round(selectedBlock.height)}
                        onChange={(e) =>
                          onUpdateSelectedBlock({ height: Math.max(10, Number(e.target.value)) })
                        }
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        X (gauche)
                      </label>
                      <input
                        type="number"
                        value={Math.round(selectedBlock.x)}
                        onChange={(e) => onUpdateSelectedBlock({ x: Number(e.target.value) })}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Y (haut)
                      </label>
                      <input
                        type="number"
                        value={Math.round(selectedBlock.y)}
                        onChange={(e) => onUpdateSelectedBlock({ y: Number(e.target.value) })}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Propriétés spécifiques du bloc Titre (Axes 1 & 2) */}
            {selectedBlock.type === 'title' && (
              <div className="border border-indigo-200/80 rounded-xl overflow-hidden bg-indigo-50/20 shadow-xs">
                <button
                  type="button"
                  onClick={() => toggleSection('typography')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-800 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>Propriétés du Titre</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.typography ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.typography && (
                  <div className="p-3 bg-white border-t border-indigo-100 space-y-3.5">
                    {/* Contenu du texte */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                        Texte du titre
                      </label>
                      <textarea
                        rows={2}
                        value={selectedBlock.content.text || ''}
                        onChange={(e) => onUpdateBlockContent({ text: e.target.value })}
                        placeholder="Saisissez votre titre..."
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none leading-tight"
                      />
                    </div>

                    {/* Numérotation (5 modèles : 1), A), I), •, Aucune) */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ListOrdered className="w-3 h-3 text-indigo-600" />
                          <span>Numérotation du titre</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-normal">5 modèles</span>
                      </label>
                      <div className="grid grid-cols-5 gap-1">
                        {TITLE_NUMBERING_OPTIONS.map((opt) => {
                          const isCurrent =
                            (selectedBlock.content.titleNumbering || 'none') === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => onUpdateBlockContent({ titleNumbering: opt.id })}
                              title={opt.label}
                              className={`py-1.5 px-0.5 rounded-lg border text-center transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs font-bold ring-1 ring-indigo-300'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className="text-xs font-bold">{opt.preview}</div>
                              <div className="text-[8px] truncate text-slate-400 mt-0.5">
                                {opt.shortLabel}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Typographie : Police & Taille */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                        Police
                      </label>
                      <select
                        value={selectedBlock.styles.fontFamily || 'Outfit, sans-serif'}
                        onChange={(e) => onUpdateBlockStyles({ fontFamily: e.target.value })}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-pointer text-xs"
                      >
                        {fonts.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-1/2">
                        <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                          Taille ({selectedBlock.styles.fontSize || 26}px)
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="48"
                          value={selectedBlock.styles.fontSize || 26}
                          onChange={(e) =>
                            onUpdateBlockStyles({ fontSize: Number(e.target.value) })
                          }
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      {/* Styles: Bold, Italic, Underline */}
                      <div className="w-1/2 flex items-center gap-1 justify-end pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateBlockStyles({
                              fontWeight:
                                selectedBlock.styles.fontWeight === 'bold' ? 'normal' : 'bold',
                            })
                          }
                          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                            selectedBlock.styles.fontWeight === 'bold'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Gras (B)"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateBlockStyles({
                              fontStyle:
                                selectedBlock.styles.fontStyle === 'italic' ? 'normal' : 'italic',
                            })
                          }
                          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                            selectedBlock.styles.fontStyle === 'italic'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Italique (I)"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateBlockStyles({
                              textDecoration:
                                selectedBlock.styles.textDecoration === 'underline'
                                  ? 'none'
                                  : 'underline',
                            })
                          }
                          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                            selectedBlock.styles.textDecoration === 'underline'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Souligné (U)"
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Alignement du texte : Inversion automatique en Arabe */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Alignement du texte
                        </label>
                        {isArabicContext && (
                          <span className="text-[9px] text-amber-600 font-semibold">
                            Sens RTL (Arabe)
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(isArabicContext
                          ? [
                              { id: 'right', icon: AlignRight, title: 'Droite (اليَمِين)', label: 'Droite' },
                              { id: 'center', icon: AlignCenter, title: 'Centré (وَسَط)', label: 'Centre' },
                              { id: 'left', icon: AlignLeft, title: 'Gauche (اليَسَار)', label: 'Gauche' },
                            ]
                          : [
                              { id: 'left', icon: AlignLeft, title: 'Gauche', label: 'Gauche' },
                              { id: 'center', icon: AlignCenter, title: 'Centré', label: 'Centre' },
                              { id: 'right', icon: AlignRight, title: 'Droite', label: 'Droite' },
                            ]
                        ).map((align) => {
                          const Icon = align.icon;
                          const currentAlign =
                            selectedBlock.styles.textAlign || (isArabicContext ? 'right' : 'center');
                          const isCurrent = currentAlign === align.id;
                          return (
                            <button
                              key={align.id}
                              type="button"
                              onClick={() =>
                                onUpdateBlockStyles({
                                  textAlign: align.id as WorksheetBlock['styles']['textAlign'],
                                })
                              }
                              title={align.title}
                              className={`py-1.5 flex items-center justify-center gap-1.5 rounded-lg border transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span className="text-[10px]">{align.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Couleur du texte */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                        Couleur du texte
                      </label>
                      <div className="flex items-center gap-1.5">
                        {['#0f172a', '#1e293b', '#475569', '#2563eb', '#dc2626', '#16a34a'].map(
                          (col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => onUpdateBlockStyles({ color: col })}
                              className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                                (selectedBlock.styles.color || '#0f172a') === col
                                  ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                                  : 'border-slate-300'
                              }`}
                              style={{ backgroundColor: col }}
                            />
                          )
                        )}
                        <input
                          type="color"
                          value={selectedBlock.styles.color || '#0f172a'}
                          onChange={(e) => onUpdateBlockStyles({ color: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer"
                          title="Couleur personnalisée"
                        />
                        <span className="text-[11px] font-mono text-slate-500 ml-1">
                          {selectedBlock.styles.color || '#0f172a'}
                        </span>
                      </div>
                    </div>

                    {/* Couleur de fond (avec option Aucune/Transparent) */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                        Couleur de fond
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Option explicite "Aucune / Transparent" */}
                        <button
                          type="button"
                          onClick={() => onUpdateBlockStyles({ backgroundColor: 'transparent' })}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            !selectedBlock.styles.backgroundColor ||
                            selectedBlock.styles.backgroundColor === 'transparent'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-300'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Transparent / Aucune couleur"
                        >
                          <Ban className="w-3 h-3 text-slate-400" />
                          <span>Aucune</span>
                        </button>

                        {['#ffffff', '#f8fafc', '#eff6ff', '#ecfdf5', '#fffbeb'].map((bg) => (
                          <button
                            key={bg}
                            type="button"
                            onClick={() => onUpdateBlockStyles({ backgroundColor: bg })}
                            className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                              selectedBlock.styles.backgroundColor === bg
                                ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                                : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: bg }}
                          />
                        ))}
                        <input
                          type="color"
                          value={
                            selectedBlock.styles.backgroundColor &&
                            selectedBlock.styles.backgroundColor !== 'transparent'
                              ? selectedBlock.styles.backgroundColor
                              : '#ffffff'
                          }
                          onChange={(e) => onUpdateBlockStyles({ backgroundColor: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer"
                          title="Couleur personnalisée"
                        />
                      </div>
                    </div>

                    {/* Rayon d'arrondi des bords */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Rayon d'arrondi des bords
                        </label>
                        <span className="text-[11px] font-mono text-indigo-600 font-bold">
                          {selectedBlock.styles.borderRadius || 0}px
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="32"
                          value={selectedBlock.styles.borderRadius || 0}
                          onChange={(e) =>
                            onUpdateBlockStyles({ borderRadius: Number(e.target.value) })
                          }
                          className="flex-1 accent-indigo-600"
                        />
                        <input
                          type="number"
                          min="0"
                          max="32"
                          value={selectedBlock.styles.borderRadius || 0}
                          onChange={(e) =>
                            onUpdateBlockStyles({
                              borderRadius: Math.max(0, Math.min(32, Number(e.target.value))),
                            })
                          }
                          className="w-12 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* Bordure : Activation, Épaisseur, Couleur, Style */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-700 uppercase">
                          Bordure
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const isActive =
                              (selectedBlock.styles.borderWidth || 0) > 0 &&
                              selectedBlock.styles.borderStyle !== 'none';
                            if (isActive) {
                              onUpdateBlockStyles({ borderWidth: 0, borderStyle: 'none' });
                            } else {
                              onUpdateBlockStyles({
                                borderWidth: selectedBlock.styles.borderWidth || 1,
                                borderStyle:
                                  selectedBlock.styles.borderStyle &&
                                  selectedBlock.styles.borderStyle !== 'none'
                                    ? selectedBlock.styles.borderStyle
                                    : 'solid',
                                borderColor: selectedBlock.styles.borderColor || '#cbd5e1',
                              });
                            }
                          }}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            (selectedBlock.styles.borderWidth || 0) > 0 &&
                            selectedBlock.styles.borderStyle !== 'none'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {(selectedBlock.styles.borderWidth || 0) > 0 &&
                          selectedBlock.styles.borderStyle !== 'none'
                            ? 'Active'
                            : 'Désactivée'}
                        </button>
                      </div>

                      {(selectedBlock.styles.borderWidth || 0) > 0 &&
                        selectedBlock.styles.borderStyle !== 'none' && (
                          <div className="space-y-2 pt-1 border-t border-slate-200/80">
                            {/* Style de bordure : Pleine vs Pointillée */}
                            <div>
                              <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">
                                Style de bordure
                              </label>
                              <div className="grid grid-cols-2 gap-1.5">
                                {[
                                  { id: 'solid', label: 'Pleine' },
                                  { id: 'dashed', label: 'Pointillée' },
                                ].map((st) => (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={() =>
                                      onUpdateBlockStyles({ borderStyle: st.id as any })
                                    }
                                    className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                      (selectedBlock.styles.borderStyle || 'solid') === st.id
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    {st.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Épaisseur */}
                            <div>
                              <div className="flex items-center justify-between mb-0.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase">
                                  Épaisseur
                                </label>
                                <span className="text-[10px] font-mono text-indigo-600 font-bold">
                                  {selectedBlock.styles.borderWidth || 1}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="8"
                                value={selectedBlock.styles.borderWidth || 1}
                                onChange={(e) =>
                                  onUpdateBlockStyles({ borderWidth: Number(e.target.value) })
                                }
                                className="w-full accent-indigo-600"
                              />
                            </div>

                            {/* Couleur de bordure */}
                            <div>
                              <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">
                                Couleur de bordure
                              </label>
                              <div className="flex items-center gap-1.5">
                                {[
                                  '#cbd5e1',
                                  '#94a3b8',
                                  '#475569',
                                  '#3b82f6',
                                  '#ef4444',
                                  '#10b981',
                                ].map((col) => (
                                  <button
                                    key={col}
                                    type="button"
                                    onClick={() => onUpdateBlockStyles({ borderColor: col })}
                                    className={`w-5 h-5 rounded border transition-transform cursor-pointer ${
                                      (selectedBlock.styles.borderColor || '#cbd5e1') === col
                                        ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                                        : 'border-slate-300'
                                    }`}
                                    style={{ backgroundColor: col }}
                                  />
                                ))}
                                <input
                                  type="color"
                                  value={selectedBlock.styles.borderColor || '#cbd5e1'}
                                  onChange={(e) =>
                                    onUpdateBlockStyles({ borderColor: e.target.value })
                                  }
                                  className="w-6 h-6 rounded border border-slate-200 p-0.5 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Version linguistique du bloc (Bilingue FR/AR) */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Version linguistique du bloc</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-normal">
                          {selectedBlock.styles.textDirection === 'rtl'
                            ? 'Arabe (RTL)'
                            : selectedBlock.styles.textDirection === 'ltr'
                            ? 'Français (LTR)'
                            : 'Auto'}
                        </span>
                      </label>

                      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateBlockStyles({
                              textDirection: 'ltr',
                              textAlign:
                                selectedBlock.styles.textAlign === 'center' ? 'center' : 'left',
                              languageMode: 'fr',
                            });
                          }}
                          className={`py-1.5 px-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer ${
                            selectedBlock.styles.textDirection === 'ltr'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>🇫🇷</span>
                          <span>Version Français</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onUpdateBlockStyles({
                              textDirection: 'rtl',
                              textAlign:
                                selectedBlock.styles.textAlign === 'center' ? 'center' : 'right',
                              languageMode: 'ar',
                            });
                          }}
                          className={`py-1.5 px-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer ${
                            selectedBlock.styles.textDirection === 'rtl'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>🇹🇳</span>
                          <span>Version Arabe</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateBlockStyles({
                            textDirection: 'auto',
                            languageMode: undefined,
                          })
                        }
                        className={`w-full py-1 text-[10px] rounded-md font-medium border text-center transition-colors cursor-pointer ${
                          !selectedBlock.styles.textDirection ||
                          selectedBlock.styles.textDirection === 'auto'
                            ? 'bg-slate-100 border-slate-300 text-slate-700 font-bold'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Automatique (selon le texte saisi)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2b. Typographie & Texte pour les autres blocs texte (subtitle, instruction, text) */}
            {['subtitle', 'instruction', 'text'].includes(selectedBlock.type) && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => toggleSection('typography')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <span>Typographie</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.typography ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.typography && (
                  <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                    {/* Police */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Police
                      </label>
                      <select
                        value={selectedBlock.styles.fontFamily || 'Outfit, sans-serif'}
                        onChange={(e) => onUpdateBlockStyles({ fontFamily: e.target.value })}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-pointer"
                      >
                        {fonts.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Taille & Format */}
                    <div className="flex items-center gap-2">
                      <div className="w-1/2">
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                          Taille ({selectedBlock.styles.fontSize || 16}px)
                        </label>
                        <input
                          type="range"
                          min="11"
                          max="48"
                          value={selectedBlock.styles.fontSize || 16}
                          onChange={(e) =>
                            onUpdateBlockStyles({ fontSize: Number(e.target.value) })
                          }
                          className="w-full accent-indigo-600"
                        />
                      </div>

                      {/* Styles: Bold, Italic, Underline */}
                      <div className="w-1/2 flex items-center gap-1 justify-end pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateBlockStyles({
                              fontWeight:
                                selectedBlock.styles.fontWeight === 'bold' ? 'normal' : 'bold',
                            })
                          }
                          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                            selectedBlock.styles.fontWeight === 'bold'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Gras"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateBlockStyles({
                              fontStyle:
                                selectedBlock.styles.fontStyle === 'italic' ? 'normal' : 'italic',
                            })
                          }
                          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                            selectedBlock.styles.fontStyle === 'italic'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Italique"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateBlockStyles({
                              textDecoration:
                                selectedBlock.styles.textDecoration === 'underline'
                                  ? 'none'
                                  : 'underline',
                            })
                          }
                          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                            selectedBlock.styles.textDecoration === 'underline'
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Souligné"
                        >
                          <Underline className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Alignment avec inversion automatique en version Arabe */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          Alignement
                        </label>
                        {isArabicContext && (
                          <span className="text-[9px] text-amber-600 font-medium">Sens RTL</span>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {(isArabicContext
                          ? [
                              { id: 'right', icon: AlignRight, title: 'Droite (اليَمِين)' },
                              { id: 'center', icon: AlignCenter, title: 'Centré (وَسَط)' },
                              { id: 'left', icon: AlignLeft, title: 'Gauche (اليَسَار)' },
                              { id: 'justify', icon: AlignJustify, title: 'Justifié (ضَبْط)' },
                            ]
                          : [
                              { id: 'left', icon: AlignLeft, title: 'Gauche' },
                              { id: 'center', icon: AlignCenter, title: 'Centré' },
                              { id: 'right', icon: AlignRight, title: 'Droite' },
                              { id: 'justify', icon: AlignJustify, title: 'Justifié' },
                            ]
                        ).map((align) => {
                          const Icon = align.icon;
                          const isCurrent =
                            (selectedBlock.styles.textAlign || (isArabicContext ? 'right' : 'left')) ===
                            align.id;
                          return (
                            <button
                              key={align.id}
                              type="button"
                              onClick={() =>
                                onUpdateBlockStyles({
                                  textAlign: align.id as WorksheetBlock['styles']['textAlign'],
                                })
                              }
                              title={align.title}
                              className={`py-1.5 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Couleur de texte */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Couleur de texte
                      </label>
                      <div className="flex items-center gap-1.5">
                        {['#0f172a', '#334155', '#475569', '#2563eb', '#dc2626', '#16a34a'].map(
                          (col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => onUpdateBlockStyles({ color: col })}
                              className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                                selectedBlock.styles.color === col
                                  ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                                  : 'border-slate-300'
                              }`}
                              style={{ backgroundColor: col }}
                            />
                          )
                        )}
                        <input
                          type="color"
                          value={selectedBlock.styles.color || '#0f172a'}
                          onChange={(e) => onUpdateBlockStyles({ color: e.target.value })}
                          className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer"
                          title="Couleur personnalisée"
                        />
                      </div>
                    </div>

                    {/* Version linguistique du bloc (Bilingue FR/AR) */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Languages className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Version linguistique du bloc</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-normal">
                          {selectedBlock.styles.textDirection === 'rtl'
                            ? 'Arabe (RTL)'
                            : selectedBlock.styles.textDirection === 'ltr'
                            ? 'Français (LTR)'
                            : 'Auto'}
                        </span>
                      </label>

                      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateBlockStyles({
                              textDirection: 'ltr',
                              textAlign:
                                selectedBlock.styles.textAlign === 'center' ? 'center' : 'left',
                              languageMode: 'fr',
                            });
                            if (selectedBlock.type === 'qcm_exam') {
                              onUpdateBlockContent({ markerPosition: 'before' });
                            }
                          }}
                          className={`py-1.5 px-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer ${
                            selectedBlock.styles.textDirection === 'ltr'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>🇫🇷</span>
                          <span>Version Français</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onUpdateBlockStyles({
                              textDirection: 'rtl',
                              textAlign:
                                selectedBlock.styles.textAlign === 'center' ? 'center' : 'right',
                              languageMode: 'ar',
                            });
                            if (selectedBlock.type === 'qcm_exam') {
                              onUpdateBlockContent({ markerPosition: 'after' });
                            }
                          }}
                          className={`py-1.5 px-2 rounded-lg font-bold border flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer ${
                            selectedBlock.styles.textDirection === 'rtl'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>🇹🇳</span>
                          <span>Version Arabe</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateBlockStyles({
                            textDirection: 'auto',
                            languageMode: undefined,
                          })
                        }
                        className={`w-full py-1 text-[10px] rounded-md font-medium border text-center transition-colors cursor-pointer ${
                          !selectedBlock.styles.textDirection ||
                          selectedBlock.styles.textDirection === 'auto'
                            ? 'bg-slate-100 border-slate-300 text-slate-700 font-bold'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Automatique (selon le texte saisi)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Texte & Paragraphe (Word + Canva & Math Editor) */}
            {selectedBlock.type === 'text' && (
              <div className="border border-indigo-200 rounded-xl overflow-hidden bg-indigo-50/20">
                <button
                  type="button"
                  onClick={() => toggleSection('textMath')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-800 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                      <Sigma className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-extrabold">Texte & Maths (نص وفقرة)</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.textMath !== false ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.textMath !== false && (
                  <div className="p-3 bg-white border-t border-indigo-100 space-y-3.5 text-xs">
                    {/* Math Studio Button */}
                    <button
                      type="button"
                      onClick={() => setIsMathModalOpenRight(true)}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Sigma className="w-4 h-4 text-indigo-200" />
                      <span>Bibliothèque Mathématique & Modèles</span>
                    </button>

                    {/* Interligne / Line height */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Interligne (Espacement des lignes)
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: '1.2', val: 1.2 },
                          { label: '1.4', val: 1.4 },
                          { label: '1.6', val: 1.6 },
                          { label: '2.0', val: 2.0 },
                        ].map((lh) => {
                          const isSel = (selectedBlock.styles.lineHeight || 1.6) === lh.val;
                          return (
                            <button
                              key={lh.label}
                              type="button"
                              onClick={() => onUpdateBlockStyles({ lineHeight: lh.val })}
                              className={`py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isSel
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {lh.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Couleur de surlignage / Highlight */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Couleur de surlignage (Texte)
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { label: 'Aucun', col: 'transparent' },
                          { label: 'Jaune', col: '#fef08a' },
                          { label: 'Vert', col: '#bbf7d0' },
                          { label: 'Bleu', col: '#bae6fd' },
                          { label: 'Rose', col: '#fbcfe8' },
                          { label: 'Orange', col: '#fed7aa' },
                        ].map((hl) => (
                          <button
                            key={hl.label}
                            type="button"
                            onClick={() => onUpdateBlockStyles({ highlightColor: hl.col })}
                            className={`w-6 h-6 rounded-md border transition-transform cursor-pointer flex items-center justify-center text-[9px] ${
                              (selectedBlock.styles.highlightColor || 'transparent') === hl.col
                                ? 'border-indigo-600 scale-110 ring-2 ring-indigo-300'
                                : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: hl.col === 'transparent' ? '#ffffff' : hl.col }}
                            title={hl.label}
                          >
                            {hl.col === 'transparent' ? '✕' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Marge intérieure (Padding) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Marge intérieure (Padding)
                        </label>
                        <span className="text-[11px] font-mono text-indigo-600 font-bold">
                          {selectedBlock.styles.padding ?? 8}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={selectedBlock.styles.padding ?? 8}
                        onChange={(e) => onUpdateBlockStyles({ padding: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* Modèles de Devoirs et Énoncés Prêts à l'Emploi */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Énoncés types prêts à l'emploi :
                      </label>
                      <div className="space-y-1.5">
                        {[
                          {
                            title: 'Équation quadratique et discriminant',
                            text: "Résoudre dans $\\mathbb{R}$ l'équation suivante : $2x^2 - 5x + 2 = 0$.\n1. Calculer le discriminant $\\Delta = b^2 - 4ac$.\n2. En déduire les solutions réelles $x_1$ et $x_2$.",
                          },
                          {
                            title: 'Calcul de fractions et puissances',
                            text: 'Simplifier l’expression suivante sous la forme d’une fraction irréductible :\n$A = \\frac{\\frac{3}{4} + \\frac{1}{2}}{\\frac{5}{6}} \\times 10^3$',
                          },
                          {
                            title: 'Système d’équations (2 inconnues)',
                            text: 'Résoudre le système d’équations suivant par substitution ou combinaison :\n$\\begin{cases} 2x + 3y = 13 \\\\ x - y = 1 \\end{cases}$',
                          },
                          {
                            title: 'مسألة رياضية بالعربية (المعادلات)',
                            text: 'حل في مجموعة الأعداد الحقيقية $\\mathbb{R}$ المعادلة التالية :\n$3x - 5 = 2x + 7$\n1. أوجد قيمة المجهول $x$.\n2. تحقق من صحة النتيجة بتعويض $x$.',
                          },
                        ].map((sample) => (
                          <button
                            key={sample.title}
                            type="button"
                            onClick={() => onUpdateBlockContent({ text: sample.text })}
                            className="w-full p-2 text-left bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors cursor-pointer group"
                          >
                            <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-700 block">
                              {sample.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-serif line-clamp-1 mt-0.5">
                              {sample.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal mathématique accessible depuis le volet latéral */}
            {selectedBlock.type === 'text' && (
              <MathSymbolLibraryModal
                isOpen={isMathModalOpenRight}
                onClose={() => setIsMathModalOpenRight(false)}
                onInsert={(formula) => {
                  const prev = selectedBlock.content.text || '';
                  const updated = prev ? `${prev} $${formula}$` : `$${formula}$`;
                  onUpdateBlockContent({ text: updated });
                }}
                isArabic={
                  documentSettings.activeLanguage === 'ar' ||
                  selectedBlock.styles.textDirection === 'rtl'
                }
              />
            )}

            {/* QCM Exam Specific Properties - Système complet en cascade (Axes 1, 2, 3, 4) */}
            {selectedBlock.type === 'qcm_exam' && (() => {
              const isArDoc =
                documentSettings.activeLanguage === 'ar' ||
                selectedBlock.styles.languageMode === 'ar';

              const sub = selectedBlock.content.selectedSubElement || { type: 'block' };
              const questions: QCMExamQuestion[] = selectedBlock.content.questions || [];

              const currentQId = sub.questionId || (questions[0] ? questions[0].id : '');
              const currentQ = questions.find((q) => q.id === currentQId) || questions[0];
              const selectedQIds =
                sub.questionIds && sub.questionIds.length > 0
                  ? sub.questionIds
                  : currentQ
                  ? [currentQ.id]
                  : [];

              const currentOptId = sub.optionId;
              const parentQOfOpt =
                questions.find((q) => q.options.some((o) => o.id === currentOptId)) || currentQ;
              const currentOpt =
                parentQOfOpt?.options.find((o) => o.id === currentOptId) ||
                parentQOfOpt?.options[0];
              const selectedOptIds =
                sub.optionIds && sub.optionIds.length > 0
                  ? sub.optionIds
                  : currentOpt
                  ? [currentOpt.id]
                  : [];

              const updateQuestions = (updater: (q: QCMExamQuestion) => QCMExamQuestion) => {
                const updated = questions.map((q) => {
                  if (selectedQIds.includes(q.id)) {
                    return updater(q);
                  }
                  return q;
                });
                onUpdateBlockContent({ questions: updated });
              };

              const updateOptions = (updater: (opt: QCMExamOption) => QCMExamOption) => {
                const updated = questions.map((q) => ({
                  ...q,
                  options: q.options.map((opt) => {
                    if (selectedOptIds.includes(opt.id)) {
                      return updater(opt);
                    }
                    return opt;
                  }),
                }));
                onUpdateBlockContent({ questions: updated });
              };

              return (
                <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                  <button
                    type="button"
                    onClick={() => toggleSection('specific')}
                    className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Configuration du QCM</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openSections.specific ? '' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {openSections.specific && (
                    <div className="p-3 bg-white border-t border-slate-200/70 space-y-3.5 text-xs">
                      {/* Breadcrumb / Niveau de sélection en cascade */}
                      <div className="p-2 rounded-lg bg-slate-100/80 border border-slate-200 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Niveau sélectionné :
                          </span>
                          {sub.type !== 'block' && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateBlockContent({ selectedSubElement: { type: 'block' } })
                              }
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                            >
                              <Undo2 className="w-3 h-3" />
                              <span>Tout le bloc</span>
                            </button>
                          )}
                        </div>

                        {/* Navigation Tabs */}
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({ selectedSubElement: { type: 'block' } })
                            }
                            className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              sub.type === 'block' || sub.type === 'title'
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                          >
                            Bloc
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({
                                selectedSubElement: {
                                  type: 'question',
                                  questionId: currentQ?.id || 'q_1',
                                  questionIds: [currentQ?.id || 'q_1'],
                                },
                              })
                            }
                            className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              sub.type === 'question'
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                          >
                            Question
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({
                                selectedSubElement: {
                                  type: 'option',
                                  questionId: parentQOfOpt?.id || 'q_1',
                                  optionId: currentOpt?.id || 'opt_1',
                                  optionIds: [currentOpt?.id || 'opt_1'],
                                },
                              })
                            }
                            className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              sub.type === 'option'
                                ? 'bg-indigo-600 text-white shadow-2xs'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                          >
                            Option
                          </button>
                        </div>
                      </div>

                      {/* ========================================================= */}
                      {/* AXE 2: CONFIGURATION DES QUESTIONS (INDIVIDUELLE / MULTI) */}
                      {/* ========================================================= */}
                      {sub.type === 'question' && (
                        <div className="space-y-3 p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/20">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                              <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                              <span>
                                {selectedQIds.length > 1
                                  ? `${selectedQIds.length} Questions sélectionnées`
                                  : `Question ${questions.findIndex((q) => q.id === currentQId) + 1}`}
                              </span>
                            </span>
                            {selectedQIds.length > 1 && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                                Multi-sélection
                              </span>
                            )}
                          </div>

                          {/* 1. Numérotation de la question (filtrage selon langue!) */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                              Numérotation de la question
                            </label>
                            <select
                              value={currentQ?.numberingStyle || 'paren'}
                              onChange={(e) =>
                                updateQuestions((q) => ({
                                  ...q,
                                  numberingStyle: e.target.value as any,
                                }))
                              }
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-pointer outline-none focus:border-indigo-500"
                            >
                              <option value="number">Chiffres avec parenthèse : 1) / (1)</option>
                              <option value="dot">Chiffres avec point : 1.</option>
                              <option value="dash">Chiffres avec tiret : 1 -</option>
                              <option value="both_paren">Chiffres entre parenthèses : (1)</option>
                              {/* RÈGLE IMPORTANTE: Lettres arabes affichées UNIQUEMENT en Arabe */}
                              {isArDoc && (
                                <option value="letter_ar">
                                  Lettres arabes : أ - ، ب - ، ج -
                                </option>
                              )}
                              <option value="letter">Lettres latines : A. , B. , C.</option>
                              <option value="icon">Icône graphique (Star, Arrow, Check...)</option>
                              <option value="none">Aucune numérotation</option>
                            </select>
                          </div>

                          {/* 2. Bibliothèque d'icônes (si type icône sélectionné) */}
                          {currentQ?.numberingStyle === 'icon' && (
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                                Choisir l'icône de question
                              </label>
                              <div className="grid grid-cols-4 gap-1">
                                {[
                                  { id: 'bullet', label: 'Puce', icon: '•' },
                                  { id: 'star', label: 'Étoile', icon: '★' },
                                  { id: 'arrow', label: 'Flèche', icon: '➔' },
                                  { id: 'check', label: 'Coche', icon: '✓' },
                                  { id: 'diamond', label: 'Losange', icon: '◆' },
                                  { id: 'circle_dot', label: 'Pointé', icon: '⊙' },
                                  { id: 'square_small', label: 'Carré', icon: '■' },
                                ].map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                      updateQuestions((q) => ({
                                        ...q,
                                        iconName: item.id as any,
                                      }))
                                    }
                                    className={`py-1.5 px-1 rounded-lg border text-center font-bold text-xs flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                                      (currentQ.iconName || 'bullet') === item.id
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span className="text-sm leading-none">{item.icon}</span>
                                    <span className="text-[9px] font-medium">{item.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. Disposition (Layout) réglable par question */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                              Colonnes pour cette question
                            </label>
                            <div className="grid grid-cols-5 gap-1">
                              {[
                                { id: 'horizontal_row', label: '1 ligne' },
                                { id: 1, label: '1 col' },
                                { id: 2, label: '2 cols' },
                                { id: 3, label: '3 cols' },
                                { id: 4, label: '4 cols' },
                              ].map((layout) => (
                                <button
                                  key={String(layout.id)}
                                  type="button"
                                  onClick={() =>
                                    updateQuestions((q) => ({
                                      ...q,
                                      optionColumns: layout.id as any,
                                    }))
                                  }
                                  className={`py-1 rounded-lg border text-center font-bold text-[10px] transition-all cursor-pointer ${
                                    (currentQ?.optionColumns ||
                                      selectedBlock.content.optionColumns ||
                                      3) === layout.id
                                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {layout.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Typographie de la question */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                              Police de l'énoncé
                            </label>
                            <select
                              value={
                                currentQ?.fontFamily ||
                                selectedBlock.styles.statementFontFamily ||
                                'inherit'
                              }
                              onChange={(e) =>
                                updateQuestions((q) => ({ ...q, fontFamily: e.target.value }))
                              }
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-pointer"
                            >
                              <option value="inherit">Par défaut du bloc</option>
                              {fonts.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Taille & Couleur */}
                          <div className="flex items-center gap-2">
                            <div className="w-1/2">
                              <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                                Taille ({currentQ?.fontSize || selectedBlock.styles.statementFontSize || 15}px)
                              </label>
                              <input
                                type="range"
                                min="12"
                                max="24"
                                value={
                                  currentQ?.fontSize ||
                                  selectedBlock.styles.statementFontSize ||
                                  15
                                }
                                onChange={(e) =>
                                  updateQuestions((q) => ({
                                    ...q,
                                    fontSize: Number(e.target.value),
                                  }))
                                }
                                className="w-full accent-indigo-600"
                              />
                            </div>

                            <div className="w-1/2">
                              <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                                Couleur texte
                              </label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="color"
                                  value={currentQ?.color || selectedBlock.styles.color || '#0f172a'}
                                  onChange={(e) =>
                                    updateQuestions((q) => ({ ...q, color: e.target.value }))
                                  }
                                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0"
                                />
                                <span className="text-[11px] font-mono text-slate-600 truncate">
                                  {currentQ?.color || '#0f172a'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Alignement de la question */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                              Alignement
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { id: 'left', icon: AlignLeft, title: 'Gauche' },
                                { id: 'center', icon: AlignCenter, title: 'Centré' },
                                { id: 'right', icon: AlignRight, title: 'Droite' },
                              ].map((al) => {
                                const Icon = al.icon;
                                const activeAlign =
                                  currentQ?.textAlign || (isArDoc ? 'right' : 'left');
                                return (
                                  <button
                                    key={al.id}
                                    type="button"
                                    onClick={() =>
                                      updateQuestions((q) => ({
                                        ...q,
                                        textAlign: al.id as any,
                                      }))
                                    }
                                    className={`py-1.5 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                                      activeAlign === al.id
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                    title={al.title}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Suppression rapide de la question */}
                          {questions.length > 1 && (
                            <div className="pt-2 border-t border-indigo-100 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const remaining = questions.filter((q) => q.id !== currentQId);
                                  onUpdateBlockContent({
                                    questions: remaining,
                                    selectedSubElement: {
                                      type: 'question',
                                      questionId: remaining[0]?.id || '',
                                      questionIds: [remaining[0]?.id || ''],
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer cette question</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ========================================================= */}
                      {/* AXE 3: CONFIGURATION DES OPTIONS (INDIVIDUELLE / MULTI)   */}
                      {/* ========================================================= */}
                      {sub.type === 'option' && (
                        <div className="space-y-3 p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/20">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                              <span>
                                {selectedOptIds.length > 1
                                  ? `${selectedOptIds.length} Options sélectionnées`
                                  : 'Configuration de l’option'}
                              </span>
                            </span>
                            {selectedOptIds.length > 1 && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                                Multi-sélection
                              </span>
                            )}
                          </div>

                          {/* Mode Solution / Réponse Correcte Toggle */}
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-900">
                              Bonne réponse (Solution)
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={currentOpt?.isCorrect ?? false}
                                onChange={(e) =>
                                  updateOptions((o) => ({ ...o, isCorrect: e.target.checked }))
                                }
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </div>

                          {/* 1. Forme du marqueur / case à cocher */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                              Forme du marqueur / case
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {[
                                { id: 'square', label: 'Carré classique [☐]' },
                                { id: 'rounded_square', label: 'Carré arrondi' },
                                { id: 'circle', label: 'Cercle (○)' },
                                { id: 'none', label: 'Aucune case' },
                              ].map((sh) => (
                                <button
                                  key={sh.id}
                                  type="button"
                                  onClick={() =>
                                    updateOptions((o) => ({
                                      ...o,
                                      markerShape: sh.id as any,
                                    }))
                                  }
                                  className={`py-1.5 px-2 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                                    (currentOpt?.markerShape || 'square') === sh.id
                                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {sh.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Rayon des coins pour carré arrondi */}
                          {currentOpt?.markerShape === 'rounded_square' && (
                            <div>
                              <div className="flex justify-between items-center mb-0.5">
                                <label className="text-[10px] font-bold text-slate-400">
                                  Rayon d'arrondi ({currentOpt.borderRadius || 6}px)
                                </label>
                              </div>
                              <input
                                type="range"
                                min="2"
                                max="12"
                                value={currentOpt.borderRadius || 6}
                                onChange={(e) =>
                                  updateOptions((o) => ({
                                    ...o,
                                    borderRadius: Number(e.target.value),
                                  }))
                                }
                                className="w-full accent-indigo-600"
                              />
                            </div>
                          )}

                          {/* 2. Préfixe des options (avec activation/désactivation & filtrage de langue!) */}
                          <div className="space-y-2 pt-1 border-t border-indigo-100">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">
                                Préfixe de l'option
                              </label>
                              <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={currentOpt?.showPrefix ?? true}
                                  onChange={(e) =>
                                    updateOptions((o) => ({
                                      ...o,
                                      showPrefix: e.target.checked,
                                    }))
                                  }
                                  className="rounded text-indigo-600 accent-indigo-600"
                                />
                                <span>Activer</span>
                              </label>
                            </div>

                            {currentOpt?.showPrefix !== false && (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-0.5">
                                    Type
                                  </label>
                                  <select
                                    value={currentOpt?.prefixType || 'letter'}
                                    onChange={(e) =>
                                      updateOptions((o) => ({
                                        ...o,
                                        prefixType: e.target.value as any,
                                      }))
                                    }
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                                  >
                                    {/* RÈGLE IMPORTANTE: Lettres arabes proposées UNIQUEMENT en Arabe */}
                                    {isArDoc && (
                                      <option value="letter_ar">Lettres arabes (أ، ب، ج)</option>
                                    )}
                                    <option value="letter">Lettres majuscules (A, B, C)</option>
                                    <option value="letter_lower">
                                      Lettres minuscules (a, b, c)
                                    </option>
                                    <option value="number">Chiffres (1, 2, 3)</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block uppercase mb-0.5">
                                    Séparateur
                                  </label>
                                  <select
                                    value={currentOpt?.prefixSeparator || 'paren'}
                                    onChange={(e) =>
                                      updateOptions((o) => ({
                                        ...o,
                                        prefixSeparator: e.target.value as any,
                                      }))
                                    }
                                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                                  >
                                    <option value="paren">Parenthèse : a)</option>
                                    <option value="dot">Point : a.</option>
                                    <option value="dash">Tiret : a -</option>
                                    <option value="both_paren">Double parenthèse : (a)</option>
                                    <option value="none">Aucun : a</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Typographie de l'option */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                              Police de l'option
                            </label>
                            <select
                              value={
                                currentOpt?.fontFamily ||
                                selectedBlock.styles.optionFontFamily ||
                                'inherit'
                              }
                              onChange={(e) =>
                                updateOptions((o) => ({ ...o, fontFamily: e.target.value }))
                              }
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-pointer"
                            >
                              <option value="inherit">Par défaut du bloc</option>
                              {fonts.map((f) => (
                                <option key={f.value} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Taille & Couleur texte */}
                          <div className="flex items-center gap-2">
                            <div className="w-1/2">
                              <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                                Taille ({currentOpt?.fontSize || selectedBlock.styles.optionFontSize || 14}px)
                              </label>
                              <input
                                type="range"
                                min="11"
                                max="22"
                                value={
                                  currentOpt?.fontSize ||
                                  selectedBlock.styles.optionFontSize ||
                                  14
                                }
                                onChange={(e) =>
                                  updateOptions((o) => ({
                                    ...o,
                                    fontSize: Number(e.target.value),
                                  }))
                                }
                                className="w-full accent-indigo-600"
                              />
                            </div>

                            <div className="w-1/2">
                              <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                                Couleur texte
                              </label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="color"
                                  value={currentOpt?.color || selectedBlock.styles.color || '#0f172a'}
                                  onChange={(e) =>
                                    updateOptions((o) => ({ ...o, color: e.target.value }))
                                  }
                                  className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0"
                                />
                                <span className="text-[11px] font-mono text-slate-600 truncate">
                                  {currentOpt?.color || '#0f172a'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Couleur de fond de l'option */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                              Couleur de fond de l'option
                            </label>
                            <div className="flex items-center gap-1.5">
                              {[
                                { color: '#ffffff', label: 'Blanc' },
                                { color: '#f8fafc', label: 'Gris' },
                                { color: '#ecfdf5', label: 'Vert' },
                                { color: '#eef2ff', label: 'Bleu' },
                                { color: '#fffbeb', label: 'Ambre' },
                              ].map((bg) => (
                                <button
                                  key={bg.color}
                                  type="button"
                                  onClick={() =>
                                    updateOptions((o) => ({
                                      ...o,
                                      backgroundColor: bg.color,
                                    }))
                                  }
                                  className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                                    (currentOpt?.backgroundColor || '#ffffff') === bg.color
                                      ? 'border-indigo-600 ring-1 ring-indigo-500 font-black'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                  style={{ backgroundColor: bg.color }}
                                >
                                  {bg.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Suppression de l'option */}
                          {parentQOfOpt && parentQOfOpt.options.length > 1 && (
                            <div className="pt-2 border-t border-indigo-100 flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedQuestions = questions.map((q) => {
                                    if (q.id !== parentQOfOpt.id) return q;
                                    return {
                                      ...q,
                                      options: q.options.filter((o) => o.id !== currentOptId),
                                    };
                                  });
                                  onUpdateBlockContent({
                                    questions: updatedQuestions,
                                    selectedSubElement: {
                                      type: 'question',
                                      questionId: parentQOfOpt.id,
                                      questionIds: [parentQOfOpt.id],
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer cette option</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ========================================================= */}
                      {/* PROPRIÉTÉS UNIFIÉES DU BLOC QCM & DU TITRE (POINT 1)     */}
                      {/* ========================================================= */}
                      {(sub.type === 'block' || sub.type === 'title') && (
                        <div className="space-y-3.5">
                          {/* POINT 2: Mode Corrigé (Solution) */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Mode Corrigé</span>
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedBlock.content.showAnswers ?? false}
                                  onChange={(e) =>
                                    onUpdateBlockContent({ showAnswers: e.target.checked })
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                            <p className="text-[10px] text-emerald-800 leading-tight">
                              {selectedBlock.content.showAnswers
                                ? 'Activé : les réponses correctes sont cochées et mises en valeur sur la page.'
                                : 'Désactivé : affiche le QCM vierge sans les réponses (version élève).'}
                            </p>
                          </div>

                          {/* POINT 1, 3, 4, 5: Propriétés d'apparence du Titre / Énoncé */}
                          <div className="p-2.5 rounded-xl border border-indigo-200/80 bg-indigo-50/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                                <Type className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Titre / Énoncé global</span>
                              </span>
                              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedBlock.content.showInstruction ?? false}
                                  onChange={(e) =>
                                    onUpdateBlockContent({ showInstruction: e.target.checked })
                                  }
                                  className="rounded text-indigo-600 accent-indigo-600"
                                />
                                <span>Afficher</span>
                              </label>
                            </div>

                            {selectedBlock.content.showInstruction && (
                              <div className="space-y-3 pt-1 border-t border-indigo-100/80">
                                {/* Numérotation du titre (5 modèles + Personnalisé) */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1.5 flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                      <ListOrdered className="w-3 h-3 text-indigo-600" />
                                      <span>Numérotation du titre</span>
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-normal">5 modèles</span>
                                  </label>
                                  <div className="grid grid-cols-5 gap-1 mb-1.5">
                                    {TITLE_NUMBERING_OPTIONS.map((opt) => {
                                      const currentNum = selectedBlock.content.instructionNumbering || 'none';
                                      const isCurrent =
                                        currentNum === opt.id ||
                                        (opt.id === 'paren' && currentNum === '1)') ||
                                        (opt.id === 'letters' && (currentNum === 'A.' || currentNum === 'A)')) ||
                                        (opt.id === 'roman' && (currentNum === 'I.' || currentNum === 'roman')) ||
                                        (opt.id === 'none' && currentNum === 'none');
                                      return (
                                        <button
                                          key={opt.id}
                                          type="button"
                                          onClick={() =>
                                            onUpdateBlockContent({
                                              instructionNumbering: opt.id as any,
                                            })
                                          }
                                          title={opt.label}
                                          className={`py-1 px-0.5 rounded-lg border text-center transition-all cursor-pointer ${
                                            isCurrent
                                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs font-bold ring-1 ring-indigo-300'
                                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                          }`}
                                        >
                                          <div className="text-xs font-bold">{opt.preview}</div>
                                          <div className="text-[8px] truncate text-slate-400 mt-0.5">
                                            {opt.shortLabel}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Selecteur complémentaire avec mode Personnalisé */}
                                  <div className="flex items-center gap-1.5">
                                    <select
                                      value={
                                        ['1.', '1)', 'A.', 'A)', 'roman', 'paren', 'letters', 'bullet', 'none', 'custom'].includes(
                                          selectedBlock.content.instructionNumbering || ''
                                        )
                                          ? selectedBlock.content.instructionNumbering
                                          : 'none'
                                      }
                                      onChange={(e) =>
                                        onUpdateBlockContent({
                                          instructionNumbering: e.target.value as any,
                                        })
                                      }
                                      className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs cursor-pointer outline-none focus:border-indigo-500"
                                    >
                                      <option value="none">Aucune numérotation</option>
                                      <option value="1)">Chiffres avec parenthèse : 1)</option>
                                      <option value="1.">Chiffres avec point : 1.</option>
                                      <option value="A)">Lettres : A)</option>
                                      <option value="roman">Chiffres romains : I)</option>
                                      <option value="bullet">Puce simple : •</option>
                                      <option value="custom">Personnalisé (ex: QCM 1 :)</option>
                                    </select>
                                  </div>

                                  {selectedBlock.content.instructionNumbering === 'custom' && (
                                    <div className="mt-1.5">
                                      <input
                                        type="text"
                                        placeholder="ex: QCM 1 :, Exercice 1 -, سؤال 1 :"
                                        value={selectedBlock.content.instructionCustomPrefix || ''}
                                        onChange={(e) =>
                                          onUpdateBlockContent({
                                            instructionCustomPrefix: e.target.value,
                                          })
                                        }
                                        className="w-full px-2.5 py-1 bg-white border border-indigo-300 rounded-lg text-slate-800 font-semibold text-xs outline-none focus:border-indigo-500"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Police du titre */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                                    Police du titre
                                  </label>
                                  <select
                                    value={
                                      selectedBlock.styles.instructionFontFamily ||
                                      selectedBlock.styles.fontFamily ||
                                      'inherit'
                                    }
                                    onChange={(e) =>
                                      onUpdateBlockStyles({ instructionFontFamily: e.target.value })
                                    }
                                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold cursor-pointer text-xs"
                                  >
                                    <option value="inherit">Par défaut du document</option>
                                    {fonts.map((f) => (
                                      <option key={f.value} value={f.value}>
                                        {f.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Taille & Formatage (B, I, U) */}
                                <div className="flex items-center gap-2">
                                  <div className="w-1/2">
                                    <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                                      Taille ({selectedBlock.styles.instructionFontSize || 14}px)
                                    </label>
                                    <input
                                      type="range"
                                      min="11"
                                      max="28"
                                      value={selectedBlock.styles.instructionFontSize || 14}
                                      onChange={(e) =>
                                        onUpdateBlockStyles({
                                          instructionFontSize: Number(e.target.value),
                                        })
                                      }
                                      className="w-full accent-indigo-600"
                                    />
                                  </div>

                                  {/* Formatage : B, I, U */}
                                  <div className="w-1/2 flex items-center gap-1 justify-end pt-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateBlockStyles({
                                          instructionFontWeight:
                                            selectedBlock.styles.instructionFontWeight === 'bold'
                                              ? 'normal'
                                              : 'bold',
                                        })
                                      }
                                      className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                                        selectedBlock.styles.instructionFontWeight === 'bold'
                                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                      }`}
                                      title="Gras (B)"
                                    >
                                      <Bold className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateBlockStyles({
                                          instructionFontStyle:
                                            selectedBlock.styles.instructionFontStyle === 'italic'
                                              ? 'normal'
                                              : 'italic',
                                        })
                                      }
                                      className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                                        selectedBlock.styles.instructionFontStyle === 'italic'
                                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                      }`}
                                      title="Italique (I)"
                                    >
                                      <Italic className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateBlockStyles({
                                          instructionTextDecoration:
                                            selectedBlock.styles.instructionTextDecoration ===
                                            'underline'
                                              ? 'none'
                                              : 'underline',
                                        })
                                      }
                                      className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                                        selectedBlock.styles.instructionTextDecoration ===
                                        'underline'
                                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                      }`}
                                      title="Souligné (U)"
                                    >
                                      <Underline className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Alignement du texte (avec inversion automatique en version Arabe) */}
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                                      Alignement du titre
                                    </label>
                                    {isArDoc && (
                                      <span className="text-[9px] text-amber-600 font-semibold">
                                        Sens RTL (Arabe)
                                      </span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {(isArDoc
                                      ? [
                                          { id: 'right', icon: AlignRight, title: 'Droite (اليَمِين)', label: 'Droite' },
                                          { id: 'center', icon: AlignCenter, title: 'Centré (وَسَط)', label: 'Centre' },
                                          { id: 'left', icon: AlignLeft, title: 'Gauche (اليَسَار)', label: 'Gauche' },
                                        ]
                                      : [
                                          { id: 'left', icon: AlignLeft, title: 'Gauche', label: 'Gauche' },
                                          { id: 'center', icon: AlignCenter, title: 'Centré', label: 'Centre' },
                                          { id: 'right', icon: AlignRight, title: 'Droite', label: 'Droite' },
                                        ]
                                    ).map((align) => {
                                      const Icon = align.icon;
                                      const currentAlign =
                                        selectedBlock.styles.instructionTextAlign ||
                                        (isArDoc ? 'right' : 'left');
                                      const isCurrent = currentAlign === align.id;
                                      return (
                                        <button
                                          key={align.id}
                                          type="button"
                                          onClick={() =>
                                            onUpdateBlockStyles({
                                              instructionTextAlign: align.id as any,
                                            })
                                          }
                                          title={align.title}
                                          className={`py-1.5 flex items-center justify-center gap-1.5 rounded-lg border transition-all cursor-pointer ${
                                            isCurrent
                                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-2xs'
                                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                          }`}
                                        >
                                          <Icon className="w-3.5 h-3.5" />
                                          <span className="text-[10px]">{align.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Couleur du texte */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                                    Couleur texte
                                  </label>
                                  <div className="flex items-center gap-1.5">
                                    {['#0f172a', '#1e293b', '#475569', '#2563eb', '#dc2626', '#16a34a'].map(
                                      (col) => (
                                        <button
                                          key={col}
                                          type="button"
                                          onClick={() =>
                                            onUpdateBlockStyles({ instructionColor: col })
                                          }
                                          className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                                            (selectedBlock.styles.instructionColor || '#0f172a') === col
                                              ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                                              : 'border-slate-300'
                                          }`}
                                          style={{ backgroundColor: col }}
                                        />
                                      )
                                    )}
                                    <input
                                      type="color"
                                      value={selectedBlock.styles.instructionColor || '#0f172a'}
                                      onChange={(e) =>
                                        onUpdateBlockStyles({ instructionColor: e.target.value })
                                      }
                                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                                      title="Couleur personnalisée"
                                    />
                                    <span className="text-[11px] font-mono text-slate-600 truncate">
                                      {selectedBlock.styles.instructionColor || '#0f172a'}
                                    </span>
                                  </div>
                                </div>

                                {/* Couleur de fond du titre (avec option Aucune/Transparent) */}
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                                    Couleur de fond
                                  </label>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateBlockStyles({
                                          instructionBackgroundColor: 'transparent',
                                        })
                                      }
                                      className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                        !selectedBlock.styles.instructionBackgroundColor ||
                                        selectedBlock.styles.instructionBackgroundColor ===
                                          'transparent'
                                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-300'
                                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                      }`}
                                      title="Transparent / Aucune couleur"
                                    >
                                      <Ban className="w-3 h-3 text-slate-400" />
                                      <span>Aucune</span>
                                    </button>

                                    {[
                                      { color: '#ffffff', label: 'Blanc' },
                                      { color: '#f8fafc', label: 'Gris' },
                                      { color: '#eef2ff', label: 'Bleu' },
                                      { color: '#ecfdf5', label: 'Vert' },
                                      { color: '#fffbeb', label: 'Ambre' },
                                    ].map((bg) => (
                                      <button
                                        key={bg.color}
                                        type="button"
                                        onClick={() =>
                                          onUpdateBlockStyles({
                                            instructionBackgroundColor: bg.color,
                                          })
                                        }
                                        className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                                          selectedBlock.styles.instructionBackgroundColor ===
                                          bg.color
                                            ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                                            : 'border-slate-300'
                                        }`}
                                        style={{ backgroundColor: bg.color }}
                                        title={bg.label}
                                      />
                                    ))}
                                    <input
                                      type="color"
                                      value={
                                        selectedBlock.styles.instructionBackgroundColor &&
                                        selectedBlock.styles.instructionBackgroundColor !==
                                          'transparent'
                                          ? selectedBlock.styles.instructionBackgroundColor
                                          : '#ffffff'
                                      }
                                      onChange={(e) =>
                                        onUpdateBlockStyles({
                                          instructionBackgroundColor: e.target.value,
                                        })
                                      }
                                      className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer"
                                      title="Couleur personnalisée"
                                    />
                                  </div>
                                </div>

                                {/* Rayon d'arrondi des bords */}
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                                      Rayon d'arrondi des bords
                                    </label>
                                    <span className="text-[11px] font-mono text-indigo-600 font-bold">
                                      {selectedBlock.styles.instructionBorderRadius || 0}px
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="range"
                                      min="0"
                                      max="32"
                                      value={selectedBlock.styles.instructionBorderRadius || 0}
                                      onChange={(e) =>
                                        onUpdateBlockStyles({
                                          instructionBorderRadius: Number(e.target.value),
                                        })
                                      }
                                      className="flex-1 accent-indigo-600"
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      max="32"
                                      value={selectedBlock.styles.instructionBorderRadius || 0}
                                      onChange={(e) =>
                                        onUpdateBlockStyles({
                                          instructionBorderRadius: Math.max(
                                            0,
                                            Math.min(32, Number(e.target.value))
                                          ),
                                        })
                                      }
                                      className="w-12 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-center text-xs font-mono font-bold"
                                    />
                                  </div>
                                </div>

                                {/* Bordure : Activation, Épaisseur, Couleur, Style */}
                                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-slate-700 uppercase">
                                      Bordure
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const isActive =
                                          (selectedBlock.styles.instructionBorderWidth || 0) > 0 &&
                                          selectedBlock.styles.instructionBorderStyle !== 'none';
                                        if (isActive) {
                                          onUpdateBlockStyles({
                                            instructionBorderWidth: 0,
                                            instructionBorderStyle: 'none',
                                          });
                                        } else {
                                          onUpdateBlockStyles({
                                            instructionBorderWidth:
                                              selectedBlock.styles.instructionBorderWidth || 1,
                                            instructionBorderStyle:
                                              selectedBlock.styles.instructionBorderStyle &&
                                              selectedBlock.styles.instructionBorderStyle !== 'none'
                                                ? selectedBlock.styles.instructionBorderStyle
                                                : 'solid',
                                            instructionBorderColor:
                                              selectedBlock.styles.instructionBorderColor ||
                                              '#cbd5e1',
                                          });
                                        }
                                      }}
                                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                        (selectedBlock.styles.instructionBorderWidth || 0) > 0 &&
                                        selectedBlock.styles.instructionBorderStyle !== 'none'
                                          ? 'bg-indigo-600 text-white shadow-2xs'
                                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                      }`}
                                    >
                                      {(selectedBlock.styles.instructionBorderWidth || 0) > 0 &&
                                      selectedBlock.styles.instructionBorderStyle !== 'none'
                                        ? 'Active'
                                        : 'Désactivée'}
                                    </button>
                                  </div>

                                  {(selectedBlock.styles.instructionBorderWidth || 0) > 0 &&
                                    selectedBlock.styles.instructionBorderStyle !== 'none' && (
                                      <div className="space-y-2 pt-1 border-t border-slate-200/80">
                                        {/* Style de bordure : Pleine vs Pointillée */}
                                        <div>
                                          <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">
                                            Style de bordure
                                          </label>
                                          <div className="grid grid-cols-2 gap-1.5">
                                            {[
                                              { id: 'solid', label: 'Pleine' },
                                              { id: 'dashed', label: 'Pointillée' },
                                            ].map((st) => (
                                              <button
                                                key={st.id}
                                                type="button"
                                                onClick={() =>
                                                  onUpdateBlockStyles({
                                                    instructionBorderStyle: st.id as any,
                                                  })
                                                }
                                                className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                                  (selectedBlock.styles.instructionBorderStyle ||
                                                    'solid') === st.id
                                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                              >
                                                {st.label}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Épaisseur */}
                                        <div>
                                          <div className="flex items-center justify-between mb-0.5">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">
                                              Épaisseur
                                            </label>
                                            <span className="text-[10px] font-mono text-indigo-600 font-bold">
                                              {selectedBlock.styles.instructionBorderWidth || 1}px
                                            </span>
                                          </div>
                                          <input
                                            type="range"
                                            min="1"
                                            max="8"
                                            value={
                                              selectedBlock.styles.instructionBorderWidth || 1
                                            }
                                            onChange={(e) =>
                                              onUpdateBlockStyles({
                                                instructionBorderWidth: Number(e.target.value),
                                              })
                                            }
                                            className="w-full accent-indigo-600"
                                          />
                                        </div>

                                        {/* Couleur de bordure */}
                                        <div>
                                          <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">
                                            Couleur de bordure
                                          </label>
                                          <div className="flex items-center gap-1.5">
                                            {[
                                              '#cbd5e1',
                                              '#94a3b8',
                                              '#475569',
                                              '#3b82f6',
                                              '#ef4444',
                                              '#10b981',
                                            ].map((col) => (
                                              <button
                                                key={col}
                                                type="button"
                                                onClick={() =>
                                                  onUpdateBlockStyles({
                                                    instructionBorderColor: col,
                                                  })
                                                }
                                                className={`w-5 h-5 rounded border transition-transform cursor-pointer ${
                                                  (selectedBlock.styles.instructionBorderColor ||
                                                    '#cbd5e1') === col
                                                    ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                                                    : 'border-slate-300'
                                                }`}
                                                style={{ backgroundColor: col }}
                                              />
                                            ))}
                                            <input
                                              type="color"
                                              value={
                                                selectedBlock.styles.instructionBorderColor ||
                                                '#cbd5e1'
                                              }
                                              onChange={(e) =>
                                                onUpdateBlockStyles({
                                                  instructionBorderColor: e.target.value,
                                                })
                                              }
                                              className="w-6 h-6 rounded border border-slate-200 p-0.5 cursor-pointer"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </div>

                                {/* POINT 5: Casse du texte (2 options uniquement: Normal et MAJUSCULES, masqué en Arabe) */}
                                {!isArDoc && (
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                                      Casse du texte
                                    </label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                      {[
                                        { id: 'none', label: 'Normal' },
                                        { id: 'uppercase', label: 'MAJUSCULES' },
                                      ].map((c) => (
                                        <button
                                          key={c.id}
                                          type="button"
                                          onClick={() =>
                                            onUpdateBlockStyles({
                                              instructionTextTransform: c.id as any,
                                            })
                                          }
                                          className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                            (selectedBlock.styles.instructionTextTransform ||
                                              'none') === c.id
                                              ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-2xs'
                                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                          }`}
                                        >
                                          {c.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Changer de question / Liste des questions */}
                          <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">
                              Changer de question
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {questions.map((q, idx) => (
                                <button
                                  key={q.id}
                                  type="button"
                                  onClick={() =>
                                    onUpdateBlockContent({
                                      selectedSubElement: {
                                        type: 'question',
                                        questionId: q.id,
                                        questionIds: [q.id],
                                      },
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600"
                                >
                                  Q{idx + 1}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newQ: QCMExamQuestion = {
                                    id: `q_${Date.now()}`,
                                    statement: isArDoc
                                      ? 'العبارة التالية تساوي :'
                                      : 'Calculer l’expression suivante :',
                                    options: [
                                      { id: `opt_${Date.now()}_1`, text: '10', isCorrect: false },
                                      { id: `opt_${Date.now()}_2`, text: '20', isCorrect: false },
                                      { id: `opt_${Date.now()}_3`, text: '30', isCorrect: true },
                                    ],
                                  };
                                  onUpdateBlockContent({
                                    questions: [...questions, newQ],
                                    selectedSubElement: {
                                      type: 'question',
                                      questionId: newQ.id,
                                      questionIds: [newQ.id],
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1 cursor-pointer"
                                title="Ajouter une nouvelle question"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Ajouter</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Exercise Header Specific Properties */}
            {selectedBlock.type === 'exercise_header' && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => toggleSection('specific')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Propriétés de l'En-tête</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.specific ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.specific && (
                  <div className="p-3 bg-white border-t border-slate-200/70 space-y-3 text-xs">
                    {/* 1. Titre de l'exercice */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Titre de l'exercice
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.content.exerciseTitle || ''}
                        onChange={(e) =>
                          onUpdateBlockContent({ exerciseTitle: e.target.value })
                        }
                        placeholder="Ex: Exercice 1 / تمرين 1"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>

                    {/* 2. Barème */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Barème (Points)
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.content.points || ''}
                        onChange={(e) =>
                          onUpdateBlockContent({ points: e.target.value })
                        }
                        placeholder="Ex: 5 points / 5 نقاط"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none focus:border-indigo-500 focus:bg-white"
                      />
                    </div>

                    {/* 3. Position du barème */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Position du barème
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'right', label: 'À droite' },
                          { id: 'left', label: 'À gauche' },
                          { id: 'below', label: 'En dessous' },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({ pointsPosition: pos.id as any })
                            }
                            className={`py-1.5 px-1 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                              (selectedBlock.content.pointsPosition || 'right') === pos.id
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Style de l'en-tête */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Mise en valeur
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'underlined', label: 'Souligné' },
                          { id: 'simple', label: 'Simple' },
                          { id: 'boxed', label: 'Encadré' },
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({ headerStyle: st.id as any })
                            }
                            className={`py-1.5 px-1 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                              (selectedBlock.content.headerStyle || 'underlined') === st.id
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fill In Blanks Specific Properties */}
            {selectedBlock.type === 'fill_in_blanks' && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => toggleSection('specific')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Exercice à Compléter</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.specific ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.specific && (
                  <div className="p-3 bg-white border-t border-slate-200/70 space-y-3 text-xs">
                    {/* 1. Style des trous soulignés */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Style du soulignement des trous
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'solid', label: 'Trait continu ───' },
                          { id: 'dotted', label: 'Pointillés ······' },
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({ blankLineStyle: st.id as any })
                            }
                            className={`py-1.5 px-2 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                              (selectedBlock.content.blankLineStyle || 'solid') === st.id
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Épaisseur du trait */}
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-[10px] font-bold text-slate-400">
                          Épaisseur du trait ({selectedBlock.content.blankLineWidth || 1.5}px)
                        </label>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.5"
                        value={selectedBlock.content.blankLineWidth || 1.5}
                        onChange={(e) =>
                          onUpdateBlockContent({ blankLineWidth: Number(e.target.value) })
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    {/* 3. Longueur par défaut des trous */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Longueur par défaut des trous
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'short', label: 'Court (40px)' },
                          { id: 'medium', label: 'Moyen (75px)' },
                          { id: 'long', label: 'Long (130px)' },
                        ].map((len) => (
                          <button
                            key={len.id}
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({ defaultBlankLength: len.id as any })
                            }
                            className={`py-1.5 px-1 rounded-lg border text-center font-bold text-[10px] transition-all cursor-pointer ${
                              (selectedBlock.content.defaultBlankLength || 'medium') === len.id
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {len.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Numérotation des lignes */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Numérotation des lignes
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: 'numbers', label: '1), 2), 3)' },
                          { id: 'letters', label: 'a), b), c)' },
                          { id: 'none', label: 'Aucune' },
                        ].map((num) => (
                          <button
                            key={num.id}
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({ numberingStyle: num.id as any })
                            }
                            className={`py-1.5 px-1 rounded-lg border text-center font-bold text-[11px] transition-all cursor-pointer ${
                              (selectedBlock.content.numberingStyle || 'numbers') === num.id
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {num.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 5. Espacement entre les lignes */}
                    <div>
                      <div className="flex justify-between items-center mb-0.5">
                        <label className="text-[10px] font-bold text-slate-400">
                          Espacement entre les lignes ({selectedBlock.styles.lineSpacing || 10}px)
                        </label>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="24"
                        value={selectedBlock.styles.lineSpacing || 10}
                        onChange={(e) =>
                          onUpdateBlockStyles({ lineSpacing: Number(e.target.value) })
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Image Specific Properties */}
            {selectedBlock.type === 'image' && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => toggleSection('specific')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <span>Image & Fichier</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.specific ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.specific && (
                  <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Importer une image
                      </label>
                      <label className="flex items-center justify-center gap-2 p-2 rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 text-indigo-700 font-bold text-xs cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choisir un fichier</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Ou lien URL
                      </label>
                      <input
                        type="text"
                        value={selectedBlock.content.src || ''}
                        onChange={(e) => onUpdateBlockContent({ src: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Shape Specific Properties */}
            {selectedBlock.type === 'shape' && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => toggleSection('specific')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <span>Forme géométrique</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.specific ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.specific && (
                  <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateBlockContent({ shapeType: 'rectangle' })
                        }
                        className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 cursor-pointer ${
                          selectedBlock.content.shapeType !== 'circle'
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <Square className="w-4 h-4" />
                        <span>Rectangle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateBlockContent({ shapeType: 'circle' })
                        }
                        className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-2 cursor-pointer ${
                          selectedBlock.content.shapeType === 'circle'
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <Circle className="w-4 h-4" />
                        <span>Cercle</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. Line Specific Properties */}
            {selectedBlock.type === 'line' && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => toggleSection('specific')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <span>Style de la ligne</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.specific ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.specific && (
                  <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Continu', value: 'solid' },
                        { label: 'Tirets', value: 'dashed' },
                        { label: 'Pointillés', value: 'dotted' },
                      ].map((st) => (
                        <button
                          key={st.value}
                          type="button"
                          onClick={() =>
                            onUpdateBlockStyles({
                              borderStyle: st.value as any,
                            })
                          }
                          className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold cursor-pointer ${
                            (selectedBlock.styles.borderStyle || 'solid') === st.value
                              ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Épaisseur ({selectedBlock.styles.borderWidth || 2}px)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={selectedBlock.styles.borderWidth || 2}
                        onChange={(e) =>
                          onUpdateBlockStyles({ borderWidth: Number(e.target.value) })
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. Answer Zone Specific Properties */}
            {selectedBlock.type === 'answer_zone' && (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
                <button
                  type="button"
                  onClick={() => toggleSection('specific')}
                  className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <span>Zone de réponse élève</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      openSections.specific ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {openSections.specific && (
                  <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                        Type de tracé
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { label: 'Lignes', value: 'lines' },
                          { label: 'Pointillés', value: 'dots' },
                          { label: 'Cadre vide', value: 'box' },
                        ].map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() =>
                              onUpdateBlockContent({ answerType: t.value as any })
                            }
                            className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold cursor-pointer ${
                              (selectedBlock.content.answerType || 'lines') === t.value
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedBlock.content.answerType !== 'box' && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                          Nombre de lignes ({selectedBlock.content.lineCount || 4})
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={selectedBlock.content.lineCount || 4}
                          onChange={(e) =>
                            onUpdateBlockContent({ lineCount: Number(e.target.value) })
                          }
                          className="w-full accent-indigo-600"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 7. Apparence & Bordure (Background, Border, Radius) */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() => toggleSection('appearance')}
                className="w-full p-2.5 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                <span>Apparence du bloc</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    openSections.appearance ? '' : '-rotate-90'
                  }`}
                />
              </button>

              {openSections.appearance && (
                <div className="p-3 bg-white border-t border-slate-200/70 space-y-3">
                  {/* Arrière-plan */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                      Couleur de fond
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[
                        { label: 'Transparent', value: 'transparent' },
                        { label: 'Blanc', value: '#ffffff' },
                        { label: 'Bleu clair', value: '#eff6ff' },
                        { label: 'Gris doux', value: '#f8fafc' },
                        { label: 'Jaune doux', value: '#fefce8' },
                      ].map((bg) => (
                        <button
                          key={bg.value}
                          type="button"
                          onClick={() => onUpdateBlockStyles({ backgroundColor: bg.value })}
                          className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                            (selectedBlock.styles.backgroundColor || 'transparent') === bg.value
                              ? 'border-indigo-600 scale-110 ring-1 ring-indigo-400'
                              : 'border-slate-300'
                          }`}
                          style={{
                            backgroundColor:
                              bg.value === 'transparent' ? '#ffffff' : bg.value,
                            backgroundImage:
                              bg.value === 'transparent'
                                ? 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%, #e2e8f0)'
                                : 'none',
                            backgroundSize: '6px 6px',
                          }}
                          title={bg.label}
                        />
                      ))}
                      <input
                        type="color"
                        value={selectedBlock.styles.backgroundColor || '#ffffff'}
                        onChange={(e) =>
                          onUpdateBlockStyles({ backgroundColor: e.target.value })
                        }
                        className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer"
                        title="Couleur personnalisée"
                      />
                    </div>
                  </div>

                  {/* Rayon des coins */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                      Arrondi des coins ({selectedBlock.styles.borderRadius || 0}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      value={selectedBlock.styles.borderRadius || 0}
                      onChange={(e) =>
                        onUpdateBlockStyles({ borderRadius: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Resize Handle on Left Border (Point 2) */}
      {onStartResize && (
        <div
          onPointerDown={onStartResize}
          title="Glisser pour redimensionner les propriétés (↔)"
          className={`absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-40 group flex items-center justify-center select-none ${
            isResizing ? 'pointer-events-auto' : ''
          }`}
        >
          {/* Vertical highlight line on border */}
          <div
            className={`h-full w-[2px] transition-colors ${
              isResizing
                ? 'bg-indigo-600 shadow-sm'
                : 'bg-transparent group-hover:bg-indigo-400'
            }`}
          />
          {/* Centered pill with double-arrow ↔ */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-7 bg-white border rounded-full flex items-center justify-center transition-all ${
              isResizing
                ? 'border-indigo-600 text-indigo-600 shadow-md ring-2 ring-indigo-100 scale-110'
                : 'border-slate-300 text-slate-400 shadow-xs group-hover:border-indigo-400 group-hover:text-indigo-600 group-hover:shadow-sm'
            }`}
          >
            <ArrowLeftRight className="w-2.5 h-2.5" />
          </div>
        </div>
      )}
    </aside>
  );
};
