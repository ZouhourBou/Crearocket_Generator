import { NotebookSubject, StudentInfo } from '../types';
import { getSubjectDefinition, selectNextTemplateForSubject, buildAiBackgroundPrompt } from './subjectRegistry';
import {
  NotebookThemeArtisticDirection,
  MATHEMATICS_THEMES,
} from './notebookThemesDatabase';
import {
  FRENCH_THEMES,
  ARABIC_THEMES,
  ENGLISH_THEMES,
  SCIENCE_THEMES,
  HISTORY_THEMES,
  GEOGRAPHY_THEMES,
  ISLAMIC_THEMES,
  EXERCISE_THEMES,
  HOMEWORK_THEMES,
  TEXTBOOK_THEMES,
  OTHER_ARTS_THEMES,
} from './notebookThemesCatalog';

export type { NotebookThemeArtisticDirection } from './notebookThemesDatabase';

export interface CoverVariation {
  id: string;
  styleTitle: {
    fr: string;
    ar: string;
    en: string;
  };
  universeDescription: string;
  asset: string;
  palette: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    cartoucheBg: string;
    cartoucheBorder: string;
  };
  visualElements: string[];
  filterStyle?: string;
}

export interface SubjectArtisticProfile {
  id: NotebookSubject;
  name: {
    fr: string;
    ar: string;
    en: string;
  };
  displayTitle: {
    fr: string;
    ar: string;
    en: string;
  };
  slogan: {
    fr: string;
    ar: string;
    en: string;
  };
  dominantPalette: {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    border: string;
  };
  visualElements: string[];
  visualUniverse: string;
  defaultCoverAsset: string;
  variations: CoverVariation[];
}

/**
 * COMPLETE DATABASE OF 15 ARTISTIC THEMES PER SUBJECT (12 x 15 = 180 THEMES)
 * Internal system database used automatically by the AI engine.
 */
export const NOTEBOOK_THEMES: Record<NotebookSubject, NotebookThemeArtisticDirection[]> = {
  math: MATHEMATICS_THEMES,
  french: FRENCH_THEMES,
  arabic: ARABIC_THEMES,
  english: ENGLISH_THEMES,
  science: SCIENCE_THEMES,
  history: HISTORY_THEMES,
  geography: GEOGRAPHY_THEMES,
  islamic: ISLAMIC_THEMES,
  exercise: EXERCISE_THEMES,
  homework: HOMEWORK_THEMES,
  textbook: TEXTBOOK_THEMES,
  other: OTHER_ARTS_THEMES,
};

// Helper to convert theme to variation format
function themeToVariation(theme: NotebookThemeArtisticDirection): CoverVariation {
  return {
    id: theme.themeId,
    styleTitle: theme.themeName,
    universeDescription: theme.concept,
    asset: theme.asset,
    palette: theme.colorPalette,
    visualElements: theme.visualElements,
    filterStyle: theme.filterStyle,
  };
}

/**
 * Subject artistic profiles with all 15 variations loaded per subject.
 */
