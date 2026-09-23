import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  WorksheetBlock,
  DocumentLanguage,
} from '../../../types/worksheet';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Sigma,
  Palette,
  Highlighter,
  ChevronDown,
  Check,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  ArrowLeftRight,
  GripVertical,
} from 'lucide-react';
import { InlineMathText } from './InlineMathText';
import { MathSymbolLibraryModal } from './MathSymbolLibraryModal';
import { WysiwygMathDocumentEditor } from './WysiwygMathDocumentEditor';

interface AdvancedTextParagraphBlockProps {
  block: WorksheetBlock;
  isSelected: boolean;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
  onUpdateHeight?: (height: number) => void;
  effectiveLang: DocumentLanguage;
  isRtl: boolean;
  readOnly?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onStartDrag?: (e: React.MouseEvent) => void;
}

const FONT_OPTIONS = [
  { label: 'Standard (Outfit)', value: 'Outfit, sans-serif' },
  { label: 'Arabe moderne (Cairo)', value: 'Cairo, sans-serif' },
  { label: 'Arabe scolaire (Tajawal)', value: 'Tajawal, sans-serif' },
  { label: 'Traditionnel (Amiri)', value: 'Amiri, serif' },
  { label: 'Cursive / Enfant (Mali)', value: 'Mali, cursive' },
  { label: 'Manuscrite (Comic Neue)', value: 'Comic Neue, cursive' },
  { label: 'Littéraire (Georgia)', value: 'Georgia, serif' },
  { label: 'Code / Machine (Courier)', value: 'Courier New, monospace' },
];

const FONT_SIZES = [11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32];

const COLOR_SWATCHES = [
  { label: 'Noir', value: '#0f172a' },
  { label: 'Gris ardoise', value: '#334155' },
  { label: 'Bleu indigo', value: '#4338ca' },
  { label: 'Bleu ciel', value: '#0284c7' },
  { label: 'Vert émeraude', value: '#059669' },
  { label: 'Rouge carmin', value: '#dc2626' },
  { label: 'Ambre / Orange', value: '#d97706' },
  { label: 'Violet', value: '#7c3aed' },
];

const HIGHLIGHT_SWATCHES = [
  { label: 'Aucun', value: 'transparent' },
  { label: 'Jaune fluo', value: '#fef08a' },
  { label: 'Vert pastel', value: '#bbf7d0' },
  { label: 'Bleu pastel', value: '#bae6fd' },
  { label: 'Rose pastel', value: '#fbcfe8' },
  { label: 'Orange pastel', value: '#fed7aa' },
];

