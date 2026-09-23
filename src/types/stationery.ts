export type StationeryPaperFormat =
  | 'a4'
  | 'a5'
  | 'letter'
  | 'journal'
  | 'mini_memo'
  | 'square_memo';

export type StationeryPageType =
  | 'lined'
  | 'grid'
  | 'dotted'
  | 'blank'
  | 'checklist'
  | 'daily_planner'
  | 'weekly_planner'
  | 'journal';

export type KawaiiThemeId =
  | 'peachy_dreams'
  | 'hamster_paradise'
  | 'bunny_garden'
  | 'strawberry_milk'
  | 'cloudy_sky'
  | 'little_panda'
  | 'cherry_blossom'
  | 'kitty_cafe'
  | 'ocean_friends'
  | 'little_duck'
  | 'magic_unicorn'
  | 'cozy_study';

export interface KawaiiTheme {
  id: KawaiiThemeId;
  name: string;
  nameFr: string;
  nameAr: string;
  description: string;
  descriptionFr: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  lineColor: string;
  bgTint: string;
  badgeBg: string;
  borderColor: string;
  mascotEmoji: string;
  keywords: string[];
}

export interface MatchingSetOptions {
  includeWritingLined: boolean;
  includeDottedBujo: boolean;
  includeGridMath: boolean;
  includeDailyPlanner: boolean;
  includeWeeklyPlanner: boolean;
  includeMemoCards: boolean;
  includeBookmarks: boolean;
  includeMatchingLabels: boolean;
}

export interface StationeryGeneratorState {
  themeId: KawaiiThemeId;
  paperFormat: StationeryPaperFormat;
  pageType: StationeryPageType;
  orientation: 'portrait' | 'landscape';
  
  // Customization
  title: string;
  subtitle: string;
  userName: string;
  dateText: string;
  
  // Paper ruling config
  lineSpacing: number; // in mm or px (default 8mm)
  lineColor: string;
  lineThickness: number;
  leftMarginLine: boolean;
  gridSize: number; // in mm (default 5mm)
  gridOpacity: number; // 0.1 to 1.0
  dotSpacing: number; // in mm (default 5mm)
  dotSize: number; // in pt/px (default 1.5)
  dotOpacity: number;
  
  // Page elements & layout
  showDecorativeFrame: boolean;
  frameStyle: 'subtle_dots' | 'cute_corner_scallop' | 'double_delicate' | 'dashed_kawaii' | 'none';
  backgroundIllustrationOpacity: number; // 0.05 to 0.4
  showHeader: boolean;
  showFooter: boolean;
  showPageNumbers: boolean;
  pageNumberPrefix: string;
  startPageNumber: number;
  pageCount: number; // for multi-page batch generation (1 to 50)
  
  // Planners & Journal specific
  moodTrackerEnabled: boolean;
  waterIntakeTracker: boolean;
  habitTrackerEnabled: boolean;
  customGoals: string[];
  
  // Digital Stationery / Tablet Export
  isDigitalExportMode: boolean; // Goodnotes / Notability
  digitalTabsEnabled: boolean;
  activeDigitalTab: 'cover' | 'monthly' | 'weekly' | 'daily' | 'notes';
  
  // Print Mode
  printMode: 'home' | 'professional';
  showTrimMarks: boolean;
  bleedMm: number;
  
  // View controls
  zoom: number;
  activePageIndex: number;
  isMatchingSetModalOpen: boolean;
  matchingSetOptions: MatchingSetOptions;
}
