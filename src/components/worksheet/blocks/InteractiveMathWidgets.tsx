import React, { useRef, useEffect } from 'react';
import {
  MathItem,
  FractionItem,
  MatrixItem,
  CasesItem,
  SqrtItem,
  PowerSubItem,
  IntegralItem,
  SumItem,
  LimitItem,
  VectorItem,
  GeneralMathItem,
  serializeMathItem,
} from '../../../utils/visualMathParser';
import { Plus, Minus, Trash2, ChevronRight, Sigma } from 'lucide-react';
import { InlineMathText } from './InlineMathText';

interface InteractiveMathWidgetProps {
  item: MathItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (updated: MathItem) => void;
  onDelete?: () => void;
  isArabic?: boolean;
}

export const InteractiveMathWidget: React.FC<InteractiveMathWidgetProps> = ({
  item,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  isArabic = false,
}) => {
  switch (item.type) {
    case 'fraction':
      return (
        <InteractiveFraction
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'matrix':
      return (
        <InteractiveMatrix
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'cases':
      return (
        <InteractiveCases
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'sqrt':
      return (
        <InteractiveSqrt
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'power_sub':
      return (
        <InteractivePowerSub
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'integral':
      return (
        <InteractiveIntegral
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'sum':
      return (
        <InteractiveSum
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'limit':
      return (
        <InteractiveLimit
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'vector':
      return (
        <InteractiveVector
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case 'general':
      return (
        <InteractiveGeneral
          item={item}
          isSelected={isSelected}
          onSelect={onSelect}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    default:
      return null;
  }
};

/**
 * Visual Fraction Widget:
 * Numerator box over Denominator box with clean horizontal fraction line.
 * Tab navigates from numerator to denominator.
 */
const InteractiveFraction: React.FC<{
  item: FractionItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: FractionItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  const numRef = useRef<HTMLInputElement>(null);
  const denRef = useRef<HTMLInputElement>(null);

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1 p-1 rounded-lg transition-all group/frac ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      {/* Optional Prefix (e.g. "A =") */}
      {item.prefix && (
        <span className="font-serif font-medium text-slate-700 mr-1.5 select-none">
          {item.prefix}
        </span>
      )}

      {/* The Fraction Stack */}
      <span className="inline-flex flex-col items-center justify-center">
        {/* Numerator input */}
        <input
          ref={numRef}
          type="text"
          value={item.numerator}
          onChange={(e) => onChange({ ...item, numerator: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
              e.preventDefault();
              denRef.current?.focus();
            }
          }}
          placeholder="a"
          style={{ width: `${Math.max(26, (item.numerator.length || 1) * 9 + 14)}px` }}
          className="text-center font-serif text-xs font-semibold px-1 py-0.5 rounded bg-indigo-50/60 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-300 outline-none transition-all text-slate-800"
          title="Numérateur (Haut)"
        />

        {/* Fraction division bar */}
        <span className="w-full h-[1.5px] bg-slate-800 my-0.5" />

        {/* Denominator input */}
        <input
          ref={denRef}
          type="text"
          value={item.denominator}
          onChange={(e) => onChange({ ...item, denominator: e.target.value })}
          placeholder="b"
          style={{ width: `${Math.max(26, (item.denominator.length || 1) * 9 + 14)}px` }}
          className="text-center font-serif text-xs font-semibold px-1 py-0.5 rounded bg-indigo-50/60 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-300 outline-none transition-all text-slate-800"
          title="Dénominateur (Bas)"
        />
      </span>

      {/* Optional Suffix */}
      {item.suffix && (
        <span className="font-serif font-medium text-slate-700 ml-1.5 select-none">
          {item.suffix}
        </span>
      )}

      {/* Delete button on hover */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/frac:opacity-100 ml-1 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
          title="Supprimer la fraction"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual Matrix Widget:
 * Displays parentheses ( ) or brackets [ ] or determinant bars | |
 * with an interactive grid of editable cells.
 * Features: Tab navigation between cells, Add/Remove row & column buttons, Bracket style toggle.
 */
const InteractiveMatrix: React.FC<{
  item: MatrixItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: MatrixItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  const rows = item.rows.length > 0 ? item.rows : [['', ''], ['', '']];
  const numRows = rows.length;
  const numCols = rows[0]?.length || 2;

  // Add row
  const addRow = () => {
    const newRow = Array(numCols).fill('');
    onChange({ ...item, rows: [...rows, newRow] });
  };

  // Remove row
  const removeRow = () => {
    if (numRows <= 1) return;
    onChange({ ...item, rows: rows.slice(0, -1) });
  };

  // Add column
  const addCol = () => {
    const updated = rows.map((r) => [...r, '']);
    onChange({ ...item, rows: updated });
  };

  // Remove column
  const removeCol = () => {
    if (numCols <= 1) return;
    const updated = rows.map((r) => r.slice(0, -1));
    onChange({ ...item, rows: updated });
  };

  // Toggle matrix bracket type: ( ) -> [ ] -> | |
  const toggleMatrixType = () => {
    const nextType =
      item.matrixType === 'pmatrix'
        ? 'bmatrix'
        : item.matrixType === 'bmatrix'
        ? 'vmatrix'
        : 'pmatrix';
    onChange({ ...item, matrixType: nextType });
  };

  const isDet = item.matrixType === 'vmatrix';
  const isBrak = item.matrixType === 'bmatrix';

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex flex-col items-center align-middle mx-1.5 p-1.5 rounded-xl transition-all group/matrix ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-md'
          : 'hover:bg-slate-50 border border-indigo-200/80 bg-white shadow-2xs'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      {/* Matrix Controls Header (Word style) */}
      <span className="flex items-center gap-1 mb-1 text-[10px] text-slate-500 font-bold select-none w-full justify-between px-1">
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMatrixType();
            }}
            className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-indigo-100 text-indigo-700 font-mono transition-colors cursor-pointer"
            title="Changer le style de parenthèses : ( ) / [ ] / | |"
          >
            {isDet ? '| Déterminant |' : isBrak ? '[ Crochets ]' : '( Parenthèses )'}
          </button>
          <span className="text-slate-400 font-normal">
            {numRows}×{numCols}
          </span>
        </span>

        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addRow();
            }}
            className="px-1 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors cursor-pointer"
            title="Ajouter une ligne (+)"
          >
            +L
          </button>
          {numRows > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeRow();
              }}
              className="px-1 py-0.5 rounded bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 transition-colors cursor-pointer"
              title="Supprimer la dernière ligne (-)"
            >
              -L
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addCol();
            }}
            className="px-1 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors cursor-pointer"
            title="Ajouter une colonne (+)"
          >
            +C
          </button>
          {numCols > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeCol();
              }}
              className="px-1 py-0.5 rounded bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 transition-colors cursor-pointer"
              title="Supprimer la dernière colonne (-)"
            >
              -C
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors cursor-pointer ml-1"
              title="Supprimer la matrice"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </span>
      </span>

      {/* The Matrix Body with Visual Brackets */}
      <span className="flex items-center gap-1">
        {item.prefix && (
          <span className="font-serif font-bold text-slate-700 mr-1 select-none">
            {item.prefix}
          </span>
        )}

        {/* Left bracket / parenthesis / bar */}
        <span
          className={`text-2xl font-light select-none ${
            isDet
              ? 'border-l-2 border-slate-700 h-full min-h-[36px] w-1'
              : isBrak
              ? 'text-slate-700 font-mono text-xl'
              : 'text-slate-600 font-sans'
          }`}
        >
          {isDet ? '' : isBrak ? '[' : '('}
        </span>

        {/* The Grid of Cell Inputs */}
        <span className="inline-grid gap-1 px-1">
          {rows.map((row, rIdx) => (
            <span key={`r_${rIdx}`} className="flex items-center gap-1">
              {row.map((cell, cIdx) => (
                <input
                  key={`c_${rIdx}_${cIdx}`}
                  type="text"
                  value={cell}
                  onChange={(e) => {
                    const newRows = rows.map((r, ri) =>
                      ri === rIdx
                        ? r.map((c, ci) => (ci === cIdx ? e.target.value : c))
                        : r
                    );
                    onChange({ ...item, rows: newRows });
                  }}
                  placeholder="0"
                  style={{ width: `${Math.max(28, (cell.length || 1) * 9 + 12)}px` }}
                  className="text-center font-serif text-xs font-semibold px-1 py-1 rounded bg-indigo-50/50 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-300 outline-none transition-all text-slate-800"
                  title={`Cellule ligne ${rIdx + 1}, colonne ${cIdx + 1}`}
                />
              ))}
            </span>
          ))}
        </span>

        {/* Right bracket / parenthesis / bar */}
        <span
          className={`text-2xl font-light select-none ${
            isDet
              ? 'border-r-2 border-slate-700 h-full min-h-[36px] w-1'
              : isBrak
              ? 'text-slate-700 font-mono text-xl'
              : 'text-slate-600 font-sans'
          }`}
        >
          {isDet ? '' : isBrak ? ']' : ')'}
        </span>

        {item.suffix && (
          <span className="font-serif font-bold text-slate-700 ml-1 select-none">
            {item.suffix}
          </span>
        )}
      </span>
    </span>
  );
};

/**
 * Visual System of Equations Widget:
 * Curly bracket { with customizable equation lines.
 * Features: Add line button, remove line, and inline equation inputs.
 */
const InteractiveCases: React.FC<{
  item: CasesItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: CasesItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  const equations = item.equations.length > 0 ? item.equations : ['2x + y = 5', 'x - y = 1'];

  const addEquation = () => {
    onChange({ ...item, equations: [...equations, ''] });
  };

  const removeEquation = (index: number) => {
    if (equations.length <= 1) return;
    onChange({ ...item, equations: equations.filter((_, i) => i !== index) });
  };

  const updateEquation = (index: number, val: string) => {
    const next = [...equations];
    next[index] = val;
    onChange({ ...item, equations: next });
  };

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1.5 p-2 rounded-xl transition-all group/cases ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-md'
          : 'hover:bg-slate-50 border border-indigo-200/80 bg-white shadow-2xs'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      {item.prefix && (
        <span className="font-serif font-bold text-slate-700 mr-2 select-none">
          {item.prefix}
        </span>
      )}

      {/* Large Curly Bracket */}
      <span className="text-3xl font-light text-slate-800 leading-none select-none mr-1.5">
        {'{'}
      </span>

      {/* Equations Column */}
      <span className="inline-flex flex-col gap-1.5">
        {equations.map((eq, idx) => (
          <span key={`eq_${idx}`} className="flex items-center gap-1.5">
            <input
              type="text"
              value={eq}
              onChange={(e) => updateEquation(idx, e.target.value)}
              placeholder={`Équation ${idx + 1}`}
              style={{ width: `${Math.max(120, (eq.length || 8) * 8 + 24)}px` }}
              className="font-serif text-xs font-semibold px-2 py-1 rounded bg-indigo-50/50 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-300 outline-none transition-all text-slate-800"
            />
            {equations.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEquation(idx);
                }}
                className="p-1 rounded text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Supprimer cette équation"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {/* Add equation line button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addEquation();
          }}
          className="self-start text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer mt-0.5"
        >
          <Plus className="w-3 h-3" />
          <span>Ajouter une équation</span>
        </button>
      </span>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/cases:opacity-100 ml-2 p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
          title="Supprimer le système"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual Square Root / nth Root Widget
 */
const InteractiveSqrt: React.FC<{
  item: SqrtItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: SqrtItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1 p-1 rounded-lg transition-all group/sqrt ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      {item.prefix && (
        <span className="font-serif font-medium text-slate-700 mr-1 select-none">
          {item.prefix}
        </span>
      )}

      {/* Optional nth root index */}
      {item.nth !== undefined && (
        <input
          type="text"
          value={item.nth}
          onChange={(e) => onChange({ ...item, nth: e.target.value })}
          placeholder="n"
          style={{ width: `${Math.max(18, (item.nth.length || 1) * 8 + 8)}px` }}
          className="text-center font-serif text-[10px] font-bold px-0.5 py-0 rounded bg-indigo-50 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none -mr-1 z-10"
          title="Ordre de la racine (n)"
        />
      )}

      {/* Radical sign */}
      <span className="text-lg font-light text-slate-800 leading-none select-none mr-0.5">
        √
      </span>

      {/* Radicand input under top bar */}
      <span className="border-t-2 border-slate-800 pt-0.5">
        <input
          type="text"
          value={item.radicand}
          onChange={(e) => onChange({ ...item, radicand: e.target.value })}
          placeholder="x"
          style={{ width: `${Math.max(30, (item.radicand.length || 1) * 8 + 16)}px` }}
          className="text-center font-serif text-xs font-semibold px-1 py-0.5 rounded bg-indigo-50/60 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-300 outline-none transition-all text-slate-800"
          title="Expression sous le radical"
        />
      </span>

      {item.suffix && (
        <span className="font-serif font-medium text-slate-700 ml-1 select-none">
          {item.suffix}
        </span>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/sqrt:opacity-100 ml-1 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
          title="Supprimer la racine"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual Power and Subscript Widget
 */
const InteractivePowerSub: React.FC<{
  item: PowerSubItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: PowerSubItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1 p-1 rounded-lg transition-all group/pow ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      {/* Base */}
      <input
        type="text"
        value={item.base}
        onChange={(e) => onChange({ ...item, base: e.target.value })}
        placeholder="x"
        style={{ width: `${Math.max(22, (item.base.length || 1) * 8 + 12)}px` }}
        className="text-center font-serif text-xs font-semibold px-1 py-0.5 rounded bg-indigo-50/60 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 outline-none text-slate-800"
        title="Base"
      />

      <span className="inline-flex flex-col ml-0.5">
        {/* Exponent */}
        {item.exponent !== undefined && (
          <input
            type="text"
            value={item.exponent}
            onChange={(e) => onChange({ ...item, exponent: e.target.value })}
            placeholder="2"
            style={{ width: `${Math.max(18, (item.exponent.length || 1) * 7 + 10)}px` }}
            className="text-center font-serif text-[10px] font-bold px-0.5 py-0 rounded bg-indigo-50/80 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none -mb-0.5"
            title="Exposant"
          />
        )}

        {/* Subscript */}
        {item.subscript !== undefined && (
          <input
            type="text"
            value={item.subscript}
            onChange={(e) => onChange({ ...item, subscript: e.target.value })}
            placeholder="n"
            style={{ width: `${Math.max(18, (item.subscript.length || 1) * 7 + 10)}px` }}
            className="text-center font-serif text-[10px] font-bold px-0.5 py-0 rounded bg-indigo-50/80 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none -mt-0.5"
            title="Indice"
          />
        )}
      </span>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/pow:opacity-100 ml-1 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual Limit Widget
 */
const InteractiveLimit: React.FC<{
  item: LimitItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: LimitItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1 p-1 rounded-lg transition-all group/lim ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      <span className="inline-flex flex-col items-center mr-1.5">
        <span className="font-serif font-bold text-xs text-slate-800 select-none">lim</span>
        <input
          type="text"
          value={item.target}
          onChange={(e) => onChange({ ...item, target: e.target.value })}
          placeholder="x → +∞"
          style={{ width: `${Math.max(45, (item.target.length || 5) * 7 + 12)}px` }}
          className="text-center font-serif text-[10px] font-medium px-1 py-0 rounded bg-indigo-50/60 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none text-slate-700"
          title="Variable et point d'approche"
        />
      </span>

      <input
        type="text"
        value={item.expression}
        onChange={(e) => onChange({ ...item, expression: e.target.value })}
        placeholder="f(x)"
        style={{ width: `${Math.max(40, (item.expression.length || 3) * 8 + 14)}px` }}
        className="font-serif text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50/60 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 outline-none text-slate-800"
        title="Expression de la fonction"
      />

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/lim:opacity-100 ml-1 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual Integral Widget
 */
const InteractiveIntegral: React.FC<{
  item: IntegralItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: IntegralItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1 p-1 rounded-lg transition-all group/int ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      <span className="text-xl font-light text-slate-800 select-none -mr-0.5">∫</span>

      <span className="inline-flex flex-col mr-1">
        <input
          type="text"
          value={item.upper}
          onChange={(e) => onChange({ ...item, upper: e.target.value })}
          placeholder="b"
          style={{ width: `${Math.max(18, (item.upper.length || 1) * 7 + 8)}px` }}
          className="text-center font-serif text-[10px] font-bold px-0.5 py-0 rounded bg-indigo-50 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none -mb-0.5"
          title="Borne supérieure"
        />
        <input
          type="text"
          value={item.lower}
          onChange={(e) => onChange({ ...item, lower: e.target.value })}
          placeholder="a"
          style={{ width: `${Math.max(18, (item.lower.length || 1) * 7 + 8)}px` }}
          className="text-center font-serif text-[10px] font-bold px-0.5 py-0 rounded bg-indigo-50 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none -mt-0.5"
          title="Borne inférieure"
        />
      </span>

      <input
        type="text"
        value={item.expression}
        onChange={(e) => onChange({ ...item, expression: e.target.value })}
        placeholder="f(x) dx"
        style={{ width: `${Math.max(50, (item.expression.length || 5) * 8 + 14)}px` }}
        className="font-serif text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50/60 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 outline-none text-slate-800"
        title="Fonction à intégrer"
      />

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/int:opacity-100 ml-1 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual Summation Widget (∑)
 */
const InteractiveSum: React.FC<{
  item: SumItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: SumItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1 p-1 rounded-lg transition-all group/sum ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      <span className="inline-flex flex-col items-center mr-1">
        <input
          type="text"
          value={item.upper}
          onChange={(e) => onChange({ ...item, upper: e.target.value })}
          placeholder="n"
          style={{ width: `${Math.max(18, (item.upper.length || 1) * 7 + 8)}px` }}
          className="text-center font-serif text-[10px] font-bold px-0.5 py-0 rounded bg-indigo-50 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none"
          title="Indice maximal (haut)"
        />
        <span className="text-base font-bold text-slate-800 select-none">∑</span>
        <input
          type="text"
          value={item.lower}
          onChange={(e) => onChange({ ...item, lower: e.target.value })}
          placeholder="i=1"
          style={{ width: `${Math.max(26, (item.lower.length || 3) * 7 + 8)}px` }}
          className="text-center font-serif text-[10px] font-medium px-0.5 py-0 rounded bg-indigo-50 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none"
          title="Indice initial (bas)"
        />
      </span>

      <input
        type="text"
        value={item.expression}
        onChange={(e) => onChange({ ...item, expression: e.target.value })}
        placeholder="i"
        style={{ width: `${Math.max(30, (item.expression.length || 1) * 8 + 14)}px` }}
        className="font-serif text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50/60 border border-indigo-200/80 focus:bg-white focus:border-indigo-600 outline-none text-slate-800"
        title="Terme général"
      />

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/sum:opacity-100 ml-1 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual Vector Widget (→ over name)
 */
const InteractiveVector: React.FC<{
  item: VectorItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: VectorItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex flex-col items-center align-middle mx-1 p-1 rounded-lg transition-all group/vec ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      <span className="text-xs font-bold leading-none text-slate-800 select-none">→</span>
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder="u"
        style={{ width: `${Math.max(22, (item.name.length || 1) * 8 + 12)}px` }}
        className="text-center font-serif text-xs font-bold italic px-1 py-0 rounded bg-indigo-50/60 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none text-slate-800"
        title="Nom du vecteur"
      />
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/vec:opacity-100 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
        >
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
};

/**
 * Visual General Math Expression (with live rendering and direct text editing)
 */
const InteractiveGeneral: React.FC<{
  item: GeneralMathItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onChange: (item: GeneralMathItem) => void;
  onDelete?: () => void;
}> = ({ item, isSelected, onSelect, onChange, onDelete }) => {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      className={`inline-flex items-center align-middle mx-1 p-1 rounded-lg transition-all group/gen ${
        isSelected
          ? 'ring-2 ring-indigo-500 bg-indigo-50/70 shadow-xs'
          : 'hover:bg-slate-100/90 border border-indigo-200/60 bg-white/90'
      }`}
      style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
    >
      {/* Live rendered preview icon badge */}
      <span className="mr-1 text-[11px] font-serif text-indigo-700 bg-indigo-100/70 px-1 py-0.5 rounded">
        <InlineMathText text={`$${item.expression || '?'}$`} />
      </span>

      <input
        type="text"
        value={item.expression}
        onChange={(e) => onChange({ ...item, expression: e.target.value })}
        placeholder="formule..."
        style={{ width: `${Math.max(60, (item.expression.length || 6) * 8 + 16)}px` }}
        className="font-serif text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50/60 border border-indigo-200 focus:bg-white focus:border-indigo-600 outline-none text-slate-800"
        title="Formule mathématique"
      />

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover/gen:opacity-100 ml-1 p-0.5 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