export const NOTEBOOK_SUBJECT_PROFILES: Record<NotebookSubject, SubjectArtisticProfile> = {
  math: {
    id: 'math',
    name: { fr: 'Mathématiques', ar: 'الرياضيات', en: 'Mathematics' },
    displayTitle: { fr: 'Mathématiques', ar: 'الرياضيات', en: 'Mathematics' },
    slogan: { fr: 'Comprendre, calculer, progresser !', ar: 'بالرياضيات نفهم، نحل، نتقدّم', en: 'Understand, solve, progress!' },
    dominantPalette: MATHEMATICS_THEMES[0].colorPalette,
    visualElements: MATHEMATICS_THEMES[0].visualElements,
    visualUniverse: MATHEMATICS_THEMES[0].concept,
    defaultCoverAsset: MATHEMATICS_THEMES[0].asset,
    variations: MATHEMATICS_THEMES.map(themeToVariation),
  },
  french: {
    id: 'french',
    name: { fr: 'Français', ar: 'اللغة الفرنسية', en: 'French' },
    displayTitle: { fr: 'Français', ar: 'اللغة الفرنسية', en: 'French' },
    slogan: { fr: 'Lire, écrire et imaginer le monde !', ar: 'نقراً، نكتب، ونعبّر عن أفكارنا', en: 'Read, write and imagine the world!' },
    dominantPalette: FRENCH_THEMES[0].colorPalette,
    visualElements: FRENCH_THEMES[0].visualElements,
    visualUniverse: FRENCH_THEMES[0].concept,
    defaultCoverAsset: FRENCH_THEMES[0].asset,
    variations: FRENCH_THEMES.map(themeToVariation),
  },
  arabic: {
    id: 'arabic',
    name: { fr: 'Langue Arabe', ar: 'اللغة العربية', en: 'Arabic Language' },
    displayTitle: { fr: 'اللغة العربية', ar: 'اللغة العربية', en: 'Arabic Language' },
    slogan: { fr: 'La langue des poètes et du savoir', ar: 'لغة الضاد، أصالة وجمال وبيان', en: 'The language of poets and wisdom' },
    dominantPalette: ARABIC_THEMES[0].colorPalette,
    visualElements: ARABIC_THEMES[0].visualElements,
    visualUniverse: ARABIC_THEMES[0].concept,
    defaultCoverAsset: ARABIC_THEMES[0].asset,
    variations: ARABIC_THEMES.map(themeToVariation),
  },
  english: {
    id: 'english',
    name: { fr: 'Anglais', ar: 'اللغة الإنجليزية', en: 'English' },
    displayTitle: { fr: 'English', ar: 'اللغة الإنجليزية', en: 'English' },
    slogan: { fr: 'Open your mind to the world!', ar: 'تعلّم الإنجليزية واكتشف العالم', en: 'Open your mind to the world!' },
    dominantPalette: ENGLISH_THEMES[0].colorPalette,
    visualElements: ENGLISH_THEMES[0].visualElements,
    visualUniverse: ENGLISH_THEMES[0].concept,
    defaultCoverAsset: ENGLISH_THEMES[0].asset,
    variations: ENGLISH_THEMES.map(themeToVariation),
  },
  science: {
    id: 'science',
    name: { fr: 'Sciences & Découverte', ar: 'العلوم والبيئة', en: 'Science & Discovery' },
    displayTitle: { fr: 'Sciences', ar: 'العلوم الطبيعية', en: 'Science' },
    slogan: { fr: 'Observer, expérimenter et comprendre !', ar: 'نكتشف الطبيعة ونفهم أسرار الكون', en: 'Observe, experiment and understand!' },
    dominantPalette: SCIENCE_THEMES[0].colorPalette,
    visualElements: SCIENCE_THEMES[0].visualElements,
    visualUniverse: SCIENCE_THEMES[0].concept,
    defaultCoverAsset: SCIENCE_THEMES[0].asset,
    variations: SCIENCE_THEMES.map(themeToVariation),
  },
  history: {
    id: 'history',
    name: { fr: 'Histoire', ar: 'التاريخ', en: 'History' },
    displayTitle: { fr: 'Histoire', ar: 'التاريخ', en: 'History' },
    slogan: { fr: 'Voyager à travers les siècles passés', ar: 'نستحضر أمجاد الماضي لنبني المستقبل', en: 'Travel through past centuries' },
    dominantPalette: HISTORY_THEMES[0].colorPalette,
    visualElements: HISTORY_THEMES[0].visualElements,
    visualUniverse: HISTORY_THEMES[0].concept,
    defaultCoverAsset: HISTORY_THEMES[0].asset,
    variations: HISTORY_THEMES.map(themeToVariation),
  },
  geography: {
    id: 'geography',
    name: { fr: 'Géographie', ar: 'الجغرافيا', en: 'Geography' },
    displayTitle: { fr: 'Géographie', ar: 'الجغرافيا', en: 'Geography' },
    slogan: { fr: 'Explorer les continents et les climats', ar: 'نستكشف كوكبنا الجميل وتضاريسه', en: 'Explore continents and climates' },
    dominantPalette: GEOGRAPHY_THEMES[0].colorPalette,
    visualElements: GEOGRAPHY_THEMES[0].visualElements,
    visualUniverse: GEOGRAPHY_THEMES[0].concept,
    defaultCoverAsset: GEOGRAPHY_THEMES[0].asset,
    variations: GEOGRAPHY_THEMES.map(themeToVariation),
  },
  islamic: {
    id: 'islamic',
    name: { fr: 'Éducation Islamique', ar: 'التربية الإسلامية', en: 'Islamic Education' },
    displayTitle: { fr: 'التربية الإسلامية', ar: 'التربية الإسلامية', en: 'Islamic Education' },
    slogan: { fr: 'Valeurs nobles et foi sereine', ar: 'إيمان، خُلق كريم، وسكينة قلب', en: 'Noble values and serene faith' },
    dominantPalette: ISLAMIC_THEMES[0].colorPalette,
    visualElements: ISLAMIC_THEMES[0].visualElements,
    visualUniverse: ISLAMIC_THEMES[0].concept,
    defaultCoverAsset: ISLAMIC_THEMES[0].asset,
    variations: ISLAMIC_THEMES.map(themeToVariation),
  },
  exercise: {
    id: 'exercise',
    name: { fr: 'Cahier d’Exercices & Règles', ar: 'كراس التمارين وقواعد اللغة', en: 'Exercise & Grammar Book' },
    displayTitle: { fr: 'Exercices & Grammaire', ar: 'كراس التمارين', en: 'Exercises & Grammar' },
    slogan: { fr: 'S’entraîner pas à pas pour réussir !', ar: 'بالتدريب والمثابرة نصنع التفوّق', en: 'Practice step by step to succeed!' },
    dominantPalette: EXERCISE_THEMES[0].colorPalette,
    visualElements: EXERCISE_THEMES[0].visualElements,
    visualUniverse: EXERCISE_THEMES[0].concept,
    defaultCoverAsset: EXERCISE_THEMES[0].asset,
    variations: EXERCISE_THEMES.map(themeToVariation),
  },
  homework: {
    id: 'homework',
    name: { fr: 'Devoirs & Éducation Civique', ar: 'كراس الواجبات والتربية المدنية', en: 'Homework & Civics' },
    displayTitle: { fr: 'Devoirs & Civisme', ar: 'كراس الواجبات', en: 'Homework & Civics' },
    slogan: { fr: 'Responsabilité, méthode et travail bien fait', ar: 'واجبات متقنة وقيم مدنية نبيلة', en: 'Responsibility and excellence' },
    dominantPalette: HOMEWORK_THEMES[0].colorPalette,
    visualElements: HOMEWORK_THEMES[0].visualElements,
    visualUniverse: HOMEWORK_THEMES[0].concept,
    defaultCoverAsset: HOMEWORK_THEMES[0].asset,
    variations: HOMEWORK_THEMES.map(themeToVariation),
  },
  textbook: {
    id: 'textbook',
    name: { fr: 'Cahier de Texte & Organisation', ar: 'كراسة النصوص والبرنامج', en: 'Textbook & Daily Planner' },
    displayTitle: { fr: 'Cahier de Texte', ar: 'كراسة النصوص', en: 'Textbook' },
    slogan: { fr: 'Chaque jour bien planifié pour réussir', ar: 'تنظيم الوقت ومتابعة الدروس بكل دقة', en: 'Organize each day for success' },
    dominantPalette: TEXTBOOK_THEMES[0].colorPalette,
    visualElements: TEXTBOOK_THEMES[0].visualElements,
    visualUniverse: TEXTBOOK_THEMES[0].concept,
    defaultCoverAsset: TEXTBOOK_THEMES[0].asset,
    variations: TEXTBOOK_THEMES.map(themeToVariation),
  },
  other: {
    id: 'other',
    name: { fr: 'Arts & Multi-Matières', ar: 'التربية التشكيلية والفنون', en: 'Arts & Creativity' },
    displayTitle: { fr: 'Arts Plastiques', ar: 'التربية التشكيلية', en: 'Arts & Crafts' },
    slogan: { fr: 'Exprimer ses idées avec passion et couleur', ar: 'إبداع، ألوان، وخيال حر بلا حدود', en: 'Express ideas with passion and color' },
    dominantPalette: OTHER_ARTS_THEMES[0].colorPalette,
    visualElements: OTHER_ARTS_THEMES[0].visualElements,
    visualUniverse: OTHER_ARTS_THEMES[0].concept,
    defaultCoverAsset: OTHER_ARTS_THEMES[0].asset,
    variations: OTHER_ARTS_THEMES.map(themeToVariation),
  },
};

