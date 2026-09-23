import React, { useRef, useState, useEffect } from 'react';
import { WorksheetBlock, DocumentLanguage } from '../../types/worksheet';
import {
  Plus,
  Trash2,
  Copy,
  Pencil,
  GripHorizontal,
  Upload,
  Square,
  Circle,
  Globe,
} from 'lucide-react';
import { ExerciseHeaderBlockItem } from './blocks/ExerciseHeaderBlockItem';
import { FillInBlanksBlockItem } from './blocks/FillInBlanksBlockItem';
import { QCMExamBlockItem } from './blocks/QCMExamBlockItem';
import { InlineMathText } from './blocks/InlineMathText';
import { AdvancedTextParagraphBlock } from './blocks/AdvancedTextParagraphBlock';
import { resolveBlockDirection } from '../../utils/textDirection';
import { TitleFloatingToolbar } from './TitleFloatingToolbar';
import { formatTitlePrefix } from '../../utils/titleNumbering';
import {
  isBlockTranslated,
  saveBlockContentForLanguage,
  LANGUAGE_PLACEHOLDERS,
} from '../../utils/multilingual';

interface WorksheetBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<WorksheetBlock>) => void;
  onDuplicate: () => void;
  onDuplicateAsLanguage?: (lang: 'ar' | 'fr') => void;
  onDelete: () => void;
  onAddAfter: (e: React.MouseEvent) => void;
  zoom: number;
  pageWidth: number;
  pageHeight: number;
  onStartDrag: (e: React.MouseEvent, blockId: string) => void;
  onStartResize: (e: React.MouseEvent, blockId: string, handle: 'nw' | 'ne' | 'se' | 'sw') => void;
  documentDefaultDirection?: 'auto' | 'ltr' | 'rtl';
  activeDocumentLanguage?: DocumentLanguage;
  isPageIndependentArabic?: boolean;
}

