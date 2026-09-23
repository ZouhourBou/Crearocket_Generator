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
import mathImg1 from '../assets/images/cahier_math_a4_1789212071479.jpg';
import mathImg2 from '../assets/images/math_cover_geom_1789242685083.jpg';
import { NotebookThemeArtisticDirection } from './notebookThemesDatabase';

// Helper palette generator for soft, pastel, elegant school stationery
function makePalette(name: string, primary: string, secondary: string, accent: string, bg: string, border: string) {
  return {
    name,
    primary,
    secondary,
    accent,
    bg,
    border,
    badgeBg: primary,
    badgeText: '#FFFFFF',
    cartoucheBg: 'rgba(255, 255, 255, 0.96)',
    cartoucheBorder: border,
  };
}

// 2. FRANÇAIS (15 THÈMES)
export const FRENCH_THEMES: NotebookThemeArtisticDirection[] = [
  'Bibliothèque Enchantée', 'Forêt des Mots & Contes', 'Plume & Poésie Rétro',
  'Ballon Voyageur des Lettres', 'Théâtre des Personnages', 'Atelier d’Écriture Magique',
  'Explorateurs de la Grammaire', 'L’Île aux Romans d’Aventures', 'Alphabet Cosmique & Typo',
  'Jardin des Mots Fleuris', 'Navire des Histoires', 'Café Littéraire & Livres Volants',
  'Manuscrit & Encre d’Or', 'Royaume des Fables d’Ésope', 'Détectives des Syllabes',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Rose Poudré & Ambre', '#BE185D', '#F43F5E', '#F59E0B', '#FFF1F2', '#FDA4AF'),
    makePalette('Prune Douce & Crème', '#831843', '#DB2777', '#FBBF24', '#FDF2F8', '#F472B6'),
    makePalette('Lavande & Pêche', '#7C3AED', '#A855F7', '#FB923C', '#FAF5FF', '#C084FC'),
    makePalette('Bordeaux Rétro & Or', '#991B1B', '#DC2626', '#EAB308', '#FEF2F2', '#FCA5A5'),
    makePalette('Corail Doux & Ivoire', '#C2410C', '#EA580C', '#38BDF8', '#FFF7ED', '#FDBA74'),
  ];
  return {
    themeId: `french-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `اللغة الفرنسية — ${name}`, en: `French — ${name}` },
    concept: `Univers littéraire jeunesse riche : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['livre ouvert magique', 'lettres de l’alphabet en suspension', 'plume d’oie dorée', 'marque-page ruban', 'personnage lecteur'],
    composition: 'Composition équilibrée avec livres illustrés encadrant le cartouche de texte central',
    illustrationStyle: 'Illustration jeunesse poétique et chaleureuse pour papeterie de luxe',
    mood: 'Poétique, captivant, imaginaire et soigné',
    typographyZone: 'Cartouche central blanc pur avec bordure fine et ombrage délicat',
    generationInstructions: `Créer une couverture de cahier de français élégante et féerique axée sur ${name}`,
    asset: i % 2 === 0 ? francaisImg1 : francaisImg2,
    filterStyle: i % 3 === 1 ? 'sepia(0.15) contrast(1.03)' : i % 3 === 2 ? 'hue-rotate(25deg)' : 'none',
  };
});

