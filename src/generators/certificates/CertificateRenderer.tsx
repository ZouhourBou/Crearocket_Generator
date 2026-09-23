import React from 'react';
import { CertificateState } from '../../types/plannerAndCertificates';
import { CERTIFICATE_TEMPLATES } from './CertificateLibrary';
import { Award, Star, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props {
  state: CertificateState;
}

export const CertificateRenderer: React.FC<Props> = ({ state }) => {
  const tpl = CERTIFICATE_TEMPLATES[state.templateId] || CERTIFICATE_TEMPLATES.classic_gold;
  const isLandscape = state.orientation === 'landscape';

  // Active student recipient details
  const activeRecipient = state.recipients[state.activeRecipientIndex] || {
    studentName: state.studentName,
    studentClass: state.studentClass,
  };

  const displayName = activeRecipient.studentName || state.studentName || 'Prénom & Nom de l’Élève';
  const displayClass = activeRecipient.studentClass || state.studentClass;

  return (
    <div
      className="w-full h-full relative select-none box-border flex flex-col justify-between overflow-hidden"
      style={{
        background: tpl.bgGradient,
        fontFamily: tpl.titleFont,
      }}
    >
      {/* 1. Ornate Multi-layer Border Framing */}
      <div
        className="absolute inset-3 border-4 rounded-xl pointer-events-none transition-all"
        style={{ borderColor: tpl.borderColor }}
      />
      <div
        className="absolute inset-4.5 border border-dashed rounded-lg pointer-events-none opacity-60"
        style={{ borderColor: tpl.secondaryColor }}
      />

      {/* Decorative Ornate Corner Accents */}
      <div className="absolute top-5 left-5 text-lg opacity-80" style={{ color: tpl.primaryColor }}>
        {tpl.badgeEmoji}
      </div>
      <div className="absolute top-5 right-5 text-lg opacity-80" style={{ color: tpl.primaryColor }}>
        {tpl.badgeEmoji}
      </div>
      <div className="absolute bottom-5 left-5 text-lg opacity-80" style={{ color: tpl.primaryColor }}>
        {tpl.badgeEmoji}
      </div>
      <div className="absolute bottom-5 right-5 text-lg opacity-80" style={{ color: tpl.primaryColor }}>
        {tpl.badgeEmoji}
      </div>

      {/* Main Certificate Content Layout */}
      <div className="relative z-10 w-full h-full p-8 sm:p-12 flex flex-col justify-between items-center text-center">
        {/* Top Header: School, Logo & Stars */}
        <div className="w-full flex flex-col items-center">
          {/* Optional School Logo / Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            {state.showSchoolLogo && state.schoolLogoUrl ? (
              <img
                src={state.schoolLogoUrl}
                alt="Logo École"
                className="h-10 object-contain"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xs font-bold text-xs"
                style={{ backgroundColor: tpl.primaryColor }}
              >
                ★
              </div>
            )}
            <span
              className="text-xs sm:text-sm font-extrabold tracking-widest uppercase"
              style={{ color: tpl.secondaryColor }}
            >
              {state.schoolName || 'RÉPUBLIQUE ÉDUCATIVE & ACADÉMIE SCOLAIRE'}
            </span>
          </div>

          {/* Golden Stars row */}
          {state.showStars && (
            <div className="flex items-center gap-1.5 my-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-5 h-5 fill-amber-400" />
              <Star className="w-6 h-6 fill-amber-400" />
              <Star className="w-5 h-5 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          )}

          {/* Certificate Main Title */}
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-wider mt-1 drop-shadow-2xs"
            style={{
              color: tpl.primaryColor,
              letterSpacing: '0.05em',
            }}
          >
            {state.title || 'DIPLÔME D’HONNEUR'}
          </h1>

          {/* Elegant Subtitle */}
          <p
            className="text-xs sm:text-sm italic font-medium mt-1 max-w-xl text-gray-700"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {state.subtitle || 'Décerné solennellement avec les félicitations chaleureuses du corps professoral à'}
          </p>
        </div>

        {/* Center: Recipient Name Calligraphy & Award Title */}
        <div className="w-full my-auto flex flex-col items-center">
          {/* Student Name */}
          <div className="w-full max-w-2xl px-6 py-2 border-b-2 border-dashed flex flex-col items-center justify-center" style={{ borderColor: tpl.borderColor }}>
            <span
              className="text-3xl sm:text-5xl font-bold leading-tight drop-shadow-xs"
              style={{
                color: tpl.primaryColor,
                fontFamily: tpl.nameFont,
              }}
            >
              {displayName}
            </span>
          </div>

          {/* Student Class */}
          {displayClass && (
            <div
              className="mt-2 text-xs sm:text-sm font-extrabold tracking-wider uppercase px-4 py-0.5 rounded-full"
              style={{
                backgroundColor: tpl.accentColor,
                color: tpl.primaryColor,
              }}
            >
              Classe de {displayClass} • Année {state.academicYear}
            </div>
          )}

          {/* Award Title Badge / Ribbon */}
          <div className="mt-4 max-w-lg">
            <h2
              className="text-sm sm:text-base font-extrabold uppercase tracking-wide"
              style={{ color: tpl.secondaryColor }}
            >
              « {state.awardTitle || 'Pour son investissement et son travail assidu'} »
            </h2>
            <p
              className="text-xs text-gray-600 mt-1 leading-relaxed max-w-md mx-auto"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {state.reasonText}
            </p>
          </div>
        </div>

        {/* Bottom Section: Official Stamp, Date & Dual Signatures */}
        <div className="w-full flex items-end justify-between pt-4 border-t border-gray-200/60" style={{ borderColor: tpl.secondaryColor }}>
          {/* Teacher Signature */}
          <div className="flex flex-col items-center w-36 text-center">
            <div className="h-10 flex items-center justify-center">
              {state.teacherSignatureImg ? (
                <img
                  src={state.teacherSignatureImg}
                  alt="Signature"
                  className="max-h-8 object-contain"
                />
              ) : (
                <span
                  className="text-lg italic opacity-75 font-serif"
                  style={{ color: tpl.primaryColor }}
                >
                  {state.teacherSignatureName || 'Signature'}
                </span>
              )}
            </div>
            <div className="w-full border-t border-gray-400 mt-1" />
            <span className="text-[11px] font-bold text-gray-700 mt-1">
              {state.teacherSignatureLabel || 'L’Enseignant(e)'}
            </span>
            <span className="text-[10px] text-gray-500">
              {state.teacherSignatureName}
            </span>
          </div>

          {/* Center Official Gold Embossed Stamp */}
          {state.showOfficialStamp && (
            <div className="flex flex-col items-center justify-center mx-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-double flex flex-col items-center justify-center shadow-md relative"
                style={{
                  backgroundColor: tpl.accentColor,
                  borderColor: tpl.stampBadgeColor,
                  color: tpl.stampBadgeColor,
                }}
              >
                <div className="text-xl sm:text-2xl">{tpl.badgeEmoji}</div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter text-center leading-none mt-0.5">
                  {state.stampText || 'OFFICIEL'}
                </span>
                <span className="text-[7px] opacity-75 font-mono">
                  {state.academicYear}
                </span>
              </div>
              <span className="text-[9px] font-semibold text-gray-500 mt-1">
                Fait à {state.issueLocation || 'Paris'}, le {state.issueDate}
              </span>
            </div>
          )}

          {/* Principal / Direction Signature */}
          <div className="flex flex-col items-center w-36 text-center">
            <div className="h-10 flex items-center justify-center">
              {state.directorSignatureImg ? (
                <img
                  src={state.directorSignatureImg}
                  alt="Signature"
                  className="max-h-8 object-contain"
                />
              ) : (
                <span
                  className="text-lg italic opacity-75 font-serif"
                  style={{ color: tpl.primaryColor }}
                >
                  {state.directorSignatureName || 'La Direction'}
                </span>
              )}
            </div>
            <div className="w-full border-t border-gray-400 mt-1" />
            <span className="text-[11px] font-bold text-gray-700 mt-1">
              {state.directorSignatureLabel || 'Le / La Directeur(trice)'}
            </span>
            <span className="text-[10px] text-gray-500">
              {state.directorSignatureName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
