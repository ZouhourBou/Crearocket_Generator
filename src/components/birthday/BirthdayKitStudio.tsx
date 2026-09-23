import React, { useRef, useState, useEffect } from 'react';
import {
  BirthdayKitData,
  BirthdayProductId,
  BirthdayThemeId,
  DEFAULT_BIRTHDAY_KIT,
} from '../../types/birthdayKit';
import { BIRTHDAY_THEMES, getBirthdayTheme } from '../../constants/birthdayThemes';
import { BirthdayPoster } from './BirthdayPoster';
import { BirthdayInvitations } from './BirthdayInvitations';
import { BirthdayLabels } from './BirthdayLabels';
import { BirthdayCupcakeToppers } from './BirthdayCupcakeToppers';
import { BirthdayCakeTopper } from './BirthdayCakeTopper';
import { BirthdayThankYouCards } from './BirthdayThankYouCards';
import { BirthdayPhotoBoothProps } from './BirthdayPhotoBoothProps';
import { BirthdayDecorations } from './BirthdayDecorations';
import { exportToPdf, exportToPng } from '../../utils/exportUtils';
import JSZip from 'jszip';
import {
  Sparkles,
  Download,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Cake,
  Palette,
  Package,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  CheckCircle2,
  Loader2,
  FileArchive,
  Scissors,
  PartyPopper,
} from 'lucide-react';

interface BirthdayKitStudioProps {
  language: 'fr' | 'ar' | 'en';
  onNavigateHome?: () => void;
}

