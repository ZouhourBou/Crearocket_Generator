import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayDecorations: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  // Pennants bunting banner: 3 triangular or swallowtail pennants per sheet
  const pennants = [
    { text: 'J', icon: false },
    { text: data.childName?.charAt(0)?.toUpperCase() || '★', icon: false },
    { text: `${data.age}`, icon: true },
  ];

  return (
    <div
      className="w-full h-full p-6 flex flex-col justify-between bg-white box-border select-none"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between pb-2 border-b border-dashed border-slate-300">
        <span
          className="text-xs font-black uppercase px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {isArabic ? 'رايات الزينة (Guirlande)' : 'FANIONS DE GUIRLANDE'}
        </span>
        <span className="text-[10px] text-slate-500 font-mono">✂ Découper et replier le rabat sur la ficelle</span>
      </div>

      <div className="grid grid-cols-3 gap-4 flex-1 items-stretch pt-4">
        {pennants.map((pen, idx) => (
          <div key={idx} className="relative flex flex-col items-center">
            {/* Folding flap on top for string */}
            <div className="w-full h-6 border-2 border-dashed border-slate-300 bg-slate-100/80 rounded-t-lg flex items-center justify-center text-[8px] font-mono text-slate-500 uppercase">
              Rabat ficelle
            </div>

            {/* Pennant flag triangle */}
            <div
              className="w-full flex-1 rounded-b-2xl border-2 shadow-xs flex flex-col items-center justify-between p-4 relative overflow-hidden"
              style={{
                backgroundColor: idx % 2 === 0 ? theme.bgColor : theme.cardBg,
                borderColor: theme.borderColor,
                color: theme.textColor,
              }}
            >
              <div className="text-xl">🎈</div>

              {pen.icon ? (
                <div className="w-20 h-20 bg-white rounded-full p-2 shadow-xs border flex items-center justify-center my-auto">
                  <BirthdayIllustration themeId={data.themeId} className="w-full h-full" />
                </div>
              ) : (
                <span
                  className="text-6xl sm:text-7xl font-black my-auto drop-shadow-xs"
                  style={{ color: theme.primaryColor }}
                >
                  {pen.text}
                </span>
              )}

              <div className="text-center w-full pt-2 border-t border-dashed" style={{ borderColor: theme.borderColor }}>
                <span className="text-[10px] font-black uppercase tracking-wider truncate block max-w-full">
                  {data.childName}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
