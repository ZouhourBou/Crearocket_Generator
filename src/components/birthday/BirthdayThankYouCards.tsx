import React from 'react';
import { BirthdayKitData } from '../../types/birthdayKit';
import { getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayIllustration } from './BirthdayIllustration';

interface ProductProps {
  data: BirthdayKitData;
}

export const BirthdayThankYouCards: React.FC<ProductProps> = ({ data }) => {
  const theme = getBirthdayTheme(data.themeId);
  const isArabic = data.language === 'ar';

  // 4 thank-you cards per A4 page (2x2)
  const cards = [1, 2, 3, 4];

  return (
    <div
      className="w-full h-full p-4 grid grid-cols-2 grid-rows-2 gap-4 bg-white box-border"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {cards.map((i) => (
        <div
          key={i}
          className="relative rounded-2xl border-2 flex flex-col justify-between p-5 select-none overflow-hidden"
          style={{
            backgroundColor: theme.bgColor,
            borderColor: theme.borderColor,
            color: theme.textColor,
          }}
        >
          {data.showCutGuides && (
            <div className="absolute top-1 right-1 text-[9px] font-mono opacity-50">
              ✂
            </div>
          )}

          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-xs shrink-0 flex items-center justify-center border"
              style={{ borderColor: theme.borderColor }}
            >
              <BirthdayIllustration themeId={data.themeId} className="w-full h-full" />
            </div>
            <div>
              <span
                className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white tracking-wider"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {isArabic ? 'بطاقة شكر' : 'CARTE DE REMERCIEMENT'}
              </span>
              <h3 className="text-base font-black mt-1" style={{ color: theme.textColor }}>
                {isArabic ? 'شكراً من القلب !' : data.language === 'en' ? 'Thank You So Much!' : 'Un Grand Merci !'}
              </h3>
            </div>
          </div>

          <div
            className="my-3 p-3 rounded-xl bg-white/90 border text-xs leading-relaxed font-medium"
            style={{ borderColor: theme.borderColor }}
          >
            <p>
              {isArabic
                ? `شكراً جزيلاً لحضورك الرائع ومشاركتك لي فرحة عيدي الـ ${data.age}، ولهديتك الجميلة !`
                : data.language === 'en'
                ? `Thank you so much for coming to celebrate my ${data.age}th birthday with me and for your wonderful gift!`
                : `Merci beaucoup d'être venu fêter mes ${data.age} ans avec moi ! J'ai passé une fête inoubliable grâce à toi !`}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-dashed" style={{ borderColor: theme.borderColor }}>
            <span className="text-xs font-bold" style={{ color: theme.primaryColor }}>
              {data.childName}
            </span>
            <span className="text-sm">💖 🎉</span>
          </div>
        </div>
      ))}
    </div>
  );
};
