import React, { useRef, useEffect, useState } from 'react';
import {
  WorksheetBlock,
  PedagogicalQuestionItem,
  AnswerLineStyle,
} from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { PedagogicalQuestionRenderer } from './PedagogicalQuestionRenderer';
import { createDefaultChildBlock } from '../../../data/defaultWorksheet';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Type,
  PenTool,
  Minus,
  ListOrdered,
  Heading2,
  GripHorizontal,
} from 'lucide-react';

interface ExerciseBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdate: (updates: Partial<WorksheetBlock>) => void;
  onUpdateContent: (contentUpdates: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles?: (styleUpdates: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (newHeight: number) => void;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function formatExerciseHeaderTitle(
  block: WorksheetBlock,
  isRtl: boolean
): string {
  const exNum = block.content.exerciseNumber || 1;
  const style = block.content.numberingStyle || 'exercice_n';
  const customTitle = block.content.exerciseTitle;

  if (customTitle !== undefined && customTitle.trim().length > 0) {
    return customTitle;
  }

  switch (style) {
    case 'exercice_n':
      return isRtl ? `تمرين عدد ${exNum}` : `Exercice N° ${exNum}`;
    case 'exercice':
      return isRtl ? `التمرين ${exNum}` : `Exercice ${exNum}`;
    case 'roman': {
      const rom = ROMAN_NUMERALS[(exNum - 1) % ROMAN_NUMERALS.length] || String(exNum);
      return `${rom}.`;
    }
    case 'numeric':
      return `${exNum}.`;
    case 'none':
      return '';
    default:
      return isRtl ? `تمرين عدد ${exNum}` : `Exercice N° ${exNum}`;
  }
}

export const ExerciseBlockItem: React.FC<ExerciseBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdate,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingPoints, setEditingPoints] = useState(false);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [isDragOverContainer, setIsDragOverContainer] = useState(false);

  const isRtl =
    block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');
  const fontSize = block.styles.fontSize || 15;
  const textColor = block.styles.color || '#0f172a';
  const showInstruction = Boolean(block.content.showInstruction);
  const showPoints = block.content.showPoints !== false;
  const pointsPosition = block.content.pointsPosition || (isRtl ? 'left' : 'right');
  const headerStyle = block.content.headerStyle || 'underlined';
  const childSpacing = block.styles.spacing ?? 8;

  const exerciseNumber = block.content.exerciseNumber || 1;
  const exerciseTitle = formatExerciseHeaderTitle(block, isRtl);
  const pointsText =
    block.content.points !== undefined
      ? String(block.content.points)
      : isRtl
      ? '4 نقاط'
      : '4 points';

  const childrenBlocks: WorksheetBlock[] = block.children || [];
  const legacyQuestions: PedagogicalQuestionItem[] =
    block.content.pedagogicalQuestions || [];

  useEffect(() => {
    if (!isSelected) {
      setActiveChildId(null);
      setEditingPoints(false);
    }
  }, [isSelected]);

  // Dynamic Height Sync for vertical Document Flow reflow
  useEffect(() => {
    if (!containerRef.current || !onUpdateHeight) return;
    const measureAndSync = () => {
      if (!containerRef.current) return;
      const measured = Math.ceil(containerRef.current.scrollHeight);
      if (Math.abs(measured - block.height) > 4 && measured > 40) {
        onUpdateHeight(measured);
      }
    };
    measureAndSync();
    const observer = new ResizeObserver(measureAndSync);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [
    childrenBlocks,
    legacyQuestions,
    showInstruction,
    showPoints,
    block.content.instructionText,
    exerciseTitle,
    pointsText,
    headerStyle,
    childSpacing,
    isSelected,
    block.height,
  ]);

  // Child Block CRUD Operations
  const handleUpdateChildren = (nextChildren: WorksheetBlock[]) => {
    onUpdate({
      children: nextChildren,
      metadata: {
        ...block.metadata,
        updatedAt: Date.now(),
      },
    });
  };

  const handleAddChild = (
    type: 'rich_text' | 'answer_lines' | 'separator' | 'title',
    overrides?: Partial<WorksheetBlock>
  ) => {
    // Auto-number question statements if adding a paragraph rich_text
    let childOverrides = overrides;
    if (type === 'rich_text' && (!overrides?.content?.variant || overrides?.content?.variant === 'paragraph')) {
      const existingQuestionsCount = childrenBlocks.filter(
        (c) =>
          (c.type === 'rich_text' || c.type === 'text') &&
          c.content.variant !== 'instruction' &&
          c.content.variant !== 'subtitle'
      ).length;
      const nextQNum = existingQuestionsCount + 1;
      childOverrides = {
        ...overrides,
        content: {
          variant: 'paragraph',
          text: isRtl
            ? `${nextQNum}) اكتب نص السؤال أو المعادلة هنا...`
            : `${nextQNum}) Écrire l’énoncé de la question ici…`,
          ...overrides?.content,
        },
      };
    }

    const newChild = createDefaultChildBlock(type, isRtl, childOverrides);
    const next = [...childrenBlocks, newChild];
    handleUpdateChildren(next);
    setActiveChildId(newChild.id);
  };

  const handleUpdateChild = (childId: string, updates: Partial<WorksheetBlock>) => {
    const next = childrenBlocks.map((c) =>
      c.id === childId
        ? {
            ...c,
            ...updates,
            content: updates.content ? { ...c.content, ...updates.content } : c.content,
            styles: updates.styles ? { ...c.styles, ...updates.styles } : c.styles,
          }
        : c
    );
    handleUpdateChildren(next);
  };

  const handleDuplicateChild = (childIdx: number) => {
    const target = childrenBlocks[childIdx];
    if (!target) return;
    const copy: WorksheetBlock = {
      ...JSON.parse(JSON.stringify(target)),
      id: `child_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const next = [...childrenBlocks];
    next.splice(childIdx + 1, 0, copy);
    handleUpdateChildren(next);
    setActiveChildId(copy.id);
  };

  const handleDeleteChild = (childIdx: number) => {
    const next = childrenBlocks.filter((_, idx) => idx !== childIdx);
    handleUpdateChildren(next);
  };

  const handleMoveChild = (childIdx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? childIdx - 1 : childIdx + 1;
    if (targetIdx < 0 || targetIdx >= childrenBlocks.length) return;
    const next = [...childrenBlocks];
    const [moved] = next.splice(childIdx, 1);
    next.splice(targetIdx, 0, moved);
    handleUpdateChildren(next);
  };

  // Drag & Drop from Left Panel into Exercise Container
  const handleDragOverExercise = (e: React.DragEvent) => {
    if (readOnly) return;
    const draggedType = e.dataTransfer.types.includes('text/plain');
    if (draggedType) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOverContainer(true);
    }
  };

  const handleDragLeaveExercise = () => {
    setIsDragOverContainer(false);
  };

  const handleDropIntoExercise = (e: React.DragEvent) => {
    if (readOnly) return;
    setIsDragOverContainer(false);
    const rawType = e.dataTransfer.getData('text/plain');
    if (!rawType) return;
    // Ignore numeric index drags from structure list
    if (/^\d+$/.test(rawType)) return;

    e.preventDefault();
    e.stopPropagation();

    if (rawType === 'rich_text' || rawType === 'text') {
      handleAddChild('rich_text');
    } else if (rawType === 'instruction') {
      handleAddChild('rich_text', {
        content: {
          variant: 'instruction',
          label: isRtl ? 'تعليمة :' : 'Consigne :',
          text: isRtl ? 'اقرأ بانتباه وأجب عن السؤال :' : 'Consigne particulière :',
        },
      });
    } else if (rawType === 'answer_lines' || rawType === 'answer_zone') {
      handleAddChild('answer_lines');
    } else if (rawType === 'separator' || rawType === 'line' || rawType === 'spacer') {
      handleAddChild('separator');
    } else if (rawType === 'title' || rawType === 'subtitle') {
      handleAddChild('title');
    }
  };

  // Render an Answer Lines child block
  const renderChildAnswerLines = (child: WorksheetBlock, idx: number) => {
    const lineCount = child.content.lineCount ?? 3;
    const lineSpacing = child.content.lineSpacing ?? 32;
    const lineStyle: AnswerLineStyle =
      (child.content.lineStyle as AnswerLineStyle) ||
      (child.content.answerType === 'dots' ? 'dotted' : 'dotted');
    const answerType = child.content.answerType || 'lines';
    const isChildActive = isSelected && activeChildId === child.id;

    const handleStartLineResize = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startLines = lineCount;

      const onMove = (moveEvent: MouseEvent) => {
        const deltaY = moveEvent.clientY - startY;
        const deltaLines = Math.round(deltaY / lineSpacing);
        const nextLines = Math.max(1, Math.min(25, startLines + deltaLines));
        if (nextLines !== child.content.lineCount) {
          handleUpdateChild(child.id, {
            height: nextLines * lineSpacing + 8,
            content: {
              ...child.content,
              lineCount: nextLines,
            },
          });
        }
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    };

    return (
      <div
        onClick={(e) => {
          if (readOnly) return;
          e.stopPropagation();
          setActiveChildId(child.id);
        }}
        className={`relative rounded-lg transition-all ${
          !readOnly && isChildActive
            ? 'ring-1 ring-indigo-400 bg-indigo-50/15 px-2 py-1'
            : !readOnly && isSelected
            ? 'hover:bg-slate-50/70 px-1 py-0.5'
            : 'py-0.5'
        }`}
      >
        {/* Quick inline bar when child is active */}
        {!readOnly && isChildActive && (
          <div
            dir="ltr"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-wrap items-center justify-between gap-2 mb-1.5 px-2 py-1 rounded-md bg-slate-900 text-white text-[11px] shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-slate-300 font-semibold">Lignes :</span>
              <button
                type="button"
                onClick={() => {
                  const next = Math.max(1, lineCount - 1);
                  handleUpdateChild(child.id, {
                    height: next * lineSpacing + 8,
                    content: { ...child.content, lineCount: next },
                  });
                }}
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
              >
                -
              </button>
              <span className="font-bold text-indigo-300 tabular-nums px-1">
                {lineCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = Math.min(25, lineCount + 1);
                  handleUpdateChild(child.id, {
                    height: next * lineSpacing + 8,
                    content: { ...child.content, lineCount: next },
                  });
                }}
                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Style selector */}
            <div className="flex items-center gap-1">
              {[
                { id: 'dotted', label: 'Pointillés', type: 'lines' },
                { id: 'solid', label: 'Lignes', type: 'lines' },
                { id: 'dashed', label: 'Tirets', type: 'lines' },
                { id: 'grid', label: 'Quadrillage', type: 'grid' },
                { id: 'box', label: 'Cadre', type: 'box' },
              ].map((st) => {
                const active =
                  st.type === 'grid'
                    ? answerType === 'grid'
                    : st.type === 'box'
                    ? answerType === 'box'
                    : answerType === 'lines' && lineStyle === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      if (st.type === 'grid' || st.type === 'box') {
                        handleUpdateChild(child.id, {
                          content: { ...child.content, answerType: st.type as any },
                        });
                      } else {
                        handleUpdateChild(child.id, {
                          content: {
                            ...child.content,
                            answerType: 'lines',
                            lineStyle: st.id as AnswerLineStyle,
                          },
                        });
                      }
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>

            {/* Spacing selector */}
            <div className="flex items-center gap-1">
              {[
                { label: 'Compact', px: 24 },
                { label: 'Normal', px: 32 },
                { label: 'Large', px: 40 },
              ].map((sp) => (
                <button
                  key={sp.px}
                  type="button"
                  onClick={() =>
                    handleUpdateChild(child.id, {
                      height: lineCount * sp.px + 8,
                      content: { ...child.content, lineSpacing: sp.px },
                    })
                  }
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    lineSpacing === sp.px
                      ? 'bg-slate-700 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Render Lines / Grid / Box */}
        {answerType === 'box' ? (
          <div
            className="w-full border border-slate-400 rounded-md bg-white/50"
            style={{ height: `${Math.max(56, lineCount * lineSpacing)}px` }}
          />
        ) : answerType === 'grid' ? (
          <div
            className="w-full border border-slate-300 rounded-xs"
            style={{
              height: `${Math.max(56, lineCount * lineSpacing)}px`,
              backgroundImage:
                'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
        ) : (
          <div className="w-full flex flex-col">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div
                key={i}
                className="w-full flex items-end"
                style={{ height: `${lineSpacing}px` }}
              >
                <div
                  className="w-full"
                  style={{
                    borderBottomWidth: lineStyle === 'dotted' ? '2px' : '1.5px',
                    borderBottomStyle: lineStyle,
                    borderBottomColor: child.styles.borderColor || '#94a3b8',
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom Interactive Resize Handle to add/remove lines by dragging */}
        {!readOnly && isSelected && (
          <div
            onMouseDown={handleStartLineResize}
            title="Glisser verticalement pour ajouter ou retirer des lignes"
            className="w-full h-3 flex items-center justify-center cursor-ns-resize opacity-0 hover:opacity-100 transition-opacity"
          >
            <div className="w-10 h-1 rounded-full bg-indigo-400" />
          </div>
        )}
      </div>
    );
  };

  // Render a Separator / Spacer child block
  const renderChildSeparator = (child: WorksheetBlock) => {
    const mode = child.content.separatorMode || (child.type === 'spacer' ? 'space' : 'line');
    const lineStyle = child.content.lineStyle || 'solid';
    const spacerHeight = child.content.spacerHeight || child.height || 20;
    const isChildActive = isSelected && activeChildId === child.id;

    return (
      <div
        onClick={(e) => {
          if (readOnly) return;
          e.stopPropagation();
          setActiveChildId(child.id);
        }}
        className="relative py-1"
      >
        {!readOnly && isChildActive && (
          <div
            dir="ltr"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 mb-1 px-2 py-1 rounded bg-slate-900 text-white text-[10px] w-fit"
          >
            <button
              type="button"
              onClick={() =>
                handleUpdateChild(child.id, {
                  content: { ...child.content, separatorMode: 'line' },
                })
              }
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                mode === 'line' ? 'bg-indigo-600 font-bold' : 'text-slate-300'
              }`}
            >
              Ligne
            </button>
            <button
              type="button"
              onClick={() =>
                handleUpdateChild(child.id, {
                  content: { ...child.content, separatorMode: 'space' },
                })
              }
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                mode === 'space' ? 'bg-indigo-600 font-bold' : 'text-slate-300'
              }`}
            >
              Espace vide
            </button>
            {mode === 'line' ? (
              <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                {(['solid', 'dotted', 'dashed'] as const).map((ls) => (
                  <button
                    key={ls}
                    type="button"
                    onClick={() =>
                      handleUpdateChild(child.id, {
                        content: { ...child.content, lineStyle: ls },
                      })
                    }
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${
                      lineStyle === ls ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {ls === 'solid' ? 'Continue' : ls === 'dotted' ? 'Pointillée' : 'Tirets'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
                {[16, 28, 44].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() =>
                      handleUpdateChild(child.id, {
                        height: h,
                        content: { ...child.content, spacerHeight: h },
                      })
                    }
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${
                      spacerHeight === h ? 'bg-slate-700 text-amber-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {h}px
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'space' ? (
          <div
            style={{ height: `${spacerHeight}px` }}
            className={`w-full flex items-center justify-center rounded ${
              !readOnly && isSelected
                ? 'border border-dashed border-slate-300/70 bg-slate-50/40 text-[10px] text-slate-400'
                : ''
            }`}
          >
            {!readOnly && isSelected && <span>Espace ({spacerHeight}px)</span>}
          </div>
        ) : (
          <div className="w-full py-1.5 flex items-center">
            <div
              className="w-full"
              style={{
                borderTopWidth: `${child.styles.borderWidth || 1.5}px`,
                borderTopStyle: lineStyle,
                borderTopColor: child.styles.borderColor || '#cbd5e1',
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      onDragOver={handleDragOverExercise}
      onDragLeave={handleDragLeaveExercise}
      onDrop={handleDropIntoExercise}
      className={`w-full flex flex-col select-none transition-colors ${
        isDragOverContainer ? 'ring-2 ring-indigo-500 bg-indigo-50/20 rounded-xl' : ''
      }`}
      style={{
        fontFamily: defaultFont,
        color: textColor,
        backgroundColor:
          block.styles.backgroundColor && block.styles.backgroundColor !== 'transparent'
            ? block.styles.backgroundColor
            : undefined,
        padding: block.styles.padding !== undefined ? `${block.styles.padding}px` : '10px',
        borderRadius:
          block.styles.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '8px',
        borderWidth:
          block.styles.borderWidth !== undefined ? `${block.styles.borderWidth}px` : '0px',
        borderStyle: block.styles.borderStyle || 'none',
        borderColor: block.styles.borderColor || '#cbd5e1',
      }}
    >
      {/* 1. EN-TÊTE D'EXERCICE (Titre + Barème) */}
      <div
        className={`flex items-center justify-between gap-3 pb-1.5 mb-2.5 ${
          pointsPosition === 'left' && !isRtl ? 'flex-row-reverse' : ''
        } ${
          headerStyle === 'underlined'
            ? 'border-b-2 border-slate-900'
            : headerStyle === 'boxed'
            ? 'bg-slate-100/90 border border-slate-300 rounded-lg px-3 py-1.5'
            : ''
        }`}
      >
        <div className="flex-1 min-w-0">
          <CoreRichTextField
            value={exerciseTitle}
            onChange={(newTitle) => onUpdateContent({ exerciseTitle: newTitle })}
            placeholder={isRtl ? `تمرين عدد ${exerciseNumber}` : `Exercice N° ${exerciseNumber}`}
            isRtl={isRtl}
            readOnly={readOnly}
            isSelected={isSelected}
            singleLine
            styles={{
              fontFamily: defaultFont,
              fontSize: fontSize + 2,
              fontWeight: 'bold',
              color: textColor,
              textDirection: isRtl ? 'rtl' : 'ltr',
            }}
            onUpdateStyles={onUpdateStyles}
            labelBadge="Titre Exercice"
          />
        </div>

        {/* Points / Barème Badge (Directly editable on click) */}
        {showPoints && (
          <div className="flex items-center gap-1.5 shrink-0">
            {!readOnly && editingPoints ? (
              <input
                type="text"
                autoFocus
                value={pointsText}
                onChange={(e) => onUpdateContent({ points: e.target.value })}
                onBlur={() => setEditingPoints(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setEditingPoints(false);
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-24 px-2 py-0.5 text-sm font-bold text-slate-900 bg-white border border-indigo-500 rounded-md outline-none text-center shadow-xs"
              />
            ) : (
              <span
                onClick={(e) => {
                  if (readOnly) return;
                  e.stopPropagation();
                  setEditingPoints(true);
                }}
                className={`text-sm font-bold text-slate-800 px-2.5 py-0.5 rounded-md bg-slate-100/90 border border-slate-300 tabular-nums ${
                  !readOnly ? 'hover:border-indigo-400 hover:bg-indigo-50/50 cursor-text' : ''
                }`}
                title={
                  readOnly
                    ? undefined
                    : 'Cliquez pour modifier le barème (ex: 4 points, 5 pts)'
                }
              >
                ({pointsText})
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. CONSIGNE GÉNÉRALE DE L'EXERCICE (Optionnelle) */}
      {showInstruction && (
        <div className="mb-2.5 pl-1">
          <CoreRichTextField
            value={block.content.instructionText || ''}
            onChange={(newInst) => onUpdateContent({ instructionText: newInst })}
            placeholder={
              isRtl
                ? 'اكتب تعليمة التمرين أو المعطيات العامة هنا...'
                : 'Consigne générale ou données introductives de l’exercice…'
            }
            isRtl={isRtl}
            readOnly={readOnly}
            isSelected={isSelected}
            styles={{
              fontFamily: block.styles.instructionFontFamily || defaultFont,
              fontSize: block.styles.instructionFontSize || fontSize,
              fontStyle: block.styles.instructionFontStyle || 'italic',
              fontWeight: block.styles.instructionFontWeight || 'normal',
              color: block.styles.instructionColor || '#334155',
              textDirection: isRtl ? 'rtl' : 'ltr',
            }}
            labelBadge="Consigne"
          />
        </div>
      )}

      {/* 3. BLOCS ENFANTS COMPOSABLES (Phase 2 Architecture) */}
      <div
        className="flex flex-col"
        style={{ gap: `${childSpacing}px` }}
      >
        {childrenBlocks.map((child, cIdx) => {
          const isChildRtl =
            child.styles?.textDirection === 'rtl' ||
            (child.styles?.textDirection !== 'ltr' && isRtl);
          const isInstructionVariant =
            child.type === 'instruction' || child.content.variant === 'instruction';

          return (
            <div
              key={child.id}
              onClick={(e) => {
                if (readOnly) return;
                e.stopPropagation();
                setActiveChildId(child.id);
              }}
              className="group/child relative"
            >
              {/* Subtle Child Reorder / Duplicate / Delete Controls when Exercise is selected */}
              {!readOnly && isSelected && (
                <div
                  dir="ltr"
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute ${
                    isRtl ? '-left-2' : '-right-2'
                  } -top-2.5 opacity-0 group-hover/child:opacity-100 transition-opacity z-30 flex items-center gap-0.5 bg-white border border-slate-200 rounded-md px-1 py-0.5 shadow-sm`}
                >
                  <button
                    type="button"
                    disabled={cIdx === 0}
                    onClick={() => handleMoveChild(cIdx, 'up')}
                    title="Monter"
                    className="p-0.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={cIdx === childrenBlocks.length - 1}
                    onClick={() => handleMoveChild(cIdx, 'down')}
                    title="Descendre"
                    className="p-0.5 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateChild(cIdx)}
                    title="Dupliquer cet élément"
                    className="p-0.5 rounded hover:bg-indigo-50 text-indigo-600 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteChild(cIdx)}
                    title="Supprimer cet élément"
                    className="p-0.5 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Render Child by Type */}
              {(child.type === 'rich_text' ||
                child.type === 'text' ||
                child.type === 'instruction' ||
                child.type === 'subtitle') && (
                <div
                  className={
                    isInstructionVariant
                      ? 'bg-slate-50/90 border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-start gap-2'
                      : ''
                  }
                >
                  {isInstructionVariant && (
                    <span className="font-bold shrink-0 text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-xs border border-indigo-200 mt-0.5">
                      {child.content.label || (isChildRtl ? 'تعليمة :' : 'Consigne :')}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <CoreRichTextField
                      value={child.content.text || ''}
                      onChange={(newText) =>
                        handleUpdateChild(child.id, {
                          content: { ...child.content, text: newText },
                        })
                      }
                      placeholder={
                        isChildRtl
                          ? 'اكتب نص السؤال أو المعادلة الرياضية هنا...'
                          : 'Rédigez votre énoncé ou question (ex: Calculer $\\frac{3}{4} + \\frac{5}{4}$)...'
                      }
                      isRtl={isChildRtl}
                      readOnly={readOnly}
                      isSelected={isSelected}
                      styles={{
                        fontFamily: child.styles.fontFamily || defaultFont,
                        fontSize: child.styles.fontSize || fontSize,
                        fontWeight: child.styles.fontWeight || 'normal',
                        fontStyle: child.styles.fontStyle || 'normal',
                        textDecoration: child.styles.textDecoration || 'none',
                        textAlign:
                          child.styles.textAlign || (isChildRtl ? 'right' : 'left'),
                        color: child.styles.color || textColor,
                        textDirection: isChildRtl ? 'rtl' : 'ltr',
                      }}
                      onUpdateStyles={(st) =>
                        handleUpdateChild(child.id, {
                          styles: { ...child.styles, ...st },
                        })
                      }
                      labelBadge={isInstructionVariant ? 'Consigne' : 'Énoncé / Question'}
                    />
                  </div>
                </div>
              )}

              {(child.type === 'answer_lines' || child.type === 'answer_zone') &&
                renderChildAnswerLines(child, cIdx)}

              {(child.type === 'separator' ||
                child.type === 'line' ||
                child.type === 'spacer') &&
                renderChildSeparator(child)}

              {child.type === 'title' && (
                <div className="pt-1 pb-0.5">
                  <CoreRichTextField
                    value={child.content.text || ''}
                    onChange={(newText) =>
                      handleUpdateChild(child.id, {
                        content: { ...child.content, text: newText },
                      })
                    }
                    placeholder={isChildRtl ? 'عنوان الجزء...' : 'Titre de sous-partie (ex: Partie A)…'}
                    isRtl={isChildRtl}
                    readOnly={readOnly}
                    isSelected={isSelected}
                    singleLine
                    styles={{
                      fontFamily: child.styles.fontFamily || defaultFont,
                      fontSize: child.styles.fontSize || fontSize + 1,
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                      color: child.styles.color || textColor,
                      textDirection: isChildRtl ? 'rtl' : 'ltr',
                    }}
                    onUpdateStyles={(st) =>
                      handleUpdateChild(child.id, {
                        styles: { ...child.styles, ...st },
                      })
                    }
                    labelBadge="Sous-partie"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Legacy fallback if an older Exercise block only had pedagogicalQuestions */}
        {childrenBlocks.length === 0 && legacyQuestions.length > 0 && (
          <div className="space-y-2.5">
            {legacyQuestions.map((q, qIdx) => (
              <PedagogicalQuestionRenderer
                key={q.id}
                question={q}
                index={qIdx}
                totalQuestions={legacyQuestions.length}
                isSelected={isSelected}
                readOnly={readOnly}
                isRtl={isRtl}
                showAnswers={Boolean(block.content.showAnswers)}
                fontFamily={defaultFont}
                fontSize={fontSize}
                textColor={textColor}
                onUpdate={(updated) => {
                  const next = legacyQuestions.map((item, idx) =>
                    idx === qIdx ? updated : item
                  );
                  onUpdateContent({ pedagogicalQuestions: next });
                }}
                onDelete={() => {
                  const next = legacyQuestions.filter((_, idx) => idx !== qIdx);
                  onUpdateContent({ pedagogicalQuestions: next });
                }}
                onMoveUp={() => {}}
                onMoveDown={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. BARRE D'AJOUT DE BLOCS INTERNES (Visible quand l'exercice est sélectionné) */}
      {isSelected && !readOnly && (
        <div
          dir="ltr"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 pt-2 border-t border-dashed border-slate-300 flex flex-wrap items-center justify-between gap-1.5"
        >
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Ajouter dans l’exercice :</span>
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleAddChild('rich_text')}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Type className="w-3 h-3" />
              <span>+ Question / Texte (∑)</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddChild('answer_lines')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PenTool className="w-3 h-3" />
              <span>+ Lignes de réponse</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleAddChild('rich_text', {
                  content: {
                    variant: 'instruction',
                    label: isRtl ? 'تعليمة :' : 'Consigne :',
                    text: isRtl
                      ? 'علّل جميع مراحل الحساب :'
                      : 'Justifiez toutes vos étapes de calcul :',
                  },
                })
              }
              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3 h-3" />
              <span>+ Consigne</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddChild('separator')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
              <span>+ Séparateur / Espace</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddChild('title')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Heading2 className="w-3 h-3" />
              <span>+ Sous-partie</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
