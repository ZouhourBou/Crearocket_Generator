import { GeneratorState, GeneratorType, NotebookSubject, SchoolLabelType, StudentInfo } from '../types';
import { getThemesForSelection } from '../constants/themes';

export type GeneratorModule = 'notebook_cover' | 'school_books' | 'supplies' | 'birthday_kit';

/**
 * Returns the unique identifier of the active module.
 * - 'birthday_kit'   : Kits anniversaire
 * - 'notebook_cover' : Couverture de cahier
 * - 'school_books'   : Étiquette scolaire (livre et cahier)
 * - 'supplies'       : Étiquette fourniture
 */
export function getGeneratorModule(
  type: GeneratorType,
  schoolLabelType?: SchoolLabelType
): GeneratorModule {
  if (type === 'birthday_kit') return 'birthday_kit';
  if (type === 'notebook_cover') return 'notebook_cover';
  if (type === 'books' || schoolLabelType === 'books') return 'school_books';
  return 'supplies';
}

/**
 * Cleanly applies the transition rules when switching between modules:
 *
 * 1) Champs de taille / dimensions (size):
 *    TOUJOURS reset aux valeurs par défaut du module cible (aucun héritage).
 *    Font size de Nom/Prénom réinitialisée à 'auto' (fieldFontSizes undefined).
 *
 * 2) Champs texte généraux (titre, matière, classe, école, année...):
 *    Réinitialisés par défaut (chaîne vide / false).
 *
 * 3) Exception — Nom et Prénom:
 *    Persistés entre modules (info.fullName).
 */
export function transitionModuleState(
  prev: GeneratorState,
  targetModule: GeneratorModule
): GeneratorState {
  const currentModule = getGeneratorModule(prev.type, prev.schoolLabelType);

  // If staying on the exact same module, do not reset anything
  if (currentModule === targetModule) {
    return prev;
  }

  // Preserve ONLY fullName (Nom / Prénom), all other text fields reset to empty/false
  const nextInfo: StudentInfo = {
    fullName: prev.info?.fullName || '',
    grade: '',
    hasSchool: false,
    schoolName: '',
    hasSubject: false,
    subjectName: '',
    academicYear: '',
    classLevel: '',
    school: '',
  };

  // Base shared dimension reset
  const commonReset = {
    info: nextInfo,
    paperFormat: 'A4' as const,
    customPaper: { widthMm: 210, heightMm: 297 },
    borderRadius: 8,
    duplicateIconRight: false,
    centerText: false,
    illustrationMode: 'icon' as const,
    studentPhotoUrl: undefined,
    studentPhotoAiUrl: undefined,
    isProcessingPhoto: false,
    schoolSubjectDecor: 'none',
    iconSize: undefined,
    fieldFontSizes: undefined, // Nom/Prénom font size returns to default for the target module
    pageMargins: { enabled: false, uniform: true, top: 0, right: 0, bottom: 0, left: 0 },
    labelSpacing: undefined,
  };

  if (targetModule === 'supplies') {
    const nextThemes = getThemesForSelection('supplies', prev.notebookSubject as NotebookSubject);
    return {
      ...prev,
      ...commonReset,
      type: 'supplies',
      schoolLabelType: 'supplies',
      labelPreset: '50x10',
      customLabel: { widthMm: 60, heightMm: 20 },
      itemCount: 24,
      coversPerSheet: 2,
      customCover: { widthMm: 194, heightMm: 135 },
      notebookCoverSizePreset: 'auto',
      notebookCoverCustomDimensions: { widthCm: 17, heightCm: 22 },
      themeId: nextThemes[0]?.id || prev.themeId,
      // Clear notebook AI cover artifacts
      aiCoverImage: undefined,
      aiCoverModelNumber: undefined,
      aiCoverVariationIndex: undefined,
      aiCoverSeed: undefined,
      aiCoverThemeId: undefined,
      aiCoverStyleTitle: undefined,
      aiCoverUsedThemeIds: undefined,
      aiCoverVariationHint: undefined,
      aiCoverBrandSlogan: undefined,
    };
  }

  if (targetModule === 'school_books') {
    const nextThemes = getThemesForSelection('supplies', prev.notebookSubject as NotebookSubject);
    return {
      ...prev,
      ...commonReset,
      type: 'supplies',
      schoolLabelType: 'books',
      labelPreset: '70x35',
      customLabel: { widthMm: 90, heightMm: 35 },
      itemCount: 12,
      coversPerSheet: 2,
      customCover: { widthMm: 194, heightMm: 135 },
      notebookCoverSizePreset: 'auto',
      notebookCoverCustomDimensions: { widthCm: 17, heightCm: 22 },
      themeId: nextThemes[0]?.id || prev.themeId,
      // Clear notebook AI cover artifacts
      aiCoverImage: undefined,
      aiCoverModelNumber: undefined,
      aiCoverVariationIndex: undefined,
      aiCoverSeed: undefined,
      aiCoverThemeId: undefined,
      aiCoverStyleTitle: undefined,
      aiCoverUsedThemeIds: undefined,
      aiCoverVariationHint: undefined,
      aiCoverBrandSlogan: undefined,
    };
  }

  if (targetModule === 'birthday_kit') {
    return {
      ...prev,
      ...commonReset,
      type: 'birthday_kit',
      // Clear notebook AI cover artifacts
      aiCoverImage: undefined,
      aiCoverModelNumber: undefined,
      aiCoverVariationIndex: undefined,
      aiCoverSeed: undefined,
      aiCoverThemeId: undefined,
      aiCoverStyleTitle: undefined,
      aiCoverUsedThemeIds: undefined,
      aiCoverVariationHint: undefined,
      aiCoverBrandSlogan: undefined,
    };
  }

  // targetModule === 'notebook_cover'
  const nextThemes = getThemesForSelection('notebook_cover', prev.notebookSubject as NotebookSubject);
  return {
    ...prev,
    ...commonReset,
    type: 'notebook_cover',
    coversPerSheet: 2,
    customCover: { widthMm: 194, heightMm: 135 },
    notebookCoverSizePreset: 'auto',
    notebookCoverCustomDimensions: { widthCm: 17, heightCm: 22 },
    labelPreset: '50x10',
    customLabel: { widthMm: 60, heightMm: 20 },
    itemCount: 24,
    notebookSubject: 'math',
    themeId: nextThemes[0]?.id || prev.themeId,
    // Clear notebook AI cover artifacts so it starts fresh
    aiCoverImage: undefined,
    aiCoverModelNumber: undefined,
    aiCoverVariationIndex: undefined,
    aiCoverSeed: undefined,
    aiCoverThemeId: undefined,
    aiCoverStyleTitle: undefined,
    aiCoverUsedThemeIds: undefined,
    aiCoverVariationHint: undefined,
    aiCoverBrandSlogan: undefined,
  };
}
