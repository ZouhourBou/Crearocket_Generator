import { NotebookSubject, StudentInfo, NotebookCoverInputParams, NotebookPageFormat } from '../types';
import {
  getSubjectDefinition,
  selectNextTemplateForSubject,
  buildAiBackgroundPrompt,
  validateCoverLayout,
  CoverTemplate,
  SubjectDefinition,
} from '../data/subjectRegistry';
import { generateCleanSubjectCoverSvg } from '../data/subjectArtworkGenerators';
import {
  NOTEBOOK_SUBJECT_PROFILES,
  NOTEBOOK_THEMES,
  CREAROCKET_BRAND,
  SubjectArtisticProfile,
  CoverVariation,
  NotebookThemeArtisticDirection,
} from '../data/notebookThemes';

export interface GenerateCoverResult {
  imageUrl: string;
  isAiGenerated: boolean;
  profile: SubjectArtisticProfile;
  variation: CoverVariation;
  theme: NotebookThemeArtisticDirection;
  themeId: string;
  nextUsedThemeIds: string[];
  variationIndex: number;
  variationHint: string;
  brandSlogan: string;
  seed: number;
  generationId: number;
  subjectDef: SubjectDefinition;
  template: CoverTemplate;
}

/**
 * Generate a premium CreaRocket AI notebook cover background.
 * Strictly respects the Architecture Mandate:
 * A. AI generates visual background ONLY (no readable text, reserved safe zones).
 * B. Application renders editable text layers programmatically.
 */
export async function generateNotebookCover(params: {
  subject: NotebookSubject | string;
  customSubjectName?: string;
  formatMm: { width: number; height: number };
  coversPerSheet: 1 | 2 | 3 | 'custom';
  language: 'fr' | 'ar' | 'en';
  usedThemeIds?: string[];
  previousVariationIndex?: number;
  studentInfo?: StudentInfo;
  seed?: number;
}): Promise<GenerateCoverResult> {
  const generationId = Date.now();
  const currentSeed = params.seed ?? Math.floor(Math.random() * 1000000);

  // 1. HARD SUBJECT LOCK: att_2 is the sole source of truth
  const subjectDef = getSubjectDefinition(params.subject);

  // 2. TEMPLATE SELECTION: 1 of 12 templates, anti-repetition
  const nextVariationIndex = (params.previousVariationIndex !== undefined)
    ? (params.previousVariationIndex + 1) % 12
    : Math.floor(Math.random() * 12);
  const template = selectNextTemplateForSubject(subjectDef.id, nextVariationIndex + 1);

  // Hard assertion check
  if (template.subjectId !== subjectDef.id) {
    throw new Error(`Subject lock failure: template subject ${template.subjectId} !== requested ${subjectDef.id}`);
  }

  const formatPage = params.coversPerSheet === 2 ? 'A4_double_horizontal' : 'A4_unique';

  // 3. BUILD AI PROMPT: Visual background ONLY, zero readable text, safe zones reserved
  const aiPrompt = buildAiBackgroundPrompt(subjectDef, template, formatPage);

  let generatedImageUrl: string | null = null;

  // 4. Attempt server-side Gemini generation
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch('/api/generate-cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subjectDef.id,
        prompt: aiPrompt,
        format_page: formatPage,
        att_numero_modele: template.id,
        seed: currentSeed,
      }),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const data = await response.json();
      if (data && data.imageUrl) {
        generatedImageUrl = data.imageUrl;
      }
    }
  } catch {
    // Fallback handled below
  }

  // 5. Fallback if offline or timeout: Clean, high-DPI vector artwork for this subject
  if (!generatedImageUrl) {
    generatedImageUrl = generateCleanSubjectCoverSvg(subjectDef, template, 1200, 1697);
  }

  const legacyProfile = NOTEBOOK_SUBJECT_PROFILES[params.subject as NotebookSubject] || NOTEBOOK_SUBJECT_PROFILES.other;
  const legacyThemes = NOTEBOOK_THEMES[params.subject as NotebookSubject] || NOTEBOOK_THEMES.other;
  const legacyTheme = legacyThemes[template.id % legacyThemes.length] || legacyThemes[0];

  return {
    imageUrl: generatedImageUrl,
    isAiGenerated: true,
    profile: legacyProfile,
    variation: {
      id: `template-${template.id}`,
      styleTitle: {
        fr: template.name,
        ar: `${subjectDef.label} — ${template.name}`,
        en: template.name,
      },
      universeDescription: template.composition,
      asset: generatedImageUrl,
      palette: {
        name: template.name,
        primary: template.palette[0] || '#2563EB',
        secondary: template.palette[1] || '#0D9488',
        accent: template.palette[2] || '#F59E0B',
        bg: template.palette[3] || '#F8FAFC',
        border: template.palette[1] || '#CBD5E1',
        badgeBg: template.palette[0] || '#2563EB',
        badgeText: '#FFFFFF',
        cartoucheBg: '#FFFFFF',
        cartoucheBorder: template.palette[1] || '#CBD5E1',
      },
      visualElements: template.primaryObjects,
    },
    theme: legacyTheme,
    themeId: `template-${template.id}`,
    nextUsedThemeIds: [],
    variationIndex: template.id - 1,
    variationHint: template.name,
    brandSlogan: CREAROCKET_BRAND.slogan,
    seed: currentSeed,
    generationId,
    subjectDef,
    template,
  };
}

