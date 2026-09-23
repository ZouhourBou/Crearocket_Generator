import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Sigma,
  Sparkles,
  Star,
  Check,
  Plus,
  Minus,
  Grid,
  Clock,
  Trash2,
  Bookmark,
  Layers,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { InlineMathText } from './InlineMathText';

export interface MathSymbolItem {
  id: string;
  symbol: string;
  nameFr: string;
  nameAr: string;
  latex: string;
  category: 'symbols' | 'structures' | 'algebra' | 'sets' | 'geometry' | 'matrices' | 'analysis' | 'probabilities' | 'advanced';
  subCategory?: string;
  keywords?: string[];
}

export interface MathTemplateItem {
  id: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  category: 'structures' | 'algebra' | 'matrices' | 'analysis' | 'probabilities' | 'geometry' | 'advanced';
  subCategory?: string;
  defaultFormula: string;
  type: 'fraction' | 'matrix' | 'system' | 'standard';
  fields: { key: string; labelFr: string; labelAr: string; defaultValue: string; placeholder?: string }[];
  buildLatex: (v: Record<string, string>, matrix?: string[][], systemRows?: string[]) => string;
  defaultMatrix?: string[][];
  defaultSystemRows?: string[];
  keywords?: string[];
}

// ---------------------------------------------------------
// 1. CATALOGUE COMPLET DES SYMBOLES MATHÉMATIQUES (CodeCogs style)
// ---------------------------------------------------------
export const MATH_SYMBOLS_CATALOG: MathSymbolItem[] = [
  // --- SYMBOLES & OPÉRATIONS ---
  { id: 'op_plus', symbol: '+', nameFr: 'Plus / Addition', nameAr: 'جمع', latex: '+', category: 'symbols', subCategory: 'operations', keywords: ['somme', 'plus', 'addition', 'جمع'] },
  { id: 'op_minus', symbol: '−', nameFr: 'Moins / Soustraction', nameAr: 'طرح', latex: '-', category: 'symbols', subCategory: 'operations', keywords: ['moins', 'soustraction', 'طرح'] },
  { id: 'op_times', symbol: '×', nameFr: 'Multiplication', nameAr: 'ضرب', latex: '\\times', category: 'symbols', subCategory: 'operations', keywords: ['fois', 'multiplier', 'multiplication', 'ضرب'] },
  { id: 'op_div', symbol: '÷', nameFr: 'Division', nameAr: 'قسمة', latex: '\\div', category: 'symbols', subCategory: 'operations', keywords: ['diviser', 'division', 'قسمة'] },
  { id: 'op_pm', symbol: '±', nameFr: 'Plus ou moins', nameAr: 'زائد أو ناقص', latex: '\\pm', category: 'symbols', subCategory: 'operations', keywords: ['plus ou moins', 'زائد أو ناقص'] },
  { id: 'op_mp', symbol: '∓', nameFr: 'Moins ou plus', nameAr: 'ناقص أو زائد', latex: '\\mp', category: 'symbols', subCategory: 'operations', keywords: ['moins ou plus'] },
  { id: 'op_cdot', symbol: '·', nameFr: 'Point médian de produit', nameAr: 'نقطة الضرب', latex: '\\cdot', category: 'symbols', subCategory: 'operations', keywords: ['produit', 'point'] },
  { id: 'op_slash', symbol: '/', nameFr: 'Barre oblique de division', nameAr: 'شرطة القسمة', latex: '/', category: 'symbols', subCategory: 'operations', keywords: ['slash', 'division'] },

  // --- RELATIONS & COMPARAISONS ---
  { id: 'rel_eq', symbol: '=', nameFr: 'Égal', nameAr: 'يساوي', latex: '=', category: 'symbols', subCategory: 'relations', keywords: ['egal', 'equal', 'يساوي'] },
  { id: 'rel_neq', symbol: '≠', nameFr: 'Différent de', nameAr: 'لا يساوي', latex: '\\neq', category: 'symbols', subCategory: 'relations', keywords: ['different', 'different de', 'لا يساوي'] },
  { id: 'rel_lt', symbol: '<', nameFr: 'Strictement inférieur', nameAr: 'أصغر قطعا', latex: '<', category: 'symbols', subCategory: 'relations', keywords: ['inferieur', 'plus petit', 'اصغر'] },
  { id: 'rel_gt', symbol: '>', nameFr: 'Strictement supérieur', nameAr: 'أكبر قطعا', latex: '>', category: 'symbols', subCategory: 'relations', keywords: ['superieur', 'plus grand', 'اكبر'] },
  { id: 'rel_le', symbol: '≤', nameFr: 'Inférieur ou égal', nameAr: 'أصغر أو يساوي', latex: '\\le', category: 'symbols', subCategory: 'relations', keywords: ['inferieur ou egal', 'اصغر او يساوي'] },
  { id: 'rel_ge', symbol: '≥', nameFr: 'Supérieur ou égal', nameAr: 'أكبر أو يساوي', latex: '\\ge', category: 'symbols', subCategory: 'relations', keywords: ['superieur ou egal', 'اكبر او يساوي'] },
  { id: 'rel_approx', symbol: '≈', nameFr: 'Approximativement égal', nameAr: 'يساوي تقريبا', latex: '\\approx', category: 'symbols', subCategory: 'relations', keywords: ['environ', 'approximativement', 'تقريبا'] },
  { id: 'rel_equiv', symbol: '≡', nameFr: 'Équivalent / Congru', nameAr: 'يوافق / متطابق', latex: '\\equiv', category: 'symbols', subCategory: 'relations', keywords: ['congru', 'equivalent', 'modulo'] },
  { id: 'rel_sim', symbol: '∼', nameFr: 'Similaire / Asymptotique', nameAr: 'مشابه / مقارب', latex: '\\sim', category: 'symbols', subCategory: 'relations', keywords: ['equivalent', 'similaire'] },
  { id: 'rel_prop', symbol: '∝', nameFr: 'Proportionnel à', nameAr: 'يتناسب مع', latex: '\\propto', category: 'symbols', subCategory: 'relations', keywords: ['proportionnel'] },
  { id: 'rel_ll', symbol: '≪', nameFr: 'Très inférieur à', nameAr: 'أصغر بكثير من', latex: '\\ll', category: 'symbols', subCategory: 'relations', keywords: ['tres inferieur'] },
  { id: 'rel_gg', symbol: '≫', nameFr: 'Très supérieur à', nameAr: 'أكبر بكثير من', latex: '\\gg', category: 'symbols', subCategory: 'relations', keywords: ['tres superieur'] },

  // --- FLÈCHES ---
  { id: 'arr_right', symbol: '→', nameFr: 'Flèche vers la droite (tend vers)', nameAr: 'سهم إلى اليمين (يؤول إلى)', latex: '\\to', category: 'symbols', subCategory: 'arrows', keywords: ['fleche', 'tend vers', 'سهم', 'يؤول'] },
  { id: 'arr_left', symbol: '←', nameFr: 'Flèche vers la gauche', nameAr: 'سهم إلى اليسار', latex: '\\leftarrow', category: 'symbols', subCategory: 'arrows', keywords: ['fleche gauche'] },
  { id: 'arr_lr', symbol: '↔', nameFr: 'Double flèche', nameAr: 'سهم مزدوج', latex: '\\leftrightarrow', category: 'symbols', subCategory: 'arrows', keywords: ['double fleche'] },
  { id: 'arr_implies', symbol: '⇒', nameFr: 'Implication logique', nameAr: 'استلزام منطقي', latex: '\\Rightarrow', category: 'symbols', subCategory: 'arrows', keywords: ['implique', 'implication', 'يستلزم'] },
  { id: 'arr_iff', symbol: '⇔', nameFr: 'Équivalence logique', nameAr: 'تكافؤ منطقي', latex: '\\Leftrightarrow', category: 'symbols', subCategory: 'arrows', keywords: ['equivaut', 'equivalence', 'يكافئ'] },
  { id: 'arr_mapsto', symbol: '↦', nameFr: 'Associe à (fonction)', nameAr: 'يربط بـ', latex: '\\mapsto', category: 'symbols', subCategory: 'arrows', keywords: ['associe', 'application', 'دالة'] },

  // --- ALPHABET GREC ---
  { id: 'grk_alpha', symbol: 'α', nameFr: 'Alpha', nameAr: 'ألفا', latex: '\\alpha', category: 'symbols', subCategory: 'greek', keywords: ['alpha', 'الفا'] },
  { id: 'grk_beta', symbol: 'β', nameFr: 'Bêta', nameAr: 'بيتا', latex: '\\beta', category: 'symbols', subCategory: 'greek', keywords: ['beta', 'بيتا'] },
  { id: 'grk_gamma', symbol: 'γ', nameFr: 'Gamma', nameAr: 'غاما', latex: '\\gamma', category: 'symbols', subCategory: 'greek', keywords: ['gamma', 'غاما'] },
  { id: 'grk_delta_min', symbol: 'δ', nameFr: 'Delta minuscule', nameAr: 'دلتا صغير', latex: '\\delta', category: 'symbols', subCategory: 'greek', keywords: ['delta', 'دلتا'] },
  { id: 'grk_delta_maj', symbol: 'Δ', nameFr: 'Delta majuscule (discriminant)', nameAr: 'دلتا كبير (المميز)', latex: '\\Delta', category: 'symbols', subCategory: 'greek', keywords: ['discriminant', 'delta', 'المميز', 'دلتا'] },
  { id: 'grk_epsilon', symbol: 'ε', nameFr: 'Epsilon', nameAr: 'إبسلون', latex: '\\varepsilon', category: 'symbols', subCategory: 'greek', keywords: ['epsilon'] },
  { id: 'grk_theta', symbol: 'θ', nameFr: 'Thêta (angle)', nameAr: 'ثيتا (زاوية)', latex: '\\theta', category: 'symbols', subCategory: 'greek', keywords: ['theta', 'angle', 'ثيتا'] },
  { id: 'grk_lambda', symbol: 'λ', nameFr: 'Lambda', nameAr: 'لامدا', latex: '\\lambda', category: 'symbols', subCategory: 'greek', keywords: ['lambda', 'لامدا'] },
  { id: 'grk_mu', symbol: 'μ', nameFr: 'Mu (micro)', nameAr: 'ميو', latex: '\\mu', category: 'symbols', subCategory: 'greek', keywords: ['mu', 'micro'] },
  { id: 'grk_pi', symbol: 'π', nameFr: 'Pi (3.14159...)', nameAr: 'بي', latex: '\\pi', category: 'symbols', subCategory: 'greek', keywords: ['pi', '3.14', 'بي'] },
  { id: 'grk_sigma_min', symbol: 'σ', nameFr: 'Sigma minuscule (écart-type)', nameAr: 'سيغما (انحراف معياري)', latex: '\\sigma', category: 'symbols', subCategory: 'greek', keywords: ['sigma', 'ecart type', 'انحراف'] },
  { id: 'grk_sigma_maj', symbol: 'Σ', nameFr: 'Sigma majuscule (somme)', nameAr: 'سيغما كبير (مجموع)', latex: '\\Sigma', category: 'symbols', subCategory: 'greek', keywords: ['sigma', 'somme'] },
  { id: 'grk_omega_maj', symbol: 'Ω', nameFr: 'Oméga majuscule (univers)', nameAr: 'أوميغا (الفضاء العيني)', latex: '\\Omega', category: 'symbols', subCategory: 'greek', keywords: ['omega', 'univers', 'اوميغا'] },
  { id: 'grk_omega_min', symbol: 'ω', nameFr: 'Oméga minuscule', nameAr: 'أوميغا صغير', latex: '\\omega', category: 'symbols', subCategory: 'greek', keywords: ['omega'] },
  { id: 'grk_phi', symbol: 'φ', nameFr: 'Phi', nameAr: 'فاي', latex: '\\varphi', category: 'symbols', subCategory: 'greek', keywords: ['phi', 'فاي'] },

  // --- ENSEMBLES & LOGIQUE ---
  { id: 'set_N', symbol: 'ℕ', nameFr: 'Entiers naturels ℕ', nameAr: 'مجموعة الأعداد الطبيعية', latex: '\\mathbb{N}', category: 'sets', subCategory: 'numbers', keywords: ['naturels', 'entiers', 'N', 'طبيعية'] },
  { id: 'set_Z', symbol: 'ℤ', nameFr: 'Entiers relatifs ℤ', nameAr: 'مجموعة الأعداد الصحيحة النسبية', latex: '\\mathbb{Z}', category: 'sets', subCategory: 'numbers', keywords: ['relatifs', 'Z', 'صحيحة'] },
  { id: 'set_D', symbol: '𝔻', nameFr: 'Nombres décimaux 𝔻', nameAr: 'مجموعة الأعداد العشرية', latex: '\\mathbb{D}', category: 'sets', subCategory: 'numbers', keywords: ['decimaux', 'D', 'عشرية'] },
  { id: 'set_Q', symbol: 'ℚ', nameFr: 'Nombres rationnels ℚ', nameAr: 'مجموعة الأعداد الجذرية / الكسرية', latex: '\\mathbb{Q}', category: 'sets', subCategory: 'numbers', keywords: ['rationnels', 'Q', 'جذرية', 'كسرية'] },
  { id: 'set_R', symbol: 'ℝ', nameFr: 'Nombres réels ℝ', nameAr: 'مجموعة الأعداد الحقيقية', latex: '\\mathbb{R}', category: 'sets', subCategory: 'numbers', keywords: ['reels', 'R', 'حقيقية'] },
  { id: 'set_C', symbol: 'ℂ', nameFr: 'Nombres complexes ℂ', nameAr: 'مجموعة الأعداد العقدية', latex: '\\mathbb{C}', category: 'sets', subCategory: 'numbers', keywords: ['complexes', 'C', 'عقدية'] },
  { id: 'set_in', symbol: '∈', nameFr: 'Appartient à', nameAr: 'ينتمي إلى', latex: '\\in', category: 'sets', subCategory: 'inclusion', keywords: ['appartient', 'dans', 'ينتمي'] },
  { id: 'set_notin', symbol: '∉', nameFr: 'N’appartient pas à', nameAr: 'لا ينتمي إلى', latex: '\\notin', category: 'sets', subCategory: 'inclusion', keywords: ['nappartient pas', 'لا ينتمي'] },
  { id: 'set_subset', symbol: '⊂', nameFr: 'Inclus dans (strict)', nameAr: 'ضمن قطعا', latex: '\\subset', category: 'sets', subCategory: 'inclusion', keywords: ['inclus', 'sous ensemble', 'ضمن'] },
  { id: 'set_subseteq', symbol: '⊆', nameFr: 'Inclus ou égal', nameAr: 'محتوى في أو يساوي', latex: '\\subseteq', category: 'sets', subCategory: 'inclusion', keywords: ['inclus ou egal'] },
  { id: 'set_union', symbol: '∪', nameFr: 'Union d’ensembles', nameAr: 'اتحاد مجموعات', latex: '\\cup', category: 'sets', subCategory: 'operations', keywords: ['union', 'reunion', 'اتحاد'] },
  { id: 'set_inter', symbol: '∩', nameFr: 'Intersection d’ensembles', nameAr: 'تقاطع مجموعات', latex: '\\cap', category: 'sets', subCategory: 'operations', keywords: ['intersection', 'inter', 'تقاطع'] },
  { id: 'set_empty', symbol: '∅', nameFr: 'Ensemble vide', nameAr: 'المجموعة الفارغة', latex: '\\emptyset', category: 'sets', subCategory: 'operations', keywords: ['vide', 'ensemble vide', 'فارغة'] },
  { id: 'set_forall', symbol: '∀', nameFr: 'Pour tout / Quel que soit', nameAr: 'لكل / مهما يكن', latex: '\\forall', category: 'sets', subCategory: 'logic', keywords: ['pour tout', 'quel que soit', 'لكل', 'مهما يكن'] },
  { id: 'set_exists', symbol: '∃', nameFr: 'Il existe', nameAr: 'يوجد', latex: '\\exists', category: 'sets', subCategory: 'logic', keywords: ['il existe', 'يوجد'] },
  { id: 'set_nexists', symbol: '∄', nameFr: 'Il n’existe pas', nameAr: 'لا يوجد', latex: '\\nexists', category: 'sets', subCategory: 'logic', keywords: ['nexiste pas', 'لا يوجد'] },
  { id: 'set_and', symbol: '∧', nameFr: 'Et logique (conjonction)', nameAr: 'و منطقية', latex: '\\land', category: 'sets', subCategory: 'logic', keywords: ['et', 'conjonction'] },
  { id: 'set_or', symbol: '∨', nameFr: 'Ou logique (disjonction)', nameAr: 'أو منطقية', latex: '\\lor', category: 'sets', subCategory: 'logic', keywords: ['ou', 'disjonction'] },
  { id: 'set_not', symbol: '¬', nameFr: 'Négation logique', nameAr: 'نفي منطقي', latex: '\\neg', category: 'sets', subCategory: 'logic', keywords: ['non', 'negation', 'نفي'] },

  // --- GÉOMÉTRIE ---
  { id: 'geo_angle', symbol: '∠', nameFr: 'Angle géométrique', nameAr: 'زاوية هندسية', latex: '\\angle', category: 'geometry', subCategory: 'angles', keywords: ['angle', 'زاوية'] },
  { id: 'geo_deg', symbol: '°', nameFr: 'Degré', nameAr: 'درجة', latex: '^\\circ', category: 'geometry', subCategory: 'angles', keywords: ['degre', 'degres', 'درجة'] },
  { id: 'geo_perp', symbol: '⊥', nameFr: 'Perpendiculaire à', nameAr: 'عمودي على', latex: '\\perp', category: 'geometry', subCategory: 'relations', keywords: ['perpendiculaire', 'orthogonal', 'عمودي'] },
  { id: 'geo_parallel', symbol: '∥', nameFr: 'Parallèle à', nameAr: 'يوازي', latex: '\\parallel', category: 'geometry', subCategory: 'relations', keywords: ['parallele', 'يوازي'] },
  { id: 'geo_triangle', symbol: '△', nameFr: 'Triangle', nameAr: 'مثلث', latex: '\\triangle', category: 'geometry', subCategory: 'shapes', keywords: ['triangle', 'مثلث'] },
  { id: 'geo_vec_u', symbol: '\\vec{u}', nameFr: 'Vecteur u', nameAr: 'المتجه u', latex: '\\vec{u}', category: 'geometry', subCategory: 'vectors', keywords: ['vecteur', 'متجه'] },
  { id: 'geo_vec_v', symbol: '\\vec{v}', nameFr: 'Vecteur v', nameAr: 'المتجه v', latex: '\\vec{v}', category: 'geometry', subCategory: 'vectors', keywords: ['vecteur v'] },
  { id: 'geo_vec_ab', symbol: '\\overrightarrow{AB}', nameFr: 'Vecteur AB', nameAr: 'المتجه AB', latex: '\\overrightarrow{AB}', category: 'geometry', subCategory: 'vectors', keywords: ['vecteur ab', 'متجه ab'] },

  // --- ANALYSE & FONCTIONS ---
  { id: 'ana_infty', symbol: '∞', nameFr: 'Infini', nameAr: 'ما لا نهاية', latex: '\\infty', category: 'analysis', subCategory: 'symbols', keywords: ['infini', 'plus infini', 'لانهاية'] },
  { id: 'ana_sum', symbol: '∑', nameFr: 'Somme', nameAr: 'رمز المجموع', latex: '\\sum', category: 'analysis', subCategory: 'symbols', keywords: ['somme', 'sigma', 'مجموع'] },
  { id: 'ana_prod', symbol: '∏', nameFr: 'Produit', nameAr: 'رمز الجداء', latex: '\\prod', category: 'analysis', subCategory: 'symbols', keywords: ['produit', 'pi majuscule', 'جداء'] },
  { id: 'ana_int', symbol: '∫', nameFr: 'Intégrale', nameAr: 'تكامل', latex: '\\int', category: 'analysis', subCategory: 'symbols', keywords: ['integrale', 'تكامل'] },
  { id: 'ana_partial', symbol: '∂', nameFr: 'Dérivée partielle', nameAr: 'تفاضل جزئي', latex: '\\partial', category: 'analysis', subCategory: 'symbols', keywords: ['derivee partielle', 'partial'] },
  { id: 'ana_dx', symbol: 'dx', nameFr: 'Élément différentiel dx', nameAr: 'عنصر التفاضل dx', latex: 'dx', category: 'analysis', subCategory: 'symbols', keywords: ['dx', 'differentielle'] },
  { id: 'ana_prime', symbol: "f'", nameFr: 'Dérivée première', nameAr: 'المشتقة الأولى', latex: "f'", category: 'analysis', subCategory: 'functions', keywords: ['derivee', 'prime', 'مشتقة'] },
  { id: 'ana_ln', symbol: 'ln', nameFr: 'Logarithme népérien', nameAr: 'اللوغاريتم النيبري', latex: '\\ln', category: 'analysis', subCategory: 'functions', keywords: ['ln', 'logarithme', 'نيبري'] },
  { id: 'ana_exp', symbol: 'e^x', nameFr: 'Exponentielle', nameAr: 'الدالة الأسية', latex: 'e^x', category: 'analysis', subCategory: 'functions', keywords: ['exp', 'exponentielle', 'اسي'] },
  { id: 'ana_sin', symbol: 'sin', nameFr: 'Sinus', nameAr: 'جيب', latex: '\\sin', category: 'analysis', subCategory: 'functions', keywords: ['sinus', 'جيب'] },
  { id: 'ana_cos', symbol: 'cos', nameFr: 'Cosinus', nameAr: 'جيب التمام', latex: '\\cos', category: 'analysis', subCategory: 'functions', keywords: ['cosinus', 'جيب تمام'] },
  { id: 'ana_tan', symbol: 'tan', nameFr: 'Tangente', nameAr: 'ظل', latex: '\\tan', category: 'analysis', subCategory: 'functions', keywords: ['tangente', 'ظل'] },
];

