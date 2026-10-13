import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';

interface FillBlankBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const FillBlankBlockItem: React.FC<FillBlankBlockItemProps> = ({
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

  const text =
    c.text ||
    (isRtl
      ? 'أكمل الفراغ بما يناسب : مقلوب العدد $\\frac{5}{2}$ هو .......... ومقابله هو ..........'
      : 'Compléter par ce qui convient : l’inverse de $\\frac{5}{2}$ est .......... et son opposé est ..........');

  const qNum = c.questionNumber;
  const points = c.points;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex items-baseline gap-2 py-1.5 select-none text-slate-800"
      style={{ fontFamily: defaultFont }}
    >
      {qNum && (
        <span className="font-extrabold text-sm text-indigo-800 shrink-0 select-none">
          {qNum})
        </span>
      )}
      <div className="flex-1 min-w-0">
        <CoreRichTextField
          value={text}
          onChange={(newText) => onUpdateContent({ text: newText })}
          readOnly={readOnly}
          isSelected={isSelected}
          isRtl={isRtl}
          styles={block.styles}
          onUpdateStyles={onUpdateStyles}
          className="text-sm font-medium leading-relaxed"
        />
      </div>
      {points && (
        <span className="shrink-0 text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          ({points})
        </span>
      )}
    </div>
  );
};
