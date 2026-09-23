import React from 'react';
import { Language } from '../types';
import { WorksheetEditor } from './worksheet/WorksheetEditor';

interface WorksheetPageProps {
  language: Language;
  onNavigate: (route: string) => void;
}

export const WorksheetPage: React.FC<WorksheetPageProps> = ({
  language,
  onNavigate,
}) => {
  const isArabic = language === 'ar';

  return (
    <div
      className="flex-1 flex flex-col h-full w-full overflow-hidden bg-slate-100"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Éditeur Visuel A4 - Phase 1 (100vh Shopify-like Editor) */}
      <WorksheetEditor onBackToHome={() => onNavigate('/')} />
    </div>
  );
};

