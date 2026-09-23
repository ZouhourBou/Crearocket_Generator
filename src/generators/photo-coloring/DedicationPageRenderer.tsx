import React from 'react';
import { Heart, Sparkles, Award } from 'lucide-react';

interface Props {
  childName: string;
  messageText?: string;
  signoff?: string;
}

export const DedicationPageRenderer: React.FC<Props> = ({
  childName,
  messageText,
  signoff,
}) => {
  return (
    <div className="w-full h-full bg-white relative flex flex-col justify-between p-8 sm:p-14 select-none overflow-hidden box-border text-center">
      {/* Decorative Border */}
      <div className="absolute inset-4 border-2 border-slate-900 rounded-2xl pointer-events-none" />
      <div className="absolute inset-6 border border-dashed border-slate-400 rounded-xl pointer-events-none" />

      {/* Top Badge */}
      <div className="pt-6 relative z-10">
        <div className="w-16 h-16 rounded-full border-2 border-slate-900 mx-auto flex items-center justify-center bg-slate-50 mb-4 shadow-xs">
          <Award className="w-8 h-8 text-slate-800" />
        </div>
        <p className="text-xs uppercase tracking-widest font-black text-slate-500">
          Certificat & Dédicace d'Artiste
        </p>
      </div>

      {/* Main Statement */}
      <div className="my-auto py-6 relative z-10 max-w-md mx-auto space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
          Ce cahier de coloriage appartient à
        </h2>

        <div className="py-2 px-6 border-b-2 border-slate-900 inline-block font-black text-2xl text-slate-900 min-w-56">
          {childName || 'Un Petit Artiste'}
        </div>

        <p className="text-sm text-slate-700 italic leading-relaxed pt-2">
          « {messageText || "Que chaque page t'apporte joie, créativité et couleurs magiques. Prends tes plus beaux crayons et fais briller tes souvenirs !"} »
        </p>

        {signoff && (
          <p className="text-xs font-bold text-slate-800 pt-3">
            Avec tout notre amour, <br />
            <span className="font-extrabold text-sm">{signoff}</span>
          </p>
        )}
      </div>

      {/* Creative Coloring Doodles for child */}
      <div className="pb-6 relative z-10 border-t border-slate-200 pt-4 flex items-center justify-around text-slate-400">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Créé avec amour</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>CreatRocket Pro</span>
        </div>
      </div>
    </div>
  );
};
