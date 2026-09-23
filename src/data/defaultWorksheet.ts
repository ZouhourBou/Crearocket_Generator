import { WorksheetDocument, WorksheetBlock, WorksheetBlockType } from '../types/worksheet';
import { layoutVerticalFlow } from '../utils/worksheetLayout';

export const DEFAULT_WORKSHEET_FONT = 'Outfit, sans-serif';

export function createDefaultBlock(
  type: WorksheetBlockType,
  x = 60,
  y = 120,
  overrides?: Partial<WorksheetBlock>
): WorksheetBlock {
  const id = `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  switch (type) {
    case 'title':
      return {
        id,
        type: 'title',
        x,
        y,
        width: 674,
        height: 55,
        content: {
          text: 'Titre de la fiche ou évaluation',
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 26,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#0f172a',
          backgroundColor: 'transparent',
          padding: 8,
          borderRadius: 6,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'subtitle':
      return {
        id,
        type: 'subtitle',
        x,
        y,
        width: 674,
        height: 40,
        content: {
          text: 'Sous-titre ou thème pédagogique',
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 17,
          fontWeight: 'normal',
          fontStyle: 'italic',
          textAlign: 'center',
          color: '#475569',
          backgroundColor: 'transparent',
          padding: 6,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'instruction':
      return {
        id,
        type: 'instruction',
        x,
        y,
        width: 674,
        height: 56,
        content: {
          label: 'Consigne :',
          text: 'Lisez attentivement l’énoncé avant de répondre aux questions.',
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          fontWeight: 'normal',
          textAlign: 'left',
          color: '#1e293b',
          backgroundColor: '#f8fafc',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 8,
          padding: 12,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'text':
      return {
        id,
        type: 'text',
        x,
        y,
        width: 674,
        height: 70,
        content: {
          text: 'Cliquez deux fois ou écrivez votre texte ici. Vous pouvez rédiger des consignes, un court texte de lecture, ou un problème.',
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          fontWeight: 'normal',
          textAlign: 'left',
          color: '#334155',
          backgroundColor: 'transparent',
          padding: 8,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'image':
      return {
        id,
        type: 'image',
        x,
        y,
        width: 240,
        height: 180,
        content: {
          src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
          alt: 'Illustration pédagogique',
        },
        styles: {
          borderRadius: 10,
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderStyle: 'solid',
          backgroundColor: '#f1f5f9',
        },
        zIndex: 1,
        ...overrides,
      };

    case 'line':
      return {
        id,
        type: 'line',
        x,
        y,
        width: 674,
        height: 16,
        content: {
          lineStyle: 'solid',
        },
        styles: {
          borderColor: '#94a3b8',
          borderWidth: 2,
          borderStyle: 'solid',
          color: '#94a3b8',
        },
        zIndex: 1,
        ...overrides,
      };

    case 'shape':
      return {
        id,
        type: 'shape',
        x,
        y,
        width: 160,
        height: 100,
        content: {
          shapeType: 'rectangle',
        },
        styles: {
          backgroundColor: '#eff6ff',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderStyle: 'solid',
          borderRadius: 12,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'spacer':
      return {
        id,
        type: 'spacer',
        x,
        y,
        width: 674,
        height: 40,
        content: {},
        styles: {
          backgroundColor: 'transparent',
          borderStyle: 'none',
        },
        zIndex: 1,
        ...overrides,
      };

    case 'answer_zone':
      return {
        id,
        type: 'answer_zone',
        x,
        y,
        width: 674,
        height: 130,
        content: {
          answerType: 'lines',
          lineCount: 4,
          placeholder: 'Zone réservée à la réponse de l’élève…',
        },
        styles: {
          backgroundColor: '#ffffff',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 8,
          padding: 10,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'exercise_header':
      return {
        id,
        type: 'exercise_header',
        x,
        y,
        width: 674,
        height: 38,
        content: {
          exerciseTitle: 'Exercice 1',
          points: '5 points',
          pointsPosition: 'right',
          headerStyle: 'underlined',
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 4,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'fill_in_blanks':
      return {
        id,
        type: 'fill_in_blanks',
        x,
        y,
        width: 674,
        height: 110,
        content: {
          lines: [
            {
              id: `line_${Date.now()}_1`,
              text: '\\frac{8}{5} \\times ___ = \\frac{___}{___}',
            },
            {
              id: `line_${Date.now()}_2`,
              text: '13⁴ \\times 13⁹ = 13^{___}',
            },
            {
              id: `line_${Date.now()}_3`,
              text: '___ \\div 4 = 12',
            },
          ],
          blankStyle: 'solid',
          blankThickness: 1.5,
          blankLengthPreset: 'medium',
          numberingStyle: 'numbers',
          lineSpacing: 10,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          textAlign: 'left',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'qcm_exam':
      return {
        id,
        type: 'qcm_exam',
        x,
        y,
        width: 674,
        height: 160,
        content: {
          optionColumns: 3,
          markerStyle: 'square',
          markerPosition: 'before',
          questionNumberingStyle: 'paren',
          showInstruction: false,
          instructionText: 'Pour chaque question, une seule réponse est correcte. Cochez la bonne case :',
          questions: [
            {
              id: `q_${Date.now()}_1`,
              statement: 'العبارة العددية : 13 − 5 × 13 تساوي',
              options: [
                { id: `opt_${Date.now()}_1`, text: '13¹³' },
                { id: `opt_${Date.now()}_2`, text: '13³⁶' },
                { id: `opt_${Date.now()}_3`, text: '169¹³' },
              ],
            },
            {
              id: `q_${Date.now()}_2`,
              statement: 'العدد 9996 هو مضاعف لـ :',
              options: [
                { id: `opt_${Date.now()}_4`, text: '10⁵' },
                { id: `opt_${Date.now()}_5`, text: '64' },
                { id: `opt_${Date.now()}_6`, text: '3' },
              ],
            },
          ],
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          instructionFontFamily: DEFAULT_WORKSHEET_FONT,
          statementFontFamily: DEFAULT_WORKSHEET_FONT,
          optionFontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          statementFontSize: 15,
          optionFontSize: 14,
          instructionFontSize: 13,
          color: '#0f172a',
          textAlign: 'left',
          backgroundColor: 'transparent',
          textDirection: 'ltr',
          questionSpacing: 12,
          optionSpacing: 8,
          padding: 6,
        },
        zIndex: 1,
        ...overrides,
      };
  }
}

export function createInitialDocument(): WorksheetDocument {
  return {
    id: `doc_${Date.now()}`,
    title: 'Évaluation de Mathématiques - Période 1',
    settings: {
      format: 'A4',
      orientation: 'portrait',
      margins: { top: 50, right: 50, bottom: 50, left: 50 },
      backgroundColor: '#ffffff',
      showMarginGuides: true,
      showGridGuides: false,
      activeLanguage: 'fr',
      defaultTextDirection: 'ltr',
      fontFamily: DEFAULT_WORKSHEET_FONT,
    },
    pages: [
      {
        id: 'page_1',
        pageNumber: 1,
        blocks: layoutVerticalFlow([
          createDefaultBlock('title', 60, 50, {
            width: 674,
            height: 52,
            content: { text: 'Évaluation de Mathématiques' },
            translations: {
              fr: { text: 'Évaluation de Mathématiques' },
              en: { text: 'Mathematics Assessment' },
              ar: { text: 'تقييم في مادة الرياضيات' },
            },
          }),
          createDefaultBlock('instruction', 60, 117, {
            width: 674,
            height: 54,
            content: {
              label: 'Consigne :',
              text: 'Lisez attentivement les consignes ci-dessous et répondez avec soin.',
            },
            translations: {
              fr: {
                label: 'Consigne :',
                text: 'Lisez attentivement les consignes ci-dessous et répondez avec soin.',
              },
              en: {
                label: 'Instruction :',
                text: 'Read the instructions below carefully and answer thoroughly.',
              },
              ar: {
                label: 'تعليمة :',
                text: 'اقرأ التعليمات التالية بانتباه وأجب بعناية.',
              },
            },
          }),
          createDefaultBlock('line', 60, 186, {
            width: 674,
            height: 12,
          }),
          createDefaultBlock('exercise_header', 60, 213, {
            width: 674,
            height: 48,
            content: {
              exerciseTitle: 'Exercice 1',
              text: 'Calcul mental et puissances',
              points: '5 points',
              pointsPosition: 'right',
            },
            translations: {
              fr: {
                exerciseTitle: 'Exercice 1',
                text: 'Calcul mental et puissances',
                points: '5 points',
              },
              en: {
                exerciseTitle: 'Exercise 1',
                text: 'Mental math and powers',
                points: '5 points',
              },
              ar: {
                exerciseTitle: 'تمرين عدد 1',
                text: 'الحساب الذهني والقوى',
                points: '( 5 نقاط )',
              },
            },
          }),
          createDefaultBlock('qcm_exam', 60, 275, {
            width: 674,
            height: 230,
            styles: {
              fontFamily: DEFAULT_WORKSHEET_FONT,
              instructionFontFamily: DEFAULT_WORKSHEET_FONT,
              statementFontFamily: DEFAULT_WORKSHEET_FONT,
              optionFontFamily: DEFAULT_WORKSHEET_FONT,
              textAlign: 'left',
              textDirection: 'ltr',
            },
            content: {
              optionColumns: 3,
              markerStyle: 'box_letter_ar',
              markerPosition: 'before',
              questionNumberingStyle: 'paren',
              showInstruction: true,
              showAnswers: false,
              instructionText: 'Pour chaque question, une seule réponse est correcte. Cochez la bonne case :',
              questions: [
                {
                  id: 'q_demo_1',
                  statement: 'La valeur numérique de 13 − 5 × 13 est égale à :',
                  options: [
                    { id: 'opt_demo_1', text: '13¹³', isCorrect: false },
                    { id: 'opt_demo_2', text: '13³⁶', isCorrect: false },
                    { id: 'opt_demo_3', text: '169¹³', isCorrect: true },
                  ],
                },
                {
                  id: 'q_demo_2',
                  statement: 'L’expression \\sqrt{9} + \\sqrt{16} est égale à :',
                  options: [
                    { id: 'opt_demo_4', text: '7', isCorrect: true },
                    { id: 'opt_demo_5', text: '25', isCorrect: false },
                    { id: 'opt_demo_6', text: '5', isCorrect: false },
                  ],
                },
                {
                  id: 'q_demo_3',
                  statement: 'Les coordonnées du point K sont :',
                  options: [
                    { id: 'opt_demo_7', text: 'K(100 ; 300)', isCorrect: true },
                    { id: 'opt_demo_8', text: 'K(-200 ; 300)', isCorrect: false },
                    { id: 'opt_demo_9', text: 'K(300 ; 100)', isCorrect: false },
                  ],
                },
              ],
            },
            translations: {
              fr: {
                instructionText: 'Pour chaque question, une seule réponse est correcte. Cochez la bonne case :',
                questions: [
                  {
                    id: 'q_demo_1',
                    statement: 'La valeur numérique de 13 − 5 × 13 est égale à :',
                    options: [
                      { id: 'opt_demo_1', text: '13¹³', isCorrect: false },
                      { id: 'opt_demo_2', text: '13³⁶', isCorrect: false },
                      { id: 'opt_demo_3', text: '169¹³', isCorrect: true },
                    ],
                  },
                  {
                    id: 'q_demo_2',
                    statement: 'L’expression \\sqrt{9} + \\sqrt{16} est égale à :',
                    options: [
                      { id: 'opt_demo_4', text: '7', isCorrect: true },
                      { id: 'opt_demo_5', text: '25', isCorrect: false },
                      { id: 'opt_demo_6', text: '5', isCorrect: false },
                    ],
                  },
                  {
                    id: 'q_demo_3',
                    statement: 'Les coordonnées du point K sont :',
                    options: [
                      { id: 'opt_demo_7', text: 'K(100 ; 300)', isCorrect: true },
                      { id: 'opt_demo_8', text: 'K(-200 ; 300)', isCorrect: false },
                      { id: 'opt_demo_9', text: 'K(300 ; 100)', isCorrect: false },
                    ],
                  },
                ],
              },
              ar: {
                instructionText: 'لكل سؤال من الأسئلة التالية إجابة واحدة صحيحة، ضع علامة (×) أمام المقترح الصحيح :',
                questions: [
                  {
                    id: 'q_demo_1',
                    statement: 'العبارة العددية : 13 − 5 × 13 تساوي :',
                    options: [
                      { id: 'opt_demo_1', text: '13¹³', isCorrect: false },
                      { id: 'opt_demo_2', text: '13³⁶', isCorrect: false },
                      { id: 'opt_demo_3', text: '169¹³', isCorrect: true },
                    ],
                  },
                  {
                    id: 'q_demo_2',
                    statement: 'العبارة \\sqrt{9} + \\sqrt{16} تساوي :',
                    options: [
                      { id: 'opt_demo_4', text: '7', isCorrect: true },
                      { id: 'opt_demo_5', text: '25', isCorrect: false },
                      { id: 'opt_demo_6', text: '5', isCorrect: false },
                    ],
                  },
                  {
                    id: 'q_demo_3',
                    statement: 'إحداثيات النقطة K في المعلم هي :',
                    options: [
                      { id: 'opt_demo_7', text: 'K(100 ; 300)', isCorrect: true },
                      { id: 'opt_demo_8', text: 'K(-200 ; 300)', isCorrect: false },
                      { id: 'opt_demo_9', text: 'K(300 ; 100)', isCorrect: false },
                    ],
                  },
                ],
              },
            },
          }),
          createDefaultBlock('answer_zone', 60, 520, {
            width: 674,
            height: 120,
            content: {
              answerType: 'lines',
              lineCount: 4,
              placeholder: 'Écris ici tes calculs et ta phrase réponse…',
            },
            translations: {
              fr: { placeholder: 'Écris ici tes calculs et ta phrase réponse…' },
              en: { placeholder: 'Write your calculations and response sentence here…' },
              ar: { placeholder: 'اكتب هنا حساباتك وجملة الإجابة...' },
            },
          }),
        ], 50, 15),
      },
    ],
  };
}
