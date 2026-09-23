import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayCupcakeToppers: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  // 12 round / scalloped cupcake toppers on an A4 sheet (3 cols x 4 rows)
  const toppers = [
    { type: 'illustration', label: '' },
    { type: 'name', label: data.childName },
    { type: 'age', label: `${data.age} ${isArabic ? 'سنوات' : 'ANS'}` },
    { type: 'illustration', label: '' },
    { type: 'message', label: isArabic ? 'مبروك !' : 'JOYEUX ANNIVERSAIRE !' },
    { type: 'illustration', label: '' },
    { type: 'age', label: `${data.age}` },
    { type: 'illustration', label: '' },
    { type: 'name', label: data.childName },
    { type: 'illustration', label: '' },
    { type: 'message', label: isArabic ? 'حفلة سعيدة' : 'PARTY TIME' },
    { type: 'illustration', label: '' },
  ];

  return (
    <div
      className="w-full h-full p-6 grid grid-cols-3 grid-rows-4 gap-4 sm:gap-6 bg-white box-border items-center justify-items-center"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {toppers.map((t, idx) => (
        <div key={idx} className="relative flex flex-col items-center justify-center">
          {/* Circular Cut Guide */}
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-2 shadow-2xs relative overflow-hidden text-center transition-transform hover:scale-105"
            style={{
              backgroundColor: theme.bgColor,
              borderColor: theme.primaryColor,
              color: theme.textColor,
            }}
          >
            {/* Inner Ring */}
            <div
              className="absolute inset-1 rounded-full border pointer-events-none"
              style={{ borderColor: theme.borderColor }}
            />

            {t.type === 'illustration' ? (
              <div className="w-12 h-12 sm:w-14 sm:h-14 relative z-10 flex items-center justify-center">
                <BirthdayIllustration themeId={data.themeId} className="w-full h-full" />
              </div>
            ) : t.type === 'age' ? (
              <div className="relative z-10 flex flex-col items-center justify-center">
                <span
                  className="font-black text-2xl sm:text-3xl leading-none"
                  style={{ color: theme.primaryColor }}
                >
                  {data.age}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider opacity-85 mt-0.5">
                  {isArabic ? 'سنوات' : data.language === 'en' ? 'YEARS' : 'ANS'}
                </span>
              </div>
            ) : t.type === 'name' ? (
              <div className="relative z-10 px-1">
                <span
                  className="font-black text-xs sm:text-sm uppercase tracking-wide block truncate max-w-[70px] sm:max-w-[80px]"
                  style={{ color: theme.textColor }}
                >
                  {data.childName || 'FÊTE'}
                </span>
                <span className="text-[8px] font-bold opacity-75">★ ★ ★</span>
              </div>
            ) : (
              <div className="relative z-10 px-1 text-center">
                <span
                  className="font-black text-[9px] sm:text-[10px] leading-tight block uppercase"
                  style={{ color: theme.primaryColor }}
                >
                  {t.label}
                </span>
                <span className="text-[10px] block mt-0.5">🎉</span>
              </div>
            )}
          </div>

          {/* Small Cut Marker Label */}
          {data.showCutGuides && (
            <span className="text-[7.5px] font-mono text-slate-400 mt-1">
              ✂ ⌀ 50 mm
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
