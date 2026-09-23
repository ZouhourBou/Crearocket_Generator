import {
  WorksheetBlock,
  WorksheetBlockType,
  WorksheetPageData,
  WorksheetDocument,
  DocumentLanguage,
  BlockLocalizedText,
  QCMExamQuestion,
  FillInBlanksLine,
} from '../types/worksheet';

export const SUPPORTED_LANGUAGES: Array<{
  id: DocumentLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  badge: string;
}> = [
  { id: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', badge: 'FR' },
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr', badge: 'EN' },
  { id: 'ar', name: 'Arabe', nativeName: 'العربية', flag: '🇹🇳', dir: 'rtl', badge: 'عربي' },
];

export const LANGUAGE_PLACEHOLDERS: Record<DocumentLanguage, Record<string, string>> = {
  fr: {
    title: 'Titre de la fiche',
    titlePlaceholder: 'Ajoutez le titre en Français...',
    subtitle: 'Sous-titre',
    subtitlePlaceholder: 'Ajoutez le sous-titre en Français...',
    instruction: 'Écrivez ici la consigne…',
    instructionLabel: 'Consigne :',
    text: 'Ajoutez le texte en Français...',
    textPlaceholder: 'Ajoutez le texte en Français...',
    exerciseTitle: 'Exercice 1',
    points: '5 points',
    qcmInstruction: 'Pour chaque question, cochez la proposition exacte :',
    qcmStatement: 'Énoncé de la question...',
    qcmOption: 'Proposition de réponse',
    fillInBlanksLine: 'Compléter : 8/5 × ___ = ___',
  },
  en: {
    title: 'Worksheet Title',
    titlePlaceholder: 'Add title in English...',
    subtitle: 'Subtitle',
    subtitlePlaceholder: 'Add subtitle in English...',
    instruction: 'Write the instruction here...',
    instructionLabel: 'Instruction:',
    text: 'Add text in English...',
    textPlaceholder: 'Add text in English...',
    exerciseTitle: 'Exercise 1',
    points: '5 points',
    qcmInstruction: 'For each question, check the correct proposition:',
    qcmStatement: 'Question statement...',
    qcmOption: 'Answer choice',
    fillInBlanksLine: 'Complete: 8/5 × ___ = ___',
  },
  ar: {
    title: 'عنوان الفرض أو التمرين',
    titlePlaceholder: 'أضف العنوان باللغة العربية...',
    subtitle: 'العنوان الفرعي',
    subtitlePlaceholder: 'أضف العنوان الفرعي باللغة العربية...',
    instruction: 'اكتب هنا التعليمة…',
    instructionLabel: 'تعليمة :',
    text: 'أضف النص باللغة العربية...',
    textPlaceholder: 'أضف النص باللغة العربية...',
    exerciseTitle: 'تمرين عدد 1',
    points: '( 5 نقاط )',
    qcmInstruction: 'لكل سؤال من الأسئلة التالية إجابة واحدة صحيحة، ضع علامة (×) أمام المقترح الصحيح :',
    qcmStatement: 'نص السؤال...',
    qcmOption: 'مقترح الإجابة',
    fillInBlanksLine: 'أكمل بما يناسب : 8/5 × ___ = ___',
  },
};

/**
 * Extracts pure textual data from block.content into a localized representation.
 */
export function extractBlockLocalizedText(
  content: WorksheetBlock['content'],
  type: WorksheetBlockType
): BlockLocalizedText {
  const result: BlockLocalizedText = {};

  if (content.text !== undefined) result.text = content.text;
  if (content.label !== undefined) result.label = content.label;
  if (content.placeholder !== undefined) result.placeholder = content.placeholder;
  if (content.exerciseTitle !== undefined) result.exerciseTitle = content.exerciseTitle;
  if (content.points !== undefined) result.points = content.points;
  if (content.instructionText !== undefined) result.instructionText = content.instructionText;

  if (content.questions && Array.isArray(content.questions)) {
    result.questions = content.questions.map((q) => ({
      id: q.id,
      statement: q.statement,
      options: q.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect })),
    }));
  }

  if (content.lines && Array.isArray(content.lines)) {
    result.lines = content.lines.map((l) => ({ id: l.id, text: l.text }));
  }

  return result;
}

/**
 * Checks whether a block has a non-empty, translated textual version in the given language.
 */
