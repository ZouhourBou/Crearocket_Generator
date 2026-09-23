import React, { useRef, useEffect, useState } from 'react';
import {
  WorksheetBlock,
  QCMExamQuestion,
  QCMExamOption,
  QCMQuestionNumberingStyle,
  QCMQuestionIcon,
} from '../../../types/worksheet';
import { InlineMathText } from './InlineMathText';
import { InlineMathToolbar } from './InlineMathToolbar';
import { ProfessionalMathEditorModal } from './ProfessionalMathEditorModal';
import {
  Plus,
  Trash2,
  CheckSquare,
  Sigma,
  Star,
  ArrowRight,
  ArrowLeft,
  Check,
  Diamond,
  CircleDot,
  Edit2,
} from 'lucide-react';
import { resolveBlockDirection } from '../../../utils/textDirection';
import { TitleFloatingToolbar } from '../TitleFloatingToolbar';
import { formatTitlePrefix } from '../../../utils/titleNumbering';

interface QCMExamBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdate: (updates: Partial<WorksheetBlock>) => void;
  documentDefaultDirection?: 'auto' | 'ltr' | 'rtl';
}

const ARABIC_LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];
const LATIN_UPPER = ['A', 'B', 'C', 'D', 'E', 'F'];
const LATIN_LOWER = ['a', 'b', 'c', 'd', 'e', 'f'];

interface MathModalTarget {
  type: 'statement' | 'option' | 'instruction';
  qId?: string;
  optId?: string;
  label: string;
  formulaToReplace?: string;
}

