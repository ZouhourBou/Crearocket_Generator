/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { GeneratorState, Language } from './types';
import { computeLayout } from './utils/layoutEngine';
import { Header } from './components/Header';
import { HomeGeneratorsCatalog } from './components/HomeGeneratorsCatalog';
import { SchoolLabelsPage } from './components/SchoolLabelsPage';
import { WorksheetPage } from './components/WorksheetPage';
import { HandwritingPage } from './components/handwriting/HandwritingPage';
import { MathWorksheetPage } from './components/math/MathWorksheetPage';
import { GamesPage } from './components/games/GamesPage';
import { AlphabetPage } from './components/alphabet/AlphabetPage';
import { PhotoColoringPage } from './generators/photo-coloring/PhotoColoringPage';
import { KawaiiStationeryPage } from './generators/kawaii-stationery/KawaiiStationeryPage';
import { SchoolPlannerPage } from './generators/school-planner/SchoolPlannerPage';
import { CertificatesPage } from './generators/certificates/CertificatesPage';
import { PersonalizedStorybookPage } from './generators/personalized-storybook/PersonalizedStorybookPage';
import { Footer } from './components/Footer';

const INITIAL_STATE: GeneratorState = {
  type: 'supplies',
  schoolLabelType: 'supplies',
  language: 'fr',
  labelLanguage: 'latin',
  paperFormat: 'A4',
  customPaper: { widthMm: 210, heightMm: 297 },
  labelPreset: '50x10',
  customLabel: { widthMm: 60, heightMm: 20 },
  itemCount: 24,
  coversPerSheet: 2,
  customCover: { widthMm: 194, heightMm: 135 },
  notebookSubject: 'math',
  themeId: 'cute',
  paletteId: 'rose_pastel',
  illustrationId: 'cute',
  illustrationMode: 'icon',
  studentPhotoUrl: undefined,
  studentPhotoAiUrl: undefined,
  isProcessingPhoto: false,
  schoolSubjectDecor: 'none',
  duplicateIconRight: false,
  centerText: false,
  borderRadius: 8,
  info: {
    fullName: '',
    grade: '',
    hasSchool: false,
    schoolName: '',
    hasSubject: false,
    subjectName: '',
    academicYear: '',
  },
  displayOptions: {
    showCutMarks: true,
    showDimensions: false,
    showSafeZone: false,
    zoom: 100,
  },
  pageMargins: {
    enabled: false,
    uniform: true,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export default function App() {
  const [state, setState] = useState<GeneratorState>(INITIAL_STATE);

  // Client-side route handling (supports '/', '/generator/school-labels', '/generator/worksheet-editor', '/generator/handwriting-practice', '/generator/math-worksheets', '/generator/game-puzzles', '/generator/alphabet-learning', '/generator/photo-coloring', '/generator/kawaii-stationery', and '/generator/personalized-storybook')
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('personalized-storybook') || path.includes('storybook') || path.includes('histoire')) {
        return '/generator/personalized-storybook';
      }
      if (path.includes('photo-coloring') || path.includes('coloring-book') || path.includes('coloring')) {
        return '/generator/photo-coloring';
      }
      if (path.includes('school-planner') || path.includes('timetable') || path.includes('emploi-du-temps')) {
        return '/generator/school-planner';
      }
      if (path.includes('certificates') || path.includes('diploma') || path.includes('diplome')) {
        return '/generator/certificates';
      }
      if (path.includes('kawaii') || path.includes('stationery')) {
        return '/generator/kawaii-stationery';
      }
      if (path.includes('alphabet') || path.includes('letter')) {
        return '/generator/alphabet-learning';
      }
      if (path.includes('game') || path.includes('puzzle') || path.includes('sudoku')) {
        return '/generator/game-puzzles';
      }
      if (path.includes('handwriting')) {
        return '/generator/handwriting-practice';
      }
      if (path.includes('math')) {
        return '/generator/math-worksheets';
      }
      if (path.includes('worksheet')) {
        return '/generator/worksheet-editor';
      }
      if (path.includes('school-labels') || path.includes('labels')) {
        return '/generator/school-labels';
      }
      const params = new URLSearchParams(window.location.search);
      const tool = params.get('tool') || params.get('generator');
      if (tool === 'personalized-storybook' || tool === 'storybook' || tool === 'story') {
        return '/generator/personalized-storybook';
      }
      if (tool === 'photo-coloring' || tool === 'coloring' || tool === 'coloring-book') {
        return '/generator/photo-coloring';
      }
      if (tool === 'school-planner' || tool === 'timetable' || tool === 'planners') {
        return '/generator/school-planner';
      }
      if (tool === 'certificates' || tool === 'diplomas' || tool === 'diplome') {
        return '/generator/certificates';
      }
      if (tool === 'kawaii' || tool === 'kawaii-stationery' || tool === 'stationery') {
        return '/generator/kawaii-stationery';
      }
      if (tool === 'alphabet' || tool === 'alphabet-learning' || tool === 'letters') {
        return '/generator/alphabet-learning';
      }
      if (tool === 'game' || tool === 'games' || tool === 'game-puzzles' || tool === 'puzzle') {
        return '/generator/game-puzzles';
      }
      if (tool === 'handwriting' || tool === 'handwriting-practice') {
        return '/generator/handwriting-practice';
      }
      if (tool === 'math' || tool === 'math-worksheets') {
        return '/generator/math-worksheets';
      }
      if (tool === 'school-labels' || tool === 'labels') {
        return '/generator/school-labels';
      }
      if (tool === 'worksheet' || tool === 'worksheet-editor') {
        return '/generator/worksheet-editor';
      }
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('personalized-storybook') || path.includes('storybook') || path.includes('histoire')) {
        setCurrentRoute('/generator/personalized-storybook');
      } else if (path.includes('photo-coloring') || path.includes('coloring-book') || path.includes('coloring')) {
        setCurrentRoute('/generator/photo-coloring');
      } else if (path.includes('school-planner') || path.includes('timetable') || path.includes('emploi-du-temps')) {
        setCurrentRoute('/generator/school-planner');
      } else if (path.includes('certificates') || path.includes('diploma') || path.includes('diplome')) {
        setCurrentRoute('/generator/certificates');
      } else if (path.includes('kawaii') || path.includes('stationery')) {
        setCurrentRoute('/generator/kawaii-stationery');
      } else if (path.includes('alphabet') || path.includes('letter')) {
        setCurrentRoute('/generator/alphabet-learning');
      } else if (path.includes('game') || path.includes('puzzle') || path.includes('sudoku')) {
        setCurrentRoute('/generator/game-puzzles');
      } else if (path.includes('handwriting')) {
        setCurrentRoute('/generator/handwriting-practice');
      } else if (path.includes('math')) {
        setCurrentRoute('/generator/math-worksheets');
      } else if (path.includes('worksheet')) {
        setCurrentRoute('/generator/worksheet-editor');
      } else if (path.includes('school-labels') || path.includes('labels')) {
        setCurrentRoute('/generator/school-labels');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute Layout mathematically based on real millimeters
  const layout = useMemo(() => {
    return computeLayout(
      state.type,
      state.paperFormat,
      state.customPaper,
      state.labelPreset,
      state.customLabel,
      state.itemCount,
      state.coversPerSheet,
      state.customCover,
      state.pageMargins,
      state.labelSpacing,
      state.schoolLabelType,
      state.notebookCoverSizePreset,
      state.notebookCoverCustomDimensions
    );
  }, [
    state.type,
    state.paperFormat,
    state.customPaper,
    state.labelPreset,
    state.customLabel,
    state.itemCount,
    state.coversPerSheet,
    state.customCover,
    state.pageMargins,
    state.labelSpacing,
    state.schoolLabelType,
    state.notebookCoverSizePreset,
    state.notebookCoverCustomDimensions,
  ]);

  const handleLanguageChange = (lang: Language) => {
    setState((prev) => ({
      ...prev,
      language: lang,
    }));
  };

  const isSchoolLabelsRoute = currentRoute === '/generator/school-labels';
  const isWorksheetRoute = currentRoute === '/generator/worksheet-editor';
  const isHandwritingRoute = currentRoute === '/generator/handwriting-practice';
  const isMathRoute = currentRoute === '/generator/math-worksheets';
  const isGamesRoute = currentRoute === '/generator/game-puzzles';
  const isAlphabetRoute = currentRoute === '/generator/alphabet-learning';
  const isPhotoColoringRoute = currentRoute === '/generator/photo-coloring';
  const isKawaiiStationeryRoute = currentRoute === '/generator/kawaii-stationery';
  const isSchoolPlannerRoute = currentRoute === '/generator/school-planner';
  const isCertificatesRoute = currentRoute === '/generator/certificates';
  const isStorybookRoute = currentRoute === '/generator/personalized-storybook';

  // Dedicated workspace for Personalized Storybook Generator
  if (isStorybookRoute) {
    return (
      <PersonalizedStorybookPage
        language={state.language}
        onNavigate={navigate}
      />
    );
  }

  // Dedicated workspace for School Planner & Timetable Generator
  if (isSchoolPlannerRoute) {
    return (
      <SchoolPlannerPage
        language={state.language}
        onNavigate={navigate}
      />
    );
  }

  // Dedicated workspace for Certificates & Diplomas Generator
  if (isCertificatesRoute) {
    return (
      <CertificatesPage
        language={state.language}
        onNavigate={navigate}
      />
    );
  }

  // Dedicated workspace for Photo → Coloring Book Generator
  if (isPhotoColoringRoute) {
    return (
      <PhotoColoringPage
        language={state.language}
        onNavigate={navigate}
      />
    );
  }

  // Dedicated workspace for Cute & Kawaii Stationery Generator
  if (isKawaiiStationeryRoute) {
    return (
      <KawaiiStationeryPage
        language={state.language}
        onNavigate={navigate}
      />
    );
  }

  // Dedicated full-viewport workspace for Alphabet Learning Generator (Booklet & Tracing Studio)
  if (isAlphabetRoute) {
    return (
      <AlphabetPage
        language={state.language}
        onNavigate={navigate}
      />
    );
  }

  // Dedicated full-viewport Shopify-style layout for Worksheet Editor (strict 100vh, zero global scroll)
  if (isWorksheetRoute) {
    return (
      <div className="h-screen w-screen max-h-screen overflow-hidden bg-slate-100 text-slate-900 font-sans flex flex-col">
        <WorksheetPage
          language={state.language}
          onNavigate={navigate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. Global Platform Header with Brand Logo, Breadcrumbs & Language Selector */}
      <Header
        language={state.language}
        onLanguageChange={handleLanguageChange}
        currentRoute={currentRoute}
        onNavigate={navigate}
      />

      {/* 2. Page Routing */}
      {isSchoolLabelsRoute ? (
        /* Dedicated School Labels Generator Page */
        <SchoolLabelsPage
          state={state}
          layout={layout}
          onUpdateState={setState}
          onNavigate={navigate}
          language={state.language}
        />
      ) : isHandwritingRoute ? (
        /* Dedicated Handwriting Practice Generator Page */
        <HandwritingPage
          language={state.language}
          onNavigate={navigate}
        />
      ) : isMathRoute ? (
        /* Dedicated Math Worksheets Generator Page */
        <MathWorksheetPage
          language={state.language}
          onNavigate={navigate}
        />
      ) : isGamesRoute ? (
        /* Dedicated Game & Puzzle Generator Page */
        <GamesPage
          language={state.language}
          onNavigate={navigate}
        />
      ) : (
        /* 1. Official Platform Home: Generator Catalog */
        <main className="flex-1 flex flex-col">
          {/* Catalog: Available Generators (1st) + Coming Soon (2nd) */}
          <HomeGeneratorsCatalog
            language={state.language}
            onNavigate={navigate}
          />
        </main>
      )}

      {/* 3. Global Footer */}
      <Footer language={state.language} />
    </div>
  );
}
