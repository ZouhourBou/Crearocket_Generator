import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayLabels: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  // 12 gift / favor / bottle labels per A4 sheet (3 cols x 4 rows)
  const items = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      className="w-full h-full p-4 grid grid-cols-3 grid-rows-4 gap-3 bg-white box-border"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {items.map((item) => (
        <div
          key={item}
          className="relative rounded-xl border-2 flex items-center gap-2.5 p-2.5 select-none overflow-hidden"
          style={{
            backgroundColor: theme.bgColor,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          {/* Subtle Cut Marks */}
          {data.showCutGuides && (
            <div className="absolute top-0.5 right-1 text-[8px] font-mono opacity-50">
              ✂
            </div>
          )}

          {/* Illustration Icon */}
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white p-1 shadow-2xs shrink-0 flex items-center justify-center border"
            style={{ borderColor: theme.borderColor }}
          >
            <BirthdayIllustration themeId={data.themeId} className="w-full h-full" />
          </div>

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            <div
              className="text-[9px] font-black uppercase tracking-wider truncate mb-0.5"
              style={{ color: theme.primaryColor }}
            >
              {isArabic ? 'شكراً لحضورك !' : data.language === 'en' ? 'THANK YOU !' : 'MERCI !'}
            </div>
            <div className="text-xs sm:text-sm font-black truncate" style={{ color: theme.textColor }}>
              {data.childName || (isArabic ? 'البطل' : 'Mon Enfant')}
            </div>
            {data.showAge && data.age && (
              <div className="text-[10px] font-bold opacity-80 truncate">
                {isArabic ? `${data.age} سنوات` : data.language === 'en' ? `${data.age} years old` : `${data.age} ans`}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
