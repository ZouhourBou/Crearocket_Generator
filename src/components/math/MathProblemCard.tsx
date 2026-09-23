import React from 'react';
import { MathProblem, MathOrientation, AnswerBoxStyle } from '../../types/math';

interface MathProblemCardProps {
  problem: MathProblem;
  index: number;
  orientation: MathOrientation;
  showNumber: boolean;
  numberingStyle: string;
  answerBoxStyle: AnswerBoxStyle;
  showAnswer: boolean;
}

export const MathProblemCard: React.FC<MathProblemCardProps> = ({
  problem,
  index,
  orientation,
  showNumber,
  numberingStyle,
  answerBoxStyle,
  showAnswer,
}) => {
  // Format the exercise number according to numberingStyle
  const getNumberLabel = () => {
    const num = index + 1;
    if (numberingStyle === '1.') return `${num}.`;
    if (numberingStyle === 'A)') {
      const char = String.fromCharCode(65 + (index % 26));
      return `${char})`;
    }
    if (numberingStyle === '#1') return `#${num}`;
    return `${num})`;
  };

  if (orientation === 'vertical' && problem.operator !== '÷') {
    // Exact column-based alignment for posée addition / subtraction / multiplication
    // Find maximum string length to define tabular column width
    const maxDigits = Math.max(
      ...problem.operands.map((n) => n.toString().length),
      problem.result.toString().length
    );

    return (
      <div className="relative p-2.5 rounded-xl border border-slate-200/60 bg-white/60 hover:bg-white hover:border-slate-300 transition-all flex flex-col items-center">
        {/* Exercise Number */}
        {showNumber && (
          <span className="absolute top-1.5 left-2 text-[11px] font-black text-slate-400">
            {getNumberLabel()}
          </span>
        )}

        <div className="flex items-end justify-center pt-2">
          {/* Posée Math Box with exact tabular column alignment */}
          <div className="flex flex-col items-end text-lg font-bold font-mono tracking-wider text-slate-900 tabular-nums select-none min-w-[72px]">
            {/* First operand */}
            <div className="pr-1">{problem.operands[0]}</div>

            {/* Remaining operands with operator on the leftmost */}
            {problem.operands.slice(1).map((opVal, idx) => (
              <div key={idx} className="w-full flex items-center justify-between gap-2">
                <span className="text-base text-slate-500 font-sans font-bold">
                  {idx === problem.operands.length - 2 ? problem.operatorSymbol : ''}
                </span>
                <span className="pr-1">{opVal}</span>
              </div>
            ))}

            {/* Solid calculation line */}
            <div className="w-full border-b-2 border-slate-800 my-1" />

            {/* Result Area */}
            {showAnswer ? (
              <div className="w-full text-right font-black text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                {problem.result}
              </div>
            ) : answerBoxStyle === 'solid_box' ? (
              <div className="w-full h-8 border-2 border-slate-300 rounded-md bg-slate-50/50" />
            ) : answerBoxStyle === 'grid_box' ? (
              <div className="w-full flex justify-end gap-1">
                {Array.from({ length: maxDigits }).map((_, i) => (
                  <div key={i} className="w-5 h-7 border border-slate-300 rounded bg-slate-50/40" />
                ))}
              </div>
            ) : (
              <div className="w-full h-7 border-b border-dashed border-slate-300" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // European Division Potence Layout (if vertical division)
  if (orientation === 'vertical' && problem.operator === '÷') {
    const dividend = problem.operands[0];
    const divisor = problem.operands[1];

    return (
      <div className="relative p-2.5 rounded-xl border border-slate-200/60 bg-white/60 hover:bg-white transition-all flex flex-col items-center">
        {showNumber && (
          <span className="absolute top-1.5 left-2 text-[11px] font-black text-slate-400">
            {getNumberLabel()}
          </span>
        )}

        <div className="flex items-start justify-center pt-2 font-mono tabular-nums text-base">
          {/* Dividend (Left) */}
          <div className="pr-3 font-bold text-slate-900 min-h-[50px] flex flex-col justify-start">
            <span>{dividend}</span>
          </div>

          {/* Vertical divider bar & Divisor / Quotient (Right) */}
          <div className="border-l-2 border-slate-800 pl-3 flex flex-col">
            <span className="font-bold text-slate-900">{divisor}</span>
            <div className="border-b-2 border-slate-800 my-1 w-16" />
            {showAnswer ? (
              <div className="font-black text-emerald-700 text-sm">
                {problem.result}
                {problem.remainder ? ` (r=${problem.remainder})` : ''}
              </div>
            ) : (
              <div className="h-6" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Math Problem Layout
  return (
    <div className="relative p-3 rounded-xl border border-slate-200/60 bg-white/70 hover:bg-white transition-all flex items-center justify-between">
      {/* Problem statement */}
      <div className="flex items-center gap-2">
        {showNumber && (
          <span className="text-xs font-black text-slate-400 w-5">
            {getNumberLabel()}
          </span>
        )}

        <div className="font-bold text-base sm:text-lg text-slate-900 font-mono tabular-nums flex items-center gap-1.5">
          <span>{problem.operands.join(` ${problem.operatorSymbol} `)}</span>
          <span className="text-slate-500 font-sans">=</span>
        </div>
      </div>

      {/* Answer Area */}
      <div className="flex items-center">
        {showAnswer ? (
          <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-sm font-mono">
            {problem.answerKey}
          </span>
        ) : answerBoxStyle === 'solid_box' ? (
          <div className="w-14 sm:w-16 h-7 border-2 border-slate-300 rounded-lg bg-slate-50/50" />
        ) : answerBoxStyle === 'grid_box' ? (
          <div className="flex gap-1">
            <div className="w-5 h-7 border border-slate-300 rounded bg-slate-50/40" />
            <div className="w-5 h-7 border border-slate-300 rounded bg-slate-50/40" />
          </div>
        ) : (
          <div className="w-14 sm:w-16 border-b-2 border-dashed border-slate-400 h-6" />
        )}
      </div>
    </div>
  );
};
