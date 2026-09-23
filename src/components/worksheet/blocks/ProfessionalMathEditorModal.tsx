import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Calculator,
  Sigma,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { InlineMathText } from './InlineMathText';

export interface MathFormulaPayload {
  latex: string;
  displayMode?: 'inline' | 'block';
}

interface ProfessionalMathEditorModalProps {
  isOpen: boolean;
  initialFormula?: string;
  targetLabel?: string; // e.g. "Énoncé de la Question 1" or "Option (أ)"
  onClose: () => void;
  onSave: (formula: string) => void;
  isArabicDoc?: boolean;
}

type MathCategory =
  | 'fractions_roots'
  | 'powers_indices'
  | 'coordinates_vectors'
  | 'equations_systems'
  | 'intervals_abs'
  | 'matrices'
  | 'analysis_functions'
  | 'symbols_greek';

interface TemplateOption {
  id: string;
  label: string;
  latexExample: string;
  category: MathCategory;
  defaultFormula: string;
  fields?: { key: string; label: string; defaultValue: string; placeholder?: string }[];
  generateLatex?: (values: Record<string, string>) => string;
}

const MATH_TEMPLATES: TemplateOption[] = [
  // 1. Fractions & Roots
  {
    id: 'frac_simple',
    label: 'Fraction simple',
    category: 'fractions_roots',
    latexExample: '\\frac{a}{b}',
    defaultFormula: '\\frac{3}{4}',
    fields: [
      { key: 'num', label: 'Numérateur (haut)', defaultValue: '3' },
      { key: 'den', label: 'Dénominateur (bas)', defaultValue: '4' },
    ],
    generateLatex: (v) => `\\frac{${v.num || 'a'}}{${v.den || 'b'}}`,
  },
  {
    id: 'frac_nested',
    label: 'Fraction imbriquée',
    category: 'fractions_roots',
    latexExample: '\\frac{\\frac{a}{b}}{c}',
    defaultFormula: '\\frac{\\frac{1}{2}}{3}',
    fields: [
      { key: 'n1', label: 'Num. haut', defaultValue: '1' },
      { key: 'd1', label: 'Dén. haut', defaultValue: '2' },
      { key: 'den', label: 'Dénominateur bas', defaultValue: '3' },
    ],
    generateLatex: (v) => `\\frac{\\frac{${v.n1 || '1'}}{${v.d1 || '2'}}}{${v.den || '3'}}`,
  },
  {
    id: 'sqrt_simple',
    label: 'Racine carrée',
    category: 'fractions_roots',
    latexExample: '\\sqrt{x}',
    defaultFormula: '\\sqrt{25}',
    fields: [{ key: 'x', label: 'Expression sous la racine (Radicande)', defaultValue: '25' }],
    generateLatex: (v) => `\\sqrt{${v.x || 'x'}}`,
  },
  {
    id: 'sqrt_nth',
    label: 'Racine n-ième',
    category: 'fractions_roots',
    latexExample: '\\sqrt[n]{x}',
    defaultFormula: '\\sqrt[3]{8}',
    fields: [
      { key: 'n', label: 'Indice n', defaultValue: '3' },
      { key: 'x', label: 'Radicande x', defaultValue: '8' },
    ],
    generateLatex: (v) => `\\sqrt[${v.n || '3'}]{${v.x || 'x'}}`,
  },
  {
    id: 'sqrt_sum',
    label: 'Somme de racines',
    category: 'fractions_roots',
    latexExample: '\\sqrt{9} + \\sqrt{16}',
    defaultFormula: '\\sqrt{9} + \\sqrt{16}',
    fields: [
      { key: 'a', label: 'Première racine', defaultValue: '9' },
      { key: 'b', label: 'Deuxième racine', defaultValue: '16' },
    ],
    generateLatex: (v) => `\\sqrt{${v.a || '9'}} + \\sqrt{${v.b || '16'}}`,
  },

  // 2. Powers & Indices
  {
    id: 'power_simple',
    label: 'Puissance / Exposant',
    category: 'powers_indices',
    latexExample: 'x^n',
    defaultFormula: '13^4',
    fields: [
      { key: 'base', label: 'Base', defaultValue: '13' },
      { key: 'exp', label: 'Exposant', defaultValue: '4' },
    ],
    generateLatex: (v) => `${v.base || 'x'}^{${v.exp || 'n'}}`,
  },
  {
    id: 'power_calc',
    label: 'Calcul de puissances',
    category: 'powers_indices',
    latexExample: '13^4 \\times 13^9 = 13^{13}',
    defaultFormula: '13^4 \\times 13^9 = 13^{13}',
    fields: [
      { key: 'b', label: 'Base commune', defaultValue: '13' },
      { key: 'p1', label: 'Exposant 1', defaultValue: '4' },
      { key: 'p2', label: 'Exposant 2', defaultValue: '9' },
      { key: 'res', label: 'Exposant résultat', defaultValue: '13' },
    ],
    generateLatex: (v) =>
      `${v.b}^{${v.p1}} \\times ${v.b}^{${v.p2}} = ${v.b}^{${v.res}}`,
  },
  {
    id: 'subscript_simple',
    label: 'Indice',
    category: 'powers_indices',
    latexExample: 'u_{n+1}',
    defaultFormula: 'u_{n+1}',
    fields: [
      { key: 'base', label: 'Base', defaultValue: 'u' },
      { key: 'sub', label: 'Indice', defaultValue: 'n+1' },
    ],
    generateLatex: (v) => `${v.base || 'u'}_{${v.sub || 'n'}}`,
  },
  {
    id: 'sci_notation',
    label: 'Notation scientifique',
    category: 'powers_indices',
    latexExample: 'a \\times 10^n',
    defaultFormula: '3.5 \\times 10^5',
    fields: [
      { key: 'coeff', label: 'Coefficient a', defaultValue: '3.5' },
      { key: 'exp', label: 'Puissance de 10', defaultValue: '5' },
    ],
    generateLatex: (v) => `${v.coeff || '1'} \\times 10^{${v.exp || '1'}}`,
  },

  // 3. Coordinates & Vectors
  {
    id: 'coord_2d',
    label: 'Coordonnées de point 2D',
    category: 'coordinates_vectors',
    latexExample: 'K(100 ; 300)',
    defaultFormula: 'K(100 ; 300)',
    fields: [
      { key: 'point', label: 'Nom du point', defaultValue: 'K' },
      { key: 'x', label: 'Abscisse x', defaultValue: '100' },
      { key: 'y', label: 'Ordonnée y', defaultValue: '300' },
    ],
    generateLatex: (v) => `${v.point || 'A'}(${v.x || '0'} ; ${v.y || '0'})`,
  },
  {
    id: 'coord_negative',
    label: 'Point avec coordonnées négatives',
    category: 'coordinates_vectors',
    latexExample: 'A(-200 ; 300)',
    defaultFormula: 'A(-200 ; 300)',
    fields: [
      { key: 'point', label: 'Point', defaultValue: 'A' },
      { key: 'x', label: 'Abscisse x', defaultValue: '-200' },
      { key: 'y', label: 'Ordonnée y', defaultValue: '300' },
    ],
    generateLatex: (v) => `${v.point || 'A'}(${v.x || '-200'} ; ${v.y || '300'})`,
  },
  {
    id: 'vector_simple',
    label: 'Vecteur',
    category: 'coordinates_vectors',
    latexExample: '\\vec{AB}',
    defaultFormula: '\\vec{AB}',
    fields: [{ key: 'name', label: 'Nom du vecteur', defaultValue: 'AB' }],
    generateLatex: (v) => `\\vec{${v.name || 'AB'}}`,
  },
  {
    id: 'vector_norm',
    label: 'Norme de vecteur',
    category: 'coordinates_vectors',
    latexExample: '\\|\\vec{u}\\|',
    defaultFormula: '\\|\\vec{u}\\|',
    fields: [{ key: 'vec', label: 'Vecteur', defaultValue: 'u' }],
    generateLatex: (v) => `\\|\\vec{${v.vec || 'u'}}\\|`,
  },

  // 4. Equations & Systems
  {
    id: 'eq_relation',
    label: 'Relation algébrique',
    category: 'equations_systems',
    latexExample: 'ab = 1',
    defaultFormula: 'ab = 1',
    fields: [
      { key: 'left', label: 'Membre de gauche', defaultValue: 'ab' },
      { key: 'op', label: 'Opérateur (=, <, ≤, >, ≥, ≠)', defaultValue: '=' },
      { key: 'right', label: 'Membre de droite', defaultValue: '1' },
    ],
    generateLatex: (v) => `${v.left || 'a'} ${v.op || '='} ${v.right || '1'}`,
  },
  {
    id: 'eq_inverse',
    label: 'Égalité fractionnaire inverse',
    category: 'equations_systems',
    latexExample: 'a = -\\frac{1}{b}',
    defaultFormula: 'a = -\\frac{1}{b}',
    fields: [
      { key: 'var1', label: 'Variable 1', defaultValue: 'a' },
      { key: 'sign', label: 'Signe (- ou +)', defaultValue: '-' },
      { key: 'num', label: 'Numérateur', defaultValue: '1' },
      { key: 'den', label: 'Dénominateur', defaultValue: 'b' },
    ],
    generateLatex: (v) => `${v.var1} = ${v.sign}\\frac{${v.num}}{${v.den}}`,
  },
  {
    id: 'system_2eq',
    label: 'Système à 2 équations',
    category: 'equations_systems',
    latexExample: '\\begin{cases} 2x + 3y = 7 \\\\ x - y = 1 \\end{cases}',
    defaultFormula: '\\begin{cases} 2x + 3y = 7 \\\\ x - y = 1 \\end{cases}',
    fields: [
      { key: 'eq1', label: 'Première équation', defaultValue: '2x + 3y = 7' },
      { key: 'eq2', label: 'Deuxième équation', defaultValue: 'x - y = 1' },
    ],
    generateLatex: (v) =>
      `\\begin{cases} ${v.eq1 || 'ax+by=c'} \\\\ ${v.eq2 || "a'x+b'y=c'"} \\end{cases}`,
  },
  {
    id: 'inequality_simple',
    label: 'Inéquation',
    category: 'equations_systems',
    latexExample: '2x - 5 \\le 3',
    defaultFormula: '2x - 5 \\le 3',
    fields: [
      { key: 'left', label: 'Membre gauche', defaultValue: '2x - 5' },
      { key: 'rel', label: 'Relation (\\le, \\ge, <, >)', defaultValue: '\\le' },
      { key: 'right', label: 'Membre droit', defaultValue: '3' },
    ],
    generateLatex: (v) => `${v.left} ${v.rel} ${v.right}`,
  },

  // 5. Intervals & Absolute Values
  {
    id: 'interval_closed',
    label: 'Intervalle fermé [a ; b]',
    category: 'intervals_abs',
    latexExample: '[-2 ; 5]',
    defaultFormula: '[-2 ; 5]',
    fields: [
      { key: 'min', label: 'Borne inférieure', defaultValue: '-2' },
      { key: 'max', label: 'Borne supérieure', defaultValue: '5' },
    ],
    generateLatex: (v) => `[${v.min || 'a'} ; ${v.max || 'b'}]`,
  },
  {
    id: 'interval_infinity',
    label: 'Intervalle avec infini',
    category: 'intervals_abs',
    latexExample: '[0 ; +\\infty[',
    defaultFormula: '[0 ; +\\infty[',
    fields: [
      { key: 'min', label: 'Borne départ', defaultValue: '0' },
      { key: 'max', label: 'Borne fin (+∞ ou -∞)', defaultValue: '+\\infty' },
    ],
    generateLatex: (v) => `[${v.min} ; ${v.max}[`,
  },
  {
    id: 'abs_value',
    label: 'Valeur absolue |x|',
    category: 'intervals_abs',
    latexExample: '|x - 3|',
    defaultFormula: '|x - 3|',
    fields: [{ key: 'expr', label: 'Expression interne', defaultValue: 'x - 3' }],
    generateLatex: (v) => `|${v.expr || 'x'}|`,
  },

  // 6. Matrices & Determinants
  {
    id: 'matrix_2x2',
    label: 'Matrice 2 × 2',
    category: 'matrices',
    latexExample: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
    defaultFormula: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}',
    fields: [
      { key: 'a', label: 'Cellule (1,1)', defaultValue: '1' },
      { key: 'b', label: 'Cellule (1,2)', defaultValue: '2' },
      { key: 'c', label: 'Cellule (2,1)', defaultValue: '3' },
      { key: 'd', label: 'Cellule (2,2)', defaultValue: '4' },
    ],
    generateLatex: (v) =>
      `\\begin{pmatrix} ${v.a || '1'} & ${v.b || '0'} \\\\ ${v.c || '0'} & ${v.d || '1'} \\end{pmatrix}`,
  },
  {
    id: 'det_2x2',
    label: 'Déterminant 2 × 2',
    category: 'matrices',
    latexExample: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',
    defaultFormula: '\\begin{vmatrix} 5 & 2 \\\\ 3 & 1 \\end{vmatrix}',
    fields: [
      { key: 'a', label: 'Cellule (1,1)', defaultValue: '5' },
      { key: 'b', label: 'Cellule (1,2)', defaultValue: '2' },
      { key: 'c', label: 'Cellule (2,1)', defaultValue: '3' },
      { key: 'd', label: 'Cellule (2,2)', defaultValue: '1' },
    ],
    generateLatex: (v) =>
      `\\begin{vmatrix} ${v.a || 'a'} & ${v.b || 'b'} \\\\ ${v.c || 'c'} & ${v.d || 'd'} \\end{vmatrix}`,
  },

  // 7. Analysis & Functions
  {
    id: 'limit_simple',
    label: 'Limite',
    category: 'analysis_functions',
    latexExample: '\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1',
    defaultFormula: '\\lim_{x \\to 0} f(x)',
    fields: [
      { key: 'var', label: 'Variable tendant vers', defaultValue: 'x \\to 0' },
      { key: 'f', label: 'Fonction f(x)', defaultValue: 'f(x)' },
    ],
    generateLatex: (v) => `\\lim_{${v.var}} ${v.f}`,
  },
  {
    id: 'sum_sigma',
    label: 'Somme Σ',
    category: 'analysis_functions',
    latexExample: '\\sum_{k=1}^{n} k^2',
    defaultFormula: '\\sum_{k=1}^{n} k',
    fields: [
      { key: 'sub', label: 'Indice départ (k=1)', defaultValue: 'k=1' },
      { key: 'sup', label: 'Indice fin (n)', defaultValue: 'n' },
      { key: 'term', label: 'Terme', defaultValue: 'k' },
    ],
    generateLatex: (v) => `\\sum_{${v.sub}}^{${v.sup}} ${v.term}`,
  },
  {
    id: 'integral_definite',
    label: 'Intégrale définie',
    category: 'analysis_functions',
    latexExample: '\\int_{a}^{b} f(x) \\, dx',
    defaultFormula: '\\int_{0}^{1} x^2 \\, dx',
    fields: [
      { key: 'a', label: 'Borne basse', defaultValue: '0' },
      { key: 'b', label: 'Borne haute', defaultValue: '1' },
      { key: 'f', label: 'Fonction à intégrer', defaultValue: 'x^2' },
    ],
    generateLatex: (v) => `\\int_{${v.a}}^{${v.b}} ${v.f} \\, dx`,
  },
  {
    id: 'trigo_func',
    label: 'Fonction trigonométrique / Log',
    category: 'analysis_functions',
    latexExample: '\\cos(2x) + \\sin(x)',
    defaultFormula: '\\cos(x)',
    fields: [
      { key: 'fn', label: 'Fonction (cos, sin, tan, ln, log)', defaultValue: '\\cos' },
      { key: 'arg', label: 'Argument', defaultValue: 'x' },
    ],
    generateLatex: (v) => `${v.fn}(${v.arg})`,
  },

  // 8. Symbols, Sets & Greek
  {
    id: 'set_membership',
    label: 'Appartenance à un ensemble',
    category: 'symbols_greek',
    latexExample: 'x \\in \\mathbb{R}',
    defaultFormula: 'x \\in \\mathbb{R}',
    fields: [
      { key: 'elem', label: 'Élément', defaultValue: 'x' },
      { key: 'rel', label: 'Relation (\\in, \\notin, \\subset)', defaultValue: '\\in' },
      { key: 'set', label: 'Ensemble (\\mathbb{R}, \\mathbb{N}, etc.)', defaultValue: '\\mathbb{R}' },
    ],
    generateLatex: (v) => `${v.elem} ${v.rel} ${v.set}`,
  },
  {
    id: 'comb_binomial',
    label: 'Coefficient binomial / Combinaisons',
    category: 'symbols_greek',
    latexExample: '\\binom{n}{k}',
    defaultFormula: '\\binom{n}{k}',
    fields: [
      { key: 'n', label: 'n (total)', defaultValue: 'n' },
      { key: 'k', label: 'k (choix)', defaultValue: 'k' },
    ],
    generateLatex: (v) => `\\binom{${v.n}}{${v.k}}`,
  },
];

