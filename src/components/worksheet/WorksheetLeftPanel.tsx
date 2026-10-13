import React, { useState } from 'react';
import { WorksheetBlock, WorksheetBlockType } from '../../types/worksheet';
import {
  Search,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  ChevronLeft,
  Heading1,
  Type,
  Minus,
  PenTool,
  Layers,
  Sparkles,
  ArrowLeftRight,
  FolderKanban,
  CornerDownRight,
  Compass,
  LineChart,
  Grid,
  Network,
  Tag,
  Image as ImageIcon,
  Shapes,
  SlidersHorizontal,
} from 'lucide-react';
import { BlockInsertPopover } from './BlockInsertPopover';

interface WorksheetLeftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
  onStartResize?: (e: React.PointerEvent) => void;
  isResizing?: boolean;
  blocks: WorksheetBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onAddBlock: (
    type: WorksheetBlockType,
    customProps?: Partial<WorksheetBlock>,
    insertIndex?: number
  ) => void;
  onDuplicateBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlock: (id: string, direction: 'up' | 'down') => void;
  onReorderBlocks?: (fromIndex: number, toIndex: number) => void;
  currentPageNumber: number;
}

interface BlockDefinition {
  type: WorksheetBlockType;
  title: string;
  description: string;
  category: 'structure' | 'pedagogy' | 'layout' | 'visual';
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}

/**
 * BLOC LIBRARY — CORE (PHASE 2) + VISUAL & SCIENTIFIC (PHASE 4)
 */