// ---------------------------------------------------------
// 2. CATALOGUE DES MODÈLES STRUCTURÉS (Fractions, Racines, Matrices...)
// ---------------------------------------------------------
export const MATH_TEMPLATES_CATALOG: MathTemplateItem[] = [
  // --- STRUCTURES (Fractions, Racines, Puissances) ---
  {
    id: 'frac_simple',
    nameFr: 'Fraction simple',
    nameAr: 'كسر بسيط',
    descriptionFr: 'Fraction avec numérateur et dénominateur modifiables',
    descriptionAr: 'كسر مع بسط ومقام قابلين للتعديل مباشرة',
    category: 'structures',
    subCategory: 'fractions',
    type: 'fraction',
    defaultFormula: '\\frac{a}{b}',
    fields: [
      { key: 'num', labelFr: 'Numérateur', labelAr: 'البسط', defaultValue: 'a', placeholder: 'a' },
      { key: 'den', labelFr: 'Dénominateur', labelAr: 'المقام', defaultValue: 'b', placeholder: 'b' },
    ],
    buildLatex: (v) => `\\frac{${v.num || 'a'}}{${v.den || 'b'}}`,
    keywords: ['fraction', 'sur', 'diviser', 'biscuit', 'ratio', 'كسر', 'بسط', 'مقام'],
  },
  {
    id: 'frac_algebraic',
    nameFr: 'Fraction algébrique',
    nameAr: 'كسر جبري',
    descriptionFr: 'Fraction avec expressions polynomiales',
    descriptionAr: 'كسر يحتوي على عبارات جبرية',
    category: 'structures',
    subCategory: 'fractions',
    type: 'fraction',
    defaultFormula: '\\frac{2x + 3}{x - 1}',
    fields: [
      { key: 'num', labelFr: 'Numérateur', labelAr: 'البسط', defaultValue: '2x + 3' },
      { key: 'den', labelFr: 'Dénominateur', labelAr: 'المقام', defaultValue: 'x - 1' },
    ],
    buildLatex: (v) => `\\frac{${v.num || '2x+3'}}{${v.den || 'x-1'}}`,
    keywords: ['fraction algebrique', 'polynome', 'كسر جبري'],
  },
  {
    id: 'frac_nested',
    nameFr: 'Fraction imbriquée',
    nameAr: 'كسر مركب',
    descriptionFr: 'Fraction contenant une sous-fraction',
    descriptionAr: 'كسر يحتوي على كسر فرعي',
    category: 'structures',
    subCategory: 'fractions',
    type: 'standard',
    defaultFormula: '\\frac{1}{1 + \\frac{a}{b}}',
    fields: [
      { key: 'top', labelFr: 'Haut', labelAr: 'الأعلى', defaultValue: '1' },
      { key: 'base', labelFr: 'Base', labelAr: 'الأساس', defaultValue: '1' },
      { key: 'n', labelFr: 'B. sous-fraction', labelAr: 'بسط الكسر الفرعي', defaultValue: 'a' },
      { key: 'd', labelFr: 'M. sous-fraction', labelAr: 'مقام الكسر الفرعي', defaultValue: 'b' },
    ],
    buildLatex: (v) => `\\frac{${v.top || '1'}}{${v.base || '1'} + \\frac{${v.n || 'a'}}{${v.d || 'b'}}}`,
    keywords: ['fraction imbriquee', 'fraction continue', 'كسر مركب'],
  },
  {
    id: 'sqrt_simple',
    nameFr: 'Racine carrée',
    nameAr: 'جذر تربيعي',
    descriptionFr: 'Radical carré standard',
    descriptionAr: 'جذر تربيعي مباشر قابل للتعديل',
    category: 'structures',
    subCategory: 'roots',
    type: 'standard',
    defaultFormula: '\\sqrt{x}',
    fields: [
      { key: 'rad', labelFr: 'Sous le radical', labelAr: 'ما بداخل الجذر', defaultValue: 'x' },
    ],
    buildLatex: (v) => `\\sqrt{${v.rad || 'x'}}`,
    keywords: ['racine', 'carree', 'radical', 'sqrt', 'جذر', 'تربيعي'],
  },
  {
    id: 'sqrt_nth',
    nameFr: 'Racine n-ième',
    nameAr: 'جذر نوني',
    descriptionFr: 'Racine cubique ou d’ordre n',
    descriptionAr: 'جذر من الرتبة n',
    category: 'structures',
    subCategory: 'roots',
    type: 'standard',
    defaultFormula: '\\sqrt[n]{x}',
    fields: [
      { key: 'n', labelFr: 'Ordre (n)', labelAr: 'الرتبة n', defaultValue: 'n' },
      { key: 'rad', labelFr: 'Sous le radical', labelAr: 'ما بداخل الجذر', defaultValue: 'x' },
    ],
    buildLatex: (v) => `\\sqrt[${v.n || 'n'}]{${v.rad || 'x'}}`,
    keywords: ['racine n-ieme', 'racine cubique', 'جذر نوني'],
  },
  {
    id: 'power_simple',
    nameFr: 'Puissance (exposant)',
    nameAr: 'قوة (أس)',
    descriptionFr: 'Base avec exposant modifiable',
    descriptionAr: 'أساس مرفوع لأس',
    category: 'structures',
    subCategory: 'powers',
    type: 'standard',
    defaultFormula: 'x^{2}',
    fields: [
      { key: 'base', labelFr: 'Base', labelAr: 'الأساس', defaultValue: 'x' },
      { key: 'exp', labelFr: 'Exposant', labelAr: 'الأس', defaultValue: '2' },
    ],
    buildLatex: (v) => `${v.base || 'x'}^{${v.exp || '2'}}`,
    keywords: ['puissance', 'exposant', 'carre', 'cube', 'power', 'قوة', 'اس', 'مربع'],
  },
  {
    id: 'subscript_simple',
    nameFr: 'Indice (suite)',
    nameAr: 'دليل سفلي (متتالية)',
    descriptionFr: 'Variable avec indice de terme (uₙ, xᵢ)',
    descriptionAr: 'متغير مع دليل سفلي لحدود المتتاليات',
    category: 'structures',
    subCategory: 'powers',
    type: 'standard',
    defaultFormula: 'u_{n}',
    fields: [
      { key: 'base', labelFr: 'Variable', labelAr: 'المتغير', defaultValue: 'u' },
      { key: 'sub', labelFr: 'Indice', labelAr: 'الدليل', defaultValue: 'n' },
    ],
    buildLatex: (v) => `${v.base || 'u'}_{${v.sub || 'n'}}`,
    keywords: ['indice', 'suite', 'terme', 'متتالية', 'دليل'],
  },
  {
    id: 'power_subscript',
    nameFr: 'Indice et Puissance',
    nameAr: 'دليل وأس معا',
    descriptionFr: 'Variable indicée élevée à une puissance (xᵢⁿ)',
    descriptionAr: 'متغير يحتوي على دليل سفلي وأس في نفس الوقت',
    category: 'structures',
    subCategory: 'powers',
    type: 'standard',
    defaultFormula: 'x_{i}^{n}',
    fields: [
      { key: 'base', labelFr: 'Variable', labelAr: 'المتغير', defaultValue: 'x' },
      { key: 'sub', labelFr: 'Indice', labelAr: 'الدليل', defaultValue: 'i' },
      { key: 'exp', labelFr: 'Exposant', labelAr: 'الأس', defaultValue: 'n' },
    ],
    buildLatex: (v) => `${v.base || 'x'}_{${v.sub || 'i'}}^{${v.exp || 'n'}}`,
    keywords: ['indice puissance', 'xi n'],
  },
  {
    id: 'delim_abs',
    nameFr: 'Valeur absolue',
    nameAr: 'القيمة المطلقة',
    descriptionFr: 'Encadrement par barres verticales |x|',
    descriptionAr: 'قيمة مطلقة مع عبارة قابلة للتعديل',
    category: 'structures',
    subCategory: 'delimiters',
    type: 'standard',
    defaultFormula: '|x - 3|',
    fields: [
      { key: 'content', labelFr: 'Contenu', labelAr: 'العبارة', defaultValue: 'x - 3' },
    ],
    buildLatex: (v) => `|${v.content || 'x'}|`,
    keywords: ['valeur absolue', 'module', 'قيمة مطلقة'],
  },

  // --- ALGÈBRE (Systèmes, Équations, Polynômes) ---
  {
    id: 'sys_2eq',
    nameFr: 'Système de 2 équations',
    nameAr: 'نظمة معادلتين',
    descriptionFr: 'Système à accolade avec 2 lignes',
    descriptionAr: 'نظمة معادلتين بمجهولين محاطة بلامة',
    category: 'algebra',
    subCategory: 'systems',
    type: 'system',
    defaultFormula: '\\begin{cases} 2x + y = 5 \\\\ x - y = 1 \\end{cases}',
    defaultSystemRows: ['2x + y = 5', 'x - y = 1'],
    fields: [],
    buildLatex: (_, __, rows) => {
      const activeRows = rows && rows.length > 0 ? rows : ['2x + y = 5', 'x - y = 1'];
      return `\\begin{cases} ${activeRows.join(' \\\\ ')} \\end{cases}`;
    },
    keywords: ['systeme', 'cases', 'accolade', 'equations', 'نظمة', 'معادلتين'],
  },
  {
    id: 'sys_3eq',
    nameFr: 'Système de 3 équations',
    nameAr: 'نظمة 3 معادلات',
    descriptionFr: 'Système à accolade avec 3 lignes',
    descriptionAr: 'نظمة بثلاث معادلات',
    category: 'algebra',
    subCategory: 'systems',
    type: 'system',
    defaultFormula: '\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}',
    defaultSystemRows: ['x + y + z = 6', '2x - y + z = 3', 'x + 2y - z = 2'],
    fields: [],
    buildLatex: (_, __, rows) => {
      const activeRows = rows && rows.length > 0 ? rows : ['x + y + z = 6', '2x - y + z = 3', 'x + 2y - z = 2'];
      return `\\begin{cases} ${activeRows.join(' \\\\ ')} \\end{cases}`;
    },
    keywords: ['systeme 3', 'نظمة 3'],
  },
  {
    id: 'eq_second_deg',
    nameFr: 'Équation du 2nd degré',
    nameAr: 'معادلة من الدرجة الثانية',
    descriptionFr: 'Forme canonique ax² + bx + c = 0',
    descriptionAr: 'معادلة تربيعية عامة',
    category: 'algebra',
    subCategory: 'equations',
    type: 'standard',
    defaultFormula: 'ax^{2} + bx + c = 0',
    fields: [
      { key: 'a', labelFr: 'a', labelAr: 'a', defaultValue: 'a' },
      { key: 'b', labelFr: 'b', labelAr: 'b', defaultValue: 'b' },
      { key: 'c', labelFr: 'c', labelAr: 'c', defaultValue: 'c' },
    ],
    buildLatex: (v) => `${v.a || 'a'}x^{2} + ${v.b || 'b'}x + ${v.c || 'c'} = 0`,
    keywords: ['second degre', 'equation', 'trinome', 'درجة ثانية', 'معادلة'],
  },
  {
    id: 'eq_quadratic_roots',
    nameFr: 'Formule des racines (Delta)',
    nameAr: 'حلول المعادلة التربيعية',
    descriptionFr: 'Expression (-b ± √Δ) / 2a',
    descriptionAr: 'صيغة الحلول بدلالة المميز دلتا',
    category: 'algebra',
    subCategory: 'equations',
    type: 'standard',
    defaultFormula: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
    fields: [
      { key: 'b', labelFr: 'b', labelAr: 'b', defaultValue: 'b' },
      { key: 'delta', labelFr: 'Δ', labelAr: 'دلتا', defaultValue: '\\Delta' },
      { key: 'a', labelFr: 'a', labelAr: 'a', defaultValue: 'a' },
    ],
    buildLatex: (v) => `x = \\frac{-${v.b || 'b'} \\pm \\sqrt{${v.delta || '\\Delta'}}}{2${v.a || 'a'}}`,
    keywords: ['racines', 'delta', 'formule quadratique', 'حلول', 'مميز'],
  },
  {
    id: 'eq_remarquable_1',
    nameFr: 'Identité remarquable (a+b)²',
    nameAr: 'متطابقة هامة (a+b)²',
    descriptionFr: '(a+b)² = a² + 2ab + b²',
    descriptionAr: 'مربع مجموع حدين',
    category: 'algebra',
    subCategory: 'identities',
    type: 'standard',
    defaultFormula: '(a + b)^{2} = a^{2} + 2ab + b^{2}',
    fields: [
      { key: 'a', labelFr: 'a', labelAr: 'a', defaultValue: 'a' },
      { key: 'b', labelFr: 'b', labelAr: 'b', defaultValue: 'b' },
    ],
    buildLatex: (v) => `(${v.a || 'a'} + ${v.b || 'b'})^{2} = (${v.a || 'a'})^{2} + 2(${v.a || 'a'})(${v.b || 'b'}) + (${v.b || 'b'})^{2}`,
    keywords: ['identite remarquable', 'developpement', 'متطابقة هامة'],
  },

  // --- MATRICES & DÉTERMINANTS ---
  {
    id: 'matrix_2x2',
    nameFr: 'Matrice 2×2',
    nameAr: 'مصفوفة 2×2',
    descriptionFr: 'Matrice carrée d’ordre 2',
    descriptionAr: 'مصفوفة مربعة من الرتبة 2',
    category: 'matrices',
    subCategory: 'square',
    type: 'matrix',
    defaultFormula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
    defaultMatrix: [
      ['a', 'b'],
      ['c', 'd'],
    ],
    fields: [],
    buildLatex: (_, matrix) => {
      const m = matrix || [['a', 'b'], ['c', 'd']];
      const rows = m.map((r) => r.join(' & ')).join(' \\\\ ');
      return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
    },
    keywords: ['matrice', '2x2', 'carree', 'مصفوفة', '2x2'],
  },
  {
    id: 'matrix_3x3',
    nameFr: 'Matrice 3×3',
    nameAr: 'مصفوفة 3×3',
    descriptionFr: 'Matrice carrée d’ordre 3',
    descriptionAr: 'مصفوفة مربعة من الرتبة 3',
    category: 'matrices',
    subCategory: 'square',
    type: 'matrix',
    defaultFormula: '\\begin{pmatrix} 1 & 0 & 2 \\\\ -1 & 3 & 1 \\\\ 0 & 1 & 4 \\end{pmatrix}',
    defaultMatrix: [
      ['1', '0', '2'],
      ['-1', '3', '1'],
      ['0', '1', '4'],
    ],
    fields: [],
    buildLatex: (_, matrix) => {
      const m = matrix || [
        ['1', '0', '2'],
        ['-1', '3', '1'],
        ['0', '1', '4'],
      ];
      const rows = m.map((r) => r.join(' & ')).join(' \\\\ ');
      return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
    },
    keywords: ['matrice 3x3', 'ordre 3', 'مصفوفة 3x3'],
  },
  {
    id: 'matrix_col',
    nameFr: 'Vecteur colonne (3×1)',
    nameAr: 'متجه عمودي (3×1)',
    descriptionFr: 'Matrice colonne avec 3 lignes',
    descriptionAr: 'مصفوفة عمودية بثلاث خانات',
    category: 'matrices',
    subCategory: 'vectors',
    type: 'matrix',
    defaultFormula: '\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}',
    defaultMatrix: [['x'], ['y'], ['z']],
    fields: [],
    buildLatex: (_, matrix) => {
      const m = matrix || [['x'], ['y'], ['z']];
      const rows = m.map((r) => r[0] || '0').join(' \\\\ ');
      return `\\begin{pmatrix} ${rows} \\end{pmatrix}`;
    },
    keywords: ['vecteur colonne', 'colonne', 'متجه عمودي'],
  },
  {
    id: 'matrix_det_2x2',
    nameFr: 'Déterminant 2×2',
    nameAr: 'محدد 2×2',
    descriptionFr: 'Déterminant d’ordre 2 avec barres droites',
    descriptionAr: 'محدد من الرتبة الثانية',
    category: 'matrices',
    subCategory: 'determinants',
    type: 'matrix',
    defaultFormula: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',
    defaultMatrix: [
      ['a', 'b'],
      ['c', 'd'],
    ],
    fields: [],
    buildLatex: (_, matrix) => {
      const m = matrix || [['a', 'b'], ['c', 'd']];
      const rows = m.map((r) => r.join(' & ')).join(' \\\\ ');
      return `\\begin{vmatrix} ${rows} \\end{vmatrix}`;
    },
    keywords: ['determinant', 'det', 'محدد'],
  },

  // --- ANALYSE & INTÉGRALES ---
  {
    id: 'ana_lim',
    nameFr: 'Limite',
    nameAr: 'نهاية دالة',
    descriptionFr: 'Limite lorsque x tend vers une valeur',
    descriptionAr: 'نهاية دالة عند نقطة أو اللانهاية',
    category: 'analysis',
    subCategory: 'limits',
    type: 'standard',
    defaultFormula: '\\lim_{x \\to +\\infty} f(x)',
    fields: [
      { key: 'var', labelFr: 'Variable', labelAr: 'المتغير', defaultValue: 'x' },
      { key: 'to', labelFr: 'Tend vers', labelAr: 'يؤول إلى', defaultValue: '+\\infty' },
      { key: 'expr', labelFr: 'Expression', labelAr: 'الدالة', defaultValue: 'f(x)' },
    ],
    buildLatex: (v) => `\\lim_{${v.var || 'x'} \\to ${v.to || '+\\infty'}} ${v.expr || 'f(x)'}`,
    keywords: ['limite', 'lim', 'tend vers', 'infini', 'نهاية'],
  },
  {
    id: 'ana_int_bounds',
    nameFr: 'Intégrale définie',
    nameAr: 'تكامل محدد',
    descriptionFr: 'Intégrale de a à b avec bornes',
    descriptionAr: 'تكامل محدد بين طرفين a و b',
    category: 'analysis',
    subCategory: 'integrals',
    type: 'standard',
    defaultFormula: '\\int_{a}^{b} f(x)\\,dx',
    fields: [
      { key: 'from', labelFr: 'Borne bas (a)', labelAr: 'الطرف السفلي', defaultValue: 'a' },
      { key: 'to', labelFr: 'Borne haut (b)', labelAr: 'الطرف العلوي', defaultValue: 'b' },
      { key: 'expr', labelFr: 'Fonction', labelAr: 'الدالة f(x)', defaultValue: 'f(x)' },
      { key: 'var', labelFr: 'Différentielle', labelAr: 'المتغير d...', defaultValue: 'x' },
    ],
    buildLatex: (v) => `\\int_{${v.from || 'a'}}^{${v.to || 'b'}} ${v.expr || 'f(x)'}\\,d${v.var || 'x'}`,
    keywords: ['integrale', 'borne', 'aire', 'تكامل', 'محدد'],
  },
  {
    id: 'ana_sum_bounds',
    nameFr: 'Somme indexée (∑)',
    nameAr: 'رمز المجموع مع الحدود',
    descriptionFr: 'Somme de i=1 à n',
    descriptionAr: 'مجموع متتالية من حد إلى آخر',
    category: 'analysis',
    subCategory: 'sums',
    type: 'standard',
    defaultFormula: '\\sum_{i=1}^{n} a_i',
    fields: [
      { key: 'index', labelFr: 'Indice départ (ex: i=1)', labelAr: 'بداية الدليل', defaultValue: 'i=1' },
      { key: 'max', labelFr: 'Borne supérieure (n)', labelAr: 'الحد الأعلى', defaultValue: 'n' },
      { key: 'expr', labelFr: 'Terme général', labelAr: 'الحد العام', defaultValue: 'a_i' },
    ],
    buildLatex: (v) => `\\sum_{${v.index || 'i=1'}}^{${v.max || 'n'}} ${v.expr || 'a_i'}`,
    keywords: ['somme', 'sigma', 'serie', 'مجموع'],
  },

  // --- GÉOMÉTRIE (Vecteurs & Angles) ---
  {
    id: 'geo_norm_vec',
    nameFr: 'Norme d’un vecteur',
    nameAr: 'معيار المتجه',
    descriptionFr: 'Norme euclidienne ||u||',
    descriptionAr: 'معيار متجه في الفضاء أو المستوى',
    category: 'geometry',
    subCategory: 'vectors',
    type: 'standard',
    defaultFormula: '\\|\\vec{u}\\|',
    fields: [
      { key: 'vec', labelFr: 'Vecteur', labelAr: 'المتجه', defaultValue: '\\vec{u}' },
    ],
    buildLatex: (v) => `\\|${v.vec || '\\vec{u}'}\\|`,
    keywords: ['norme', 'longueur', 'معيار', 'متجه'],
  },
  {
    id: 'geo_angle_abc',
    nameFr: 'Angle chapeau',
    nameAr: 'زاوية برأس محدد',
    descriptionFr: 'Angle avec chapeau (ex: ABC)',
    descriptionAr: 'زاوية مع رمز الرأس',
    category: 'geometry',
    subCategory: 'angles',
    type: 'standard',
    defaultFormula: '\\widehat{ABC}',
    fields: [
      { key: 'pts', labelFr: 'Points de l’angle', labelAr: 'حروف الزاوية', defaultValue: 'ABC' },
    ],
    buildLatex: (v) => `\\widehat{${v.pts || 'ABC'}}`,
    keywords: ['angle', 'chapeau', 'triplet', 'زاوية'],
  },
  {
    id: 'geo_scalar_prod',
    nameFr: 'Produit scalaire',
    nameAr: 'جداء سلمي',
    descriptionFr: 'Produit scalaire de deux vecteurs u · v',
    descriptionAr: 'جداء سلمي لمتجهين',
    category: 'geometry',
    subCategory: 'vectors',
    type: 'standard',
    defaultFormula: '\\vec{u} \\cdot \\vec{v}',
    fields: [
      { key: 'u', labelFr: 'Vecteur 1', labelAr: 'المتجه الأول', defaultValue: '\\vec{u}' },
      { key: 'v', labelFr: 'Vecteur 2', labelAr: 'المتجه الثاني', defaultValue: '\\vec{v}' },
    ],
    buildLatex: (v) => `${v.u || '\\vec{u}'} \\cdot ${v.v || '\\vec{v}'}`,
    keywords: ['produit scalaire', 'scalaire', 'جداء سلمي'],
  },

  // --- PROBABILITÉS & STATISTIQUES ---
  {
    id: 'prob_cond',
    nameFr: 'Probabilité conditionnelle',
    nameAr: 'احتمال شرطي',
    descriptionFr: 'Probabilité de A sachant B',
    descriptionAr: 'احتمال A علما أن B محقق',
    category: 'probabilities',
    subCategory: 'prob',
    type: 'standard',
    defaultFormula: 'P_{B}(A) = \\frac{P(A \\cap B)}{P(B)}',
    fields: [
      { key: 'a', labelFr: 'Événement A', labelAr: 'الحدث A', defaultValue: 'A' },
      { key: 'b', labelFr: 'Condition B', labelAr: 'الشرط B', defaultValue: 'B' },
    ],
    buildLatex: (v) => `P_{${v.b || 'B'}}(${v.a || 'A'}) = \\frac{P(${v.a || 'A'} \\cap ${v.b || 'B'})}{P(${v.b || 'B'})}`,
    keywords: ['probabilite', 'conditionnelle', 'احتمال شرطي'],
  },
  {
    id: 'prob_binom',
    nameFr: 'Coefficient binomial',
    nameAr: 'المعامل الثنائي (توافيق)',
    descriptionFr: 'Nombre de combinaisons k parmi n',
    descriptionAr: 'تأليفة k من بين n عنصر',
    category: 'probabilities',
    subCategory: 'combinatorics',
    type: 'standard',
    defaultFormula: '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}',
    fields: [
      { key: 'n', labelFr: 'Total (n)', labelAr: 'المجموع n', defaultValue: 'n' },
      { key: 'k', labelFr: 'Choisis (k)', labelAr: 'المختار k', defaultValue: 'k' },
    ],
    buildLatex: (v) => `\\binom{${v.n || 'n'}}{${v.k || 'k'}}`,
    keywords: ['combinaison', 'binomial', 'parmi', 'توافيق', 'معامل'],
  },
];

