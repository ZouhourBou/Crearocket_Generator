import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sigma,
  ArrowLeftRight,
  Check,
  Palette,
} from 'lucide-react';
import { InlineMathText } from './InlineMathText';
import { WysiwygMathDocumentEditor } from './WysiwygMathDocumentEditor';
import { MathSymbolLibraryModal } from './MathSymbolLibraryModal';
import { WorksheetBlock } from '../../../types/worksheet';

export interface CoreRichTextFieldProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  isRtl?: boolean;
  readOnly?: boolean;
  isSelected?: boolean;
  singleLine?: boolean;
  className?: string;
  textClassName?: string;
  styles?: Partial<WorksheetBlock['styles']>;
  onUpdateStyles?: (styles: Partial<WorksheetBlock['styles']>) => void;
  showMiniToolbar?: boolean;
  onOpenCustomMathModal?: (existingFormula?: string) => void;
  labelBadge?: string;
}

const QUICK_MATH_SYMBOLS = ['×', '÷', '±', '≤', '≥', '≠', '≃', '√', 'π', '∞', '∈', 'ℝ'];

const COLOR_PRESETS = ['#0f172a', '#1e40af', '#047857', '#b91c1c', '#7c3aed', '#d97706'];

/**
 * Couche 1 — Core Editor Universel Réutilisable
 * Utilisé pour : consigne, énoncé, question, réponse, option QCM,
 * affirmation Vrai/Faux, paragraphe, cellule de tableau, corrigé, explication.
 * Garantit l'isolation LTR des expressions mathématiques même dans un contexte Arabe RTL.
 */