const AVAILABLE_BLOCKS: BlockDefinition[] = [
  // 1. Structure
  {
    type: 'title',
    title: 'Titre',
    description: 'Titre principal de devoir, fiche ou section',
    category: 'structure',
    icon: Heading1,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    type: 'rich_text',
    title: 'Texte & Mathématiques',
    description: 'Énoncé, consigne ou paragraphe avec formules (∑) et FR/AR',
    category: 'structure',
    icon: Type,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  // 2. Pédagogie
  {
    type: 'exercise',
    title: 'Conteneur d’Exercice',
    description: 'Bloc conteneur avec titre numéroté, barème et sous-blocs',
    category: 'pedagogy',
    icon: FolderKanban,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    type: 'answer_lines',
    title: 'Lignes de réponse',
    description: 'Lignes pointillées, continues, quadrillage ou cadre élève',
    category: 'pedagogy',
    icon: PenTool,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    type: 'separator',
    title: 'Séparateur / Espace',
    description: 'Ligne horizontale séparatrice ou espace vertical ajustable',
    category: 'layout',
    icon: Minus,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  // 3. Phase 4 — Visual, Geometry & Scientific Tools
  {
    type: 'geometry_figure',
    title: 'Figure Géométrique',
    description: 'Triangle, angle droit, segments, cercle, mesures et étiquettes mathématiques',
    category: 'visual',
    icon: Compass,
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  {
    type: 'coordinate_system',
    title: 'Repère & Graphique',
    description: 'Axes gradués, quadrillage, points A(x, y), segments et tracé de fonctions',
    category: 'visual',
    icon: LineChart,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    type: 'number_line',
    title: 'Ligne Graduée / Axe',
    description: 'Axe gradué avec pas personnalisable, points et mode complétion',
    category: 'visual',
    icon: SlidersHorizontal,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    type: 'construction_area',
    title: 'Espace de Construction',
    description: 'Zone réservée au tracé de l’élève : papier blanc, quadrillé ou pointé',
    category: 'visual',
    icon: Grid,
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    type: 'image_annotation',
    title: 'Schéma / Image Annotée',
    description: 'Image avec marqueurs (1, 2, 3) pour légender ou faire compléter par l’élève',
    category: 'visual',
    icon: Tag,
    badgeColor: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
  },
  {
    type: 'diagram',
    title: 'Schéma & Diagramme',
    description: 'Enchaînement d’étapes ou démonstration reliées par des flèches',
    category: 'visual',
    icon: Network,
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    type: 'image',
    title: 'Image & Illustration',
    description: 'Photo, schéma ou illustration PNG/JPEG/SVG avec légende mathématique',
    category: 'visual',
    icon: ImageIcon,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    type: 'shape',
    title: 'Forme Simple',
    description: 'Rectangle, cercle, flèche, accolade ou ligne vectorielle',
    category: 'visual',
    icon: Shapes,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
];

export const WorksheetLeftPanel: React.FC<WorksheetLeftPanelProps> = ({
  isOpen,
  onClose,
  width = 250,
  onStartResize,
  isResizing = false,
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onReorderBlock,
  onReorderBlocks,
  currentPageNumber,
}) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'blocks'>('blocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [insertPopoverState, setInsertPopoverState] = useState<{
    isOpen: boolean;
    insertIndex?: number;
    triggerRect: DOMRect | null;
  }>({
    isOpen: false,
    insertIndex: undefined,
    triggerRect: null,
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredBlocks = AVAILABLE_BLOCKS.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBlockIcon = (type: WorksheetBlockType) => {
    if (type === 'title' || type === 'subtitle') return Heading1;
    if (type === 'rich_text' || type === 'text' || type === 'instruction') return Type;
    if (type === 'exercise' || type === 'exercise_header') return FolderKanban;
    if (type === 'answer_lines' || type === 'answer_zone') return PenTool;
    if (type === 'separator' || type === 'line' || type === 'spacer') return Minus;
    if (type === 'geometry_figure') return Compass;
    if (type === 'coordinate_system') return LineChart;
    if (type === 'number_line') return SlidersHorizontal;
    if (type === 'construction_area') return Grid;
    if (type === 'diagram') return Network;
    if (type === 'image_annotation') return Tag;
    if (type === 'image') return ImageIcon;
    if (type === 'shape') return Shapes;
    return Type;
  };

  const getBlockTypeLabel = (block: WorksheetBlock) => {
    switch (block.type) {
      case 'title':
        return 'Titre';
      case 'rich_text':
      case 'text':
        if (block.content.variant === 'instruction') return 'Consigne';
        if (block.content.variant === 'subtitle') return 'Sous-titre';
        return 'Texte & Maths';
      case 'instruction':
        return 'Consigne';
      case 'subtitle':
        return 'Sous-titre';
      case 'exercise':
        return 'Conteneur d’Exercice';
      case 'answer_lines':
      case 'answer_zone':
        return 'Lignes de réponse';
      case 'separator':
      case 'line':
      case 'spacer':
        return block.content.separatorMode === 'space' || block.type === 'spacer'
          ? 'Espace vertical'
          : 'Ligne séparatrice';
      case 'geometry_figure':
        return 'Figure Géométrique';
      case 'coordinate_system':
        return 'Repère & Graphique';
      case 'number_line':
        return 'Ligne Graduée / Axe';
      case 'construction_area':
        return 'Espace de Construction';
      case 'diagram':
        return 'Schéma & Diagramme';
      case 'image_annotation':
        return 'Schéma / Image Annotée';
      case 'image':
        return 'Image & Illustration';
      case 'shape':
        return 'Forme Simple';
      default:
        return block.type;
    }
  };

  const getBlockSummary = (block: WorksheetBlock) => {
    if (block.type === 'exercise') {
      const title =
        block.content.exerciseTitle || `Exercice N° ${block.content.exerciseNumber || 1}`;
      const pts = block.content.points ? ` • (${block.content.points})` : '';
      const childCount = block.children?.length || 0;
      return `${title}${pts} • ${childCount} élém.`;
    }
    if (block.type === 'geometry_figure') {
      const pCount = block.content.geometryData?.points.length || 0;
      const sCount = block.content.geometryData?.segments.length || 0;
      return `${pCount} pts, ${sCount} segs • ${block.content.geometryData?.caption || 'Figure'}`;
    }
    if (block.type === 'coordinate_system') {
      return `x ∈ [${block.content.graphData?.xMin ?? -5}, ${block.content.graphData?.xMax ?? 5}] • ${block.content.graphData?.points.length || 0} pts`;
    }
    if (block.type === 'number_line') {
      return `Axe [${block.content.numberLineData?.min ?? 0} → ${block.content.numberLineData?.max ?? 10}] • ${block.content.numberLineData?.points?.length || 0} pts`;
    }
    if (block.type === 'construction_area') {
      return `Papier ${block.content.constructionData?.backgroundType || 'quadrillé'} (${block.content.constructionData?.height || block.height}px)`;
    }
    if (block.type === 'diagram') {
      return `${block.content.diagramData?.nodes.length || 0} boîtes reliées`;
    }
    if (block.type === 'image_annotation') {
      return `${block.content.annotationData?.markers.length || 0} marqueurs numérotés`;
    }
    if (block.type === 'image') {
      return block.content.captionText || block.content.alt || 'Illustration';
    }
    if (block.type === 'shape') {
      return block.content.shapeData?.shapeKind || 'Forme vectorielle';
    }
    if (block.content.text) return block.content.text;
    if (block.type === 'instruction') return block.content.label || 'Consigne';
    if (block.type === 'answer_lines' || block.type === 'answer_zone') {
      const count = block.content.lineCount || 3;
      const style =
        block.content.answerType === 'grid'
          ? 'Quadrillage'
          : block.content.answerType === 'box'
          ? 'Cadre'
          : block.content.lineStyle === 'solid'
          ? 'continues'
          : 'pointillées';
      return `${count} lignes ${style}`;
    }
    if (block.type === 'separator' || block.type === 'line' || block.type === 'spacer') {
      if (block.content.separatorMode === 'space' || block.type === 'spacer') {
        return `Hauteur ${block.content.spacerHeight || block.height}px`;
      }
      return `Ligne ${block.content.lineStyle || 'continue'}`;
    }
    return '';
  };

  const handleDragStart = (e: React.DragEvent, type: WorksheetBlockType) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside
      id="worksheet-left-panel"
      style={{ width: `${width}px`, minWidth: `${width}px` }}
      className="relative bg-white border-r border-slate-200/90 flex flex-col h-full shrink-0 select-none z-20 shadow-xs"
    >
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
        {/* Top Header */}
        <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Blocs Pédagogiques
              </h2>
              <p className="text-[11px] text-slate-400">Page {currentPageNumber} • Structure & Visuels</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Réduire le panneau (‹)"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-2.5 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher (géométrie, graphe, image, exercice…)"
              className="w-full pl-8 pr-3 py-1.5 bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Tabs Switcher: BLOCS vs STRUCTURE */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 border-b border-slate-200/80 m-2.5 rounded-xl gap-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('blocks')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'blocks'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>BLOCS ({AVAILABLE_BLOCKS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('structure')}
            className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'structure'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>STRUCTURE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-700">
              {blocks.length}
            </span>
          </button>
        </div>

        {/* Tab Content 1: STRUCTURE (Document Flow Hierarchy) */}
        {activeTab === 'structure' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 shrink-0">
              <span>Flux du document</span>
              <span className="text-[11px] text-slate-400">Glisser pour réordonner</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
              {blocks.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Page vide</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ajoutez un Titre, un Texte ou un Conteneur d’Exercice.
                  </p>
                </div>
              ) : (
                <>
                  {blocks.map((block, index) => {
                    const IconComponent = getBlockIcon(block.type);
                    const isSelected = block.id === selectedBlockId;
                    const isDragging = draggedIndex === index;
                    const isDragOver = dragOverIndex === index && draggedIndex !== index;
                    const nextInsertIdx = index + 1;
                    const isNextActive =
                      insertPopoverState.isOpen && insertPopoverState.insertIndex === nextInsertIdx;

                    return (
                      <React.Fragment key={block.id}>
                        <div
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', String(index));
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggedIndex(index);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            if (dragOverIndex !== index) {
                              setDragOverIndex(index);
                            }
                          }}
                          onDragLeave={() => {
                            if (dragOverIndex === index) {
                              setDragOverIndex(null);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIndex !== null && draggedIndex !== index) {
                              if (onReorderBlocks) {
                                onReorderBlocks(draggedIndex, index);
                              } else {
                                onReorderBlock(block.id, draggedIndex < index ? 'down' : 'up');
                              }
                            }
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                          }}
                          onDragEnd={() => {
                            setDraggedIndex(null);
                            setDragOverIndex(null);
                          }}
                          onClick={() => onSelectBlock(block.id)}
                          className={`group flex items-center justify-between gap-1.5 py-1.5 px-2 rounded-lg border transition-all cursor-pointer select-none ${
                            isDragging
                              ? 'opacity-40 border-dashed border-indigo-400 bg-indigo-50/40'
                              : isDragOver
                              ? 'ring-2 ring-indigo-400 border-indigo-400 bg-indigo-50/60'
                              : isSelected
                              ? 'bg-indigo-50/80 border-indigo-400 ring-1 ring-indigo-400/40 text-indigo-950'
                              : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0 transition-colors" />

                            <div
                              className={`w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0 text-xs ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                              }`}
                            >
                              <IconComponent className="w-3 h-3" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold truncate leading-tight">
                                {getBlockTypeLabel(block)}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                                {getBlockSummary(block)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateBlock(block.id);
                              }}
                              title="Dupliquer"
                              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteBlock(block.id);
                              }}
                              title="Supprimer"
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Nested Child Blocks for Exercise Container */}
                        {block.type === 'exercise' &&
                          block.children &&
                          block.children.length > 0 && (
                            <div className="pl-5 pr-1 py-0.5 space-y-1 border-l-2 border-indigo-100 ml-3 my-0.5">
                              {block.children.map((child) => {
                                const ChildIcon = getBlockIcon(child.type);
                                return (
                                  <div
                                    key={child.id}
                                    onClick={() => onSelectBlock(block.id)}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50/80 hover:bg-indigo-50/50 border border-slate-200/60 text-[11px] text-slate-600 cursor-pointer"
                                  >
                                    <CornerDownRight className="w-3 h-3 text-slate-400 shrink-0" />
                                    <ChildIcon className="w-3 h-3 text-indigo-500 shrink-0" />
                                    <span className="font-semibold text-slate-700 shrink-0">
                                      {getBlockTypeLabel(child)} :
                                    </span>
                                    <span className="truncate text-[10px] text-slate-400">
                                      {getBlockSummary(child)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        {/* Insertion divider between blocks */}
                        <div className="relative group/insert py-0.5 z-20">
                          <div
                            className="h-3 flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              setInsertPopoverState({
                                isOpen: true,
                                insertIndex: nextInsertIdx,
                                triggerRect: rect,
                              });
                            }}
                          >
                            <div
                              className={`w-full h-[1.5px] transition-all rounded-full ${
                                isNextActive
                                  ? 'bg-indigo-500 shadow-2xs'
                                  : 'bg-transparent group-hover/insert:bg-indigo-300'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setInsertPopoverState({
                                  isOpen: true,
                                  insertIndex: nextInsertIdx,
                                  triggerRect: rect,
                                });
                              }}
                              title="Insérer un bloc ici"
                              className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                                isNextActive
                                  ? 'bg-indigo-600 text-white scale-110 opacity-100 ring-2 ring-indigo-200'
                                  : 'bg-indigo-600 text-white opacity-0 group-hover/insert:opacity-100 hover:scale-110'
                              }`}
                            >
                              <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>

            {/* "+ Ajouter un bloc" at bottom of structure */}
            <div className="p-2.5 border-t border-slate-200/80 bg-slate-50/80 relative shrink-0 space-y-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setInsertPopoverState({
                    isOpen: true,
                    insertIndex: blocks.length,
                    triggerRect: rect,
                  });
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Ajouter un bloc</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 2: BLOCS (The 5 Core Phase 2 Blocks) */}
        {activeTab === 'blocks' && (
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3 custom-scrollbar">
            <div className="px-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Architecture de base (5 blocs)
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold">
                Cliquer ou glisser
              </span>
            </div>

            <div className="space-y-2">
              {filteredBlocks.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, b.type)}
                    onClick={() => onAddBlock(b.type)}
                    className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-400 hover:bg-indigo-50/15 hover:shadow-xs transition-all cursor-pointer active:scale-98"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${b.badgeColor} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                        {b.title}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {b.description}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 self-center transition-colors" />
                  </div>
                );
              })}
            </div>

            {/* Composable LEGO workflow tip */}
            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Logique LEGO pédagogique</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                Insérez un <strong>Conteneur d’Exercice</strong>, puis composez librement l’intérieur avec du <strong>Texte + Maths ($...$)</strong>, des <strong>Lignes de réponse</strong> et des <strong>Séparateurs</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle on Right Border */}
      {onStartResize && (
        <div
          onPointerDown={onStartResize}
          title="Glisser pour redimensionner la bibliothèque (↔)"
          className={`absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-40 group flex items-center justify-center select-none ${
            isResizing ? 'pointer-events-auto' : ''
          }`}
        >
          <div
            className={`h-full w-[2px] transition-colors ${
              isResizing
                ? 'bg-indigo-600 shadow-sm'
                : 'bg-transparent group-hover:bg-indigo-400'
            }`}
          />
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

      {/* Block Insertion Popover */}
      <BlockInsertPopover
        isOpen={insertPopoverState.isOpen}
        onClose={() =>
          setInsertPopoverState({ isOpen: false, insertIndex: undefined, triggerRect: null })
        }
        triggerRect={insertPopoverState.triggerRect}
        positionHint="side"
        onSelectOption={(opt) => {
          onAddBlock(opt.type, opt.customProps, insertPopoverState.insertIndex);
          setInsertPopoverState({ isOpen: false, insertIndex: undefined, triggerRect: null });
        }}
      />
    </aside>
  );
};