export const WorksheetBlockItem: React.FC<WorksheetBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onSelect,
  onUpdate,
  onDuplicate,
  onDuplicateAsLanguage,
  onDelete,
  onAddAfter,
  zoom,
  pageWidth,
  pageHeight,
  onStartDrag,
  onStartResize,
  documentDefaultDirection = 'auto',
  activeDocumentLanguage = 'fr',
  isPageIndependentArabic = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  // CRITICAL: Automatically reset editing state whenever the block loses selection.
  // This guarantees that only the selected block can ever be in edit mode,
  // preventing previous blocks' editors from remaining open.
  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isSelected, isEditing]);

  const effectiveIsEditing = isSelected && (isEditing || block.type === 'text');

  // Auto-focus when user enters edit mode
  useEffect(() => {
    if (effectiveIsEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [effectiveIsEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (['title', 'subtitle', 'instruction', 'text', 'answer_zone'].includes(block.type)) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  // Determine effective language and direction
  const effectiveLang: DocumentLanguage = isPageIndependentArabic
    ? 'ar'
    : (activeDocumentLanguage === 'en' || activeDocumentLanguage === 'ar')
    ? activeDocumentLanguage
    : 'fr';
  const isRtl = isPageIndependentArabic ? true : (effectiveLang === 'ar');
  const effectiveDirection: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';
  const isTranslated = isBlockTranslated(block, effectiveLang);
  const placeholders = LANGUAGE_PLACEHOLDERS[effectiveLang] || LANGUAGE_PLACEHOLDERS.fr;

  // Sync content modifications into both content and translations[effectiveLang]
  const handleContentChange = (contentPartial: Partial<WorksheetBlock['content']>) => {
    const updated = saveBlockContentForLanguage(block, effectiveLang, contentPartial);
    onUpdate({
      content: updated.content,
      translations: updated.translations,
    });
  };

  const handleComplexBlockUpdate = (updates: Partial<WorksheetBlock>) => {
    if (updates.content) {
      const updated = saveBlockContentForLanguage(block, effectiveLang, updates.content);
      onUpdate({
        ...updates,
        content: updated.content,
        translations: updated.translations,
      });
    } else {
      onUpdate(updates);
    }
  };

  // Render Inner Content of Block
  const renderContent = () => {
    const s = block.styles;
    const defaultBlockFont = s.fontFamily || (effectiveDirection === 'rtl' || isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');
    const textAlign = s.textAlign || (isRtl ? 'right' : 'left');

    switch (block.type) {
      case 'title': {
        const titlePrefix = formatTitlePrefix(block.content.titleNumbering, isRtl);
        return effectiveIsEditing ? (
          <div
            className="w-full h-full flex items-center gap-2"
            dir={effectiveDirection}
            onClick={(e) => e.stopPropagation()}
          >
            {titlePrefix && (
              <span
                className="font-bold shrink-0 select-none"
                style={{
                  fontSize: `${s.fontSize || 26}px`,
                  fontFamily: defaultBlockFont,
                  fontWeight: s.fontWeight || 'bold',
                  fontStyle: s.fontStyle || 'normal',
                  textDecoration: s.textDecoration || 'none',
                  color: s.color || '#0f172a',
                }}
              >
                {titlePrefix}
              </span>
            )}
            <textarea
              ref={textInputRef as any}
              autoFocus
              value={block.content.text || ''}
              onChange={(e) => handleContentChange({ text: e.target.value })}
              onBlur={handleBlur}
              dir={effectiveDirection}
              placeholder={placeholders.titlePlaceholder}
              className="w-full h-full p-1 bg-transparent border border-indigo-400/50 rounded outline-none resize-none font-bold leading-tight"
              style={{
                fontSize: `${s.fontSize || 26}px`,
                fontFamily: defaultBlockFont,
                fontWeight: s.fontWeight || 'bold',
                fontStyle: s.fontStyle || 'normal',
                textDecoration: s.textDecoration || 'none',
                textAlign: s.textAlign || 'center',
                color: s.color || '#0f172a',
              }}
            />
          </div>
        ) : (
          <div
            dir={effectiveDirection}
            onClick={() => {
              if (!readOnly) {
                setIsEditing(true);
              }
            }}
            className="w-full h-full flex items-center gap-2 font-bold select-none cursor-text truncate-multiline"
            style={{
              fontSize: `${s.fontSize || 26}px`,
              fontFamily: defaultBlockFont,
              fontWeight: s.fontWeight || 'bold',
              fontStyle: s.fontStyle || 'normal',
              textDecoration: s.textDecoration || 'none',
              textAlign: s.textAlign || 'center',
              justifyContent:
                (s.textAlign || 'center') === 'center'
                  ? 'center'
                  : (s.textAlign || 'center') === 'right'
                  ? 'flex-end'
                  : 'flex-start',
              color: block.content.text ? s.color || '#0f172a' : '#94a3b8',
              lineHeight: 1.2,
            }}
          >
            {titlePrefix && (
              <span className="shrink-0 select-none">
                {titlePrefix}
              </span>
            )}
            <InlineMathText text={block.content.text || placeholders.titlePlaceholder} />
          </div>
        );
      }

      case 'subtitle':
        return effectiveIsEditing ? (
          <input
            ref={textInputRef as any}
            type="text"
            value={block.content.text || ''}
            onChange={(e) => handleContentChange({ text: e.target.value })}
            onBlur={handleBlur}
            dir={effectiveDirection}
            placeholder={placeholders.subtitlePlaceholder}
            className="w-full h-full p-1 bg-white/90 border border-indigo-400 rounded outline-none cursor-text"
            style={{
              fontSize: `${s.fontSize || 17}px`,
              fontFamily: defaultBlockFont,
              textAlign: s.textAlign || 'center',
              color: s.color || '#475569',
            }}
          />
        ) : (
          <div
            dir={effectiveDirection}
            className="w-full h-full flex items-center select-none"
            style={{
              fontSize: `${s.fontSize || 17}px`,
              fontFamily: defaultBlockFont,
              fontWeight: s.fontWeight || 'normal',
              fontStyle: s.fontStyle || 'italic',
              textDecoration: s.textDecoration || 'none',
              textAlign: s.textAlign || 'center',
              justifyContent:
                (s.textAlign || 'center') === 'center'
                  ? 'center'
                  : (s.textAlign || 'center') === 'right'
                  ? 'flex-end'
                  : 'flex-start',
              color: block.content.text ? (s.color || '#475569') : '#94a3b8',
            }}
          >
            <InlineMathText text={block.content.text || placeholders.subtitlePlaceholder} />
          </div>
        );

      case 'instruction':
        return (
          <div
            dir={effectiveDirection}
            className={`w-full h-full flex items-start gap-2 select-none ${
              isRtl ? 'flex-row-reverse' : ''
            }`}
          >
            <span className="font-bold shrink-0 text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[13px] border border-indigo-200">
              {block.content.label || placeholders.instructionLabel}
            </span>
            {effectiveIsEditing ? (
              <textarea
                ref={textInputRef as any}
                value={block.content.text || ''}
                onChange={(e) => handleContentChange({ text: e.target.value })}
                onBlur={handleBlur}
                dir={effectiveDirection}
                placeholder={placeholders.instruction}
                className="flex-1 h-full p-1 bg-white border border-indigo-400 rounded outline-none resize-none cursor-text"
                style={{
                  fontSize: `${s.fontSize || 15}px`,
                  fontFamily: defaultBlockFont,
                  color: s.color || '#1e293b',
                  textAlign,
                }}
              />
            ) : (
              <div
                dir={effectiveDirection}
                className="flex-1"
                style={{
                  fontSize: `${s.fontSize || 15}px`,
                  fontFamily: defaultBlockFont,
                  fontWeight: s.fontWeight || 'normal',
                  fontStyle: s.fontStyle || 'normal',
                  textDecoration: s.textDecoration || 'none',
                  color: block.content.text ? (s.color || '#1e293b') : '#94a3b8',
                  textAlign,
                }}
              >
                <InlineMathText
                  text={block.content.text || placeholders.instruction}
                />
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <AdvancedTextParagraphBlock
            block={block}
            isSelected={isSelected}
            isEditing={isSelected}
            onStartEditing={() => setIsEditing(true)}
            onStopEditing={() => {
              setIsEditing(false);
              onSelect();
            }}
            onUpdateContent={(c) => handleContentChange(c)}
            onUpdateStyles={(stylesPartial) =>
              onUpdate({
                styles: {
                  ...block.styles,
                  ...stylesPartial,
                },
              })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
            effectiveLang={effectiveLang}
            isRtl={isRtl}
            readOnly={readOnly}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onStartDrag={(e) => onStartDrag(e, block.id)}
          />
        );

      case 'image':
        return (
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-100 rounded-[inherit]">
            {block.content.src ? (
              <img
                src={block.content.src}
                alt={block.content.alt || 'Illustration'}
                className="w-full h-full object-contain pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4 text-slate-400 text-xs text-center">
                <Upload className="w-6 h-6 mb-1 text-slate-400" />
                <span>Cliquez pour choisir une image</span>
              </div>
            )}
          </div>
        );

      case 'line':
        return (
          <div className="w-full h-full flex items-center">
            <div
              className="w-full"
              style={{
                borderTopWidth: `${s.borderWidth || 2}px`,
                borderTopStyle: (s.borderStyle as any) || 'solid',
                borderTopColor: s.borderColor || '#94a3b8',
              }}
            />
          </div>
        );

      case 'shape':
        if (block.content.shapeType === 'circle') {
          return (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: s.backgroundColor || '#eff6ff',
                borderColor: s.borderColor || '#3b82f6',
                borderWidth: `${s.borderWidth || 2}px`,
                borderStyle: (s.borderStyle as any) || 'solid',
              }}
            />
          );
        }
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: s.backgroundColor || '#eff6ff',
              borderColor: s.borderColor || '#3b82f6',
              borderWidth: `${s.borderWidth || 2}px`,
              borderStyle: (s.borderStyle as any) || 'solid',
              borderRadius: `${s.borderRadius || 8}px`,
            }}
          />
        );

      case 'spacer':
        return (
          <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-300/60 rounded bg-slate-50/40 text-[10px] text-slate-400 select-none">
            Espace ({Math.round(block.height)}px)
          </div>
        );

      case 'answer_zone':
        const type = block.content.answerType || 'lines';
        const lineCount = block.content.lineCount || 4;

        if (type === 'box') {
          return (
            <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg p-2.5 flex items-start text-xs text-slate-400 italic select-none">
              {block.content.placeholder || 'Zone réservée à la réponse…'}
            </div>
          );
        }

        return (
          <div className="w-full h-full flex flex-col justify-between py-1 select-none">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div
                key={i}
                className="w-full"
                style={{
                  borderBottomWidth: '1.5px',
                  borderBottomStyle: type === 'dots' ? 'dotted' : 'solid',
                  borderBottomColor: '#cbd5e1',
                  height: `${100 / lineCount}%`,
                }}
              />
            ))}
          </div>
        );

      case 'exercise_header':
        return (
          <ExerciseHeaderBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdate={handleComplexBlockUpdate}
            documentDefaultDirection={effectiveDirection}
          />
        );

      case 'fill_in_blanks':
        return (
          <FillInBlanksBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdate={handleComplexBlockUpdate}
            documentDefaultDirection={effectiveDirection}
          />
        );

      case 'qcm_exam':
        return (
          <QCMExamBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdate={handleComplexBlockUpdate}
            documentDefaultDirection={effectiveDirection}
          />
        );
    }
  };

  return (
    <div
      id={`block-${block.id}`}
      data-block-id={block.id}
      onClick={(e) => {
        if (readOnly) return;
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        if (readOnly) return;
        handleDoubleClick(e);
      }}
      onMouseDown={(e) => {
        if (readOnly) return;
        // Do not trigger canvas block drag if user clicked an interactive input/textarea/button
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('input, textarea, button, select, [contenteditable="true"]');
        if (isInteractive) return;

        // Select block immediately if not already selected
        if (!isSelected) {
          onSelect();
        }

        // Drag block when clicking on block area (and not currently editing)
        if (!effectiveIsEditing) {
          onStartDrag(e, block.id);
        }
      }}
      className={`absolute group transition-shadow ${
        readOnly
          ? 'z-10'
          : isSelected
          ? effectiveIsEditing
            ? 'ring-2 ring-indigo-600 shadow-md cursor-default z-30'
            : 'ring-2 ring-indigo-600 shadow-md cursor-move active:cursor-grabbing z-30'
          : 'hover:ring-1 hover:ring-indigo-300 cursor-move z-10'
      }`}
      style={{
        left: `${block.x}px`,
        top: `${block.y}px`,
        width: `${block.width}px`,
        height: ['exercise_header', 'fill_in_blanks', 'qcm_exam', 'text'].includes(block.type)
          ? 'auto'
          : `${block.height}px`,
        minHeight: `${block.height}px`,
        backgroundColor: block.styles.backgroundColor || 'transparent',
        borderColor: block.styles.borderColor || 'transparent',
        borderWidth: block.styles.borderWidth ? `${block.styles.borderWidth}px` : undefined,
        borderStyle: (block.styles.borderStyle as any) || undefined,
        borderRadius: block.styles.borderRadius ? `${block.styles.borderRadius}px` : undefined,
        padding: block.styles.padding ? `${block.styles.padding}px` : undefined,
      }}
    >
      {/* Floating Action Toolbar directly above block */}
      {!readOnly && isSelected && (
        block.type === 'title' ? (
          <TitleFloatingToolbar
            isBold={block.styles.fontWeight === 'bold'}
            onToggleBold={() =>
              onUpdate({
                styles: {
                  ...block.styles,
                  fontWeight: block.styles.fontWeight === 'bold' ? 'normal' : 'bold',
                },
              })
            }
            isItalic={block.styles.fontStyle === 'italic'}
            onToggleItalic={() =>
              onUpdate({
                styles: {
                  ...block.styles,
                  fontStyle: block.styles.fontStyle === 'italic' ? 'normal' : 'italic',
                },
              })
            }
            isUnderline={block.styles.textDecoration === 'underline'}
            onToggleUnderline={() =>
              onUpdate({
                styles: {
                  ...block.styles,
                  textDecoration:
                    block.styles.textDecoration === 'underline' ? 'none' : 'underline',
                },
              })
            }
            numbering={block.content.titleNumbering || 'none'}
            onChangeNumbering={(num) =>
              onUpdate({
                content: {
                  ...block.content,
                  titleNumbering: num,
                },
              })
            }
            isRtl={isRtl}
          />
        ) : block.type === 'text' ? null : (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute -top-10 left-0 bg-slate-900 text-white rounded-lg px-1.5 py-1 flex items-center gap-1 shadow-lg z-50 text-xs font-semibold select-none animate-in fade-in zoom-in-95 duration-100"
          >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddAfter(e);
            }}
            title="Ajouter un bloc après"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ajouter</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            title="Modifier le contenu (ou double-clic)"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5 text-amber-400" />
            <span>Modifier</span>
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            title="Dupliquer (Ctrl+D)"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-sky-400" />
            <span>Dupliquer</span>
          </button>

          {/* Discrete Language Translation Status Pill */}
          <div
            title={
              isTranslated
                ? `Version ${effectiveLang.toUpperCase()} rédigée pour ce bloc`
                : `Version ${effectiveLang.toUpperCase()} non renseignée (placeholder actif)`
            }
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
              isTranslated
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                : 'bg-amber-950/70 text-amber-300 border-amber-700/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTranslated ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>{effectiveLang.toUpperCase()}</span>
            <span className="text-[10px] opacity-85">
              {isTranslated ? 'rédigé' : 'à rédiger'}
            </span>
          </div>

          <div className="w-px h-3.5 bg-slate-700 mx-0.5" />

          <button
            type="button"
            onClick={onDelete}
            title="Supprimer (Suppr)"
            className="p-1 rounded hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        )
      )}

      {/* Subtle discreet indicator when hovering block (helps teacher spot what remains to be written) */}
      {!readOnly && !isSelected && (
        <div
          className={`absolute ${
            isRtl ? 'left-1' : 'right-1'
          } -top-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none select-none`}
        >
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-xs ${
              isTranslated
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTranslated ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {effectiveLang.toUpperCase()} {isTranslated ? 'rédigé' : 'à rédiger'}
          </span>
        </div>
      )}

      {/* 4 Corner Resize Handles */}
      {!readOnly && isSelected && (
        <>
          {/* Top-Left */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, block.id, 'nw');
            }}
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs shadow-xs cursor-nwse-resize z-40"
          />
          {/* Top-Right */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, block.id, 'ne');
            }}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs shadow-xs cursor-nesw-resize z-40"
          />
          {/* Bottom-Left */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, block.id, 'sw');
            }}
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs shadow-xs cursor-nesw-resize z-40"
          />
          {/* Bottom-Right */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, block.id, 'se');
            }}
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs shadow-xs cursor-nwse-resize z-40"
          />
        </>
      )}

      {/* Render the inner block */}
      {renderContent()}
    </div>
  );
};
