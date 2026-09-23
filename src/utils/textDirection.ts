/**
 * Text direction detection and resolution utilities for bilingual (French / Arabic) worksheets.
 */

// Arabic Unicode ranges (Arabic, Arabic Supplement, Arabic Extended, Presentation Forms)
export const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Detects whether the given string contains Arabic characters.
 */
export function containsArabic(text?: string): boolean {
  if (!text) return false;
  return ARABIC_REGEX.test(text);
}

/**
 * Automatically detects text direction ('rtl' or 'ltr') based on content.
 */
export function detectTextDirection(text?: string): 'rtl' | 'ltr' {
  if (!text) return 'ltr';
  return containsArabic(text) ? 'rtl' : 'ltr';
}

/**
 * Resolves the effective text direction for a block given:
 * 1. The block's configured textDirection ('auto' | 'ltr' | 'rtl')
 * 2. A sample text or all text content of the block
 * 3. The document-level default textDirection ('auto' | 'ltr' | 'rtl')
 */
export function resolveBlockDirection(
  blockDirection?: 'auto' | 'ltr' | 'rtl' | string,
  sampleText?: string,
  docDefault: 'auto' | 'ltr' | 'rtl' | string = 'auto'
): 'rtl' | 'ltr' {
  // If explicitly set to 'rtl' or 'ltr', obey
  if (blockDirection === 'rtl') return 'rtl';
  if (blockDirection === 'ltr') return 'ltr';

  // If set to 'auto' or undefined:
  // First check if the block's text contains Arabic
  if (sampleText && containsArabic(sampleText)) {
    return 'rtl';
  }

  // If sampleText is empty or has non-Arabic, check document default
  if (docDefault === 'rtl') return 'rtl';
  if (docDefault === 'ltr') return 'ltr';

  // If docDefault is also 'auto', check sample text again (non-Arabic defaults to ltr)
  return 'ltr';
}
