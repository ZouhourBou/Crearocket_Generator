import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';

interface AnswerBoxBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
  zoom?: number;
}

export const AnswerBoxBlockItem: React.FC<AnswerBoxBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateHeight,
  zoom = 100,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  const title = c.answerBoxTitle ?? '';
  const height = c.answerBoxHeight || block.height || 100;
  const pattern = c.answerBoxPattern || 'blank';
  const borderStyle = c.answerBoxBorderStyle || 'solid';
  const hasBorder = c.answerBoxBorder !== false;

  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const scale = Math.max(0.25, zoom / 100);
    const startY = e.clientY;
    const startH = height;

    const onMove = (moveEv: MouseEvent) => {
      const delta = (moveEv.clientY - startY) / scale;
      const nextH = Math.max(48, Math.min(600, Math.round(startH + delta)));
      onUpdateContent({ answerBoxHeight: nextH });
      if (onUpdateHeight) {
        onUpdateHeight(nextH);
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
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full relative select-none"
      style={{
        fontFamily: defaultFont,
        height: `${height}px`,
      }}
    >
      <div
        className={`w-full h-full rounded-lg relative overflow-hidden transition-all ${
          hasBorder ? 'border border-slate-400 bg-white shadow-2xs' : 'bg-slate-50/50'
        }`}
        style={{
          borderStyle,
          backgroundImage:
            pattern === 'grid'
              ? 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)'
              : pattern === 'lines'
              ? 'repeating-linear-gradient(to bottom, transparent, transparent 27px, #e2e8f0 28px)'
              : 'none',
          backgroundSize: pattern === 'grid' ? '20px 20px' : 'auto',
        }}
      >
        {/* Optional Title Badge */}
        {title !== '' && (
          <div className="absolute top-2 start-2 z-10 bg-slate-100/90 border border-slate-300 rounded px-2 py-0.5 text-xs font-bold text-slate-700 shadow-2xs">
            <CoreRichTextField
              value={title}
              onChange={(t) => onUpdateContent({ answerBoxTitle: t })}
              readOnly={readOnly}
              isSelected={isSelected}
              isRtl={isRtl}
              singleLine
              className="text-xs font-bold"
            />
          </div>
        )}

        {/* Empty state hint when authoring */}
        {!readOnly && isSelected && !title && (
          <div className="absolute top-2 start-2 text-[11px] text-slate-400 font-medium italic">
            {isRtl ? 'إطار الإجابة أو الحساب' : 'Cadre de réponse ou calcul'}
          </div>
        )}
      </div>

      {/* Vertical height resize handle */}
      {!readOnly && isSelected && (
        <div
          onMouseDown={handleStartResize}
          title="Glisser pour ajuster la hauteur"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-indigo-600/90 hover:bg-indigo-700 rounded-full cursor-ns-resize z-30 flex items-center justify-center shadow-xs"
        >
          <div className="w-4 h-0.5 bg-white rounded-full" />
        </div>
      )}
    </div>
  );
};
