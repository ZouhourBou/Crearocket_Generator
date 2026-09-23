import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import {
  Tag,
  FilePenLine,
  CreditCard,
  Palette,
  Award,
  Gamepad2,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Lock,
  PenTool,
  Calculator,
  GraduationCap,
  Heart,
  Camera,
  BookOpen,
} from 'lucide-react';

interface HomeGeneratorsCatalogProps {
  language: Language;
  onNavigate: (route: string) => void;
}

export const HomeGeneratorsCatalog: React.FC<HomeGeneratorsCatalogProps> = ({
  language,
  onNavigate,
}) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  const availableGenerators = [
    {
      id: 'school-labels',
      route: '/generator/school-labels',
      icon: <Tag className="w-6 h-6 text-red-600" />,
      iconBg: 'bg-red-50 border-red-200/80',
      activeBorder: 'hover:border-red-400 focus:ring-red-500/20',
      accentColor: 'text-red-600 group-hover:text-red-700',
      btnBg: 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20',
      btnLabel: t.createLabelsBtn,
      title: t.schoolLabelsTitle,
      desc: t.schoolLabelsDesc,
      highlights: isArabic
        ? ['أدوات مدرسية', 'كتب وكراسات', 'واجهات كراس', 'باقات أعياد الميلاد']
        : language === 'en'
        ? ['School Supplies', 'Books & Notebooks', 'Notebook Covers', 'Birthday Kits']
        : ['Fournitures', 'Livres & Cahiers', 'Couvertures', 'Kits anniversaire'],
    },
    {
      id: 'worksheet-editor',
      route: '/generator/worksheet-editor',
      icon: <FilePenLine className="w-6 h-6 text-indigo-600" />,
      iconBg: 'bg-indigo-50 border-indigo-200/80',
      activeBorder: 'hover:border-indigo-400 focus:ring-indigo-500/20',
      accentColor: 'text-indigo-600 group-hover:text-indigo-700',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20',
      btnLabel: t.createWorksheetBtn,
      title: t.worksheetGeneratorTitle,
      desc: t.worksheetGeneratorDesc,
      highlights: isArabic
        ? ['تمارين واختبارات', 'مفتاح الحل التلقائي', 'محرر معادلات']
        : language === 'en'
        ? ['Exercises & Tests', 'Teacher Answer Key', 'Math Editor']
        : ['Exercices & Devoirs', 'Corrigé automatique', 'Éditeur de maths'],
    },
    {
      id: 'handwriting-practice',
      route: '/generator/handwriting-practice',
      icon: <PenTool className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-200/80',
      activeBorder: 'hover:border-emerald-400 focus:ring-emerald-500/20',
      accentColor: 'text-emerald-600 group-hover:text-emerald-700',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20',
      btnLabel: isArabic ? 'إنشاء كراس خط' : language === 'en' ? 'Create Handwriting Sheet' : 'Créer des fiches d\'écriture',
      title: isArabic ? 'مُوَلِّدُ أَوْرَاقِ الخَطِّ وَالتَّدْرِيب' : language === 'en' ? 'Handwriting Practice Worksheets' : 'Feuilles d\'Écriture & Tracé',
      desc: isArabic
        ? 'توليد أوراق تدريب على الكتابة، خطوط Seyès الفرنسية، تتبع الحروف العربية واللاتينية، والخطوط التمهيدية للأطفال.'
        : language === 'en'
        ? 'Professional handwriting practice sheets with Seyès French ruling, Arabic and Latin letter tracing, and pre-writing preschool lines.'
        : 'Générateur de feuilles d\'écriture manuscrite, lignages Seyès & débutants, traçage de lettres, prénoms et graphisme pré-scolaire.',
      highlights: isArabic
        ? ['تسطير Seyès الفرنسي', 'الحروف العربية واللاتينية', 'تمارين ما قبل الكتابة']
        : language === 'en'
        ? ['Seyès & 4-Lines Ruling', 'Arabic & Latin Letters', 'Pre-Writing Lines & Shapes']
        : ['Lignages Seyès & Couleurs', 'Lettres FR / AR / EN', 'Lignes de graphisme'],
    },
    {
      id: 'math-worksheets',
      route: '/generator/math-worksheets',
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-200/80',
      activeBorder: 'hover:border-amber-400 focus:ring-amber-500/20',
      accentColor: 'text-amber-600 group-hover:text-amber-700',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20',
      btnLabel: isArabic ? 'إنشاء تمارين رياضيات' : language === 'en' ? 'Create Math Worksheet' : 'Créer des fiches de maths',
      title: isArabic ? 'مُوَلِّدُ تَمَارِينِ الرِّيَاضِيَّات' : language === 'en' ? 'Math Worksheets Generator' : 'Générateur d\'Opérations Mathématiques',
      desc: isArabic
        ? 'توليد تمارين الجمع، الطرح، الضرب والقسمة، مع عمليات عمودية منسقة بدقة وصفحة حلول تلقائية للطباعة.'
        : language === 'en'
        ? 'Generate addition, subtraction, multiplication, and division practice sheets with aligned column math and automatic answer keys.'
        : 'Génération automatique d\'exercices d\'addition, soustraction, multiplication et division avec corrigés instantanés et calculs posés.',
      highlights: isArabic
        ? ['العمليات الأربع', 'مفتاح الحل التلقائي', 'عمليات عمودية وأفقية']
        : language === 'en'
        ? ['All 4 Operations', 'Instant Answer Key', 'Vertical Aligned Columns']
        : ['4 Opérations au choix', 'Corrigé automatique', 'Calculs posés précis'],
    },
    {
      id: 'game-puzzles',
      route: '/generator/game-puzzles',
      icon: <Gamepad2 className="w-6 h-6 text-purple-600" />,
      iconBg: 'bg-purple-50 border-purple-200/80',
      activeBorder: 'hover:border-purple-400 focus:ring-purple-500/20',
      accentColor: 'text-purple-600 group-hover:text-purple-700',
      btnBg: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20',
      btnLabel: isArabic ? 'إنشاء ألعاب وألغاز' : language === 'en' ? 'Create Games & Puzzles' : 'Créer des jeux éducatifs',
      title: isArabic ? 'مُوَلِّدُ الأَلْعَابِ وَالأَلْغَاز' : language === 'en' ? 'Game & Puzzle Generator' : 'Jeux & Puzzles Pédagogiques',
      desc: isArabic
        ? 'توليد ألعاب تعليمية جاهزة للطباعة: كلمات متقاطعة مخصصة، بطاقات تعليمية ولعبة الذاكرة، وسودوكو مخصص للأطفال 4×4 و6×6 و9×9 مع مفاتيح الحل.'
        : language === 'en'
        ? 'Printable educational games: algorithmic word search puzzles, flashcards and memory matching games, and kid-adapted 4x4, 6x6, and 9x9 Sudoku.'
        : 'Jeux éducatifs prêts à imprimer : mots mêlés algorithmiques, cartes éducatives & jeu de mémoire, et Sudoku adapté aux enfants (4×4, 6×6, 9×9) avec corrigés.',
      highlights: isArabic
        ? ['كلمات متقاطعة', 'بطاقات ذاكرة ومفردات', 'سودوكو أطفال']
        : language === 'en'
        ? ['Word Search Puzzles', 'Flashcards & Memory', 'Kid-Friendly Sudoku']
        : ['Mots Mêlés avec corrigé', 'Cartes & Memory', 'Sudoku 4×4, 6×6, 9×9'],
    },
    {
      id: 'alphabet-learning',
      route: '/generator/alphabet-learning',
      icon: <GraduationCap className="w-6 h-6 text-sky-600" />,
      iconBg: 'bg-sky-50 border-sky-200/80',
      activeBorder: 'hover:border-sky-400 focus:ring-sky-500/20',
      accentColor: 'text-sky-600 group-hover:text-sky-700',
      btnBg: 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20',
      btnLabel: isArabic ? 'إنشاء دفتر تعلم الحروف' : language === 'en' ? 'Create Alphabet Booklet' : "Créer un cahier de lettres",
      title: isArabic ? 'مُوَلِّدُ تَعَلُّمِ الحُرُوفِ الهِجَائِيَّة' : language === 'en' ? 'Alphabet Learning & Activity Booklet' : "Apprentissage de l'Alphabet & Fiches d'Activités",
      desc: isArabic
        ? 'توليد كراسات وأوراق متكاملة لتعلم الحروف العربية والفرنسية: تدريب الخط والمسارات، البحث عن الحرف، التلوين، التوصيل، القص واللصق، والمفردات.'
        : language === 'en'
        ? 'Generate complete pedagogical activity sheets & mini-booklets for learning French and Arabic letters: writing & tracing, letter search, coloring, matching, cut & paste, and vocabulary.'
        : "Générateur complet de fiches et mini-cahiers d'apprentissage des lettres françaises et arabes : écriture & traçage, recherche, coloriage, association, découpage/collage et vocabulaire.",
      highlights: isArabic
        ? ['العربية والفرنسية', '6 أنشطة متكاملة', 'كتيبات متعددة الصفحات مع الحلول']
        : language === 'en'
        ? ['French & Arabic Letters', '6 Pedagogical Activities', 'Multi-Page Activity Books']
        : ['Français & Arabe', '6 Activités complètes', 'Cahiers 1 à 6 pages'],
    },
    {
      id: 'photo-coloring',
      route: '/generator/photo-coloring',
      icon: <Camera className="w-6 h-6 text-rose-600" />,
      iconBg: 'bg-rose-50 border-rose-200/80',
      activeBorder: 'hover:border-rose-400 focus:ring-rose-500/20',
      accentColor: 'text-rose-600 group-hover:text-rose-700',
      btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
      btnLabel: isArabic ? 'إنشاء كتاب تلوين من الصور' : language === 'en' ? 'Create Photo Coloring Book' : 'Créer un livre de coloriage',
      title: isArabic ? 'مُوَلِّدُ كُتُبِ التَّلْوِينِ مِن الصُّوَرِ الشَّخْصِيَّة' : language === 'en' ? 'Photo → Coloring Book Generator' : 'Photo → Livre de Coloriage Personnalisé',
      desc: isArabic
        ? 'تحويل صور الأطفال إلى كتب تلوين أنيقة بالأبيض والأسود مع غلاف مخصص، شهادة إهداء، وتصدير عالي الدقة للطباعة أو النشر.'
        : language === 'en'
        ? 'Transform children’s photographs into beautiful, personalized black-and-white coloring books with custom covers, dedication pages, and high-resolution export.'
        : 'Transformez 5 photos d’enfants en un magnifique livre de coloriage personnalisé avec couverture illustrée, dédicace d’artiste et contours ultra-nets.',
      highlights: isArabic
        ? ['تحويل كلاسيكي فائق الدقة', 'غلاف مخصص باسم الطفل', 'تصدير PDF كامل للطباعة']
        : language === 'en'
        ? ['High-Fidelity Edge Detection', 'Personalized Cover with Child’s Name', 'Multi-page Printable PDF']
        : ['Extraction de contours DoG & Sobel', 'Couverture personnalisée', 'Livre complet PDF'],
    },
    {
      id: 'kawaii-stationery',
      route: '/generator/kawaii-stationery',
      icon: <Heart className="w-6 h-6 text-pink-600" />,
      iconBg: 'bg-pink-50 border-pink-200/80',
      activeBorder: 'hover:border-pink-400 focus:ring-pink-500/20',
      accentColor: 'text-pink-600 group-hover:text-pink-700',
      btnBg: 'bg-pink-600 hover:bg-pink-700 text-white shadow-md shadow-pink-600/20',
      btnLabel: isArabic ? 'إنشاء قرطاسية وبطاقات كواي' : language === 'en' ? 'Create Kawaii Stationery' : 'Créer de la papeterie kawaii',
      title: isArabic ? 'مُوَلِّدُ القِرْطَاسِيَّةِ الكَوَاي والمُخَطَّطَاتِ الجَمِيلَة' : language === 'en' ? 'Cute & Kawaii Stationery Generator' : 'Papeterie Décorative & Planners Kawaii',
      desc: isArabic
        ? '12 نمطاً فنياً يابانياً مبهجاً لتوليد أوراق الكتابة، والمفكرات المنقطة BuJo، ومخططات الأسبوع، ومجموعات القرطاسية المتناسقة القابلة للطباعة.'
        : language === 'en'
        ? '12 curated premium themes for creating custom lined papers, bullet journal dot grids, weekly & daily planners, and coordinated stationery collections.'
        : '12 thèmes illustrés exclusifs : papier à lettres ligné, bullet journal à pois, semainiers, plannings journaliers et ensembles coordonnés prêts à imprimer.',
      highlights: isArabic
        ? ['12 ثيماً فنياً حصرياً', 'أوراق مسطرة ومنقطة ومخططات', 'أطقم قرطاسية متناسقة']
        : language === 'en'
        ? ['12 Curated Kawaii Themes', 'Lined, Dotted, Planners & Checklists', 'Matching Stationery Sets']
        : ['12 Thèmes illustrés', 'Lignées, Points, Planners', 'Coffrets assortis'],
    },
    {
      id: 'school-planner',
      route: '/generator/school-planner',
      icon: <Calendar className="w-6 h-6 text-rose-600" />,
      iconBg: 'bg-rose-50 border-rose-200/80',
      activeBorder: 'hover:border-rose-400 focus:ring-rose-500/20',
      accentColor: 'text-rose-600 group-hover:text-rose-700',
      btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20',
      btnLabel: isArabic ? 'إنشاء جدول الحصص والمنظم' : language === 'en' ? 'Create School Planner' : 'Créer un emploi du temps',
      title: isArabic ? 'مُوَلِّدُ جَدَاوِلِ الحِصَصِ والمُنَظِّمَاتِ المَدْرَسِيَّة' : language === 'en' ? 'School Timetable & Planner Generator' : "Emplois du Temps & Plannings Scolaires",
      desc: isArabic
        ? 'تصميم جداول حصص أسبوعية، ومنظمات المذاكرة والواجبات، وجداول الأنشطة والروتين اليومي مع 8 أنماط رسومية قابلة للطباعة.'
        : language === 'en'
        ? 'Design customizable school timetables, weekly homework planners, activity trackers, and daily routines with 8 premium printable templates.'
        : "Créez des emplois du temps scolaires, semainiers de devoirs, plannings d'activités et routines personnalisés parmi 8 styles graphiques soignés.",
      highlights: isArabic
        ? ['8 تصاميم متميزة', 'جداول الحصص والواجبات', 'تصدير PDF A4 عالي الجودة']
        : language === 'en'
        ? ['8 Premium Templates', 'Timetable, Weekly & Routine', 'Printable Vector PDF']
        : ['8 Modèles graphiques', 'Semainier & Routines', 'Export PDF A4'],
    },
    {
      id: 'certificates',
      route: '/generator/certificates',
      icon: <Award className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-200/80',
      activeBorder: 'hover:border-amber-400 focus:ring-amber-500/20',
      accentColor: 'text-amber-600 group-hover:text-amber-700',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20',
      btnLabel: isArabic ? 'إنشاء شهادة تقدير أو دبلوم' : language === 'en' ? 'Create Certificate' : 'Créer un diplôme d’honneur',
      title: isArabic ? 'مُوَلِّدُ شَهَادَاتِ التَّقْدِيرِ والدِّبْلُومَاتِ الرَّسْمِيَّة' : language === 'en' ? 'Certificates & Diplomas Generator' : "Diplômes & Certificats d'Excellence",
      desc: isArabic
        ? 'شهادات تقديرية فاخرة بتصاميم مذهبة ورسمية، مع ختم الشرف، وإمكانية توليد دفعات كاملة للطلاب عبر ملف CSV.'
        : language === 'en'
        ? 'Create prestigious certificates and school diplomas with ornate borders, gold seal, dual signatures, and bulk generation via CSV.'
        : "Diplômes d'honneur, prix d'excellence et encouragements personnalisables : bordures dorées ou festives, sceau officiel et import CSV groupé.",
      highlights: isArabic
        ? ['10 قوالب مذهبة وأكاديمية', 'توليد جماعي بالاسم والصف', 'تصدير دقيق للطباعة']
        : language === 'en'
        ? ['10 Ornate Templates', 'Bulk Student CSV Generation', 'Official Seal & Signatures']
        : ['10 Modèles prestige', 'Génération en lot (CSV)', 'Sceau & Signatures'],
    },
    {
      id: 'personalized-storybook',
      route: '/generator/personalized-storybook',
      icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-200/80',
      activeBorder: 'hover:border-emerald-400 focus:ring-emerald-500/20',
      accentColor: 'text-emerald-600 group-hover:text-emerald-700',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20',
      btnLabel: isArabic ? 'إنشاء قصة مخصصة' : language === 'en' ? 'Create Storybook' : 'Créer un livre illustré',
      title: isArabic ? 'مُوَلِّدُ القِصَصِ المُصَوَّرَةِ المُخَصَّصَة' : language === 'en' ? 'Personalized Storybook Generator' : "Générateur d'histoires personnalisées",
      desc: isArabic
        ? '« ابتكروا كتباً وقصصاً مصورة رائعة من 8 إلى 12 صفحة، مخصصة باسم طفلكم، عمره وعالمه الخيالي المفضل. »'
        : language === 'en'
        ? '« Create beautiful illustrated storybooks of 8 to 12 pages, personalized with your child’s name, age, and favorite universe. »'
        : '« Créez de magnifiques petits livres illustrés de 8 à 12 pages, personnalisés avec le prénom de votre enfant, son âge et son univers préféré. »',
      highlights: isArabic
        ? ['8 إلى 12 صفحة مصورة', 'نماذج وقصص بالذكاء الاصطناعي', 'A5، A4 وشكل مربع', 'تصدير PDF عالي الدقة']
        : language === 'en'
        ? ['8 to 12 Illustrated Pages', 'Curated & AI Stories', 'A5, A4 & Square Books', 'Print-Ready PDF']
        : ['8 à 12 pages illustrées', 'Modèles & Histoires IA', 'A5, A4 & Format Carré', 'Export PDF & Livret'],
    },
  ];

  const upcomingGenerators = [
    {
      id: 'flashcards',
      icon: <CreditCard className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-200/70',
      title: t.cardFlashcardsTitle,
      desc: t.cardFlashcardsDesc,
    },
    {
      id: 'calendar',
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      iconBg: 'bg-blue-50 border-blue-200/70',
      title: t.cardCalendarTitle,
      desc: t.cardCalendarDesc,
    },
    {
      id: 'coloring',
      icon: <Palette className="w-5 h-5 text-pink-600" />,
      iconBg: 'bg-pink-50 border-pink-200/70',
      title: t.cardColoringTitle,
      desc: t.cardColoringDesc,
    },
  ];

  return (
    <div id="generators-catalog" className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* 1. Section: Générateurs Disponibles (Centré) */}
      <section className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.statusAvailable.toUpperCase()}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {t.availableToolsTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 max-w-xl mx-auto font-medium">
            {t.availableToolsSubtitle}
          </p>
        </div>

        {/* Available Generators Cards Grid (3 cards per row on desktop as requested) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {availableGenerators.map((gen) => (
            <div
              key={gen.id}
              onClick={() => onNavigate(gen.route)}
              className={`group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${gen.activeBorder} hover:-translate-y-1`}
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className={`p-2.5 sm:p-3 rounded-2xl border ${gen.iconBg} shadow-xs group-hover:scale-110 transition-transform`}>
                    {gen.icon}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    {t.statusAvailable}
                  </span>
                </div>

                <h3 className={`text-lg font-black text-slate-900 ${gen.accentColor} transition-colors tracking-tight leading-snug`}>
                  {gen.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {gen.desc}
                </p>

                {/* Feature tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {gen.highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom CTA Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors truncate">
                  {isArabic ? 'انقر لفتح الأداة' : 'Accès gratuit'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(gen.route);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-[11px] sm:text-xs transition-all cursor-pointer shrink-0 ${gen.btnBg}`}
                >
                  <span className="truncate max-w-[140px]">{gen.btnLabel}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''} group-hover:translate-x-0.5 transition-transform`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Section: Bientôt Disponibles */}
      <section className="pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.upcomingTitle.toUpperCase()}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              {t.upcomingTitle}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {t.upcomingSubtitle}
            </p>
          </div>
        </div>

        {/* Upcoming Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingGenerators.map((gen) => (
            <div
              key={gen.id}
              className="bg-white/80 rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between transition-all hover:bg-white hover:border-slate-300"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl border ${gen.iconBg}`}>
                    {gen.icon}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-400" />
                    {t.statusComingSoon}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-800 tracking-tight">
                  {gen.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {gen.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{isArabic ? 'قيد التطوير' : 'En développement'}</span>
                <span className="text-slate-300">•</span>
                <span>Crearocket Pro</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