export function isBlockTranslated(block: WorksheetBlock, lang: DocumentLanguage): boolean {
  // Non-text blocks (image, shape, line, spacer) are always considered translated
  if (['image', 'shape', 'line', 'spacer'].includes(block.type)) {
    return true;
  }

  const trans = block.translations?.[lang];
  if (!trans) {
    return false;
  }

  switch (block.type) {
    case 'title':
    case 'subtitle':
    case 'instruction':
    case 'text':
      return typeof trans.text === 'string' && trans.text.trim().length > 0;

    case 'exercise_header':
      return (
        (typeof trans.exerciseTitle === 'string' && trans.exerciseTitle.trim().length > 0) ||
        (trans.points !== undefined && String(trans.points).trim().length > 0)
      );

    case 'qcm_exam':
      if (trans.questions && trans.questions.length > 0) {
        return trans.questions.some(
          (q) =>
            q.statement.trim().length > 0 ||
            q.options.some((o) => o.text && o.text.trim().length > 0)
        );
      }
      return false;

    case 'fill_in_blanks':
      if (trans.lines && trans.lines.length > 0) {
        return trans.lines.some((l) => l.text && l.text.trim().length > 0);
      }
      return false;

    case 'answer_zone':
      return true;

    default:
      return Boolean(trans.text && trans.text.trim().length > 0);
  }
}

/**
 * Applies a target language to a block, updating:
 * 1. Text direction (RTL for Arabic, LTR for French/English)
 * 2. Text alignment (right for Arabic, left for French/English, preserving center)
 * 3. QCM marker position (after for Arabic, before for French/English)
 * 4. Exercise header points position (left for Arabic, right for French/English)
 * 5. Text content from block.translations[targetLang] or appropriate localized placeholder
 */
export function applyLanguageToBlock(
  block: WorksheetBlock,
  targetLang: DocumentLanguage,
  isIndependentAr = false
): WorksheetBlock {
  const effectiveLang: DocumentLanguage = isIndependentAr ? 'ar' : targetLang;
  const isAr = effectiveLang === 'ar';
  const targetDir: 'rtl' | 'ltr' = isAr ? 'rtl' : 'ltr';

  // Make sure translations container exists
  const translations = { ...(block.translations || {}) };

  // Alignment: preserve centered alignment, flip left/right
  const currentAlign = block.styles.textAlign;
  let targetAlign: 'left' | 'center' | 'right' | 'justify' = 'left';
  if (currentAlign === 'center') {
    targetAlign = 'center';
  } else if (isAr) {
    targetAlign = 'right';
  } else {
    targetAlign = 'left';
  }

  // Updated styles
  const updatedStyles = {
    ...block.styles,
    textDirection: targetDir,
    textAlign: targetAlign,
  };

  // Resolve content
  const updatedContent = { ...block.content };

  // Update layout positions for QCM and Exercise Header
  if (block.type === 'qcm_exam') {
    updatedContent.markerPosition = 'before';
    if (isAr && (!updatedContent.markerStyle || updatedContent.markerStyle === 'square')) {
      updatedContent.markerStyle = 'box_letter_ar';
    }
  } else if (block.type === 'exercise_header') {
    updatedContent.pointsPosition = isAr ? 'left' : 'right';
  }

  // If this block already has translations for the target language, restore them into content
  const localized = translations[effectiveLang];
  const placeholders = LANGUAGE_PLACEHOLDERS[effectiveLang];

  if (localized) {
    if (localized.text !== undefined) updatedContent.text = localized.text;
    if (localized.label !== undefined) updatedContent.label = localized.label;
    if (localized.placeholder !== undefined) updatedContent.placeholder = localized.placeholder;
    if (localized.exerciseTitle !== undefined) updatedContent.exerciseTitle = localized.exerciseTitle;
    if (localized.points !== undefined) updatedContent.points = localized.points;
    if (localized.instructionText !== undefined) updatedContent.instructionText = localized.instructionText;

    if (localized.questions && updatedContent.questions) {
      updatedContent.questions = updatedContent.questions.map((q) => {
        const matchingLocalizedQ = localized.questions?.find((lq) => lq.id === q.id);
        if (matchingLocalizedQ) {
          return {
            ...q,
            statement: matchingLocalizedQ.statement,
            options: q.options.map((opt) => {
              const matchingOpt = matchingLocalizedQ.options.find((lo) => lo.id === opt.id);
              return matchingOpt ? { ...opt, text: matchingOpt.text } : opt;
            }),
          };
        }
        return q;
      });
    }

    if (localized.lines && updatedContent.lines) {
      updatedContent.lines = updatedContent.lines.map((l) => {
        const matchingLine = localized.lines?.find((ll) => ll.id === l.id);
        return matchingLine ? { ...l, text: matchingLine.text } : l;
      });
    }
  } else {
    // If not yet translated, provide empty text or localized default placeholder
    if (block.type === 'exercise_header') {
      updatedContent.exerciseTitle = placeholders.exerciseTitle;
      updatedContent.points = placeholders.points;
    } else if (block.type === 'instruction') {
      updatedContent.label = placeholders.instructionLabel;
      updatedContent.text = '';
    } else if (['title', 'subtitle', 'text'].includes(block.type)) {
      updatedContent.text = '';
    } else if (block.type === 'qcm_exam') {
      if (updatedContent.instructionText !== undefined) {
        updatedContent.instructionText = placeholders.qcmInstruction;
      }
      // Keep question structure (options, math), clear or translate statements
      if (updatedContent.questions) {
        updatedContent.questions = updatedContent.questions.map((q) => ({
          ...q,
          statement: '',
          options: q.options.map((o) => ({
            ...o,
            // If option is pure math, keep it; otherwise blank it for teacher to fill
            text: isMathOnlyText(o.text) ? o.text : '',
          })),
        }));
      }
    }
  }

  return {
    ...block,
    content: updatedContent,
    translations,
    styles: updatedStyles,
  };
}

