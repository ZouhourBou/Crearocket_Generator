import React from 'react';
import {
  PedagogicalQuestionItem,
  QCMExamOption,
  TrueFalseStatementItem,
  WorksheetBlock,
} from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';
import { formatPointsLabel } from '../../../utils/scoring';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  HelpCircle,
  CheckSquare,
  ListChecks,
  Table as TableIcon,
  FileText,
  AlignLeft,
} from 'lucide-react';

const ARABIC_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
const LATIN_UPPER = ['A', 'B', 'C', 'D', 'E', 'F'];

export interface PedagogicalQuestionRendererProps {
  question: PedagogicalQuestionItem;
  index: number;
  totalQuestions?: number;
  isSelected: boolean;
  readOnly?: boolean;
  isRtl?: boolean;
  showAnswers?: boolean;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  onUpdate: (updated: PedagogicalQuestionItem) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const PedagogicalQuestionRenderer: React.FC<PedagogicalQuestionRendererProps> = ({
  question,
  index,
  totalQuestions = 1,
  isSelected,
  readOnly = false,
  isRtl = false,
  showAnswers = false,
  fontFamily,
  fontSize = 15,
  textColor = '#0f172a',
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const effectiveDirection: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';
  const defaultFont = fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');
  const qNumberLabel =
    question.numberLabel !== undefined
      ? question.numberLabel
      : isRtl
      ? `${index + 1})`
      : `${index + 1})`;

  const sharedStyles: Partial<WorksheetBlock['styles']> = {
    fontFamily: defaultFont,
    fontSize,
    color: textColor,
    textDirection: effectiveDirection,
    textAlign: isRtl ? 'right' : 'left',
  };

  // Option Helpers for QCM variant
  const options: QCMExamOption[] = question.options || [
    { id: 'opt_1', text: 'Proposition A', isCorrect: true },
    { id: 'opt_2', text: 'Proposition B', isCorrect: false },
    { id: 'opt_3', text: 'Proposition C', isCorrect: false },
  ];

  const selectionMode = question.selectionMode || 'single';

  const handleToggleOptionCorrect = (optId: string) => {
    if (readOnly) return;
    const nextOptions = options.map((o) => {
      if (selectionMode === 'single') {
        return { ...o, isCorrect: o.id === optId ? !o.isCorrect : false };
      }
      return o.id === optId ? { ...o, isCorrect: !o.isCorrect } : o;
    });
    onUpdate({ ...question, options: nextOptions });
  };

  const handleUpdateOptionText = (optId: string, newText: string) => {
    const nextOptions = options.map((o) => (o.id === optId ? { ...o, text: newText } : o));
    onUpdate({ ...question, options: nextOptions });
  };

  const handleAddOption = () => {
    if (options.length >= 6) return;
    const newOpt: QCMExamOption = {
      id: `opt_${Date.now()}_${options.length + 1}`,
      text: isRtl ? `مقترح ${options.length + 1}` : `Proposition ${options.length + 1}`,
      isCorrect: false,
    };
    onUpdate({ ...question, options: [...options, newOpt] });
  };

  const handleDeleteOption = (optId: string) => {
    if (options.length <= 2) return;
    onUpdate({ ...question, options: options.filter((o) => o.id !== optId) });
  };

  const handleMoveOption = (optIdx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? optIdx - 1 : optIdx + 1;
    if (targetIdx < 0 || targetIdx >= options.length) return;
    const next = [...options];
    const [moved] = next.splice(optIdx, 1);
    next.splice(targetIdx, 0, moved);
    onUpdate({ ...question, options: next });
  };

  // True/False Helpers
  const tfItems: TrueFalseStatementItem[] = question.trueFalseItems || [
    {
      id: 'tf_1',
      statement: isRtl
        ? 'العدد $13^0$ يساوي $1$'
        : 'Tout nombre non nul élevé à la puissance $0$ est égal à $1$.',
      isTrue: true,
    },
    {
      id: 'tf_2',
      statement: isRtl
        ? 'مجموع زوايا المثلث يساوي $360^\\circ$'
        : 'La somme des angles d’un triangle est égale à $360^\\circ$.',
      isTrue: false,
    },
  ];

  const getColsClass = (cols?: 1 | 2 | 3 | 4 | 'horizontal_row') => {
    switch (cols) {
      case 1:
        return 'grid grid-cols-1';
      case 2:
        return 'grid grid-cols-2';
      case 4:
        return 'grid grid-cols-4';
      case 'horizontal_row':
        return 'flex flex-wrap gap-2';
      case 3:
      default:
        return 'grid grid-cols-3';
    }
  };

  return (
    <div
      dir={effectiveDirection}
      className={`group/qitem relative rounded-xl p-2.5 transition-all border ${
        isSelected && !readOnly
          ? 'border-slate-200/90 hover:border-indigo-300 bg-white/80'
          : 'border-transparent'
      }`}
    >
      {/* Question Header: Number + Statement (Core Editor) + Points Badge + Teacher Controls */}
      <div className="flex items-start gap-2">
        {question.type !== 'paragraph' && qNumberLabel && (
          <span
            className="font-bold shrink-0 select-none pt-0.5 text-slate-900"
            style={{ fontSize: `${fontSize}px`, fontFamily: defaultFont }}
          >
            {qNumberLabel}
          </span>
        )}

        {/* Universal Core Editor for Statement */}
        <div className="flex-1 min-w-0">
          <CoreRichTextField
            value={question.statement}
            onChange={(newVal) => onUpdate({ ...question, statement: newVal })}
            placeholder={
              isRtl
                ? 'اكتب نص السؤال أو المعادلة الرياضية هنا...'
                : 'Rédigez l’énoncé de la question (texte, formules ∑, intervalles [a ; b])...'
            }
            isRtl={isRtl}
            readOnly={readOnly}
            isSelected={isSelected}
            styles={sharedStyles}
            labelBadge={isRtl ? `سؤال ${index + 1}` : `Question ${index + 1}`}
          />
        </div>

        {/* Points (Barème) per question */}
        {question.type !== 'paragraph' && (
          <div
            className="shrink-0 flex items-center gap-1 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {isSelected && !readOnly ? (
              <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5 text-xs">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="100"
                  value={question.points ?? 1}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    onUpdate({ ...question, points: val });
                  }}
                  className="w-11 text-center font-bold text-indigo-700 bg-white border border-slate-200 rounded px-1 py-0.5 outline-none focus:border-indigo-500 tabular-nums"
                  title="Points attribués à cette question"
                />
                <span className="text-[11px] font-semibold text-slate-500">
                  {isRtl ? 'ن' : 'pt'}
                </span>
              </div>
            ) : (
              question.points > 0 && (
                <span className="text-xs font-semibold text-slate-600 whitespace-nowrap tabular-nums">
                  {formatPointsLabel(question.points, isRtl)}
                </span>
              )
            )}
          </div>
        )}

        {/* Teacher Reorder / Delete Question Actions */}
        {isSelected && !readOnly && (
          <div
            dir="ltr"
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover/qitem:opacity-100 flex items-center gap-0.5 transition-opacity shrink-0"
          >
            {onMoveUp && index > 0 && (
              <button
                type="button"
                onClick={onMoveUp}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                title="Monter la question"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
            {onMoveDown && index < totalQuestions - 1 && (
              <button
                type="button"
                onClick={onMoveDown}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                title="Descendre la question"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && totalQuestions > 1 && (
              <button
                type="button"
                onClick={onDelete}
                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                title="Supprimer cette question"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* VARIANT 1: QCM PRO */}
      {question.type === 'qcm' && (
        <div className="mt-2.5 pl-4 pr-1 space-y-2">
          {/* Teacher QCM Controls (Single vs Multiple + Columns + Add Option) */}
          {isSelected && !readOnly && (
            <div
              dir="ltr"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-wrap items-center justify-between gap-2 pb-1 text-[11px] text-slate-500 border-b border-dashed border-slate-200"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-400">Mode :</span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdate({
                      ...question,
                      selectionMode: selectionMode === 'single' ? 'multiple' : 'single',
                    })
                  }
                  className={`px-2 py-0.5 rounded font-semibold border transition-colors cursor-pointer ${
                    selectionMode === 'multiple'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {selectionMode === 'multiple' ? 'Réponses multiples ☑' : 'Réponse unique 🔘'}
                </button>

                <div className="flex items-center bg-slate-100 rounded p-0.5 border border-slate-200">
                  {([1, 2, 3, 4] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => onUpdate({ ...question, optionColumns: col })}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        (question.optionColumns || 3) === col
                          ? 'bg-white text-indigo-700 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {col}c
                    </button>
                  ))}
                </div>
              </div>

              {options.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-indigo-50 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isRtl ? '+ مقترح' : '+ Proposition'}</span>
                </button>
              )}
            </div>
          )}

          {/* Options Grid — Each Option uses the Universal CoreRichTextField */}
          <div className={`${getColsClass(question.optionColumns)} gap-2.5`}>
            {options.map((opt, optIdx) => {
              const letter = isRtl
                ? ARABIC_LETTERS[optIdx % ARABIC_LETTERS.length]
                : LATIN_UPPER[optIdx % LATIN_UPPER.length];
              const isChecked = Boolean(opt.isCorrect && showAnswers);

              return (
                <div
                  key={opt.id}
                  className={`group/opt flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-300/60'
                      : 'border-slate-200/90 bg-white hover:border-indigo-300'
                  }`}
                >
                  {/* Marker / Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleOptionCorrect(opt.id);
                    }}
                    title={
                      isSelected && !readOnly
                        ? opt.isCorrect
                          ? 'Bonne réponse (Cliquer pour décocher)'
                          : 'Cliquer pour définir comme bonne réponse'
                        : undefined
                    }
                    className={`w-5 h-5 shrink-0 flex items-center justify-center text-xs font-bold border transition-all cursor-pointer ${
                      selectionMode === 'single' ? 'rounded-full' : 'rounded-xs'
                    } ${
                      isChecked || (isSelected && !readOnly && opt.isCorrect)
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-700 bg-white text-slate-800'
                    }`}
                  >
                    {isChecked || (isSelected && !readOnly && opt.isCorrect) ? '✓' : letter}
                  </button>

                  {/* Option Content using Universal CoreRichTextField */}
                  <div className="flex-1 min-w-0">
                    <CoreRichTextField
                      value={opt.text}
                      onChange={(newText) => handleUpdateOptionText(opt.id, newText)}
                      placeholder={isRtl ? `مقترح ${letter}` : `Proposition ${letter}`}
                      isRtl={isRtl}
                      readOnly={readOnly}
                      isSelected={isSelected}
                      singleLine
                      styles={{
                        ...sharedStyles,
                        fontSize: Math.max(12, fontSize - 1),
                      }}
                      labelBadge={`Option ${letter}`}
                    />
                  </div>

                  {/* Option Reorder & Delete */}
                  {isSelected && !readOnly && (
                    <div
                      dir="ltr"
                      onClick={(e) => e.stopPropagation()}
                      className="opacity-0 group-hover/opt:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity"
                    >
                      {optIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveOption(optIdx, 'up')}
                          className="p-0.5 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                          title="Déplacer avant"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      )}
                      {optIdx < options.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveOption(optIdx, 'down')}
                          className="p-0.5 text-slate-400 hover:text-indigo-600 rounded cursor-pointer"
                          title="Déplacer après"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      )}
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(opt.id)}
                          className="p-0.5 text-slate-300 hover:text-red-500 rounded cursor-pointer"
                          title="Supprimer cette proposition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VARIANT 2: OPEN QUESTION (Question ouverte avec zone de réponse) */}
      {question.type === 'open_question' && (
        <div className="mt-2 pl-4 pr-1 space-y-2">
          {isSelected && !readOnly && (
            <div
              dir="ltr"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-[11px] text-slate-500"
            >
              <span>Zone élève :</span>
              {(['lines', 'dots', 'grid', 'box', 'none'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdate({ ...question, answerType: t })}
                  className={`px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer ${
                    (question.answerType || 'lines') === t
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {t === 'lines'
                    ? 'Lignes'
                    : t === 'dots'
                    ? 'Pointillés'
                    : t === 'grid'
                    ? 'Quadrillage'
                    : t === 'box'
                    ? 'Cadre'
                    : 'Aucune'}
                </button>
              ))}
              {(question.answerType || 'lines') !== 'none' &&
                (question.answerType || 'lines') !== 'box' && (
                  <div className="flex items-center gap-1 ml-2">
                    <span>Lignes :</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => onUpdate({ ...question, answerLines: n })}
                        className={`w-5 h-5 rounded text-[10px] font-bold border cursor-pointer ${
                          (question.answerLines || 2) === n
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}

          {!showAnswers && (question.answerType || 'lines') !== 'none' && (
            <div className="w-full pt-1">
              {question.answerType === 'box' ? (
                <div className="w-full h-20 border border-dashed border-slate-300 rounded-lg bg-slate-50/30" />
              ) : question.answerType === 'grid' ? (
                <div
                  className="w-full border border-slate-200 rounded"
                  style={{
                    height: `${(question.answerLines || 2) * 26}px`,
                    backgroundImage:
                      'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />
              ) : (
                <div className="space-y-4 py-1">
                  {Array.from({ length: question.answerLines || 2 }).map((_, lIdx) => (
                    <div
                      key={lIdx}
                      className="w-full border-b border-slate-300"
                      style={{
                        borderBottomStyle:
                          question.answerType === 'dots' ? 'dotted' : 'solid',
                        borderBottomWidth: '1.5px',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VARIANT 3: TRUE / FALSE (Affirmations Vrai / Faux avec Core Editor) */}
      {question.type === 'true_false' && (
        <div className="mt-2.5 pl-4 pr-1 space-y-1.5">
          {tfItems.map((item, tfIdx) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 py-1.5 px-2.5 rounded-lg border border-slate-200/80 bg-white"
            >
              <div className="flex-1 min-w-0">
                <CoreRichTextField
                  value={item.statement}
                  onChange={(newStmt) => {
                    const next = tfItems.map((it) =>
                      it.id === item.id ? { ...it, statement: newStmt } : it
                    );
                    onUpdate({ ...question, trueFalseItems: next });
                  }}
                  placeholder={isRtl ? 'اكتب المقترح هنا...' : 'Saisissez l’affirmation...'}
                  isRtl={isRtl}
                  readOnly={readOnly}
                  isSelected={isSelected}
                  singleLine
                  styles={{ ...sharedStyles, fontSize: Math.max(12, fontSize - 1) }}
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => {
                    if (readOnly) return;
                    const next = tfItems.map((it) =>
                      it.id === item.id ? { ...it, isTrue: true } : it
                    );
                    onUpdate({ ...question, trueFalseItems: next });
                  }}
                  className={`px-2 py-0.5 rounded border text-xs font-bold transition-colors cursor-pointer ${
                    (showAnswers || (isSelected && !readOnly)) && item.isTrue
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {isRtl ? 'صواب' : 'Vrai'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (readOnly) return;
                    const next = tfItems.map((it) =>
                      it.id === item.id ? { ...it, isTrue: false } : it
                    );
                    onUpdate({ ...question, trueFalseItems: next });
                  }}
                  className={`px-2 py-0.5 rounded border text-xs font-bold transition-colors cursor-pointer ${
                    (showAnswers || (isSelected && !readOnly)) && !item.isTrue
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  {isRtl ? 'خطأ' : 'Faux'}
                </button>

                {isSelected && !readOnly && tfItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...question,
                        trueFalseItems: tfItems.filter((it) => it.id !== item.id),
                      })
                    }
                    className="p-1 text-slate-300 hover:text-red-500 cursor-pointer"
                    title="Supprimer l'affirmation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isSelected && !readOnly && (
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  ...question,
                  trueFalseItems: [
                    ...tfItems,
                    {
                      id: `tf_${Date.now()}_${tfItems.length + 1}`,
                      statement: isRtl ? 'مقترح جديد...' : 'Nouvelle affirmation...',
                      isTrue: true,
                    },
                  ],
                })
              }
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-indigo-50 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>{isRtl ? '+ إضافة مقترح (صواب/خطأ)' : '+ Ajouter une affirmation'}</span>
            </button>
          )}
        </div>
      )}

      {/* VARIANT 4: TABLE (Tableau pédagogique dont chaque cellule utilise le Core Editor) */}
      {question.type === 'table' && (
        <div className="mt-2.5 pl-4 pr-1 overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100">
                {(question.tableHeaders || ['Grandeur A', 'Valeur 1', 'Valeur 2']).map(
                  (hdr, colIdx) => (
                    <th key={colIdx} className="border border-slate-300 p-1.5 font-bold">
                      <CoreRichTextField
                        value={hdr}
                        onChange={(val) => {
                          const nextH = [
                            ...(question.tableHeaders || ['Grandeur A', 'Valeur 1', 'Valeur 2']),
                          ];
                          nextH[colIdx] = val;
                          onUpdate({ ...question, tableHeaders: nextH });
                        }}
                        isRtl={isRtl}
                        readOnly={readOnly}
                        isSelected={isSelected}
                        singleLine
                        styles={{
                          ...sharedStyles,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          fontSize: Math.max(12, fontSize - 1),
                        }}
                      />
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {(
                question.tableRows || [
                  ['$x$', '$2$', '$5$'],
                  ['$f(x)$', '___', '___'],
                ]
              ).map((row, rIdx) => (
                <tr key={rIdx} className="bg-white">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="border border-slate-300 p-1.5">
                      <CoreRichTextField
                        value={cell}
                        onChange={(val) => {
                          const currentRows = question.tableRows || [
                            ['$x$', '$2$', '$5$'],
                            ['$f(x)$', '___', '___'],
                          ];
                          const nextRows = currentRows.map((r, ri) =>
                            ri === rIdx ? r.map((c, ci) => (ci === cIdx ? val : c)) : r
                          );
                          onUpdate({ ...question, tableRows: nextRows });
                        }}
                        isRtl={isRtl}
                        readOnly={readOnly}
                        isSelected={isSelected}
                        singleLine
                        styles={{
                          ...sharedStyles,
                          textAlign: 'center',
                          fontSize: Math.max(12, fontSize - 1),
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CORRECTION / EXPLANATION (Editable with Universal Core Editor in Answer Key mode or when editing) */}
      {(showAnswers || (isSelected && !readOnly && question.correction !== undefined)) &&
        question.type !== 'paragraph' && (
          <div className="mt-2 ml-4 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200/90">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{isRtl ? 'الإجابة والتعليل (الإصلاح) :' : 'Corrigé / Explication :'}</span>
              </span>
            </div>
            <CoreRichTextField
              value={question.correction || ''}
              onChange={(newCorr) => onUpdate({ ...question, correction: newCorr })}
              placeholder={
                isRtl
                  ? 'اكتب الإصلاح المفصل أو التعليل الرياضي هنا...'
                  : 'Rédigez la réponse attendue ou l’explication détaillée (avec formules ∑)...'
              }
              isRtl={isRtl}
              readOnly={readOnly}
              isSelected={isSelected}
              styles={{
                ...sharedStyles,
                fontSize: Math.max(12, fontSize - 1),
                color: '#065f46',
              }}
              labelBadge="Corrigé"
            />
          </div>
        )}
    </div>
  );
};
