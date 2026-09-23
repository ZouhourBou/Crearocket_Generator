export type TitleNumberingType = 'paren' | 'letters' | 'roman' | 'bullet' | 'none';
export type TitleNumberingModel = TitleNumberingType;

export interface TitleNumberingOption {
  id: TitleNumberingType;
  label: string;
  labelAr: string;
  preview: string;
  previewAr: string;
  shortLabel?: string;
}

export const TITLE_NUMBERING_OPTIONS: TitleNumberingOption[] = [
  {
    id: 'paren',
    label: 'Chiffres avec parenthèse (1), 2), 3))',
    labelAr: 'أرقام مع قوس (1)، 2)، 3))',
    preview: '1)',
    previewAr: '1)',
    shortLabel: '1)',
  },
  {
    id: 'letters',
    label: 'Lettres (A, B, C)',
    labelAr: 'حروف (أ، ب، ج)',
    preview: 'A)',
    previewAr: 'أ)',
    shortLabel: 'A)',
  },
  {
    id: 'roman',
    label: 'Chiffres romains (I, II, III)',
    labelAr: 'أرقام رومانية (I, II, III)',
    preview: 'I)',
    previewAr: 'I)',
    shortLabel: 'I)',
  },
  {
    id: 'bullet',
    label: 'Puce / icône simple (•)',
    labelAr: 'نقطة / رمز بسيط (•)',
    preview: '•',
    previewAr: '•',
    shortLabel: '•',
  },
  {
    id: 'none',
    label: 'Aucune numérotation',
    labelAr: 'بدون ترقيم',
    preview: 'Ø',
    previewAr: 'Ø',
    shortLabel: 'Ø',
  },
];

export function formatTitlePrefix(
  model?: string,
  isRtl?: boolean,
  customPrefix?: string
): string {
  if (!model || model === 'none' || model === 'Aucune') {
    return '';
  }

  if (model === 'custom' || model === 'Personnalisé') {
    return (customPrefix || '').trim();
  }

  switch (model) {
    case 'paren':
    case 'numbers':
    case '1)':
    case '1.':
      return isRtl ? '1)' : '1)';
    case 'letters':
    case 'A)':
    case 'A.':
      return isRtl ? 'أ)' : 'A)';
    case 'roman':
    case 'I)':
    case 'I.':
    case 'I. (Romain)':
      return 'I)';
    case 'bullet':
    case '•':
      return '•';
    default:
      return '';
  }
}