/**
 * Checks if a string consists primarily of numbers, powers, formulas and math operators,
 * which are common to all languages.
 */
export function isMathOnlyText(text?: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  // Matches math characters, digits, exponents, fractions, underscores
  const mathCharsRegex = /^[\d\s+\-×÷=≠±≤≥<>%°/\\_()^{}[\]⁴⁵⁶⁷⁸⁹⁰¹²³]+$/;
  return mathCharsRegex.test(trimmed);
}

/**
 * Saves a block content update into both `content` and `translations[currentLang]`.
 */
export function saveBlockContentForLanguage(
  block: WorksheetBlock,
  currentLang: DocumentLanguage,
  contentUpdates: Partial<WorksheetBlock['content']>
): WorksheetBlock {
  const newContent = {
    ...block.content,
    ...contentUpdates,
  };

  const newTranslations = {
    ...(block.translations || {}),
  };

  const existingTranslation = newTranslations[currentLang] || {};
  const updatedLocalized = extractBlockLocalizedText(newContent, block.type);

  newTranslations[currentLang] = {
    ...existingTranslation,
    ...updatedLocalized,
  };

  return {
    ...block,
    content: newContent,
    translations: newTranslations,
  };
}

/**
 * Creates a completely autonomous duplicate page in Arabic.
 * This page is disconnected from the multilingual synchronization cycle.
 */
export function duplicatePageAsIndependentArabic(
  sourcePage: WorksheetPageData,
  newPageNumber: number
): WorksheetPageData {
  const newPageId = `page_ar_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const duplicatedBlocks: WorksheetBlock[] = sourcePage.blocks.map((block) => {
    const newBlockId = `block_ar_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Convert block to Arabic RTL layout
    const arBlock = applyLanguageToBlock(block, 'ar', true);

    // If block had Arabic translation, it was applied; ensure text is valid
    const arContent = { ...arBlock.content };
    if (!arContent.text && block.content.text) {
      // If no explicit AR text was stored, keep the source text so user has the math/content to work with
      arContent.text = block.translations?.ar?.text || block.content.text;
    }

    if (arBlock.type === 'exercise_header') {
      arContent.exerciseTitle =
        block.translations?.ar?.exerciseTitle ||
        (block.content.exerciseTitle?.includes('Exercice')
          ? block.content.exerciseTitle.replace(/Exercice\s*(\d+)/i, 'تمرين عدد $1')
          : 'تمرين عدد 1');
      arContent.points = block.translations?.ar?.points || '( 5 نقاط )';
      arContent.pointsPosition = 'left';
    } else if (arBlock.type === 'instruction') {
      arContent.label = block.translations?.ar?.label || 'تعليمة :';
    } else if (arBlock.type === 'qcm_exam') {
      arContent.markerPosition = 'after';
      if (block.translations?.ar?.questions) {
        arContent.questions = block.translations.ar.questions.map((q) => ({
          ...q,
          options: q.options.map((o) => ({ ...o })),
        }));
      }
    }

    return {
      ...arBlock,
      id: newBlockId,
      content: arContent,
      styles: {
        ...arBlock.styles,
        textDirection: 'rtl',
        textAlign: arBlock.styles.textAlign === 'center' ? 'center' : 'right',
      },
    };
  });

  return {
    id: newPageId,
    pageNumber: newPageNumber,
    blocks: duplicatedBlocks,
    isIndependentArabic: true,
    independentLanguage: 'ar',
  };
}

/**
 * Applies a new active language to the entire document.
 * Independent Arabic pages (isIndependentArabic: true) remain strictly untouched.
 */
export function applyLanguageToDocument(
  doc: WorksheetDocument,
  language: DocumentLanguage
): WorksheetDocument {
  const currentLang = doc.settings.activeLanguage || 'fr';
  const updatedPages = doc.pages.map((page) => {
    // Independent Arabic pages are isolated and preserved
    if (page.isIndependentArabic) {
      return page;
    }

    const updatedBlocks = page.blocks.map((block) =>
      applyLanguageToBlock(block, language, false)
    );

    return {
      ...page,
      blocks: updatedBlocks,
    };
  });

  return {
    ...doc,
    settings: {
      ...doc.settings,
      activeLanguage: language,
      defaultTextDirection: language === 'ar' ? 'rtl' : 'ltr',
    },
    pages: updatedPages,
  };
}