export const BirthdayKitStudio: React.FC<BirthdayKitStudioProps> = ({
  language,
}) => {
  const [data, setData] = useState<BirthdayKitData>(() => ({
    ...DEFAULT_BIRTHDAY_KIT,
    language,
  }));

  const [activeProduct, setActiveProduct] = useState<BirthdayProductId>('poster');
  const [zoom, setZoom] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const paperSheetRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const isArabic = language === 'ar';
  const currentTheme = getBirthdayTheme(data.themeId);

  // ResizeObserver for live responsiveness
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const updateSize = () => {
      setContainerWidth(el.clientWidth);
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const productList: { id: BirthdayProductId; label: { fr: string; ar: string; en: string }; icon: string }[] = [
    { id: 'poster', label: { fr: 'Affiche d’accueil', ar: 'لافتة الترحيب', en: 'Welcome Poster' }, icon: '🖼️' },
    { id: 'invitations', label: { fr: 'Invitations (x4)', ar: 'بطاقات دعوة (4x)', en: 'Invitations (x4)' }, icon: '💌' },
    { id: 'labels', label: { fr: 'Étiquettes cadeaux (x12)', ar: 'ملصقات الهدايا (12x)', en: 'Gift Favors (x12)' }, icon: '🏷️' },
    { id: 'cupcake_toppers', label: { fr: 'Toppers Cupcakes (x12)', ar: 'كب كيك توبر (12x)', en: 'Cupcake Toppers (x12)' }, icon: '🧁' },
    { id: 'cake_topper', label: { fr: 'Grand Topper Gâteau', ar: 'توبر الكعكة الكبير', en: 'Cake Topper' }, icon: '🎂' },
    { id: 'thank_you_cards', label: { fr: 'Cartes de remerciement (x4)', ar: 'بطاقات شكر (4x)', en: 'Thank You Cards (x4)' }, icon: '💖' },
    { id: 'photo_booth', label: { fr: 'Accessoires Photo Booth', ar: 'إكسسوارات التصوير', en: 'Photo Booth Props' }, icon: '📸' },
    { id: 'decorations', label: { fr: 'Fanions de guirlande', ar: 'رايات الزينة', en: 'Pennants Banner' }, icon: '🚩' },
  ];

  const updateField = <K extends keyof BirthdayKitData>(key: K, value: BirthdayKitData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownloadSinglePdf = async () => {
    if (!paperSheetRef.current) return;
    setIsExporting('pdf');
    try {
      await exportToPdf(paperSheetRef.current, { widthMm: 210, heightMm: 297 }, `kit-anniversaire-${data.childName || 'fete'}-${activeProduct}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadSinglePng = async () => {
    if (!paperSheetRef.current) return;
    setIsExporting('png');
    try {
      await exportToPng(paperSheetRef.current, `kit-anniversaire-${data.childName || 'fete'}-${activeProduct}-300dpi.png`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(null);
    }
  };

  const renderActiveProduct = () => {
    switch (activeProduct) {
      case 'poster':
        return <BirthdayPoster data={data} />;
      case 'invitations':
        return <BirthdayInvitations data={data} />;
      case 'labels':
        return <BirthdayLabels data={data} />;
      case 'cupcake_toppers':
        return <BirthdayCupcakeToppers data={data} />;
      case 'cake_topper':
        return <BirthdayCakeTopper data={data} />;
      case 'thank_you_cards':
        return <BirthdayThankYouCards data={data} />;
      case 'photo_booth':
        return <BirthdayPhotoBoothProps data={data} />;
      case 'decorations':
        return <BirthdayDecorations data={data} />;
      default:
        return <BirthdayPoster data={data} />;
    }
  };

  // Sheet dimension math (A4 standard: 210 x 297 mm)
  const sheetPixelWidth = 210 * 2.2; // 462px
  const sheetPixelHeight = 297 * 2.2; // 653.4px
  const availWidth = Math.max(150, (containerWidth || 600) - 48);
  const autoFitScale = Math.min(1, availWidth / sheetPixelWidth);
  const effectiveScale = (zoom / 100) * autoFitScale;
  const scaledWidth = sheetPixelWidth * effectiveScale;
  const scaledHeight = sheetPixelHeight * effectiveScale;

  return (
    <div className="flex flex-col gap-8" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* SECTION BANNER INTRO */}
      <div className="rounded-3xl bg-linear-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 p-6 sm:p-8 border border-pink-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 font-extrabold text-xs mb-2 border border-pink-200">
              <PartyPopper className="w-3.5 h-3.5" />
              <span>{isArabic ? 'استوديو كيت أعياد الميلاد الشامل' : 'Studio Kits Anniversaire Clé en Main'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isArabic ? 'صمم باقة حفل عيد ميلاد طفلك المتكاملة' : 'Créez le kit anniversaire complet de votre enfant'}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              {isArabic
                ? 'لافتات ترحيب، بطاقات دعوة، ملصقات هدايا، زينة كب كيك وكيك، وبطاقات شكر متناسقة بالكامل وجاهزة للطباعة فوراً بدقة 300 DPI.'
                : 'Affiches, invitations, étiquettes cadeaux, toppers de cupcakes, décorations et cartes de remerciement parfaitement assortis et prêts à imprimer en 300 DPI.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-slate-700 shadow-2xs border border-slate-200">
              {isArabic ? '12 سمة فنية راقية' : '12 Thèmes Exclusifs'}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-slate-700 shadow-2xs border border-slate-200">
              {isArabic ? '8 منتجات متناسقة' : '8 Produits Clés'}
            </span>
          </div>
        </div>
      </div>

      {/* WORKSPACE: LEFT FORM + RIGHT LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: CONFIGURATION PANEL (5 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6">
          {/* STEP 1: INFOS DE L'ENFANT & DE LA FÊTE */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isArabic ? '1. معلومات الحفل والطفل' : '1. Informations de la fête'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isArabic ? 'الاسم، السن، الموعد ومكان الاحتفال' : 'Prénom, âge, date et lieu de la réception'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Prénom de l'enfant */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'اسم الطفل / البطل' : 'Prénom de l’enfant'}
                </label>
                <input
                  type="text"
                  value={data.childName}
                  onChange={(e) => updateField('childName', e.target.value)}
                  placeholder="Ex: Lina, Adam, Thomas..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                />
              </div>

              {/* Âge & Switch affichage */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'السن المحتفل به' : 'Âge fêté'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateField('age', Math.max(1, data.age - 1))}
                      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-black text-lg text-slate-900 bg-slate-50 py-1.5 rounded-xl border border-slate-200">
                      {data.age} {isArabic ? 'سنوات' : 'ans'}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateField('age', Math.min(18, data.age + 1))}
                      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={data.showAge}
                      onChange={(e) => updateField('showAge', e.target.checked)}
                      className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300"
                    />
                    <span>{isArabic ? 'إظهار السن في التصاميم' : 'Afficher l’âge'}</span>
                  </label>
                </div>
              </div>

              {/* Date & Heure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'تاريخ الحفل' : 'Date'}
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute top-3 left-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={data.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      placeholder="Ex: Samedi 18 Octobre"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isArabic ? 'التوقيت' : 'Heure'}
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute top-3 left-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={data.time}
                      onChange={(e) => updateField('time', e.target.value)}
                      placeholder="Ex: 14h30 - 18h00"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Lieu / Adresse */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'مكان الحفل أو العنوان' : 'Lieu ou adresse'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute top-3 left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Ex: Chez Lina, 12 rue des Fleurs"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              {/* Contact RSVP */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'هاتف التأكيد (RSVP)' : 'Téléphone ou contact (RSVP)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute top-3 left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={data.contact}
                    onChange={(e) => updateField('contact', e.target.value)}
                    placeholder="Ex: 06 12 34 56 78 (Maman)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              {/* Message personnalisé */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isArabic ? 'رسالة مخصصة أو ملاحظة' : 'Message personnalisé'}
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 absolute top-3 left-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={data.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    placeholder="Ex: Viens déguisé si tu veux !"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: THÈMES ARTISTIQUES (12 THÈMES) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isArabic ? '2. السمة الفنية للحفل' : '2. Thème de fête (12 thèmes)'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isArabic ? 'كل العناصر ستتزين بألوان ورسومات السمة المختارة' : 'Tous les éléments s’adaptent au thème choisi'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {BIRTHDAY_THEMES.map((th) => {
                const isSelected = data.themeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => updateField('themeId', th.id)}
                    className={`flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 shadow-xs ring-2 ring-purple-500/15'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    <span className="text-2xl mb-1">{th.emoji}</span>
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {th.name[language] || th.name.fr}
                    </span>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.primaryColor }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.secondaryColor }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.accentColor }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: OPTIONS DE DÉCOUPE */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Scissors className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-800">
                {isArabic ? 'إظهار خطوط وعلامات القص' : 'Repères et traits de découpe'}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.showCutGuides}
                onChange={(e) => updateField('showCutGuides', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600" />
            </label>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE PREVIEW & PRODUCTS TABS (7 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-4 lg:sticky lg:top-32">
          {/* PRODUCT SELECTOR TABS BAR */}
          <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-xs overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {productList.map((prod) => {
                const isActive = activeProduct === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setActiveProduct(prod.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{prod.icon}</span>
                    <span>{prod.label[language] || prod.label.fr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ZOOM & CONTROLS TOOLBAR */}
          <div className="bg-white rounded-xl px-4 py-2 border border-slate-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {productList.find((p) => p.id === activeProduct)?.label[language] || 'Aperçu'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-mono text-[11px]">Format A4 (300 DPI)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                title="Zoom -"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold font-mono text-slate-700 min-w-9 text-center">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(150, z + 10))}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                title="Zoom +"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors text-xs font-semibold ml-1"
                title="Réinitialiser le zoom"
              >
                100%
              </button>
            </div>
          </div>

          {/* LIVE SHEET CANVAS */}
          <div
            ref={previewContainerRef}
            className="w-full min-h-[480px] lg:min-h-[580px] overflow-auto flex items-center justify-center p-4 bg-slate-200/50 rounded-2xl border border-slate-300/50 shadow-inner"
          >
            <div
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                position: 'relative',
                flexShrink: 0,
                transition: 'width 0.15s ease-out, height 0.15s ease-out',
              }}
              className="flex items-center justify-center"
            >
              <div
                style={{
                  width: `${sheetPixelWidth}px`,
                  height: `${sheetPixelHeight}px`,
                  transform: `scale(${effectiveScale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transition: 'transform 0.15s ease-out',
                }}
              >
                {/* Physical A4 Sheet */}
                <div
                  ref={paperSheetRef}
                  id="birthday-paper-sheet"
                  className="w-full h-full bg-white shadow-2xl relative overflow-hidden"
                  style={{
                    boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  {renderActiveProduct()}
                </div>
              </div>
            </div>
          </div>

          {/* EXPORT ACTION BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Download Single Page PDF */}
            <button
              type="button"
              onClick={handleDownloadSinglePdf}
              disabled={isExporting !== null}
              className="h-[56px] inline-flex items-center justify-center gap-2.5 px-4 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 text-sm shadow-pink-600/20"
            >
              {isExporting === 'pdf' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{isArabic ? 'جاري التحميل...' : 'Génération du PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs sm:text-[13px] font-bold">
                      {isArabic ? 'تحميل هذه الصفحة (PDF)' : 'Télécharger cette page (PDF)'}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {isArabic ? 'دقة 300 DPI للطباعة' : 'Haute définition 300 DPI'}
                    </span>
                  </div>
                </>
              )}
            </button>

            {/* Download Single Page PNG */}
            <button
              type="button"
              onClick={handleDownloadSinglePng}
              disabled={isExporting !== null}
              className="h-[56px] inline-flex items-center justify-center gap-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs transition-all cursor-pointer disabled:opacity-50 text-sm"
            >
              {isExporting === 'png' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-slate-600" />
                  <span>{isArabic ? 'جاري التحميل...' : 'Génération du PNG...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-500 shrink-0" />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="text-xs sm:text-[13px] font-bold">
                      {isArabic ? 'تحميل كصورة (PNG)' : 'Télécharger l’image (PNG)'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {isArabic ? 'صورة فائقة الوضوح' : 'Fichier image HD transparent'}
                    </span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
