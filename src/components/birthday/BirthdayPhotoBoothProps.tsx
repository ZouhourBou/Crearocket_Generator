import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayPhotoBoothProps: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  const propsItems = [
    { title: isArabic ? 'نظارات الحفلة' : 'Lunettes Festives', type: 'glasses' },
    { title: isArabic ? 'شارب مرح' : 'Moustache Rigolote', type: 'mustache' },
    { title: isArabic ? 'قبعة الاحتفال' : 'Chapeau Pointu', type: 'party_hat' },
    { title: isArabic ? 'فقاعة كلام' : 'Bulle de BD', type: 'bubble' },
  ];

  return (
    <div
      className="w-full h-full p-4 grid grid-cols-2 grid-rows-2 gap-4 bg-white box-border select-none"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {propsItems.map((p, idx) => (
        <div
          key={idx}
          className="relative rounded-2xl border-2 border-dashed flex flex-col items-center justify-between p-4"
          style={{
            backgroundColor: theme.bgColor,
            borderColor: theme.primaryColor,
            color: theme.textColor,
          }}
        >
          <div className="w-full flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Photo Booth #{idx + 1}
            </span>
            <span className="text-[9px] font-mono text-slate-500">✂ Découper</span>
          </div>

          {/* Prop visual */}
          <div className="my-auto flex items-center justify-center w-full">
            {p.type === 'glasses' ? (
              <svg viewBox="0 0 100 40" className="w-40 h-16">
                <circle cx="28" cy="20" r="16" fill="#F43F5E" stroke="#881337" strokeWidth="3" />
                <circle cx="28" cy="20" r="10" fill="#FFFFFF" />
                <circle cx="72" cy="20" r="16" fill="#F43F5E" stroke="#881337" strokeWidth="3" />
                <circle cx="72" cy="20" r="10" fill="#FFFFFF" />
                <rect x="42" y="18" width="16" height="4" rx="2" fill="#881337" />
                <path d="M12 16L4 8" stroke="#881337" strokeWidth="3" strokeLinecap="round" />
                <path d="M88 16L96 8" stroke="#881337" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : p.type === 'mustache' ? (
              <svg viewBox="0 0 100 40" className="w-36 h-14">
                <path
                  d="M50 25C44 14 26 12 10 24C16 32 34 32 50 25ZM50 25C56 14 74 12 90 24C84 32 66 32 50 25Z"
                  fill="#1E293B"
                  stroke="#0F172A"
                  strokeWidth="2"
                />
              </svg>
            ) : p.type === 'party_hat' ? (
              <svg viewBox="0 0 100 80" className="w-32 h-24">
                <polygon points="50,10 20,70 80,70" fill={theme.primaryColor} stroke="#0F172A" strokeWidth="2" />
                <circle cx="50" cy="10" r="6" fill="#FBBF24" />
                <circle cx="35" cy="45" r="4" fill="#FFFFFF" />
                <circle cx="65" cy="45" r="4" fill="#FFFFFF" />
                <circle cx="50" cy="58" r="4" fill="#FFFFFF" />
              </svg>
            ) : (
              <div
                className="w-40 p-3 rounded-2xl text-center shadow-md border-2 font-black text-sm"
                style={{ backgroundColor: '#FFFFFF', borderColor: theme.textColor, color: theme.textColor }}
              >
                🎉 {isArabic ? `فريق ${data.childName} !` : `Team ${data.childName} !`}
              </div>
            )}
          </div>

          <div className="w-full text-center border-t border-dashed pt-1" style={{ borderColor: theme.borderColor }}>
            <span className="text-[9px] font-semibold text-slate-500">
              Coller une baguette en bois sur le côté droit
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
