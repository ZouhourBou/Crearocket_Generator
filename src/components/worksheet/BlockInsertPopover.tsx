import React, { useState, useEffect, useRef } from 'react';
import {
  WorksheetBlockType,
  WorksheetBlock,
} from '../../types/worksheet';
import {
  Search,
  X,
  Heading1,
  Heading2,
  Type,
  ListOrdered,
  PenTool,
  ImageIcon,
  Minus,
  Square,
  MoveVertical,
  Calculator,
  Grid3X3,
  Sigma,
  CornerDownLeft,
  Bookmark,
  PenLine,
} from 'lucide-react';

export interface BlockInsertOption {
  id: string;
  type: WorksheetBlockType;
  title: string;
  description: string;
  category: 'text' | 'exercises' | 'layout' | 'math';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  customProps?: Partial<WorksheetBlock>;
}

export const INSERT_BLOCK_OPTIONS: BlockInsertOption[] = [
  // 1. TEXTE
  {
    id: 'opt_title',
    type: 'title',
    title: 'Titre',
    description: 'Grand titre principal de la fiche ou évaluation',
    category: 'text',
    categoryLabel: 'Texte',
    icon: Heading1,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'opt_subtitle',
    type: 'subtitle',
    title: 'Sous-titre',
    description: 'Sous-titre ou thème de la leçon / exercice',
    category: 'text',
    categoryLabel: 'Texte',
    icon: Heading2,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'opt_text',
    type: 'text',
    title: 'Texte & Paragraphe (نص وفقرة)',
    description: 'Éditeur enrichi Word + Canva : texte libre, formules mathématiques (∑) et bilingue FR/AR',
    category: 'text',
    categoryLabel: 'Texte',
    icon: Type,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },

  // 2. EXERCICES
  {
    id: 'opt_qcm_exam',
    type: 'qcm_exam',
    title: 'QCM d’évaluation (Bilingue FR/AR)',
    description: 'QCM à choix multiples, cases à cocher ou repères alphabétiques',
    category: 'exercises',
    categoryLabel: 'Exercices',
    icon: Square,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'opt_exercise_header',
    type: 'exercise_header',
    title: "En-tête d'exercice",
    description: "Titre d'exercice (ex: Exercice 1) et barème indépendant",
    category: 'exercises',
    categoryLabel: 'Exercices',
    icon: Bookmark,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'opt_fill_in_blanks',
    type: 'fill_in_blanks',
    title: 'Compléter (souligné)',
    description: 'Phrases à trous avec zones soulignées et formules mathématiques',
    category: 'exercises',
    categoryLabel: 'Exercices',
    icon: PenLine,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'opt_instruction',
    type: 'instruction',
    title: 'Consigne',
    description: 'Consigne encadrée pour guider les élèves',
    category: 'exercises',
    categoryLabel: 'Exercices',
    icon: ListOrdered,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'opt_answer_lines',
    type: 'answer_zone',
    title: 'Zone de réponse (Lignes)',
    description: 'Lignes d’écriture pour la réponse des élèves',
    category: 'exercises',
    categoryLabel: 'Exercices',
    icon: PenTool,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    customProps: {
      content: { answerType: 'lines', lineCount: 4, placeholder: 'Zone réservée à la réponse de l’élève…' },
    },
  },
  {
    id: 'opt_answer_box',
    type: 'answer_zone',
    title: 'Cadre de réponse libre',
    description: 'Encadré vierge pour dessin, schéma ou calcul',
    category: 'exercises',
    categoryLabel: 'Exercices',
    icon: Square,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    customProps: {
      height: 120,
      content: { answerType: 'box', placeholder: 'Cadre libre pour la réponse de l’élève…' },
    },
  },

  // 3. MISE EN PAGE
  {
    id: 'opt_image',
    type: 'image',
    title: 'Image / Schéma',
    description: 'Illustration, schéma ou photo pédagogique',
    category: 'layout',
    categoryLabel: 'Mise en page',
    icon: ImageIcon,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'opt_line',
    type: 'line',
    title: 'Ligne séparatrice',
    description: 'Séparateur horizontal simple ou décoratif',
    category: 'layout',
    categoryLabel: 'Mise en page',
    icon: Minus,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  {
    id: 'opt_shape',
    type: 'shape',
    title: 'Forme géométrique',
    description: 'Cadre, rectangle ou conteneur coloré',
    category: 'layout',
    categoryLabel: 'Mise en page',
    icon: Square,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'opt_spacer',
    type: 'spacer',
    title: 'Espace vertical',
    description: 'Espace vertical ajustable pour aérer la page',
    category: 'layout',
    categoryLabel: 'Mise en page',
    icon: MoveVertical,
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  },

  // 4. MATHÉMATIQUES
  {
    id: 'opt_math_grid',
    type: 'answer_zone',
    title: 'Quadrillage de calcul',
    description: 'Grille à carreaux pour poser les opérations ou géométrie',
    category: 'math',
    categoryLabel: 'Mathématiques',
    icon: Grid3X3,
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    customProps: {
      height: 130,
      content: { answerType: 'grid', placeholder: 'Carreaux de calcul et géométrie…' },
    },
  },
  {
    id: 'opt_math_calc',
    type: 'text',
    title: 'Calcul & Opérations',
    description: 'Série de calculs et égalités arithmétiques',
    category: 'math',
    categoryLabel: 'Mathématiques',
    icon: Calculator,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    customProps: {
      height: 70,
      content: {
        text: 'a) 45 + 28 = .....        b) 120 - 45 = .....\nc) 12 × 4 = .....         d) 80 ÷ 4 = .....',
      },
      styles: {
        fontSize: 15,
        fontFamily: 'monospace',
        fontWeight: 'bold',
      },
    },
  },
  {
    id: 'opt_math_problem',
    type: 'text',
    title: 'Problème de maths',
    description: 'Énoncé structuré avec données chiffrées et question',
    category: 'math',
    categoryLabel: 'Mathématiques',
    icon: Sigma,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    customProps: {
      height: 80,
      content: {
        text: 'Problème : Dans une classe de 25 élèves, 14 portent des lunettes.\nCombien d’élèves ne portent pas de lunettes ?',
      },
      styles: {
        fontSize: 14,
        padding: 10,
        backgroundColor: '#fffbeb',
        borderColor: '#fde68a',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 8,
      },
    },
  },
];

const CATEGORIES = [
  { key: 'text', label: 'Texte' },
  { key: 'exercises', label: 'Exercices' },
  { key: 'layout', label: 'Mise en page' },
  { key: 'math', label: 'Mathématiques' },
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

  // Focus search input when popover opens & reset state
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

  // Handle Escape key to close
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

  // Filter options based on query (by title, description, or category label)
  const q = searchQuery.trim().toLowerCase();
  const filteredOptions = INSERT_BLOCK_OPTIONS.filter((opt) => {
    if (!q) return true;
    return (
      opt.title.toLowerCase().includes(q) ||
      opt.description.toLowerCase().includes(q) ||
      opt.categoryLabel.toLowerCase().includes(q)
    );
  });

  // Calculate intelligent position
  const POPOVER_WIDTH = 580;
  const POPOVER_HEIGHT = 440;

  let computedStyle: React.CSSProperties = {
    width: `${POPOVER_WIDTH}px`,
    height: `${POPOVER_HEIGHT}px`,
  };

  if (triggerRect && positionHint === 'side') {
    // Open beside the trigger (Shopify-style sidebar popover)
    let left = triggerRect.right + 12;
    // Check if overflowing right
    if (left + POPOVER_WIDTH > window.innerWidth - 16) {
      left = Math.max(16, triggerRect.left - POPOVER_WIDTH - 12);
    }
    // Check if still overflowing
    if (left < 16) {
      left = Math.max(16, (window.innerWidth - POPOVER_WIDTH) / 2);
    }

    // Vertical alignment: center around trigger or shift up if near bottom
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
    // Floating under or near trigger in canvas
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
    // Default centered on screen
    computedStyle = {
      ...computedStyle,
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 60,
    };
  }

  // Visual Preview Renderer for the Right Column
  const renderVisualPreview = (option: BlockInsertOption) => {
    switch (option.id) {
      case 'opt_title':
        return (
          <div className="w-full flex flex-col items-center justify-center p-4 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
            <h1 className="text-base font-bold text-slate-900 tracking-tight text-center leading-snug">
              Évaluation de Mathématiques
            </h1>
            <div className="w-12 h-0.5 bg-indigo-500 rounded-full mt-2" />
          </div>
        );

      case 'opt_subtitle':
        return (
          <div className="w-full flex flex-col items-center justify-center p-3 bg-white border border-slate-200/90 rounded-lg shadow-2xs">
            <p className="text-xs italic text-slate-500 text-center">
              Période 1 — Nombres, calculs et résolution de problèmes
            </p>
          </div>
        );

      case 'opt_text':
        return (
          <div className="w-full p-3 bg-white border border-slate-200/90 rounded-lg shadow-2xs space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-800">Exercice 1 : Lecture et compréhension</div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Lisez attentivement le texte ci-dessous puis répondez aux questions posées sur votre feuille.
            </p>
          </div>
        );

      case 'opt_instruction':
        return (
          <div className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg shadow-2xs">
            <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded mb-1">
              Consigne :
            </span>
            <p className="text-[10px] text-slate-700 leading-normal">
              Entourez la bonne réponse et justifiez votre choix par un calcul.
            </p>
          </div>
        );

      case 'opt_answer_lines':
        return (
          <div className="w-full p-3 bg-white border border-slate-200/90 rounded-lg shadow-2xs space-y-2">
            <div className="text-[10px] font-medium text-slate-400 italic">Réponse de l’élève :</div>
            <div className="border-b border-slate-300 border-dashed pb-1.5" />
            <div className="border-b border-slate-300 border-dashed pb-1.5" />
            <div className="border-b border-slate-300 border-dashed pb-1.5" />
          </div>
        );

      case 'opt_answer_box':
        return (
          <div className="w-full h-24 p-3 bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 italic">
              Zone libre réservée pour le schéma, dessin ou calcul
            </span>
          </div>
        );

      case 'opt_image':
        return (
          <div className="w-full h-24 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex flex-col items-center justify-center text-slate-400">
            <ImageIcon className="w-7 h-7 mb-1 text-slate-300" />
            <span className="text-[10px] text-slate-500 font-medium">Illustration pédagogique</span>
          </div>
        );

      case 'opt_line':
        return (
          <div className="w-full py-4 flex flex-col items-center justify-center">
            <div className="w-full border-t-2 border-slate-400" />
            <span className="text-[9px] text-slate-400 mt-2 font-mono">Séparateur 2px</span>
          </div>
        );

      case 'opt_shape':
        return (
          <div className="w-full h-20 bg-blue-50/80 border-2 border-blue-400 rounded-xl flex items-center justify-center text-blue-700 text-[10px] font-semibold">
            Cadre de mise en valeur
          </div>
        );

      case 'opt_spacer':
        return (
          <div className="w-full h-16 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 gap-1.5 text-[10px]">
            <MoveVertical className="w-3.5 h-3.5 text-slate-400" />
            <span>Espace vierge (40px)</span>
          </div>
        );

      case 'opt_math_grid':
        return (
          <div className="w-full h-24 bg-white border border-slate-300 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden shadow-2xs">
            <div className="grid grid-cols-6 gap-1 w-full h-full opacity-60">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="border border-slate-200 rounded-xs bg-slate-50/40" />
              ))}
            </div>
          </div>
        );

      case 'opt_math_calc':
        return (
          <div className="w-full p-2.5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-lg shadow-2xs space-y-1">
            <div>45 + 28 = [    ]</div>
            <div>120 - 45 = [    ]</div>
            <div>12 × 4  = [    ]</div>
          </div>
        );

      case 'opt_math_problem':
        return (
          <div className="w-full p-2.5 bg-amber-50/90 border border-amber-200 rounded-lg shadow-2xs">
            <span className="text-[10px] font-bold text-amber-900 block mb-0.5">Problème guidé</span>
            <p className="text-[10px] text-amber-950/80 leading-relaxed">
              Dans un panier, il y a 12 pommes et 8 poires. Combien y a-t-il de fruits au total ?
            </p>
          </div>
        );

      default:
        return (
          <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
            Aperçu standard du bloc
          </div>
        );
    }
  };

  return (
    <>
      {/* Click-outside backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/15 backdrop-blur-[0.5px] transition-opacity animate-in fade-in duration-100"
        onClick={onClose}
      />

      {/* Two-column Shopify-style Popover Panel */}
      <div
        ref={popoverRef}
        style={computedStyle}
        className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Search Bar */}
        <div className="p-3 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un bloc ou une catégorie..."
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

        {/* 2-Columns Body: Left Selection List + Right Visual Preview */}
        <div className="flex-1 flex min-h-0 divide-x divide-slate-100 overflow-hidden">
          {/* Colonne gauche — Sélection du bloc (scrollable) */}
          <div className="w-[330px] sm:w-[340px] flex flex-col min-h-0 overflow-y-auto p-2.5 space-y-3 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Aucun bloc trouvé</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Essayez un autre mot-clé (ex: titre, consigne, image, calcul...)
                </p>
              </div>
            ) : (
              CATEGORIES.map((cat) => {
                const catOptions = filteredOptions.filter((o) => o.category === cat.key);
                if (catOptions.length === 0) return null;

                return (
                  <div key={cat.key} className="space-y-1">
                    {/* Category Section Header */}
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 flex items-center justify-between">
                      <span>{cat.label}</span>
                      <span className="text-[9px] font-semibold text-slate-400/80 bg-slate-100 px-1.5 py-0.2 rounded-full">
                        {catOptions.length}
                      </span>
                    </div>

                    {/* Category Items */}
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
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${opt.badgeColor} transition-transform ${
                                isHovered ? 'scale-105 shadow-2xs' : ''
                              }`}
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
              })
            )}
          </div>

          {/* Colonne droite — Aperçu visuel du bloc (fixe, sans scroll séparé) */}
          <div className="flex-1 bg-slate-50/70 p-4 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Header of Preview */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Aperçu visuel
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {hoveredOption.categoryLabel}
                </span>
              </div>

              {/* Title & Description of Current Selection */}
              <div className="mb-3">
                <h3 className="text-xs font-bold text-slate-800 leading-tight">
                  {hoveredOption.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {hoveredOption.description}
                </p>
              </div>

              {/* Realistic Simulated Block Preview (A4 Miniature Canvas) */}
              <div className="p-3 bg-white/80 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-center min-h-[160px]">
                {renderVisualPreview(hoveredOption)}
              </div>
            </div>

            {/* Bottom Callout & Quick Insertion Hint */}
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
