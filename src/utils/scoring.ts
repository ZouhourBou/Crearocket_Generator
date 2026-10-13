import {
  WorksheetBlock,
  WorksheetDocument,
  WorksheetPageData,
  PedagogicalQuestionItem,
  QCMExamQuestion,
} from '../types/worksheet';

/**
 * Parses a numeric point value from a number or string (supports French comma e.g. "1,5" or "5 points")
 */
export function parsePointsValue(raw?: string | number | null): number {
  if (raw === undefined || raw === null) return 0;
  if (typeof raw === 'number') {
    return Number.isFinite(raw) && raw >= 0 ? Math.round(raw * 100) / 100 : 0;
  }
  const normalized = String(raw).replace(',', '.');
  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  const parsed = parseFloat(match[1]);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) / 100 : 0;
}

/**
 * Formats a numeric score into French mathematical notation (comma for decimals: 3,5)
 */
export function formatScoreNumber(pts: number): string {
  const rounded = Math.round(pts * 100) / 100;
  return String(rounded).replace('.', ',');
}

/**
 * Formats a point label according to language (FR / AR / EN)
 */
export function formatPointsLabel(pts: number, isRtl = false): string {
  const numStr = formatScoreNumber(pts);
  if (isRtl) {
    if (pts === 1) return `( نقطة واحدة )`;
    if (pts === 2) return `( نقطتان )`;
    return `( ${numStr} نقاط )`;
  }
  return `${numStr} ${pts > 1 ? 'points' : 'point'}`;
}

/**
 * Computes total points of a QCM question list
 */
export function computeQCMQuestionsPoints(questions?: QCMExamQuestion[]): number {
  if (!questions || questions.length === 0) return 0;
  const sum = questions.reduce((acc, q) => {
    const p = q.points !== undefined ? Number(q.points) : 1;
    return acc + (Number.isFinite(p) && p >= 0 ? p : 0);
  }, 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Computes total points of a PedagogicalQuestionItem list inside an Exercise
 * Single source of truth: exercise.totalPoints = sum of its questions' points
 */
export function computeExerciseTotalPoints(questions?: PedagogicalQuestionItem[]): number {
  if (!questions || questions.length === 0) return 0;
  const sum = questions.reduce((acc, q) => {
    if (q.type === 'paragraph') return acc;
    const p = q.points !== undefined ? Number(q.points) : 0;
    return acc + (Number.isFinite(p) && p >= 0 ? p : 0);
  }, 0);
  return Math.round(sum * 100) / 100;
}

/**
 * Computes the effective points contributed by a single WorksheetBlock
 */
export function getBlockTotalPoints(block: WorksheetBlock): number {
  switch (block.type) {
    case 'exercise':
      return computeExerciseTotalPoints(block.content.pedagogicalQuestions);

    case 'question':
      if (block.content.questionData) {
        return parsePointsValue(block.content.questionData.points);
      }
      return parsePointsValue(block.content.points);

    case 'qcm_exam':
      if (block.content.questions && block.content.questions.length > 0) {
        const hasExplicitQuestionPoints = block.content.questions.some(
          (q) => q.points !== undefined
        );
        if (hasExplicitQuestionPoints) {
          return computeQCMQuestionsPoints(block.content.questions);
        }
      }
      if (block.content.points !== undefined) {
        return parsePointsValue(block.content.points);
      }
      return computeQCMQuestionsPoints(block.content.questions);

    case 'exercise_header':
      return parsePointsValue(block.content.points);

    default:
      return 0;
  }
}

/**
 * Computes the total points across an entire WorksheetDocument
 * Avoids double-counting if a page has both legacy `exercise_header` and standalone `qcm_exam`
 * unless `exercise` containers or explicit points are used.
 */
export function getDocumentTotalPoints(doc: WorksheetDocument): number {
  if (!doc || !doc.pages) return 0;

  let total = 0;
  for (const page of doc.pages) {
    // Skip independent Arabic duplicate pages from doubling the document total if there are FR pages
    if (page.isIndependentArabic && doc.pages.length > 1) {
      continue;
    }

    const hasStructuredExercises = page.blocks.some(
      (b) => b.type === 'exercise' || b.type === 'question'
    );
    const hasLegacyHeaders = page.blocks.some((b) => b.type === 'exercise_header');

    for (const block of page.blocks) {
      if (block.type === 'exercise' || block.type === 'question') {
        total += getBlockTotalPoints(block);
      } else if (block.type === 'qcm_exam') {
        // If legacy exercise_header is present on the same page without structured exercises,
        // check whether QCM has explicit per-question points or if header holds the points
        const hasExplicitQPoints = block.content.questions?.some((q) => q.points !== undefined);
        if (!hasLegacyHeaders || hasExplicitQPoints || hasStructuredExercises) {
          total += getBlockTotalPoints(block);
        }
      } else if (block.type === 'exercise_header' && !hasStructuredExercises) {
        const qcmHasExplicit = page.blocks.some(
          (b) => b.type === 'qcm_exam' && b.content.questions?.some((q) => q.points !== undefined)
        );
        if (!qcmHasExplicit) {
          total += getBlockTotalPoints(block);
        }
      }
    }
  }

  return Math.round(total * 100) / 100;
}

/**
 * Computes the next sequential Exercise number (1, 2, 3...) across the document
 */
export function getNextExerciseNumber(pages: WorksheetPageData[]): number {
  let count = 0;
  for (const page of pages) {
    if (page.isIndependentArabic) continue;
    for (const block of page.blocks) {
      if (block.type === 'exercise' || block.type === 'exercise_header') {
        count += 1;
      }
    }
  }
  return count + 1;
}
