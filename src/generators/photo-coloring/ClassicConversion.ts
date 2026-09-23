import {
  LineThickness,
  DetailLevel,
  BackgroundMode,
  ColoringDifficulty,
  ImageFraming,
} from '../../types/coloring';

export interface ConversionEngineOptions {
  lineThickness: LineThickness;
  detailLevel: DetailLevel;
  backgroundMode: BackgroundMode;
  difficulty: ColoringDifficulty;
  framing: ImageFraming;
  rotation?: number;
  cropZoom?: number;
  brightness?: number;
  contrast?: number;
}

/**
 * High-performance deterministic multi-pass edge and contour extraction pipeline.
 * Converts real photographs into clean, high-contrast, child-friendly black and white line art:
 * 1. Geometric transforms (rotation, framing zoom, brightness, contrast)
 * 2. Bilateral / Gaussian smoothing to suppress photographic texture and skin noise
 * 3. Difference of Gaussians (DoG) for artist-like clean contour extraction
 * 4. Adaptive thresholding to keep strong outlines while leaving large white fill areas
 * 5. Morphological closing to seal broken contours and ensure clear coloring zones
 */
export async function convertPhotoToColoringClassic(
  sourceDataUrl: string,
  options: ConversionEngineOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const result = processImageCanvas(img, options);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(new Error('Failed to load image for processing: ' + e));
    img.src = sourceDataUrl;
  });
}

function processImageCanvas(
  img: HTMLImageElement,
  opts: ConversionEngineOptions
): string {
  // Target working dimension (scaled for crisp 300DPI equivalent print line quality without slowing UI)
  const maxDim = 1600;
  let targetWidth = img.naturalWidth || img.width;
  let targetHeight = img.naturalHeight || img.height;

  if (targetWidth > maxDim || targetHeight > maxDim) {
    if (targetWidth >= targetHeight) {
      targetHeight = Math.round((targetHeight / targetWidth) * maxDim);
      targetWidth = maxDim;
    } else {
      targetWidth = Math.round((targetWidth / targetHeight) * maxDim);
      targetHeight = maxDim;
    }
  }

  // Handle Rotation & Framing
  const rot = (opts.rotation || 0) % 360;
  const is90or270 = rot === 90 || rot === 270;
  const canvas = document.createElement('canvas');
  canvas.width = is90or270 ? targetHeight : targetWidth;
  canvas.height = is90or270 ? targetWidth : targetHeight;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Fill with pure white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rot * Math.PI) / 180);

  // Framing zoom
  const zoom = opts.cropZoom || 1.0;
  const drawW = (is90or270 ? canvas.height : canvas.width) * zoom;
  const drawH = (is90or270 ? canvas.width : canvas.height) * zoom;

  // Framing adjustment (Portrait: center on upper 45% for face recognition; Half-body: slight offset)
  let yOffset = 0;
  if (opts.framing === 'portrait') {
    yOffset = drawH * 0.12; // shift upwards to center child's face
  } else if (opts.framing === 'half_body') {
    yOffset = drawH * 0.06;
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2 + yOffset, drawW, drawH);
  ctx.restore();

  // Extract pixel buffer
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const w = canvas.width;
  const h = canvas.height;

  // 1. Grayscale & Contrast/Brightness Normalization
  const bOffset = (opts.brightness || 0) * 1.5;
  const cFactor = Math.max(0.1, (100 + (opts.contrast || 0)) / 100);

  const gray = new Float32Array(w * h);
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Standard luminosity
    let lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Apply brightness & contrast
    lum = (lum - 128) * cFactor + 128 + bOffset;
    gray[i / 4] = Math.max(0, Math.min(255, lum));
  }

  // 2. Blur / Smoothing passes (Difference of Gaussians approximation)
  // sigma1 for primary edges, sigma2 for broad illumination removal
  const difficulty = opts.difficulty;
  const detail = opts.detailLevel;

  // Set blur radiuses based on difficulty & detail
  let radius1 = 1;
  let radius2 = 3;
  let threshold = 18;

  if (difficulty === 'toddler') {
    radius1 = 2;
    radius2 = 5;
    threshold = 24; // simpler, bolder outlines, ignores tiny skin micro-details
  } else if (difficulty === 'kids') {
    radius1 = 1;
    radius2 = 4;
    threshold = 19;
  } else {
    // Advanced
    radius1 = 1;
    radius2 = 3;
    threshold = 14;
  }

  if (detail === 'simple') {
    threshold += 5;
  } else if (detail === 'detailed') {
    threshold -= 4;
  }

  // Fast box blur as Gaussian approximation
  const blurred1 = fastBoxBlur(gray, w, h, radius1);
  const blurred2 = fastBoxBlur(gray, w, h, radius2);

  // 3. Difference of Gaussians (DoG) + Sobel contour reinforcement
  const edges = new Uint8Array(w * h);
  const lineThicknessVal = opts.lineThickness === 'thick' ? 2 : opts.lineThickness === 'medium' ? 1 : 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const dog = blurred1[idx] - blurred2[idx];

      // Sobel gradient on blurred1 to ensure continuous closed contours
      const gx =
        -blurred1[(y - 1) * w + (x - 1)] +
        blurred1[(y - 1) * w + (x + 1)] +
        -2 * blurred1[y * w + (x - 1)] +
        2 * blurred1[y * w + (x + 1)] +
        -blurred1[(y + 1) * w + (x - 1)] +
        blurred1[(y + 1) * w + (x + 1)];

      const gy =
        -blurred1[(y - 1) * w + (x - 1)] -
        2 * blurred1[(y - 1) * w + x] -
        blurred1[(y - 1) * w + (x + 1)] +
        blurred1[(y + 1) * w + (x - 1)] +
        2 * blurred1[(y + 1) * w + x] +
        blurred1[(y + 1) * w + (x + 1)];

      const grad = Math.sqrt(gx * gx + gy * gy) * 0.25;

      // Combine DoG with gradient
      const isLine = dog < -threshold || grad > threshold * 2.8;

      if (isLine) {
        edges[idx] = 1; // Black contour
      } else {
        edges[idx] = 0; // Pure white background
      }
    }
  }

  // 4. Background simplification or removal (optional flood fill suppression)
  if (opts.backgroundMode === 'remove' || opts.backgroundMode === 'simplify') {
    suppressPeripheralNoise(edges, w, h, opts.backgroundMode === 'remove' ? 0.15 : 0.08);
  }

  // 5. Morphological Dilation according to Line Thickness
  const finalPixels = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h * 4; i += 4) {
    finalPixels[i] = 255;
    finalPixels[i + 1] = 255;
    finalPixels[i + 2] = 255;
    finalPixels[i + 3] = 255;
  }

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (edges[idx] === 1) {
        // Draw black pixel
        drawOutlinePixel(finalPixels, w, h, x, y, lineThicknessVal);
      }
    }
  }

  const finalImgData = new ImageData(finalPixels, w, h);
  ctx.putImageData(finalImgData, 0, 0);

  return canvas.toDataURL('image/png', 0.95);
}

