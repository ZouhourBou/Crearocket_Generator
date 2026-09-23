export interface PhotoQualityCheck {
  isValid: boolean;
  warning?: string;
  isTooSmall?: boolean;
  isBlurry?: boolean;
  isLowContrast?: boolean;
}

/**
 * Validates an uploaded image file and returns feedback on dimensions & file size
 */
export async function validatePhotoQuality(file: File): Promise<PhotoQualityCheck> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      isValid: false,
      warning: "Format de fichier non pris en charge. Veuillez choisir une photo JPG, PNG ou WebP.",
    };
  }

  // Check file size (min 20KB, max 25MB)
  if (file.size < 20 * 1024) {
    return {
      isValid: false,
      isTooSmall: true,
      warning: "Cette image semble trop petite ou de très faible résolution. Privilégiez une photo nette d'au moins 800px.",
    };
  }

  if (file.size > 25 * 1024 * 1024) {
    return {
      isValid: false,
      warning: "Fichier volumineux (>25 Mo). Veuillez utiliser une photo compressée ou redimensionnée.",
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      if (width < 350 || height < 350) {
        resolve({
          isValid: true,
          isTooSmall: true,
          warning: "Résolution faible (< 350px). Les contours du coloriage risquent d'être pixélisés à l'impression.",
        });
      } else {
        resolve({ isValid: true });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        warning: "Impossible de lire cette image. Le fichier est peut-être corrompu.",
      });
    };
    img.src = url;
  });
}