// 3. ARABE (15 THÈMES)
export const ARABIC_THEMES: NotebookThemeArtisticDirection[] = [
  { fr: 'Oasis des Lettres & Calligraphie', ar: 'واحة الحروف والخط العربي' },
  { fr: 'Étoiles du Dhad & Galaxie des Mots', ar: 'نجوم الضاد والمجرة اللغوية' },
  { fr: 'Jardin de l’Éloquence & Plume d’Or', ar: 'حديقة البلاغة والقلم الذهبي' },
  { fr: 'Citadelle des Contes Arabes', ar: 'قلعة الحكايات العربية التراثية' },
  { fr: 'Phare du Savoir & Sagesses', ar: 'منارة الكلمات والحكمة' },
  { fr: 'Navire de Sindbad & Récits', ar: 'سفينة السندباد والقصص البحرية' },
  { fr: 'Voyage des Styles (Naskh & Ruq’ah)', ar: 'رحلة الخطوط (نسخ ورقعة)' },
  { fr: 'Fleurs des Poèmes & Rimes', ar: 'أزهار القوافي والقصائد العذبة' },
  { fr: 'Palais Lumineux de l’Alphabet', ar: 'قصر الأبجدية المضيء' },
  { fr: 'Oiseau de la Connaissance & Livre', ar: 'طائر المعرفة والكتاب العظيم' },
  { fr: 'Parchemins d’Andalousie & Encre', ar: 'أوراق الأندلس والمخطوطات العريقة' },
  { fr: 'Verger de la Lecture & Clarté', ar: 'بستان القراءة والبيان' },
  { fr: 'Ciel des Lettres Étincelantes', ar: 'فضاء الحروف المتلألئة' },
  { fr: 'Soleil de la Langue Arabe', ar: 'شمس الضاد الدافئة' },
  { fr: 'Chevaliers de la Langue & Poésie', ar: 'فرسان اللغة والأدب الرفيع' },
].map((item, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Vert Émeraude & Or Impérial', '#065F46', '#059669', '#F59E0B', '#ECFDF5', '#6EE7B7'),
    makePalette('Bleu Majorelle & Ambre', '#1E40AF', '#3B82F6', '#D97706', '#EFF6FF', '#93C5FD'),
    makePalette('Turquoise Chaud & Ocre', '#0F766E', '#14B8A6', '#F59E0B', '#F0FDFA', '#5EEAD4'),
    makePalette('Terracotta & Sable Doré', '#9A3412', '#EA580C', '#CA8A04', '#FFF7ED', '#FDBA74'),
    makePalette('Pourpre d’Orient & Crème', '#701A75', '#A21CAF', '#EAB308', '#FDF4FF', '#F0ABFC'),
  ];
  return {
    themeId: `arabic-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: item.fr, ar: item.ar, en: `Arabic — ${item.fr}` },
    concept: `Direction artistique calligraphique et patrimoniale : ${item.ar}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['lettres arabes artistiques (ض، س، ك، م)', 'motifs géométriques arabesques', 'plume de calligraphe', 'parchemin calligraphié', 'dôme d’architecture orientale'],
    composition: 'Harmonie centrale avec arabesque protectrice autour du cartouche d’écriture',
    illustrationStyle: 'Art calligraphique et vectoriel raffiné mariant tradition et modernité pour écoliers',
    mood: 'Prestigieux, noble, chaleureux et inspirant',
    typographyZone: 'Cartouche cartouche oriental orné de rosaces délicates, texte lisible à 100%',
    generationInstructions: `Concevoir une couverture pour la langue arabe centrée sur ${item.ar} avec arabesques dorées`,
    asset: i % 2 === 0 ? arabeImg1 : arabeImg2,
    filterStyle: i % 3 === 1 ? 'sepia(0.2) saturate(1.1)' : i % 3 === 2 ? 'hue-rotate(-20deg)' : 'none',
  };
});

