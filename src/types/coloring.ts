export type ColoringPaperFormat = 'a4' | 'a5' | 'letter' | 'square';

export type LineThickness = 'thin' | 'medium' | 'thick';
export type DetailLevel = 'simple' | 'balanced' | 'detailed';
export type BackgroundMode = 'remove' | 'simplify' | 'preserve';
export type ColoringDifficulty = 'toddler' | 'kids' | 'advanced';
export type ImageFraming = 'portrait' | 'half_body' | 'full' | 'original';

export type ConversionMode = 'classic' | 'ai';

export interface UploadedPhoto {
  id: string;
  file?: File;
  originalDataUrl: string;
  convertedDataUrl?: string;
  name: string;
  rotation: number; // 0, 90, 180, 270
  cropZoom: number; // 1 to 2
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  status: 'idle' | 'processing' | 'ready' | 'error';
  qualityWarning?: string;
  pageTitle?: string;
}

export interface ColoringBookCoverConfig {
  template: 'magical_stars' | 'jungle_adventure' | 'fairytale' | 'modern_art' | 'sweet_hearts';
  childName: string;
  title: string;
  subtitle?: string;
  age?: string;
  dedication?: string;
  date?: string;
  fontTheme: 'playful' | 'elegant' | 'modern' | 'storybook';
}

export interface ColoringBookState {
  photos: UploadedPhoto[];
  activePhotoIndex: number;
  activeViewIndex: number; // 0: Cover, 1..5: Coloring pages, 6: Dedication
  conversionMode: ConversionMode;
  paperFormat: ColoringPaperFormat;
  lineThickness: LineThickness;
  detailLevel: DetailLevel;
  backgroundMode: BackgroundMode;
  difficulty: ColoringDifficulty;
  framing: ImageFraming;
  showDecorativeFrame: boolean;
  frameStyle: 'playful_stars' | 'floral_delight' | 'cute_doodles' | 'minimalist' | 'none';
  showPageNumbers: boolean;
  showPageTitle: boolean;
  doubleSidedPrint: boolean;
  addBlankReversePages: boolean;
  finalDedicationEnabled: boolean;
  finalDedicationText: string;
  finalDedicationSignoff: string;
  cover: ColoringBookCoverConfig;
  zoom: number;
}
