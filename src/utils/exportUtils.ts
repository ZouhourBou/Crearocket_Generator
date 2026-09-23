import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import confetti from 'canvas-confetti';
import { PaperDimensions } from '../types';

/**
 * Robust cross-browser and iframe file downloader using Blobs and explicit DOM anchoring.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.position = 'fixed';
  link.style.top = '-9999px';
  link.style.left = '-9999px';
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  // Cleanup after browser has triggered the download
  setTimeout(() => {
    try {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Ignored if already detached
    }
  }, 1000);
}

/**
 * Captures the paper sheet container cleanly at authentic 300 DPI without zoom distortions.
 */
async function captureSheetCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  // 1. Ensure all custom web fonts (Outfit, Cairo, Tajawal) are fully loaded before rendering
  if (document.fonts) {
    try {
      await Promise.all([
        document.fonts.load('16px Cairo'),
        document.fonts.load('bold 16px Cairo'),
        document.fonts.load('800 16px Cairo'),
        document.fonts.load('16px Tajawal'),
        document.fonts.load('bold 16px Tajawal'),
        document.fonts.load('16px Outfit'),
        document.fonts.load('bold 16px Outfit'),
        document.fonts.ready,
      ]);
    } catch {
      // Font readiness fallback
    }
  }

  // 2. Temporarily neutralize parent zoom/scale to prevent html2canvas bounding-box clipping
  const parent = element.parentElement;
  const prevTransform = parent ? parent.style.transform : '';
  const prevTransition = parent ? parent.style.transition : '';

  if (parent) {
    parent.style.transition = 'none';
    parent.style.transform = 'none';
  }

  // Allow layout to stabilize
  await new Promise((resolve) => requestAnimationFrame(resolve));

  try {
    // 300 DPI scale calculation: 300 dpi / 25.4 mm/inch = 11.81 px/mm. Sheet DOM is 2.2 px/mm.
    // scale factor = 11.81 / 2.2 = ~5.37
    const targetScale = Math.min(5.37, Math.max(3.5, (300 / 25.4) / 2.2));

    const canvas = await html2canvas(element, {
      scale: targetScale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.offsetWidth,
      height: element.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById('printable-paper-sheet');
        if (clonedEl) {
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.margin = '0';
          if (clonedEl.parentElement) {
            clonedEl.parentElement.style.transform = 'none';
          }

          // Inject targeted style override in cloned document to enforce strictly 0 letter-spacing for Arabic
          // CRITICAL: When letterSpacing !== 0, html2canvas segments text into single graphemes
          // and draws each character via ctx.fillText individually, which completely breaks Arabic cursive ligatures.
          // Zero letter-spacing ensures html2canvas renders complete words with full native font shaping.
          const styleOverride = clonedDoc.createElement('style');
          styleOverride.textContent = `
            [dir="rtl"],
            [dir="rtl"] *,
            .font-arabic,
            .font-arabic * {
              letter-spacing: 0px !important;
              word-spacing: normal !important;
              font-variant-ligatures: normal !important;
              text-rendering: optimizeLegibility !important;
            }
          `;
          clonedDoc.head.appendChild(styleOverride);

          // Deep scan all text nodes containing Arabic characters
          const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
          const walker = clonedDoc.createTreeWalker(clonedEl, NodeFilter.SHOW_TEXT);
          let textNode = walker.nextNode();
          const arabicParents = new Set<HTMLElement>();

          while (textNode) {
            if (arabicRegex.test(textNode.textContent || '')) {
              if (textNode.parentElement) {
                arabicParents.add(textNode.parentElement);
              }
            }
            textNode = walker.nextNode();
          }

          // Apply Arabic typography fixes to all detected elements
          arabicParents.forEach((el) => {
            el.style.setProperty('letter-spacing', '0px', 'important');
            if (!el.style.fontFamily) {
              el.style.setProperty('font-family', "'Cairo', 'Tajawal', system-ui, sans-serif", 'important');
            }
            el.style.setProperty('font-variant-ligatures', 'normal', 'important');
            el.style.setProperty('text-rendering', 'optimizeLegibility', 'important');
            el.style.setProperty('direction', 'rtl', 'important');
            el.setAttribute('dir', 'rtl');
          });

          // Ensure explicit RTL containers have zero letter-spacing
          const rtlContainers = clonedEl.querySelectorAll<HTMLElement>('[dir="rtl"]');
          rtlContainers.forEach((el) => {
            el.style.setProperty('letter-spacing', '0px', 'important');
            el.style.setProperty('font-variant-ligatures', 'normal', 'important');
            el.style.setProperty('text-rendering', 'optimizeLegibility', 'important');
          });
        }
      },
    });

    return canvas;
  } finally {
    // Restore parent zoom instantly
    if (parent) {
      parent.style.transform = prevTransform;
      parent.style.transition = prevTransition;
    }
  }
}

/**
 * Generates and downloads a print-ready PDF containing the exact paper layout.
 */
export async function exportToPdf(
  element: HTMLElement,
  paperDim: PaperDimensions,
  filename: string = 'etiquettes-personnalisees.pdf'
): Promise<void> {
  try {
    const canvas = await captureSheetCanvas(element);
    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    const isLandscape = paperDim.widthMm > paperDim.heightMm;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [paperDim.widthMm, paperDim.heightMm],
      compress: true,
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, paperDim.widthMm, paperDim.heightMm, undefined, 'FAST');

    const pdfBlob = pdf.output('blob');
    downloadBlob(pdfBlob, filename);

    // Optional celebratory feedback
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.85 },
        colors: ['#EA580C', '#2563EB', '#F59E0B', '#10B981'],
      });
    } catch {
      // Confetti is purely decorative
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Generates and downloads a multi-page PDF combining multiple sheet elements.
 */
export async function exportMultiPagePdf(
  elements: HTMLElement[],
  paperDim: PaperDimensions,
  filename: string = 'cahier-activites.pdf'
): Promise<void> {
  if (elements.length === 0) return;
  try {
    const isLandscape = paperDim.widthMm > paperDim.heightMm;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [paperDim.widthMm, paperDim.heightMm],
      compress: true,
    });

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (i > 0) {
        pdf.addPage([paperDim.widthMm, paperDim.heightMm], isLandscape ? 'landscape' : 'portrait');
      }
      const canvas = await captureSheetCanvas(el);
      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      pdf.addImage(imgData, 'JPEG', 0, 0, paperDim.widthMm, paperDim.heightMm, undefined, 'FAST');
    }

    const pdfBlob = pdf.output('blob');
    downloadBlob(pdfBlob, filename);

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.85 },
        colors: ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981'],
      });
    } catch {
      // Confetti is decorative
    }
  } catch (error) {
    console.error('Error generating multi-page PDF:', error);
    throw error;
  }
}

/**
 * Generates and downloads an ultra-crisp 300 DPI PNG containing the complete sheet.
 */
export async function exportToPng(
  element: HTMLElement,
  filename: string = 'etiquettes-personnalisees-300dpi.png'
): Promise<void> {
  try {
    const canvas = await captureSheetCanvas(element);

    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Erreur lors de la génération de l\'image PNG.'));
          return;
        }
        downloadBlob(blob, filename);
        resolve();
      }, 'image/png');
    });

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.85 },
        colors: ['#EA580C', '#3B82F6', '#10B981'],
      });
    } catch {
      // Confetti is decorative
    }
  } catch (error) {
    console.error('Error generating PNG:', error);
    throw error;
  }
}

/**
 * Native direct printing
 */
export function printDirect(): void {
  window.print();
}