/**
 * ANTI-REPETITION THEME SELECTION ENGINE
 * Guarantees a fresh, distinct artistic theme on every click without immediate repetition.
 */
export function selectNextNotebookTheme(
  subject: NotebookSubject,
  usedThemeIds: string[] = []
): {
  theme: NotebookThemeArtisticDirection;
  nextUsedIds: string[];
  wasReset: boolean;
} {
  const allThemes = NOTEBOOK_THEMES[subject] || NOTEBOOK_THEMES.other;
  const usedSet = new Set(usedThemeIds);

  let available = allThemes.filter((t) => !usedSet.has(t.themeId));
  let wasReset = false;

  // If all 15 themes have been used, reset the cycle
  if (available.length === 0) {
    available = allThemes;
    wasReset = true;
  }

  // Prevent immediate consecutive duplicate if more than 1 option exists
  const lastUsedId = usedThemeIds.length > 0 ? usedThemeIds[usedThemeIds.length - 1] : null;
  let candidates = available;
  if (candidates.length > 1 && lastUsedId) {
    candidates = candidates.filter((t) => t.themeId !== lastUsedId);
  }

  // Pick candidate
  const randomIndex = Math.floor(Math.random() * candidates.length);
  const selectedTheme = candidates[randomIndex] || available[0] || allThemes[0];

  const nextUsedIds = wasReset ? [selectedTheme.themeId] : [...usedThemeIds, selectedTheme.themeId];

  return {
    theme: selectedTheme,
    nextUsedIds,
    wasReset,
  };
}

