import React, { useRef, useState, useEffect } from 'react';
import { WorksheetBlock, DocumentLanguage, AnswerLineStyle } from '../../types/worksheet';
import {
  Plus,
  Trash2,
  Copy,
  Pencil,
  Upload,
} from 'lucide-react';
import { ExerciseHeaderBlockItem } from './blocks/ExerciseHeaderBlockItem';
import { FillInBlanksBlockItem } from './blocks/FillInBlanksBlockItem';
import { QCMExamBlockItem } from './blocks/QCMExamBlockItem';
import { ExerciseBlockItem } from './blocks/ExerciseBlockItem';
import { QuestionBlockItem } from './blocks/QuestionBlockItem';
import { InlineMathText } from './blocks/InlineMathText';
import { AdvancedTextParagraphBlock } from './blocks/AdvancedTextParagraphBlock';
import { ExamHeaderBlockItem } from './blocks/ExamHeaderBlockItem';
import { InstructionBlockItem } from './blocks/InstructionBlockItem';
import { InfoBoxBlockItem } from './blocks/InfoBoxBlockItem';
import { QCMBlockItem } from './blocks/QCMBlockItem';
import { TrueFalseBlockItem } from './blocks/TrueFalseBlockItem';
import { ShortAnswerBlockItem } from './blocks/ShortAnswerBlockItem';
import { LongAnswerBlockItem } from './blocks/LongAnswerBlockItem';
import { FillBlankBlockItem } from './blocks/FillBlankBlockItem';
import { MatchingBlockItem } from './blocks/MatchingBlockItem';
import { OrderingBlockItem } from './blocks/OrderingBlockItem';
import { TableBlockItem } from './blocks/TableBlockItem';
import { AnswerBoxBlockItem } from './blocks/AnswerBoxBlockItem';
import { ColumnsBlockItem } from './blocks/ColumnsBlockItem';
import { ImageBlockItem } from './blocks/ImageBlockItem';
import { GeometryFigureBlockItem } from './blocks/GeometryFigureBlockItem';
import { CoordinateSystemBlockItem } from './blocks/CoordinateSystemBlockItem';
import { NumberLineBlockItem } from './blocks/NumberLineBlockItem';
import { ConstructionAreaBlockItem } from './blocks/ConstructionAreaBlockItem';
import { DiagramBlockItem } from './blocks/DiagramBlockItem';
import { ImageAnnotationBlockItem } from './blocks/ImageAnnotationBlockItem';
import { ShapeBlockItem } from './blocks/ShapeBlockItem';
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
  onDelete,
  onAddAfter,
  zoom,
  onStartDrag,
  onStartResize,
  activeDocumentLanguage = 'fr',
  isPageIndependentArabic = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false);
    }
  }, [isSelected, isEditing]);

  const isRichTextType =
    block.type === 'rich_text' ||
    block.type === 'text' ||
    block.type === 'instruction' ||
    block.type === 'subtitle';

  const effectiveIsEditing = isSelected && (isEditing || isRichTextType);

  useEffect(() => {
    if (effectiveIsEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [effectiveIsEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      [
        'title',
        'rich_text',
        'subtitle',
        'instruction',
        'text',
        'answer_lines',
        'answer_zone',
      ].includes(block.type)
    ) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  // Determine effective language and direction
  const effectiveLang: DocumentLanguage = isPageIndependentArabic
    ? 'ar'
    : activeDocumentLanguage === 'en' || activeDocumentLanguage === 'ar'
    ? activeDocumentLanguage
    : 'fr';
  const isRtl =
    block.styles.textDirection === 'rtl' ||
    (block.styles.textDirection !== 'ltr' &&
      (isPageIndependentArabic || effectiveLang === 'ar'));
  const effectiveDirection: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';
  const isTranslated = isBlockTranslated(block, effectiveLang);
  const placeholders = LANGUAGE_PLACEHOLDERS[effectiveLang] || LANGUAGE_PLACEHOLDERS.fr;

  const handleContentChange = (contentPartial: Partial<WorksheetBlock['content']>) => {
    const updated = saveBlockContentForLanguage(block, effectiveLang, contentPartial);
    onUpdate({
      content: updated.content,
      translations: updated.translations,
      metadata: {
        ...block.metadata,
        updatedAt: Date.now(),
      },
    });
  };

  const handleComplexBlockUpdate = (updates: Partial<WorksheetBlock>) => {
    if (updates.content) {
      const updated = saveBlockContentForLanguage(block, effectiveLang, updates.content);
      onUpdate({
        ...updates,
        content: updated.content,
        translations: updated.translations,
        metadata: {
          ...block.metadata,
          updatedAt: Date.now(),
        },
      });
    } else {
      onUpdate({
        ...updates,
        metadata: {
          ...block.metadata,
          updatedAt: Date.now(),
        },
      });
    }
  };

  // Interactive vertical drag handle for answer_lines (adjusts lineCount)
  const handleStartAnswerLinesDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const scale = Math.max(0.25, zoom / 100);
    const startY = e.clientY;
    const startLines = block.content.lineCount ?? 4;
    const lineSpacing = block.content.lineSpacing ?? 32;

    const onMove = (moveEvent: MouseEvent) => {
      const deltaY = (moveEvent.clientY - startY) / scale;
      const deltaLines = Math.round(deltaY / lineSpacing);
      const nextLines = Math.max(1, Math.min(25, startLines + deltaLines));
      if (nextLines !== block.content.lineCount) {
        onUpdate({
          height: nextLines * lineSpacing + 12,
          content: {
            ...block.content,
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

  // Interactive vertical drag handle for separator spacer (adjusts spacerHeight)
  const handleStartSeparatorDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const scale = Math.max(0.25, zoom / 100);
    const startY = e.clientY;
    const startH = block.content.spacerHeight || block.height || 28;

    const onMove = (moveEvent: MouseEvent) => {
      const deltaY = (moveEvent.clientY - startY) / scale;
      const nextH = Math.max(12, Math.min(200, Math.round(startH + deltaY)));
      onUpdate({
        height: nextH,
        content: {
          ...block.content,
          separatorMode: 'space',
          spacerHeight: nextH,
        },
      });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Render Inner Content of Block
  const renderContent = () => {
    const s = block.styles;
    const defaultBlockFont =
      s.fontFamily || (effectiveDirection === 'rtl' || isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

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
                  fontSize: `${s.fontSize || 24}px`,
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
                fontSize: `${s.fontSize || 24}px`,
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
              fontSize: `${s.fontSize || 24}px`,
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
            {titlePrefix && <span className="shrink-0 select-none">{titlePrefix}</span>}
            <InlineMathText text={block.content.text || placeholders.titlePlaceholder} />
          </div>
        );
      }

      case 'rich_text':
      case 'text':
      case 'subtitle': {
        const isInstructionVariant = block.content.variant === 'instruction';

        return (
          <div
            dir={effectiveDirection}
            className={`w-full flex items-start gap-2 ${
              isInstructionVariant ? 'items-baseline' : ''
            }`}
          >
            {isInstructionVariant && block.content.label !== '' && (
              <span className="font-bold shrink-0 text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[13px] border border-indigo-200 select-none">
                {block.content.label || placeholders.instructionLabel}
              </span>
            )}
            <div className="flex-1 min-w-0">
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
            </div>
          </div>
        );
      }

      case 'answer_lines':
      case 'answer_zone': {
        const answerType = block.content.answerType || 'lines';
        const lineCount = block.content.lineCount ?? 4;
        const lineSpacing = block.content.lineSpacing ?? 32;
        const lineStyle: AnswerLineStyle =
          (block.content.lineStyle as AnswerLineStyle) ||
          (answerType === 'dots' ? 'dotted' : 'dotted');

        if (answerType === 'box') {
          return (
            <div className="w-full h-full min-h-[72px] border-2 border-slate-400 rounded-lg p-2.5 flex items-start text-xs text-slate-400 italic select-none bg-white/60">
              {!readOnly && (block.content.placeholder || 'Cadre réservé à la réponse ou construction…')}
            </div>
          );
        }

        if (answerType === 'grid') {
          return (
            <div
              className="w-full h-full min-h-[72px] border border-slate-300 rounded-xs select-none"
              style={{
                height: `${Math.max(64, lineCount * lineSpacing)}px`,
                backgroundImage:
                  'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />
          );
        }

        return (
          <div className="w-full flex flex-col select-none py-1">
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
                    borderBottomColor: s.borderColor || '#94a3b8',
                  }}
                />
              </div>
            ))}
          </div>
        );
      }

      case 'separator':
      case 'line':
      case 'spacer': {
        const mode =
          block.content.separatorMode || (block.type === 'spacer' ? 'space' : 'line');
        const lineStyle = block.content.lineStyle || (s.borderStyle as any) || 'solid';
        const spacerHeight = block.content.spacerHeight || block.height || 28;

        if (mode === 'space') {
          return (
            <div
              style={{ height: `${spacerHeight}px` }}
              className={`w-full h-full flex items-center justify-center rounded select-none ${
                !readOnly
                  ? 'border border-dashed border-slate-300/70 bg-slate-50/40 text-[10px] text-slate-400'
                  : ''
              }`}
            >
              {!readOnly && <span>Espace vertical ({Math.round(spacerHeight)}px)</span>}
            </div>
          );
        }

        return (
          <div className="w-full h-full min-h-[16px] flex items-center select-none">
            <div
              className="w-full"
              style={{
                borderTopWidth: `${s.borderWidth || 1.5}px`,
                borderTopStyle: lineStyle === 'none' ? 'solid' : lineStyle,
                borderTopColor: s.borderColor || '#94a3b8',
              }}
            />
          </div>
        );
      }

      case 'exercise':
        return (
          <ExerciseBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdate={handleComplexBlockUpdate}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );

      case 'image':
        return (
          <ImageBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );

      case 'geometry_figure':
        return (
          <GeometryFigureBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );

      case 'coordinate_system':
        return (
          <CoordinateSystemBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );

      case 'number_line':
        return (
          <NumberLineBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'construction_area':
        return (
          <ConstructionAreaBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );

      case 'diagram':
        return (
          <DiagramBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );

      case 'image_annotation':
        return (
          <ImageAnnotationBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );

      case 'shape':
        return (
          <ShapeBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'exam_header':
        return (
          <ExamHeaderBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'instruction':
        return (
          <InstructionBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'info_box':
        return (
          <InfoBoxBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'qcm':
        return (
          <QCMBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'true_false':
        return (
          <TrueFalseBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'short_answer':
        return (
          <ShortAnswerBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'long_answer':
        return (
          <LongAnswerBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'fill_blank':
        return (
          <FillBlankBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'matching':
        return (
          <MatchingBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'ordering':
        return (
          <OrderingBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'table':
        return (
          <TableBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'answer_box':
        return (
          <AnswerBoxBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
            onUpdateHeight={(h) => onUpdate({ height: h })}
            zoom={zoom}
          />
        );

      case 'columns':
        return (
          <ColumnsBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateStyles={(stylePartial) =>
              onUpdate({ styles: { ...block.styles, ...stylePartial } })
            }
          />
        );

      case 'blank_space':
        return (
          <div
            style={{ height: `${block.height || 28}px` }}
            className={`w-full h-full flex items-center justify-center rounded select-none ${
              !readOnly
                ? 'border border-dashed border-slate-300/70 bg-slate-50/40 text-[10px] text-slate-400'
                : ''
            }`}
          >
            {!readOnly && <span>Espace blanc ({Math.round(block.height || 28)}px)</span>}
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

      case 'question':
        return (
          <QuestionBlockItem
            block={block}
            isSelected={isSelected}
            readOnly={readOnly}
            onUpdateContent={(partial) => handleContentChange(partial)}
            onUpdateHeight={(h) => onUpdate({ height: h })}
          />
        );
    }
  };

  const isAnswerLinesBlock =
    block.type === 'answer_lines' || block.type === 'answer_zone';
  const isSeparatorBlock =
    block.type === 'separator' || block.type === 'line' || block.type === 'spacer';

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
        const target = e.target as HTMLElement;
        const isInteractive = target.closest(
          'input, textarea, button, select, [contenteditable="true"]'
        );
        if (isInteractive) return;

        if (!isSelected) {
          onSelect();
        }

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
        height: [
          'exam_header',
          'exercise',
          'instruction',
          'info_box',
          'qcm',
          'true_false',
          'short_answer',
          'long_answer',
          'fill_blank',
          'matching',
          'ordering',
          'table',
          'columns',
          'exercise_header',
          'fill_in_blanks',
          'qcm_exam',
          'rich_text',
          'text',
          'subtitle',
          'question',
          'answer_lines',
        ].includes(block.type)
          ? 'auto'
          : `${block.height}px`,
        minHeight: `${block.height}px`,
        backgroundColor: block.styles.backgroundColor || 'transparent',
        borderColor:
          isAnswerLinesBlock || isSeparatorBlock
            ? 'transparent'
            : block.styles.borderColor || 'transparent',
        borderWidth:
          isAnswerLinesBlock || isSeparatorBlock
            ? undefined
            : block.styles.borderWidth
            ? `${block.styles.borderWidth}px`
            : undefined,
        borderStyle:
          isAnswerLinesBlock || isSeparatorBlock
            ? undefined
            : (block.styles.borderStyle as any) || undefined,
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
        ) : isRichTextType ? null : (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute -top-10 left-0 bg-slate-900 text-white rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-lg z-50 text-xs font-semibold select-none animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap"
          >
            {/* Quick Controls for Answer Lines directly in Floating Toolbar */}
            {isAnswerLinesBlock && (
              <div className="flex items-center gap-1.5 border-r border-slate-700 pr-2 mr-0.5">
                <span className="text-[11px] text-slate-300">Lignes :</span>
                <button
                  type="button"
                  onClick={() => {
                    const count = Math.max(1, (block.content.lineCount ?? 4) - 1);
                    const spacing = block.content.lineSpacing ?? 32;
                    onUpdate({
                      height: count * spacing + 12,
                      content: { ...block.content, lineCount: count },
                    });
                  }}
                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="text-indigo-300 font-bold tabular-nums px-0.5">
                  {block.content.lineCount ?? 4}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const count = Math.min(25, (block.content.lineCount ?? 4) + 1);
                    const spacing = block.content.lineSpacing ?? 32;
                    onUpdate({
                      height: count * spacing + 12,
                      content: { ...block.content, lineCount: count },
                    });
                  }}
                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold cursor-pointer"
                >
                  +
                </button>

                <div className="flex items-center gap-0.5 ml-1">
                  {[
                    { id: 'dotted', label: 'Pointillés' },
                    { id: 'solid', label: 'Continu' },
                    { id: 'dashed', label: 'Tirets' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() =>
                        onUpdate({
                          content: {
                            ...block.content,
                            answerType: 'lines',
                            lineStyle: st.id as AnswerLineStyle,
                          },
                        })
                      }
                      className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                        (block.content.lineStyle || 'dotted') === st.id &&
                        (block.content.answerType || 'lines') === 'lines'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Controls for Separator directly in Floating Toolbar */}
            {isSeparatorBlock && (
              <div className="flex items-center gap-1.5 border-r border-slate-700 pr-2 mr-0.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      height: 18,
                      content: { ...block.content, separatorMode: 'line' },
                    })
                  }
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    (block.content.separatorMode ||
                      (block.type === 'spacer' ? 'space' : 'line')) === 'line'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Ligne
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const h = block.content.spacerHeight || 32;
                    onUpdate({
                      height: h,
                      content: { ...block.content, separatorMode: 'space', spacerHeight: h },
                    });
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    (block.content.separatorMode ||
                      (block.type === 'spacer' ? 'space' : 'line')) === 'space'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Espace vide
                </button>
              </div>
            )}

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
              onClick={onDuplicate}
              title="Dupliquer (Ctrl+D)"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-sky-400" />
              <span>Dupliquer</span>
            </button>

            {/* Discrete Language Status Pill */}
            <div
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

      {/* Interactive Bottom Handle for Answer Lines & Separator Space */}
      {!readOnly && isSelected && (isAnswerLinesBlock || isSeparatorBlock) && (
        <div
          onMouseDown={
            isAnswerLinesBlock ? handleStartAnswerLinesDrag : handleStartSeparatorDrag
          }
          title={
            isAnswerLinesBlock
              ? 'Glisser verticalement pour ajuster le nombre de lignes'
              : 'Glisser verticalement pour ajuster la hauteur de l’espace'
          }
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-3 bg-white border border-indigo-500 rounded-full shadow-xs flex items-center justify-center cursor-ns-resize z-40 hover:bg-indigo-50"
        >
          <div className="w-6 h-1 rounded-full bg-indigo-600" />
        </div>
      )}

      {/* 4 Corner Resize Handles */}
      {!readOnly && isSelected && (
        <>
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, block.id, 'nw');
            }}
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs shadow-xs cursor-nwse-resize z-40"
          />
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, block.id, 'ne');
            }}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs shadow-xs cursor-nesw-resize z-40"
          />
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              onStartResize(e, block.id, 'sw');
            }}
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs shadow-xs cursor-nesw-resize z-40"
          />
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