// 4. ANGLAIS (15 THÈMES)
export const ENGLISH_THEMES: NotebookThemeArtisticDirection[] = [
  'London Explorer & Big Ben', 'Oxford Library & Bookworms', 'British Teatime & Vocabulary',
  'Shakespeare’s Globe Theatre', 'American Roadtrip & Monuments', 'English Rose Garden & Nature',
  'Space Spelling Rocket', 'Detective Word Hunt & Sherlock', 'Ocean Voyage & Phonics',
  'Camelot Castle & Storytellers', 'Comic Book Heroes & Speech Bubbles', 'Cozy Reading Fox & Tea',
  'Around the World in English', 'Magic Spell & Grammar Keys', 'Retro Radio & English Club',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Bleu Royal & Rouge Westminster', '#1E3A8A', '#DC2626', '#F59E0B', '#EFF6FF', '#BFDBFE'),
    makePalette('Bleu Marine & Cyan Oxford', '#0F172A', '#0284C7', '#EF4444', '#F0F9FF', '#7DD3FC'),
    makePalette('Vert Forêt & Rouge Brique', '#14532D', '#15803D', '#B91C1C', '#F0FDF4', '#86EFAC'),
    makePalette('Bleu Ciel & Jaune Taxi', '#0369A1', '#0EA5E9', '#EAB308', '#F0F9FF', '#BAE6FD'),
    makePalette('Pourpre & Ambre Royal', '#581C87', '#7E22CE', '#F59E0B', '#FAF5FF', '#D8B4FE'),
  ];
  return {
    themeId: `english-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `اللغة الإنجليزية — ${name}`, en: name },
    concept: `Exploration de la culture anglophone : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['double-decker bus rouge', 'cabine téléphonique anglaise', 'couronne royale', 'bulles de dialogue en anglais', 'Big Ben'],
    composition: 'Scène dynamique inspirée des grandes capitales anglophones avec espace texte réservé',
    illustrationStyle: 'Vectoriel contemporain pop-chic digne de la papeterie londonienne',
    mood: 'Entraînant, cosmopolite, international et joyeux',
    typographyZone: 'Cartouche cartouche épuré blanc aux lignes graphiques soignées',
    generationInstructions: `Générer une couverture scolaire d’anglais lumineuse et attractive sur le thème ${name}`,
    asset: i % 2 === 0 ? anglaisImg1 : anglaisImg2,
    filterStyle: i % 3 === 1 ? 'saturate(1.2)' : i % 3 === 2 ? 'hue-rotate(15deg)' : 'none',
  };
});

// 5. SCIENCES (15 THÈMES)
export const SCIENCE_THEMES: NotebookThemeArtisticDirection[] = [
  'Laboratoire & Réactions Chimiques', 'Astronomie & Système Solaire', 'Microscope & Monde Invisible',
  'Botanique & Écosystème Forêt', 'Océanographie & Abysses Marins', 'Robotique & IA Futuriste',
  'Énergie Verte & Éoliennes', 'Anatomie & Corps Humain', 'Volcanologie & Cristaux de Terre',
  'Météorologie & Cycle de l’Eau', 'Paléontologie & Dinosaures', 'Physique & Ondes Lumineuses',
  'Station Spatiale & Satellites', 'Génétique & Hélice ADN Végétale', 'Expéditions Polaires & Banquise',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Bleu Électrique & Vert Néon', '#0369A1', '#0284C7', '#10B981', '#F0FDFA', '#5EEAD4'),
    makePalette('Indigo Profond & Ambre Solaire', '#312E81', '#4F46E5', '#F59E0B', '#EEF2FF', '#A5B4FC'),
    makePalette('Vert Émeraude & Jaune Citron', '#065F46', '#059669', '#EAB308', '#ECFDF5', '#6EE7B7'),
    makePalette('Bleu Pétrole & Corail Lumineux', '#155E75', '#0891B2', '#F43F5E', '#ECFEFF', '#67E8F9'),
    makePalette('Violet Galaxie & Turquoise', '#581C87', '#7C3AED', '#06B6D4', '#FAF5FF', '#C084FC'),
  ];
  return {
    themeId: `science-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `العلوم الطبيعية — ${name}`, en: `Science — ${name}` },
    concept: `Exploration scientifique et découverte du monde naturel : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['microscope de précision', 'éprouvettes multicolores', 'atomes en orbite', 'ADN spiralé', 'planètes en 3D'],
    composition: 'Agencement scientifique avec instruments de laboratoire et observations microscopiques',
    illustrationStyle: 'Vectoriel éducatif précis, lumineux et stimulant pour jeunes scientifiques',
    mood: 'Fascinant, curieux, rigoureux et avant-gardiste',
    typographyZone: 'Zone d’information protégée avec cadre à angles techniques fins',
    generationInstructions: `Créer une couverture captivante de cahier de sciences basée sur ${name}`,
    asset: i % 2 === 0 ? scienceImg1 : scienceImg2,
    filterStyle: i % 3 === 1 ? 'hue-rotate(45deg) saturate(1.1)' : i % 3 === 2 ? 'contrast(1.05)' : 'none',
  };
});