/**
 * Retrieve cover variation by index or seed.
 */
export function getCoverVariation(
  subject: NotebookSubject,
  variationIndex = 0,
  seed?: number
): CoverVariation {
  const profile = NOTEBOOK_SUBJECT_PROFILES[subject] || NOTEBOOK_SUBJECT_PROFILES.other;
  const list = profile.variations;
  if (!list || list.length === 0) {
    return {
      id: `${subject}_default`,
      styleTitle: { fr: 'Design Standard', ar: 'تصميم قياسي', en: 'Standard Design' },
      universeDescription: profile.visualUniverse,
      asset: profile.defaultCoverAsset,
      palette: {
        ...profile.dominantPalette,
        badgeBg: profile.dominantPalette.primary,
        badgeText: '#FFFFFF',
        cartoucheBg: 'rgba(255, 255, 255, 0.97)',
        cartoucheBorder: profile.dominantPalette.border,
      },
      visualElements: profile.visualElements,
      filterStyle: 'none',
    };
  }

  const effectiveIndex = seed !== undefined ? Math.abs(seed) % list.length : Math.abs(variationIndex) % list.length;
  return list[effectiveIndex];
}

/**
 * CREAROCKET ARTISTIC DIRECTIONS & VARIATION HINTS
 * Injects genuine creative variety between successive generations.
 */
export const CREAROCKET_VARIATION_HINTS = [
  "éléments décoratifs disposés en diagonale du coin supérieur gauche vers le coin inférieur droit",
  "éléments décoratifs répartis symétriquement de chaque côté du titre central",
  "composition avec un grand élément central unique entouré de petits éléments flottants",
  "éléments décoratifs concentrés dans les coins, laissant le centre plus épuré",
  "disposition en cercle autour de l'encadré d'informations",
  "éléments empilés en bas de page façon nature morte, espace aéré en haut",
];

export const CREAROCKET_BRAND = {
  name: 'CreaRocket',
  slogan: '🚀 كل يوم أفكار إبداع مع Crearrock! 💡',
  sloganFr: '🚀 Des idées créatives chaque jour avec Crearocket ! 💡',
  sloganEn: '🚀 Daily creative ideas with Crearocket! 💡',
};

/**
 * Select a different variation hint from previous to guarantee non-repetition.
 */
export function selectNextVariationHint(previousIndex: number = -1): { hint: string; index: number } {
  let index: number;
  do {
    index = Math.floor(Math.random() * CREAROCKET_VARIATION_HINTS.length);
  } while (index === previousIndex && CREAROCKET_VARIATION_HINTS.length > 1);
  return { hint: CREAROCKET_VARIATION_HINTS[index], index };
}

/**
 * Builds the CreaRocket Premium Art Director AI Prompt:
 * Professional school stationery cover design for "CreaRocket".
 */
