import mathImg1 from '../assets/images/cahier_math_a4_1789212071479.jpg';
import mathImg2 from '../assets/images/math_cover_geom_1789242685083.jpg';
import francaisImg1 from '../assets/images/cahier_francais_a4_1789212088987.jpg';
import francaisImg2 from '../assets/images/fr_cover_story_1789242707896.jpg';
import arabeImg1 from '../assets/images/cahier_arabe_a4_1789220507318.jpg';
import arabeImg2 from '../assets/images/ar_cover_star_1789242720944.jpg';
import scienceImg1 from '../assets/images/cahier_science_a4_1789220528103.jpg';
import scienceImg2 from '../assets/images/sci_cover_lab_1789242695859.jpg';
import anglaisImg1 from '../assets/images/cahier_anglais_a4_1789220518467.jpg';
import anglaisImg2 from '../assets/images/en_cover_london_1789242763351.jpg';
import islamImg from '../assets/images/cahier_islam_a4_1789220539626.jpg';
import histGeoImg from '../assets/images/cahier_hist_geo_1789220558154.jpg';
import exercicesImg from '../assets/images/cahier_exercices_1789220572213.jpg';

export interface NotebookThemeArtisticDirection {
  themeId: string;
  themeNumber: number; // 1 to 15
  themeName: {
    fr: string;
    ar: string;
    en: string;
  };
  concept: string;
  colorPalette: {
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
  composition: string;
  illustrationStyle: string;
  mood: string;
  typographyZone: string;
  generationInstructions: string;
  asset: string;
  filterStyle?: string;
}

// 1. MATHÉMATIQUES (15 THÈMES EXACTS)
export const MATHEMATICS_THEMES: NotebookThemeArtisticDirection[] = [
  {
    themeId: 'math-01',
    themeNumber: 1,
    themeName: { fr: 'Nombres Cosmiques', ar: 'الأرقام الكونية', en: 'Cosmic Numbers' },
    concept: 'Constellations géométriques et nombres flottant dans une nébuleuse douce',
    colorPalette: {
      name: 'Bleu Nuit Pastel & Doré',
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#F59E0B',
      bg: '#F0F9FF',
      border: '#2563EB',
      badgeBg: '#1E3A8A',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#93C5FD',
    },
    visualElements: ['planètes polyédriques', 'étoiles chiffres', 'orbite géométrique', 'formules lumineuses'],
    composition: 'Symétrique céleste avec arche centrale pour cartouche sécurisé',
    illustrationStyle: 'Vectoriel éducatif 3D doux avec reflets dorés',
    mood: 'Mystérieux, inspirant et stimulant',
    typographyZone: 'Cartouche central surélevé à 45% de la hauteur, contraste élevé garanti',
    generationInstructions: 'Dessiner un univers cosmique où les étoiles sont des nombres et les planètes des polyèdres réguliers',
    asset: mathImg1,
    filterStyle: 'none',
  },
  {
    themeId: 'math-02',
    themeNumber: 2,
    themeName: { fr: 'Laboratoire des Formes', ar: 'مختبر الأشكال الهندسية', en: 'Shapes Laboratory' },
    concept: 'Atelier expérimental avec solides 3D, prismes et compas de précision',
    colorPalette: {
      name: 'Cyan & Mandarine Pastel',
      primary: '#0369A1',
      secondary: '#0EA5E9',
      accent: '#F97316',
      bg: '#F8FAFC',
      border: '#0284C7',
      badgeBg: '#0369A1',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.97)',
      cartoucheBorder: '#7DD3FC',
    },
    visualElements: ['prisme de Newton', 'cubes translucides', 'compas d’architecte', 'équerre graduée'],
    composition: 'Dynamique en diagonale avec zone d’information protégée au centre',
    illustrationStyle: 'Lignes claires vectorielles avec ombres portées douces',
    mood: 'Méthodique, moderne et scientifique',
    typographyZone: 'Rectangle arrondi horizontal au tiers médian',
    generationInstructions: 'Créer une table d’architecte moderne avec instruments de mesure et polyèdres transparents',
    asset: mathImg2,
    filterStyle: 'none',
  },
  {
    themeId: 'math-03',
    themeNumber: 3,
    themeName: { fr: 'Jardin Géométrique', ar: 'حديقة الهندسة الخضراء', en: 'Geometric Garden' },
    concept: 'Fleurs fractales et feuillages construits à partir de polygones réguliers',
    colorPalette: {
      name: 'Vert Sauge & Corail Doux',
      primary: '#047857',
      secondary: '#10B981',
      accent: '#FB7185',
      bg: '#F0FDF4',
      border: '#059669',
      badgeBg: '#047857',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#A7F3D0',
    },
    visualElements: ['spirale de Fibonacci', 'arbres fractals', 'pétales en losanges', 'papillons symétriques'],
    composition: 'Cadre floral géométrique encadrant le cartouche central',
    illustrationStyle: 'Flat design raffiné avec textures végétales subtiles',
    mood: 'Paisible, harmonieux et naturel',
    typographyZone: 'Médaillon central entouré de motifs végétaux mathématiques',
    generationInstructions: 'Composer une nature stylisée illustrant le nombre d’or et la suite de Fibonacci',
    asset: mathImg1,
    filterStyle: 'hue-rotate(85deg) contrast(1.02)',
  },
  {
    themeId: 'math-04',
    themeNumber: 4,
    themeName: { fr: 'Ville des Calculs', ar: 'مدينة الحساب الذكية', en: 'City of Calculations' },
    concept: 'Skyline d’une cité futuriste dont les gratte-ciels sont des règles et abaques',
    colorPalette: {
      name: 'Bleu Cobalt & Pêche',
      primary: '#1D4ED8',
      secondary: '#60A5FA',
      accent: '#FDBA74',
      bg: '#EFF6FF',
      border: '#3B82F6',
      badgeBg: '#1D4ED8',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#BFDBFE',
    },
    visualElements: ['tours en forme de règles graduées', 'ponts paraboliques', 'ballons calculatrices', 'rues quadrillées'],
    composition: 'Perspective urbaine en contre-plongée avec ciel ouvert pour texte',
    illustrationStyle: 'Illustration urbaine jeunesse moderne',
    mood: 'Dynamique, constructif et novateur',
    typographyZone: 'Bandeau dans la partie supérieure ou centrale du ciel dégagé',
    generationInstructions: 'Dessiner une métropole chaleureuse où l’architecture met en scène des éléments arithmétiques',
    asset: mathImg2,
    filterStyle: 'saturate(1.1) brightness(1.02)',
  },
  {
    themeId: 'math-05',
    themeNumber: 5,
    themeName: { fr: 'Aventure dans l’Espace Math', ar: 'مغامرة الفضاء الرياضي', en: 'Space Math Adventure' },
    concept: 'Fusée propulsée par des équations vers des stations orbitales cubiques',
    colorPalette: {
      name: 'Indigo Profond & Vanille',
      primary: '#4338CA',
      secondary: '#818CF8',
      accent: '#FEF08A',
      bg: '#EEF2FF',
      border: '#6366F1',
      badgeBg: '#4338CA',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#C7D2FE',
    },
    visualElements: ['fusée spatiale', 'anneaux de Saturne en chiffres', 'satellites tétracubes', 'comète signe plus'],
    composition: 'Trajectoire ascendante diagonale laissant le tiers inférieur pour le cartouche',
    illustrationStyle: 'Illustration spatiale jeunesse riche en détails vectoriels',
    mood: 'Aventureux, captivant et héroïque',
    typographyZone: 'Cartouche horizontal blanc épuré en bas de page',
    generationInstructions: 'Concevoir une mission spatiale ludique où les moteurs de fusée créent des spirales géométriques',
    asset: mathImg1,
    filterStyle: 'hue-rotate(30deg) saturate(1.15)',
  },
  {
    themeId: 'math-06',
    themeNumber: 6,
    themeName: { fr: 'Construction & Meccano Math', ar: 'بناء الأشكال والمكعبات', en: 'Math Construction Studio' },
    concept: 'Grue miniature et engins assemblant des formes géométriques parfaites',
    colorPalette: {
      name: 'Ocre Doré & Bleu Acier',
      primary: '#B45309',
      secondary: '#F59E0B',
      accent: '#0284C7',
      bg: '#FFFBEB',
      border: '#D97706',
      badgeBg: '#B45309',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.97)',
      cartoucheBorder: '#FDE68A',
    },
    visualElements: ['engrenages dorés', 'grues miniatures', 'poutres graduées', 'plans bleus'],
    composition: 'Structure en U encadrant le centre de la page',
    illustrationStyle: 'Dessin technique doux adapté aux enfants',
    mood: 'Ingénieux, pratique et rigoureux',
    typographyZone: 'Zone centrale protégée façon plan d’architecte avec bordure fine',
    generationInstructions: 'Illustrer un chantier de construction miniature où l’on élève une pyramide régulière',
    asset: mathImg2,
    filterStyle: 'hue-rotate(-15deg)',
  },
  {
    themeId: 'math-07',
    themeNumber: 7,
    themeName: { fr: 'Monde des Chiffres Magiques', ar: 'عالم الأرقام الساحرة', en: 'Magical Numbers Realm' },
    concept: 'Personnages chiffres 1, 2, 3 vivants et souriants explorant une île flottante',
    colorPalette: {
      name: 'Lavande Douce & Jaune Beurre',
      primary: '#6D28D9',
      secondary: '#8B5CF6',
      accent: '#FACC15',
      bg: '#F5F3FF',
      border: '#7C3AED',
      badgeBg: '#6D28D9',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#DDD6FE',
    },
    visualElements: ['chiffres 3D anthropomorphes', 'nuages guimauve', 'escalier de cubes', 'ballon signe égal'],
    composition: 'Scène bucolique centrée avec île flottante au sommet',
    illustrationStyle: 'Personnages kawaii 3D épurés et bienveillants',
    mood: 'Joyeux, accessible et décomplexant',
    typographyZone: 'Panneau suspendu par des rubans pastel sous l’île flottante',
    generationInstructions: 'Créer des chiffres joyeux qui s’entraident pour résoudre une addition géante',
    asset: mathImg1,
    filterStyle: 'hue-rotate(240deg) saturate(0.9)',
  },
  {
    themeId: 'math-08',
    themeNumber: 8,
    themeName: { fr: 'Robot & Logique Binaire', ar: 'الروبوت والمنطق الذكي', en: 'Robot & Logic Workshop' },
    concept: 'Petit robot curieux manipulant des circuits logiques et des puzzles d’abaque',
    colorPalette: {
      name: 'Bleu Canard & Vert Menthe',
      primary: '#0E7490',
      secondary: '#06B6D4',
      accent: '#10B981',
      bg: '#ECFEFF',
      border: '#0891B2',
      badgeBg: '#0E7490',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.97)',
      cartoucheBorder: '#A5F3FC',
    },
    visualElements: ['robot amical', 'cartes perforées modernes', 'puces électroniques ludiques', 'boulier moderne'],
    composition: 'Robot placé à droite, cartouche d’écriture à gauche avec circuits décoratifs',
    illustrationStyle: 'Design rétro-futuriste épuré pour papeterie premium',
    mood: 'Curieux, technologique et stimulant',
    typographyZone: 'Écran de commande blanc satiné avec contours arrondis',
    generationInstructions: 'Dessiner un automate attachant avec un écran coeur et des blocs de logique binaire',
    asset: mathImg2,
    filterStyle: 'hue-rotate(160deg)',
  },
  {
    themeId: 'math-09',
    themeNumber: 9,
    themeName: { fr: 'Océan des Formes Sous-Marines', ar: 'محيط الأشكال المائية', en: 'Ocean of Geometric Forms' },
    concept: 'Banc de poissons polygonaux et coraux géométriques dans un lagon turquoise',
    colorPalette: {
      name: 'Turquoise Pastel & Corail',
      primary: '#0F766E',
      secondary: '#14B8A6',
      accent: '#F43F5E',
      bg: '#F0FDFA',
      border: '#0D9488',
      badgeBg: '#0F766E',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#99F6E4',
    },
    visualElements: ['poisson tétraèdre', 'méduses hémisphériques', 'bulles numérotées', 'coquillage spirale dorée'],
    composition: 'Immersion sous-marine avec lumière filtrante au sommet et fond marin doux',
    illustrationStyle: 'Illustration aquatique stylisée en dégradés doux',
    mood: 'Calme, fascinant et immersif',
    typographyZone: 'Cartouche flottant telle une perle protégée au centre',
    generationInstructions: 'Concevoir un monde marin stylisé où chaque créature suit une loi géométrique précise',
    asset: mathImg1,
    filterStyle: 'hue-rotate(140deg) saturate(1.1)',
  },
  {
    themeId: 'math-10',
    themeNumber: 10,
    themeName: { fr: 'Arc-en-Ciel Géométrique', ar: 'قوس قزح الأشكال الملونة', en: 'Geometric Rainbow' },
    concept: 'Arches colorées composées de prismes projetant des faisceaux multicolores',
    colorPalette: {
      name: 'Multicolore Pastel & Blanc Crème',
      primary: '#4338CA',
      secondary: '#EC4899',
      accent: '#F59E0B',
      bg: '#FAF5FF',
      border: '#6366F1',
      badgeBg: '#4338CA',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.98)',
      cartoucheBorder: '#E9D5FF',
    },
    visualElements: ['arche prismatique', 'gouttes de lumière', 'segments colorés', 'solides de Platon en cristal'],
    composition: 'Arche supérieure enveloppante guidant le regard vers les informations',
    illustrationStyle: 'Vecteur lumineux pastel avec transparences douces',
    mood: 'Enchanteur, éclatant et bienveillant',
    typographyZone: 'Cartouche central immaculé posé sur un nuage géométrique',
    generationInstructions: 'Illustrer la décomposition de la lumière blanche en couleurs géométriques nettes',
    asset: mathImg2,
    filterStyle: 'saturate(1.2) brightness(1.03)',
  },
  {
    themeId: 'math-11',
    themeNumber: 11,
    themeName: { fr: 'Explorateurs des Nombres', ar: 'مستكشفو الأرقام والكنوز', en: 'Number Explorers' },
    concept: 'Deux jeunes aventuriers déchiffrant une carte au trésor mathématique',
    colorPalette: {
      name: 'Terracotta & Bleu Ciel',
      primary: '#C2410C',
      secondary: '#FB923C',
      accent: '#0284C7',
      bg: '#FFF7ED',
      border: '#EA580C',
      badgeBg: '#C2410C',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#FED7AA',
    },
    visualElements: ['boussole graduée', 'parchemin de coordonnées', 'loupe grossissant pi', 'jumelles d’arpenteur'],
    composition: 'Scène d’expédition en bordure avec plateau cartographique central',
    illustrationStyle: 'Style livre de contes d’aventures contemporain',
    mood: 'Intrépide, passionnant et curieux',
    typographyZone: 'Parchemin stylisé aux bords arrondis au centre',
    generationInstructions: 'Dessiner une carte au trésor où les étapes sont des énigmes mathématiques amusantes',
    asset: mathImg1,
    filterStyle: 'sepia(0.2) contrast(1.05)',
  },
  {
    themeId: 'math-12',
    themeNumber: 12,
    themeName: { fr: 'Atelier Tangram & Puzzle', ar: 'ورشة التانغرام والألغاز', en: 'Tangram & Puzzle Studio' },
    concept: 'Formes découpées en bois pastel formant des animaux géométriques stylisés',
    colorPalette: {
      name: 'Bois Blond & Couleurs Pastel',
      primary: '#475569',
      secondary: '#64748B',
      accent: '#06B6D4',
      bg: '#F8FAFC',
      border: '#94A3B8',
      badgeBg: '#334155',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.97)',
      cartoucheBorder: '#CBD5E1',
    },
    visualElements: ['oiseau tangram', 'chat en triangles', 'pièces colorées magnétiques', 'tapis de feutrine'],
    composition: 'Mosaïque aérée entourant le cartouche de texte',
    illustrationStyle: 'Rendu texturé épuré style jouet design scandinave',
    mood: 'Créatif, apaisant et tactile',
    typographyZone: 'Cadre rectangulaire sobre et épuré avec coins doux',
    generationInstructions: 'Composer un tableau harmonieux fait de pièces de tangram multicolores assemblées',
    asset: mathImg2,
    filterStyle: 'grayscale(0.1) contrast(1.05)',
  },
  {
    themeId: 'math-13',
    themeNumber: 13,
    themeName: { fr: 'Univers Pixel & Mathématiques Digitales', ar: 'عالم البكسل والرياضيات الرقمية', en: 'Pixel Math Universe' },
    concept: 'Monde isométrique cubique inspiré du voxel art et des algorithmes',
    colorPalette: {
      name: 'Bleu Arcade & Vert Émeraude',
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#10B981',
      bg: '#F0FDF4',
      border: '#2563EB',
      badgeBg: '#1E40AF',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.96)',
      cartoucheBorder: '#BFDBFE',
    },
    visualElements: ['cubes isométriques 3D', 'coeurs de vie mathématiques', 'grille digitale lumineuse', 'gemmes chiffres'],
    composition: 'Paysage isométrique en escalier avec piédestal central',
    illustrationStyle: 'Voxel art élégant et doux, éclairage zénithal chaleureux',
    mood: 'Ludique, moderne et stimulant pour les jeunes',
    typographyZone: 'Cartouche flottant au-dessus de la plateforme isométrique',
    generationInstructions: 'Concevoir une île flottante en blocs 3D où chaque cube représente une unité de calcul',
    asset: mathImg1,
    filterStyle: 'hue-rotate(200deg) contrast(1.08)',
  },
  {
    themeId: 'math-14',
    themeNumber: 14,
    themeName: { fr: 'Royaume des Formes & Symétrie', ar: 'مملكة التناظر والأشكال', en: 'Symmetry Kingdom' },
    concept: 'Château stylisé entièrement fondé sur la symétrie axiale et centrale',
    colorPalette: {
      name: 'Pourpre Royal & Or Pâle',
      primary: '#5B21B6',
      secondary: '#7C3AED',
      accent: '#EAB308',
      bg: '#FAF5FF',
      border: '#6D28D9',
      badgeBg: '#5B21B6',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.97)',
      cartoucheBorder: '#DDD6FE',
    },
    visualElements: ['château symétrique', 'miroir de réflexion', 'losanges royaux', 'drapeaux aux angles parfaits'],
    composition: 'Symétrie axiale absolue le long de la ligne médiane verticale',
    illustrationStyle: 'Graphisme stylisé contemporain digne d’un conte mathématique',
    mood: 'Majestueux, ordonné et captivant',
    typographyZone: 'Portail monumental du château accueillant les informations élève',
    generationInstructions: 'Dessiner un palais dont la moitié droite est le reflet parfait de la gauche dans un miroir d’eau',
    asset: mathImg2,
    filterStyle: 'hue-rotate(270deg)',
  },
  {
    themeId: 'math-15',
    themeNumber: 15,
    themeName: { fr: 'Science des Données & Graphiques', ar: 'علم البيانات والمخططات الذكية', en: 'Data Science & Charts' },
    concept: 'Histogrammes colorés devenant des collines et courbes d’étoiles',
    colorPalette: {
      name: 'Bleu Marine & Framboise',
      primary: '#0F172A',
      secondary: '#2563EB',
      accent: '#E11D48',
      bg: '#F8FAFC',
      border: '#1E293B',
      badgeBg: '#0F172A',
      badgeText: '#FFFFFF',
      cartoucheBg: 'rgba(255, 255, 255, 0.97)',
      cartoucheBorder: '#CBD5E1',
    },
    visualElements: ['diagrammes à barres en 3D pastel', 'courbes sinusoïdales douces', 'secteurs circulaires stylisés'],
    composition: 'Graphiques en vagues douces au bas de la page, ciel dégagé en haut',
    illustrationStyle: 'Infographie moderne et chaleureuse pour la jeunesse',
    mood: 'Clair, structuré et tourné vers l’avenir',
    typographyZone: 'Cartouche horizontal supérieur avec bordure bleu nuit soignée',
    generationInstructions: 'Transformer des courbes et graphiques mathématiques en un paysage poétique et harmonieux',
    asset: mathImg1,
    filterStyle: 'contrast(1.06)',
  },
];

// Helper to build 15 themes for any subject systematically
export function generateSubjectThemes(
  subjectKey: string,
  baseTitle: { fr: string; ar: string; en: string },
  themesList: Array<{
    num: number;
    title: { fr: string; ar: string; en: string };
    concept: string;
    palette: { name: string; primary: string; secondary: string; accent: string; bg: string; border: string; badgeBg: string; badgeText: string; cartoucheBg: string; cartoucheBorder: string };
    elements: string[];
    composition: string;
    mood: string;
    instructions: string;
    asset: string;
    filter?: string;
  }>
): NotebookThemeArtisticDirection[] {
  return themesList.map((t) => ({
    themeId: `${subjectKey}-${String(t.num).padStart(2, '0')}`,
    themeNumber: t.num,
    themeName: t.title,
    concept: t.concept,
    colorPalette: t.palette,
    visualElements: t.elements,
    composition: t.composition,
    illustrationStyle: 'Premium modern cute educational vector illustration, high-end school stationery aesthetic',
    mood: t.mood,
    typographyZone: 'Zone dédiée à haute lisibilité avec cartouche blanc satiné et bordure coordonnée',
    generationInstructions: t.instructions,
    asset: t.asset,
    filterStyle: t.filter,
  }));
}