// 6. HISTOIRE (15 THÈMES)
export const HISTORY_THEMES: NotebookThemeArtisticDirection[] = [
  'Égypte Antique & Pyramides Dorées', 'Châteaux Forts & Chevaliers', 'Grandes Découvertes & Caravelles',
  'Grèce Antique & Philosophie', 'Empire Romain & Arènes', 'Siècle des Lumières & Manuscrits',
  'Révolution Industrielle & Vapeur', 'Trésors de Carthage & Numidie', 'Renaissance & Ateliers d’Art',
  'Explorateurs de la Préhistoire', 'Routes de la Soie & Caravanes', 'Palais d’Orient & Mille et Une Nuits',
  'Frise Chronologique du Monde', 'Musée Historique & Trésors', 'Archéologues & Cités Perdues',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Ocre Égyptien & Lapis-lazuli', '#92400E', '#B45309', '#1E40AF', '#FFFBEB', '#FDE68A'),
    makePalette('Terracotta & Sable Chaud', '#9A3412', '#C2410C', '#CA8A04', '#FFF7ED', '#FDBA74'),
    makePalette('Pourpre Médiéval & Or', '#581C87', '#7E22CE', '#EAB308', '#FAF5FF', '#DDD6FE'),
    makePalette('Bleu Carthage & Cuivre', '#1E3A8A', '#2563EB', '#EA580C', '#EFF6FF', '#BFDBFE'),
    makePalette('Bronze Antique & Crème', '#713F12', '#854D0E', '#0284C7', '#FEFCE8', '#FEF08A'),
  ];
  return {
    themeId: `history-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `التاريخ — ${name}`, en: `History — ${name}` },
    concept: `Voyage à travers les grandes époques historiques : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['pyramides stylisées', 'caravelle naviguant sur les flots', 'parchemin antique', 'bouclier et heaume médiéval', 'amphore'],
    composition: 'Perspective historique monumentale laissant une zone claire centrale pour le texte',
    illustrationStyle: 'Gravure contemporaine colorée et adaptée à la jeunesse',
    mood: 'Épique, instructif, immersif et noble',
    typographyZone: 'Parchemin stylisé ou stèle gravée avec lisibilité maximale',
    generationInstructions: `Illustrer une couverture historique d’exception sur ${name}`,
    asset: histGeoImg,
    filterStyle: i % 3 === 1 ? 'sepia(0.3)' : i % 3 === 2 ? 'hue-rotate(-30deg)' : 'none',
  };
});

