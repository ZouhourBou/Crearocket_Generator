import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { resolveBlockDirection } from '../../../utils/textDirection';

interface ExerciseHeaderBlockItemProps {
  block: WorksheetBlock;
  isSelected?: boolean;
  readOnly?: boolean;
  onUpdate: (updatedBlock: Partial<WorksheetBlock>) => void;
  documentDefaultDirection?: 'auto' | 'ltr' | 'rtl';
}

export const ExerciseHeaderBlockItem: React.FC<ExerciseHeaderBlockItemProps> = ({
  block,
  readOnly,
  onUpdate,
  documentDefaultDirection = 'auto',
}) => {
  const content = block.content;
  const exerciseTitle = content.exerciseTitle !== undefined ? content.exerciseTitle : 'Exercice 1';
  const points = content.points !== undefined ? content.points : '5 points';
  const pointsPosition = content.pointsPosition || 'right';
  const headerStyle = content.headerStyle || 'underlined';

  const updateContent = (partial: Partial<WorksheetBlock['content']>) => {
    onUpdate({
      content: {
        ...block.content,
        ...partial,
      },
    });
  };

  // Resolve direction
  const textDirection = block.styles.textDirection || 'auto';
  const sample = `${exerciseTitle} ${points}`;
  const effectiveDirection = resolveBlockDirection(textDirection, sample, documentDefaultDirection);
  const isRtl = effectiveDirection === 'rtl';

  // Text color & font size
  const textColor = block.styles.color || '#0f172a';
  const fontSize = block.styles.fontSize || 16;
  const fontFamily = block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');
  const fontWeight = block.styles.fontWeight || 'bold';

  // Format points with parentheses if not already provided
  const formattedPoints = (pts: string | number) => {
    const s = String(pts).trim();
    if (!s) return '';
    if (s.startsWith('(') && s.endsWith(')')) return s;
    return `( ${s} )`;
  };

  // Layout classes based on pointsPosition and text direction
  const getLayoutContainerClass = () => {
    if (pointsPosition === 'below') {
      return 'flex flex-col gap-1';
    }
    // horizontal: 'right' or 'left'
    if (pointsPosition === 'left') {
      return isRtl
        ? 'flex items-center justify-between' // in RTL, natural order is title right, barème left
        : 'flex flex-row-reverse items-center justify-between'; // in LTR, barème left, title right
    }
    // Default 'right':
    return isRtl
      ? 'flex flex-row-reverse items-center justify-between' // in RTL, barème on the right, title on the left
      : 'flex items-center justify-between'; // in LTR, title left, barème right
  };

  return (
    <div
      dir={effectiveDirection}
      className={`w-full select-text transition-all ${
        headerStyle === 'underlined'
          ? 'border-b-2 border-slate-900 pb-1.5 mb-1'
          : headerStyle === 'boxed'
          ? 'border border-slate-300 rounded-lg p-2 bg-slate-50/50'
          : 'pb-1'
      }`}
      style={{
        color: textColor,
        fontFamily,
      }}
    >
      <div className={getLayoutContainerClass()}>
        {/* Title area */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {readOnly ? (
            <span
              className="tracking-wide"
              style={{
                fontSize: `${fontSize}px`,
                fontWeight: fontWeight === 'normal' ? 'normal' : '900',
              }}
            >
              {exerciseTitle} :
            </span>
          ) : (
            <div className="flex items-center gap-1 w-full max-w-md">
              <input
                type="text"
                value={exerciseTitle}
                onChange={(e) => updateContent({ exerciseTitle: e.target.value })}
                placeholder={isRtl ? 'تمرين عدد 1' : 'Exercice 1'}
                className="bg-transparent border-b border-dashed border-slate-300 hover:border-slate-500 focus:border-indigo-600 focus:bg-white outline-none px-1 py-0.5 transition-colors w-full"
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: fontWeight === 'normal' ? 'normal' : '900',
                }}
                dir={effectiveDirection}
              />
              <span
                className="font-black text-slate-800"
                style={{ fontSize: `${fontSize}px` }}
              >
                :
              </span>
            </div>
          )}
        </div>

        {/* Barème area */}
        {points !== '' && (
          <div
            className={`shrink-0 text-slate-600 ${
              pointsPosition === 'below'
                ? isRtl
                  ? 'text-right pr-2'
                  : 'text-left pl-2'
                : ''
            }`}
            dir={effectiveDirection}
          >
            {readOnly ? (
              <span
                className="font-semibold text-slate-700"
                style={{ fontSize: `${Math.max(12, fontSize - 3)}px` }}
              >
                {formattedPoints(points)}
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold">(</span>
                <input
                  type="text"
                  value={String(points).replace(/^\(\s*|\s*\)$/g, '')}
                  onChange={(e) => updateContent({ points: e.target.value })}
                  placeholder={isRtl ? '5 نقاط' : '5 points'}
                  className="bg-transparent border-b border-dashed border-slate-300 hover:border-slate-500 focus:border-indigo-600 focus:bg-white outline-none px-1 py-0.5 text-center transition-colors min-w-[60px]"
                  style={{
                    fontSize: `${Math.max(12, fontSize - 3)}px`,
                    fontWeight: 600,
                  }}
                  dir={effectiveDirection}
                />
                <span className="text-slate-400 font-bold">)</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
