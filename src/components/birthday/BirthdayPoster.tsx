import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayPoster: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-center select-none"
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Decorative Outer Border */}
      <div
        className="absolute inset-4 rounded-3xl border-4 pointer-events-none"
        style={{ borderColor: theme.borderColor }}
      />
      <div
        className="absolute inset-6 rounded-2xl border pointer-events-none border-dashed opacity-60"
        style={{ borderColor: theme.primaryColor }}
      />

      {/* Subtle celebratory background stars / dots */}
      <div className="absolute top-10 left-10 text-2xl opacity-40 animate-pulse">✨</div>
      <div className="absolute top-12 right-12 text-2xl opacity-40 animate-pulse">🎉</div>
      <div className="absolute bottom-12 left-12 text-2xl opacity-40 animate-pulse">🎈</div>
      <div className="absolute bottom-10 right-10 text-2xl opacity-40 animate-pulse">⭐</div>

      {/* Header Banner */}
      <div className="relative z-10 pt-4">
        <div
          className="inline-block px-6 py-2 rounded-full font-black text-sm tracking-widest uppercase shadow-xs mb-3"
          style={{ backgroundColor: theme.primaryColor, color: '#FFFFFF' }}
        >
          {isArabic ? 'مرحباً بكم في حفلتي !' : data.language === 'en' ? 'WELCOME TO THE PARTY !' : 'BIENVENUE À MON ANNIVERSAIRE !'}
        </div>

        <h1
          className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-xs"
          style={{ color: theme.textColor }}
        >
          {data.childName || (isArabic ? 'البطل' : 'Mon Enfant')}
        </h1>

        {data.showAge && data.age && (
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-xl sm:text-2xl font-bold opacity-80">
              {isArabic ? 'يحتفل بـ' : data.language === 'en' ? 'is turning' : 'fête ses'}
            </span>
            <span
              className="inline-flex items-center justify-center w-14 h-14 sm:w-18 sm:h-18 rounded-2xl font-black text-3xl sm:text-4xl shadow-md transform rotate-[-4deg]"
              style={{ backgroundColor: theme.secondaryColor, color: '#FFFFFF' }}
            >
              {data.age}
            </span>
            <span className="text-xl sm:text-2xl font-bold opacity-80">
              {isArabic ? 'سنوات' : data.language === 'en' ? 'years old' : 'ans !'}
            </span>
          </div>
        )}
      </div>

      {/* Hero Illustration */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <div
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-full p-4 flex items-center justify-center shadow-lg relative"
          style={{ backgroundColor: '#FFFFFF', border: `6px solid ${theme.borderColor}` }}
        >
          <BirthdayIllustration themeId={data.themeId} className="w-full h-full" />
        </div>
      </div>

      {/* Event Details Footer */}
      <div className="relative z-10 pb-4">
        <div
          className="max-w-md mx-auto rounded-2xl p-4 sm:p-5 shadow-xs border backdrop-blur-xs"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderColor: theme.borderColor }}
        >
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold">
            {data.date && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                <span>📅</span>
                <span>{data.date}</span>
              </div>
            )}
            {data.time && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                <span>⏰</span>
                <span>{data.time}</span>
              </div>
            )}
          </div>

          {data.location && (
            <div className="mt-2 text-xs sm:text-sm font-semibold opacity-90 border-t pt-2" style={{ borderColor: theme.borderColor }}>
              <span>📍 {data.location}</span>
            </div>
          )}

          {data.message && (
            <p className="mt-2 text-xs italic font-medium opacity-80">
              "{data.message}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