// 7. GÉOGRAPHIE (15 THÈMES)
export const GEOGRAPHY_THEMES: NotebookThemeArtisticDirection[] = [
  'Mappemonde & Boussole d’Explorateur', 'Montagnes Enneigées & Cols Alpins', 'Désert Doré & Oasis Miroitantes',
  'Jungle Tropicale & Grands Fleuves', 'Archipels Coralliens & Îles', 'Métropoles Modernes & Urbanisme',
  'Aurores Boréales & Pôles Glacés', 'Paysages Agraires & Vallées Vertes', 'Savane Africaine & Faune Sauvage',
  'Volcans d’Asie & Ceinture de Feu', 'Climats & Courants Marins', 'Continents du Monde & Drapeaux',
  'Sentiers de Randonnée & Carto', 'Canyon Rouge & Géologie', 'Planète Terre Vue de l’Espace',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Bleu Océan & Vert Prairies', '#0369A1', '#0284C7', '#16A34A', '#F0F9FF', '#7DD3FC'),
    makePalette('Sable du Sahara & Turquoise', '#B45309', '#D97706', '#06B6D4', '#FFFBEB', '#FDE68A'),
    makePalette('Vert Forêt & Ciel Pastel', '#166534', '#15803D', '#38BDF8', '#F0FDF4', '#86EFAC'),
    makePalette('Bleu Glacier & Aurore Polaire', '#1E3A8A', '#3B82F6', '#10B981', '#EFF6FF', '#93C5FD'),
    makePalette('Terracotta Canyon & Soleil', '#9A3412', '#EA580C', '#F59E0B', '#FFF7ED', '#FED7AA'),
  ];
  return {
    themeId: `geography-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `الجغرافيا — ${name}`, en: `Geography — ${name}` },
    concept: `Exploration des paysages et de la planète Terre : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['globe terrestre détaillé', 'boussole dorée', 'carte topographique', 'montagnes stylisées', 'oiseau migrateur'],
    composition: 'Vue panoramique planétaire ou cartographique avec médaillon central d’information',
    illustrationStyle: 'Style cartographique et paysager moderne aux teintes naturelles',
    mood: 'Vaste, aventureux, écologique et émerveillant',
    typographyZone: 'Cartouche cartographique ovale ou rectangulaire entouré d’une bordure fine',
    generationInstructions: `Créer une couverture de géographie magnifique sur le thème ${name}`,
    asset: histGeoImg,
    filterStyle: i % 3 === 1 ? 'hue-rotate(70deg)' : i % 3 === 2 ? 'saturate(1.2)' : 'none',
  };
});

// 8. ÉDUCATION ISLAMIQUE (15 THÈMES)
export const ISLAMIC_THEMES: NotebookThemeArtisticDirection[] = [
  { fr: 'Lanternes Lumineuses & Arabesques', ar: 'القناديل المضيئة والزخارف الأندلسية' },
  { fr: 'Mosquée Majestueuse & Minaret', ar: 'رحاب المسجد والمئذنة الشامخة' },
  { fr: 'Fontaine des Vertus & Nobles Valeurs', ar: 'نبع الأخلاق والفضائل الكريمة' },
  { fr: 'Livre Saint de la Récitation', ar: 'مصحف النور والتلاوة العذبة' },
  { fr: 'Jardins de la Piété & Paix Intérieure', ar: 'رياض الإيمان والتقوى' },
  { fr: 'Croissant Béni & Nuit Étoilée', ar: 'هلال رمضان وسماء البركة' },
  { fr: 'Caravane du Pèlerinage & Paix', ar: 'قافلة الحج والأماكن المقدسة' },
  { fr: 'Arbre des Bonnes Actions', ar: 'شجرة الأعمال الصالحة والإحسان' },
  { fr: 'Récits des Prophètes & Sagesses', ar: 'حكايات الأنبياء والعبر الخالدة' },
  { fr: 'Aube de Sérénité & Prière', ar: 'فجر الإيمان والسكينة' },
  { fr: 'Lumières de la Sagesse Prophétique', ar: 'أنوار السيرة النبوية الكريمة' },
  { fr: 'Mihrab Traditionnel & Mosaïques', ar: 'المحراب التراثي والهندسة الإسلامية' },
  { fr: 'Verger des Invocations & Douceur', ar: 'بستان الأذكار والأدعية المستجابة' },
  { fr: 'Soleil de Générosité & Bienfaisance', ar: 'شمس الهداية والعطاء' },
  { fr: 'Oasis de Paix & Tolérance', ar: 'واحة السلام والتسامح' },
].map((item, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Vert Paix & Or Sacré', '#047857', '#059669', '#F59E0B', '#ECFDF5', '#6EE7B7'),
    makePalette('Bleu Nuit Spirituel & Étoiles', '#1E3A8A', '#3B82F6', '#D97706', '#EFF6FF', '#93C5FD'),
    makePalette('Turquoise Mihrab & Doré', '#0F766E', '#14B8A6', '#EAB308', '#F0FDFA', '#5EEAD4'),
    makePalette('Ambre Chaud & Ivoire', '#B45309', '#D97706', '#10B981', '#FFFBEB', '#FDE68A'),
    makePalette('Pourpre Noble & Or Pâle', '#6B21A8', '#9333EA', '#F59E0B', '#FAF5FF', '#E9D5FF'),
  ];
  return {
    themeId: `islamic-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: item.fr, ar: item.ar, en: `Islamic Education — ${item.fr}` },
    concept: `Art et spiritualité bienveillante : ${item.ar}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['croissant de lune doré', 'lanternes suspendues en laiton', 'arabesques géométriques traditionnelles', 'rosace islamique', 'arche de minaret'],
    composition: 'Arche en fer à cheval encadrant le ciel étoilé et le cartouche protégé',
    illustrationStyle: 'Art islamique contemporain poétique et doux spécialement pensé pour les enfants',
    mood: 'Serein, lumineux, respectueux et chaleureux',
    typographyZone: 'Cartouche orné d’entrelacs islamiques dorés, ultra-lisible',
    generationInstructions: `Concevoir une couverture islamique empreinte de douceur et de sérénité sur le thème ${item.ar}`,
    asset: islamImg,
    filterStyle: i % 3 === 1 ? 'sepia(0.2) saturate(1.1)' : i % 3 === 2 ? 'hue-rotate(20deg)' : 'none',
  };
});

