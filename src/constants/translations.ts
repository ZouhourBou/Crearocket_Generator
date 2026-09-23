import { GeneratorType, NotebookSubject, PaperFormat, Language, SchoolLabelType } from '../types';

export interface Translations {
  platformTitle: string;
  platformSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  backToCrearocket: string;
  step1Title: string;
  step1Subtitle: string;
  step2LabelTypeTitle: string;
  step2LabelTypeSubtitle: string;
  step2Size: string;
  step3SizeTitle: string;
  step3Paper: string;
  step4Count: string;
  stepCoversCount: string;
  stepSubject: string;
  stepTheme: string;
  paletteTitle: string;
  paletteSubtitle: string;
  illustrationTitle: string;
  illustrationSubtitle: string;
  stepInfo: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  gradeLabel: string;
  gradePlaceholder: string;
  schoolCheckbox: string;
  schoolPlaceholder: string;
  subjectCheckbox: string;
  subjectPlaceholder: string;
  academicYearLabel: string;
  academicYearPlaceholder: string;
  charLimitNotice: string;
  charsLabel: string;
  limitReached: string;
  linesUsedLabel: string;
  lineMaxReachedNotice: string;
  singleLineNotice: string;
  nameTooLongTitle: string;
  nameTooLongDesc: string;
  optionalBadge: string;
  fitSuccessBadge: string;
  fontSizeLabel: string;
  autoFontSize: string;
  customDimensions: string;
  widthLabel: string;
  heightLabel: string;
  maxCapacityText: string;
  overCapacityAlert: string;
  gridInfo: string;
  columnsLabel: string;
  rowsLabel: string;
  totalLabels: string;
  previewTitle: string;
  downloadPdf: string;
  downloadPng: string;
  printDirect: string;
  showCutMarks: string;
  showDimensions: string;
  showSafeZone: string;
  pageMarginsButton: string;
  pageMarginsTitle: string;
  pageMarginsSubtitle: string;
  labelSpacingButton: string;
  labelSpacingTitle: string;
  labelSpacingSubtitle: string;
  labelSpacingLabel: string;
  resetLabelSpacing: string;
  marginUniformLabel: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  marginAll: string;
  marginsTooLarge: string;
  resetMargins: string;
  fitToScreen: string;
  availableToolsTitle: string;
  availableToolsSubtitle: string;
  activityAvailable: string;
  schoolLabelsTitle: string;
  schoolLabelsDesc: string;
  worksheetGeneratorTitle: string;
  worksheetGeneratorDesc: string;
  worksheetHeroBreadcrumb: string;
  worksheetHeroTitle: string;
  worksheetHeroSubtitle: string;
  worksheetHeroCta: string;
  worksheetBadgeFormat: string;
  worksheetBadgeBlocks: string;
  worksheetBadgePdf: string;
  generalHeroBadge: string;
  generalHeroTitle: string;
  generalHeroSubtitle: string;
  generalBadgeFree: string;
  generalBadgePrint: string;
  generalBadgeQuality: string;
  backToGenerators: string;
  useGenerator: string;
  createLabelsBtn: string;
  createWorksheetBtn: string;
  statusAvailable: string;
  statusComingSoon: string;
  upcomingTitle: string;
  upcomingSubtitle: string;
  cardFlashcardsTitle: string;
  cardFlashcardsDesc: string;
  cardColoringTitle: string;
  cardColoringDesc: string;
  cardCertificatesTitle: string;
  cardCertificatesDesc: string;
  cardGamesTitle: string;
  cardGamesDesc: string;
  cardTimetableTitle: string;
  cardTimetableDesc: string;
  cardCalendarTitle: string;
  cardCalendarDesc: string;
  futureToolsTitle: string;
  futureToolsSubtitle: string;
  comingSoon: string;
  typeNames: Record<GeneratorType, string>;
  typeDescriptions: Record<GeneratorType, string>;
  schoolLabelTypeLabel: string;
  schoolLabelTypes: Record<
    SchoolLabelType,
    {
      name: string;
      desc: string;
    }
  >;
  fieldErrors: {
    fullName: string;
    grade: string;
    subjectName: string;
    schoolName: string;
  };
  textTooLong: string;
  useShorterText: string;
  formatTooSmall: string;
  subjects: Record<NotebookSubject, string>;
  coversPerSheetOptions: {
    1: string;
    2: string;
    3: string;
    custom: string;
  };
  paperFormatNames: Record<PaperFormat, string>;
  footerText: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  fr: {
    platformTitle: 'Crearocket Generator',
    platformSubtitle: 'Plateforme de génération créative',
    heroTitle: "GÉNÉRATEUR D'ÉTIQUETTES SCOLAIRES",
    heroSubtitle: 'Créez facilement des étiquettes et couvertures personnalisées, prêtes à imprimer.',
    heroCta: 'GÉNÉRER MES ÉTIQUETTES',
    backToCrearocket: 'Retour vers Crearocket',
    step1Title: '1. Choisissez votre type',
    step1Subtitle: 'Sélectionnez le type de support que vous souhaitez concevoir',
    step2LabelTypeTitle: "2. Type d'étiquette",
    step2LabelTypeSubtitle: "Choisissez le type d'étiquette à créer",
    step2Size: "2. Taille de l'étiquette",
    step3SizeTitle: "4. Taille de l'étiquette",
    step3Paper: 'Format du papier',
    step4Count: "Nombre d'étiquettes",
    stepCoversCount: '2. Nombre de couvertures par A4',
    stepSubject: '3. Type de cahier',
    stepTheme: 'Thème graphique',
    paletteTitle: 'Palette de couleurs',
    paletteSubtitle: 'Choisissez votre palette de couleurs',
    illustrationTitle: 'Illustration',
    illustrationSubtitle: 'Choisissez votre univers graphique',
    stepInfo: 'Informations personnelles',
    fullNameLabel: 'Nom et prénom',
    fullNamePlaceholder: 'Entrez votre nom et prénom',
    gradeLabel: 'Classe',
    gradePlaceholder: 'Entrez votre classe',
    schoolCheckbox: 'École',
    schoolPlaceholder: 'Entrez votre école',
    subjectCheckbox: 'Matière',
    subjectPlaceholder: 'Entrez votre matière',
    academicYearLabel: 'Année scolaire',
    academicYearPlaceholder: 'Ex: 2024-2025 ou 2025-2026',
    charLimitNotice: 'Le nombre de caractères est limité à',
    charsLabel: 'caractères',
    limitReached: 'limite atteinte',
    linesUsedLabel: 'Lignes utilisées :',
    lineMaxReachedNotice: 'Limite de lignes atteinte pour ce format d’étiquette.',
    singleLineNotice: 'Cette dimension permet uniquement 1 ligne de texte.',
    nameTooLongTitle: '⚠ Le nom est trop long pour cette étiquette',
    nameTooLongDesc: 'Veuillez raccourcir le nom pour qu’il puisse tenir sur une seule ligne.',
    optionalBadge: 'Optionnel',
    fitSuccessBadge: 'Format adapté',
    fontSizeLabel: 'Taille du texte',
    autoFontSize: 'Auto',
    customDimensions: 'Dimensions personnalisées',
    widthLabel: 'Largeur',
    heightLabel: 'Hauteur',
    maxCapacityText: 'Capacité maximale :',
    overCapacityAlert: 'Le nombre demandé dépasse la capacité maximale de la page.',
    gridInfo: 'Disposition calculée :',
    columnsLabel: 'colonnes',
    rowsLabel: 'lignes',
    totalLabels: 'étiquettes sur la page',
    previewTitle: 'Aperçu Réel & Impression',
    downloadPdf: 'Télécharger PDF (Prêt à imprimer)',
    downloadPng: 'Télécharger PNG (300 DPI)',
    printDirect: 'Imprimer directement',
    showCutMarks: 'Traits de coupe',
    showDimensions: 'Dimensions',
    showSafeZone: 'Zone de sécurité',
    pageMarginsButton: 'Marges de page',
    pageMarginsTitle: 'Marges de la page',
    pageMarginsSubtitle: 'Définissez l’espace entre le bord de la page et les étiquettes.',
    labelSpacingButton: "Marge d'étiquette",
    labelSpacingTitle: "Marge d'étiquette",
    labelSpacingSubtitle: "Espacement horizontal et vertical entre les étiquettes (gap).",
    labelSpacingLabel: "Espacement entre étiquettes",
    resetLabelSpacing: 'Réinitialiser',
    marginUniformLabel: 'Même marge sur les 4 côtés',
    marginTop: 'Top',
    marginRight: 'Right',
    marginBottom: 'Bottom',
    marginLeft: 'Left',
    marginAll: 'Marge',
    marginsTooLarge: 'Les marges sélectionnées sont trop importantes pour ce format de page.',
    resetMargins: 'Réinitialiser (0 mm)',
    fitToScreen: 'Ajuster',
    availableToolsTitle: 'Générateurs disponibles',
    availableToolsSubtitle: 'Des outils pédagogiques prêts à l’emploi pour vos impressions et activités scolaires.',
    activityAvailable: 'Activité disponible',
    schoolLabelsTitle: "Générateur d'étiquettes & kits anniversaire",
    schoolLabelsDesc: "Planches d'étiquettes personnalisées pour fournitures, livres et kits anniversaire complets prêts à imprimer.",
    worksheetGeneratorTitle: "Générateur de Fiches d'Exercices Pédagogiques",
    worksheetGeneratorDesc: "Créez des exercices, devoirs et évaluations personnalisés, prêts à imprimer, en quelques clics.",
    worksheetHeroBreadcrumb: "GÉNÉRATEUR DE FICHES D'EXERCICES",
    worksheetHeroTitle: "Générateur de fiches d'exercices pédagogiques",
    worksheetHeroSubtitle: "Concevez facilement des fiches d'exercices, devoirs et évaluations personnalisés prêts à imprimer.",
    worksheetHeroCta: "✨ CRÉER MA FICHE D'EXERCICES",
    worksheetBadgeFormat: "✓ Format A4 (portrait et paysage)",
    worksheetBadgeBlocks: "✓ Blocs pédagogiques éditables (QCM, Vrai/Faux, Relier, Tableaux…)",
    worksheetBadgePdf: "✓ Export PDF avec corrigé automatique",
    generalHeroBadge: "CREATROCKET GENERATOR PRO",
    generalHeroTitle: "GÉNÉRATEURS INTELLIGENTS",
    generalHeroSubtitle: "Créez, personnalisez et imprimez en quelques clics tous vos documents prêts pour l'impression.",
    generalBadgeFree: "100% Gratuit",
    generalBadgePrint: "Haute résolution",
    generalBadgeQuality: "Qualité 300 DPI",
    backToGenerators: "Tous les générateurs",
    useGenerator: "Utiliser",
    createLabelsBtn: "Créer mes étiquettes",
    createWorksheetBtn: "Créer ma fiche",
    statusAvailable: "Disponible",
    statusComingSoon: "Bientôt disponible",
    upcomingTitle: "Bientôt disponibles",
    upcomingSubtitle: "Les futurs générateurs éducatifs et créatifs en cours de développement pour enrichir votre classe et le quotidien scolaire.",
    cardFlashcardsTitle: "Générateur de cartes mémoire (Flashcards)",
    cardFlashcardsDesc: "Créez des cartes de mémorisation bilingues, imagiers et cartes questions-réponses pour les révisions.",
    cardColoringTitle: "Générateur de coloriages & mandalas",
    cardColoringDesc: "Planches thématiques à colorier, dessins éducatifs et mandalas relaxants prêts pour l'impression.",
    cardCertificatesTitle: "Générateur de certificats & diplômes",
    cardCertificatesDesc: "Diplômes d'encouragement, prix d'excellence et brevets de fin d'année personnalisés.",
    cardGamesTitle: "Générateur de jeux éducatifs & puzzles",
    cardGamesDesc: "Mots croisés, sudokus illustrés, dominos scolaires et bingos éducatifs sur-mesure.",
    cardTimetableTitle: "Générateur d'emplois du temps & plannings",
    cardTimetableDesc: "Emplois du temps hebdomadaires colorés, semainiers scolaires et organiseurs d'activités.",
    cardCalendarTitle: "Générateur de calendriers & devoirs",
    cardCalendarDesc: "Calendriers de classe, suivi des devoirs et routines scolaires personnalisables.",
    futureToolsTitle: 'Autres générateurs à venir...',
    futureToolsSubtitle: 'La suite de création de documents pédagogiques et créatifs Crearocket.',
    comingSoon: 'Bientôt disponible',
    typeNames: {
      supplies: 'Étiquette scolaire',
      books: 'Étiquette Livres & Cahiers',
      notebook_cover: 'واجهة كراس (Couverture de cahier)',
      birthday_kit: 'Kits anniversaire',
    },
    typeDescriptions: {
      supplies: 'Créez facilement vos étiquettes pour toutes vos affaires scolaires.',
      books: 'Pour cahiers, livres, classeurs et manuels scolaires.',
      notebook_cover: 'Créez une couverture personnalisée et élégante pour votre cahier.',
      birthday_kit: 'Invitations, affiches, étiquettes cadeaux et décorations assorties.',
    },
    schoolLabelTypeLabel: "Type d'étiquette",
    schoolLabelTypes: {
      supplies: {
        name: 'Étiquette fournitures',
        desc: 'Pour stylos, crayons, règles, feutres et petites fournitures.',
      },
      books: {
        name: 'Étiquette cahier & livres',
        desc: 'Pour cahiers, livres, manuels scolaires, classeurs et dossiers.',
      },
    },
    fieldErrors: {
      fullName: "Le texte est trop long pour ce format d'étiquette. Veuillez utiliser un texte plus court.",
      grade: "Le texte est trop long pour ce format d'étiquette. Veuillez utiliser un texte plus court.",
      subjectName: "Le texte est trop long pour ce format d'étiquette. Veuillez utiliser un texte plus court.",
      schoolName: "Le texte est trop long pour ce format d'étiquette. Veuillez utiliser un texte plus court.",
    },
    textTooLong: "Le texte est trop long pour ce format d'étiquette.",
    useShorterText: "Veuillez utiliser un texte plus court.",
    formatTooSmall: "Ce format d'étiquette est trop petit pour afficher toutes les informations.",
    subjects: {
      math: 'Mathématiques',
      french: 'Français',
      arabic: 'Arabe',
      english: 'English',
      history: 'Histoire',
      geography: 'Géographie',
      science: 'Sciences',
      islamic: 'Éducation islamique',
      exercise: "Cahier d'exercices",
      homework: 'Cahier de devoirs',
      textbook: 'Cahier de texte',
      other: 'Autre matière',
    },
    coversPerSheetOptions: {
      1: '1 par A4 (Pleine page)',
      2: '2 par A4 (A5 côte à côte)',
      3: '3 par A4 (3 designs différents)',
      custom: 'Personnalisé (mm)',
    },
    paperFormatNames: {
      A4: 'A4 (210 × 297 mm)',
      A5: 'A5 (148 × 210 mm)',
      custom: 'Personnalisé',
    },
    footerText: '© Crearocket Generator — Plateforme officielle de création pour fournitures & supports scolaires.',
  },
  ar: {
    platformTitle: 'Crearocket Generator',
    platformSubtitle: 'منصة التوليد الإبداعي المدرسية',
    heroTitle: 'مولّد الملصقات وواجهات الكراسات المدرسية',
    heroSubtitle: 'صمم بكل سهولة ملصقات وواجهات كراسات مخصصة وجاهزة للطباعة بجودة عالية.',
    heroCta: 'إنشاء ملصقاتي الآن',
    backToCrearocket: 'العودة إلى Crearocket',
    step1Title: '1. اختر نوع الملصق',
    step1Subtitle: 'حدد نوع الدعامة التي ترغب في تصميمها وتجهيزها للطباعة',
    step2LabelTypeTitle: '2. نوع الملصق',
    step2LabelTypeSubtitle: 'اختر نوع الملصق المراد تصميمه',
    step2Size: '2. حجم الملصق',
    step3SizeTitle: '4. مقاس الملصق',
    step3Paper: 'حجم الورقة',
    step4Count: 'عدد الملصقات',
    stepCoversCount: '2. عدد واجهات الكراس في الورقة A4',
    stepSubject: '3. مادة الكراس',
    stepTheme: 'النمط والتصميم الفني',
    paletteTitle: 'لوحة الألوان',
    paletteSubtitle: 'اختر لوحة الألوان المفضلة',
    illustrationTitle: 'الرسومات والكون',
    illustrationSubtitle: 'اختر عالم الرسوم الكرتونية',
    stepInfo: 'المعلومات الشخصية',
    fullNameLabel: 'الاسم واللقب',
    fullNamePlaceholder: 'أدخل الاسم واللقب',
    gradeLabel: 'القسم / المستوى',
    gradePlaceholder: 'أدخل القسم أو المستوى',
    schoolCheckbox: 'المدرسة',
    schoolPlaceholder: 'أدخل اسم المدرسة',
    subjectCheckbox: 'المادة',
    subjectPlaceholder: 'أدخل اسم المادة',
    academicYearLabel: 'السنة الدراسية',
    academicYearPlaceholder: 'مثال: 2024-2025',
    charLimitNotice: 'الحد الأقصى للأحرف هو',
    charsLabel: 'حرف',
    limitReached: 'تم بلوغ الحد الأقصى',
    linesUsedLabel: 'الأسطر المستخدمة:',
    lineMaxReachedNotice: 'تم بلوغ الحد الأقصى لعدد الأسطر لهذا المقاس.',
    singleLineNotice: 'هذا المقاس يسمح بسطر واحد فقط من النص.',
    nameTooLongTitle: '⚠ الاسم طويل جداً بالنسبة لهذا المقاس',
    nameTooLongDesc: 'يرجى كتابة اسم أقصر ليتسع على سطر واحد داخل الملصق.',
    optionalBadge: 'اختياري',
    fitSuccessBadge: 'متوافق تماماً',
    fontSizeLabel: 'حجم الخط',
    autoFontSize: 'تلقائي',
    customDimensions: 'أبعاد مخصصة',
    widthLabel: 'العرض',
    heightLabel: 'الارتفاع',
    maxCapacityText: 'السعة القصوى للورقة:',
    overCapacityAlert: 'العدد المطلوب يتجاوز الطاقة الاستيعابية للورقة المحددة.',
    gridInfo: 'توزيع الشبكة المحسوب:',
    columnsLabel: 'أعمدة',
    rowsLabel: 'صفوف',
    totalLabels: 'ملصق على الورقة',
    previewTitle: 'معاينة الورقة الحقيقية والطباعة',
    downloadPdf: 'تحميل ملف PDF (جاهز للطباعة)',
    downloadPng: 'تحميل صورة PNG (دقة 300 DPI)',
    printDirect: 'طباعة فورية',
    showCutMarks: 'خطوط القص',
    showDimensions: 'الأبعاد بالـ ملم',
    showSafeZone: 'منطقة الأمان',
    pageMarginsButton: 'هوامش الصفحة',
    pageMarginsTitle: 'هوامش الصفحة',
    pageMarginsSubtitle: 'حدد المسافة بين حافة الصفحة والملصقات.',
    labelSpacingButton: 'هامش الملصقات',
    labelSpacingTitle: 'هامش الملصقات',
    labelSpacingSubtitle: 'التباعد الأفقي والعمودي بين الملصقات (gap).',
    labelSpacingLabel: 'التباعد بين الملصقات',
    resetLabelSpacing: 'إعادة ضبط',
    marginUniformLabel: 'نفس الهامش على الجوانب الأربعة',
    marginTop: 'Top (أعلى)',
    marginRight: 'Right (يمين)',
    marginBottom: 'Bottom (أسفل)',
    marginLeft: 'Left (يسار)',
    marginAll: 'الهامش',
    marginsTooLarge: 'الهوامش المحددة كبيرة جداً بالنسبة لحجم هذه الصفحة.',
    resetMargins: 'إعادة ضبط (0 mm)',
    fitToScreen: 'ملاءمة الشاشة',
    availableToolsTitle: 'المولّدات المتوفرة حالياً',
    availableToolsSubtitle: 'أدوات تعليمية متكاملة جاهزة للاستخدام والطباعة المباشرة.',
    activityAvailable: 'Activité disponible',
    schoolLabelsTitle: 'مولّد الملصقات وباقات أعياد الميلاد',
    schoolLabelsDesc: 'ملصقات مخصصة للأدوات والكتب وباقات أعياد ميلاد متكاملة جاهزة للطباعة.',
    worksheetGeneratorTitle: 'مولّد أوراق التمارين والامتحانات التربوية',
    worksheetGeneratorDesc: 'أنشئ تمارين واختبارات وتقييمات مخصصة جاهزة للطباعة بنقرات بسيطة.',
    worksheetHeroBreadcrumb: 'مولّد أوراق التمارين',
    worksheetHeroTitle: 'مولّد أوراق التمارين التربوية',
    worksheetHeroSubtitle: 'صمم واطبع تمارين واختبارات مدرسية قابلة للتخصيص وجاهزة للطباعة فوراً.',
    worksheetHeroCta: '✨ إنشاء ورقة التمارين',
    worksheetBadgeFormat: '✓ قياس A4 (عمودي وأفقي)',
    worksheetBadgeBlocks: '✓ وحدات تعليمية قابلة للتعديل (اختيارات، صح/خطأ، ربط…)',
    worksheetBadgePdf: '✓ تصدير PDF مع مفتاح الحل التلقائي',
    generalHeroBadge: 'منظومة CREATROCKET GENERATOR PRO',
    generalHeroTitle: 'مولّدات ذكية',
    generalHeroSubtitle: 'صمم وخصص واطبع في ثوانٍ مستندات وأنشطة عالية الدقة وجاهزة للطباعة فوراً.',
    generalBadgeFree: 'مجاني 100%',
    generalBadgePrint: 'دقة طباعة فائقة',
    generalBadgeQuality: 'جودة 300 DPI',
    backToGenerators: 'جميع المولّدات',
    useGenerator: 'استخدام المولّد',
    createLabelsBtn: 'إنشاء الملصقات',
    createWorksheetBtn: 'إنشاء ورقة تمارين',
    statusAvailable: 'متوفر',
    statusComingSoon: 'بانتظار الإطلاق',
    upcomingTitle: 'مولّدات قادمة قريباً',
    upcomingSubtitle: 'مجموعة الأدوات والمولّدات التربوية القادمة لدعم الأساتذة والأولياء والطلاب.',
    cardFlashcardsTitle: 'مولّد البطاقات التعليمية (Flashcards)',
    cardFlashcardsDesc: 'بطاقات حفظ سريعة ثنائية اللغة، مفردات مصورة وأسئلة مراجعة للمواد الدراسية.',
    cardColoringTitle: 'مولّد رسومات التلوين والمندالا',
    cardColoringDesc: 'صفحات تلوين وأنشطة فنية وترفيهية متنوعة جاهزة للطباعة.',
    cardCertificatesTitle: 'مولّد الشهادات ولوحات الشرف',
    cardCertificatesDesc: 'شهادات تقدير وتشجيع للتفوق الدراسي والمشاركة الصفية.',
    cardGamesTitle: 'مولّد الألعاب والألغاز المدرسية',
    cardGamesDesc: 'كلمات متقاطعة، متاهات، سودوكو وبطاقات بينغو تعليمية هادفة.',
    cardTimetableTitle: 'مولّد جداول الحصص والتنظيم',
    cardTimetableDesc: 'جداول أوقات أسبوعية ملونة ومنظمات دراسية للطلاب والصفوف.',
    cardCalendarTitle: 'مولّد التقويمات ومتابعة الواجبات',
    cardCalendarDesc: 'تقويمات دراسية، متابعة الواجبات اليومية وجداول العادات الإيجابية.',
    futureToolsTitle: 'أدوات أخرى قادمة قريباً...',
    futureToolsSubtitle: 'باقة أدوات Crearocket لتوليد المستندات التعليمية والبطاقات والأنشطة.',
    comingSoon: 'قريباً',
    typeNames: {
      supplies: 'ملصق مدرسي',
      books: 'ملصق الكتب والكراسات',
      notebook_cover: 'واجهة كراس مخصصة',
      birthday_kit: 'باقة أعياد الميلاد',
    },
    typeDescriptions: {
      supplies: 'أنشئ بسهولة ملصقاتك لجميع أغراضك ومستلزماتك المدرسية.',
      books: 'للكراسات، الكتب، الحافظات والمراجع المدرسية.',
      notebook_cover: 'صمم واجهة كراس فريدة ومميزة تناسب المادة المحددة.',
      birthday_kit: 'دعوات وافتات وملصقات هدايا وزينة متناسقة لحفلة عيد الميلاد.',
    },
    schoolLabelTypeLabel: 'نوع الملصق',
    schoolLabelTypes: {
      supplies: {
        name: 'ملصق الأدوات المدرسية',
        desc: 'للأقلام، أقلام الرصاص، المساطر، أقلام التلوين والمستلزمات الصغيرة.',
      },
      books: {
        name: 'ملصق مدرسي',
        desc: 'للكراسات، الكتب، المراجع المدرسية، الحافظات والملفات.',
      },
    },
    fieldErrors: {
      fullName: 'النص طويل جداً بالنسبة لمقاس هذا الملصق. يرجى استخدام نص أقصر.',
      grade: 'النص طويل جداً بالنسبة لمقاس هذا الملصق. يرجى استخدام نص أقصر.',
      subjectName: 'النص طويل جداً بالنسبة لمقاس هذا الملصق. يرجى استخدام نص أقصر.',
      schoolName: 'النص طويل جداً بالنسبة لمقاس هذا الملصق. يرجى استخدام نص أقصر.',
    },
    textTooLong: 'النص طويل جداً بالنسبة لمقاس هذا الملصق.',
    useShorterText: 'يرجى استخدام نص أقصر.',
    formatTooSmall: 'هذا المقاس صغير جداً لعرض جميع المعلومات.',
    subjects: {
      math: 'الرياضيات',
      french: 'اللغة الفرنسية',
      arabic: 'اللغة العربية',
      english: 'اللغة الإنجليزية',
      history: 'التاريخ',
      geography: 'الجغرافيا',
      science: 'العلوم والإيقاظ العلمي',
      islamic: 'التربية الإسلامية',
      exercise: 'كراس التمارين',
      homework: 'كراس الواجبات',
      textbook: 'كراس النصوص',
      other: 'مادة أخرى',
    },
    coversPerSheetOptions: {
      1: '1 في ورقة A4 (صفحة كاملة)',
      2: '2 في ورقة A4 (A5 جنباً إلى جنب)',
      3: '3 في ورقة A4 (3 تصاميم مختلفة)',
      custom: 'مقاس مخصص (ملم)',
    },
    paperFormatNames: {
      A4: 'A4 (210 × 297 ملم)',
      A5: 'A5 (148 × 210 ملم)',
      custom: 'مخصص',
    },
    footerText: '© Crearocket Generator — المنصة الرسمية لإنشاء وتوليد الملصقات والواجهات المدرسية.',
  },
  en: {
    platformTitle: 'Crearocket Generator',
    platformSubtitle: 'Creative Generation Platform',
    heroTitle: 'SCHOOL LABELS & COVERS GENERATOR',
    heroSubtitle: 'Easily create custom school labels and notebook covers, ready to print in high quality.',
    heroCta: 'GENERATE MY LABELS',
    backToCrearocket: 'Back to Crearocket',
    step1Title: '1. Choose your type',
    step1Subtitle: 'Select the type of school label or cover you want to design',
    step2LabelTypeTitle: '2. Label Type',
    step2LabelTypeSubtitle: 'Choose the type of label to create',
    step2Size: '2. Label Size',
    step3SizeTitle: '4. Label Size',
    step3Paper: 'Paper Format',
    step4Count: 'Number of Labels',
    stepCoversCount: '2. Covers per A4 Sheet',
    stepSubject: '3. Notebook Subject',
    stepTheme: 'Design Theme',
    paletteTitle: 'Color Palette',
    paletteSubtitle: 'Choose your color palette',
    illustrationTitle: 'Illustration',
    illustrationSubtitle: 'Choose your graphic universe',
    stepInfo: 'Personal Information',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    gradeLabel: 'Grade / Class',
    gradePlaceholder: 'Enter your grade / class',
    schoolCheckbox: 'School',
    schoolPlaceholder: 'Enter your school name',
    subjectCheckbox: 'Subject',
    subjectPlaceholder: 'Enter your subject',
    academicYearLabel: 'Academic Year',
    academicYearPlaceholder: 'Ex: 2024-2025',
    charLimitNotice: 'Character limit is',
    charsLabel: 'characters',
    limitReached: 'limit reached',
    linesUsedLabel: 'Lines used:',
    lineMaxReachedNotice: 'Maximum lines reached for this label size.',
    singleLineNotice: 'This size only allows 1 line of text.',
    nameTooLongTitle: '⚠ The name is too long for this label',
    nameTooLongDesc: 'Please shorten the name so it fits on a single line.',
    optionalBadge: 'Optional',
    fitSuccessBadge: 'Fits format',
    fontSizeLabel: 'Font size',
    autoFontSize: 'Auto',
    customDimensions: 'Custom Dimensions',
    widthLabel: 'Width',
    heightLabel: 'Height',
    maxCapacityText: 'Maximum Capacity:',
    overCapacityAlert: 'The requested quantity exceeds sheet capacity.',
    gridInfo: 'Calculated Grid:',
    columnsLabel: 'columns',
    rowsLabel: 'rows',
    totalLabels: 'labels per page',
    previewTitle: 'Real Paper Preview & Print',
    downloadPdf: 'Download PDF (Print Ready)',
    downloadPng: 'Download PNG (300 DPI)',
    printDirect: 'Print Directly',
    showCutMarks: 'Cut Marks',
    showDimensions: 'Dimensions',
    showSafeZone: 'Safe Zone',
    pageMarginsButton: 'Page Margins',
    pageMarginsTitle: 'Page Margins',
    pageMarginsSubtitle: 'Define the space between the edge of the page and the labels.',
    labelSpacingButton: 'Label Spacing',
    labelSpacingTitle: 'Label Spacing',
    labelSpacingSubtitle: 'Horizontal and vertical spacing between labels (gap).',
    labelSpacingLabel: 'Spacing between labels',
    resetLabelSpacing: 'Reset',
    marginUniformLabel: 'Same margin on all 4 sides',
    marginTop: 'Top',
    marginRight: 'Right',
    marginBottom: 'Bottom',
    marginLeft: 'Left',
    marginAll: 'Margin',
    marginsTooLarge: 'The selected margins are too large for this page format.',
    resetMargins: 'Reset (0 mm)',
    fitToScreen: 'Fit to Screen',
    availableToolsTitle: 'Available Generators',
    availableToolsSubtitle: 'Ready-to-use educational tools for your printouts and classroom activities.',
    activityAvailable: 'Activité disponible',
    schoolLabelsTitle: 'Labels & Birthday Kits Generator',
    schoolLabelsDesc: 'Custom printable label sheets for stationery, books and complete coordinated birthday party kits.',
    worksheetGeneratorTitle: 'Educational Worksheets Generator',
    worksheetGeneratorDesc: 'Create customized exercises, homework, and assessments ready to print in a few clicks.',
    worksheetHeroBreadcrumb: 'WORKSHEETS GENERATOR',
    worksheetHeroTitle: 'Educational Worksheets Generator',
    worksheetHeroSubtitle: 'Easily design and print custom worksheets, tests, and homework sheets.',
    worksheetHeroCta: '✨ CREATE MY WORKSHEET',
    worksheetBadgeFormat: '✓ A4 format (portrait & landscape)',
    worksheetBadgeBlocks: '✓ Editable pedagogical blocks (MCQ, True/False, Match, Tables…)',
    worksheetBadgePdf: '✓ PDF export with automatic answer key',
    generalHeroBadge: 'CREATROCKET GENERATOR PRO',
    generalHeroTitle: 'SMART GENERATORS',
    generalHeroSubtitle: 'Design, customize, and print all your high-resolution documents in just a few clicks.',
    generalBadgeFree: '100% Free',
    generalBadgePrint: 'High Resolution',
    generalBadgeQuality: '300 DPI Quality',
    backToGenerators: 'All Generators',
    useGenerator: 'Use Generator',
    createLabelsBtn: 'Create Labels',
    createWorksheetBtn: 'Create Worksheet',
    statusAvailable: 'Available',
    statusComingSoon: 'Coming Soon',
    upcomingTitle: 'Coming Soon',
    upcomingSubtitle: 'Upcoming creative and pedagogical generators currently in development to empower teachers, parents, and students.',
    cardFlashcardsTitle: 'Flashcards & Memory Cards Generator',
    cardFlashcardsDesc: 'Create bilingual vocabulary cards, visual flashcards, and Q&A revision decks.',
    cardColoringTitle: 'Coloring Pages & Art Sheets',
    cardColoringDesc: 'Themed coloring pages, educational line art, and relaxing mandalas ready to print.',
    cardCertificatesTitle: 'Certificates & Awards Generator',
    cardCertificatesDesc: 'Custom student encouragement awards, achievement diplomas, and certificates.',
    cardGamesTitle: 'Educational Games & Puzzles',
    cardGamesDesc: 'Crosswords, illustrated sudokus, educational dominos, and classroom bingos.',
    cardTimetableTitle: 'Timetables & Class Planners',
    cardTimetableDesc: 'Colorful weekly class timetables, student schedules, and planners.',
    cardCalendarTitle: 'Calendars & Homework Trackers',
    cardCalendarDesc: 'Classroom calendars, homework organizers, and daily school routines.',
    futureToolsTitle: 'More generators coming soon...',
    futureToolsSubtitle: 'The upcoming Crearocket suite for educational sheets, cards, and games.',
    comingSoon: 'Coming Soon',
    typeNames: {
      supplies: 'School Label',
      books: 'Books & Notebooks Label',
      notebook_cover: 'Notebook Cover (واجهة كراس)',
      birthday_kit: 'Birthday Kit',
    },
    typeDescriptions: {
      supplies: 'Easily create your labels for all your school supplies.',
      books: 'For notebooks, textbooks, binders and school manuals.',
      notebook_cover: 'Create a custom, high-quality notebook cover suited for your subject.',
      birthday_kit: 'Invitations, posters, gift favors, and matching party toppers.',
    },
    schoolLabelTypeLabel: 'Label Type',
    schoolLabelTypes: {
      supplies: {
        name: 'School supplies label',
        desc: 'For pens, pencils, rulers, markers and small stationery.',
      },
      books: {
        name: 'School label',
        desc: 'For notebooks, books, textbooks, binders and folders.',
      },
    },
    fieldErrors: {
      fullName: 'The text is too long for this label size. Please use shorter text.',
      grade: 'The text is too long for this label size. Please use shorter text.',
      subjectName: 'The text is too long for this label size. Please use shorter text.',
      schoolName: 'The text is too long for this label size. Please use shorter text.',
    },
    textTooLong: 'The text is too long for this label size.',
    useShorterText: 'Please use shorter text.',
    formatTooSmall: 'This label format is too small to display all information.',
    subjects: {
      math: 'Mathematics',
      french: 'French',
      arabic: 'Arabic',
      english: 'English',
      history: 'History',
      geography: 'Geography',
      science: 'Science',
      islamic: 'Islamic Education',
      exercise: 'Exercise Book',
      homework: 'Homework Notebook',
      textbook: 'Textbook Notebook',
      other: 'Other Subject',
    },
    coversPerSheetOptions: {
      1: '1 per A4 (Full Page)',
      2: '2 per A4 (A5 side by side)',
      3: '3 per A4 (3 Distinct Designs)',
      custom: 'Custom (mm)',
    },
    paperFormatNames: {
      A4: 'A4 (210 × 297 mm)',
      A5: 'A5 (148 × 210 mm)',
      custom: 'Custom',
    },
    footerText: '© Crearocket Generator — Official platform for school labels and print-ready educational covers.',
  },
};
