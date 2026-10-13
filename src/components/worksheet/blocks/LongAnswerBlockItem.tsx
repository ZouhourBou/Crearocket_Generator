import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';

interface LongAnswerBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const LongAnswerBlockItem: React.FC<LongAnswerBlockItemProps> = ({
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
    c.longAnswerQuestion ||
    c.text ||
    (isRtl ? 'بيّن بالبرهان أن المثلث $ABC$ قائم الزاوية في $A$ :' : 'Démontrer que le triangle $ABC$ est rectangle en $A$ :');

  const lineCount = c.lineCount || 3;
  const lineSpacing = c.lineSpacing || 28;
  const lineStyle = c.lineStyle || 'dotted';
  const qNum = c.questionNumber;
  const points = c.points;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex flex-col gap-2 py-1 select-none text-slate-800"
      style={{ fontFamily: defaultFont }}
    >
      <div className="flex items-baseline gap-2">
        {qNum && (
          <span className="font-extrabold text-sm text-indigo-800 shrink-0 select-none">
            {qNum})
          </span>
        )}
        <div className="flex-1 min-w-0">
          <CoreRichTextField
            value={question}
            onChange={(newText) => onUpdateContent({ longAnswerQuestion: newText, text: newText })}
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

      {/* Answer Lines below */}
      <div className="w-full flex flex-col pt-1">
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
                borderBottomColor: '#94a3b8',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
