import React, { useMemo } from 'react';
import { User, Users, Building2, Calendar, Sparkles, Rocket, Star, Bookmark, Crown } from 'lucide-react';
import { NotebookSubject, StudentInfo, Language } from '../types';
import { getSubjectDefinition, selectNextTemplateForSubject, CoverTemplate } from '../data/subjectRegistry';
import { generateCleanSubjectCoverSvg } from '../data/subjectArtworkGenerators';

interface CoverRendererProps {
  widthMm: number;
  heightMm: number;
  subject: NotebookSubject | string;
  themeId?: string;
  paletteId?: string;
  illustrationId?: string;
  info: StudentInfo;
  language: Language;
  variationIndex?: number;
  className?: string;
  aiCoverImage?: string;
  seed?: number;
  showVectorFallback?: boolean;
  centerText?: boolean;
}

export const CoverRenderer: React.FC<CoverRendererProps> = ({
  widthMm,
  heightMm,
  subject,
  info,
  language,
  variationIndex = 0,
  className = '',
  aiCoverImage,
  centerText,
}) => {
  // Resolve subject strictly from subject identity (att_2)
  const subjectDef = useMemo(() => {
    return getSubjectDefinition(String(subject || ''));
  }, [subject]);

  // Resolve template (1 to 12) strictly belonging to this subject
  const template: CoverTemplate = useMemo(() => {
    const templateNumber = (Math.abs(variationIndex) % 12) + 1;
    return selectNextTemplateForSubject(subjectDef.id, templateNumber);
  }, [subjectDef.id, variationIndex]);

  // Main notebook title (att_3): THE SOLE MAIN TITLE
  const mainTitle = (info.subjectName || '').trim() || subjectDef.label;

  // Language & Direction detection
  const isArabic =
    /[\u0600-\u06FF]/.test(mainTitle) ||
    subjectDef.direction === 'rtl' ||
    language === 'ar';

  // Active palette
  const primaryColor = template.palette[0] || '#2563EB';
  const secondaryColor = template.palette[1] || '#0D9488';
  const bgColor = template.palette[2] || '#F8FAFC';
  const accentColor = template.palette[3] || '#F59E0B';

  // Art direction (Model 1 to 5)
  const artDir = template.artDirection || 'premium_school';

  // Base background: AI artwork or clean vector SVG (strictly without text)
  const bgImage = useMemo(() => {
    if (aiCoverImage) return aiCoverImage;
    return generateCleanSubjectCoverSvg(subjectDef, template, 800, 1131);
  }, [aiCoverImage, subjectDef, template]);

  // Aspect ratio math
  const isA5 = heightMm < 230;

  // Adaptive typography size calculation for att_3
  const titleFontSizeClass = useMemo(() => {
    const len = mainTitle.length;
    if (isA5) {
      if (len > 30) return 'text-xs sm:text-sm';
      if (len > 20) return 'text-sm sm:text-base';
      return 'text-base sm:text-lg';
    }
    if (len > 35) return 'text-base sm:text-lg md:text-xl';
    if (len > 22) return 'text-lg sm:text-xl md:text-2xl';
    return 'text-xl sm:text-2xl md:text-3xl';
  }, [mainTitle, isA5]);

  // Student info data contract (att_4 to att_7)
  const studentData = [
    {
      id: 'nom_prenom',
      icon: User,
      labelAr: 'الاسم واللقب :',
      labelFr: 'Nom & Prénom :',
      labelEn: 'Full Name :',
      value: (info.fullName || '').trim(),
    },
    {
      id: 'classe',
      icon: Users,
      labelAr: 'القسم / المستوى :',
      labelFr: 'Classe / Niveau :',
      labelEn: 'Class / Grade :',
      value: (info.grade || info.classLevel || '').trim(),
    },
    {
      id: 'ecole',
      icon: Building2,
      labelAr: 'المؤسسة التعليمية :',
      labelFr: 'École :',
      labelEn: 'School :',
      value: (info.schoolName || info.school || '').trim(),
    },
    {
      id: 'annee',
      icon: Calendar,
      labelAr: 'السنة الدراسية :',
      labelFr: 'Année scolaire :',
      labelEn: 'Academic Year :',
      value: (info.academicYear || '').trim(),
    },
  ];

  return (
    <div
      className={`relative select-none overflow-hidden rounded-2xl shadow-xl transition-all duration-200 w-full h-full ${className}`}
      style={{
        backgroundColor: bgColor,
        border: `3px solid ${primaryColor}40`,
        boxSizing: 'border-box',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* ============================================================ */}
      {/* LAYER 1: PURE DECORATIVE ARTWORK (AI or Vector, ZERO TEXT)  */}
      {/* ============================================================ */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Decorative inner border */}
      <div
        className={`absolute ${isA5 ? 'inset-1.5' : 'inset-2.5'} pointer-events-none rounded-xl border border-white/60`}
        style={{
          boxShadow: 'inset 0 0 16px rgba(0,0,0,0.03)',
        }}
      />

      {/* CreaRocket Brand Accent (Subtle & Elegant) */}
      <div className={`absolute ${isA5 ? 'top-2.5 right-3' : 'top-3.5 right-4'} z-20 pointer-events-none`}>
        <div className={`inline-flex items-center gap-1.5 ${isA5 ? 'px-2 py-0.5 text-[8.5px]' : 'px-2.5 py-1 text-[10px]'} rounded-full bg-white/90 backdrop-blur-xs font-bold text-slate-700 shadow-xs border border-white/80`}>
          <Rocket className={`${isA5 ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-amber-500`} />
          <span className="tracking-wide">CreaRocket</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LAYER 2: MAIN NOTEBOOK TITLE (att_3) — THE ONLY MAIN TITLE    */}
      {/* Rendered in template.titleZone with Art-Direction Specifics  */}
      {/* ============================================================ */}
      <div
        className="absolute z-20 pointer-events-none flex items-center justify-center text-center px-4"
        style={{
          left: `${template.titleZone.x}%`,
          top: `${template.titleZone.y}%`,
          width: `${template.titleZone.width}%`,
          minHeight: `${template.titleZone.height}%`,
        }}
      >
        {/* MODEL 1: PREMIUM SCHOOL (3D Plate / Chamfered / Soft Glow) */}
        {artDir === 'premium_school' && (
          <div
            className={`inline-flex items-center justify-center gap-2 max-w-full ${
              isA5 ? 'px-3.5 py-1.5 rounded-xl' : 'px-5 py-2.5 rounded-2xl'
            } shadow-xl border backdrop-blur-md transition-all`}
            style={{
              backgroundColor: template.titleZone.textEffects.backgroundPlate ? primaryColor : '#FFFFFF',
              borderColor: template.titleZone.textEffects.backgroundPlate ? `${secondaryColor}80` : '#E2E8F0',
              color: template.titleZone.textEffects.backgroundPlate ? '#FFFFFF' : primaryColor,
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            }}
          >
            <Sparkles className={`${isA5 ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0 text-amber-400`} />
            <h1
              className={`${titleFontSizeClass} font-black tracking-tight leading-tight ${
                isArabic ? 'font-arabic' : 'font-sans'
              }`}
              style={{
                textShadow: template.titleZone.textEffects.backgroundPlate
                  ? '0 2px 4px rgba(0,0,0,0.3)'
                  : 'none',
              }}
            >
              {mainTitle}
            </h1>
          </div>
        )}

        {/* MODEL 2: CUTE SCHOOL (Rounded Bubble Pill / Pastel Dashed / Sparkle Sticker) */}
        {artDir === 'cute_school' && (
          <div
            className={`relative inline-flex items-center justify-center gap-2 max-w-full ${
              isA5 ? 'px-4 py-1.5 rounded-full' : 'px-6 py-2.5 rounded-full'
            } border-2 border-dashed shadow-md transition-all`}
            style={{
              backgroundColor: '#FFFDF0',
              borderColor: `${secondaryColor}90`,
              color: primaryColor,
              boxShadow: '0 4px 14px rgba(244, 114, 182, 0.15)',
            }}
          >
            {/* Cute mini star sticker pinned */}
            <div className="absolute -top-2 -left-2 bg-amber-400 text-white rounded-full p-0.5 shadow-xs">
              <Star className="w-3 h-3 fill-amber-300 text-amber-500" />
            </div>
            <h1
              className={`${titleFontSizeClass} font-black tracking-wide leading-tight ${
                isArabic ? 'font-arabic' : 'font-sans'
              }`}
            >
              {mainTitle}
            </h1>
            <div className="absolute -bottom-1.5 -right-1 bg-pink-400 text-white rounded-full p-0.5 shadow-xs">
              <Sparkles className="w-2.5 h-2.5 fill-pink-200 text-white" />
            </div>
          </div>
        )}

        {/* MODEL 3: PAPER CRAFT (Die-Cut Paper Banner / Stepped Hard Relief Shadow) */}
        {artDir === 'paper_craft' && (
          <div
            className={`inline-flex items-center justify-center gap-2 max-w-full ${
              isA5 ? 'px-4 py-2 rounded-lg' : 'px-6 py-3 rounded-xl'
            } border-2 border-slate-800 transition-all`}
            style={{
              backgroundColor: '#FFFBF5',
              color: primaryColor,
              boxShadow: '4px 4px 0px #1E293B',
            }}
          >
            <Bookmark className={`${isA5 ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0 text-amber-600`} />
            <h1
              className={`${titleFontSizeClass} font-black tracking-tight leading-tight uppercase ${
                isArabic ? 'font-arabic' : 'font-sans'
              }`}
            >
              {mainTitle}
            </h1>
          </div>
        )}

        {/* MODEL 4: DOODLE ACADEMY (Hand-Drawn Sketch Sticker with Washi Tape) */}
        {artDir === 'doodle_academy' && (
          <div className="relative inline-flex items-center justify-center max-w-full">
            {/* Realistic Washi Tape Across Top Center */}
            <div
              className="absolute -top-3 z-30 px-3 py-0.5 text-[8px] font-mono rounded-xs shadow-xs pointer-events-none opacity-85"
              style={{
                backgroundColor: '#FEF08A',
                borderLeft: '2px dashed #CA8A04',
                borderRight: '2px dashed #CA8A04',
                transform: 'rotate(-2deg)',
              }}
            >
              ✦✦✦
            </div>
            <div
              className={`inline-flex items-center justify-center gap-2 max-w-full ${
                isA5 ? 'px-4 py-2 rounded-xl' : 'px-6 py-2.5 rounded-2xl'
              } border-2 border-dashed border-slate-800 shadow-md bg-white`}
              style={{
                color: '#0F172A',
                transform: 'rotate(0.5deg)',
              }}
            >
              <h1
                className={`${titleFontSizeClass} font-black tracking-wide leading-tight ${
                  isArabic ? 'font-arabic' : 'font-sans'
                }`}
              >
                {mainTitle}
              </h1>
            </div>
          </div>
        )}

        {/* MODEL 5: LUXURY EDUCATION (Regal Ivory Cartouche / Double Gold Pinstripe) */}
        {artDir === 'luxury_education' && (
          <div
            className={`inline-flex items-center justify-center gap-2.5 max-w-full ${
              isA5 ? 'px-4 py-2 rounded-xl' : 'px-7 py-3 rounded-2xl'
            } shadow-lg transition-all`}
            style={{
              backgroundColor: '#FFFDF9',
              border: '2px double #D97706',
              boxShadow: '0 6px 20px rgba(180, 83, 9, 0.12), inset 0 0 12px rgba(254, 243, 199, 0.4)',
              color: '#78350F',
            }}
          >
            <Crown className={`${isA5 ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0 text-amber-600`} />
            <span className="text-amber-500 text-xs select-none">✦</span>
            <h1
              className={`${titleFontSizeClass} font-extrabold tracking-wider leading-tight ${
                isArabic ? 'font-arabic' : 'font-serif'
              }`}
            >
              {mainTitle}
            </h1>
            <span className="text-amber-500 text-xs select-none">✦</span>
          </div>
        )}

        {/* Fallback for other potential future models */}
        {!['premium_school', 'cute_school', 'paper_craft', 'doodle_academy', 'luxury_education'].includes(artDir) && (
          <div
            className={`inline-flex items-center justify-center gap-2 max-w-full ${
              isA5 ? 'px-3 py-1.5 rounded-xl' : 'px-5 py-2.5 rounded-2xl'
            } shadow-lg backdrop-blur-xs border transition-all`}
            style={{
              backgroundColor: template.titleZone.textEffects.backgroundPlate
                ? primaryColor
                : 'rgba(255, 255, 255, 0.95)',
              borderColor: `${primaryColor}40`,
              color: template.titleZone.textEffects.backgroundPlate ? '#FFFFFF' : primaryColor,
            }}
          >
            <Sparkles className={`${isA5 ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0 opacity-90 text-amber-300`} />
            <h1
              className={`${titleFontSizeClass} font-black tracking-tight leading-tight ${
                isArabic ? 'font-arabic' : 'font-sans'
              }`}
            >
              {mainTitle}
            </h1>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* LAYER 3: UNIFIED IDENTIFICATION PANEL (att_4 to att_7)        */}
      {/* Exactly ONE clean, beautifully framed card in infoZone       */}
      {/* Integrated according to the 5 Art Directions                 */}
      {/* ============================================================ */}
      <div
        className="absolute z-20 pointer-events-none flex flex-col justify-center"
        style={{
          left: `${template.infoZone.x}%`,
          top: `${template.infoZone.y}%`,
          width: `${template.infoZone.width}%`,
          minHeight: `${template.infoZone.height}%`,
        }}
      >
        <div
          className={`relative w-full h-auto min-h-full flex flex-col justify-between ${
            isA5 ? 'p-2.5 gap-1.5' : 'p-3.5 sm:p-4 gap-2'
          } ${
            artDir === 'cute_school'
              ? 'rounded-3xl border-2 border-dashed'
              : artDir === 'paper_craft'
              ? 'rounded-xl border-2 border-slate-800'
              : artDir === 'doodle_academy'
              ? 'rounded-xl border-2 border-dashed border-slate-700'
              : artDir === 'luxury_education'
              ? 'rounded-2xl border-2'
              : 'rounded-2xl border'
          } backdrop-blur-md transition-all`}
          style={{
            backgroundColor:
              artDir === 'cute_school'
                ? '#FFFDF5'
                : artDir === 'paper_craft'
                ? '#FFFBF5'
                : artDir === 'luxury_education'
                ? '#FFFDF9'
                : artDir === 'doodle_academy'
                ? '#FFFFFF'
                : template.infoZone.backgroundColor || '#FFFFFF',
            borderColor:
              artDir === 'cute_school'
                ? `${secondaryColor}90`
                : artDir === 'paper_craft'
                ? '#1E293B'
                : artDir === 'luxury_education'
                ? '#D97706'
                : artDir === 'doodle_academy'
                ? '#475569'
                : template.infoZone.borderColor || '#E2E8F0',
            boxShadow:
              artDir === 'paper_craft'
                ? '5px 5px 0px #1E293B'
                : artDir === 'luxury_education'
                ? '0 8px 24px rgba(180, 83, 9, 0.12), inset 0 0 16px rgba(254, 243, 199, 0.3)'
                : artDir === 'cute_school'
                ? '0 6px 18px rgba(236, 72, 153, 0.1)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            ...(artDir === 'doodle_academy'
              ? {
                  backgroundImage:
                    'linear-gradient(#F1F5F9 1px, transparent 1px), linear-gradient(90deg, #F1F5F9 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }
              : {}),
          }}
        >
          {/* DOODLE ACADEMY: Two Washi Tape Strips pinned on corners */}
          {artDir === 'doodle_academy' && (
            <>
              <div
                className="absolute -top-2.5 -left-3 w-10 h-4 rounded-xs shadow-xs pointer-events-none opacity-80"
                style={{
                  backgroundColor: '#BAE6FD',
                  borderLeft: '1.5px dashed #0284C7',
                  borderRight: '1.5px dashed #0284C7',
                  transform: 'rotate(-25deg)',
                }}
              />
              <div
                className="absolute -top-2.5 -right-3 w-10 h-4 rounded-xs shadow-xs pointer-events-none opacity-80"
                style={{
                  backgroundColor: '#FEF08A',
                  borderLeft: '1.5px dashed #CA8A04',
                  borderRight: '1.5px dashed #CA8A04',
                  transform: 'rotate(25deg)',
                }}
              />
            </>
          )}

          {/* CUTE SCHOOL: Mini playful sticker on corner */}
          {artDir === 'cute_school' && (
            <div className="absolute -top-2.5 -right-2 bg-pink-100 text-pink-600 rounded-full p-1 shadow-xs border border-pink-200">
              <Star className="w-3 h-3 fill-pink-400 text-pink-500" />
            </div>
          )}

          {/* LUXURY EDUCATION: Classical corner accents */}
          {artDir === 'luxury_education' && (
            <>
              <span className="absolute top-1 left-1.5 text-amber-500 text-[9px] select-none">✦</span>
              <span className="absolute top-1 right-1.5 text-amber-500 text-[9px] select-none">✦</span>
            </>
          )}

          {studentData.map((item) => {
            const Icon = item.icon;
            const label = isArabic
              ? item.labelAr
              : language === 'en'
              ? item.labelEn
              : item.labelFr;

            return (
              <div
                key={item.id}
                className={`flex items-center gap-2 ${
                  isA5 ? 'text-[9.5px]' : 'text-[11px] sm:text-[12px]'
                } font-medium text-slate-800 leading-normal`}
              >
                {/* Vector Icon */}
                <div
                  className={`shrink-0 flex items-center justify-center ${
                    isA5 ? 'w-4 h-4' : 'w-5 h-5'
                  } ${
                    artDir === 'cute_school'
                      ? 'rounded-full'
                      : artDir === 'paper_craft'
                      ? 'rounded-xs border border-slate-800'
                      : 'rounded-md'
                  }`}
                  style={{
                    backgroundColor:
                      artDir === 'luxury_education'
                        ? '#FEF3C7'
                        : artDir === 'paper_craft'
                        ? '#F1F5F9'
                        : `${primaryColor}15`,
                    color: artDir === 'luxury_education' ? '#92400E' : primaryColor,
                  }}
                >
                  <Icon className={`${isA5 ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
                </div>

                {/* Field Label */}
                <span
                  className={`shrink-0 font-bold ${
                    isArabic
                      ? 'font-arabic text-slate-900'
                      : artDir === 'luxury_education'
                      ? 'font-serif text-amber-950'
                      : 'text-slate-800'
                  }`}
                >
                  {label}
                </span>

                {/* Field Value or Clean Writing Dots */}
                <div className="flex-1 min-w-0 flex items-center">
                  {item.value ? (
                    <span
                      className={`font-extrabold break-words ${
                        isArabic ? 'font-arabic text-slate-900' : 'text-slate-900 font-label-name'
                      }`}
                      style={{ color: '#0F172A' }}
                    >
                      {item.value}
                    </span>
                  ) : (
                    <span
                      className={`tracking-widest text-[10px] select-none truncate ${
                        artDir === 'paper_craft'
                          ? 'text-slate-400'
                          : artDir === 'doodle_academy'
                          ? 'text-slate-400'
                          : 'text-slate-300'
                      }`}
                    >
                      ................................................
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
