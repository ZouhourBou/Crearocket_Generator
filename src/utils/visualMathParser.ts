/**
 * visualMathParser.ts
 *
 * Robust AST parser and serializer converting document text containing $math$ formulas
 * into interactive visual widgets (Fractions, Matrices, Systems, Roots, Powers, Limits, Integrals)
 * and back to standard LaTeX text.
 */

export type MathStructureType =
  | 'fraction'
  | 'matrix'
  | 'cases'
  | 'sqrt'
  | 'power_sub'
  | 'integral'
  | 'sum'
  | 'limit'
  | 'vector'
  | 'general';

export interface FractionItem {
  type: 'fraction';
  id: string;
  prefix?: string;
  numerator: string;
  denominator: string;
  suffix?: string;
}

export interface MatrixItem {
  type: 'matrix';
  id: string;
  matrixType: 'pmatrix' | 'bmatrix' | 'vmatrix'; // ( ) or [ ] or | |
  rows: string[][];
  prefix?: string;
  suffix?: string;
}

export interface CasesItem {
  type: 'cases';
  id: string;
  equations: string[];
  prefix?: string;
  suffix?: string;
}

export interface SqrtItem {
  type: 'sqrt';
  id: string;
  prefix?: string;
  nth?: string;
  radicand: string;
  suffix?: string;
}

export interface PowerSubItem {
  type: 'power_sub';
  id: string;
  prefix?: string;
  base: string;
  exponent?: string;
  subscript?: string;
  suffix?: string;
}

export interface IntegralItem {
  type: 'integral';
  id: string;
  prefix?: string;
  lower: string;
  upper: string;
  expression: string;
  suffix?: string;
}

export interface SumItem {
  type: 'sum';
  id: string;
  prefix?: string;
  lower: string;
  upper: string;
  expression: string;
  suffix?: string;
}

export interface LimitItem {
  type: 'limit';
  id: string;
  prefix?: string;
  target: string;
  expression: string;
  suffix?: string;
}

export interface VectorItem {
  type: 'vector';
  id: string;
  prefix?: string;
  name: string;
  suffix?: string;
}

export interface GeneralMathItem {
  type: 'general';
  id: string;
  expression: string;
}

export type MathItem =
  | FractionItem
  | MatrixItem
  | CasesItem
  | SqrtItem
  | PowerSubItem
  | IntegralItem
  | SumItem
  | LimitItem
  | VectorItem
  | GeneralMathItem;

export type DocumentSegment =
  | { type: 'text'; id: string; text: string }
  | { type: 'math'; id: string; raw: string; item: MathItem };

/**
 * Generate unique IDs for interactive inputs and items
 */