// 9. EXERCICES & GRAMMAIRE (15 THÈMES)
export const EXERCISE_THEMES: NotebookThemeArtisticDirection[] = [
  'Atelier des Défis & Exercices', 'Entraînement Quotidien & Clarté', 'Grilles, Règle & Précision',
  'Formules & Règles d’Or', 'Marathon des Connaissances', 'Carnet de Bord de la Réussite',
  'Énigmes & Casse-Têtes d’Esprit', 'Laboratoire de Pratique & Révision', 'Parcours des Champions Scolaires',
  'Mémo-Pratique & Fiches Astuces', 'Boussole des Devoirs Réussis', 'Crayon Magique & Feuilles à Carreaux',
  'Circuit d’Entraînement Ludique', 'Cahier Propre & Écriture Claire', 'Objectif 100% Réussite',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Bleu Écolier & Jaune Crayon', '#1E40AF', '#2563EB', '#EAB308', '#EFF6FF', '#93C5FD'),
    makePalette('Rouge Dynamique & Menthe', '#B91C1C', '#DC2626', '#10B981', '#FEF2F2', '#FCA5A5'),
    makePalette('Orange Énergie & Bleu Ciel', '#C2410C', '#EA580C', '#0284C7', '#FFF7ED', '#FED7AA'),
    makePalette('Vert Victoire & Or', '#15803D', '#16A34A', '#F59E0B', '#F0FDF4', '#86EFAC'),
    makePalette('Violet Champion & Corail', '#6D28D9', '#7C3AED', '#FB7185', '#FAF5FF', '#DDD6FE'),
  ];
  return {
    themeId: `exercise-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `كراس التمارين — ${name}`, en: `Exercise Book — ${name}` },
    concept: `Pratique quotidienne et méthodologie active : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['crayons de couleur taillés', 'taille-crayon', 'gomme stylisée', 'coches de réussite vertes', 'lignes séyès douces'],
    composition: 'Composition dynamique axée sur l’action d’écrire et de réussir ses exercices',
    illustrationStyle: 'Graphisme scolaire vitaminé et encourageant',
    mood: 'Motivant, clair, méthodique et réconfortant',
    typographyZone: 'Cartouche cartouche type étiquette d’écolier classique modernisée',
    generationInstructions: `Dessiner une couverture vivante pour cahier d’exercices sur ${name}`,
    asset: exercicesImg,
    filterStyle: i % 3 === 1 ? 'saturate(1.2)' : i % 3 === 2 ? 'hue-rotate(-15deg)' : 'none',
  };
});

