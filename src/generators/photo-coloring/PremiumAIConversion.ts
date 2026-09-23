import { ConversionEngineOptions } from './ClassicConversion';

/**
 * AI Premium Conversion Mode
 * Respects strict safety guidelines:
 * - Checks for server-side AI availability without exposing private API keys to the browser
 * - Gracefully provides clear feedback if server-side AI image-to-image is unavailable
 */
export async function convertPhotoToColoringAI(
  sourceDataUrl: string,
  options: ConversionEngineOptions
): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
  try {
    const res = await fetch('/api/coloring-ai-convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: sourceDataUrl,
        options,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error:
          data.error ||
          "Le service de conversion IA n'est pas configuré sur ce serveur. Le mode de traitement classique haute fidélité (Mode A) est actif et garanti sans dépendance externe.",
      };
    }

    const data = await res.json();
    return {
      success: true,
      dataUrl: data.resultDataUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error:
        "Serveur IA indisponible ou hors-ligne. Le mode de conversion classique avancé (Mode A) s'exécute directement dans votre navigateur avec une netteté optimale.",
    };
  }
}