export const QCMExamBlockItem: React.FC<QCMExamBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdate,
  documentDefaultDirection = 'auto',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const [editingStatementId, setEditingStatementId] = useState<string | null>(null);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [editingInstruction, setEditingInstruction] = useState<boolean>(false);

  // Professional Equation Editor Modal state
  const [isMathModalOpen, setIsMathModalOpen] = useState<boolean>(false);
  const [mathModalFormula, setMathModalFormula] = useState<string>('');
  const [mathModalTarget, setMathModalTarget] = useState<MathModalTarget | null>(null);

  const content = block.content || {};
  const styles = block.styles || {};

  const optionColumns = content.optionColumns || 3;
  const markerStyle = content.markerStyle || content.checkboxStyle || 'box_letter_ar';
  const markerPosition = content.markerPosition || 'before';
  const questionNumberingStyle = content.questionNumberingStyle || 'paren';
  const showInstruction = content.showInstruction ?? false;
  const showAnswers = content.showAnswers ?? false; // Mode Corrigé
  const instructionText =
    content.instructionText ||
    'لكل سؤال من الأسئلة التالية إجابة واحدة صحيحة، ضع علامة (×) أمام المقترح الصحيح :';
  const instructionNumbering = content.instructionNumbering || 'none';

  const selectedSub = content.selectedSubElement;

  const questions: QCMExamQuestion[] =
    content.questions && content.questions.length > 0
      ? content.questions
      : [
          {
            id: 'q_1',
            statement: 'العبارة العددية : 13 − 5 × 13 تساوي :',
            options: [
              { id: 'opt_1', text: '13¹³', isCorrect: false },
              { id: 'opt_2', text: '13³⁶', isCorrect: false },
              { id: 'opt_3', text: '169¹³', isCorrect: true },
            ],
          },
        ];

  // Text Direction Resolution
  const allText = [
    showInstruction ? instructionText : '',
    ...questions.map((q) => q.statement + ' ' + q.options.map((o) => o.text).join(' ')),
  ].join(' ');

  const effectiveDirection = resolveBlockDirection(
    styles.textDirection,
    allText,
    documentDefaultDirection
  );
  const isRtl = effectiveDirection === 'rtl';

  // Sizing & Spacing
  const statementFontSize = styles.statementFontSize || styles.fontSize || 15;
  const optionFontSize = styles.optionFontSize || 14;
  const instructionFontSize = styles.instructionFontSize || 13;
  const questionSpacing = styles.questionSpacing !== undefined ? styles.questionSpacing : 12;
  const optionSpacing = styles.optionSpacing !== undefined ? styles.optionSpacing : 8;
  const textColor = styles.color || '#0f172a';
  const textAlign = isRtl
    ? styles.textAlign || 'right'
    : styles.textAlign === 'right' && styles.textDirection !== 'rtl'
    ? 'left'
    : styles.textAlign || 'left';

  // Title styles
  const instructionColor = styles.instructionColor || textColor;
  const instructionBg = styles.instructionBackgroundColor || 'transparent';
  const instructionTransform = styles.instructionTextTransform || 'none';

  // Dynamic Height Sync
  useEffect(() => {
    if (containerRef.current) {
      const measured = Math.ceil(containerRef.current.scrollHeight);
      if (Math.abs(measured - block.height) > 6 && measured > 40) {
        onUpdate({ height: measured });
      }
    }
  }, [
    questions,
    optionColumns,
    markerStyle,
    markerPosition,
    questionSpacing,
    optionSpacing,
    showInstruction,
    instructionText,
    instructionNumbering,
    showAnswers,
    selectedSub,
  ]);

  const updateContent = (partial: Partial<WorksheetBlock['content']>) => {
    onUpdate({
      content: {
        ...block.content,
        ...partial,
      },
    });
  };

  // Helper to insert text at cursor or append
  const insertTextAtCursor = (currentText: string, textToInsert: string): string => {
    const input = activeInputRef.current;
    if (!input) {
      return currentText ? `${currentText} ${textToInsert}` : textToInsert;
    }
    const start = input.selectionStart ?? currentText.length;
    const end = input.selectionEnd ?? currentText.length;
    const before = currentText.substring(0, start);
    const after = currentText.substring(end);
    return before + textToInsert + after;
  };

  // Statement / Option Updates
  const handleUpdateStatement = (qId: string, text: string) => {
    const updated = questions.map((q) => (q.id === qId ? { ...q, statement: text } : q));
    updateContent({ questions: updated });
  };

  const handleUpdateOption = (qId: string, optId: string, text: string) => {
    const updated = questions.map((q) => {
      if (q.id !== qId) return q;
      return {
        ...q,
        options: q.options.map((o) => (o.id === optId ? { ...o, text } : o)),
      };
    });
    updateContent({ questions: updated });
  };

  const handleToggleOptionCorrect = (qId: string, optId: string) => {
    if (readOnly) return;
    const updated = questions.map((q) => {
      if (q.id !== qId) return q;
      return {
        ...q,
        options: q.options.map((o) => (o.id === optId ? { ...o, isCorrect: !o.isCorrect } : o)),
      };
    });
    updateContent({ questions: updated });
  };

  // Math Toolbar symbol insertion into active input
  const handleInsertSymbolToActive = (sym: string) => {
    if (editingStatementId) {
      const q = questions.find((item) => item.id === editingStatementId);
      if (q) {
        const next = insertTextAtCursor(q.statement, sym);
        handleUpdateStatement(editingStatementId, next);
      }
    } else if (editingOptionId) {
      for (const q of questions) {
        const opt = q.options.find((o) => o.id === editingOptionId);
        if (opt) {
          const next = insertTextAtCursor(opt.text, sym);
          handleUpdateOption(q.id, opt.id, next);
          break;
        }
      }
    } else if (editingInstruction) {
      const next = insertTextAtCursor(instructionText, sym);
      updateContent({ instructionText: next });
    }
  };

  // Open Equation Editor Modal
  const handleOpenMathModalForActiveInput = () => {
    if (editingStatementId) {
      const qIdx = questions.findIndex((q) => q.id === editingStatementId);
      setMathModalTarget({
        type: 'statement',
        qId: editingStatementId,
        label: isRtl ? `سؤال (${qIdx + 1})` : `Question ${qIdx + 1}`,
      });
      setMathModalFormula('');
      setIsMathModalOpen(true);
    } else if (editingOptionId) {
      for (const q of questions) {
        const optIdx = q.options.findIndex((o) => o.id === editingOptionId);
        if (optIdx !== -1) {
          const opt = q.options[optIdx];
          const letter = isRtl
            ? ARABIC_LETTERS[optIdx % ARABIC_LETTERS.length]
            : LATIN_UPPER[optIdx % LATIN_UPPER.length];
          setMathModalTarget({
            type: 'option',
            qId: q.id,
            optId: editingOptionId,
            label: isRtl ? `مقترح (${letter})` : `Option (${letter})`,
          });
          setMathModalFormula(opt.text.trim());
          setIsMathModalOpen(true);
          break;
        }
      }
    } else if (editingInstruction) {
      setMathModalTarget({
        type: 'instruction',
        label: isRtl ? 'التعليمة العامة' : 'Consigne générale',
      });
      setMathModalFormula('');
      setIsMathModalOpen(true);
    }
  };

  // Open Equation Editor when clicking an existing formula in preview mode
  const handleOpenMathModalForExisting = (
    targetType: 'statement' | 'option' | 'instruction',
    qId?: string,
    rawFormula?: string,
    optId?: string
  ) => {
    if (readOnly || !isSelected) return;
    let label = '';
    if (targetType === 'statement' && qId) {
      const qIdx = questions.findIndex((q) => q.id === qId);
      label = isRtl ? `تعديل صيغة السؤال (${qIdx + 1})` : `Formule Question ${qIdx + 1}`;
    } else if (targetType === 'option' && qId && optId) {
      const qIdx = questions.findIndex((q) => q.id === qId);
      const q = questions[qIdx];
      const optIdx = q?.options.findIndex((o) => o.id === optId) ?? 0;
      const letter = isRtl
        ? ARABIC_LETTERS[optIdx % ARABIC_LETTERS.length]
        : LATIN_UPPER[optIdx % LATIN_UPPER.length];
      label = isRtl ? `تعديل صيغة المقترح (${letter})` : `Formule Option (${letter})`;
    } else {
      label = isRtl ? 'تعديل صيغة التعليمة' : 'Formule Titre / Consigne';
    }

    setMathModalTarget({
      type: targetType,
      qId,
      optId,
      label,
      formulaToReplace: rawFormula,
    });
    setMathModalFormula(rawFormula || '');
    setIsMathModalOpen(true);
  };

  // Save formula from Modal
  const handleSaveFormulaFromModal = (newFormula: string) => {
    if (!mathModalTarget) return;

    if (mathModalTarget.type === 'statement' && mathModalTarget.qId) {
      const q = questions.find((item) => item.id === mathModalTarget.qId);
      if (q) {
        let nextStatement = q.statement;
        if (mathModalTarget.formulaToReplace && nextStatement.includes(mathModalTarget.formulaToReplace)) {
          nextStatement = nextStatement.replace(mathModalTarget.formulaToReplace, newFormula);
        } else {
          nextStatement = insertTextAtCursor(q.statement, newFormula);
        }
        handleUpdateStatement(mathModalTarget.qId, nextStatement);
      }
    } else if (mathModalTarget.type === 'option' && mathModalTarget.qId && mathModalTarget.optId) {
      const q = questions.find((item) => item.id === mathModalTarget.qId);
      const opt = q?.options.find((o) => o.id === mathModalTarget.optId);
      if (opt) {
        let nextText = opt.text;
        if (mathModalTarget.formulaToReplace && nextText.includes(mathModalTarget.formulaToReplace)) {
          nextText = nextText.replace(mathModalTarget.formulaToReplace, newFormula);
        } else if (!nextText || nextText.trim() === '0') {
          nextText = newFormula;
        } else {
          nextText = insertTextAtCursor(opt.text, newFormula);
        }
        handleUpdateOption(mathModalTarget.qId, mathModalTarget.optId, nextText);
      }
    } else if (mathModalTarget.type === 'instruction') {
      let nextText = instructionText;
      if (mathModalTarget.formulaToReplace && nextText.includes(mathModalTarget.formulaToReplace)) {
        nextText = nextText.replace(mathModalTarget.formulaToReplace, newFormula);
      } else {
        nextText = insertTextAtCursor(instructionText, newFormula);
      }
      updateContent({ instructionText: nextText });
    }

    setIsMathModalOpen(false);
    setMathModalTarget(null);
  };

  const handleAddQuestion = () => {
    const newQ: QCMExamQuestion = {
      id: `q_${Date.now()}`,
      statement: isRtl ? 'العبارة التالية تساوي :' : 'Calculer l’expression suivante :',
      options: [
        { id: `opt_${Date.now()}_1`, text: '10⁵', isCorrect: false },
        { id: `opt_${Date.now()}_2`, text: '64', isCorrect: false },
        { id: `opt_${Date.now()}_3`, text: '3', isCorrect: true },
      ],
    };
    updateContent({
      questions: [...questions, newQ],
      selectedSubElement: {
        type: 'question',
        questionId: newQ.id,
        questionIds: [newQ.id],
      },
    });
  };

  const handleDeleteQuestion = (qId: string) => {
    if (questions.length <= 1) return;
    const remaining = questions.filter((q) => q.id !== qId);
    updateContent({
      questions: remaining,
      selectedSubElement: {
        type: 'block',
      },
    });
  };

  const handleAddOption = (qId: string) => {
    const updated = questions.map((q) => {
      if (q.id !== qId) return q;
      if (q.options.length >= 6) return q;
      const newOpt: QCMExamOption = {
        id: `opt_${Date.now()}_${q.options.length + 1}`,
        text: '0',
        isCorrect: false,
      };
      return { ...q, options: [...q.options, newOpt] };
    });
    updateContent({ questions: updated });
  };

  const handleDeleteOption = (qId: string, optId: string) => {
    const updated = questions.map((q) => {
      if (q.id !== qId) return q;
      if (q.options.length <= 1) return q;
      return { ...q, options: q.options.filter((o) => o.id !== optId) };
    });
    updateContent({
      questions: updated,
      selectedSubElement: {
        type: 'question',
        questionId: qId,
        questionIds: [qId],
      },
    });
  };

  // Helper for rendering Question Icons
  const renderQuestionIcon = (iconName?: QCMQuestionIcon) => {
    switch (iconName) {
      case 'star':
        return <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 shrink-0 inline-block" />;
      case 'arrow':
        return isRtl ? (
          <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 shrink-0 inline-block" />
        ) : (
          <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 inline-block" />
        );
      case 'check':
        return <Check className="w-3.5 h-3.5 text-emerald-600 font-bold shrink-0 inline-block" />;
      case 'diamond':
        return <Diamond className="w-3 h-3 fill-indigo-500 text-indigo-600 shrink-0 inline-block" />;
      case 'circle_dot':
        return <CircleDot className="w-3.5 h-3.5 text-indigo-600 shrink-0 inline-block" />;
      case 'square_small':
        return <span className="w-2.5 h-2.5 bg-indigo-600 rounded-xs inline-block shrink-0" />;
      case 'bullet':
      default:
        return <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0 inline-block" />;
    }
  };

  // Helper for rendering question numbers: (1), 1), 1., etc.
  const formatQuestionNumber = (
    idx: number,
    qStyle?: QCMQuestionNumberingStyle,
    iconName?: QCMQuestionIcon
  ) => {
    const effectiveStyle = qStyle || questionNumberingStyle;
    const num = idx + 1;
    const arLetter = ARABIC_LETTERS[idx % ARABIC_LETTERS.length];
    const latUpper = LATIN_UPPER[idx % LATIN_UPPER.length];

    switch (effectiveStyle) {
      case 'number':
      case 'paren':
        return isRtl ? `(${num})` : `${num})`;
      case 'dot':
        return `${num}.`;
      case 'dash':
        return `${num} -`;
      case 'both_paren':
        return `(${num})`;
      case 'letter':
        return `${latUpper}.`;
      case 'letter_ar':
        return isRtl ? `(${arLetter})` : `${arLetter}.`;
      case 'icon':
        return renderQuestionIcon(iconName);
      case 'none':
        return null;
      default:
        return `${num})`;
    }
  };

  // Helper for rendering instruction title numbering: "1)", "A)", "I)", "•", "Aucune", "Personnalisé"
  const formatInstructionNumber = (style?: string, customPrefix?: string) => {
    return formatTitlePrefix(style, isRtl, customPrefix);
  };

  // Helper for rendering Option Prefixes
  const formatOptionPrefix = (
    optIdx: number,
    prefixType?: 'letter' | 'letter_lower' | 'letter_ar' | 'number' | 'none',
    separator?: 'paren' | 'dot' | 'dash' | 'both_paren' | 'none'
  ) => {
    if (prefixType === 'none') return '';
    const num = optIdx + 1;
    const arLetter = ARABIC_LETTERS[optIdx % ARABIC_LETTERS.length];
    const latUpper = LATIN_UPPER[optIdx % LATIN_UPPER.length];
    const latLower = LATIN_LOWER[optIdx % LATIN_LOWER.length];

    let raw = latUpper;
    if (prefixType === 'letter_ar') raw = arLetter;
    else if (prefixType === 'letter_lower') raw = latLower;
    else if (prefixType === 'number') raw = String(num);

    switch (separator) {
      case 'paren':
        return isRtl ? `(${raw})` : `${raw})`;
      case 'dot':
        return `${raw}.`;
      case 'dash':
        return `${raw} -`;
      case 'both_paren':
        return `(${raw})`;
      case 'none':
        return raw;
      default:
        return `${raw})`;
    }
  };

  // Helper for rendering Answer Option Markers (conforming to Tunisian & Western exams)
  const renderMarker = (idx: number, isCorrect?: boolean) => {
    const arLetter = ARABIC_LETTERS[idx % ARABIC_LETTERS.length];
    const latUpper = LATIN_UPPER[idx % LATIN_UPPER.length];
    const latLower = LATIN_LOWER[idx % LATIN_LOWER.length];
    const isAnswerChecked = Boolean(isCorrect && showAnswers);

    switch (markerStyle) {
      case 'box_letter_ar':
        return (
          <span
            className={`w-6 h-6 rounded-xs border-1.5 inline-flex items-center justify-center text-[12px] font-bold shrink-0 font-arabic select-none transition-all ${
              isAnswerChecked
                ? 'border-emerald-600 bg-emerald-100/80 text-emerald-900 shadow-2xs'
                : 'border-slate-800 bg-white text-slate-800'
            }`}
          >
            {isAnswerChecked ? (
              <span className="flex items-center justify-center gap-0.5 leading-none">
                <span className="text-emerald-700 font-black text-xs">✕</span>
                <span className="text-[11px] font-bold">{arLetter}</span>
              </span>
            ) : (
              arLetter
            )}
          </span>
        );

      case 'letter_ar_square':
        return (
          <span className="inline-flex items-center gap-1 shrink-0 select-none">
            <span
              className={`w-4.5 h-4.5 rounded-xs border-1.5 inline-flex items-center justify-center text-[11px] font-bold transition-all ${
                isAnswerChecked
                  ? 'border-emerald-600 bg-emerald-100 text-emerald-800'
                  : 'border-slate-700 bg-white text-transparent'
              }`}
            >
              {isAnswerChecked ? '✕' : ''}
            </span>
            <span className="font-bold text-xs font-arabic text-slate-800">{arLetter}</span>
          </span>
        );

      case 'number_square':
        return (
          <span
            className={`w-5.5 h-5.5 rounded-xs border-1.5 inline-flex items-center justify-center text-[11px] font-bold shrink-0 select-none transition-all ${
              isAnswerChecked
                ? 'border-emerald-600 bg-emerald-100 text-emerald-900 shadow-2xs'
                : 'border-slate-700 bg-white text-slate-800'
            }`}
          >
            {isAnswerChecked ? `✕ ${idx + 1}` : `${idx + 1}`}
          </span>
        );

      case 'circle':
        return (
          <span
            className={`w-4 h-4 rounded-full border-1.5 inline-flex items-center justify-center shrink-0 select-none transition-all ${
              isAnswerChecked
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-700 bg-white'
            }`}
          >
            {isAnswerChecked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </span>
        );

      case 'box_letter_upper':
        return (
          <span
            className={`w-5.5 h-5.5 rounded-xs border-1.5 inline-flex items-center justify-center text-[11px] font-bold shrink-0 font-mono select-none transition-all ${
              isAnswerChecked
                ? 'border-emerald-600 bg-emerald-100 text-emerald-900 shadow-2xs'
                : 'border-slate-700 bg-white text-slate-800'
            }`}
          >
            {isAnswerChecked ? `✕ ${latUpper}` : latUpper}
          </span>
        );

      case 'box_letter_lower':
        return (
          <span
            className={`w-5.5 h-5.5 rounded-xs border-1.5 inline-flex items-center justify-center text-[11px] font-bold shrink-0 font-mono select-none transition-all ${
              isAnswerChecked
                ? 'border-emerald-600 bg-emerald-100 text-emerald-900 shadow-2xs'
                : 'border-slate-700 bg-white text-slate-800'
            }`}
          >
            {isAnswerChecked ? `✕ ${latLower}` : latLower}
          </span>
        );

      case 'letter_ar_paren':
        return (
          <span
            className={`text-[13px] font-bold shrink-0 font-arabic select-none ${
              isAnswerChecked ? 'text-emerald-700' : 'text-slate-800'
            }`}
          >
            {isAnswerChecked ? `✕ (${arLetter})` : `(${arLetter})`}
          </span>
        );

      case 'letter_ar_dot':
        return (
          <span
            className={`text-[13px] font-bold shrink-0 font-arabic select-none ${
              isAnswerChecked ? 'text-emerald-700' : 'text-slate-800'
            }`}
          >
            {isAnswerChecked ? `✕ ${arLetter}.` : `${arLetter}.`}
          </span>
        );

      case 'letter_paren':
        return (
          <span
            className={`text-[13px] font-bold shrink-0 select-none ${
              isAnswerChecked ? 'text-emerald-700' : 'text-slate-800'
            }`}
          >
            {isAnswerChecked ? `✕ ${latLower})` : `${latLower})`}
          </span>
        );

      case 'letter_paren_upper':
        return (
          <span
            className={`text-[13px] font-bold shrink-0 select-none ${
              isAnswerChecked ? 'text-emerald-700' : 'text-slate-800'
            }`}
          >
            {isAnswerChecked ? `✕ ${latUpper})` : `${latUpper})`}
          </span>
        );

      case 'none':
        return null;

      case 'square':
      default:
        return (
          <span
            className={`w-4.5 h-4.5 rounded-xs border-1.5 inline-flex items-center justify-center shrink-0 select-none transition-all ${
              isAnswerChecked
                ? 'border-emerald-600 bg-emerald-100 text-emerald-800 font-black text-xs'
                : 'border-slate-700 bg-white text-transparent'
            }`}
          >
            {isAnswerChecked ? '✕' : ''}
          </span>
        );
    }
  };

  // Render individual option marker shape (supports custom shape & border-radius)
  const renderOptionMarker = (
    opt: QCMExamOption,
    optIdx: number,
    isAnswerChecked: boolean
  ) => {
    if (opt.markerShape === 'none') {
      return null;
    }

    if (opt.markerShape === 'circle') {
      return (
        <span
          className={`w-4.5 h-4.5 rounded-full border-1.5 inline-flex items-center justify-center shrink-0 select-none transition-all ${
            isAnswerChecked
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-slate-700 bg-white'
          }`}
        >
          {isAnswerChecked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
        </span>
      );
    }

    if (opt.markerShape === 'rounded_square') {
      const radius = opt.borderRadius !== undefined ? opt.borderRadius : 6;
      return (
        <span
          style={{ borderRadius: `${radius}px` }}
          className={`w-4.5 h-4.5 border-1.5 inline-flex items-center justify-center shrink-0 select-none transition-all ${
            isAnswerChecked
              ? 'border-emerald-600 bg-emerald-100 text-emerald-800 font-black text-xs'
              : 'border-slate-700 bg-white text-transparent'
          }`}
        >
          {isAnswerChecked ? '✕' : ''}
        </span>
      );
    }

    if (opt.markerShape === 'square') {
      return (
        <span
          className={`w-4.5 h-4.5 rounded-xs border-1.5 inline-flex items-center justify-center shrink-0 select-none transition-all ${
            isAnswerChecked
              ? 'border-emerald-600 bg-emerald-100 text-emerald-800 font-black text-xs'
              : 'border-slate-700 bg-white text-transparent'
          }`}
        >
          {isAnswerChecked ? '✕' : ''}
        </span>
      );
    }

    // Default to global block markerStyle
    return renderMarker(optIdx, opt.isCorrect);
  };

  // Sub-selection helper queries
  const isTitleSelected = isSelected && selectedSub?.type === 'title';
  const isQuestionSelected = (qId: string) => {
    if (!isSelected || selectedSub?.type !== 'question') return false;
    return selectedSub.questionId === qId || selectedSub.questionIds?.includes(qId);
  };
  const isOptionSelected = (optId: string) => {
    if (!isSelected || selectedSub?.type !== 'option') return false;
    return selectedSub.optionId === optId || selectedSub.optionIds?.includes(optId);
  };

  // Click Handlers for Cascade Selection
  const handleSelectTitle = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    updateContent({
      selectedSubElement: { type: 'title' },
    });
  };

  const handleSelectQuestion = (e: React.MouseEvent, qId: string) => {
    if (readOnly) return;
    e.stopPropagation();
    if (e.shiftKey) {
      const current = selectedSub?.type === 'question' ? selectedSub.questionIds || [selectedSub.questionId || qId] : [];
      const next = current.includes(qId) ? current.filter((id) => id !== qId) : [...current, qId];
      updateContent({
        selectedSubElement: {
          type: 'question',
          questionId: next[0] || qId,
          questionIds: next.length > 0 ? next : [qId],
        },
      });
    } else {
      updateContent({
        selectedSubElement: {
          type: 'question',
          questionId: qId,
          questionIds: [qId],
        },
      });
    }
  };

  const handleSelectOption = (e: React.MouseEvent, qId: string, optId: string) => {
    if (readOnly) return;
    e.stopPropagation();
    if (e.shiftKey) {
      const current = selectedSub?.type === 'option' ? selectedSub.optionIds || [selectedSub.optionId || optId] : [];
      const next = current.includes(optId) ? current.filter((id) => id !== optId) : [...current, optId];
      updateContent({
        selectedSubElement: {
          type: 'option',
          questionId: qId,
          optionId: next[0] || optId,
          optionIds: next.length > 0 ? next : [optId],
        },
      });
    } else {
      updateContent({
        selectedSubElement: {
          type: 'option',
          questionId: qId,
          optionId: optId,
          optionIds: [optId],
        },
      });
    }
  };

  // CSS grid column resolution per question
  const getQuestionColsClass = (qCols?: 1 | 2 | 3 | 4 | 'horizontal_row') => {
    const effective = qCols !== undefined ? qCols : optionColumns;
    if (effective === 'horizontal_row') return 'flex flex-wrap gap-2';
    switch (effective) {
      case 1:
        return 'grid grid-cols-1';
      case 2:
        return 'grid grid-cols-2';
      case 3:
        return 'grid grid-cols-3';
      case 4:
        return 'grid grid-cols-4';
      default:
        return 'grid grid-cols-3';
    }
  };

  const titleNumberingPrefix = formatInstructionNumber(
    instructionNumbering,
    content.instructionCustomPrefix
  );

  return (
    <div
      ref={containerRef}
      dir={effectiveDirection}
      onClick={() => {
        if (!readOnly && isSelected) {
          updateContent({ selectedSubElement: { type: 'block' } });
        }
      }}
      className={`w-full relative transition-all ${isRtl ? 'font-arabic' : ''}`}
      style={{
        color: textColor,
        fontFamily: styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif'),
      }}
    >
      {/* Teacher Action Bar when QCM Block is Selected */}
      {isSelected && !readOnly && (
        <div
          dir="ltr"
          onClick={(e) => e.stopPropagation()}
          className="mb-2 p-1.5 bg-slate-900 text-white rounded-xl shadow-md flex items-center justify-between gap-2 text-xs border border-slate-700/80 animate-in fade-in duration-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider px-1">
              QCM Universel :
            </span>

            {/* Answer Key Mode (Mode Corrigé) Toggle */}
            <button
              type="button"
              onClick={() => updateContent({ showAnswers: !showAnswers })}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                showAnswers
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              title="Afficher ou masquer les réponses cochées dans le corrigé"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-200" />
              <span>{showAnswers ? 'Mode Corrigé (Activé)' : 'Mode Corrigé (Désactivé)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Direct Equation Editor Launch */}
            <button
              type="button"
              onClick={() => {
                setMathModalTarget({
                  type: 'statement',
                  qId: questions[0]?.id || 'q_1',
                  label: 'Insertion équation',
                });
                setMathModalFormula('');
                setIsMathModalOpen(true);
              }}
              className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Ouvrir l'éditeur complet de formules mathématiques"
            >
              <Sigma className="w-3 h-3 text-indigo-200" />
              <span>Éditeur ∑</span>
            </button>

            {/* Global Columns Quick Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {[1, 2, 3, 4].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateContent({ optionColumns: c as any })}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    optionColumns === c
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${c} colonne(s)`}
                >
                  {c}col
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. Titre / Énoncé global du bloc QCM (Axe 1 - Fusionné au niveau Bloc) */}
      {showInstruction && (
        <div
          onClick={(e) => {
            if (!readOnly) {
              e.stopPropagation();
              updateContent({ selectedSubElement: { type: 'block' } });
              setEditingInstruction(true);
            }
          }}
          className="relative mb-3 p-2 rounded-lg transition-all cursor-text group/title"
          style={{
            backgroundColor:
              styles.instructionBackgroundColor && styles.instructionBackgroundColor !== 'transparent'
                ? styles.instructionBackgroundColor
                : undefined,
            borderColor: styles.instructionBorderColor || 'transparent',
            borderWidth: styles.instructionBorderWidth ? `${styles.instructionBorderWidth}px` : undefined,
            borderStyle: (styles.instructionBorderStyle as any) || undefined,
            borderRadius: styles.instructionBorderRadius ? `${styles.instructionBorderRadius}px` : undefined,
            fontFamily: styles.instructionFontFamily || 'inherit',
          }}
        >
          {/* Floating inline toolbar for QCM title when editing/clicked */}
          {!readOnly && editingInstruction && (
            <TitleFloatingToolbar
              isBold={styles.instructionFontWeight === 'bold'}
              onToggleBold={() =>
                onUpdate({
                  styles: {
                    ...styles,
                    instructionFontWeight:
                      styles.instructionFontWeight === 'bold' ? 'normal' : 'bold',
                  },
                })
              }
              isItalic={styles.instructionFontStyle === 'italic'}
              onToggleItalic={() =>
                onUpdate({
                  styles: {
                    ...styles,
                    instructionFontStyle:
                      styles.instructionFontStyle === 'italic' ? 'normal' : 'italic',
                  },
                })
              }
              isUnderline={styles.instructionTextDecoration === 'underline'}
              onToggleUnderline={() =>
                onUpdate({
                  styles: {
                    ...styles,
                    instructionTextDecoration:
                      styles.instructionTextDecoration === 'underline' ? 'none' : 'underline',
                  },
                })
              }
              numbering={content.instructionNumbering || 'none'}
              onChangeNumbering={(num) => updateContent({ instructionNumbering: num })}
              isRtl={isRtl}
            />
          )}

          {editingInstruction && !readOnly ? (
            <div className="space-y-1.5 w-full" onClick={(e) => e.stopPropagation()}>
              <InlineMathToolbar
                onInsertSymbol={handleInsertSymbolToActive}
                onOpenEquationEditor={handleOpenMathModalForActiveInput}
              />
              <div className="flex items-start gap-1.5 w-full">
                {titleNumberingPrefix && (
                  <span
                    className="font-bold shrink-0 select-none pt-1"
                    style={{
                      fontSize: `${instructionFontSize}px`,
                      color: instructionColor,
                      fontWeight: styles.instructionFontWeight || 'bold',
                      fontStyle: styles.instructionFontStyle || 'normal',
                      textDecoration: styles.instructionTextDecoration || 'none',
                    }}
                  >
                    {titleNumberingPrefix}
                  </span>
                )}
                <textarea
                  ref={activeInputRef as any}
                  autoFocus
                  rows={Math.max(1, Math.ceil((instructionText || '').length / 50))}
                  dir={effectiveDirection}
                  value={instructionText}
                  onChange={(e) => updateContent({ instructionText: e.target.value })}
                  onBlur={() => setEditingInstruction(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setEditingInstruction(false);
                  }}
                  className="flex-1 p-1.5 bg-white border-2 border-indigo-500 rounded-lg outline-none text-slate-800 shadow-xs resize-none leading-relaxed"
                  style={{
                    fontSize: `${instructionFontSize}px`,
                    color: instructionColor,
                    fontFamily: styles.instructionFontFamily || styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif'),
                    fontWeight: styles.instructionFontWeight || 'normal',
                    fontStyle: styles.instructionFontStyle || 'normal',
                    textDecoration: styles.instructionTextDecoration || 'none',
                    textAlign: (styles.instructionTextAlign || textAlign) as any,
                    textTransform: instructionTransform as any,
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              className="flex items-baseline gap-1.5 font-medium cursor-text select-text w-full"
              style={{
                fontSize: `${instructionFontSize}px`,
                color: instructionColor,
                fontFamily: styles.instructionFontFamily || styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif'),
                fontWeight: styles.instructionFontWeight || 'normal',
                fontStyle: styles.instructionFontStyle || 'normal',
                textDecoration: styles.instructionTextDecoration || 'none',
                textAlign: (styles.instructionTextAlign || textAlign) as any,
                textTransform: instructionTransform as any,
                justifyContent:
                  (styles.instructionTextAlign || textAlign) === 'center'
                    ? 'center'
                    : (styles.instructionTextAlign || textAlign) === 'right'
                    ? 'flex-end'
                    : 'flex-start',
              }}
              title="Cliquer pour modifier le texte de l’énoncé directement sur la page"
            >
              {titleNumberingPrefix && (
                <span
                  className="font-bold shrink-0 select-none"
                  style={{
                    color: instructionColor,
                    fontWeight: styles.instructionFontWeight || 'bold',
                    fontStyle: styles.instructionFontStyle || 'normal',
                    textDecoration: styles.instructionTextDecoration || 'none',
                  }}
                >
                  {titleNumberingPrefix}
                </span>
              )}
              <div className="flex-1">
                <InlineMathText
                  text={instructionText}
                  onEquationClick={(formula) =>
                    handleOpenMathModalForExisting('instruction', undefined, formula)
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Pile des questions (Axe 2 & Axe 4) */}
      <div className="flex flex-col" style={{ gap: `${questionSpacing}px` }}>
        {questions.map((question, qIdx) => {
          const qNum = formatQuestionNumber(qIdx, question.numberingStyle, question.iconName);
          const isStatementEditing = editingStatementId === question.id && !readOnly;
          const isQSelected = isQuestionSelected(question.id);

          const qFontSize = question.fontSize || statementFontSize;
          const qFontFamily = question.fontFamily || styles.statementFontFamily || styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');
          const qColor = question.color || textColor;
          const qAlign = question.textAlign || textAlign;

          return (
            <div
              key={question.id}
              onClick={(e) => handleSelectQuestion(e, question.id)}
              className={`group/question relative rounded-xl p-2 transition-all border ${
                isQSelected
                  ? 'ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/15'
                  : 'border-transparent hover:bg-slate-50/80 hover:border-slate-200/60'
              }`}
            >
              {/* Floating Inline Math Toolbar when Statement is being edited */}
              {isStatementEditing && (
                <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                  <InlineMathToolbar
                    onInsertSymbol={handleInsertSymbolToActive}
                    onOpenEquationEditor={handleOpenMathModalForActiveInput}
                  />
                </div>
              )}

              {/* Question Header: Number + Statement with isolated LTR math */}
              <div
                className={`flex items-baseline gap-2 mb-2 ${isRtl ? 'flex-row' : 'flex-row'}`}
                style={{
                  fontSize: `${qFontSize}px`,
                  fontFamily: qFontFamily,
                  fontWeight: (question as any).fontWeight || styles.statementFontWeight || 'normal',
                  color: qColor,
                  textAlign: qAlign as any,
                }}
              >
                {qNum && (
                  <span className="font-bold shrink-0 select-none flex items-center">
                    {qNum}
                  </span>
                )}

                {isStatementEditing ? (
                  <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      ref={activeInputRef as any}
                      type="text"
                      autoFocus
                      dir={effectiveDirection}
                      value={question.statement}
                      onChange={(e) => handleUpdateStatement(question.id, e.target.value)}
                      onBlur={() => setEditingStatementId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingStatementId(null);
                      }}
                      className="w-full px-2.5 py-1 bg-white border-2 border-indigo-500 rounded-lg font-normal outline-none text-slate-800 shadow-xs"
                      style={{ fontSize: `${qFontSize}px` }}
                    />
                  </div>
                ) : (
                  <div
                    onDoubleClick={() => !readOnly && isSelected && setEditingStatementId(question.id)}
                    className="flex-1 font-normal cursor-text select-text hover:text-indigo-900 leading-relaxed"
                    title={isSelected ? 'Double-cliquez pour modifier l’énoncé (ou cliquez sur une formule pour la retoucher)' : undefined}
                  >
                    <InlineMathText
                      text={question.statement}
                      onEquationClick={(formula) =>
                        handleOpenMathModalForExisting('statement', question.id, formula)
                      }
                    />
                  </div>
                )}

                {/* Quick Deletion of Question (hover action - Axe 4) */}
                {isSelected && !readOnly && questions.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(question.id);
                    }}
                    title="Supprimer cette question"
                    className="opacity-0 group-hover/question:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-opacity cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 3. Options de réponse (Axe 3) */}
              <div
                dir={effectiveDirection}
                className={`${getQuestionColsClass(question.optionColumns)} gap-x-4`}
                style={{ rowGap: `${optionSpacing}px` }}
              >
                {question.options.map((opt, optIdx) => {
                  const isOptionEditing = editingOptionId === opt.id && !readOnly;
                  const isOptSelected = isOptionSelected(opt.id);
                  const isAnswerChecked = Boolean(opt.isCorrect && showAnswers);

                  const optFontFamily = opt.fontFamily || styles.optionFontFamily || styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');
                  const optFontSizeVal = opt.fontSize || optionFontSize;
                  const optColor = opt.color || textColor;
                  const optBg = opt.backgroundColor;

                  const prefixText =
                    opt.showPrefix !== false
                      ? formatOptionPrefix(optIdx, opt.prefixType, opt.prefixSeparator)
                      : '';

                  return (
                    <div
                      key={opt.id}
                      onClick={(e) => handleSelectOption(e, question.id, opt.id)}
                      className={`group/opt relative flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                        isOptSelected
                          ? 'ring-2 ring-indigo-500 border-indigo-400 shadow-2xs'
                          : isAnswerChecked
                          ? 'border-emerald-400/90 bg-emerald-50/40 ring-1 ring-emerald-300/40 shadow-2xs'
                          : 'border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                      } ${
                        markerPosition === 'after'
                          ? 'flex-row-reverse justify-end'
                          : 'flex-row justify-start'
                      }`}
                      style={{
                        fontSize: `${optFontSizeVal}px`,
                        fontFamily: optFontFamily,
                        color: optColor,
                        backgroundColor: optBg || undefined,
                      }}
                    >
                      {/* Checkbox / Marker */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleOptionCorrect(question.id, opt.id);
                        }}
                        className={`shrink-0 cursor-pointer ${
                          isSelected ? 'hover:opacity-80 hover:scale-105 transition-transform' : ''
                        }`}
                        title={
                          isSelected
                            ? opt.isCorrect
                              ? 'Réponse correcte (Cliquer pour décocher)'
                              : 'Cliquer pour marquer comme réponse correcte'
                            : undefined
                        }
                      >
                        {renderOptionMarker(opt, optIdx, isAnswerChecked)}
                      </div>

                      {/* Prefix (e.g. "A)", "a.", "1)") */}
                      {prefixText && (
                        <span className="font-bold text-slate-700 shrink-0 select-none">
                          {prefixText}
                        </span>
                      )}

                      {/* Option Text with Inline Math & Bidi Protection */}
                      {isOptionEditing ? (
                        <div
                          className="flex-1 flex flex-col gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            ref={activeInputRef as any}
                            type="text"
                            autoFocus
                            dir={effectiveDirection}
                            value={opt.text}
                            onChange={(e) =>
                              handleUpdateOption(question.id, opt.id, e.target.value)
                            }
                            onBlur={() => setEditingOptionId(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setEditingOptionId(null);
                            }}
                            className="w-full px-2 py-0.5 bg-white border border-indigo-500 rounded text-slate-800 outline-none"
                            style={{ fontSize: `${optFontSizeVal}px` }}
                          />
                        </div>
                      ) : (
                        <span
                          onDoubleClick={() => !readOnly && isSelected && setEditingOptionId(opt.id)}
                          className="flex-1 font-medium cursor-text select-text truncate"
                          title={isSelected ? 'Double-cliquez pour modifier l’option' : undefined}
                        >
                          <InlineMathText
                            text={opt.text}
                            onEquationClick={(formula) =>
                              handleOpenMathModalForExisting('option', question.id, formula, opt.id)
                            }
                          />
                        </span>
                      )}

                      {/* Quick Equation edit button on option hover when selected */}
                      {isSelected && !readOnly && !isOptionEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const optLetter = isRtl
                              ? ARABIC_LETTERS[optIdx % ARABIC_LETTERS.length]
                              : LATIN_UPPER[optIdx % LATIN_UPPER.length];
                            setMathModalTarget({
                              type: 'option',
                              qId: question.id,
                              optId: opt.id,
                              label: isRtl ? `مقترح (${optLetter})` : `Option (${optLetter})`,
                            });
                            setMathModalFormula(opt.text.trim());
                            setIsMathModalOpen(true);
                          }}
                          title="Modifier ou insérer une équation (∑)"
                          className="opacity-0 group-hover/opt:opacity-100 p-1 text-indigo-500 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-opacity cursor-pointer shrink-0"
                        >
                          <Sigma className="w-3 h-3" />
                        </button>
                      )}

                      {/* Quick Deletion of Option (hover action - Axe 4) */}
                      {isSelected && !readOnly && question.options.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOption(question.id, opt.id);
                          }}
                          title="Supprimer cette option"
                          className="opacity-0 group-hover/opt:opacity-100 p-0.5 text-slate-300 hover:text-red-500 rounded transition-opacity cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Option button */}
              {isSelected && !readOnly && question.options.length < 6 && (
                <div className={`mt-1.5 flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddOption(question.id);
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isRtl ? '+ إضافة مقترح' : '+ Ajouter une option'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Question Button */}
      {isSelected && !readOnly && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-3 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between"
        >
          <button
            type="button"
            onClick={handleAddQuestion}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRtl ? 'إضافة سؤال جديد (QCM)' : 'Ajouter une question (QCM)'}</span>
          </button>

          <span className="text-[11px] text-slate-400 font-medium">
            {questions.length} {questions.length > 1 ? 'questions' : 'question'} • {optionColumns} colonnes
          </span>
        </div>
      )}

      {/* Professional Math Editor Modal */}
      <ProfessionalMathEditorModal
        isOpen={isMathModalOpen}
        initialFormula={mathModalFormula}
        targetLabel={mathModalTarget?.label}
        onClose={() => {
          setIsMathModalOpen(false);
          setMathModalTarget(null);
        }}
        onSave={handleSaveFormulaFromModal}
        isArabicDoc={isRtl}
      />
    </div>
  );
};