// 10. DEVOIRS & ÉDUCATION CIVIQUE (15 THÈMES)
export const HOMEWORK_THEMES: NotebookThemeArtisticDirection[] = [
  'Citoyen de Demain & Belles Valeurs', 'Vivre Ensemble & Entraide', 'Droits et Devoirs des Enfants',
  'Planificateur des Devoirs du Soir', 'Maisonnette du Travail & Sérénité', 'Éco-Responsable & Nature',
  'Solidarité & Respect Mutuel', 'Conseil des Enfants & Démocratie', 'Horloge du Soir & Organisation',
  'Jardin de la Paix & Tolérance', 'Étoiles du Travail Accompli', 'Ville Propre & Citoyenneté',
  'Clés de l’Autonomie Scolaire', 'Village Mondial & Amitié', 'Mon Carnet de Citoyen Modèle',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Bleu Confiance & Orange Énergie', '#1E40AF', '#3B82F6', '#EA580C', '#EFF6FF', '#BFDBFE'),
    makePalette('Vert Espoir & Jaune Soleil', '#15803D', '#22C55E', '#F59E0B', '#F0FDF4', '#86EFAC'),
    makePalette('Bleu Nuit Sérénité & Pêche', '#1E293B', '#334155', '#F97316', '#F8FAFC', '#CBD5E1'),
    makePalette('Terracotta Doux & Sauge', '#C2410C', '#F97316', '#10B981', '#FFF7ED', '#FED7AA'),
    makePalette('Pourpre Harmonie & Ambre', '#701A75', '#A21CAF', '#F59E0B', '#FDF4FF', '#F0ABFC'),
  ];
  return {
    themeId: `homework-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `كراس الواجبات والتربية المدنية — ${name}`, en: `Homework & Civics — ${name}` },
    concept: `Responsabilité, devoirs du soir et civisme positif : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['maisonnette accueillante', 'lampe de bureau chaleureuse', 'sablier du temps bien géré', 'mains d’entraide', 'étoile dorée'],
    composition: 'Atmosphère calme de travail à la maison avec cartouche structuré au centre',
    illustrationStyle: 'Illustration douce, chaleureuse et sécurisante pour l’enfant après l’école',
    mood: 'Posé, autonome, bienveillant et structuré',
    typographyZone: 'Cartouche horizontal blanc épuré pour inscription immédiate',
    generationInstructions: `Créer une couverture pour cahier de devoirs rassurante et organisée sur ${name}`,
    asset: exercicesImg,
    filterStyle: i % 3 === 1 ? 'contrast(1.05)' : i % 3 === 2 ? 'hue-rotate(45deg)' : 'none',
  };
});

// 11. CAHIER DE TEXTE (15 THÈMES)
export const TEXTBOOK_THEMES: NotebookThemeArtisticDirection[] = [
  'Agenda Scolaire & Calendrier Chic', 'Semainier Illustré & Petits Mémos', 'Horloge Magique & Emploi du Temps',
  'Carnet de Textes & Citations', 'Boussole de la Semaine Réussie', 'Journal de Bord de la Classe',
  'Notes & Rappels en Couleurs Pastel', 'Planning Hebdomadaire Organisé', 'Boîte à Idées & Devoirs à Venir',
  'Chrono des Études & Organisation', 'Ruban Marque-Page & Jours d’École', 'Sablier Doré & Gestion du Temps',
  'Mémo des Devoirs & Révisions', 'Cahier des Textes & Projets', 'Éphéméride Illustré des Écoliers',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Lavande Pastel & Menthe Douce', '#6D28D9', '#8B5CF6', '#10B981', '#FAF5FF', '#DDD6FE'),
    makePalette('Bleu Pétrole & Pêche Pastel', '#0F766E', '#14B8A6', '#FB923C', '#F0FDFA', '#99F6E4'),
    makePalette('Rose Doux & Jaune Vanille', '#BE185D', '#F43F5E', '#FBBF24', '#FFF1F2', '#FECDD3'),
    makePalette('Bleu Nuit Organisé & Blanc', '#0F172A', '#2563EB', '#F59E0B', '#F8FAFC', '#BFDBFE'),
    makePalette('Vert Sauge & Beige Doré', '#047857', '#10B981', '#D97706', '#F0FDF4', '#A7F3D0'),
  ];
  return {
    themeId: `textbook-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `كراسة النصوص — ${name}`, en: `Textbook Planner — ${name}` },
    concept: `Organisation du temps scolaire et relevé des textes : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['calendrier mural illustré', 'horloge douce', 'marque-page coloré', 'stylos ordonnés', 'épingles et post-its pastel'],
    composition: 'Bureau d’écolier ordonné avec agenda au premier plan et cartouche net',
    illustrationStyle: 'Design papeterie premium pastel et minimaliste',
    mood: 'Ordonné, élégant, apaisant et pratique',
    typographyZone: 'Cartouche supérieur bien proportionné pour un repérage immédiat',
    generationInstructions: `Composer une couverture raffinée de cahier de texte sur ${name}`,
    asset: francaisImg2,
    filterStyle: i % 3 === 1 ? 'saturate(0.9) brightness(1.04)' : i % 3 === 2 ? 'hue-rotate(-20deg)' : 'none',
  };
});