export function buildCoverAiPrompt(params: {
  subject: NotebookSubject;
  customSubjectName?: string;
  formatMm: { width: number; height: number };
  coversPerSheet: 1 | 2 | 3 | 'custom';
  language: 'fr' | 'ar' | 'en';
  theme?: NotebookThemeArtisticDirection;
  variationIndex?: number;
  variationHint?: string;
  studentInfo?: StudentInfo;
  seed?: number;
  generationId?: number;
}): {
  prompt: string;
  profile: SubjectArtisticProfile;
  variation: CoverVariation;
  theme: NotebookThemeArtisticDirection;
  variationHint: string;
  variationIndex: number;
} {
  const profile = NOTEBOOK_SUBJECT_PROFILES[params.subject] || NOTEBOOK_SUBJECT_PROFILES.other;
  const allThemes = NOTEBOOK_THEMES[params.subject] || NOTEBOOK_THEMES.other;
  
  const currentTheme = params.theme || (params.variationIndex !== undefined
    ? allThemes[params.variationIndex % allThemes.length]
    : allThemes[0]);

  const variation = themeToVariation(currentTheme);

  const widthMm = params.formatMm.width;
  const heightMm = params.formatMm.height;
  const isArabic = params.language === 'ar';

  const variationIndex = params.variationIndex !== undefined
    ? params.variationIndex % CREAROCKET_VARIATION_HINTS.length
    : 0;
  const variationHint = params.variationHint || CREAROCKET_VARIATION_HINTS[variationIndex];

  // Subject title and slogans
  const titre_matiere = params.customSubjectName || (isArabic ? profile.displayTitle.ar : profile.displayTitle.fr);
  const type_de_cahier = `${profile.name.fr} (${profile.name.ar}) — ${currentTheme.themeName.fr}`;
  const slogan = isArabic ? profile.slogan.ar : profile.slogan.fr;
  const liste_elements_visuels = currentTheme.visualElements.join(', ');
  const palette_couleur = `${currentTheme.colorPalette.name} (Couleurs douces pastel : primaire ${currentTheme.colorPalette.primary}, secondaire ${currentTheme.colorPalette.secondary}, fond crème ${currentTheme.colorPalette.bg})`;

  // Labels for the personal info box
  const ligne_1_label = isArabic ? 'الاسم واللقب' : params.language === 'en' ? 'Full Name' : 'Nom & Prénom';
  const ligne_2_label = isArabic ? 'القسم / المستوى' : params.language === 'en' ? 'Class / Grade' : 'Classe';
  const ligne_3_label = isArabic ? 'المؤسسة التعليمية' : params.language === 'en' ? 'School' : 'École';
  const ligne_4_label = isArabic ? 'السنة الدراسية' : params.language === 'en' ? 'Academic Year' : 'Année scolaire';

  const nom_prenom = params.studentInfo?.fullName || '';
  const classe = params.studentInfo?.classLevel || params.studentInfo?.grade || '';
  const ecole = params.studentInfo?.school || params.studentInfo?.schoolName || '';
  const annee = params.studentInfo?.academicYear || '';

  const langue = isArabic ? 'Arabe (العربية)' : params.language === 'en' ? 'Anglais' : 'Français';

  const prompt = `Tu es un directeur artistique expert en design de papeterie scolaire premium. Génère une image de couverture de cahier scolaire professionnelle et soignée pour la marque "CreaRocket" (slogan : 🚀 كل يوم أفكار إبداع مع Crearrock! 💡).

=== EXIGENCE DE QUALITÉ ===
Le rendu doit être digne d'un produit commercial haut de gamme, prêt à être imprimé et vendu — pas un brouillon ni une esquisse. Composition professionnelle, propre, sans éléments flous ou mal proportionnés.

=== FORMAT ===
Image verticale, format portrait (${widthMm}x${heightMm}mm), proportions conformes, haute résolution.

=== STYLE VISUEL (fixe pour toute la collection CreaRocket) ===
- Palette pastel douce, chaleureuse et élégante (tons crème, pastel, jamais criards)
- Style vectoriel plat moderne avec léger effet 3D doux (ombres subtiles, pas de relief agressif)
- Formes arrondies, sans angles durs, esthétique "mignonne mais professionnelle"
- Bordure décorative cohérente avec le thème tout autour de la page
- Petite fusée stylisée discrète intégrée quelque part dans le design (clin d'œil à la marque CreaRocket)

=== THÈME DE CE CAHIER : ${type_de_cahier} ===
Titre à afficher en très grand en haut de la page : "${titre_matiere}"
Langue et direction d'écriture du titre : ${langue} ${isArabic ? '(écriture RTL de droite à gauche)' : '(écriture LTR de gauche à droite)'}
Éléments visuels à illustrer : ${liste_elements_visuels}
Palette de couleurs dominante pour ce thème : ${palette_couleur}
Slogan court sous le titre : "${slogan}"

=== ENCADRÉ D'INFORMATIONS PERSONNELLES (INTÉGRATION DIRECTE ET NATIVE DANS LES PIXELS) ===
Dans le tiers inférieur de la couverture (positionné de façon fixe et stable entre 58% et 88% de la hauteur), dessine UN SEUL ET UNIQUE encadré à fond blanc/crème clair opaque (${currentTheme.colorPalette.cartoucheBg || '#FFFFFF'}), bordure arrondie unique (${currentTheme.colorPalette.border || '#CBD5E1'}), sans JAMAIS le dédoubler.

À L'INTÉRIEUR DE CE CADRE UNIQUE, écris DIRECTEMENT EN DUR DANS LES PIXELS DE L'IMAGE (exactement comme le titre) le texte réel fourni par le client, avec une police nette, lisible, non déformée et une taille adaptée pour tenir sur une seule ligne sans déborder :

1. [Icône silhouette] ${ligne_1_label} : ${nom_prenom ? `"${nom_prenom}"` : '................'}
2. [Icône groupe] ${ligne_2_label} : ${classe ? `"${classe}"` : '................'}
3. [Icône école] ${ligne_3_label} : ${ecole ? `"${ecole}"` : '................'}
4. [Icône calendrier] ${ligne_4_label} : ${annee ? `"${annee}"` : '................'}

RÈGLES D'ALIGNEMENT ET DE NON-DÉDOUBLEMENT :
- Toutes les lignes doivent être rigoureusement alignées sur la même grille verticale (icône + libellé + valeur alignés sur un même axe).
- NE JAMAIS générer de cadre vide avec seulement des icônes et pointillés si des valeurs sont fournies : afficher les valeurs réelles en dur dans les pixels.
- Si un champ est laissé vide, afficher uniquement le libellé suivi d'un espace propre (pointillés courts), JAMAIS un second cadre séparé.
- Un seul cadre unique avec un seul fond et une seule bordure. Aucun cadre fantôme en arrière-plan.

=== VARIATION CRÉATIVE POUR CETTE GÉNÉRATION ===
Direction de composition à privilégier pour cette version précise (numéro de variante ${variationIndex + 1}) : 
${variationHint}
Explore une disposition et un agencement des éléments décoratifs différents des versions précédentes, tout en respectant strictement le style et la palette définis ci-dessus.

=== INTERDITS ===
- Ne jamais inventer ou modifier le texte des informations personnelles fourni
- Ne pas ajouter de texte autre que le titre, le slogan et l'encadré d'informations
- Ne pas utiliser de personnages/visages humains stylisés au centre de la composition`;

  return {
    prompt,
    profile,
    variation,
    theme: currentTheme,
    variationHint,
    variationIndex,
  };
}

