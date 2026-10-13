import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';

interface ShortAnswerBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const ShortAnswerBlockItem: React.FC<ShortAnswerBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  const question =
    c.shortAnswerQuestion ||
    c.text ||
    (isRtl ? 'ما هو أصغر عدد أولي ؟' : 'Quel est le plus petit nombre premier ?');

  const layout = c.shortAnswerLayout || 'inline';
  const lineWidth = c.shortAnswerLineWidth || 'medium';
  const lineStyle = c.shortAnswerLineStyle || 'dotted';
  const qNum = c.questionNumber;
  const points = c.points;

  const widthClass =
    lineWidth === 'short'
      ? 'w-24'
      : lineWidth === 'medium'
      ? 'w-48'
      : 'flex-1 min-w-[120px]';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`w-full py-1.5 select-none text-slate-800 ${
        layout === 'inline' ? 'flex items-baseline gap-3' : 'flex flex-col gap-2'
      }`}
      style={{ fontFamily: defaultFont }}
    >
      <div className="flex items-baseline gap-2 flex-1 min-w-0">
        {qNum && (
          <span className="font-extrabold text-sm text-indigo-800 shrink-0 select-none">
            {qNum})
          </span>
        )}
        <div className="flex-1 min-w-0">
          <CoreRichTextField
            value={question}
            onChange={(newText) => onUpdateContent({ shortAnswerQuestion: newText, text: newText })}
            readOnly={readOnly}
            isSelected={isSelected}
            isRtl={isRtl}
            styles={block.styles}
            onUpdateStyles={onUpdateStyles}
            className="text-sm font-semibold"
          />
        </div>
        {points && (
          <span className="shrink-0 text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            ({points})
          </span>
        )}
      </div>

      {/* Answer Line */}
      <div
        className={`${widthClass} h-5 flex items-end shrink-0`}
      >
        <div
          className="w-full"
          style={{
            borderBottomWidth: lineStyle === 'dotted' ? '2px' : '1.5px',
            borderBottomStyle: lineStyle,
            borderBottomColor: '#94a3b8',
          }}
        />
      </div>
    </div>
  );
};
