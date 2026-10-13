import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { Check } from 'lucide-react';

interface TrueFalseBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const TrueFalseBlockItem: React.FC<TrueFalseBlockItemProps> = ({
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

  const statement =
    c.tfStatement ||
    c.text ||
    (isRtl ? 'إذا كان $x = 3$ فإن $2x + 1 = 7$' : 'Si $x = 3$, alors $2x + 1 = 7$.');

  const trueLabel = c.trueLabel || (isRtl ? 'صحيح' : 'Vrai');
  const falseLabel = c.falseLabel || (isRtl ? 'خطأ' : 'Faux');
  const qNum = c.questionNumber;
  const points = c.points;
  const correctAnswer = c.correctAnswer || 'none';
  const showAnswers = Boolean(c.showAnswers);

  const handleToggleAnswer = (choice: 'true' | 'false') => {
    if (readOnly) return;
    onUpdateContent({
      correctAnswer: correctAnswer === choice ? 'none' : choice,
    });
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex items-center justify-between gap-4 py-1.5 select-none text-slate-800"
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
            value={statement}
            onChange={(newText) => onUpdateContent({ tfStatement: newText, text: newText })}
            readOnly={readOnly}
            isSelected={isSelected}
            isRtl={isRtl}
            styles={block.styles}
            onUpdateStyles={onUpdateStyles}
            className="text-sm font-medium"
          />
        </div>
        {points && (
          <span className="shrink-0 text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            ({points})
          </span>
        )}
      </div>

      {/* Checkboxes: True / False */}
      <div className="flex items-center gap-4 shrink-0 text-xs font-bold">
        {/* True */}
        <div
          onClick={() => handleToggleAnswer('true')}
          className="flex items-center gap-1.5 cursor-pointer group"
          title={correctAnswer === 'true' ? 'Vrai (bonne réponse)' : 'Marquer Vrai'}
        >
          <div
            className={`w-4 h-4 rounded-xs border border-slate-500 flex items-center justify-center transition-colors ${
              correctAnswer === 'true' && showAnswers
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white group-hover:border-indigo-500'
            }`}
          >
            {correctAnswer === 'true' && showAnswers && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="select-none text-slate-700">{trueLabel}</span>
        </div>

        {/* False */}
        <div
          onClick={() => handleToggleAnswer('false')}
          className="flex items-center gap-1.5 cursor-pointer group"
          title={correctAnswer === 'false' ? 'Faux (bonne réponse)' : 'Marquer Faux'}
        >
          <div
            className={`w-4 h-4 rounded-xs border border-slate-500 flex items-center justify-center transition-colors ${
              correctAnswer === 'false' && showAnswers
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white group-hover:border-indigo-500'
            }`}
          >
            {correctAnswer === 'false' && showAnswers && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="select-none text-slate-700">{falseLabel}</span>
        </div>
      </div>
    </div>
  );
};