export function generateMathId(prefix = 'm'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Parses an individual formula string (without enclosing $) into a structured MathItem
 */
export function parseFormula(rawFormula: string): MathItem {
  const raw = rawFormula.trim();
  const id = generateMathId('item');

  // 1. Matrices: \begin{pmatrix|bmatrix|vmatrix} ... \end{...}
  const matrixMatch = raw.match(/^(?:([^\\]*?)\s*)?\\begin\{(pmatrix|bmatrix|vmatrix)\}([\s\S]*?)\\end\{\1\}(?:\s*(.*?))?$/);
  if (matrixMatch) {
    const prefix = matrixMatch[1]?.trim() || undefined;
    const mType = matrixMatch[2] as 'pmatrix' | 'bmatrix' | 'vmatrix';
    const body = matrixMatch[3];
    const suffix = matrixMatch[4]?.trim() || undefined;

    const rowStrings = body.split('\\\\').map((r) => r.trim()).filter((r) => r.length > 0);
    const rows = rowStrings.map((row) =>
      row.split('&').map((c) => c.trim())
    );

    return {
      type: 'matrix',
      id,
      matrixType: mType,
      rows: rows.length > 0 ? rows : [['', ''], ['', '']],
      prefix,
      suffix,
    };
  }

  // 2. Systems: \begin{cases} ... \end{cases}
  const casesMatch = raw.match(/^(?:([^\\]*?)\s*)?\\begin\{cases\}([\s\S]*?)\\end\{cases\}(?:\s*(.*?))?$/);
  if (casesMatch) {
    const prefix = casesMatch[1]?.trim() || undefined;
    const body = casesMatch[2];
    const suffix = casesMatch[3]?.trim() || undefined;
    const equations = body.split('\\\\').map((e) => e.trim()).filter(Boolean);

    return {
      type: 'cases',
      id,
      equations: equations.length > 0 ? equations : ['2x + y = 5', 'x - y = 1'],
      prefix,
      suffix,
    };
  }

  // 3. Simple Fraction: \frac{num}{den} (allowing optional prefix and suffix, e.g. "A = \frac{2x+3}{x-1}")
  const fracMatch = raw.match(/^(.*?)\\frac\{([^{}]+|\{[^{}]*\})\}\{([^{}]+|\{[^{}]*\})\}(.*?)$/);
  if (fracMatch) {
    const prefix = fracMatch[1]?.trim() || undefined;
    const numerator = fracMatch[2]?.trim() || '';
    const denominator = fracMatch[3]?.trim() || '';
    const suffix = fracMatch[4]?.trim() || undefined;

    return {
      type: 'fraction',
      id,
      prefix,
      numerator,
      denominator,
      suffix,
    };
  }

  // 4. Square / nth Roots: \sqrt[n]{content} or \sqrt{content}
  const sqrtMatch = raw.match(/^(.*?)\\sqrt(?:\[([^\]]+)\])?\{([^}]+)\}(.*?)$/);
  if (sqrtMatch) {
    const prefix = sqrtMatch[1]?.trim() || undefined;
    const nth = sqrtMatch[2]?.trim() || undefined;
    const radicand = sqrtMatch[3]?.trim() || '';
    const suffix = sqrtMatch[4]?.trim() || undefined;

    return {
      type: 'sqrt',
      id,
      prefix,
      nth,
      radicand,
      suffix,
    };
  }

  // 5. Limits: \lim_{x\to ...} expr
  const limMatch = raw.match(/^(.*?)\\lim_\{([^}]+)\}\s*(.*?)$/);
  if (limMatch) {
    return {
      type: 'limit',
      id,
      prefix: limMatch[1]?.trim() || undefined,
      target: limMatch[2]?.trim() || 'x \\to +\\infty',
      expression: limMatch[3]?.trim() || 'f(x)',
    };
  }

  // 6. Integrals: \int_{lower}^{upper} expr
  const intMatch = raw.match(/^(.*?)\\int_\{([^}]+)\}\^\{([^}]+)\}\s*(.*?)$/);
  if (intMatch) {
    return {
      type: 'integral',
      id,
      prefix: intMatch[1]?.trim() || undefined,
      lower: intMatch[2]?.trim() || 'a',
      upper: intMatch[3]?.trim() || 'b',
      expression: intMatch[4]?.trim() || 'f(x)\\,dx',
    };
  }

  // 7. Sums: \sum_{lower}^{upper} expr
  const sumMatch = raw.match(/^(.*?)\\sum_\{([^}]+)\}\^\{([^}]+)\}\s*(.*?)$/);
  if (sumMatch) {
    return {
      type: 'sum',
      id,
      prefix: sumMatch[1]?.trim() || undefined,
      lower: sumMatch[2]?.trim() || 'i=1',
      upper: sumMatch[3]?.trim() || 'n',
      expression: sumMatch[4]?.trim() || 'i',
    };
  }

  // 8. Vector: \vec{AB}
  const vecMatch = raw.match(/^(.*?)\\vec\{([^}]+)\}(.*?)$/);
  if (vecMatch) {
    return {
      type: 'vector',
      id,
      prefix: vecMatch[1]?.trim() || undefined,
      name: vecMatch[2]?.trim() || 'u',
      suffix: vecMatch[3]?.trim() || undefined,
    };
  }

  // 9. Simple Power or Subscript: e.g. x^{2} or x_{n} or x_{i}^{2}
  const powerSubMatch = raw.match(/^([A-Za-z0-9\(\)]+)(?:_\{([^}]+)\}|_([0-9a-zA-Z]))?(?:\^\{([^}]+)\}|\^([0-9a-zA-Z]))?$/);
  if (powerSubMatch && (powerSubMatch[2] || powerSubMatch[3] || powerSubMatch[4] || powerSubMatch[5])) {
    return {
      type: 'power_sub',
      id,
      base: powerSubMatch[1] || 'x',
      subscript: powerSubMatch[2] || powerSubMatch[3] || undefined,
      exponent: powerSubMatch[4] || powerSubMatch[5] || undefined,
    };
  }

  // 10. General math expression (e.g. 2x + 5 = 15, \alpha + \beta, \in \mathbb{R})
  return {
    type: 'general',
    id,
    expression: raw,
  };
}

/**
 * Serializes a MathItem back into standard LaTeX
 */
