import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayInvitations: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  // A4 sheet containing 4 invitations (2x2 grid)
  const cards = [1, 2, 3, 4];

  return (
    <div
      className="w-full h-full p-4 grid grid-cols-2 grid-rows-2 gap-4 bg-white box-border"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {cards.map((cardIndex) => (
        <div
          key={cardIndex}
          className="relative rounded-2xl border-2 overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none transition-shadow"
          style={{
            backgroundColor: theme.bgColor,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          {/* Subtle cut guides */}
          {data.showCutGuides && (
            <div className="absolute top-1 right-1 text-[9px] font-mono text-slate-400 opacity-60">
              ✂
            </div>
          )}

          {/* Card Top / Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase text-white shadow-2xs tracking-wide"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {isArabic ? 'دعوة عيد ميلاد' : data.language === 'en' ? 'PARTY INVITATION' : 'INVITATION'}
              </span>
              <span className="text-sm">🎈</span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-1.5 shadow-xs shrink-0 flex items-center justify-center border"
                style={{ borderColor: theme.borderColor }}
              >
                <BirthdayIllustration themeId={data.themeId} className="w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-black truncate" style={{ color: theme.textColor }}>
                  {data.childName || (isArabic ? 'البطل' : 'Mon Enfant')}
                </h3>
                {data.showAge && data.age && (
                  <p className="text-xs sm:text-sm font-bold opacity-90">
                    {isArabic ? `يحتفل بـ ${data.age} سنوات !` : data.language === 'en' ? `is turning ${data.age} !` : `fête ses ${data.age} ans !`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Invitation Details Block */}
          <div
            className="rounded-xl p-2.5 bg-white/90 border my-2 text-[11px] sm:text-xs font-semibold space-y-1"
            style={{ borderColor: theme.borderColor }}
          >
            {data.date && (
              <div className="flex items-center gap-1.5">
                <span>📅</span>
                <span>{data.date}</span>
                {data.time && <span className="opacity-75">à {data.time}</span>}
              </div>
            )}
            {data.location && (
              <div className="flex items-center gap-1.5 truncate">
                <span>📍</span>
                <span className="truncate">{data.location}</span>
              </div>
            )}
            {data.contact && (
              <div className="flex items-center gap-1.5">
                <span>📞</span>
                <span>{data.contact}</span>
              </div>
            )}
          </div>

          {/* Bottom Callout */}
          <div className="text-center pt-1 border-t border-dashed" style={{ borderColor: theme.borderColor }}>
            <span className="text-[10px] sm:text-[11px] font-bold italic opacity-85">
              {data.message || (isArabic ? 'ننتظر حضوركم ومشاركتنا الفرحة !' : "Merci de confirmer votre présence !")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
