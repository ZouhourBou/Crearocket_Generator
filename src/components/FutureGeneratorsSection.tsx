import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import {
  FilePenLine,
  Tag,
  CreditCard,
  Palette,
  Award,
  Gamepad2,
  Calendar,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface FutureGeneratorsProps {
  language: Language;
  onNavigate?: (route: string) => void;
  currentRoute?: string;
}

export const FutureGeneratorsSection: React.FC<FutureGeneratorsProps> = ({
  language,
  onNavigate,
  currentRoute = '/',
}) => {
  const t = TRANSLATIONS[language];
  const isArabic = language === 'ar';

  const handleGeneratorClick = (route: string, anchorId?: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      window.history.pushState({}, '', route);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }

    if (route === currentRoute && anchorId) {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const availableGenerators = [
    {
      id: 'school-labels',
      route: '/',
      anchorId: 'generator-studio',
      icon: <Tag className="w-5 h-5 text-red-600" />,
      title: {
        fr: "Générateur d'étiquettes scolaires",
        ar: 'مولّد الملصقات المدرسية',
        en: 'School Labels Generator',
      },
      desc: {
        fr: "Créez facilement vos planches d'étiquettes personnalisées (fournitures, livres et cahiers) prêtes à imprimer.",
        ar: 'صفحات ملصقات مخصصة للأدوات والكراسات والكتب جاهزة للطباعة.',
        en: 'Custom printable label sheets for stationery, books and notebooks.',
      },
    },
    {
      id: 'worksheet-editor',
      route: '/generator/worksheet-editor',
      anchorId: 'worksheet-studio',
      icon: <FilePenLine className="w-5 h-5 text-indigo-600" />,
      title: {
        fr: "Générateur de Fiches d'Exercices Pédagogiques",
        ar: 'مولّد أوراق التمارين والامتحانات التربوية',
        en: 'Educational Worksheets Generator',
      },
      desc: {
        fr: "Créez des exercices, devoirs et évaluations personnalisés, prêts à imprimer, en quelques clics.",
        ar: 'أنشئ تمارين واختبارات وتقييمات مخصصة جاهزة للطباعة بنقرات بسيطة.',
        en: 'Create customized exercises, homework, and assessments ready to print in a few clicks.',
      },
    },
  ];

  const upcomingGenerators = [
    {
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
      title: {
        fr: 'Générateur de cartes mémoires (Flashcards)',
        ar: 'مولّد البطاقات التعليمية السريعة',
        en: 'Flashcards & Memory Cards',
      },
      desc: {
        fr: 'Cartes de mémorisation bilingues et imagiers.',
        ar: 'بطاقات حفظ الكلمات والمصطلحات ثنائية اللغة.',
        en: 'Vocabulary and bilingual memory flashcards.',
      },
    },
    {
      icon: <Palette className="w-5 h-5 text-pink-500" />,
      title: {
        fr: 'Générateur de coloriages & dessins',
        ar: 'مولّد رسومات وتلوين الأطفال',
        en: 'Coloring Pages & Art Sheets',
      },
      desc: {
        fr: 'Planches à colorier thématiques prêtes à imprimer.',
        ar: 'صفحات تلوين وأنشطة فنية حسب الموضوع.',
        en: 'Printable themed coloring pages and line art.',
      },
    },
    {
      icon: <Award className="w-5 h-5 text-amber-500" />,
      title: {
        fr: 'Générateur de certificats & diplômes',
        ar: 'مولّد شهادات التقدير والتشجيع',
        en: 'Certificates & Awards Generator',
      },
      desc: {
        fr: 'Diplômes d’encouragement et tableaux d’honneur.',
        ar: 'شهادات تشجيع وتفوق مدرسي للطلاب.',
        en: 'School encouragement awards and honor certificates.',
      },
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-500" />,
      title: {
        fr: 'Générateur de jeux éducatifs',
        ar: 'مولّد الألعاب والألغاز التربوية',
        en: 'Educational Games & Puzzles',
      },
      desc: {
        fr: 'Mots croisés, labyrinthes et sudokus scolaires.',
        ar: 'كلمات متقاطعة، متاهات وألغاز تعليمية.',
        en: 'Crosswords, mazes, and classroom puzzles.',
      },
    },
    {
      icon: <Calendar className="w-5 h-5 text-red-500" />,
      title: {
        fr: 'Générateur d’emplois du temps & plannings',
        ar: 'مولّد جداول الأوقات والتنظيم',
        en: 'Timetables & Planners Generator',
      },
      desc: {
        fr: 'Emplois du temps hebdomadaires colorés et organiseurs.',
        ar: 'جداول أوقات أسبوعية ومنظمات دراسية ملونة.',
        en: 'Weekly colorful class schedules and student organizers.',
      },
    },
  ];

  return (
    <section id="generators-catalog" className="py-14 bg-slate-50 border-t border-slate-200/80" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Générateurs disponibles */}
        <div className="mb-14">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>ÉCOSYSTÈME CREAROCKET PRO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t.availableToolsTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {t.availableToolsSubtitle}
            </p>
          </div>

          {/* Grid of Available Generators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {availableGenerators.map((gen) => {
              const isCurrent = currentRoute === gen.route;
              return (
                <a
                  key={gen.id}
                  href={gen.route}
                  onClick={(e) => {
                    e.preventDefault();
                    handleGeneratorClick(gen.route, gen.anchorId);
                  }}
                  className={`bg-white rounded-2xl p-5 border shadow-xs flex flex-col justify-between transition-all hover:bg-white hover:shadow-md hover:border-red-300 group cursor-pointer ${
                    isCurrent ? 'border-red-500/80 ring-2 ring-red-500/10' : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-slate-100/90 group-hover:scale-105 transition-transform">
                        {gen.icon}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t.activityAvailable}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
                        {gen.title[language] || gen.title.fr}
                      </h3>
                      <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0 ${isArabic ? 'rotate-180' : ''}`} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {gen.desc[language] || gen.desc.fr}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Section 2: Autres générateurs à venir */}
        <div className="pt-8 border-t border-slate-200/60">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              {t.futureToolsTitle}
            </h3>
            <p className="text-sm text-slate-500 mt-1.5">
              {t.futureToolsSubtitle}
            </p>
          </div>

          {/* Grid of Upcoming Generators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingGenerators.map((gen, idx) => (
              <div
                key={idx}
                className="bg-white/70 rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:bg-white hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-slate-100/80">
                      {gen.icon}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      {t.comingSoon}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">
                    {gen.title[language] || gen.title.fr}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {gen.desc[language] || gen.desc.fr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