export function serializeMathItem(item: MathItem): string {
  switch (item.type) {
    case 'fraction': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      return `${p}\\frac{${item.numerator || 'a'}}{${item.denominator || 'b'}}${s}`.trim();
    }
    case 'matrix': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      const body = item.rows
        .map((row) => row.join(' & '))
        .join(' \\\\ ');
      return `${p}\\begin{${item.matrixType}} ${body} \\end{${item.matrixType}}${s}`.trim();
    }
    case 'cases': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      const body = item.equations.join(' \\\\ ');
      return `${p}\\begin{cases} ${body} \\end{cases}${s}`.trim();
    }
    case 'sqrt': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      const nth = item.nth ? `[${item.nth}]` : '';
      return `${p}\\sqrt${nth}{${item.radicand || 'x'}}${s}`.trim();
    }
    case 'power_sub': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      const sub = item.subscript ? `_{${item.subscript}}` : '';
      const exp = item.exponent ? `^{${item.exponent}}` : '';
      return `${p}${item.base}${sub}${exp}${s}`.trim();
    }
    case 'integral': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      return `${p}\\int_{${item.lower}}^{${item.upper}} ${item.expression}${s}`.trim();
    }
    case 'sum': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      return `${p}\\sum_{${item.lower}}^{${item.upper}} ${item.expression}${s}`.trim();
    }
    case 'limit': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      return `${p}\\lim_{${item.target}} ${item.expression}${s}`.trim();
    }
    case 'vector': {
      const p = item.prefix ? `${item.prefix} ` : '';
      const s = item.suffix ? ` ${item.suffix}` : '';
      return `${p}\\vec{${item.name}}${s}`.trim();
    }
    case 'general':
      return item.expression.trim();
  }
}

/**
 * Splits raw document text into text segments and math item segments.
 * Math formulas are delimited by $...$ or $$...$$
 */
export function parseTextToSegments(fullText: string): DocumentSegment[] {
  if (!fullText) return [];

  const segments: DocumentSegment[] = [];
  // Matches either $$...$$ or $...$
  const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(fullText)) !== null) {
    // Text before the formula
    if (match.index > lastIndex) {
      const textPiece = fullText.substring(lastIndex, match.index);
      segments.push({
        type: 'text',
        id: generateMathId('txt'),
        text: textPiece,
      });
    }

    const rawMatch = match[0];
    const isDouble = rawMatch.startsWith('$$');
    const formulaContent = isDouble
      ? rawMatch.slice(2, -2)
      : rawMatch.slice(1, -1);

    const parsedItem = parseFormula(formulaContent);

    segments.push({
      type: 'math',
      id: parsedItem.id,
      raw: formulaContent,
      item: parsedItem,
    });

    lastIndex = match.index + rawMatch.length;
  }

  // Trailing text
  if (lastIndex < fullText.length) {
    segments.push({
      type: 'text',
      id: generateMathId('txt'),
      text: fullText.substring(lastIndex),
    });
  }

  return segments;
}

/**
 * Serializes all document segments back into a single string for storage and KaTeX rendering.
 */
export function serializeSegmentsToText(segments: DocumentSegment[]): string {
  return segments
    .map((seg) => {
      if (seg.type === 'text') {
        return seg.text;
      }
      const serialized = serializeMathItem(seg.item);
      return `$${serialized}$`;
    })
    .join('');
}

// -------------------------------------------------------------
// WYSIWYG DOCUMENT STRUCTURE (Word/Canva Architecture)
// Document -> Blocks (Paragraphs & Display Math Blocks)
// Paragraph -> Inline Segments (Text & Inline Math Widgets)
// -------------------------------------------------------------

export interface WysiwygInlineSegment {
  id: string;
  type: 'text' | 'inline-math';
  text?: string;
  mathItem?: MathItem;
  rawLatex?: string;
}

export interface WysiwygParagraphBlock {
  id: string;
  type: 'paragraph';
  segments: WysiwygInlineSegment[];
}

export interface WysiwygDisplayMathBlock {
  id: string;
  type: 'display-math';
  item: MathItem;
  alignment: 'center' | 'left' | 'right';
  rawLatex?: string;
}

export type WysiwygBlock = WysiwygParagraphBlock | WysiwygDisplayMathBlock;

/**
 * Checks if a formula string represents an inherently multi-line/display structure
 * like a matrix or system of equations
 */
export function isInherentlyDisplayFormula(rawFormula: string): boolean {
  return (
    rawFormula.includes('\\begin{pmatrix}') ||
    rawFormula.includes('\\begin{bmatrix}') ||
    rawFormula.includes('\\begin{vmatrix}') ||
    rawFormula.includes('\\begin{cases}')
  );
}

/**
 * Parses a paragraph's single line of text into inline text and math segments
 */
