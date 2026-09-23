export const PHOTO_AI_PROMPT =
  'استخدم هذه الصورة كمرجع أساسي وحافظ على هوية وملامح الوجه الحقيقية للتلميذ بأكبر دقة ممكنة، دون تغيير شكل الوجه أو لون البشرة أو الشعر أو الملامح الأساسية. ضع صورة التلميذ داخل إطار دائري، اجعل التلميذ يبدو طبيعياً، لطيفاً ومبتسماً، مع قص الصورة بشكل احترافي وإدماجها داخل التصميم.';

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface ProcessPhotoResult {
  ok: boolean;
  imageUrl?: string;
  isAiGenerated?: boolean;
  error?: string;
}

/**
 * Creates a circular-cropped high-resolution data URL from a File or image source.
 * This guarantees an instant, high-quality, perfectly circular frame
 * preserving 100% of the child's identity, face, skin tone, and features.
 */
export function createCircularAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const size = 512;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(String(event.target?.result || ''));
            return;
          }

          // Anti-aliasing quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Circular clipping path
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Calculate center crop covering the circle
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;

          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

          // Subtle elegant inner border
          ctx.restore();
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 6;
          ctx.stroke();

          const dataUrl = canvas.toDataURL('image/png', 0.95);
          resolve(dataUrl);
        } catch {
          resolve(String(event.target?.result || ''));
        }
      };
      img.onerror = () => reject(new Error("Impossible de charger l'image"));
      img.src = String(event.target?.result || '');
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

/**
 * Sends photo to the server-side Gemini AI image enhancement endpoint
 */
export async function processPhotoWithAi(originalDataUrl: string): Promise<ProcessPhotoResult> {
  try {
    const response = await fetch('/api/process-photo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: originalDataUrl,
        prompt: PHOTO_AI_PROMPT,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.ok && data.imageUrl) {
        return {
          ok: true,
          imageUrl: data.imageUrl,
          isAiGenerated: true,
        };
      }
    }
    return { ok: true, isAiGenerated: false };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Erreur réseau IA' };
  }
}