// =========================================================================
// MATIERES & THEMES (SPÉCIFICATION OFFICIELLE CREAROCKET)
// =========================================================================

export interface MatiereOption {
  id: string;
  label: string;
}

export const MATIERES: MatiereOption[] = [
  { id: 'maths', label: 'كرّاس الرياضيات' },
  { id: 'eveil_scientifique', label: 'كرّاس الإيقاظ العلمي' },
  { id: 'francais', label: 'Cahier de Français' },
  { id: 'production_ecrite_fr', label: 'Cahier de production écrite' },
  { id: 'lecture_fr', label: 'Cahier de lecture' },
  { id: 'grammaire_fr', label: 'Cahier de grammaire (Français)' },
  { id: 'anglais', label: 'English Notebook' },
  { id: 'arabe', label: 'كرّاس اللغة العربية' },
  { id: 'production_ecrite_ar', label: 'كرّاس الإنتاج الكتابي' },
  { id: 'lecture_ar', label: 'كرّاس القراءة' },
  { id: 'grammaire_ar', label: 'كرّاس قواعد اللغة' },
  { id: 'histoire_geo', label: 'كرّاس التاريخ والجغرافيا' },
  { id: 'education_islamique', label: 'كرّاس التربية الإسلامية' },
  { id: 'education_civique', label: 'كرّاس التربية المدنية' },
  { id: 'arts_plastiques', label: 'كرّاس التربية التشكيليّة' },
  { id: 'musique', label: 'كرّاس الموسيقى' },
  { id: 'eveil_musical', label: 'كرّاس الإيقاظ الموسيقي' },
  { id: 'technologie', label: 'كرّاس التكنولوجيا' },
  { id: 'informatique', label: 'كرّاس الإعلامية' },
  { id: 'memorisation', label: 'كرّاس المحفوظات' },
  { id: 'exercices', label: 'كرّاس التمارين' },
  { id: 'mutalaa', label: 'كرّاس المطالعة' },
  { id: 'devoirs', label: 'Cahier de devoirs' },
  { id: 'brouillon', label: 'Cahier de brouillon' },
  { id: 'correspondance', label: 'Cahier de correspondance' },
  { id: 'autre', label: '' }, // vide volontairement — saisie 100% libre pour ce cas
];

export const THEMES: Record<
  string,
  { palette: string; elements: string; defaultTitleAr?: string; defaultTitleFr?: string }
