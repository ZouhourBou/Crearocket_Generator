import React from 'react';

export interface SchoolSubjectDecorProps {
  decorType?: string;
  w: number;
  h: number;
  isArabic: boolean;
  isCompact?: boolean;
}

export const SCHOOL_DECOR_OPTIONS = [
  {
    id: 'none',
    labelFr: 'Aucun (Standard)',
    labelAr: 'بدون (افتراضي)',
    labelEn: 'None (Default)',
    descriptionFr: 'Design standard sans décor additionnel',
    descriptionAr: 'التصميم القياسي بدون مؤثرات إضافية',
    icon: '✨',
    colors: ['#94A3B8'],
  },
  {
    id: 'playful_supplies',
    labelFr: 'Fournitures scolaires',
    labelAr: 'أدوات مدرسية مرحة',
    labelEn: 'School Supplies',
    descriptionFr: 'Stylos, crayons, règle, ciseaux et trombones multicolores',
    descriptionAr: 'أقلام ملونة، مسطرة، ممحاة ومقصات ملونة',
    icon: '✏️',
    colors: ['#3B82F6', '#EF4444', '#F59E0B', '#10B981'],
  },
  {
    id: 'books_learning',
    labelFr: 'Livres & Savoir',
    labelAr: 'كتب وقراءة',
    labelEn: 'Books & Learning',
    descriptionFr: 'Livres ouverts, piles de manuels et étoiles de réussite',
    descriptionAr: 'كتب مفتوحة، دفاتر ونجوم تفوق دراسي',
    icon: '📚',
    colors: ['#6366F1', '#EC4899', '#F59E0B', '#14B8A6'],
  },
  {
    id: 'stem_geometry',
    labelFr: 'Sciences & Géométrie',
    labelAr: 'علوم وهندسة',
    labelEn: 'Science & Math',
    descriptionFr: 'Équerre, compas, calculs, atome et règle graduée',
    descriptionAr: 'مسطرة مدرجة، كوت، رموز حسابية وذرة علمية',
    icon: '📐',
    colors: ['#0284C7', '#8B5CF6', '#10B981', '#F97316'],
  },
  {
    id: 'creative_art',
    labelFr: 'Arts & Dessin',
    labelAr: 'فنون ورسم',
    labelEn: 'Art & Creativity',
    descriptionFr: 'Palette de couleurs, pinceaux et touches artistiques',
    descriptionAr: 'لوحة ألوان، فرشاة رسم ولمسات إبداعية',
    icon: '🎨',
    colors: ['#F43F5E', '#A855F7', '#F59E0B', '#06B6D4'],
  },
  {
    id: 'school_mix',
    labelFr: 'Panoplie scolaire complète',
    labelAr: 'تشكيلة مدرسية شاملة',
    labelEn: 'Complete School Mix',
    descriptionFr: 'Mélange riche et harmonieux de tous les symboles éducatifs',
    descriptionAr: 'مزيج شامل ومتناسق لجميع الرموز والأدوات المدرسية',
    icon: '🎒',
    colors: ['#2563EB', '#DC2626', '#EAB308', '#059669'],
  },
];

