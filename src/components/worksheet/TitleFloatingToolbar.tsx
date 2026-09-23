import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, ListOrdered, ChevronDown, Check } from 'lucide-react';
import { TITLE_NUMBERING_OPTIONS, TitleNumberingType } from '../../utils/titleNumbering';

interface TitleFloatingToolbarProps {
  isBold: boolean;
  onToggleBold: () => void;
  isItalic: boolean;
  onToggleItalic: () => void;
  isUnderline: boolean;
  onToggleUnderline: () => void;
  numbering?: string;
  onChangeNumbering: (num: string) => void;
  isRtl?: boolean;
  className?: string;
}

export const TitleFloatingToolbar: React.FC<TitleFloatingToolbarProps> = ({
  isBold,
  onToggleBold,
  isItalic,
  onToggleItalic,
  isUnderline,
  onToggleUnderline,
  numbering = 'none',
  onChangeNumbering,
  isRtl = false,
  className = '',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  // Current active numbering model preview
  const currentModel =
    TITLE_NUMBERING_OPTIONS.find((opt) => {
      if (opt.id === numbering) return true;
      if (opt.id === 'paren' && (numbering === '1)' || numbering === 'numbers' || numbering === '1.')) return true;
      if (opt.id === 'letters' && (numbering === 'A)' || numbering === 'letters' || numbering === 'A.')) return true;
      if (opt.id === 'roman' && (numbering === 'I)' || numbering === 'roman' || numbering === 'I.')) return true;
      if (opt.id === 'bullet' && (numbering === '•' || numbering === 'bullet')) return true;
      if (opt.id === 'none' && (numbering === 'none' || numbering === 'Aucune' || !numbering)) return true;
      return false;
    }) || TITLE_NUMBERING_OPTIONS[4];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={`absolute -top-11 z-50 bg-slate-900 text-white rounded-xl px-1.5 py-1 flex items-center gap-1 shadow-2xl border border-slate-700/80 text-xs font-semibold select-none animate-in fade-in zoom-in-95 duration-100 ${
        isRtl ? 'right-0' : 'left-0'
      } ${className}`}
    >
      {/* 1. Gras (B) */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleBold();
        }}
        title={isRtl ? 'عريض (Gras)' : 'Gras (B)'}
        className={`w-7 h-7 rounded-lg flex items-center justify-center font-black transition-all cursor-pointer ${
          isBold
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Bold className="w-3.5 h-3.5" />
      </button>

      {/* 2. Italique (I) */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleItalic();
        }}
        title={isRtl ? 'مائل (Italique)' : 'Italique (I)'}
        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer ${
          isItalic
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Italic className="w-3.5 h-3.5" />
      </button>

      {/* 3. Souligné (U) */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleUnderline();
        }}
        title={isRtl ? 'مسطر (Souligné)' : 'Souligné (U)'}
        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer ${
          isUnderline
            ? 'bg-indigo-600 text-white shadow-xs'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        <Underline className="w-3.5 h-3.5" />
      </button>

      {/* Séparateur */}
      <div className="w-px h-4 bg-slate-700 mx-0.5" />

      {/* 4. Numérotation (5 modèles) */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
          title={isRtl ? 'اختيار نموذج الترقيم' : 'Modèle de numérotation'}
          className={`px-2 py-1 h-7 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
            currentModel.id !== 'none'
              ? 'bg-indigo-950/70 border border-indigo-500/60 text-indigo-300'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="font-mono text-[11px] font-bold">
            {isRtl ? currentModel.previewAr : currentModel.preview}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown 5 modèles */}
        {isMenuOpen && (
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`absolute top-full mt-1.5 w-60 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700/80 p-1 z-60 animate-in fade-in zoom-in-95 duration-100 ${
              isRtl ? 'right-0' : 'left-0'
            }`}
          >
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
              {isRtl ? 'نماذج الترقيم (5)' : 'Modèles de numérotation'}
            </div>

            <div className="space-y-0.5">
              {TITLE_NUMBERING_OPTIONS.map((opt) => {
                const isSelected = currentModel.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeNumbering(opt.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-2 py-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-5 rounded bg-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-indigo-300 border border-slate-700 shrink-0">
                        {isRtl ? opt.previewAr : opt.preview}
                      </span>
                      <span className="truncate">{isRtl ? opt.labelAr : opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