export function parseParagraphLineToSegments(lineText: string): WysiwygInlineSegment[] {
  if (!lineText) {
    return [{ id: generateMathId('txt'), type: 'text', text: '' }];
  }

  const segments: WysiwygInlineSegment[] = [];
  const inlineRegex = /\$([^\$]+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(lineText)) !== null) {
    // Leading text
    if (match.index > lastIndex) {
      segments.push({
        id: generateMathId('txt'),
        type: 'text',
        text: lineText.substring(lastIndex, match.index),
      });
    }

    const formulaContent = match[1];
    const parsed = parseFormula(formulaContent);
    segments.push({
      id: parsed.id || generateMathId('math'),
      type: 'inline-math',
      mathItem: parsed,
      rawLatex: formulaContent,
    });

    lastIndex = match.index + match[0].length;
  }

  // Trailing text
  if (lastIndex < lineText.length) {
    segments.push({
      id: generateMathId('txt'),
      type: 'text',
      text: lineText.substring(lastIndex),
    });
  }

  if (segments.length === 0) {
    segments.push({ id: generateMathId('txt'), type: 'text', text: '' });
  }

  return segments;
}

/**
 * Parses full raw document text into high-level WYSIWYG blocks:
 * Paragraphs (with inline text & math) and Display Math Blocks (matrices, systems, standalone formulas).
 */
export function parseDocumentTextToWysiwygBlocks(fullText: string): WysiwygBlock[] {
  if (!fullText || fullText.trim() === '') {
    return [
      {
        id: generateMathId('p'),
        type: 'paragraph',
        segments: [{ id: generateMathId('txt'), type: 'text', text: '' }],
      },
    ];
  }

  const blocks: WysiwygBlock[] = [];

  // Match either $$...$$ or single $ containing a matrix/cases
  const displayRegex = /(\$\$[\s\S]*?\$\$|\$(?:[^\$\\]*?\\begin\{(?:pmatrix|bmatrix|vmatrix|cases)\}[\s\S]*?\\end\{(?:pmatrix|bmatrix|vmatrix|cases)\}[^\$]*?)\$)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = displayRegex.exec(fullText)) !== null) {
    // Text preceding this display block
    if (match.index > lastIndex) {
      const textPiece = fullText.substring(lastIndex, match.index);
      const lines = textPiece.split('\n');

      lines.forEach((line, lIdx) => {
        // If last element of textPiece ends with newline and is adjacent to display math, avoid empty artifacts
        if (lIdx === lines.length - 1 && line.trim() === '' && lIdx > 0) {
          return;
        }
        if (lIdx === 0 && line.trim() === '' && blocks.length > 0) {
          return;
        }
        blocks.push({
          id: generateMathId('p'),
          type: 'paragraph',
          segments: parseParagraphLineToSegments(line),
        });
      });
    }

    const rawMatch = match[0];
    const isDouble = rawMatch.startsWith('$$');
    const formulaContent = isDouble
      ? rawMatch.slice(2, -2).trim()
      : rawMatch.slice(1, -1).trim();

    const parsedItem = parseFormula(formulaContent);
    blocks.push({
      id: generateMathId('disp'),
      type: 'display-math',
      item: parsedItem,
      alignment: 'center',
      rawLatex: formulaContent,
    });

    lastIndex = match.index + rawMatch.length;
  }

  // Trailing text after the last display block
  if (lastIndex < fullText.length) {
    const trailingPiece = fullText.substring(lastIndex);
    const lines = trailingPiece.split('\n');

    lines.forEach((line, lIdx) => {
      if (lIdx === 0 && line.trim() === '' && blocks.length > 0) {
        return;
      }
      blocks.push({
        id: generateMathId('p'),
        type: 'paragraph',
        segments: parseParagraphLineToSegments(line),
      });
    });
  }

  // Guarantee at least one block exists
  if (blocks.length === 0) {
    blocks.push({
      id: generateMathId('p'),
      type: 'paragraph',
      segments: [{ id: generateMathId('txt'), type: 'text', text: '' }],
    });
  }

  return blocks;
}

/**
 * Serializes all WYSIWYG document blocks back into clean LaTeX string for storage,
 * KaTeX vector rendering and PDF export.
 */
export function serializeWysiwygBlocksToDocumentText(blocks: WysiwygBlock[]): string {
  if (!blocks || blocks.length === 0) return '';

  const chunks: string[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === 'paragraph') {
      const lineStr = block.segments
        .map((seg) => {
          if (seg.type === 'text') {
            return seg.text ?? '';
          }
          const mathCode = serializeMathItem(seg.mathItem!);
          return `$${mathCode}$`;
        })
        .join('');
      chunks.push(lineStr);
    } else if (block.type === 'display-math') {
      const mathCode = serializeMathItem(block.item);
      chunks.push(`$$ ${mathCode} $$`);
    }
  }

  return chunks.join('\n');
}