export const SchoolSubjectDecor: React.FC<SchoolSubjectDecorProps> = ({
  decorType,
  w,
  h,
  isArabic,
  isCompact = false,
}) => {
  if (!decorType || decorType === 'none') {
    return null;
  }

  // Scale factor based on label dimensions
  const scale = isCompact ? 0.75 : 1;

  switch (decorType) {
    case 'playful_supplies':
      return (
        <g pointerEvents="none" className="school-decor-supplies">
          {/* Top-right cute pencil */}
          <g transform={`translate(${w - 24 * scale}, ${4 * scale}) rotate(25)`}>
            {/* Pencil body */}
            <rect x="0" y="0" width={14 * scale} height={4 * scale} rx={1 * scale} fill="#F59E0B" />
            <rect x={14 * scale} y="0" width={3 * scale} height={4 * scale} fill="#E2E8F0" />
            <rect x={17 * scale} y="0" width={3.5 * scale} height={4 * scale} rx={1 * scale} fill="#FB7185" />
            {/* Pencil tip */}
            <polygon
              points={`0,0 0,${4 * scale} ${-4 * scale},${2 * scale}`}
              fill="#FDE68A"
            />
            <polygon
              points={`0,${1 * scale} 0,${3 * scale} ${-4 * scale},${2 * scale}`}
              fill="#1E293B"
            />
          </g>

          {/* Bottom-right ruler motif */}
          <g transform={`translate(${w - 28 * scale}, ${h - 10 * scale}) rotate(-5)`}>
            <rect
              x="0"
              y="0"
              width={22 * scale}
              height={5.5 * scale}
              rx={1 * scale}
              fill="#60A5FA"
              opacity="0.85"
            />
            {/* Tick marks */}
            {[3, 6, 9, 12, 15, 18].map((x) => (
              <line
                key={x}
                x1={x * scale}
                y1="0"
                x2={x * scale}
                y2={(x % 6 === 0 ? 3 : 2) * scale}
                stroke="#FFFFFF"
                strokeWidth={0.8 * scale}
              />
            ))}
          </g>

          {/* Paperclip top-left or corner */}
          <g transform={`translate(${isArabic ? w - 38 * scale : 10 * scale}, ${5 * scale}) rotate(-20)`}>
            <path
              d={`M0 0 L${5 * scale} 0 C${7 * scale} 0 ${7 * scale} ${5 * scale} ${5 * scale} ${5 * scale} L${1 * scale} ${5 * scale} C${-1 * scale} ${5 * scale} ${-1 * scale} ${2 * scale} ${1 * scale} ${2 * scale} L${4 * scale} ${2 * scale}`}
              fill="none"
              stroke="#EF4444"
              strokeWidth={1.1 * scale}
              strokeLinecap="round"
            />
          </g>

          {/* Playful mini stars/confetti */}
          <circle cx={w * 0.48} cy={4 * scale} r={1.3 * scale} fill="#10B981" opacity="0.7" />
          <circle cx={w * 0.52} cy={h - 4 * scale} r={1.5 * scale} fill="#EC4899" opacity="0.6" />
          <polygon
            points={`${w * 0.2},${h - 6 * scale} ${w * 0.2 + 2 * scale},${h - 4 * scale} ${w * 0.2},${h - 2 * scale} ${w * 0.2 - 2 * scale},${h - 4 * scale}`}
            fill="#FBBF24"
            opacity="0.8"
          />
        </g>
      );

    case 'books_learning':
      return (
        <g pointerEvents="none" className="school-decor-books">
          {/* Stack of books at top corner */}
          <g transform={`translate(${w - 22 * scale}, ${5 * scale})`}>
            {/* Book 1 (bottom) */}
            <rect x="0" y={5 * scale} width={16 * scale} height={3.5 * scale} rx={0.8 * scale} fill="#4F46E5" />
            <rect x={1.5 * scale} y={5.8 * scale} width={13 * scale} height={1.8 * scale} fill="#FFFFFF" opacity="0.9" />
            {/* Book 2 (middle) */}
            <rect x={2 * scale} y={2.2 * scale} width={14 * scale} height={3 * scale} rx={0.8 * scale} fill="#EC4899" />
            <rect x={3.5 * scale} y={3 * scale} width={11 * scale} height={1.5 * scale} fill="#FFFFFF" opacity="0.9" />
            {/* Book 3 (top) */}
            <rect x={3.5 * scale} y="0" width={11 * scale} height={2.5 * scale} rx={0.8 * scale} fill="#10B981" />
          </g>

          {/* Open book at bottom */}
          <g transform={`translate(${w - 20 * scale}, ${h - 11 * scale})`}>
            <path
              d={`M0 ${4 * scale} Q${6 * scale} ${1 * scale} ${12 * scale} ${3 * scale} L${12 * scale} ${8 * scale} Q${6 * scale} ${6 * scale} 0 ${9 * scale} Z`}
              fill="#F59E0B"
            />
            <path
              d={`M${12 * scale} ${3 * scale} Q${18 * scale} ${1 * scale} ${24 * scale} ${4 * scale} L${24 * scale} ${9 * scale} Q${18 * scale} ${6 * scale} ${12 * scale} ${8 * scale} Z`}
              fill="#D97706"
            />
            {/* Pages */}
            <path
              d={`M${1.5 * scale} ${4.5 * scale} Q${6 * scale} ${2.5 * scale} ${11 * scale} ${4 * scale} L${11 * scale} ${7.5 * scale} Q${6 * scale} ${6 * scale} ${1.5 * scale} ${8 * scale} Z`}
              fill="#FEF3C7"
            />
            <path
              d={`M${13 * scale} ${4 * scale} Q${18 * scale} ${2.5 * scale} ${22.5 * scale} ${4.5 * scale} L${22.5 * scale} ${8 * scale} Q${18 * scale} ${6 * scale} ${13 * scale} ${7.5 * scale} Z`}
              fill="#FEF3C7"
            />
          </g>

          {/* Achievement gold stars */}
          <polygon
            points={`${w * 0.4},${5 * scale} ${w * 0.4 + 1.2 * scale},${7 * scale} ${w * 0.4 + 3.5 * scale},${7.2 * scale} ${w * 0.4 + 1.8 * scale},${8.8 * scale} ${w * 0.4 + 2.3 * scale},${11 * scale} ${w * 0.4},${9.7 * scale} ${w * 0.4 - 2.3 * scale},${11 * scale} ${w * 0.4 - 1.8 * scale},${8.8 * scale} ${w * 0.4 - 3.5 * scale},${7.2 * scale} ${w * 0.4 - 1.2 * scale},${7 * scale}`}
            fill="#FBBF24"
            opacity="0.85"
          />
          <circle cx={w * 0.35} cy={h - 5 * scale} r={1.5 * scale} fill="#818CF8" opacity="0.7" />
        </g>
      );

    case 'stem_geometry':
      return (
        <g pointerEvents="none" className="school-decor-stem">
          {/* Triangle ruler / Set square */}
          <g transform={`translate(${w - 22 * scale}, ${5 * scale})`}>
            <polygon
              points={`0,0 ${16 * scale},0 0,${14 * scale}`}
              fill="#0284C7"
              opacity="0.8"
            />
            <polygon
              points={`${3 * scale},${2 * scale} ${11 * scale},${2 * scale} ${3 * scale},${9 * scale}`}
              fill="#FFFFFF"
            />
          </g>

          {/* Compass / Math symbols at bottom */}
          <g transform={`translate(${w - 24 * scale}, ${h - 10 * scale})`}>
            {/* Plus */}
            <rect x="0" y={2 * scale} width={6 * scale} height={2 * scale} fill="#8B5CF6" rx={0.5 * scale} />
            <rect x={2 * scale} y="0" width={2 * scale} height={6 * scale} fill="#8B5CF6" rx={0.5 * scale} />
            {/* Multiplication */}
            <g transform={`translate(${10 * scale}, ${3 * scale}) rotate(45)`}>
              <rect x={-3 * scale} y={-1 * scale} width={6 * scale} height={2 * scale} fill="#F97316" rx={0.5 * scale} />
              <rect x={-1 * scale} y={-3 * scale} width={2 * scale} height={6 * scale} fill="#F97316" rx={0.5 * scale} />
            </g>
            {/* Equals */}
            <rect x={18 * scale} y={1 * scale} width={5 * scale} height={1.5 * scale} fill="#10B981" rx={0.4 * scale} />
            <rect x={18 * scale} y={3.5 * scale} width={5 * scale} height={1.5 * scale} fill="#10B981" rx={0.4 * scale} />
          </g>

          {/* Tiny Atom icon */}
          <g transform={`translate(${w * 0.5}, ${5 * scale})`}>
            <ellipse cx="0" cy="0" rx={4 * scale} ry={1.5 * scale} fill="none" stroke="#06B6D4" strokeWidth={0.7 * scale} transform="rotate(30)" opacity="0.75" />
            <ellipse cx="0" cy="0" rx={4 * scale} ry={1.5 * scale} fill="none" stroke="#06B6D4" strokeWidth={0.7 * scale} transform="rotate(-30)" opacity="0.75" />
            <circle cx="0" cy="0" r={1.2 * scale} fill="#0284C7" />
          </g>
        </g>
      );

    case 'creative_art':
      return (
        <g pointerEvents="none" className="school-decor-art">
          {/* Artist Paint palette in corner */}
          <g transform={`translate(${w - 22 * scale}, ${5 * scale})`}>
            <path
              d={`M${8 * scale} 0 C${14 * scale} 0 ${16 * scale} ${5 * scale} ${16 * scale} ${9 * scale} C${16 * scale} ${13 * scale} ${12 * scale} ${15 * scale} ${8 * scale} ${15 * scale} C${3 * scale} ${15 * scale} 0 ${12 * scale} 0 ${7 * scale} C0 ${3 * scale} ${3 * scale} 0 ${8 * scale} 0 Z`}
              fill="#FDE047"
              opacity="0.85"
            />
            {/* Paint dollops */}
            <circle cx={4 * scale} cy={4 * scale} r={1.2 * scale} fill="#EF4444" />
            <circle cx={8 * scale} cy={3 * scale} r={1.2 * scale} fill="#3B82F6" />
            <circle cx={12 * scale} cy={5 * scale} r={1.2 * scale} fill="#10B981" />
            <circle cx={12 * scale} cy={10 * scale} r={1.2 * scale} fill="#A855F7" />
            {/* Thumb hole */}
            <circle cx={5 * scale} cy={10 * scale} r={1.5 * scale} fill="#FFFFFF" />
          </g>

          {/* Paint brush in bottom corner */}
          <g transform={`translate(${w - 24 * scale}, ${h - 8 * scale}) rotate(-35)`}>
            {/* Handle */}
            <rect x="0" y="0" width={16 * scale} height={2 * scale} rx={0.8 * scale} fill="#B45309" />
            {/* Metal ferrule */}
            <rect x={16 * scale} y={-0.3 * scale} width={3 * scale} height={2.6 * scale} fill="#94A3B8" />
            {/* Bristles with paint tip */}
            <path
              d={`M${19 * scale} 0 C${21 * scale} 0 ${23 * scale} ${1 * scale} ${23 * scale} ${1 * scale} C${23 * scale} ${1 * scale} ${21 * scale} ${2 * scale} ${19 * scale} ${2 * scale} Z`}
              fill="#EC4899"
            />
          </g>

          {/* Colorful artistic splatters */}
          <circle cx={w * 0.45} cy={4 * scale} r={1.2 * scale} fill="#EC4899" opacity="0.75" />
          <circle cx={w * 0.52} cy={5 * scale} r={0.8 * scale} fill="#3B82F6" opacity="0.65" />
          <circle cx={w * 0.28} cy={h - 5 * scale} r={1.4 * scale} fill="#F97316" opacity="0.75" />
        </g>
      );

    case 'school_mix':
    default:
      return (
        <g pointerEvents="none" className="school-decor-mix">
          {/* Top-right: Pencil + Book stack */}
          <g transform={`translate(${w - 25 * scale}, ${4 * scale})`}>
            {/* Book */}
            <rect x="0" y={4 * scale} width={13 * scale} height={3 * scale} rx={0.8 * scale} fill="#3B82F6" />
            <rect x={1 * scale} y={4.7 * scale} width={11 * scale} height={1.5 * scale} fill="#FFFFFF" opacity="0.9" />
            {/* Pencil diagonal */}
            <g transform={`translate(${2 * scale}, ${-1 * scale}) rotate(25)`}>
              <rect x="0" y="0" width={11 * scale} height={3 * scale} rx={0.8 * scale} fill="#F59E0B" />
              <polygon points={`0,0 0,${3 * scale} ${-3 * scale},${1.5 * scale}`} fill="#FDE68A" />
              <polygon points={`0,${0.8 * scale} 0,${2.2 * scale} ${-3 * scale},${1.5 * scale}`} fill="#1E293B" />
              <rect x={11 * scale} y="0" width={2.5 * scale} height={3 * scale} fill="#FB7185" rx={0.6 * scale} />
            </g>
          </g>

          {/* Bottom-right: Ruler & Scissors */}
          <g transform={`translate(${w - 26 * scale}, ${h - 9 * scale})`}>
            <rect x="0" y="0" width={18 * scale} height={4.5 * scale} rx={0.8 * scale} fill="#10B981" opacity="0.85" />
            {[2, 5, 8, 11, 14].map((x) => (
              <line
                key={x}
                x1={x * scale}
                y1="0"
                x2={x * scale}
                y2={2.2 * scale}
                stroke="#FFFFFF"
                strokeWidth={0.7 * scale}
              />
            ))}
          </g>

          {/* Playful learning accents around perimeter */}
          <polygon
            points={`${w * 0.45},${4 * scale} ${w * 0.45 + 1 * scale},${5.5 * scale} ${w * 0.45 + 2.5 * scale},${5.6 * scale} ${w * 0.45 + 1.3 * scale},${6.8 * scale} ${w * 0.45 + 1.7 * scale},${8.5 * scale} ${w * 0.45},${7.5 * scale} ${w * 0.45 - 1.7 * scale},${8.5 * scale} ${w * 0.45 - 1.3 * scale},${6.8 * scale} ${w * 0.45 - 2.5 * scale},${5.6 * scale} ${w * 0.45 - 1 * scale},${5.5 * scale}`}
            fill="#FBBF24"
            opacity="0.8"
          />
          <circle cx={w * 0.22} cy={h - 4.5 * scale} r={1.3 * scale} fill="#EF4444" opacity="0.75" />
          <circle cx={w * 0.26} cy={h - 5.5 * scale} r={0.9 * scale} fill="#6366F1" opacity="0.65" />
        </g>
      );
  }
};
