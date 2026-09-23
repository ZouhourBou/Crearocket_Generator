import React from 'react';

interface InlineMathTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  blankStyle?: 'solid' | 'dotted';
  blankThickness?: number;
  blankLengthPreset?: 'short' | 'medium' | 'long' | string;
  onEquationClick?: (rawFormula: string) => void;
}

const LATEX_SYMBOLS_MAP: Record<string, string> = {
  '\\alpha': 'α',
  '\\beta': 'β',
  '\\gamma': 'γ',
  '\\delta': 'δ',
  '\\epsilon': 'ε',
  '\\theta': 'θ',
  '\\lambda': 'λ',
  '\\mu': 'μ',
  '\\pi': 'π',
  '\\sigma': 'σ',
  '\\omega': 'ω',
  '\\Delta': 'Δ',
  '\\Sigma': 'Σ',
  '\\Omega': 'Ω',
  '\\le': '≤',
  '\\leq': '≤',
  '\\ge': '≥',
  '\\geq': '≥',
  '\\ne': '≠',
  '\\neq': '≠',
  '\\approx': '≈',
  '\\pm': '±',
  '\\times': '×',
  '\\div': '÷',
  '\\cdot': '·',
  '\\in': '∈',
  '\\notin': '∉',
  '\\subset': '⊂',
  '\\subseteq': '⊆',
  '\\cup': '∪',
  '\\cap': '∩',
  '\\emptyset': '∅',
  '\\infty': '∞',
  '\\to': '→',
  '\\rightarrow': '→',
  '\\Rightarrow': '⇒',
  '\\Leftrightarrow': '⇔',
  '\\leftrightarrow': '↔',
  '\\mathbb{R}': 'ℝ',
  '\\mathbb{N}': 'ℕ',
  '\\mathbb{Z}': 'ℤ',
  '\\mathbb{Q}': 'ℚ',
  '\\mathbb{C}': 'ℂ',
  '\\mathbb{D}': '𝔻',
  '\\quad': '  ',
  '\\,': ' ',
};

