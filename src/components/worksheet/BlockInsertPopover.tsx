import React, { useState, useEffect, useRef } from 'react';
import {
  WorksheetBlockType,
  WorksheetBlock,
} from '../../types/worksheet';
import {
  Search,
  X,
  Heading1,
  Type,
  ListOrdered,
  PenTool,
  Minus,
  MoveVertical,
  CornerDownLeft,
  FolderKanban,
  Compass,
  LineChart,
  Grid,
  Network,
  Tag,
  Image as ImageIcon,
  Shapes,
  SlidersHorizontal,
} from 'lucide-react';

export interface BlockInsertOption {
  id: string;
  type: WorksheetBlockType;
  title: string;
  description: string;
  category: 'core' | 'visual' | 'variants';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  customProps?: Partial<WorksheetBlock>;
}

export const INSERT_BLOCK_OPTIONS: BlockInsertOption[] = [
  // THE 5 CORE PHASE 2 BLOCKS
  {
    id: 'opt_title',
    type: 'title',
    title: 'Titre',
    description: 'Titre principal de la fiche, évaluation ou section',
    category: 'core',
    categoryLabel: 'Blocs Fondamentaux (5)',
    icon: Heading1,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'opt_rich_text',
    type: 'rich_text',
    title: 'Texte & Mathématiques (∑)',
    description: 'Paragraphe, énoncé ou question avec formules mathématiques intégrées ($...$)',
    category: 'core',
    categoryLabel: 'Blocs Fondamentaux (5)',
    icon: Type,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    id: 'opt_exercise',
    type: 'exercise',
    title: 'Conteneur d’Exercice',
    description: 'Exercice structuré avec en-tête numéroté, barème et blocs enfants composables',
    category: 'core',
    categoryLabel: 'Blocs Fondamentaux (5)',
    icon: FolderKanban,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'opt_answer_lines',
    type: 'answer_lines',
    title: 'Lignes de réponse',
    description: 'Lignes pointillées, continues, quadrillage ou cadre de réponse élève',
    category: 'core',
    categoryLabel: 'Blocs Fondamentaux (5)',
    icon: PenTool,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    customProps: {
      content: {
        answerType: 'lines',
        lineCount: 4,
        lineSpacing: 32,
        lineStyle: 'dotted',
      },
    },
  },
  {
    id: 'opt_separator',
    type: 'separator',
    title: 'Séparateur / Espace',
    description: 'Ligne horizontale séparatrice ou espacement vertical ajustable',
    category: 'core',
    categoryLabel: 'Blocs Fondamentaux (5)',
    icon: Minus,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    customProps: {
      content: {
        separatorMode: 'line',
        lineStyle: 'solid',
      },
    },
  },

  // PHASE 4 — VISUAL, GEOMETRY & SCIENTIFIC TOOLS
  {
    id: 'opt_geometry_figure',
    type: 'geometry_figure',
    title: 'Figure Géométrique (Vectoriel)',
    description: 'Triangle, angle droit, segments, cercle, mesures et étiquettes mathématiques',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4)',
    icon: Compass,
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  {
    id: 'opt_coordinate_system',
    type: 'coordinate_system',
    title: 'Repère & Graphique (O, x, y)',
    description: 'Axes gradués, quadrillage, points A(x, y), segments et tracé de fonctions',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4)',
    icon: LineChart,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'opt_number_line',
    type: 'number_line',
    title: 'Ligne Graduée / Axe Numérique',
    description: 'Axe avec graduations régulières, subdivisions, points A, B et mode complétion élève',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4 & 5)',
    icon: SlidersHorizontal,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'opt_construction_area',
    type: 'construction_area',
    title: 'Espace de Construction (Élève)',
    description: 'Zone réservée au tracé de l’élève : papier blanc, quadrillé, millimétré ou pointé',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4)',
    icon: Grid,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    id: 'opt_image_annotation',
    type: 'image_annotation',
    title: 'Schéma / Image Annotée',
    description: 'Image avec marqueurs (1, 2, 3) pour légender ou faire compléter par l’élève',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4)',
    icon: Tag,
    badgeColor: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  },
  {
    id: 'opt_diagram',
    type: 'diagram',
    title: 'Schéma & Diagramme',
    description: 'Enchaînement de boîtes reliées par des flèches (étapes, démonstrations)',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4)',
    icon: Network,
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    id: 'opt_image',
    type: 'image',
    title: 'Image & Illustration',
    description: 'Photo, schéma ou illustration PNG/JPEG/SVG avec légende mathématique',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4)',
    icon: ImageIcon,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'opt_shape',
    type: 'shape',
    title: 'Forme Vectorielle Simple',
    description: 'Rectangle, cercle, flèche, accolade ou ligne d’accentuation',
    category: 'visual',
    categoryLabel: 'Outils Visuels & Scientifiques (Phase 4)',
    icon: Shapes,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },

  // QUICK VARIANTS OF THE 5 CORE BLOCKS
  {
    id: 'opt_instruction',
    type: 'rich_text',
    title: 'Consigne encadrée (Variante Texte)',
    description: 'Bloc Texte pré-formaté avec badge « Consigne : » et encadré',
    category: 'variants',
    categoryLabel: 'Variantes rapides',
    icon: ListOrdered,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    customProps: {
      content: {
        variant: 'instruction',
        label: 'Consigne :',
        text: 'Lisez attentivement l’énoncé avant de répondre aux questions.',
      },
      styles: {
        backgroundColor: '#f8fafc',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 8,
        padding: 10,
      },
    },
  },
  {
    id: 'opt_spacer',
    type: 'separator',
    title: 'Espace vide vertical (Variante Séparateur)',
    description: 'Séparateur en mode espace vertical ajustable (32px)',
    category: 'variants',
    categoryLabel: 'Variantes rapides',
    icon: MoveVertical,
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-300',
    customProps: {
      height: 32,
      content: {
        separatorMode: 'space',
        spacerHeight: 32,
      },
    },
  },
];