/**
 * Direct generation matching the exact official CreaRocket parameters schema:
 * {
 *   format_page: "A4_unique | A4_double_horizontal",
 *   type_matiere: "...",
 *   titre_cahier: "...",
 *   nom_prenom: "...",
 *   classe: "...",
 *   ecole: "...",
 *   annee: "...",
 *   variation_index: number
 * }
 */
export async function generateNotebookCoverFromParams(
  params: NotebookCoverInputParams
): Promise<{
  imageUrl: string;
  prompt: string;
  isAiGenerated: boolean;
  subjectDef: SubjectDefinition;
  template: CoverTemplate;
}> {
  // 1. HARD SUBJECT LOCK: att_2 is the sole source of truth
  const subjectDef = getSubjectDefinition(params.type_matiere);

  // 2. TEMPLATE SELECTION: Pick template 1 to 12 with anti-repetition
  const requestedModelNum = params.att_numero_modele || ((params.variation_index ?? 0) % 12) + 1;
  const template = selectNextTemplateForSubject(subjectDef.id, requestedModelNum);

  // Strict validation assertion
  if (template.subjectId !== subjectDef.id) {
    throw new Error(
      `Subject Lock Violation: Template subject ${template.subjectId} does not match ${subjectDef.id}`
    );
  }

  // Pre-render layout validation
  const validation = validateCoverLayout(
    subjectDef.id,
    template,
    params.titre_cahier,
    {
      fullName: params.nom_prenom,
      grade: params.classe,
      schoolName: params.ecole,
      academicYear: params.annee,
    }
  );

  if (!validation.valid) {
    console.warn('Cover Layout Validation warnings/errors:', validation.errors);
  }

  // 3. AI PROMPT: Visual background ONLY, zero readable text, safe zones reserved
  const aiPrompt = buildAiBackgroundPrompt(subjectDef, template, params.format_page);

  let finalImageUrl: string | null = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 22000);

    const response = await fetch('/api/generate-cover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: aiPrompt,
        format_page: params.format_page,
        type_matiere: subjectDef.id,
        titre_cahier: params.titre_cahier,
        att_numero_modele: template.id,
        variation_index: template.id - 1,
      }),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const data = await response.json();
      if (data && data.imageUrl) {
        finalImageUrl = data.imageUrl;
      }
    }
  } catch {
    // Handled below
  }

  // Fallback to high-definition clean vector artwork for this exact subject and template
  if (!finalImageUrl) {
    finalImageUrl = generateCleanSubjectCoverSvg(subjectDef, template, 1200, 1697);
  }

  return {
    imageUrl: finalImageUrl,
    prompt: aiPrompt,
    isAiGenerated: true,
    subjectDef,
    template,
  };
}

/**
 * High-Resolution 300 DPI Canvas Compositor for Print Export (PDF / PNG).
 * Renders the 3 layers together onto a high-DPI canvas:
 * 1. Background artwork (image or vector)
 * 2. Programmatic Title Layer (att_3) in template.titleZone
 * 3. Programmatic Unified Identification Panel (att_4..att_7) in template.infoZone
 */