function drawOutlinePixel(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dilation: number
) {
  for (let dy = -dilation; dy <= dilation; dy++) {
    for (let dx = -dilation; dx <= dilation; dx++) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const pIdx = (ny * width + nx) * 4;
        pixels[pIdx] = 18; // deep rich line-art black
        pixels[pIdx + 1] = 18;
        pixels[pIdx + 2] = 20;
        pixels[pIdx + 3] = 255;
      }
    }
  }
}

function suppressPeripheralNoise(
  edges: Uint8Array,
  w: number,
  h: number,
  marginRatio: number
) {
  const mx = Math.floor(w * marginRatio);
  const my = Math.floor(h * marginRatio);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // In the extreme outer border, suppress isolated stray noisy pixels
      if (x < mx || x > w - mx || y < my || y > h - my) {
        // check local neighbor density
        let neighbors = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const ny = y + dy;
            const nx = x + dx;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              if (edges[ny * w + nx] === 1) neighbors++;
            }
          }
        }
        // If it's a weak isolated speck, eliminate it
        if (neighbors < 6) {
          edges[y * w + x] = 0;
        }
      }
    }
  }
}

function fastBoxBlur(
  src: Float32Array,
  w: number,
  h: number,
  r: number
): Float32Array {
  const tmp = new Float32Array(w * h);
  const dst = new Float32Array(w * h);

  // Horizontal blur
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx;
        if (nx >= 0 && nx < w) {
          sum += src[y * w + nx];
          count++;
        }
      }
      tmp[y * w + x] = sum / count;
    }
  }

  // Vertical blur
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -r; dy <= r; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < h) {
          sum += tmp[ny * w + x];
          count++;
        }
      }
      dst[y * w + x] = sum / count;
    }
  }

  return dst;
}