> = {
  maths: {
    palette: 'bleu pastel et blanc crème',
    elements: 'calculatrice, règle et équerre, symbole π, cube 3D, formes géométriques flottantes',
  },
  eveil_scientifique: {
    palette: 'vert pastel et bleu clair',
    elements: 'éprouvette, feuille et loupe, atome stylisé, petite plante',
  },
  francais: {
    palette: 'bleu, blanc, rouge pastel',
    elements: 'Tour Eiffel stylisée, montgolfière, livre ouvert',
  },
  production_ecrite_fr: {
    palette: 'beige et bleu pastel',
    elements: "plume et encrier, feuille manuscrite, ampoule d'idée",
  },
  lecture_fr: {
    palette: 'jaune pastel et crème',
    elements: 'pile de livres ouverts, lunettes de lecture, marque-page',
  },
  grammaire_fr: {
    palette: 'violet pastel et blanc',
    elements: 'lettres flottantes, bulle de dialogue, stylo',
  },
  anglais: {
    palette: 'bleu clair pastel',
    elements: 'Big Ben stylisé, cabine téléphonique rouge, couronne',
  },
  arabe: {
    palette: 'vert pastel et doré',
    elements: 'calligraphie arabe décorative, encrier et plume, lanterne traditionnelle',
  },
  production_ecrite_ar: {
    palette: 'vert doux et beige',
    elements: 'plume, parchemin, motif calligraphique léger',
  },
  lecture_ar: {
    palette: 'doré pastel et crème',
    elements: 'livre ouvert avec lettres arabes, lanterne, étoile',
  },
  grammaire_ar: {
    palette: 'turquoise pastel et doré',
    elements: 'lettres arabes flottantes, encrier, motif géométrique',
  },
  histoire_geo: {
    palette: 'sépia et vert pastel',
    elements: 'carte ancienne, globe terrestre, boussole, sablier',
  },
  education_islamique: {
    palette: 'vert pastel et doré',
    elements: 'mosquée stylisée, croissant, motif géométrique islamique',
  },
  education_civique: {
    palette: 'bleu pastel et blanc',
    elements: 'drapeau tunisien stylisé, colombe, mains unies',
  },
  arts_plastiques: {
    palette: 'multicolore pastel doux',
    elements: 'palette de peintre, pinceaux, crayons de couleur',
  },
  musique: {
    palette: 'rose pastel et lavande',
    elements: 'notes de musique flottantes, clé de sol, petite guitare',
  },
  eveil_musical: {
    palette: 'jaune pastel et rose',
    elements: 'instruments simples, notes de musique, portée musicale',
  },
  technologie: {
    palette: 'gris pastel et bleu',
    elements: 'engrenages, ampoule, petit robot mignon',
  },
  informatique: {
    palette: 'bleu clair et blanc',
    elements: 'ordinateur stylisé, souris, icônes de code simples',
  },
  memorisation: {
    palette: 'vert doux et doré',
    elements: "livre ouvert, étoile brillante, ampoule d'idée",
  },
  exercices: {
    palette: 'orange pastel et crème',
    elements: 'crayon, gomme, coche de validation',
  },
  mutalaa: {
    palette: 'beige et vert pastel',
    elements: 'pile de livres, tasse, lampe de lecture',
  },
  devoirs: {
    palette: 'orange et jaune pastel',
    elements: 'agenda, horloge, liste à cocher',
  },
  brouillon: {
    palette: 'gris pastel et blanc',
    elements: 'feuille froissée, crayon, gomme',
  },
  correspondance: {
    palette: 'rose pastel et crème',
    elements: 'enveloppe, plume, cœur discret',
  },
  autre: {
    palette: 'couleurs neutres pastel',
    elements: 'livre, crayon, règle — icônes génériques scolaires',
  },

  // Alias rétrocompatibles
  mathematiques: {
    palette: 'bleu pastel et blanc crème',
    elements: 'calculatrice, règle et équerre, symbole π, cube 3D, formes géométriques flottantes',
  },
  sciences: {
    palette: 'vert pastel et bleu clair',
    elements: 'éprouvette, feuille et loupe, atome stylisé, petite plante',
  },
  islamique: {
    palette: 'vert pastel et doré',
    elements: 'mosquée stylisée, croissant, motif géométrique islamique',
  },
  civisme_devoirs: {
    palette: 'orange et jaune pastel',
    elements: 'agenda, horloge, liste à cocher',
  },
  cahier_texte: {
    palette: 'rose pastel et crème',
    elements: 'enveloppe, plume, cœur discret',
  },
  dessin_arts: {
    palette: 'multicolore pastel doux',
    elements: 'palette de peintre, pinceaux, crayons de couleur',
  },
  multi_matieres: {
    palette: 'couleurs neutres pastel',
    elements: 'livre, crayon, règle — icônes génériques scolaires',
  },
};

export const CAS_DE_TEST = [
  { type_matiere: 'eveil_scientifique', titre_cahier: 'كرّاس الإيقاظ العلمي' }, // arabe + thème "sciences"
  { type_matiere: 'maths', titre_cahier: 'Cahier de Maths — Ahmed' }, // titre personnalisé + prénom
  { type_matiere: 'francais', titre_cahier: 'دفتر الفرنسية' }, // titre arabe sur thème français
  { type_matiere: 'arabe', titre_cahier: 'My Arabic Notebook' }, // titre anglais sur thème arabe
  { type_matiere: 'autre', titre_cahier: 'Cahier Spécial Ramadan' },
];

