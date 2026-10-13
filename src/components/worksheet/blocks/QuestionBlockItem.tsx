import React, { useRef, useEffect } from 'react';
import {
  WorksheetBlock,
  PedagogicalQuestionItem,
  PedagogicalQuestionType,
} from '../../../types/worksheet';
import { PedagogicalQuestionRenderer } from './PedagogicalQuestionRenderer';
import { CheckCircle2 } from 'lucide-react';

interface QuestionBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (contentUpdates: Partial<WorksheetBlock['content']>) => void;
  onUpdateHeight?: (newHeight: number) => void;
}

export const QuestionBlockItem: React.FC<QuestionBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
  onUpdateHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRtl =
    block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');
  const fontSize = block.styles.fontSize || 15;
  const textColor = block.styles.color || '#0f172a';
  const showAnswers = Boolean(block.content.showAnswers);

  const questionData: PedagogicalQuestionItem = block.content.questionData || {
    id: `q_${block.id}`,
    type: 'open_question',
    numberLabel: '1)',
    statement:
      block.content.text ||
      (isRtl
        ? 'اكتب نص السؤال هنا...'
        : 'Rédigez l’énoncé de la question (avec formules ∑)...'),
    points: 2,
    answerType: 'lines',
    answerLines: 2,
    correction: '',
  };

  useEffect(() => {
    if (containerRef.current && onUpdateHeight) {
      const measured = Math.ceil(containerRef.current.scrollHeight);
      if (Math.abs(measured - block.height) > 6 && measured > 40) {
        onUpdateHeight(measured);
      }
    }
  }, [questionData, showAnswers, isSelected]);

  const handleUpdateQuestionData = (updated: PedagogicalQuestionItem) => {
    onUpdateContent({
      questionData: updated,
      points: updated.points,
    });
  };

  const handleSwitchType = (newType: PedagogicalQuestionType) => {
    const updated: PedagogicalQuestionItem = {
      ...questionData,
      type: newType,
    };
    if (newType === 'qcm' && (!updated.options || updated.options.length === 0)) {
      updated.options = [
        { id: 'opt_1', text: isRtl ? 'المقترح أ' : 'Proposition A', isCorrect: true },
        { id: 'opt_2', text: isRtl ? 'المقترح ب' : 'Proposition B', isCorrect: false },
        { id: 'opt_3', text: isRtl ? 'المقترح ج' : 'Proposition C', isCorrect: false },
      ];
    }
    handleUpdateQuestionData(updated);
  };

  return (
    <div
      ref={containerRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full flex flex-col select-none"
      style={{
        fontFamily: defaultFont,
        color: textColor,
        backgroundColor:
          block.styles.backgroundColor && block.styles.backgroundColor !== 'transparent'
            ? block.styles.backgroundColor
            : undefined,
        padding: block.styles.padding !== undefined ? `${block.styles.padding}px` : '6px',
        borderRadius:
          block.styles.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '8px',
        borderWidth:
          block.styles.borderWidth !== undefined ? `${block.styles.borderWidth}px` : '0px',
        borderStyle: block.styles.borderStyle || 'none',
        borderColor: block.styles.borderColor || '#cbd5e1',
      }}
    >
      {/* Contextual Question Variant Bar when selected */}
      {isSelected && !readOnly && (
        <div
          dir="ltr"
          onClick={(e) => e.stopPropagation()}
          className="mb-1.5 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]"
        >
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-500 mr-1">Type de question :</span>
            {(
              [
                { id: 'open_question', label: 'Question ouverte' },
                { id: 'qcm', label: 'QCM Pro' },
                { id: 'true_false', label: 'Vrai / Faux' },
                { id: 'table', label: 'Tableau' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSwitchType(t.id)}
                className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                  questionData.type === t.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-semibold">N° :</span>
              <input
                type="text"
                value={questionData.numberLabel ?? '1)'}
                onChange={(e) =>
                  handleUpdateQuestionData({ ...questionData, numberLabel: e.target.value })
                }
                className="w-10 px-1 py-0.5 text-center font-bold bg-white border border-slate-200 rounded text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => onUpdateContent({ showAnswers: !showAnswers })}
              className={`px-2 py-0.5 rounded font-bold flex items-center gap-1 border cursor-pointer ${
                showAnswers
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{showAnswers ? 'Corrigé actif' : 'Corrigé'}</span>
            </button>
          </div>
        </div>
      )}

      {/* QuestionBase Renderer */}
      <PedagogicalQuestionRenderer
        question={questionData}
        index={0}
        totalQuestions={1}
        isSelected={isSelected}
        readOnly={readOnly}
        isRtl={isRtl}
        showAnswers={showAnswers}
        fontFamily={defaultFont}
        fontSize={fontSize}
        textColor={textColor}
        onUpdate={handleUpdateQuestionData}
      />
    </div>
  );
};