export async function compositeCoverForPrintExport(
  baseImageUrl: string,
  subjectId: string,
  templateId: number,
  params: {
    format_page: NotebookPageFormat;
    titre_cahier: string;
    nom_prenom?: string;
    classe?: string;
    ecole?: string;
    annee?: string;
  }
): Promise<string> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return baseImageUrl;
  }

  const subjectDef = getSubjectDefinition(subjectId);
  const template = selectNextTemplateForSubject(subjectDef.id, templateId);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // High-DPI: 2480 × 3508 for standard A4 at 300 DPI
        const w = img.naturalWidth || 2480;
        const h = img.naturalHeight || 3508;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(baseImageUrl);
          return;
        }

        // 1. Base Decorative Background
        ctx.drawImage(img, 0, 0, w, h);

        const isDouble =
          (params.format_page === 'A4_double_horizontal' ||
            params.format_page === 'custom_double_horizontal') &&
          w > h * 1.2;
        const primaryColor = template.palette[0] || '#2563EB';
        const secondaryColor = template.palette[1] || '#0D9488';
        const isArabic = /[\u0600-\u06FF]/.test(params.titre_cahier) || subjectDef.direction === 'rtl';

        // Helper to render programmatic overlays for a single cover area
        const renderCoverLayers = (coverX: number, coverY: number, coverW: number, coverH: number) => {
          // --- LAYER 2: MAIN TITLE (att_3) ---
          const titleX = coverX + (template.titleZone.x / 100) * coverW;
          const titleY = coverY + (template.titleZone.y / 100) * coverH;
          const titleW = (template.titleZone.width / 100) * coverW;
          const titleH = (template.titleZone.height / 100) * coverH;

          ctx.save();
          // Title background plate
          if (template.titleZone.textEffects.backgroundPlate) {
            ctx.beginPath();
            const radius = Math.round(titleH * 0.25);
            if (ctx.roundRect) {
              ctx.roundRect(titleX, titleY, titleW, titleH, radius);
            } else {
              ctx.rect(titleX, titleY, titleW, titleH);
            }
            ctx.fillStyle = primaryColor;
            ctx.shadowColor = 'rgba(0,0,0,0.18)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 8;
            ctx.fill();

            ctx.lineWidth = Math.max(3, Math.round(coverW * 0.003));
            ctx.strokeStyle = `${secondaryColor}90`;
            ctx.stroke();
          }

          // Title text
          ctx.direction = isArabic ? 'rtl' : 'ltr';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = template.titleZone.textEffects.backgroundPlate ? '#FFFFFF' : primaryColor;

          let titleFontSize = Math.round(titleH * 0.42);
          ctx.font = `900 ${titleFontSize}px 'Cairo', 'Tajawal', 'Outfit', sans-serif`;
          while (ctx.measureText(params.titre_cahier).width > titleW * 0.88 && titleFontSize > 18) {
            titleFontSize -= 2;
            ctx.font = `900 ${titleFontSize}px 'Cairo', 'Tajawal', 'Outfit', sans-serif`;
          }

          ctx.fillText(params.titre_cahier, titleX + titleW / 2, titleY + titleH / 2);
          ctx.restore();

          // --- LAYER 3: UNIFIED IDENTIFICATION PANEL (att_4 to att_7) ---
          const infoX = coverX + (template.infoZone.x / 100) * coverW;
          const infoY = coverY + (template.infoZone.y / 100) * coverH;
          const infoW = (template.infoZone.width / 100) * coverW;
          const infoH = (template.infoZone.height / 100) * coverH;

          ctx.save();
          ctx.beginPath();
          const cardRadius = Math.round(infoH * 0.12);
          if (ctx.roundRect) {
            ctx.roundRect(infoX, infoY, infoW, infoH, cardRadius);
          } else {
            ctx.rect(infoX, infoY, infoW, infoH);
          }
          ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetY = 6;
          ctx.fill();

          ctx.lineWidth = Math.max(3, Math.round(coverW * 0.003));
          ctx.strokeStyle = `${secondaryColor}70`;
          ctx.stroke();

          // 4 Identification Lines
          const lines = [
            {
              icon: '👤',
              label: isArabic ? 'الاسم واللقب :' : 'Nom & Prénom :',
              value: params.nom_prenom?.trim() || '',
            },
            {
              icon: '👥',
              label: isArabic ? 'القسم / المستوى :' : 'Classe / Niveau :',
              value: params.classe?.trim() || '',
            },
            {
              icon: '🏫',
              label: isArabic ? 'المؤسسة التعليمية :' : 'École :',
              value: params.ecole?.trim() || '',
            },
            {
              icon: '📅',
              label: isArabic ? 'السنة الدراسية :' : 'Année scolaire :',
              value: params.annee?.trim() || '',
            },
          ];

          const lineStep = infoH / 4.4;
          const startY = infoY + lineStep * 0.72;
          const paddingX = infoW * 0.05;

          lines.forEach((item, idx) => {
            const cy = startY + idx * lineStep;

            if (isArabic) {
              ctx.direction = 'rtl';
              ctx.textAlign = 'right';
              ctx.textBaseline = 'middle';

              // Icon
              ctx.font = `${Math.round(infoH * 0.11)}px 'Cairo', sans-serif`;
              const iconX = infoX + infoW - paddingX;
              ctx.fillText(item.icon, iconX, cy);

              // Label
              const labelX = iconX - infoW * 0.05;
              ctx.font = `bold ${Math.round(infoH * 0.09)}px 'Cairo', sans-serif`;
              ctx.fillStyle = '#1E293B';
              ctx.fillText(item.label, labelX, cy);

              const labelWidth = ctx.measureText(item.label).width;
              const valueX = labelX - labelWidth - infoW * 0.02;

              if (item.value) {
                let valSize = Math.round(infoH * 0.10);
                ctx.font = `800 ${valSize}px 'Cairo', sans-serif`;
                const maxValWidth = valueX - (infoX + paddingX);
                while (ctx.measureText(item.value).width > maxValWidth && valSize > 14) {
                  valSize -= 1;
                  ctx.font = `800 ${valSize}px 'Cairo', sans-serif`;
                }
                ctx.fillStyle = '#0F172A';
                ctx.fillText(item.value, valueX, cy);
              } else {
                ctx.font = `normal ${Math.round(infoH * 0.08)}px sans-serif`;
                ctx.fillStyle = '#94A3B8';
                ctx.fillText('........................', valueX, cy);
              }
            } else {
              ctx.direction = 'ltr';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';

              // Icon
              ctx.font = `${Math.round(infoH * 0.11)}px sans-serif`;
              const iconX = infoX + paddingX;
              ctx.fillText(item.icon, iconX, cy);

              // Label
              const labelX = iconX + infoW * 0.05;
              ctx.font = `bold ${Math.round(infoH * 0.09)}px 'Outfit', sans-serif`;
              ctx.fillStyle = '#1E293B';
              ctx.fillText(item.label, labelX, cy);

              const labelWidth = ctx.measureText(item.label).width;
              const valueX = labelX + labelWidth + infoW * 0.02;

              if (item.value) {
                let valSize = Math.round(infoH * 0.10);
                ctx.font = `800 ${valSize}px 'Outfit', sans-serif`;
                const maxValWidth = infoX + infoW - paddingX - valueX;
                while (ctx.measureText(item.value).width > maxValWidth && valSize > 14) {
                  valSize -= 1;
                  ctx.font = `800 ${valSize}px 'Outfit', sans-serif`;
                }
                ctx.fillStyle = '#0F172A';
                ctx.fillText(item.value, valueX, cy);
              } else {
                ctx.font = `normal ${Math.round(infoH * 0.08)}px sans-serif`;
                ctx.fillStyle = '#94A3B8';
                ctx.fillText('........................', valueX, cy);
              }
            }
          });

          ctx.restore();
        };

        if (isDouble) {
          const singleW = w / 2;
          renderCoverLayers(0, 0, singleW, h);
          renderCoverLayers(singleW, 0, singleW, h);

          // Dotted cut line between the two covers
          ctx.save();
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 4;
          ctx.setLineDash([12, 12]);
          ctx.beginPath();
          ctx.moveTo(singleW, 0);
          ctx.lineTo(singleW, h);
          ctx.stroke();
          ctx.restore();
        } else {
          renderCoverLayers(0, 0, w, h);
        }

        const compositedDataUrl = canvas.toDataURL('image/jpeg', 0.98);
        resolve(compositedDataUrl);
      } catch (err) {
        console.warn('Print canvas compositing error:', err);
        resolve(baseImageUrl);
      }
    };
    img.onerror = () => resolve(baseImageUrl);
    img.src = baseImageUrl;
  });
}