const CATEGORIES = [
  { key: 'core', label: 'Blocs Fondamentaux (5)' },
  { key: 'visual', label: 'Visuel, Géométrie & Sciences (Phase 4)' },
  { key: 'variants', label: 'Variantes rapides' },
] as const;

interface BlockInsertPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: BlockInsertOption) => void;
  triggerRect?: DOMRect | null;
  positionHint?: 'side' | 'center';
}

export const BlockInsertPopover: React.FC<BlockInsertPopoverProps> = ({
  isOpen,
  onClose,
  onSelectOption,
  triggerRect,
  positionHint = 'side',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredOption, setHoveredOption] = useState<BlockInsertOption>(INSERT_BLOCK_OPTIONS[0]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setHoveredOption(INSERT_BLOCK_OPTIONS[0]);
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = searchQuery.trim().toLowerCase();
  const filteredOptions = INSERT_BLOCK_OPTIONS.filter((opt) => {
    if (!q) return true;
    return (
      opt.title.toLowerCase().includes(q) ||
      opt.description.toLowerCase().includes(q) ||
      opt.categoryLabel.toLowerCase().includes(q)
    );
  });

  const POPOVER_WIDTH = 560;
  const POPOVER_HEIGHT = 410;

  let computedStyle: React.CSSProperties = {
    width: `${POPOVER_WIDTH}px`,
    height: `${POPOVER_HEIGHT}px`,
  };

  if (triggerRect && positionHint === 'side') {
    let left = triggerRect.right + 12;
    if (left + POPOVER_WIDTH > window.innerWidth - 16) {
      left = Math.max(16, triggerRect.left - POPOVER_WIDTH - 12);
    }
    if (left < 16) {
      left = Math.max(16, (window.innerWidth - POPOVER_WIDTH) / 2);
    }

    let top = triggerRect.top - 40;
    if (top + POPOVER_HEIGHT > window.innerHeight - 20) {
      top = Math.max(20, window.innerHeight - POPOVER_HEIGHT - 20);
    }
    if (top < 60) {
      top = 60;
    }

    computedStyle = {
      ...computedStyle,
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 60,
    };
  } else if (triggerRect && positionHint === 'center') {
    let left = Math.max(16, Math.min(window.innerWidth - POPOVER_WIDTH - 16, triggerRect.left));
    let top = triggerRect.bottom + 10;
    if (top + POPOVER_HEIGHT > window.innerHeight - 20) {
      top = Math.max(20, triggerRect.top - POPOVER_HEIGHT - 10);
    }

    computedStyle = {
      ...computedStyle,
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 60,
    };
  } else {
    computedStyle = {
      ...computedStyle,
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 60,
    };
  }

  const renderVisualPreview = (option: BlockInsertOption) => {
    switch (option.id) {
      case 'opt_title':
        return (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
            <h1 className="text-base font-bold text-slate-900 tracking-tight text-center leading-snug">
              Devoir de Contrôle N°1
            </h1>
            <div className="w-12 h-0.5 bg-indigo-500 rounded-full mt-2" />
          </div>
        );

      case 'opt_rich_text':
        return (
          <div className="w-full p-3 bg-white border border-slate-200/90 rounded-lg shadow-2xs space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-800">
              1) Calculer et simplifier :
            </div>
            <p className="text-[11px] text-indigo-700 font-mono bg-indigo-50/60 px-2 py-1 rounded">
              A = 8/5 × 15/4 − 3/2
            </p>
          </div>
        );

      case 'opt_exercise':
        return (
          <div className="w-full p-3 bg-white border border-slate-200/90 rounded-lg shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <span className="text-xs font-bold text-slate-900">Exercice N° 1</span>
              <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                (4 points)
              </span>
            </div>
            <div className="text-[10px] text-slate-700">1) Résoudre l’équation 2x + 5 = 13 :</div>
            <div className="border-b-2 border-dotted border-slate-300 pb-2" />
            <div className="border-b-2 border-dotted border-slate-300 pb-2" />
          </div>
        );

      case 'opt_answer_lines':
        return (
          <div className="w-full p-3 bg-white border border-slate-200/90 rounded-lg shadow-2xs space-y-2.5">
            <div className="border-b-2 border-dotted border-slate-400 pb-2" />
            <div className="border-b-2 border-dotted border-slate-400 pb-2" />
            <div className="border-b-2 border-dotted border-slate-400 pb-2" />
          </div>
        );

      case 'opt_separator':
        return (
          <div className="w-full py-4 flex flex-col items-center justify-center">
            <div className="w-full border-t-2 border-slate-400" />
            <span className="text-[9px] text-slate-400 mt-2 font-mono">
              Ligne séparatrice ou Espace vertical
            </span>
          </div>
        );

      case 'opt_instruction':
        return (
          <div className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg shadow-2xs">
            <span className="inline-block px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded mb-1">
              Consigne :
            </span>
            <p className="text-[10px] text-slate-700 leading-normal">
              Détaillez toutes les étapes de vos calculs.
            </p>
          </div>
        );

      case 'opt_spacer':
        return (
          <div className="w-full h-16 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 gap-1.5 text-[10px]">
            <MoveVertical className="w-3.5 h-3.5 text-slate-400" />
            <span>Espace vertical (32px)</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/15 backdrop-blur-[0.5px] transition-opacity animate-in fade-in duration-100"
        onClick={onClose}
      />

      <div
        ref={popoverRef}
        style={computedStyle}
        className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un bloc (Titre, Texte, Exercice, Lignes, Séparateur)..."
              className="w-full pl-9 pr-8 py-2 bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Fermer (Échap)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex min-h-0 divide-x divide-slate-100 overflow-hidden">
          <div className="w-[330px] flex flex-col min-h-0 overflow-y-auto p-2.5 space-y-3 custom-scrollbar">
            {CATEGORIES.map((cat) => {
              const catOptions = filteredOptions.filter((o) => o.category === cat.key);
              if (catOptions.length === 0) return null;

              return (
                <div key={cat.key} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 flex items-center justify-between">
                    <span>{cat.label}</span>
                  </div>

                  <div className="space-y-0.5">
                    {catOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isHovered = hoveredOption.id === opt.id;

                      return (
                        <div
                          key={opt.id}
                          onMouseEnter={() => setHoveredOption(opt)}
                          onClick={() => {
                            onSelectOption(opt);
                            onClose();
                          }}
                          className={`group flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                            isHovered
                              ? 'bg-slate-100/90 border-indigo-200/80 shadow-2xs text-slate-900'
                              : 'bg-white hover:bg-slate-50/90 border-transparent text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${opt.badgeColor}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 truncate leading-tight">
                              {opt.title}
                            </div>
                            <div className="text-[10px] text-slate-400 group-hover:text-slate-500 truncate leading-tight mt-0.5">
                              {opt.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-1 bg-slate-50/70 p-4 flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Aperçu visuel
                </span>
              </div>

              <div className="mb-3">
                <h3 className="text-xs font-bold text-slate-800 leading-tight">
                  {hoveredOption.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {hoveredOption.description}
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-center min-h-[150px]">
                {renderVisualPreview(hoveredOption)}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CornerDownLeft className="w-3.5 h-3.5 text-indigo-500" />
                Cliquer pour insérer
              </span>
              <button
                type="button"
                onClick={() => {
                  onSelectOption(hoveredOption);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Insérer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
