import React from 'react';
import { Sigma, Plus, Sparkles } from 'lucide-react';

interface InlineMathToolbarProps {
  onInsertSymbol: (symbol: string) => void;
  onOpenEquationEditor?: () => void;
  className?: string;
  showBlankShortcuts?: boolean;
}

const MATH_SHORTCUTS = [
  // Fractions & Roots
  { label: 'a/b', insert: '\\frac{a}{b}', title: 'Fraction' },
  { label: '√x', insert: '\\sqrt{x}', title: 'Racine carrée' },
  { label: '³√x', insert: '\\sqrt[3]{x}', title: 'Racine cubique' },
  // Powers & Indices
  { label: 'x²', insert: '²', title: 'Carré' },
  { label: 'x³', insert: '³', title: 'Cube' },
  { label: 'x⁴', insert: '⁴', title: 'Puissance 4' },
  { label: 'xⁿ', insert: '^{n}', title: 'Puissance n' },
  { label: '10ⁿ', insert: '10^{n}', title: 'Puissance de 10' },
  { label: 'uₙ', insert: 'u_{n}', title: 'Indice n' },
  // Coordinates & Vectors
  { label: 'A(x;y)', insert: 'A(100 ; 300)', title: 'Coordonnées de point' },
  { label: 'v⃗', insert: '\\vec{u}', title: 'Vecteur' },
  { label: '|x|', insert: '|x|', title: 'Valeur absolue' },
  // Operators & Relations
  { label: '=', insert: ' = ', title: 'Égal' },
  { label: '≠', insert: ' ≠ ', title: 'Différent' },
  { label: '≤', insert: ' ≤ ', title: 'Inférieur ou égal' },
  { label: '≥', insert: ' ≥ ', title: 'Supérieur ou égal' },
  { label: '≈', insert: ' ≈ ', title: 'Approximativement' },
  { label: '±', insert: '±', title: 'Plus ou moins' },
  { label: '×', insert: ' × ', title: 'Multiplié par' },
  { label: '÷', insert: ' ÷ ', title: 'Divisé par' },
  // Sets & Symbols
  { label: '∈', insert: ' ∈ ', title: 'Appartient à' },
  { label: '∉', insert: ' ∉ ', title: 'N’appartient pas à' },
  { label: '⊂', insert: ' ⊂ ', title: 'Inclus dans' },
  { label: 'π', insert: 'π', title: 'Pi' },
  { label: '∞', insert: '∞', title: 'Infini' },
  { label: 'α', insert: 'α', title: 'Alpha' },
  { label: 'β', insert: 'β', title: 'Beta' },
  { label: 'Δ', insert: 'Δ', title: 'Delta' },
  // Units
  { label: 'DT', insert: ' DT', title: 'Dinar Tunisien' },
  { label: '%', insert: ' %', title: 'Pourcentage' },
  { label: '°', insert: '°', title: 'Degré' },
];

const BLANK_SHORTCUTS = [
  { label: '— court', insert: ' ___ ' },
  { label: '—— moyen', insert: ' ______ ' },
  { label: '——— long', insert: ' _________ ' },
];

export const InlineMathToolbar: React.FC<InlineMathToolbarProps> = ({
  onInsertSymbol,
  onOpenEquationEditor,
  className = '',
  showBlankShortcuts = false,
}) => {
  return (
    <div
      dir="ltr"
      onMouseDown={(e) => e.preventDefault()} // prevent blur on target input/textarea
      className={`flex items-center flex-wrap gap-1 p-1 bg-slate-900/95 text-white rounded-xl shadow-xl text-xs z-50 select-none border border-slate-700/80 backdrop-blur-md ${className}`}
    >
      {/* Full Equation Editor Trigger (∑) */}
      {onOpenEquationEditor && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenEquationEditor();
          }}
          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-indigo-400/40 mr-1"
          title="Ouvrir l'éditeur complet de formules mathématiques"
        >
          <Sigma className="w-3.5 h-3.5 text-indigo-200" />
          <span>Éditeur ∑</span>
        </button>
      )}

      <span className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">
        Symboles :
      </span>

      {MATH_SHORTCUTS.map((item) => (
        <button
          key={item.label}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onInsertSymbol(item.insert);
          }}
          className="px-1.5 py-0.5 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium text-[11px] transition-colors cursor-pointer border border-slate-700/50"
          title={item.title || `Insérer ${item.label}`}
        >
          {item.label}
        </button>
      ))}

      {showBlankShortcuts && (
        <>
          <span className="text-[10px] font-bold text-amber-300 px-1 ml-1 border-l border-slate-700 uppercase tracking-wider">
            Ligne à compléter :
          </span>
          {BLANK_SHORTCUTS.map((item) => (
            <button
              key={item.label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onInsertSymbol(item.insert);
              }}
              className="px-1.5 py-0.5 rounded-md bg-slate-800 hover:bg-amber-600 text-amber-200 hover:text-white font-medium text-[11px] transition-colors cursor-pointer border border-slate-700/50"
              title={`Insérer une zone soulignée ${item.label}`}
            >
              {item.label}
            </button>
          ))}
        </>
      )}
    </div>
  );
};
