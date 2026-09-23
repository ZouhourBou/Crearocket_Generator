import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayCakeTopper: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  return (
    <div
      className="w-full h-full p-8 flex flex-col items-center justify-center bg-white box-border select-none"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Cake Topper Outline / Cut-out Shape */}
      <div
        className="w-full max-w-lg rounded-3xl border-4 border-dashed p-8 sm:p-10 flex flex-col items-center text-center shadow-lg relative overflow-hidden"
        style={{
          backgroundColor: theme.bgColor,
          borderColor: theme.primaryColor,
          color: theme.textColor,
        }}
      >
        {/* Banner Crown */}
        <div
          className="px-6 py-2 rounded-full font-black text-xs sm:text-sm tracking-widest uppercase text-white shadow-md mb-4"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {isArabic ? 'عيد ميلاد سعيد' : data.language === 'en' ? 'HAPPY BIRTHDAY' : 'JOYEUX ANNIVERSAIRE'}
        </div>

        {/* Child Name */}
        <h2
          className="text-3xl sm:text-5xl font-black tracking-tight mb-2 drop-shadow-2xs"
          style={{ color: theme.textColor }}
        >
          {data.childName || (isArabic ? 'البطل' : 'Mon Enfant')}
        </h2>

        {/* Age Badge */}
        {data.showAge && data.age && (
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-xl sm:text-2xl font-black text-white shadow-md my-2"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            <span>{data.age}</span>
            <span className="text-sm uppercase">{isArabic ? 'سنوات' : 'ANS'}</span>
          </div>
        )}

        {/* Hero Illustration */}
        <div
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white p-3 shadow-md border-4 my-4 flex items-center justify-center"
          style={{ borderColor: theme.borderColor }}
        >
          <BirthdayIllustration themeId={data.themeId} className="w-full h-full" />
        </div>

        {/* Stick Mounting Guides */}
        <div className="w-full flex justify-around pt-6 border-t-2 border-dashed opacity-60" style={{ borderColor: theme.borderColor }}>
          <div className="flex flex-col items-center">
            <div className="w-4 h-12 border-2 border-slate-400 border-dashed rounded-full" />
            <span className="text-[9px] font-mono mt-1 text-slate-500">Bâtonnet 1</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-12 border-2 border-slate-400 border-dashed rounded-full" />
            <span className="text-[9px] font-mono mt-1 text-slate-500">Bâtonnet 2</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs font-semibold text-slate-500">
          ✂ {isArabic ? 'قص على طول الخط المتقطع وثبته على عودي تزيين الكيك' : 'Découpez le long des pointillés et collez deux piques en bois au dos pour planter sur le gâteau.'}
        </span>
      </div>
    </div>
  );
};