export const CoreRichTextField: React.FC<CoreRichTextFieldProps> = ({
  value,
  onChange,
  placeholder = 'Cliquez pour saisir le texte ou une formule (∑)...',
  isRtl = false,
  readOnly = false,
  isSelected = true,
  singleLine = false,
  className = '',
  textClassName = '',
  styles: stylesProp = {},
  onUpdateStyles,
  showMiniToolbar = true,
  onOpenCustomMathModal,
  labelBadge,
}) => {
  const styles: Partial<WorksheetBlock['styles']> = stylesProp;
  const [isEditing, setIsEditing] = useState(false);
  const [isMathLibraryOpen, setIsMathLibraryOpen] = useState(false);
  const [showColors, setShowColors] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const insertMathHandlerRef = useRef<((formula: string) => void) | null>(null);

  const effectiveDirection: 'rtl' | 'ltr' =
    styles.textDirection === 'rtl' || styles.textDirection === 'ltr'
      ? styles.textDirection
      : isRtl
      ? 'rtl'
      : 'ltr';

  const effectiveAlign =
    styles.textAlign || (effectiveDirection === 'rtl' ? 'right' : 'left');

  // Close editing when block loses selection
  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false);
      setShowColors(false);
    }
  }, [isSelected, isEditing]);

  // Close editing when clicking outside this field
  useEffect(() => {
    if (!isEditing) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (isMathLibraryOpen) return;
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsEditing(false);
        setShowColors(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, isMathLibraryOpen]);

  const handleInsertFormula = (latexOrSymbol: string) => {
    if (insertMathHandlerRef.current) {
      insertMathHandlerRef.current(latexOrSymbol);
      return;
    }
    const formatted = latexOrSymbol.startsWith('$') ? latexOrSymbol : `$${latexOrSymbol}$`;
    onChange(value ? `${value} ${formatted}` : formatted);
  };

  const handleInsertQuickSymbol = (sym: string) => {
    if (insertMathHandlerRef.current) {
      insertMathHandlerRef.current(sym);
      return;
    }
    onChange(value ? `${value}${sym}` : sym);
  };

  const defaultFont =
    styles.fontFamily || (effectiveDirection === 'rtl' ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  return (
    <div
      ref={wrapperRef}
      dir={effectiveDirection}
      className={`relative group/core-editor transition-all ${className}`}
      onClick={(e) => {
        if (readOnly) return;
        if (!isEditing && isSelected) {
          e.stopPropagation();
          setIsEditing(true);
        }
      }}
      onDoubleClick={(e) => {
        if (readOnly) return;
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {/* Contextual Mini Toolbar when actively editing this field */}
      {!readOnly && isEditing && showMiniToolbar && (
        <div
          dir="ltr"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="mb-1.5 px-2 py-1 bg-slate-900 text-white rounded-lg shadow-lg flex flex-wrap items-center justify-between gap-1.5 text-[11px] border border-slate-700 z-40 select-none"
        >
          <div className="flex items-center gap-1 flex-wrap">
            {labelBadge && (
              <span className="text-[10px] font-bold text-indigo-300 px-1.5 py-0.5 bg-slate-800 rounded mr-0.5">
                {labelBadge}
              </span>
            )}

            {/* Formatting controls if styles callback provided */}
            {onUpdateStyles && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateStyles({
                      fontWeight: styles.fontWeight === 'bold' ? 'normal' : 'bold',
                    })
                  }
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    styles.fontWeight === 'bold'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Gras"
                >
                  <Bold className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateStyles({
                      fontStyle: styles.fontStyle === 'italic' ? 'normal' : 'italic',
                    })
                  }
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    styles.fontStyle === 'italic'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Italique"
                >
                  <Italic className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateStyles({
                      textDecoration:
                        styles.textDecoration === 'underline' ? 'none' : 'underline',
                    })
                  }
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    styles.textDecoration === 'underline'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Souligné"
                >
                  <Underline className="w-3 h-3" />
                </button>

                {/* Color preset */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColors(!showColors)}
                    className="p-1 rounded text-slate-300 hover:bg-slate-800 flex items-center gap-0.5 cursor-pointer"
                    title="Couleur"
                  >
                    <Palette className="w-3 h-3" />
                  </button>
                  {showColors && (
                    <div className="absolute top-7 left-0 p-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex items-center gap-1 z-50">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            onUpdateStyles({ color: c });
                            setShowColors(false);
                          }}
                          className="w-4 h-4 rounded-full border border-slate-600 cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-3.5 bg-slate-700 mx-0.5" />

                <button
                  type="button"
                  onClick={() => onUpdateStyles({ textAlign: 'left' })}
                  className={`p-1 rounded cursor-pointer ${
                    effectiveAlign === 'left'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Aligner à gauche"
                >
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStyles({ textAlign: 'center' })}
                  className={`p-1 rounded cursor-pointer ${
                    effectiveAlign === 'center'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Centrer"
                >
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateStyles({ textAlign: 'right' })}
                  className={`p-1 rounded cursor-pointer ${
                    effectiveAlign === 'right'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Aligner à droite"
                >
                  <AlignRight className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateStyles({
                      textDirection: effectiveDirection === 'rtl' ? 'ltr' : 'rtl',
                      textAlign: effectiveDirection === 'rtl' ? 'left' : 'right',
                    })
                  }
                  className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                  title="Basculer Français (LTR) / Arabe (RTL)"
                >
                  <ArrowLeftRight className="w-2.5 h-2.5" />
                  <span>{effectiveDirection.toUpperCase()}</span>
                </button>

                <div className="w-px h-3.5 bg-slate-700 mx-0.5" />
              </>
            )}

            {/* Quick Math Symbols */}
            <div className="flex items-center gap-0.5">
              {QUICK_MATH_SYMBOLS.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleInsertQuickSymbol(sym)}
                  className="w-5 h-5 rounded bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-mono text-[11px] flex items-center justify-center transition-colors cursor-pointer"
                  title={`Insérer ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Full Math Equation Modal Button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenCustomMathModal) {
                  onOpenCustomMathModal();
                } else {
                  setIsMathLibraryOpen(true);
                }
              }}
              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              title="Insérer une équation ou fraction mathématique (∑)"
            >
              <Sigma className="w-3 h-3" />
              <span>Équation ∑</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 cursor-pointer"
              title="Terminer l'édition"
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Active WYSIWYG Math Document Editor vs Print-Ready Vector Display */}
      {isEditing && !readOnly ? (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full rounded-lg bg-white ring-2 ring-indigo-500/90 border border-indigo-300 shadow-xs px-1.5 py-0.5"
        >
          <WysiwygMathDocumentEditor
            text={value}
            onChange={onChange}
            styles={{
              fontFamily: defaultFont,
              fontSize: styles.fontSize || 15,
              fontWeight: styles.fontWeight || 'normal',
              fontStyle: styles.fontStyle || 'normal',
              textDecoration: styles.textDecoration || 'none',
              textAlign: effectiveAlign,
              textDirection: effectiveDirection,
              color: styles.color || '#0f172a',
              lineHeight: singleLine ? 1.35 : styles.lineHeight || 1.5,
            }}
            isArabic={effectiveDirection === 'rtl'}
            onRegisterInsertHandler={(handler) => {
              insertMathHandlerRef.current = handler;
            }}
            onOpenMathModal={() => {
              if (onOpenCustomMathModal) {
                onOpenCustomMathModal();
              } else {
                setIsMathLibraryOpen(true);
              }
            }}
          />
        </div>
      ) : (
        <div
          dir={effectiveDirection}
          className={`w-full cursor-text select-text rounded transition-colors ${
            !readOnly && isSelected ? 'hover:bg-indigo-50/40' : ''
          } ${textClassName}`}
          style={{
            fontFamily: defaultFont,
            fontSize: `${styles.fontSize || 15}px`,
            fontWeight: styles.fontWeight || 'normal',
            fontStyle: styles.fontStyle || 'normal',
            textDecoration: styles.textDecoration || 'none',
            textAlign: effectiveAlign,
            color: value ? styles.color || '#0f172a' : '#94a3b8',
            backgroundColor:
              styles.backgroundColor && styles.backgroundColor !== 'transparent'
                ? styles.backgroundColor
                : undefined,
            lineHeight: singleLine ? 1.35 : styles.lineHeight || 1.5,
            minHeight: singleLine ? '22px' : '26px',
          }}
        >
          {value ? (
            <InlineMathText
              text={value}
              onEquationClick={
                !readOnly && isSelected
                  ? (rawFormula) => {
                      if (onOpenCustomMathModal) {
                        onOpenCustomMathModal(rawFormula);
                      } else {
                        setIsEditing(true);
                      }
                    }
                  : undefined
              }
            />
          ) : (
            <span className="italic text-slate-400 select-none">{placeholder}</span>
          )}
        </div>
      )}

      {/* Universal Math Symbol & Equation Library Modal */}
      {isMathLibraryOpen && (
        <MathSymbolLibraryModal
          isOpen={isMathLibraryOpen}
          onClose={() => setIsMathLibraryOpen(false)}
          onInsert={(formula) => {
            handleInsertFormula(formula);
            setIsMathLibraryOpen(false);
          }}
          isArabic={effectiveDirection === 'rtl'}
        />
      )}
    </div>
  );
};
