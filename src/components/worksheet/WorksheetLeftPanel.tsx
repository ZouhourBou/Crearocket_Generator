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
  Heading2,
  ListOrdered,
  Type,
  AlignLeft,
  Image as ImageIcon,
  Minus,
  Square,
  MoveVertical,
  PenTool,
  Layers,
  Sparkles,
  ArrowLeftRight,
  Bookmark,
  PenLine,
  CheckSquare,
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
  category: 'text' | 'exercises' | 'layout';
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}

const AVAILABLE_BLOCKS: BlockDefinition[] = [
  // EXERCICES
  {
    type: 'qcm_exam',
    title: 'QCM d’évaluation (Bilingue)',
    description: 'QCM universel avec cases à cocher, repères alphabétiques (FR / AR) et formules mathématiques isolées',
    category: 'exercises',
    icon: CheckSquare,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    type: 'exercise_header',
    title: "En-tête d'exercice",
    description: "Titre d'exercice (ex: Exercice 1) et barème indépendant",
    category: 'exercises',
    icon: Bookmark,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    type: 'fill_in_blanks',
    title: 'Compléter (souligné)',
    description: 'Phrases à trous avec zones soulignées et formules mathématiques',
    category: 'exercises',
    icon: PenLine,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  // TEXTE
  {
    type: 'title',
    title: 'Titre',
    description: 'Grand titre principal de la fiche ou évaluation',
    category: 'text',
    icon: Heading1,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    type: 'subtitle',
    title: 'Sous-titre',
    description: 'Sous-titre ou thème de la leçon / exercice',
    category: 'text',
    icon: Heading2,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    type: 'instruction',
    title: 'Consigne',
    description: 'Consigne encadrée pour guider les élèves',
    category: 'text',
    icon: ListOrdered,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    type: 'text',
    title: 'Texte & Paragraphe (نص وفقرة)',
    description: 'Éditeur enrichi Word + Canva : texte libre, formules mathématiques (∑) et bilingue FR/AR',
    category: 'text',
    icon: Type,
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  // MISE EN PAGE
  {
    type: 'image',
    title: 'Image',
    description: 'Illustration, schéma ou photo pédagogique',
    category: 'layout',
    icon: ImageIcon,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    type: 'line',
    title: 'Ligne',
    description: 'Séparateur horizontal simple ou décoratif',
    category: 'layout',
    icon: Minus,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  {
    type: 'shape',
    title: 'Forme',
    description: 'Cadre, rectangle ou cercle coloré',
    category: 'layout',
    icon: Square,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    type: 'spacer',
    title: 'Espace',
    description: 'Espace vertical ajustable pour aérer la page',
    category: 'layout',
    icon: MoveVertical,
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-300',
  },
  {
    type: 'answer_zone',
    title: 'Zone de réponse',
    description: 'Lignes d’écriture, pointillés ou cadre élève',
    category: 'layout',
    icon: PenTool,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

export const WorksheetLeftPanel: React.FC<WorksheetLeftPanelProps> = ({
  isOpen,
  onClose,
  width = 240,
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
  const [activeTab, setActiveTab] = useState<'structure' | 'blocks'>('structure');
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

  const textBlocks = filteredBlocks.filter((b) => b.category === 'text');
  const exerciseBlocks = filteredBlocks.filter((b) => b.category === 'exercises');
  const layoutBlocks = filteredBlocks.filter((b) => b.category === 'layout');

  const getBlockIcon = (type: WorksheetBlockType) => {
    const found = AVAILABLE_BLOCKS.find((b) => b.type === type);
    if (!found) return Type;
    return found.icon;
  };

  const getBlockSummary = (block: WorksheetBlock) => {
    if (block.type === 'qcm_exam') {
      const qCount = block.content.questions?.length || 1;
      return `QCM (${qCount} ${qCount > 1 ? 'questions' : 'question'})`;
    }
    if (block.type === 'exercise_header') {
      const title = block.content.exerciseTitle || 'Exercice';
      const pts = block.content.points ? ` • (${block.content.points})` : '';
      return `${title}${pts}`;
    }
    if (block.type === 'fill_in_blanks') {
      const count = block.content.lines?.length || 1;
      return `Compléter (${count} ${count > 1 ? 'phrases' : 'phrase'})`;
    }
    if (block.content.text) return block.content.text;
    if (block.type === 'instruction') return block.content.label || 'Consigne';
    if (block.type === 'image') return 'Image / Illustration';
    if (block.type === 'line') return 'Ligne séparatrice';
    if (block.type === 'shape') return `Forme (${block.content.shapeType || 'rectangle'})`;
    if (block.type === 'spacer') return `Espace (${block.height}px)`;
    if (block.type === 'answer_zone') return `Lignes élève (${block.content.lineCount || 3} lignes)`;
    return block.type;
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
      {/* Top Header: Title & Close Button */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Bibliothèque
            </h2>
            <p className="text-[11px] text-slate-400">Page {currentPageNumber}</p>
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
            placeholder="Rechercher des sections ou des blocs…"
            className="w-full pl-8 pr-3 py-1.5 bg-white text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      </div>

      {/* Tabs Switcher: STRUCTURE vs BLOCS */}
      <div className="grid grid-cols-2 p-1 bg-slate-100/90 border-b border-slate-200/80 m-2.5 rounded-xl gap-1 text-xs font-bold shrink-0">
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
          <span>BLOCS</span>
        </button>
      </div>

      {/* Tab Content 1: STRUCTURE */}
      {activeTab === 'structure' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-3.5 py-2 flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 shrink-0">
            <span>Éléments de la page</span>
            <span className="text-[11px] text-slate-400">Glissez pour réordonner</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {blocks.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Aucun bloc sur cette page</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cliquez sur le bouton ci-dessous pour commencer à composer votre fiche.
                </p>
              </div>
            ) : (
              <>
                {/* Insertion divider at the very top (index 0) */}
                <div className="relative group/insert py-0.5 z-20">
                  <div
                    className="h-3 flex items-center justify-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setInsertPopoverState({
                        isOpen: true,
                        insertIndex: 0,
                        triggerRect: rect,
                      });
                    }}
                  >
                    <div
                      className={`w-full h-[1.5px] transition-all rounded-full ${
                        insertPopoverState.isOpen && insertPopoverState.insertIndex === 0
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
                          insertIndex: 0,
                          triggerRect: rect,
                        });
                      }}
                      title="Insérer un bloc en haut"
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        insertPopoverState.isOpen && insertPopoverState.insertIndex === 0
                          ? 'bg-indigo-600 text-white scale-110 opacity-100 ring-2 ring-indigo-200'
                          : 'bg-indigo-600 text-white opacity-0 group-hover/insert:opacity-100 hover:scale-110'
                      }`}
                    >
                      <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Blocks List */}
                {blocks.map((block, index) => {
                  const IconComponent = getBlockIcon(block.type);
                  const isSelected = block.id === selectedBlockId;
                  const isDragging = draggedIndex === index;
                  const isDragOver = dragOverIndex === index && draggedIndex !== index;
                  const nextInsertIdx = index + 1;
                  const isNextActive = insertPopoverState.isOpen && insertPopoverState.insertIndex === nextInsertIdx;

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
                        {/* Drag Handle & Info */}
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
                              {AVAILABLE_BLOCKS.find((b) => b.type === block.type)?.title || block.type}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                              {getBlockSummary(block)}
                            </div>
                          </div>
                        </div>

                        {/* Actions: Duplicate & Delete (No Arrows) */}
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

                      {/* Insertion divider between blocks (Shopify style) */}
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

          {/* "+ Ajouter" at bottom of structure */}
          <div className="p-2.5 border-t border-slate-200/80 bg-slate-50/80 relative shrink-0">
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
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Ajouter un bloc</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 2: BLOCS (Available Blocks Library) */}
      {activeTab === 'blocks' && (
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* EXERCISES Category */}
          {exerciseBlocks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
                Exercices
              </div>
              <div className="space-y-2">
                {exerciseBlocks.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, b.type)}
                      onClick={() => onAddBlock(b.type)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer active:scale-98"
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
            </div>
          )}

          {/* TEXT Category */}
          {textBlocks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
                Texte
              </div>
              <div className="space-y-2">
                {textBlocks.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, b.type)}
                      onClick={() => onAddBlock(b.type)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer active:scale-98"
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
            </div>
          )}

          {/* LAYOUT Category */}
          {layoutBlocks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
                Mise en page
              </div>
              <div className="space-y-2">
                {layoutBlocks.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, b.type)}
                      onClick={() => onAddBlock(b.type)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer active:scale-98"
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
            </div>
          )}

          {/* Future blocks notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
            <Sparkles className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <div className="text-[11px] font-bold text-slate-700">Blocs pédagogiques futurs</div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              QCM, Vrai/Faux, Relier et exercices interactifs seront intégrés dans les phases futures.
            </p>
          </div>
        </div>
      )}
      </div>

      {/* Resize Handle on Right Border (Point 2) */}
      {onStartResize && (
        <div
          onPointerDown={onStartResize}
          title="Glisser pour redimensionner la bibliothèque (↔)"
          className={`absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize z-40 group flex items-center justify-center select-none ${
            isResizing ? 'pointer-events-auto' : ''
          }`}
        >
          {/* Vertical highlight bar on border */}
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

      {/* Shopify-style Block Insertion Popover */}
      <BlockInsertPopover
        isOpen={insertPopoverState.isOpen}
        onClose={() => setInsertPopoverState({ isOpen: false, insertIndex: undefined, triggerRect: null })}
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