// 12. ARTS & AUTRE (15 THÈMES)
export const OTHER_ARTS_THEMES: NotebookThemeArtisticDirection[] = [
  'Atelier d’Art & Pinceaux Gouache', 'Palette de Peintre & Couleurs Vives', 'Poterie & Sculpture Créative',
  'Origami & Découpage en Couleurs', 'Aquarelle Pastel & Nuances Douces', 'Galerie des Jeunes Artistes',
  'Formes Géométriques Abstraites', 'Carnet de Croquis & Dessin Libre', 'Mosaïque Colorée & Motifs',
  'Musique & Portée de Notes Magiques', 'Théâtre & Masques de Créativité', 'Nature & Teintures Végétales',
  'Ville Imaginaire en Couleurs', 'Vitrail Lumineux & Transparences', 'Multi-Matières & Créativité Totale',
].map((name, i) => {
  const num = i + 1;
  const palettes = [
    makePalette('Multicolore Éclatant & Blanc', '#7C3AED', '#EC4899', '#F59E0B', '#FAF5FF', '#E9D5FF'),
    makePalette('Bleu Cyan & Magenta Vibrant', '#0284C7', '#DB2777', '#EAB308', '#F0F9FF', '#BAE6FD'),
    makePalette('Jaune Soleil & Corail Artistique', '#D97706', '#EA580C', '#8B5CF6', '#FFFBEB', '#FDE68A'),
    makePalette('Vert Émeraude & Violet', '#059669', '#10B981', '#A855F7', '#ECFDF5', '#6EE7B7'),
    makePalette('Rose Bonbon & Turquoise', '#DB2777', '#F43F5E', '#06B6D4', '#FFF1F2', '#FECDD3'),
  ];
  return {
    themeId: `other-${String(num).padStart(2, '0')}`,
    themeNumber: num,
    themeName: { fr: name, ar: `التربية التشكيلية والفنون — ${name}`, en: `Arts & Multi-Subject — ${name}` },
    concept: `Créativité débridée, expression artistique et imagination : ${name}`,
    colorPalette: palettes[i % palettes.length],
    visualElements: ['palette en bois avec touches de gouache', 'pinceaux fins et brosses', 'tubes de peinture ouverts', 'éclats d’aquarelle', 'chevalet'],
    composition: 'Explosion artistique ordonnée avec touches de peinture entourant le cartouche blanc',
    illustrationStyle: 'Style artistique contemporain riche en textures et éclats colorés',
    mood: 'Créatif, jubilatoire, expressif et inspirant',
    typographyZone: 'Cartouche cartouche pur blanc contrastant parfaitement avec les couleurs vives',
    generationInstructions: `Créer une couverture ultra-créative pour cahier d’arts plastiques sur le thème ${name}`,
    asset: mathImg2,
    filterStyle: i % 3 === 1 ? 'saturate(1.3)' : i % 3 === 2 ? 'hue-rotate(180deg)' : 'none',
  };
});
