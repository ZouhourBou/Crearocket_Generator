import { MathProblem, MathWorksheetState } from '../types/math';

/**
 * Random integer helper in [min, max]
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if addition has any regrouping (carry)
 */
function hasAdditionCarry(a: number, b: number): boolean {
  let sa = Math.floor(a);
  let sb = Math.floor(b);
  while (sa > 0 || sb > 0) {
    if ((sa % 10) + (sb % 10) >= 10) return true;
    sa = Math.floor(sa / 10);
    sb = Math.floor(sb / 10);
  }
  return false;
}

/**
 * Checks if subtraction has any borrowing
 */
function hasSubtractionBorrow(a: number, b: number): boolean {
  let sa = Math.floor(a);
  let sb = Math.floor(b);
  while (sa > 0 || sb > 0) {
    if ((sa % 10) < (sb % 10)) return true;
    sa = Math.floor(sa / 10);
    sb = Math.floor(sb / 10);
  }
  return false;
}

/**
 * Generate a single problem matching constraints
 */
export function generateMathProblem(
  state: MathWorksheetState,
  index: number
): MathProblem {
  const op =
    state.operationType === 'mixed'
      ? (['addition', 'subtraction', 'multiplication', 'division'] as const)[
          randomInt(0, 3)
        ]
      : state.operationType;

  const id = `prob-${index}-${Date.now()}-${Math.random()}`;

  switch (op) {
    case 'addition': {
      let num1 = 0;
      let num2 = 0;
      let attempts = 0;

      const termsCount = state.level === 'advanced' ? state.additionTermsCount : 2;
      const operands: number[] = [];

      do {
        attempts++;
        if (state.level === 'basic') {
          num1 = randomInt(state.minNumber, state.maxNumber);
          num2 = randomInt(state.minNumber, state.maxNumber);
        } else {
          // Advanced: larger numbers or decimals
          num1 = randomInt(state.minNumber, state.maxNumber);
          num2 = randomInt(state.minNumber, state.maxNumber);
          if (state.allowDecimals) {
            num1 = Number((num1 + Math.random()).toFixed(state.decimalPlaces || 1));
            num2 = Number((num2 + Math.random()).toFixed(state.decimalPlaces || 1));
          }
        }

        // Check regrouping constraint
        if (!state.allowRegroupingAddition && hasAdditionCarry(num1, num2)) {
          continue;
        }
        break;
      } while (attempts < 60);

      operands.push(num1, num2);
      if (termsCount >= 3) {
        operands.push(randomInt(state.minNumber, Math.min(state.maxNumber, 50)));
      }
      if (termsCount >= 4) {
        operands.push(randomInt(state.minNumber, Math.min(state.maxNumber, 50)));
      }

      const sum = operands.reduce((acc, v) => acc + v, 0);
      const roundedSum = state.allowDecimals ? Number(sum.toFixed(2)) : sum;

      return {
        id,
        operands,
        operator: '+',
        operatorSymbol: '+',
        result: roundedSum,
        isDecimal: state.allowDecimals,
        answerKey: `${roundedSum}`,
      };
    }

    case 'subtraction': {
      let num1 = 0;
      let num2 = 0;
      let attempts = 0;

      do {
        attempts++;
        const a = randomInt(state.minNumber, state.maxNumber);
        const b = randomInt(state.minNumber, state.maxNumber);

        // Standard subtraction: num1 >= num2 to keep positive results
        if (!state.allowNegativeResult) {
          num1 = Math.max(a, b);
          num2 = Math.min(a, b);
        } else {
          num1 = a;
          num2 = b;
        }

        if (state.allowDecimals && state.level === 'advanced') {
          num1 = Number((num1 + Math.random()).toFixed(state.decimalPlaces || 1));
          num2 = Number((num2 + Math.random()).toFixed(state.decimalPlaces || 1));
          if (!state.allowNegativeResult && num1 < num2) {
            const tmp = num1;
            num1 = num2;
            num2 = tmp;
          }
        }

        // Borrow constraint
        if (!state.allowRegroupingSubtraction && hasSubtractionBorrow(num1, num2)) {
          continue;
        }
        break;
      } while (attempts < 60);

      const diff = state.allowDecimals
        ? Number((num1 - num2).toFixed(2))
        : num1 - num2;

      return {
        id,
        operands: [num1, num2],
        operator: '−',
        operatorSymbol: '−',
        result: diff,
        isDecimal: state.allowDecimals,
        answerKey: `${diff}`,
      };
    }

    case 'multiplication': {
      let num1 = 0;
      let num2 = 0;

      if (state.customTablesOnly && state.multiplicationTables.length > 0) {
        // Pick a table from selected
        const table =
          state.multiplicationTables[
            randomInt(0, state.multiplicationTables.length - 1)
          ];
        num1 = table;
        num2 = randomInt(1, 10);
      } else if (state.level === 'basic') {
        num1 = randomInt(2, 9);
        num2 = randomInt(1, 10);
      } else {
        // Advanced multi-digit
        num1 = randomInt(state.minNumber, state.maxNumber);
        num2 = randomInt(2, Math.min(state.maxNumber, 99));
        if (state.allowDecimals) {
          num1 = Number((num1 / 10).toFixed(1));
        }
      }

      const prod = state.allowDecimals
        ? Number((num1 * num2).toFixed(2))
        : num1 * num2;

      return {
        id,
        operands: [num1, num2],
        operator: '×',
        operatorSymbol: '×',
        result: prod,
        isDecimal: state.allowDecimals,
        answerKey: `${prod}`,
      };
    }

    case 'division': {
      let divisor = randomInt(2, Math.min(12, state.maxNumber));
      let quotient = randomInt(1, state.level === 'basic' ? 10 : 25);
      let remainder = 0;

      if (state.exactDivisionOnly) {
        const dividend = divisor * quotient;
        return {
          id,
          operands: [dividend, divisor],
          operator: '÷',
          operatorSymbol: '÷',
          result: quotient,
          remainder: 0,
          answerKey: `${quotient}`,
        };
      } else {
        // Division with remainder
        remainder = randomInt(1, divisor - 1);
        const dividend = divisor * quotient + remainder;
        return {
          id,
          operands: [dividend, divisor],
          operator: '÷',
          operatorSymbol: '÷',
          result: quotient,
          remainder,
          answerKey: `Q = ${quotient}, R = ${remainder}`,
        };
      }
    }
  }
}

/**
 * Generate full problem set avoiding direct duplicates
 */
export function generateMathWorksheetProblems(
  state: MathWorksheetState
): MathProblem[] {
  const problems: MathProblem[] = [];
  const signatures = new Set<string>();

  for (let i = 0; i < state.exerciseCount; i++) {
    let prob = generateMathProblem(state, i + 1);
    const sig = `${prob.operands.join(',')}_${prob.operator}`;
    if (signatures.has(sig) && i < state.exerciseCount * 2) {
      // Retry once to keep variety
      prob = generateMathProblem(state, i + 1);
    }
    signatures.add(sig);
    problems.push(prob);
  }

  return problems;
}
