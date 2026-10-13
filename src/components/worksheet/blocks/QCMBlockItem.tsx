import React from 'react';
import { WorksheetBlock, QCMOptionItem } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { Plus, Trash2, Check } from 'lucide-react';

interface QCMBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const QCMBlockItem: React.FC<QCMBlockItemProps> = ({
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
    c.qcmStatement ||
    c.text ||
    (isRtl ? 'اختر الإجابة الصحيحة : مقلوب العدد $2,5$ هو :' : 'Choisir la bonne réponse : l’inverse de $2,5$ est égal à :');

  const options: QCMOptionItem[] =
    c.qcmOptions && c.qcmOptions.length > 0
      ? c.qcmOptions
      : [
          { id: 'opt_1', text: isRtl ? '$0,4$' : '$0,4$', isCorrect: true },
          { id: 'opt_2', text: isRtl ? '$-2,5$' : '$-2,5$', isCorrect: false },
          { id: 'opt_3', text: isRtl ? '$\\frac{1}{25}$' : '$\\frac{1}{25}$', isCorrect: false },
        ];

  const layout = c.qcmLayout || 'vertical';
  const checkboxStyle = c.qcmCheckboxStyle || 'square';
  const qNum = c.questionNumber;
  const points = c.points;
  const showAnswers = Boolean(c.showAnswers);

  const handleUpdateOption = (id: string, text: string) => {
    const next = options.map((opt) => (opt.id === id ? { ...opt, text } : opt));
    onUpdateContent({ qcmOptions: next });
  };

  const handleToggleCorrect = (id: string) => {
    if (readOnly) return;
    const isSingle = (c.qcmSelectionMode || 'single') === 'single';
    const next = options.map((opt) => {
      if (opt.id === id) {
        return { ...opt, isCorrect: !opt.isCorrect };
      }
      return isSingle ? { ...opt, isCorrect: false } : opt;
    });
    onUpdateContent({ qcmOptions: next });
  };

  const handleAddOption = () => {
    const newId = `opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const next = [...options, { id: newId, text: isRtl ? 'خيار جديد...' : 'Nouvelle réponse...', isCorrect: false }];
    onUpdateContent({ qcmOptions: next });
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 1) return;
    const next = options.filter((opt) => opt.id !== id);
    onUpdateContent({ qcmOptions: next });
  };

  // Grid columns class
  const gridClass =
    layout === 'horizontal'
      ? 'flex flex-wrap items-center gap-x-6 gap-y-2'
      : layout === 'grid'
      ? 'grid grid-cols-2 gap-x-6 gap-y-2.5'
      : 'flex flex-col gap-2.5';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex flex-col gap-2 py-1 select-none text-slate-800"
      style={{ fontFamily: defaultFont }}
    >
      {/* Question Header & Statement */}
      <div className="flex items-baseline gap-2">
        {qNum && (
          <span className="font-extrabold text-sm text-indigo-800 shrink-0 select-none">
            {qNum})
          </span>
        )}
        <div className="flex-1 min-w-0">
          <CoreRichTextField
            value={statement}
            onChange={(newText) => onUpdateContent({ qcmStatement: newText, text: newText })}
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

      {/* Options List */}
      <div className={`pt-1 ${gridClass}`}>
        {options.map((opt, idx) => {
          const letter = isRtl
            ? ['أ', 'ب', 'ج', 'د', 'هـ'][idx] || String(idx + 1)
            : ['A', 'B', 'C', 'D', 'E'][idx] || String(idx + 1);

          return (
            <div
              key={opt.id}
              className="group/opt flex items-center gap-2 text-sm min-w-[120px]"
            >
              {/* Checkbox item */}
              <button
                type="button"
                onClick={() => handleToggleCorrect(opt.id)}
                title={opt.isCorrect ? 'Réponse correcte (clé enseignant)' : 'Cocher comme bonne réponse'}
                className={`shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                  checkboxStyle === 'circle'
                    ? 'w-4 h-4 rounded-full border border-slate-500'
                    : checkboxStyle === 'paren'
                    ? 'font-bold text-slate-600 px-0.5'
                    : 'w-4 h-4 rounded-xs border border-slate-500'
                } ${
                  opt.isCorrect && showAnswers
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white hover:border-indigo-500'
                }`}
              >
                {checkboxStyle === 'paren' ? (
                  <span>({opt.isCorrect && showAnswers ? '✓' : ' '})</span>
                ) : opt.isCorrect && showAnswers ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : null}
              </button>

              <span className="text-xs font-bold text-slate-500 shrink-0 select-none">
                {letter})
              </span>

              {/* Editable Option Text via CoreRichTextField */}
              <div className="flex-1 min-w-0">
                <CoreRichTextField
                  value={opt.text}
                  onChange={(val) => handleUpdateOption(opt.id, val)}
                  readOnly={readOnly}
                  isSelected={isSelected}
                  isRtl={isRtl}
                  singleLine
                  className="text-sm font-medium"
                />
              </div>

              {/* Delete option button (shown on hover during authoring) */}
              {!readOnly && isSelected && options.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  title="Supprimer cette réponse"
                  className="opacity-0 group-hover/opt:opacity-100 p-1 text-slate-300 hover:text-rose-500 transition-opacity cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add option button */}
        {!readOnly && isSelected && (
          <button
            type="button"
            onClick={handleAddOption}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded transition-colors cursor-pointer w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة خيار' : '+ Ajouter une réponse'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