export const InlineMathText: React.FC<InlineMathTextProps> = ({
  text,
  className = '',
  style,
  blankStyle = 'solid',
  blankThickness = 1.5,
  blankLengthPreset = 'medium',
  onEquationClick,
}) => {
  if (!text) return null;

  const getPresetWidth = (preset?: 'short' | 'medium' | 'long' | string, customLen?: string) => {
    if (customLen === 's' || customLen === 'short') return '42px';
    if (customLen === 'l' || customLen === 'long') return '150px';
    if (customLen === 'm' || customLen === 'medium') return '85px';

    if (preset === 'short') return '42px';
    if (preset === 'long') return '150px';
    return '85px';
  };

  const defaultWidth = getPresetWidth(blankLengthPreset);

  const renderBlank = (key: string, width: string = defaultWidth) => (
    <span
      key={key}
      className="inline-block align-baseline mx-1 align-bottom"
      style={{
        borderBottomStyle: blankStyle,
        borderBottomWidth: `${blankThickness}px`,
        borderBottomColor: 'currentColor',
        width,
        minWidth: width,
        height: '0.85em',
        verticalAlign: '-0.15em',
      }}
    />
  );

  // Replace LaTeX symbols with Unicode
  const replaceLatexSymbols = (raw: string): string => {
    let res = raw;
    for (const [k, v] of Object.entries(LATEX_SYMBOLS_MAP)) {
      res = res.split(k).join(v);
    }
    return res;
  };

  // Render recursive math formula expression
  const renderFormulaContent = (formulaStr: string, keyPrefix: string): React.ReactNode => {
    let clean = formulaStr.trim();

    // 1. Matrix: \begin{pmatrix} a & b \\ c & d \end{pmatrix} or \begin{vmatrix} ...
    const matrixMatch = clean.match(/^\\begin\{(pmatrix|vmatrix|bmatrix)\}([\s\S]*?)\\end\{\1\}$/);
    if (matrixMatch) {
      const type = matrixMatch[1];
      const body = matrixMatch[2];
      const rows = body.split('\\\\').map((r) => r.split('&').map((c) => c.trim()));
      const isDet = type === 'vmatrix';

      return (
        <span
          key={`${keyPrefix}_matrix`}
          className="inline-flex items-center align-middle mx-1 font-sans text-[0.88em]"
          style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
        >
          <span className={`text-lg font-light ${isDet ? 'border-l border-current px-0.5' : 'text-slate-500'}`}>
            {isDet ? '' : '('}
          </span>
          <span className="inline-grid gap-x-2 gap-y-0.5 text-center px-1">
            {rows.map((row, rIdx) => (
              <span key={`r_${rIdx}`} className="flex items-center justify-center gap-2">
                {row.map((cell, cIdx) => (
                  <span key={`c_${cIdx}`} className="px-1 font-medium">
                    {renderFormulaContent(cell, `${keyPrefix}_m_${rIdx}_${cIdx}`)}
                  </span>
                ))}
              </span>
            ))}
          </span>
          <span className={`text-lg font-light ${isDet ? 'border-r border-current px-0.5' : 'text-slate-500'}`}>
            {isDet ? '' : ')'}
          </span>
        </span>
      );
    }

    // 2. Systems: \begin{cases} eq1 \\ eq2 \end{cases}
    const casesMatch = clean.match(/^\\begin\{cases\}([\s\S]*?)\\end\{cases\}$/);
    if (casesMatch) {
      const equations = casesMatch[1].split('\\\\').map((e) => e.trim()).filter(Boolean);
      return (
        <span
          key={`${keyPrefix}_cases`}
          className="inline-flex items-center align-middle mx-1.5 font-sans"
          style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
        >
          <span className="text-2xl font-light text-slate-700 leading-none mr-1 select-none">
            {'{'}
          </span>
          <span className="inline-flex flex-col gap-0.5 text-left text-xs font-medium">
            {equations.map((eq, eqIdx) => (
              <span key={`eq_${eqIdx}`} className="whitespace-nowrap">
                {renderFormulaContent(eq, `${keyPrefix}_eq_${eqIdx}`)}
              </span>
            ))}
          </span>
        </span>
      );
    }

    // 3. Simple tokens inside formula:
    // Support fractions \frac{n}{d}, roots \sqrt[n]{x} or \sqrt{x}, \vec{u}, powers, subscripts, symbols
    const subTokenRegex =
      /(\\frac\{([^{}]+|\{[^{}]*\})\}\{([^{}]+|\{[^{}]*\})\})|(\\sqrt(?:\[([^\]]+)\])?\{([^}]+)\})|(\\vec\{([^}]+)\})|(\^\{([^}]+)\}|\^([0-9a-zA-Z+−-]+))|(_\{([^}]+)\}|(?<!_)_([0-9a-zA-Z+−-]+)(?!_))|(\|[A-Za-z0-9_+\-−\s\\]+\|)/g;

    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let match: RegExpExecArray | null;
    let subCount = 0;

    while ((match = subTokenRegex.exec(clean)) !== null) {
      if (match.index > lastIdx) {
        const plain = clean.substring(lastIdx, match.index);
        parts.push(
          <span key={`f_txt_${subCount++}`}>{replaceLatexSymbols(plain)}</span>
        );
      }

      if (match[1]) {
        // \frac{num}{den}
        const num = match[2];
        const den = match[3];
        parts.push(
          <span
            key={`f_frac_${subCount++}`}
            className="inline-flex flex-col items-center justify-center align-middle mx-0.5 text-[0.85em] font-sans font-medium"
            style={{ verticalAlign: '-0.45em', lineHeight: 1 }}
          >
            <span className="border-b border-current px-0.5 pb-[1px] leading-tight text-center">
              {renderFormulaContent(num, `${keyPrefix}_n_${subCount}`)}
            </span>
            <span className="px-0.5 pt-[1px] leading-tight text-center">
              {renderFormulaContent(den, `${keyPrefix}_d_${subCount}`)}
            </span>
          </span>
        );
      } else if (match[4]) {
        // \sqrt[n]{content} or \sqrt{content}
        const nth = match[5];
        const content = match[6];
        parts.push(
          <span
            key={`f_sqrt_${subCount++}`}
            className="inline-flex items-center mx-0.5 font-sans"
            style={{ verticalAlign: '-0.1em' }}
          >
            {nth && (
              <sup className="text-[0.65em] font-medium -mr-1 z-10">{nth}</sup>
            )}
            <span className="text-[1.15em] font-light leading-none mr-[1px]">√</span>
            <span className="border-t border-current px-0.5 leading-none">
              {renderFormulaContent(content, `${keyPrefix}_sqrt_${subCount}`)}
            </span>
          </span>
        );
      } else if (match[7]) {
        // \vec{AB}
        const vecName = match[8];
        parts.push(
          <span
            key={`f_vec_${subCount++}`}
            className="inline-flex flex-col items-center mx-0.5 font-sans"
            style={{ verticalAlign: '-0.2em' }}
          >
            <span className="text-[0.65em] leading-none text-current font-bold select-none -mb-0.5">
              →
            </span>
            <span className="font-semibold italic text-[0.9em]">{vecName}</span>
          </span>
        );
      } else if (match[9]) {
        // Power ^{...}
        const p = match[10] || match[11];
        parts.push(
          <sup key={`f_sup_${subCount++}`} className="text-[0.75em] font-medium leading-none ml-[0.5px]">
            {p}
          </sup>
        );
      } else if (match[12]) {
        // Subscript _{...}
        const s = match[13] || match[14];
        parts.push(
          <sub key={`f_sub_${subCount++}`} className="text-[0.75em] font-medium leading-none ml-[0.5px]">
            {s}
          </sub>
        );
      } else if (match[15]) {
        // Absolute value |x|
        parts.push(
          <span key={`f_abs_${subCount++}`} className="font-sans font-medium px-0.5">
            {match[15]}
          </span>
        );
      }

      lastIdx = subTokenRegex.lastIndex;
    }

    if (lastIdx < clean.length) {
      parts.push(
        <span key={`f_end_${subCount++}`}>{replaceLatexSymbols(clean.substring(lastIdx))}</span>
      );
    }

    return parts.length > 0 ? parts : replaceLatexSymbols(clean);
  };

  // Render text containing blanks: handles "___", "[___]", "\blank{...}"
  const renderTextWithBlanks = (rawText: string, keyPrefix: string) => {
    const blankRegex = /(\\blank\{([smlSML])\})|(\[_{2,}\])|(_{3,})/g;
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    let bMatch: RegExpExecArray | null;
    let bCounter = 0;

    while ((bMatch = blankRegex.exec(rawText)) !== null) {
      if (bMatch.index > lastIdx) {
        parts.push(rawText.substring(lastIdx, bMatch.index));
      }

      let w = defaultWidth;
      if (bMatch[1]) {
        w = getPresetWidth(undefined, bMatch[2]?.toLowerCase());
      } else if (bMatch[4]) {
        const len = bMatch[4].length;
        if (len <= 4) w = '45px';
        else if (len <= 8) w = '90px';
        else w = '160px';
      }

      parts.push(renderBlank(`${keyPrefix}_blk_${bCounter++}`, w));
      lastIdx = blankRegex.lastIndex;
    }

    if (lastIdx < rawText.length) {
      parts.push(rawText.substring(lastIdx));
    }

    return parts;
  };

  // Main formatting loop across lines
  const renderFormatted = (str: string) => {
    const lines = str.split('\n');

    return lines.map((line, lineIdx) => {
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;

      // Master regex matching:
      // 1. $...$ Explicit math formula
      // 2. \begin{cases}...\end{cases} System of equations
      // 3. \begin{pmatrix/vmatrix}...\end{...} Matrices/Determinants
      // 4. Point coordinates e.g. "K(100 ; 300)", "A(-200 ; 300)", "M(x ; y)"
      // 5. Fractions \frac{...}{...}
      // 6. Square roots \sqrt[n]{...} or \sqrt{...} or √(16) or √9 or 9√+16√
      // 7. Vectors \vec{...}
      // 8. Powers: ^{...} or ^token
      // 9. Subscripts: _{...} or _token
      // 10. Blanks \blank{...} or 3+ underscores
      // 11. Compound math equations / operations: e.g. "13 − 5 × 13", "13⁴ × 13⁹ = 13¹³", "ab = 1", "a = -1/b", "x ≤ 5"
      // 12. Isolated numbers/powers/units: e.g. 9996, 10⁵, 64, 13¹³, 25%, 12 cm, 10 DT
      const tokenRegex =
        /(\$([^$]+)\$)|(\\begin\{cases\}[\s\S]*?\\end\{cases\})|(\\begin\{(?:pmatrix|vmatrix|bmatrix)\}[\s\S]*?\\end\{(?:pmatrix|vmatrix|bmatrix)\})|([A-Z]\s*\(\s*[-+]?\d+(?:[.,]\d+)?\s*;\s*[-+]?\d+(?:[.,]\d+)?(?:\s*;\s*[-+]?\d+(?:[.,]\d+)?)?\s*\))|(\\frac\{([^{}]+|\{[^{}]*\})\}\{([^{}]+|\{[^{}]*\})\})|(\\sqrt(?:\[([^\]]+)\])?\{([^}]+)\})|(\\vec\{([^}]+)\})|(\^\{([^}]+)\}|\^([0-9a-zA-Z+−-]+))|(_\{([^}]+)\}|(?<!_)_([0-9a-zA-Z+−-]+)(?!_))|(\\blank\{([smlSML])\})|(\[_{2,}\])|(_{3,})|((?:√\s*\d+|\d+\s*√|\b[a-zA-Z]\b\s*=\s*[-+]?\d+(?:\/\w+)?|(?:[-+±]?[0-9a-zA-Z⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ\(\)\[\]\{\}.,]+\s*[=×÷±≠≤≥≈+\-−*\/]\s*)+[-+±]?[0-9a-zA-Z⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ\(\)\[\]\{\}.,]+))|((?<![0-9a-zA-Z\u0600-\u06FF])[-+±]?\d+(?:[.,]\d+)*(?:[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ]+)?(?:\s*(?:%|°|cm|mm|m|km|g|kg|DT))?(?![0-9a-zA-Z\u0600-\u06FF⁰¹²³⁴⁵⁶⁷⁸⁹]))/g;

      let match: RegExpExecArray | null;
      let keyCounter = 0;

      while ((match = tokenRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          const plain = line.substring(lastIndex, match.index);
          elements.push(
            <span key={`txt_${lineIdx}_${keyCounter++}`}>
              {plain}
            </span>
          );
        }

        const rawMatched = match[0];
        const isClickable = Boolean(onEquationClick);

        if (match[1]) {
          // Explicit $formula$
          const formula = match[2];
          elements.push(
            <bdi
              key={`math_explicit_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(formula); } : undefined}
              className={`inline-flex items-center gap-0.5 mx-1 font-sans select-text whitespace-nowrap align-baseline ${
                isClickable ? 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 rounded px-1 transition-colors cursor-pointer' : ''
              }`}
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
              title={isClickable ? 'Cliquer pour modifier la formule (∑)' : undefined}
            >
              {renderFormulaContent(formula, `f_${lineIdx}_${keyCounter}`)}
            </bdi>
          );
        } else if (match[3]) {
          // \begin{cases}...\end{cases}
          const casesStr = match[3];
          elements.push(
            <bdi
              key={`math_cases_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(casesStr); } : undefined}
              className={`inline-flex items-center align-middle mx-1 font-sans select-text ${
                isClickable ? 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 rounded px-1 cursor-pointer' : ''
              }`}
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
              title={isClickable ? 'Cliquer pour modifier le système (∑)' : undefined}
            >
              {renderFormulaContent(casesStr, `cases_${lineIdx}_${keyCounter}`)}
            </bdi>
          );
        } else if (match[4]) {
          // Matrices
          const matStr = match[4];
          elements.push(
            <bdi
              key={`math_mat_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(matStr); } : undefined}
              className={`inline-flex items-center align-middle mx-1 font-sans select-text ${
                isClickable ? 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 rounded px-1 cursor-pointer' : ''
              }`}
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
              title={isClickable ? 'Cliquer pour modifier la matrice (∑)' : undefined}
            >
              {renderFormulaContent(matStr, `mat_${lineIdx}_${keyCounter}`)}
            </bdi>
          );
        } else if (match[5]) {
          // Point coordinates: e.g. K(100 ; 300) or A(-200 ; 300)
          const ptCoord = match[5];
          elements.push(
            <bdi
              key={`math_coord_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(ptCoord); } : undefined}
              className={`inline-block mx-1 font-sans font-semibold select-text whitespace-nowrap align-baseline ${
                isClickable ? 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 rounded px-1 cursor-pointer' : ''
              }`}
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
              title={isClickable ? 'Cliquer pour modifier les coordonnées (∑)' : undefined}
            >
              {ptCoord}
            </bdi>
          );
        } else if (match[6]) {
          // \frac{num}{den}
          const fracStr = match[6];
          elements.push(
            <bdi
              key={`math_frac_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(fracStr); } : undefined}
              className={`inline-flex items-center align-middle mx-1 font-sans select-text ${
                isClickable ? 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 rounded px-1 cursor-pointer' : ''
              }`}
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
              title={isClickable ? 'Cliquer pour modifier la fraction (∑)' : undefined}
            >
              {renderFormulaContent(fracStr, `frac_${lineIdx}_${keyCounter}`)}
            </bdi>
          );
        } else if (match[9]) {
          // \sqrt[n]{x} or \sqrt{x}
          const sqrtStr = match[9];
          elements.push(
            <bdi
              key={`math_sqrt_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(sqrtStr); } : undefined}
              className={`inline-flex items-center align-middle mx-1 font-sans select-text ${
                isClickable ? 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 rounded px-1 cursor-pointer' : ''
              }`}
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
              title={isClickable ? 'Cliquer pour modifier la racine (∑)' : undefined}
            >
              {renderFormulaContent(sqrtStr, `sqrt_${lineIdx}_${keyCounter}`)}
            </bdi>
          );
        } else if (match[12]) {
          // \vec{u}
          const vecStr = match[12];
          elements.push(
            <bdi
              key={`math_vec_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(vecStr); } : undefined}
              className="inline-flex items-center align-middle mx-1 font-sans select-text"
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
            >
              {renderFormulaContent(vecStr, `vec_${lineIdx}_${keyCounter}`)}
            </bdi>
          );
        } else if (match[14]) {
          // Power ^{...}
          const powerVal = match[15] || match[16];
          elements.push(
            <sup
              key={`sup_${lineIdx}_${keyCounter++}`}
              className="text-[0.75em] font-medium leading-none ml-[0.5px]"
            >
              {powerVal}
            </sup>
          );
        } else if (match[17]) {
          // Subscript _{...}
          const subVal = match[18] || match[19];
          elements.push(
            <sub
              key={`sub_${lineIdx}_${keyCounter++}`}
              className="text-[0.75em] font-medium leading-none ml-[0.5px]"
            >
              {subVal}
            </sub>
          );
        } else if (match[20] || match[22] || match[23]) {
          // Blank underlined
          let w = defaultWidth;
          if (match[20]) {
            w = getPresetWidth(undefined, match[21]?.toLowerCase());
          } else if (match[23]) {
            const len = match[23].length;
            if (len <= 4) w = '45px';
            else if (len <= 8) w = '90px';
            else w = '160px';
          }
          elements.push(renderBlank(`blk_${lineIdx}_${keyCounter++}`, w));
        } else if (match[24]) {
          // Compound math formula e.g. "13 − 5 × 13", "13⁴ × 13⁹ = 13¹³", "ab = 1", "a = -1/b", "9√ + 16√"
          const eqStr = match[24];
          elements.push(
            <bdi
              key={`math_eq_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              onClick={isClickable ? (e) => { e.stopPropagation(); onEquationClick?.(eqStr); } : undefined}
              className={`inline-block mx-1 font-sans font-medium select-text whitespace-nowrap align-baseline ${
                isClickable ? 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-300 rounded px-1 cursor-pointer' : ''
              }`}
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
              title={isClickable ? 'Cliquer pour modifier la formule (∑)' : undefined}
            >
              {eqStr}
            </bdi>
          );
        } else if (match[25]) {
          // Isolated number or power
          const numStr = match[25];
          elements.push(
            <bdi
              key={`math_num_${lineIdx}_${keyCounter++}`}
              dir="ltr"
              className="inline-block mx-0.5 font-sans select-text whitespace-nowrap align-baseline"
              style={{ unicodeBidi: 'isolate', direction: 'ltr' }}
            >
              {numStr}
            </bdi>
          );
        }

        lastIndex = tokenRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        elements.push(
          <span key={`txt_end_${lineIdx}_${keyCounter++}`}>
            {line.substring(lastIndex)}
          </span>
        );
      }

      return (
        <React.Fragment key={`line_${lineIdx}`}>
          {lineIdx > 0 && <br />}
          {elements}
        </React.Fragment>
      );
    });
  };

  return (
    <span className={`inline-block ${className}`} style={style}>
      {renderFormatted(text)}
    </span>
  );
};