const QUICK_INSERT_SYMBOLS = [
  // Operators & Relations
  '=', '≠', '≤', '≥', '≈', '±', '×', '÷',
  // Sets & Logic
  '∈', '∉', '⊂', '∪', '∩', '∅', '⇒', '⇔', '→',
  // Greek
  'α', 'β', 'γ', 'δ', 'θ', 'λ', 'π', 'σ', 'ω', 'Δ', 'Σ', 'Ω',
  // Common terms
  '\\mathbb{R}', '\\mathbb{N}', '\\mathbb{Z}', '\\infty',
  '\\frac{a}{b}', '\\sqrt{x}', 'x^2', 'u_n',
];

export const ProfessionalMathEditorModal: React.FC<ProfessionalMathEditorModalProps> = ({
  isOpen,
  initialFormula = '',
  targetLabel,
  onClose,
  onSave,
  isArabicDoc = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<MathCategory>('fractions_roots');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('frac_simple');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [customLatex, setCustomLatex] = useState<string>('');
  const [isManualEdit, setIsManualEdit] = useState<boolean>(false);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialFormula && initialFormula.trim() !== '') {
      // Clean leading/trailing $ if any
      const cleaned = initialFormula.replace(/^\$|\$$/g, '').trim();
      setCustomLatex(cleaned);
      setIsManualEdit(true);
      // Try to deduce template
      if (cleaned.includes('\\frac')) {
        setActiveCategory('fractions_roots');
        setSelectedTemplateId('frac_simple');
      } else if (cleaned.includes('\\sqrt')) {
        setActiveCategory('fractions_roots');
        setSelectedTemplateId('sqrt_simple');
      } else if (cleaned.includes('^')) {
        setActiveCategory('powers_indices');
        setSelectedTemplateId('power_simple');
      } else if (cleaned.match(/^[A-Z]\s*\(/)) {
        setActiveCategory('coordinates_vectors');
        setSelectedTemplateId('coord_2d');
      } else if (cleaned.includes('\\vec')) {
        setActiveCategory('coordinates_vectors');
        setSelectedTemplateId('vector_simple');
      } else if (cleaned.includes('\\begin{cases}')) {
        setActiveCategory('equations_systems');
        setSelectedTemplateId('system_2eq');
      } else if (cleaned.includes('\\begin{pmatrix}')) {
        setActiveCategory('matrices');
        setSelectedTemplateId('matrix_2x2');
      }
    } else {
      // Reset to default
      const defaultTpl = MATH_TEMPLATES[0];
      setSelectedTemplateId(defaultTpl.id);
      setActiveCategory(defaultTpl.category);
      const initialFields: Record<string, string> = {};
      defaultTpl.fields?.forEach((f) => {
        initialFields[f.key] = f.defaultValue;
      });
      setFieldValues(initialFields);
      setCustomLatex(defaultTpl.defaultFormula);
      setIsManualEdit(false);
    }
  }, [isOpen, initialFormula]);

  const currentTemplate =
    MATH_TEMPLATES.find((t) => t.id === selectedTemplateId) || MATH_TEMPLATES[0];

  const handleSelectTemplate = (tpl: TemplateOption) => {
    setSelectedTemplateId(tpl.id);
    const newFields: Record<string, string> = {};
    tpl.fields?.forEach((f) => {
      newFields[f.key] = f.defaultValue;
    });
    setFieldValues(newFields);
    const newLatex = tpl.generateLatex ? tpl.generateLatex(newFields) : tpl.defaultFormula;
    setCustomLatex(newLatex);
    setIsManualEdit(false);
  };

  const handleFieldChange = (key: string, val: string) => {
    const updated = { ...fieldValues, [key]: val };
    setFieldValues(updated);
    if (currentTemplate.generateLatex) {
      setCustomLatex(currentTemplate.generateLatex(updated));
      setIsManualEdit(false);
    }
  };

  const handleInsertSymbol = (sym: string) => {
    setCustomLatex((prev) => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + sym);
    setIsManualEdit(true);
  };

  const handleConfirm = () => {
    const trimmed = customLatex.trim();
    if (!trimmed) {
      onClose();
      return;
    }
    // Return wrapped in $...$ so the inline math parser isolates it automatically as LTR math
    const formulaPayload = trimmed.startsWith('$') && trimmed.endsWith('$')
      ? trimmed
      : `$${trimmed}$`;
    onSave(formulaPayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        dir="ltr"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <span>Éditeur Mathématique Professionnel</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Formule LTR isolée
                </span>
              </h3>
              {targetLabel && (
                <p className="text-[11px] text-slate-300 truncate max-w-md">
                  Cible : <span className="text-white font-medium">{targetLabel}</span>
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-100/80 border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none text-xs">
          {[
            { id: 'fractions_roots', label: 'Fractions & Racines' },
            { id: 'powers_indices', label: 'Puissances & Indices' },
            { id: 'coordinates_vectors', label: 'Coordonnées & Vecteurs' },
            { id: 'equations_systems', label: 'Équations & Systèmes' },
            { id: 'intervals_abs', label: 'Intervalles & Valeurs Abs.' },
            { id: 'matrices', label: 'Matrices' },
            { id: 'analysis_functions', label: 'Limites & Fonctions' },
            { id: 'symbols_greek', label: 'Symboles & Grec' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id as MathCategory);
                const first = MATH_TEMPLATES.find((t) => t.category === cat.id);
                if (first) handleSelectTemplate(first);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Body: Templates list + Interactive Fields + Live Preview */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Templates Grid in Current Category */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Modèles mathématiques disponibles :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MATH_TEMPLATES.filter((t) => t.category === activeCategory).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    selectedTemplateId === tpl.id
                      ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{tpl.label}</span>
                    {selectedTemplateId === tpl.id && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div className="text-xs text-indigo-600 font-mono bg-indigo-50/50 py-1 px-1.5 rounded-md self-start">
                    <InlineMathText text={`$${tpl.defaultFormula}$`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Interactive Fields for Current Template */}
          {currentTemplate.fields && currentTemplate.fields.length > 0 && !isManualEdit && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Paramètres de l’expression :
                </span>
                <span className="text-[11px] text-indigo-600 font-medium">
                  Modification directe des valeurs
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTemplate.fields.map((f) => (
                  <div key={f.key}>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      value={fieldValues[f.key] ?? f.defaultValue}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Insert Symbols */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Insertion rapide de symboles & relations :
            </label>
            <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {QUICK_INSERT_SYMBOLS.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleInsertSymbol(sym)}
                  className="px-2 py-1 rounded bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 font-medium text-xs text-slate-700 transition-colors cursor-pointer shadow-2xs"
                  title={`Insérer ${sym}`}
                >
                  {sym.startsWith('\\') ? sym.replace('\\', '') : sym}
                </button>
              ))}
            </div>
          </div>

          {/* Formula Code Input (LaTeX / Inline Syntax) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Code de la formule mathématique :
              </label>
              <button
                type="button"
                onClick={() => setIsManualEdit(!isManualEdit)}
                className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                {isManualEdit ? 'Mode guidé' : 'Mode saisie libre'}
              </button>
            </div>
            <input
              type="text"
              dir="ltr"
              value={customLatex}
              onChange={(e) => {
                setCustomLatex(e.target.value);
                setIsManualEdit(true);
              }}
              className="w-full px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="ex: \frac{3}{4} ou K(100 ; 300) ou 13^4"
            />
          </div>

          {/* Real-time Math Preview Box */}
          <div className="bg-slate-50 border-2 border-dashed border-indigo-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[80px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Aperçu en temps réel (Notation LTR conforme)
            </span>
            <div
              dir="ltr"
              className="px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-2xs text-lg font-medium text-slate-900 select-text"
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
            >
              {customLatex.trim() ? (
                <InlineMathText text={`$${customLatex.replace(/^\$|\$$/g, '')}$`} />
              ) : (
                <span className="text-slate-400 italic text-xs">Formule vide</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Valider et insérer la formule</span>
          </button>
        </div>
      </div>
    </div>
  );
};