export function buildFinalPrompt(p: {
  format_page: string;
  type_matiere: string;
  titre_cahier: string;
  nom_prenom?: string;
  classe?: string;
  ecole?: string;
  annee?: string;
  att_numero_modele?: number;
  variation_index?: number;
}): string {
  const subjectDef = getSubjectDefinition(p.type_matiere || 'autre');
  const modelNumber =
    p.att_numero_modele ??
    (p.variation_index !== undefined ? ((p.variation_index % 12) + 1) : 1);
  const template = selectNextTemplateForSubject(subjectDef.id, modelNumber);
  const format = p.format_page === 'A4_double_horizontal' ? 'A4_double_horizontal' : 'A4_unique';

  return buildAiBackgroundPrompt(subjectDef, template, format);
}

/**
 * Test de validation à lancer sur les 25 matières, pas juste sur un échantillon
 */
export async function testerToutesLesMatieres() {
  for (const matiere of MATIERES.filter((m) => m.id !== 'autre')) {
    const params = {
      type_matiere: matiere.id,
      titre_cahier: matiere.label, // exactement comme l'auto-remplissage le ferait
      format_page: 'A4_unique',
      nom_prenom: 'Test',
      classe: '6A',
      ecole: 'École Test',
      annee: '2026-2027',
      variation_index: Math.floor(Math.random() * 1000),
    };
    const prompt = buildFinalPrompt(params);
    console.log(`--- Test pour ${matiere.label} ---`, prompt.slice(0, 100));
  }
}

/**
 * Maps standard NotebookSubject or matiere id to CreaRocket type_matiere
 */
export function subjectToTypeMatiere(subject: string): string {
  if (MATIERES.some((m) => m.id === subject)) return subject;
  switch (subject) {
    case 'math':
      return 'maths';
    case 'arabic':
      return 'arabe';
    case 'french':
      return 'francais';
    case 'english':
      return 'anglais';
    case 'science':
      return 'eveil_scientifique';
    case 'history':
    case 'geography':
      return 'histoire_geo';
    case 'islamic':
      return 'education_islamique';
    case 'exercise':
      return 'exercices';
    case 'homework':
      return 'devoirs';
    case 'textbook':
      return 'correspondance';
    default:
      return 'autre';
  }
}

/**
 * Maps type_matiere to NotebookSubject
 */
export function typeMatiereToSubject(typeMatiere: string): any {
  if (typeMatiere === 'education_civique') return 'education_civique';
  if (typeMatiere === 'maths') return 'maths';
  if (typeMatiere === 'eveil_scientifique') return 'eveil_scientifique';
  if (typeMatiere === 'francais') return 'francais';
  if (typeMatiere === 'arabe') return 'arabe';
  if (typeMatiere === 'anglais') return 'anglais';
  if (typeMatiere === 'histoire_geo') return 'histoire_geo';
  if (typeMatiere === 'education_islamique') return 'education_islamique';
  if (typeMatiere === 'arts_plastiques') return 'arts_plastiques';
  if (typeMatiere === 'musique') return 'musique';
  if (typeMatiere === 'eveil_musical') return 'eveil_musical';
  if (typeMatiere === 'technologie') return 'technologie';
  if (typeMatiere === 'informatique') return 'informatique';
  if (typeMatiere === 'memorisation') return 'memorisation';
  if (typeMatiere === 'exercices') return 'exercices';
  if (typeMatiere === 'mutalaa') return 'mutalaa';
  if (typeMatiere === 'devoirs') return 'devoirs';
  if (typeMatiere === 'brouillon') return 'brouillon';
  if (typeMatiere === 'correspondance') return 'correspondance';
  if (typeMatiere === 'production_ecrite_fr') return 'production_ecrite_fr';
  if (typeMatiere === 'lecture_fr') return 'lecture_fr';
  if (typeMatiere === 'grammaire_fr') return 'grammaire_fr';
  if (typeMatiere === 'production_ecrite_ar') return 'production_ecrite_ar';
  if (typeMatiere === 'lecture_ar') return 'lecture_ar';
  if (typeMatiere === 'grammaire_ar') return 'grammaire_ar';

  switch (typeMatiere) {
    case 'mathematiques':
      return 'maths';
    case 'sciences':
      return 'eveil_scientifique';
    case 'islamique':
      return 'education_islamique';
    case 'cahier_texte':
      return 'correspondance';
    case 'dessin_arts':
      return 'arts_plastiques';
    default:
      return typeMatiere || 'autre';
  }
}