export const AdvancedTextParagraphBlock: React.FC<AdvancedTextParagraphBlockProps> = ({
  block,
  isSelected,
  isEditing,
  onStartEditing,
  onStopEditing,
  onUpdateContent,
  onUpdateStyles,
  onUpdateHeight,
  effectiveLang,
  isRtl,
  readOnly = false,
  onDuplicate,
  onDelete,
  onStartDrag,
}) => {
  const [isMathModalOpen, setIsMathModalOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedCursorPosRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const s = block.styles;
  const currentText = block.content.text || '';
  const effectiveDirection = s.textDirection || (isRtl ? 'rtl' : 'ltr');
  const textAlign = s.textAlign || (effectiveDirection === 'rtl' ? 'right' : 'left');

  // History stack for Undo/Redo inside text block
  const [history, setHistory] = useState<string[]>([currentText]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const recordHistory = (newText: string) => {
    const next = history.slice(0, historyIndex + 1);
    next.push(newText);
    setHistory(next);
    setHistoryIndex(next.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onUpdateContent({ text: prev });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onUpdateContent({ text: next });
    }
  };

  // Auto-focus textarea when block enters edit mode or is selected
  useEffect(() => {
    if (isEditing && isSelected && textareaRef.current) {
      // If the textarea is not already the active element, focus it
      if (document.activeElement !== textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [isEditing, isSelected]);

  // Adjust textarea height and measure container height for automatic vertical growth
  const adjustTextareaHeight = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    const nextH = Math.max(50, textareaRef.current.scrollHeight);
    textareaRef.current.style.height = `${nextH}px`;
  };

  useLayoutEffect(() => {
    adjustTextareaHeight();
  }, [currentText, isEditing, s.fontSize, s.fontFamily, s.lineHeight]);

  // Dynamic layout measurement to notify canvas of total block height
  useLayoutEffect(() => {
    if (!containerRef.current || !onUpdateHeight) return;

    const measureAndResize = () => {
      if (!containerRef.current) return;
      const scrollH = containerRef.current.scrollHeight;
      const offsetH = containerRef.current.offsetHeight;
      const targetHeight = Math.max(50, Math.max(scrollH, offsetH));

      if (Math.abs(targetHeight - block.height) > 4) {
        onUpdateHeight(targetHeight);
      }
    };

    measureAndResize();

    const resizeObserver = new ResizeObserver(() => {
      measureAndResize();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [currentText, isEditing, s.fontSize, s.lineHeight, block.height, onUpdateHeight]);

  // Open math modal
  const handleOpenMathModal = () => {
    setIsMathModalOpen(true);
  };

  const insertMathHandlerRef = useRef<((formula: string) => void) | null>(null);

  // Insert formula from math modal directly into WYSIWYG editor
  const handleInsertMath = (latexOrMath: string) => {
    if (insertMathHandlerRef.current) {
      insertMathHandlerRef.current(latexOrMath);
      return;
    }

    const cleanFormula = latexOrMath.startsWith('$') ? latexOrMath : `$${latexOrMath}$`;
    const newText = currentText ? `${currentText}\n${cleanFormula}` : cleanFormula;
    onUpdateContent({ text: newText });
    recordHistory(newText);
  };

  // Toggle list format (bullets or numbering)
  const toggleList = (type: 'bullet' | 'number') => {
    const lines = currentText.split('\n');
    let updatedLines: string[] = [];

    if (type === 'bullet') {
      const allBulleted = lines.every((l) => l.trim().startsWith('• ') || l.trim() === '');
      updatedLines = lines.map((l) => {
        if (!l.trim()) return l;
        return allBulleted ? l.replace(/^•\s*/, '') : `• ${l.replace(/^(?:•|\d+\.)\s*/, '')}`;
      });
      onUpdateStyles({ isBulletList: !allBulleted, isNumberedList: false });
    } else {
      const allNumbered = lines.every((l) => /^\d+\.\s*/.test(l.trim()) || l.trim() === '');
      let num = 1;
      updatedLines = lines.map((l) => {
        if (!l.trim()) return l;
        return allNumbered
          ? l.replace(/^\d+\.\s*/, '')
          : `${num++}. ${l.replace(/^(?:•|\d+\.)\s*/, '')}`;
      });
      onUpdateStyles({ isNumberedList: !allNumbered, isBulletList: false });
    }

    const nextText = updatedLines.join('\n');
    onUpdateContent({ text: nextText });
    recordHistory(nextText);
  };

  // Font size adjustment
  const handleFontSizeDelta = (delta: number) => {
    const curSize = s.fontSize || 15;
    const nextSize = Math.max(10, Math.min(48, curSize + delta));
    onUpdateStyles({ fontSize: nextSize });
  };

  return (
    <div
      ref={containerRef}
      className={`w-full relative transition-all rounded-xl ${
        isEditing && isSelected
          ? 'bg-white shadow-xl ring-2 ring-indigo-600 border border-indigo-200'
          : 'hover:bg-indigo-50/20'
      }`}
      onClick={(e) => {
        if (!readOnly && (!isSelected || !isEditing)) {
          onStartEditing();
        }
      }}
    >
      {/* 1. DOCKED HEADER TOOLBAR (Canva + Word style, Zero Overlap, Clear Separation) */}
      {!readOnly && isSelected && isEditing && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full bg-slate-900 text-white px-2.5 py-1.5 rounded-t-xl flex flex-wrap items-center justify-between gap-1.5 select-none border-b border-slate-700/80 shadow-md z-40 text-xs"
        >
          {/* Left Group: Drag Handle, Undo/Redo, Typography, Colors */}
          <div className="flex flex-wrap items-center gap-1">
            {/* Move handle so teacher can drag the block effortlessly */}
            {onStartDrag && (
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onStartDrag(e);
                }}
                className="flex items-center gap-0.5 px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-move transition-colors mr-0.5"
                title={isRtl ? 'تحريك العنصر' : 'Déplacer le bloc'}
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Undo / Redo */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Annuler (Ctrl+Z)"
              className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Rétablir (Ctrl+Y)"
              className="p-1 rounded text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            {/* Font Family Dropdown */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowFontPicker(!showFontPicker)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer border border-slate-700"
              >
                <span className="truncate max-w-[90px]">
                  {FONT_OPTIONS.find((f) => f.value === s.fontFamily)?.label.split(' ')[0] || 'Police'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {showFontPicker && (
                <div className="absolute top-8 left-0 py-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-48 z-50">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onUpdateStyles({ fontFamily: f.value });
                        setShowFontPicker(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer"
                      style={{ fontFamily: f.value }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Delta & Direct Picker */}
            <div className="flex items-center bg-slate-800 rounded border border-slate-700">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleFontSizeDelta(-1)}
                title="Diminuer la taille"
                className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded-l cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowSizePicker(!showSizePicker)}
                  className="px-1.5 py-0.5 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
                >
                  {s.fontSize || 15}
                </button>
                {showSizePicker && (
                  <div className="absolute top-8 left-0 py-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-16 z-50 max-h-40 overflow-y-auto">
                    {FONT_SIZES.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          onUpdateStyles({ fontSize: sz });
                          setShowSizePicker(false);
                        }}
                        className="w-full text-center py-1 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white cursor-pointer"
                      >
                        {sz}px
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleFontSizeDelta(1)}
                title="Agrandir la taille"
                className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded-r cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                onUpdateStyles({
                  fontWeight: s.fontWeight === 'bold' ? 'normal' : 'bold',
                })
              }
              title="Gras (Ctrl+B)"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                s.fontWeight === 'bold' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                onUpdateStyles({
                  fontStyle: s.fontStyle === 'italic' ? 'normal' : 'italic',
                })
              }
              title="Italique (Ctrl+I)"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                s.fontStyle === 'italic' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            {/* Underline */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                onUpdateStyles({
                  textDecoration: s.textDecoration === 'underline' ? 'none' : 'underline',
                })
              }
              title="Souligné (Ctrl+U)"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                s.textDecoration === 'underline' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            {/* Text Color Swatches */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Couleur du texte"
                className="p-1.5 rounded text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span
                  className="w-2.5 h-2.5 rounded-full border border-slate-600"
                  style={{ backgroundColor: s.color || '#0f172a' }}
                />
              </button>
              {showColorPicker && (
                <div className="absolute top-8 left-0 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-wrap gap-1.5 w-36 z-50">
                  {COLOR_SWATCHES.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onUpdateStyles({ color: col.value });
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded-md border border-slate-600 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: col.value }}
                      title={col.label}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Highlighter Swatches */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                title="Surlignage"
                className={`p-1.5 rounded transition-colors flex items-center cursor-pointer ${
                  s.highlightColor && s.highlightColor !== 'transparent'
                    ? 'bg-amber-400 text-slate-900'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              {showHighlightPicker && (
                <div className="absolute top-8 left-0 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-wrap gap-1.5 w-36 z-50">
                  {HIGHLIGHT_SWATCHES.map((hl) => (
                    <button
                      key={hl.value}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onUpdateStyles({ highlightColor: hl.value });
                        setShowHighlightPicker(false);
                      }}
                      className="w-6 h-6 rounded-md border border-slate-600 hover:scale-110 transition-transform flex items-center justify-center text-[10px] text-slate-900 cursor-pointer"
                      style={{ backgroundColor: hl.value === 'transparent' ? '#ffffff' : hl.value }}
                      title={hl.label}
                    >
                      {hl.value === 'transparent' ? '✕' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-slate-700 mx-0.5" />

            {/* Alignment */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onUpdateStyles({ textAlign: 'left' })}
              title="Aligner à gauche"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                textAlign === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onUpdateStyles({ textAlign: 'center' })}
              title="Centrer"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                textAlign === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onUpdateStyles({ textAlign: 'right' })}
              title="Aligner à droite"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                textAlign === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>

            {/* List Toggles */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleList('bullet')}
              title="Liste à puces"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                s.isBulletList ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleList('number')}
              title="Liste numérotée"
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                s.isNumberedList ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>

            {/* RTL / LTR Toggle */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                onUpdateStyles({
                  textDirection: effectiveDirection === 'rtl' ? 'ltr' : 'rtl',
                  textAlign: effectiveDirection === 'rtl' ? 'left' : 'right',
                })
              }
              title={`Orientation : ${effectiveDirection === 'rtl' ? 'RTL (Arabe)' : 'LTR (Français)'}`}
              className="flex items-center gap-1 px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[11px] cursor-pointer border border-slate-700"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>{effectiveDirection.toUpperCase()}</span>
            </button>
          </div>

          {/* Right Group: Math Equation Insertion */}
          <div className="flex items-center gap-1.5">
            {/* PRIORITY WORD/CANVA BUTTON: Math Equation & Structure Insertion */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleOpenMathModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-900/30 transition-all cursor-pointer border border-emerald-400/40"
              title="Ouvrir la bibliothèque de fractions, matrices, racines et symboles"
            >
              <Sigma className="w-4 h-4 text-emerald-100" />
              <span>{isRtl ? '∑ رياضيات' : '∑ Mathématiques'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ZONE DE RÉDACTION WYSIWYG DIRECTE (Microsoft Word style, formules et texte intégrés) */}
      {isSelected && isEditing ? (
        <div
          dir={effectiveDirection}
          className="w-full p-2 bg-white rounded-b-xl flex flex-col justify-start"
          style={{
            backgroundColor: s.highlightColor && s.highlightColor !== 'transparent' ? s.highlightColor : (s.backgroundColor || '#ffffff'),
          }}
          onMouseDown={(e) => {
            // Ensure clicking or selecting inside does NOT bubble to block drag
            e.stopPropagation();
          }}
        >
          <WysiwygMathDocumentEditor
            text={currentText}
            onChange={(newText) => {
              onUpdateContent({ text: newText });
              recordHistory(newText);
            }}
            styles={s}
            isArabic={isRtl}
            onRegisterInsertHandler={(handler) => {
              insertMathHandlerRef.current = handler;
            }}
            onOpenMathModal={handleOpenMathModal}
          />
        </div>
      ) : (
        /* 3. WYSIWYG PRINT-READY VECTOR RENDER (When not editing: KaTeX / SVG crisp typography) */
        <div
          dir={effectiveDirection}
          onClick={() => {
            if (!readOnly) {
              onStartEditing();
            }
          }}
          className="w-full p-3 select-none leading-relaxed transition-all cursor-text rounded-xl"
          style={{
            fontFamily: s.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif'),
            fontSize: `${s.fontSize || 15}px`,
            fontWeight: s.fontWeight || 'normal',
            fontStyle: s.fontStyle || 'normal',
            textDecoration: s.textDecoration || 'none',
            textAlign,
            color: currentText ? (s.color || '#0f172a') : '#94a3b8',
            backgroundColor: s.highlightColor && s.highlightColor !== 'transparent' ? s.highlightColor : (s.backgroundColor || 'transparent'),
            lineHeight: s.lineHeight || 1.6,
            minHeight: '40px',
          }}
          title={isRtl ? 'انقر للتحرير' : 'Cliquez pour modifier'}
        >
          {currentText ? (
            <InlineMathText text={currentText} />
          ) : (
            <span className="italic text-slate-400">
              {isRtl
                ? 'انقر هنا للبدء في كتابة نص التمرين...'
                : 'Cliquez ici pour rédiger le texte ou le problème...'}
            </span>
          )}
        </div>
      )}

      {/* Math Symbols & Equation Templates Modal */}
      <MathSymbolLibraryModal
        isOpen={isMathModalOpen}
        onClose={() => setIsMathModalOpen(false)}
        onInsert={handleInsertMath}
        isArabic={isRtl}
      />
    </div>
  );
};
