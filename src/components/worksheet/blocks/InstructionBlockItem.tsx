import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';

interface InstructionBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const InstructionBlockItem: React.FC<InstructionBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateStyles,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const label = c.label !== undefined ? c.label : (isRtl ? 'تعليمة :' : 'Consigne :');
  const showLabel = label !== '';
  const points = c.points;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex items-baseline gap-2 py-0.5 select-none text-slate-800"
    >
      {showLabel && (
        <span className="font-bold shrink-0 text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded text-xs border border-indigo-200 select-none">
          {label}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <CoreRichTextField
          value={c.text || (isRtl ? 'اختر الإجابة الصحيحة أو أجب عن السؤال التالي...' : 'Calculer et simplifier l’expression suivante...')}
          onChange={(newText) => onUpdateContent({ text: newText })}
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
  );
};