// LocalStorage keys for favorites and recent items
const FAVORITES_STORAGE_KEY = 'worksheet_math_favorites';
const RECENTS_STORAGE_KEY = 'worksheet_math_recents';

const DEFAULT_FAVORITES = [
  'frac_simple',
  'sqrt_simple',
  'power_simple',
  'set_R',
  'grk_pi',
  'geo_vec_ab',
  'sys_2eq',
  'ana_sum',
  'matrix_2x2',
  'rel_le',
];

interface MathSymbolLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (formula: string) => void;
  isArabic: boolean;
}

export const MathSymbolLibraryModal: React.FC<MathSymbolLibraryModalProps> = ({
  isOpen,
  onClose,
  onInsert,
  isArabic,
}) => {
  // Main Category Navigation
  const [activeCategory, setActiveCategory] = useState<string>('favorites');
  const [searchQuery, setSearchQuery] = useState('');
  const [keepOpenMode, setKeepOpenMode] = useState(false);

  // Favorites & Recents state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  });

  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected Active Template for variable customization
  const [activeTemplate, setActiveTemplate] = useState<MathTemplateItem | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [matrixState, setMatrixState] = useState<string[][]>([
    ['a', 'b'],
    ['c', 'd'],
  ]);
  const [systemRowsState, setSystemRowsState] = useState<string[]>(['2x + y = 5', 'x - y = 1']);

  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Save favorites to storage
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Add to recents
  const recordRecent = (id: string) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((x) => x !== id);
      const next = [id, ...filtered].slice(0, 12);
      try {
        localStorage.setItem(RECENTS_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Handle escape key to close cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // When a template is chosen, populate its default state
  const handleSelectTemplate = (t: MathTemplateItem) => {
    setActiveTemplate(t);
    const initial: Record<string, string> = {};
    t.fields.forEach((f) => {
      initial[f.key] = f.defaultValue;
    });
    setTemplateValues(initial);

    if (t.type === 'matrix' && t.defaultMatrix) {
      setMatrixState(t.defaultMatrix.map((row) => [...row]));
    }
    if (t.type === 'system' && t.defaultSystemRows) {
      setSystemRowsState([...t.defaultSystemRows]);
    }
  };

  // Immediate 1-click insertion for simple symbols
  const handleInsertSymbol = (item: MathSymbolItem) => {
    const cleanFormula = item.latex || item.symbol;
    onInsert(cleanFormula);
    recordRecent(item.id);
    if (!keepOpenMode) {
      onClose();
    }
  };

  // Insert finalized template
  const handleInsertFinalTemplate = (t: MathTemplateItem) => {
    let formula = '';
    if (t.type === 'matrix') {
      formula = t.buildLatex(templateValues, matrixState);
    } else if (t.type === 'system') {
      formula = t.buildLatex(templateValues, undefined, systemRowsState);
    } else {
      formula = t.buildLatex(templateValues);
    }
    onInsert(formula);
    recordRecent(t.id);
    if (!keepOpenMode) {
      onClose();
    }
  };

  // Quick insert blank template directly
  const handleInsertBlank = (t: MathTemplateItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onInsert(t.defaultFormula);
    recordRecent(t.id);
    if (!keepOpenMode) {
      onClose();
    }
  };

  // Level 1 Categories configuration (Bilingual, French / Arabic)
  const CATEGORIES = useMemo(
    () => [
      { id: 'favorites', labelFr: '★ Favoris & Récents', labelAr: '★ المفضلة والحديثة', icon: Star },
      { id: 'symbols', labelFr: 'Symboles', labelAr: 'رموز وعمليات', icon: Sigma },
      { id: 'structures', labelFr: 'Structures', labelAr: 'كسور وجذور', icon: Layers },
      { id: 'algebra', labelFr: 'Algèbre', labelAr: 'جبر ومعادلات', icon: Sparkles },
      { id: 'sets', labelFr: 'Ensembles', labelAr: 'مجموعات ومنطق', icon: Bookmark },
      { id: 'geometry', labelFr: 'Géométrie', labelAr: 'هندسة ومتجهات', icon: HelpCircle },
      { id: 'matrices', labelFr: 'Matrices', labelAr: 'مصفوفات ومحددات', icon: Grid },
      { id: 'analysis', labelFr: 'Analyse', labelAr: 'تحليل ودوال', icon: Sigma },
      { id: 'probabilities', labelFr: 'Probabilités', labelAr: 'احتمالات وإحصاء', icon: Clock },
    ],
    []
  );

  // Filtered symbols & templates based on search or category
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // 1. If searching, search everywhere
    if (q) {
      const matchedSymbols = MATH_SYMBOLS_CATALOG.filter((s) => {
        return (
          s.nameFr.toLowerCase().includes(q) ||
          s.nameAr.toLowerCase().includes(q) ||
          s.symbol.toLowerCase().includes(q) ||
          s.latex.toLowerCase().includes(q) ||
          (s.keywords && s.keywords.some((k) => k.toLowerCase().includes(q)))
        );
      });

      const matchedTemplates = MATH_TEMPLATES_CATALOG.filter((t) => {
        return (
          t.nameFr.toLowerCase().includes(q) ||
          t.nameAr.toLowerCase().includes(q) ||
          t.descriptionFr.toLowerCase().includes(q) ||
          t.defaultFormula.toLowerCase().includes(q) ||
          (t.keywords && t.keywords.some((k) => k.toLowerCase().includes(q)))
        );
      });

      return { symbols: matchedSymbols, templates: matchedTemplates };
    }

    // 2. Favorites category
    if (activeCategory === 'favorites') {
      const favTemplates = MATH_TEMPLATES_CATALOG.filter((t) => favoriteIds.includes(t.id));
      const favSymbols = MATH_SYMBOLS_CATALOG.filter((s) => favoriteIds.includes(s.id));
      const recTemplates = MATH_TEMPLATES_CATALOG.filter((t) => recentIds.includes(t.id));
      const recSymbols = MATH_SYMBOLS_CATALOG.filter((s) => recentIds.includes(s.id));

      return {
        symbols: favSymbols,
        templates: favTemplates,
        recentSymbols: recSymbols,
        recentTemplates: recTemplates,
      };
    }

    // 3. Specific category
    const syms = MATH_SYMBOLS_CATALOG.filter((s) => s.category === activeCategory);
    const tmpls = MATH_TEMPLATES_CATALOG.filter((t) => t.category === activeCategory);
    return { symbols: syms, templates: tmpls };
  }, [searchQuery, activeCategory, favoriteIds, recentIds]);

  // Current live preview for active template
  const currentPreviewLatex = useMemo(() => {
    if (!activeTemplate) return '';
    if (activeTemplate.type === 'matrix') {
      return activeTemplate.buildLatex(templateValues, matrixState);
    }
    if (activeTemplate.type === 'system') {
      return activeTemplate.buildLatex(templateValues, undefined, systemRowsState);
    }
    return activeTemplate.buildLatex(templateValues);
  }, [activeTemplate, templateValues, matrixState, systemRowsState]);

  // Matrix Dimension helpers
  const handleAddMatrixRow = () => {
    if (matrixState.length >= 5) return;
    const colCount = matrixState[0]?.length || 2;
    const newRow = Array(colCount).fill('0');
    setMatrixState([...matrixState, newRow]);
  };

  const handleRemoveMatrixRow = () => {
    if (matrixState.length <= 1) return;
    setMatrixState(matrixState.slice(0, -1));
  };

  const handleAddMatrixCol = () => {
    if ((matrixState[0]?.length || 0) >= 5) return;
    setMatrixState(matrixState.map((row) => [...row, '0']));
  };

  const handleRemoveMatrixCol = () => {
    if ((matrixState[0]?.length || 0) <= 1) return;
    setMatrixState(matrixState.map((row) => row.slice(0, -1)));
  };

  const handleSetMatrixPreset = (rows: number, cols: number) => {
    const newM: string[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        row.push(r === c ? '1' : '0');
      }
      newM.push(row);
    }
    setMatrixState(newM);
  };

  // System Equation Rows helpers
  const handleAddSystemRow = () => {
    if (systemRowsState.length >= 5) return;
    setSystemRowsState([...systemRowsState, 'x + y = 0']);
  };

  const handleRemoveSystemRow = (idx: number) => {
    if (systemRowsState.length <= 1) return;
    setSystemRowsState(systemRowsState.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        dir={isArabic ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden max-h-[88vh] animate-in fade-in zoom-in-95 duration-150 text-slate-800"
      >
        {/* TOP BAR: Header + Search + Keep-Open toggle + Close */}
        <div className="px-4 py-3 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white flex items-center justify-between gap-3 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center border border-white/20 shadow-xs">
              <Sigma className="w-4 h-4 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">
                {isArabic ? 'المكتبة الرياضية الاحترافية' : 'Bibliothèque Mathématique'}
              </h2>
              <span className="text-[10px] text-indigo-200 font-medium block">
                {isArabic
                  ? 'انقر على أي رمز لإدراجه فورا، أو عدّل الكسر والمصفوفة بمرونة'
                  : 'Cliquez pour insérer instantanément ou personnalisez fractions & matrices'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-insert toggle */}
            <button
              type="button"
              onClick={() => setKeepOpenMode(!keepOpenMode)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                keepOpenMode
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-white/10 text-indigo-100 border-white/20 hover:bg-white/20'
              }`}
              title={
                keepOpenMode
                  ? 'Mode insertion continue actif (la fenêtre reste ouverte)'
                  : 'La fenêtre se ferme après insertion (cliquez pour garder ouvert)'
              }
            >
              {keepOpenMode ? (
                <ToggleRight className="w-3.5 h-3.5" />
              ) : (
                <ToggleLeft className="w-3.5 h-3.5" />
              )}
              <span className="text-[10px] hidden sm:inline">
                {isArabic ? 'إدراج متتالي' : 'Garder ouvert'}
              </span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Fermer (Échap)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR (Bilingual & Fast) */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search
              className={`w-3.5 h-3.5 absolute top-2.5 text-slate-400 ${
                isArabic ? 'right-3' : 'left-3'
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث بالاسم أو الرمز: كسر، جذر، مصفوفة، بي، تكامل، نهاية...'
                  : 'Rechercher : fraction, racine, matrice, pi, intégrale, limite, système...'
              }
              className={`w-full py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 ${
                isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute top-2 text-slate-400 hover:text-slate-600 p-0.5 ${
                  isArabic ? 'left-2.5' : 'right-2.5'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* LEVEL 1: HORIZONTAL CATEGORIES BAR (Word / Canva style, Compact) */}
        {!searchQuery && (
          <div className="px-3 py-1.5 bg-slate-100/80 border-b border-slate-200/80 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const isSel = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(c.id);
                    setActiveTemplate(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSel
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{isArabic ? c.labelAr : c.labelFr}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* MAIN BODY: Models & Symbols Cards Grid */}
        <div className="flex-1 overflow-y-auto p-3 min-h-[180px] max-h-[40vh] space-y-3 custom-scrollbar">
          {/* Recent Items (if on Favorites tab and not searching) */}
          {activeCategory === 'favorites' && !searchQuery && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isArabic ? 'العناصر المستخدمة حديثا' : 'Récemment utilisés'}
                </span>
              </div>
              {filteredData.recentTemplates?.length === 0 &&
              filteredData.recentSymbols?.length === 0 ? (
                <p className="text-xs text-slate-400 italic px-1 py-0.5">
                  {isArabic ? 'لا توجد عناصر حديثة بعد.' : 'Aucun élément récent pour le moment.'}
                </p>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                  {filteredData.recentTemplates?.map((t) => (
                    <button
                      key={`rec_tmpl_${t.id}`}
                      type="button"
                      onClick={() => handleSelectTemplate(t)}
                      className="p-1.5 bg-indigo-50/50 hover:bg-indigo-100/70 border border-indigo-200/70 rounded-lg text-center flex flex-col items-center justify-center transition-all cursor-pointer group"
                      title={isArabic ? t.nameAr : t.nameFr}
                    >
                      <div dir="ltr" className="text-xs text-indigo-900 font-serif">
                        <InlineMathText text={`$${t.defaultFormula}$`} />
                      </div>
                      <span className="text-[9px] text-indigo-700 truncate max-w-full font-medium mt-0.5">
                        {isArabic ? t.nameAr : t.nameFr}
                      </span>
                    </button>
                  ))}
                  {filteredData.recentSymbols?.map((s) => (
                    <button
                      key={`rec_sym_${s.id}`}
                      type="button"
                      onClick={() => handleInsertSymbol(s)}
                      className="p-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center transition-all cursor-pointer"
                      title={isArabic ? s.nameAr : s.nameFr}
                    >
                      <div dir="ltr" className="text-sm font-semibold text-slate-900">
                        <InlineMathText text={`$${s.latex || s.symbol}$`} />
                      </div>
                      <span className="text-[9px] text-slate-500 truncate max-w-full mt-0.5">
                        {isArabic ? s.nameAr : s.nameFr}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Structured Equation Templates Section */}
          {filteredData.templates && filteredData.templates.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isArabic ? 'نماذج وتراكيب قابلة للتعديل' : 'Modèles & Formules modifiables'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredData.templates.map((t) => {
                  const isFav = favoriteIds.includes(t.id);
                  const isSel = activeTemplate?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTemplate(t)}
                      className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between gap-1 cursor-pointer group ${
                        isSel
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-400/40 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          {isArabic ? t.nameAr : t.nameFr}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(t.id, e)}
                          className={`p-0.5 rounded transition-colors ${
                            isFav ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
                          }`}
                          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          <Star className="w-3 h-3 fill-current" />
                        </button>
                      </div>

                      {/* Mathematical Render Preview */}
                      <div
                        dir="ltr"
                        className="py-2 px-1 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-center min-h-[44px] text-indigo-900 font-serif overflow-x-auto"
                      >
                        <InlineMathText text={`$${t.defaultFormula}$`} />
                      </div>

                      {/* Fast Blank Insert button on hover */}
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[9px] text-slate-400 truncate">
                          {isArabic ? 'تخصيص' : 'Personnaliser'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleInsertBlank(t, e)}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded transition-colors"
                          title="Insérer le modèle vierge directement"
                        >
                          {isArabic ? 'إدراج مباشر' : '+ Direct'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Single Math Symbols Section */}
          {filteredData.symbols && filteredData.symbols.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                <Sigma className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isArabic
                    ? 'رموز وعمليات رياضية (إدراج بنقرة واحدة)'
                    : 'Symboles (clic direct pour insérer)'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                {filteredData.symbols.map((s) => {
                  const isFav = favoriteIds.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleInsertSymbol(s)}
                      className="p-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center transition-all cursor-pointer relative group"
                      title={`${isArabic ? s.nameAr : s.nameFr} (${s.latex || s.symbol})`}
                    >
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(s.id, e)}
                        className={`absolute top-0.5 right-0.5 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isFav ? 'opacity-100 text-amber-500' : 'text-slate-300 hover:text-amber-400'
                        }`}
                      >
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </button>
                      <div dir="ltr" className="text-base font-medium text-slate-900 leading-tight">
                        <InlineMathText text={`$${s.latex || s.symbol}$`} />
                      </div>
                      <span className="text-[9px] text-slate-500 truncate max-w-full mt-0.5">
                        {isArabic ? s.nameAr : s.nameFr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredData.templates.length === 0 && filteredData.symbols.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              {isArabic
                ? 'لم يتم العثور على أي رمز أو معادلة مطابقة للبحث.'
                : 'Aucun symbole ou modèle ne correspond à votre recherche.'}
            </div>
          )}
        </div>

        {/* CONTEXTUAL CONFIGURATION PANEL (Compact, Integrated, Canva/Word Style) */}
        {activeTemplate && (
          <div className="p-3 bg-slate-50 border-t border-slate-200/90 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  {isArabic ? activeTemplate.nameAr : activeTemplate.nameFr}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                  {isArabic ? 'تعديل العناصر' : 'Personnalisation directe'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Fermer ce panneau"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* FRACTION CASE: Side-by-side inputs (Numérateur / Dénominateur) */}
            {activeTemplate.type === 'fraction' && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-[120px]">
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    {isArabic ? 'البسط' : 'Numérateur'}
                  </label>
                  <input
                    type="text"
                    value={templateValues['num'] || ''}
                    onChange={(e) =>
                      setTemplateValues({ ...templateValues, num: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                    placeholder="a"
                  />
                </div>
                <span className="text-slate-400 font-bold self-end pb-1.5">/</span>
                <div className="flex-1 min-w-[120px]">
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    {isArabic ? 'المقام' : 'Dénominateur'}
                  </label>
                  <input
                    type="text"
                    value={templateValues['den'] || ''}
                    onChange={(e) =>
                      setTemplateValues({ ...templateValues, den: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                    placeholder="b"
                  />
                </div>
              </div>
            )}

            {/* MATRIX CASE: Interactive Grid L1 C1 C2... with Tab navigation & Dimension controls */}
            {activeTemplate.type === 'matrix' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-1.5 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-600">
                      {isArabic ? 'أبعاد المصفوفة :' : 'Dimensions :'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSetMatrixPreset(2, 2)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      2×2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetMatrixPreset(3, 3)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      3×3
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetMatrixPreset(3, 1)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      3×1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetMatrixPreset(1, 3)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      1×3
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleAddMatrixRow}
                      disabled={matrixState.length >= 5}
                      className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200 disabled:opacity-30"
                    >
                      + {isArabic ? 'سطر' : 'Ligne'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveMatrixRow}
                      disabled={matrixState.length <= 1}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold disabled:opacity-30"
                    >
                      - {isArabic ? 'سطر' : 'Ligne'}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddMatrixCol}
                      disabled={(matrixState[0]?.length || 0) >= 5}
                      className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200 disabled:opacity-30"
                    >
                      + {isArabic ? 'عمود' : 'Colonne'}
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveMatrixCol}
                      disabled={(matrixState[0]?.length || 0) <= 1}
                      className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold disabled:opacity-30"
                    >
                      - {isArabic ? 'عمود' : 'Colonne'}
                    </button>
                  </div>
                </div>

                {/* The Editable Matrix Grid */}
                <div className="p-2 bg-white rounded-xl border border-slate-200 inline-block overflow-x-auto max-w-full">
                  <div
                    className="grid gap-1.5"
                    style={{
                      gridTemplateColumns: `repeat(${matrixState[0]?.length || 2}, minmax(40px, 1fr))`,
                    }}
                  >
                    {matrixState.map((row, rIdx) =>
                      row.map((cellVal, cIdx) => (
                        <input
                          key={`cell_${rIdx}_${cIdx}`}
                          type="text"
                          value={cellVal}
                          onChange={(e) => {
                            const nextM = matrixState.map((r, ri) =>
                              ri === rIdx
                                ? r.map((c, ci) => (ci === cIdx ? e.target.value : c))
                                : r
                            );
                            setMatrixState(nextM);
                          }}
                          className="w-12 h-7 px-1 text-center text-xs font-mono bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM OF EQUATIONS CASE: Editable Rows with [+] and [-] */}
            {activeTemplate.type === 'system' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600">
                    {isArabic ? 'معادلات النظمة :' : 'Équations du système :'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddSystemRow}
                    disabled={systemRowsState.length >= 5}
                    className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-200"
                  >
                    + {isArabic ? 'إضافة معادلة' : 'Ajouter équation'}
                  </button>
                </div>
                <div className="space-y-1">
                  {systemRowsState.map((rowText, idx) => (
                    <div key={`sys_row_${idx}`} className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 w-5 text-center">
                        L{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={rowText}
                        onChange={(e) => {
                          const nextRows = [...systemRowsState];
                          nextRows[idx] = e.target.value;
                          setSystemRowsState(nextRows);
                        }}
                        className="flex-1 px-2 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                      />
                      {systemRowsState.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSystemRow(idx)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                          title="Supprimer cette équation"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STANDARD TEMPLATE CASE: Side-by-side inputs for fields */}
            {activeTemplate.type === 'standard' && activeTemplate.fields.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {activeTemplate.fields.map((f) => (
                  <div key={f.key} className="flex-1 min-w-[100px]">
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                      {isArabic ? f.labelAr : f.labelFr}
                    </label>
                    <input
                      type="text"
                      value={templateValues[f.key] || ''}
                      onChange={(e) =>
                        setTemplateValues({ ...templateValues, [f.key]: e.target.value })
                      }
                      placeholder={f.placeholder || f.defaultValue}
                      className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Compact Live Render + Insert Action */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isArabic ? 'المعاينة :' : 'Aperçu :'}
                </span>
                <div
                  dir="ltr"
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-indigo-900 font-serif font-medium"
                >
                  <InlineMathText text={`$${currentPreviewLatex}$`} />
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleInsertFinalTemplate(activeTemplate)}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إدراج في التمرين' : 'Insérer dans le document'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
