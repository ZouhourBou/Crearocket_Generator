import {
  WorksheetDocument,
  WorksheetBlock,
  WorksheetBlockType,
  CURRENT_SCHEMA_VERSION,
} from '../types/worksheet';
import { layoutVerticalFlow } from '../utils/worksheetLayout';

export const DEFAULT_WORKSHEET_FONT = 'Outfit, sans-serif';

export function createDefaultChildBlock(
  type: 'rich_text' | 'answer_lines' | 'separator' | 'title',
  isRtl = false,
  overrides?: Partial<WorksheetBlock>
): WorksheetBlock {
  const id = `child_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const defaultFont = isRtl ? 'Cairo, sans-serif' : DEFAULT_WORKSHEET_FONT;
  const dir = isRtl ? 'rtl' : 'ltr';
  const align = isRtl ? 'right' : 'left';

  switch (type) {
    case 'rich_text':
      return {
        id,
        type: 'rich_text',
        x: 0,
        y: 0,
        width: 650,
        height: 44,
        content: {
          variant: overrides?.content?.variant || 'paragraph',
          label:
            overrides?.content?.variant === 'instruction'
              ? isRtl
                ? 'تعليمة :'
                : 'Consigne :'
              : undefined,
          text:
            overrides?.content?.text ??
            (isRtl
              ? '1) احسب وبسّط العبارة التالية : $A = \\frac{3}{4} + \\frac{5}{4}$'
              : '1) Calculer et simplifier l’expression suivante : $A = \\frac{3}{4} + \\frac{5}{4}$.'),
          ...overrides?.content,
        },
        styles: {
          fontFamily: defaultFont,
          fontSize: 15,
          fontWeight: 'normal',
          textAlign: align,
          textDirection: dir,
          color: '#1e293b',
          backgroundColor: 'transparent',
          padding: 4,
          ...overrides?.styles,
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'answer_lines': {
      const lineCount = overrides?.content?.lineCount ?? 3;
      const lineSpacing = overrides?.content?.lineSpacing ?? 32;
      return {
        id,
        type: 'answer_lines',
        x: 0,
        y: 0,
        width: 650,
        height: Math.max(36, lineCount * lineSpacing + 8),
        content: {
          answerType: 'lines',
          lineCount,
          lineSpacing,
          lineStyle: 'dotted',
          placeholder: isRtl ? 'مكان مخصص لإجابة التلميذ...' : 'Zone de réponse élève…',
          ...overrides?.content,
        },
        styles: {
          backgroundColor: 'transparent',
          borderColor: '#94a3b8',
          borderWidth: 0,
          borderStyle: 'none',
          padding: 4,
          ...overrides?.styles,
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };
    }

    case 'separator': {
      const mode = overrides?.content?.separatorMode || 'line';
      const spacerH = overrides?.content?.spacerHeight || 20;
      return {
        id,
        type: 'separator',
        x: 0,
        y: 0,
        width: 650,
        height: mode === 'space' ? spacerH : 16,
        content: {
          separatorMode: mode,
          lineStyle: 'solid',
          spacerHeight: spacerH,
          ...overrides?.content,
        },
        styles: {
          borderColor: '#cbd5e1',
          borderWidth: 1,
          borderStyle: 'solid',
          backgroundColor: 'transparent',
          ...overrides?.styles,
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };
    }

    case 'title':
      return {
        id,
        type: 'title',
        x: 0,
        y: 0,
        width: 650,
        height: 40,
        content: {
          text: isRtl ? 'الجزء الأول' : 'Partie A',
          ...overrides?.content,
        },
        styles: {
          fontFamily: defaultFont,
          fontSize: 17,
          fontWeight: 'bold',
          textAlign: align,
          textDirection: dir,
          color: '#0f172a',
          padding: 4,
          ...overrides?.styles,
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };
  }
}

export function createDefaultBlock(
  type: WorksheetBlockType,
  x = 50,
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
        width: 694,
        height: 54,
        content: {
          text: 'Titre de la fiche ou évaluation',
          titleNumbering: 'none',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          textDirection: 'auto',
          color: '#0f172a',
          backgroundColor: 'transparent',
          padding: 8,
          borderRadius: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          keepWithNext: true,
        },
        ...overrides,
      };

    case 'rich_text':
    case 'text': {
      const variant = overrides?.content?.variant || 'paragraph';
      const isInstruction = variant === 'instruction';
      const isSubtitle = variant === 'subtitle';
      const isCallout = variant === 'callout';

      return {
        id,
        type: 'rich_text',
        x,
        y,
        width: 694,
        height: isSubtitle ? 42 : 64,
        content: {
          variant,
          label: isInstruction ? 'Consigne :' : isCallout ? 'À retenir :' : undefined,
          text: isInstruction
            ? 'Lisez attentivement l’énoncé avant de répondre aux questions.'
            : isSubtitle
            ? 'Sous-titre ou thème de la séance'
            : 'Cliquez pour rédiger votre texte, une consigne ou une question avec formules mathématiques comme $\\frac{a}{b}$ ou $x^2$.',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: isSubtitle ? 17 : 15,
          fontWeight: isSubtitle ? 'bold' : 'normal',
          fontStyle: isSubtitle ? 'italic' : 'normal',
          textAlign: isSubtitle ? 'center' : 'left',
          textDirection: 'auto',
          color: isSubtitle ? '#475569' : '#1e293b',
          backgroundColor: isInstruction || isCallout ? '#f8fafc' : 'transparent',
          borderColor: isInstruction || isCallout ? '#cbd5e1' : 'transparent',
          borderWidth: isInstruction || isCallout ? 1 : 0,
          borderStyle: isInstruction || isCallout ? 'solid' : 'none',
          borderRadius: 8,
          padding: isInstruction || isCallout ? 10 : 8,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };
    }

    case 'subtitle':
      return createDefaultBlock('rich_text', x, y, {
        ...overrides,
        content: {
          variant: 'subtitle',
          text: 'Sous-titre ou thème pédagogique',
          ...overrides?.content,
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
          ...overrides?.styles,
        },
      });

    case 'instruction':
      return createDefaultBlock('rich_text', x, y, {
        ...overrides,
        content: {
          variant: 'instruction',
          label: 'Consigne :',
          text: 'Lisez attentivement l’énoncé avant de répondre aux questions.',
          ...overrides?.content,
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
          padding: 10,
          ...overrides?.styles,
        },
      });

    case 'exercise': {
      const exNum = overrides?.content?.exerciseNumber || 1;
      const isRtl =
        overrides?.styles?.textDirection === 'rtl' || overrides?.styles?.languageMode === 'ar';
      const defaultChildren: WorksheetBlock[] = overrides?.children || [
        createDefaultChildBlock('rich_text', isRtl, {
          content: {
            variant: 'paragraph',
            text: isRtl
              ? '1) احسب وبسّط العبارة التالية : $A = \\frac{7}{3} - \\frac{2}{3} \\times 4$'
              : '1) Calculer et donner le résultat sous forme irréductible : $A = \\frac{7}{3} - \\frac{2}{3} \\times 4$.',
          },
        }),
        createDefaultChildBlock('answer_lines', isRtl, {
          content: {
            answerType: 'lines',
            lineCount: 3,
            lineSpacing: 30,
            lineStyle: 'dotted',
          },
        }),
        createDefaultChildBlock('rich_text', isRtl, {
          content: {
            variant: 'paragraph',
            text: isRtl
              ? '2) حل في $\\mathbb{R}$ المعادلة التالية : $2x + 5 = 13$'
              : '2) Résoudre dans $\\mathbb{R}$ l’équation suivante : $2x + 5 = 13$.',
          },
        }),
        createDefaultChildBlock('answer_lines', isRtl, {
          content: {
            answerType: 'lines',
            lineCount: 2,
            lineSpacing: 30,
            lineStyle: 'dotted',
          },
        }),
      ];

      return {
        id,
        type: 'exercise',
        x,
        y,
        width: 694,
        height: 270,
        children: defaultChildren,
        content: {
          exerciseNumber: exNum,
          numberingStyle: 'exercice_n',
          exerciseTitle: isRtl ? `تمرين عدد ${exNum}` : `Exercice N° ${exNum}`,
          points: isRtl ? '4 نقاط' : '4 points',
          showPoints: true,
          pointsPosition: isRtl ? 'left' : 'right',
          headerStyle: 'underlined',
          showInstruction: false,
          instructionText: isRtl
            ? 'أجب بدقة عن الأسئلة التالية مع تعليل مراحل الحساب.'
            : 'Répondez avec précision aux questions suivantes en détaillant vos étapes.',
          ...overrides?.content,
        },
        styles: {
          fontFamily: isRtl ? 'Cairo, sans-serif' : DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: isRtl ? 'rtl' : 'ltr',
          padding: 10,
          spacing: 8,
          borderRadius: 8,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };
    }

    case 'answer_lines':
    case 'answer_zone': {
      const lineCount = overrides?.content?.lineCount ?? 4;
      const lineSpacing = overrides?.content?.lineSpacing ?? 32;
      const answerType = overrides?.content?.answerType || 'lines';
      const computedHeight =
        answerType === 'box'
          ? overrides?.height || 110
          : Math.max(36, lineCount * lineSpacing + 12);

      return {
        id,
        type: 'answer_lines',
        x,
        y,
        width: 694,
        height: computedHeight,
        content: {
          answerType,
          lineCount,
          lineSpacing,
          lineStyle: overrides?.content?.lineStyle || 'dotted',
          placeholder: 'Zone réservée à la réponse de l’élève…',
          ...overrides?.content,
        },
        styles: {
          backgroundColor: 'transparent',
          borderColor: '#94a3b8',
          borderWidth: 0,
          borderStyle: 'none',
          borderRadius: 6,
          padding: 4,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };
    }

    case 'separator':
    case 'line':
    case 'spacer': {
      const isSpace =
        type === 'spacer' || overrides?.content?.separatorMode === 'space';
      const spacerHeight = overrides?.content?.spacerHeight || overrides?.height || 28;
      return {
        id,
        type: 'separator',
        x,
        y,
        width: 694,
        height: isSpace ? spacerHeight : 18,
        content: {
          separatorMode: isSpace ? 'space' : 'line',
          lineStyle: overrides?.content?.lineStyle || 'solid',
          spacerHeight,
          ...overrides?.content,
        },
        styles: {
          borderColor: '#94a3b8',
          borderWidth: 1.5,
          borderStyle: (overrides?.content?.lineStyle as any) || 'solid',
          color: '#94a3b8',
          backgroundColor: 'transparent',
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };
    }

    case 'exercise_header':
      return {
        id,
        type: 'exercise_header',
        x,
        y,
        width: 694,
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
        width: 694,
        height: 110,
        content: {
          lines: [
            {
              id: `line_${Date.now()}_1`,
              text: '\\frac{8}{5} \\times ___ = \\frac{___}{___}',
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
        width: 694,
        height: 185,
        content: {
          optionColumns: 3,
          selectionMode: 'single',
          markerStyle: 'square',
          markerPosition: 'before',
          questionNumberingStyle: 'paren',
          showInstruction: false,
          questions: [],
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          textAlign: 'left',
          backgroundColor: 'transparent',
          textDirection: 'ltr',
          padding: 6,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'exam_header':
      return {
        id,
        type: 'exam_header',
        x,
        y,
        width: 694,
        height: 110,
        content: {
          headerPreset: 'classic',
          schoolName: 'Collège Pilote',
          teacherName: 'Professeur : ..............',
          subjectName: 'Matière : Mathématiques',
          testTitle: 'Devoir de Contrôle N°1',
          classGrade: 'Classe : 4ème / 3ème',
          academicYear: 'Année scolaire : 2023 - 2024',
          testDate: 'Date : ..............',
          durationText: 'Durée : 45 min',
          maxScore: 20,
          showStudentArea: true,
          showScoreArea: true,
          showDuration: true,
          headerBorderStyle: 'boxed',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 14,
          color: '#0f172a',
          backgroundColor: '#ffffff',
          textDirection: 'auto',
          padding: 8,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'info_box':
      return {
        id,
        type: 'info_box',
        x,
        y,
        width: 694,
        height: 80,
        content: {
          infoBoxType: 'reminder',
          infoBoxTitle: 'Rappel important',
          text: 'Pour tous réels $a$ et $b$ : $(a+b)^2 = a^2 + 2ab + b^2$',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 14,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 8,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'qcm':
      return {
        id,
        type: 'qcm',
        x,
        y,
        width: 694,
        height: 120,
        content: {
          qcmStatement: 'Choisir la bonne réponse : l’inverse de $2,5$ est égal à :',
          qcmLayout: 'vertical',
          qcmCheckboxStyle: 'square',
          qcmSelectionMode: 'single',
          qcmOptions: [
            { id: `opt_${Date.now()}_1`, text: '$0,4$', isCorrect: true },
            { id: `opt_${Date.now()}_2`, text: '$-2,5$', isCorrect: false },
            { id: `opt_${Date.now()}_3`, text: '$\\frac{1}{25}$', isCorrect: false },
          ],
          points: '1 pt',
          questionNumber: '1',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'true_false':
      return {
        id,
        type: 'true_false',
        x,
        y,
        width: 694,
        height: 48,
        content: {
          tfStatement: 'Si $x = 3$, alors $2x + 1 = 7$.',
          trueLabel: 'Vrai',
          falseLabel: 'Faux',
          correctAnswer: 'true',
          points: '0.5 pt',
          questionNumber: '1',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'short_answer':
      return {
        id,
        type: 'short_answer',
        x,
        y,
        width: 694,
        height: 48,
        content: {
          shortAnswerQuestion: 'Quel est le plus petit nombre premier ?',
          shortAnswerLayout: 'inline',
          shortAnswerLineWidth: 'medium',
          shortAnswerLineStyle: 'dotted',
          points: '1 pt',
          questionNumber: '1',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'long_answer':
      return {
        id,
        type: 'long_answer',
        x,
        y,
        width: 694,
        height: 120,
        content: {
          longAnswerQuestion: 'Démontrer que le triangle $ABC$ est rectangle en $A$ :',
          lineCount: 3,
          lineSpacing: 28,
          lineStyle: 'dotted',
          points: '2 pts',
          questionNumber: '1',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'fill_blank':
      return {
        id,
        type: 'fill_blank',
        x,
        y,
        width: 694,
        height: 48,
        content: {
          text: 'Compléter par ce qui convient : l’inverse de $\\frac{5}{2}$ est .......... et son opposé est ..........',
          points: '1 pt',
          questionNumber: '1',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'matching':
      return {
        id,
        type: 'matching',
        x,
        y,
        width: 694,
        height: 160,
        content: {
          matchingLeft: [
            { id: 'l1', text: 'Triangle équilatéral' },
            { id: 'l2', text: 'Carré' },
            { id: 'l3', text: 'Cercle' },
          ],
          matchingRight: [
            { id: 'r1', text: '4 côtés égaux et 4 angles droits' },
            { id: 'r2', text: 'Aucun côté' },
            { id: 'r3', text: '3 côtés de même longueur' },
          ],
          matchingDisplayMode: 'lines',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 14,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'ordering':
      return {
        id,
        type: 'ordering',
        x,
        y,
        width: 694,
        height: 90,
        content: {
          orderingItems: [
            { id: 'it_1', text: '$\\frac{3}{4}$' },
            { id: 'it_2', text: '$-2,5$' },
            { id: 'it_3', text: '$\\sqrt{9}$' },
            { id: 'it_4', text: '$0,75$' },
          ],
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 14,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'table':
      return {
        id,
        type: 'table',
        x,
        y,
        width: 694,
        height: 120,
        content: {
          tableBorderStyle: 'all',
          tableRowsData: [
            {
              id: 'r_1',
              cells: [
                { id: 'c_1_1', text: '$x$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
                { id: 'c_1_2', text: '$-2$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
                { id: 'c_1_3', text: '$0$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
                { id: 'c_1_4', text: '$3$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
              ],
            },
            {
              id: 'r_2',
              cells: [
                { id: 'c_2_1', text: '$f(x) = 2x + 1$', isHeader: true, align: 'center', backgroundColor: '#f8fafc' },
                { id: 'c_2_2', text: '$-3$', align: 'center' },
                { id: 'c_2_3', text: '........', align: 'center' },
                { id: 'c_2_4', text: '........', align: 'center' },
              ],
            },
          ],
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 14,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'answer_box':
      return {
        id,
        type: 'answer_box',
        x,
        y,
        width: 694,
        height: overrides?.content?.answerBoxHeight || 100,
        content: {
          answerBoxTitle: overrides?.content?.answerBoxTitle ?? 'Cadre de réponse ou calcul',
          answerBoxHeight: overrides?.content?.answerBoxHeight || 100,
          answerBoxBorder: true,
          answerBoxBorderStyle: 'solid',
          answerBoxPattern: 'blank',
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 14,
          color: '#0f172a',
          backgroundColor: '#ffffff',
          textDirection: 'auto',
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'columns':
      return {
        id,
        type: 'columns',
        x,
        y,
        width: 694,
        height: 140,
        content: {
          columnsPreset: '50_50',
          columnsGap: 16,
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 14,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'auto',
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        ...overrides,
      };

    case 'blank_space':
      return createDefaultBlock('separator', x, y, {
        ...overrides,
        content: {
          separatorMode: 'space',
          spacerHeight: overrides?.content?.spacerHeight || 36,
          ...overrides?.content,
        },
      });

    case 'question':
      return {
        id,
        type: 'question',
        x,
        y,
        width: 694,
        height: 140,
        content: {
          points: 2,
          questionData: {
            id: `q_${Date.now()}`,
            type: 'open_question',
            numberLabel: '1)',
            statement: 'Calculer et simplifier l’expression $A = \\frac{3}{4} + \\frac{5}{4}$.',
            points: 2,
            answerType: 'lines',
            answerLines: 2,
          },
          ...overrides?.content,
        },
        styles: {
          fontFamily: DEFAULT_WORKSHEET_FONT,
          fontSize: 15,
          color: '#0f172a',
          backgroundColor: 'transparent',
          textDirection: 'ltr',
          padding: 6,
          ...overrides?.styles,
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
        width: 694,
        height: 240,
        content: {
          src: '',
          alt: 'Illustration pédagogique',
          imageWidthPercent: 80,
          imageAlignment: 'center',
          fitMode: 'contain',
          aspectRatioLocked: true,
          showCaption: true,
          captionText: 'Figure 1 — Illustration',
          ...overrides?.content,
        },
        styles: {
          backgroundColor: '#f8fafc',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          ...overrides?.styles,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'geometry_figure':
      return {
        id,
        type: 'geometry_figure',
        x,
        y,
        width: 694,
        height: 260,
        content: {
          geometryData: {
            points: [
              { id: 'p_A', label: 'A', x: 100, y: 190, showLabel: true },
              { id: 'p_B', label: 'B', x: 400, y: 190, showLabel: true },
              { id: 'p_C', label: 'C', x: 100, y: 50, showLabel: true },
            ],
            segments: [
              { id: 's_AB', from: 'p_A', to: 'p_B', style: 'solid', lengthLabel: '6 cm', showLength: true },
              { id: 's_AC', from: 'p_A', to: 'p_C', style: 'solid', lengthLabel: '4 cm', showLength: true },
              { id: 's_BC', from: 'p_B', to: 'p_C', style: 'solid', lengthLabel: '7,2 cm', showLength: true },
            ],
            circles: [],
            angles: [{ id: 'ang_A', vertex: 'p_A', arm1: 'p_B', arm2: 'p_C', isRightAngle: true }],
            figureHeight: 240,
            showGrid: false,
            caption: 'Triangle ABC rectangle en A',
          },
          ...overrides?.content,
        },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 4,
          ...overrides?.styles,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'coordinate_system':
      return {
        id,
        type: 'coordinate_system',
        x,
        y,
        width: 694,
        height: 300,
        content: {
          graphData: {
            xMin: -5,
            xMax: 5,
            yMin: -4,
            yMax: 5,
            step: 1,
            showGrid: true,
            showAxes: true,
            showAxisLabels: true,
            showNumbers: true,
            xAxisLabel: 'x',
            yAxisLabel: 'y',
            points: [
              { id: 'gp_A', label: 'A(2, 3)', x: 2, y: 3, color: '#4f46e5' },
              { id: 'gp_B', label: 'B(-2, 1)', x: -2, y: 1, color: '#dc2626' },
            ],
            segments: [{ id: 'gs_AB', from: 'gp_A', to: 'gp_B', style: 'solid', color: '#1e293b' }],
            functions: [
              { id: 'fn_1', expression: '0.5*x + 1', label: 'f(x) = 0,5x + 1', color: '#0284c7', style: 'solid' },
            ],
            graphHeight: 280,
            caption: 'Repère orthogonal (O, I, J)',
          },
          ...overrides?.content,
        },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 4,
          ...overrides?.styles,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'number_line':
      return {
        id,
        type: 'number_line',
        x,
        y,
        width: 694,
        height: 110,
        content: {
          numberLineData: {
            min: 0,
            max: 10,
            step: 1,
            subdivisions: 2,
            arrowEnd: true,
            arrowStart: false,
            showNumbers: true,
            showOriginZero: true,
            points: [
              { id: 'pt_1', value: 3, label: 'A', color: '#4f46e5', style: 'dot', showLabel: true },
              { id: 'pt_2', value: 7.5, label: 'B', color: '#dc2626', style: 'cross', showLabel: true },
            ],
            studentCompletionMode: false,
            blankIndices: [2, 5, 8],
            lineHeight: 90,
            caption: 'Graduation régulière',
          },
          ...overrides?.content,
        },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 6,
          ...overrides?.styles,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'construction_area':
      return {
        id,
        type: 'construction_area',
        x,
        y,
        width: 694,
        height: 220,
        content: {
          constructionData: {
            height: 220,
            backgroundType: 'square_grid',
            gridSize: 20,
            borderStyle: 'solid',
            borderColor: '#94a3b8',
            instructionHint: 'Zone de tracé & construction géométrique réservée à l’élève',
          },
          ...overrides?.content,
        },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 4,
          ...overrides?.styles,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'diagram':
      return {
        id,
        type: 'diagram',
        x,
        y,
        width: 694,
        height: 220,
        content: {
          diagramData: {
            nodes: [
              { id: 'node_1', x: 60, y: 70, width: 130, height: 46, label: 'Hypothèse', shape: 'rounded', fillColor: '#f1f5f9', strokeColor: '#64748b' },
              { id: 'node_2', x: 260, y: 70, width: 140, height: 46, label: 'Propriété / Règle', shape: 'box', fillColor: '#eff6ff', strokeColor: '#3b82f6' },
              { id: 'node_3', x: 470, y: 70, width: 130, height: 46, label: 'Conclusion', shape: 'rounded', fillColor: '#f0fdf4', strokeColor: '#22c55e' },
            ],
            connectors: [
              { id: 'conn_1_2', fromNodeId: 'node_1', toNodeId: 'node_2', arrowEnd: true },
              { id: 'conn_2_3', fromNodeId: 'node_2', toNodeId: 'node_3', arrowEnd: true },
            ],
            diagramHeight: 200,
            caption: 'Schéma séquentiel',
          },
          ...overrides?.content,
        },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 4,
          ...overrides?.styles,
        },
        zIndex: 1,
        ...overrides,
      };

    case 'image_annotation':
      return {
        id,
        type: 'image_annotation',
        x,
        y,
        width: 694,
        height: 280,
        content: {
          annotationData: {
            src: '',
            alt: 'Schéma à annoter',
            mode: 'student_exercise',
            markerStyle: 'number',
            markers: [
              { id: 'm_1', index: 1, xPercent: 35, yPercent: 40, label: 'Sommet A', expectedAnswer: 'Sommet' },
              { id: 'm_2', index: 2, xPercent: 65, yPercent: 80, label: 'Base BC', expectedAnswer: 'Base' },
            ],
            caption: 'Schéma à annoter par l’élève',
          },
          ...overrides?.content,
        },
        styles: {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          padding: 4,
          ...overrides?.styles,
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
        width: 694,
        height: 100,
        content: {
          shapeData: {
            shapeKind: 'rounded_rectangle',
            strokeColor: '#3b82f6',
            strokeWidth: 2,
            strokeStyle: 'solid',
            fillColor: '#eff6ff',
          },
          ...overrides?.content,
        },
        styles: {
          backgroundColor: 'transparent',
          padding: 4,
          ...overrides?.styles,
        },
        zIndex: 1,
        ...overrides,
      };
  }
}

export function createInitialDocument(): WorksheetDocument {
  return {
    id: `doc_${Date.now()}`,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    title: 'Devoir de Contrôle N°1 — Mathématiques',
    settings: {
      format: 'A4',
      orientation: 'portrait',
      margins: { top: 45, right: 50, bottom: 45, left: 50 },
      backgroundColor: '#ffffff',
      showMarginGuides: true,
      showGridGuides: false,
      activeLanguage: 'fr',
      defaultTextDirection: 'ltr',
      fontFamily: DEFAULT_WORKSHEET_FONT,
      showPageNumber: true,
      blockGap: 14,
    },
    pages: [
      {
        id: 'page_1',
        pageNumber: 1,
        blocks: layoutVerticalFlow(
          [
            createDefaultBlock('title', 50, 45, {
              width: 694,
              height: 50,
              content: {
                text: 'Devoir de Contrôle N°1 — Mathématiques',
                titleNumbering: 'none',
              },
              translations: {
                fr: { text: 'Devoir de Contrôle N°1 — Mathématiques' },
                en: { text: 'Mathematics Assessment N°1' },
                ar: { text: 'فرض مراقبة عدد 1 في الرياضيات' },
              },
            }),
            createDefaultBlock('rich_text', 50, 109, {
              width: 694,
              height: 50,
              content: {
                variant: 'instruction',
                label: 'Consigne :',
                text: 'Lisez attentivement les énoncés et détaillez toutes les étapes de vos calculs sur les lignes pointillées.',
              },
              translations: {
                fr: {
                  label: 'Consigne :',
                  text: 'Lisez attentivement les énoncés et détaillez toutes les étapes de vos calculs sur les lignes pointillées.',
                },
                en: {
                  label: 'Instruction:',
                  text: 'Read the questions carefully and show all calculation steps on the dotted lines.',
                },
                ar: {
                  label: 'تعليمة :',
                  text: 'اقرأ الأسئلة بانتباه وعلّل جميع مراحل الحساب على الأسطر المنقطة.',
                },
              },
            }),
            createDefaultBlock('separator', 50, 173, {
              width: 694,
              height: 16,
              content: {
                separatorMode: 'line',
                lineStyle: 'solid',
              },
            }),
            createDefaultBlock('exercise', 50, 203, {
              width: 694,
              height: 290,
              content: {
                exerciseNumber: 1,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 1',
                points: '5 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: false,
              },
              children: [
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '1) Calculer et donner le résultat sous forme irréductible : $A = \\frac{8}{5} \\times \\frac{15}{4} - \\frac{3}{2}$ et $B = 13^{4} \\times 13^{9}$.',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: {
                    answerType: 'lines',
                    lineCount: 3,
                    lineSpacing: 32,
                    lineStyle: 'dotted',
                  },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '2) Résoudre dans $\\mathbb{R}$ l’équation suivante : $3x - 7 = 14$.',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: {
                    answerType: 'lines',
                    lineCount: 3,
                    lineSpacing: 32,
                    lineStyle: 'dotted',
                  },
                }),
              ],
            }),
            createDefaultBlock('exercise', 50, 510, {
              width: 694,
              height: 210,
              content: {
                exerciseNumber: 2,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 2',
                points: '5 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText: 'On considère la fonction affine $f$ définie sur $\\mathbb{R}$ par $f(x) = 2x - 3$.',
              },
              children: [
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '1) Calculer l’image de $4$ par la fonction $f$, puis déterminer l’antécédent de $7$.',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: {
                    answerType: 'lines',
                    lineCount: 3,
                    lineSpacing: 32,
                    lineStyle: 'dotted',
                  },
                }),
              ],
            }),
          ],
          45,
          14
        ),
      },
    ],
  };
}

export interface PedagogicalCompositionDef {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: 'questions' | 'calculs' | 'activites' | 'problemes';
}

export const PEDAGOGICAL_COMPOSITIONS: PedagogicalCompositionDef[] = [
  {
    id: 'comp_qcm',
    title: 'Exercice avec QCM',
    description: 'En-tête d’exercice, consigne et bloc QCM avec 3 options',
    badge: 'QCM',
    category: 'questions',
  },
  {
    id: 'comp_calculs',
    title: 'Exercice de calculs & fractions',
    description: 'Consigne, expressions mathématiques et lignes de rédaction',
    badge: 'Calculs',
    category: 'calculs',
  },
  {
    id: 'comp_two_methods',
    title: 'Problème à deux méthodes',
    description: 'Énoncé avec colonnes 50/50 pour Méthode 1 et Méthode 2',
    badge: 'Colonnes',
    category: 'problemes',
  },
  {
    id: 'comp_true_false',
    title: 'Exercice Vrai ou Faux',
    description: 'Exercice complet avec 3 affirmations à évaluer',
    badge: 'Vrai/Faux',
    category: 'questions',
  },
  {
    id: 'comp_table',
    title: 'Exercice Tableau à compléter',
    description: 'Consigne et tableau structuré avec cellules de valeurs',
    badge: 'Tableau',
    category: 'activites',
  },
  {
    id: 'comp_matching',
    title: 'Exercice d’appariement',
    description: 'Deux colonnes à relier par des flèches avec espace de liaison',
    badge: 'Relier',
    category: 'activites',
  },
  {
    id: 'comp_open_questions',
    title: 'Questions ouvertes & rédaction',
    description: 'Réponse courte en ligne et réponse longue avec lignes d’écriture',
    badge: 'Rédaction',
    category: 'questions',
  },
];

export function createCompositionBlocks(
  compositionId: string,
  isRtl = false
): WorksheetBlock[] {
  const exTitle = isRtl ? 'تمرين' : 'Exercice';

  switch (compositionId) {
    case 'comp_qcm': {
      return [
        createDefaultBlock('exercise', 50, 50, {
          content: {
            exerciseNumber: 1,
            exerciseTitle: isRtl ? 'تمرين عدد 1 : سؤال متعدد الخيارات' : 'Exercice N° 1 : QCM',
            points: isRtl ? '4 نقاط' : '4 points',
            headerStyle: 'underlined',
            showInstruction: true,
            instructionText: isRtl
              ? 'ضع علامة (×) أمام الإجابة الصحيحة الوحيدة في كل حالة :'
              : 'Choisir la bonne réponse parmi les propositions suivantes :',
          },
          children: [
            createDefaultBlock('qcm', 0, 0, {
              content: {
                qcmStatement: isRtl
                  ? 'مقلوب العدد $2,5$ يساوي :'
                  : 'L’inverse du nombre $2,5$ est égal à :',
                qcmOptions: [
                  { id: `opt_${Date.now()}_1`, text: '$0,4$', isCorrect: true },
                  { id: `opt_${Date.now()}_2`, text: '$-2,5$', isCorrect: false },
                  { id: `opt_${Date.now()}_3`, text: '$\\frac{1}{25}$', isCorrect: false },
                ],
                questionNumber: '1',
                points: '2 pts',
              },
            }),
            createDefaultBlock('qcm', 0, 0, {
              content: {
                qcmStatement: isRtl
                  ? 'العدد $13^4 \\times 13^9$ يساوي :'
                  : 'L’expression $13^4 \\times 13^9$ est égale à :',
                qcmOptions: [
                  { id: `opt_${Date.now()}_4`, text: '$13^{13}$', isCorrect: true },
                  { id: `opt_${Date.now()}_5`, text: '$13^{36}$', isCorrect: false },
                  { id: `opt_${Date.now()}_6`, text: '$169^{13}$', isCorrect: false },
                ],
                questionNumber: '2',
                points: '2 pts',
              },
            }),
          ],
        }),
      ];
    }

    case 'comp_calculs': {
      return [
        createDefaultBlock('exercise', 50, 50, {
          content: {
            exerciseNumber: 2,
            exerciseTitle: isRtl ? 'تمرين عدد 2 : الحساب الذهني والجبري' : 'Exercice N° 2 : Calculs & Fractions',
            points: isRtl ? '5 نقاط' : '5 points',
            headerStyle: 'underlined',
            showInstruction: true,
            instructionText: isRtl
              ? 'احسب وأعطِ النتيجة في أبسط صورة ممكنة مع تفصيل مراحل الحساب :'
              : 'Calculer et donner chaque résultat sous forme de fraction irréductible :',
          },
          children: [
            createDefaultBlock('rich_text', 0, 0, {
              content: {
                text: 'a) $A = \\frac{7}{5} - \\frac{2}{5} \\times \\frac{3}{4}$',
              },
            }),
            createDefaultBlock('answer_lines', 0, 0, {
              content: { lineCount: 3, lineSpacing: 28, lineStyle: 'dotted' },
            }),
            createDefaultBlock('rich_text', 0, 0, {
              content: {
                text: 'b) $B = \\frac{13^6 \\times 13^3}{13^7}$',
              },
            }),
            createDefaultBlock('answer_lines', 0, 0, {
              content: { lineCount: 3, lineSpacing: 28, lineStyle: 'dotted' },
            }),
          ],
        }),
      ];
    }

    case 'comp_two_methods': {
      return [
        createDefaultBlock('exercise', 50, 50, {
          content: {
            exerciseNumber: 3,
            exerciseTitle: isRtl ? 'تمرين عدد 3 : مسألة بطريقتين' : 'Exercice N° 3 : Problème à deux démarches',
            points: isRtl ? '6 نقاط' : '6 points',
            headerStyle: 'underlined',
            showInstruction: true,
            instructionText: isRtl
              ? 'أوجد طول الضلع المجهول باتباع طريقتين مختلفتين :'
              : 'Résoudre le problème suivant en utilisant deux démarches indépendantes :',
          },
          children: [
            createDefaultBlock('columns', 0, 0, {
              content: {
                columnsPreset: '50_50',
                columnsGap: 16,
                columnsData: [
                  {
                    id: 'col_0',
                    blocks: [
                      createDefaultBlock('answer_box', 0, 0, {
                        content: {
                          answerBoxTitle: isRtl ? 'الطريقة الأولى : بالحساب الجبري' : 'Méthode 1 : Calcul algébrique',
                          answerBoxHeight: 120,
                        },
                      }),
                    ],
                  },
                  {
                    id: 'col_1',
                    blocks: [
                      createDefaultBlock('answer_box', 0, 0, {
                        content: {
                          answerBoxTitle: isRtl ? 'الطريقة الثانية : بالخاصية الهندسية' : 'Méthode 2 : Propriété géométrique',
                          answerBoxHeight: 120,
                        },
                      }),
                    ],
                  },
                ],
              },
            }),
          ],
        }),
      ];
    }

    case 'comp_true_false': {
      return [
        createDefaultBlock('exercise', 50, 50, {
          content: {
            exerciseNumber: 1,
            exerciseTitle: isRtl ? 'تمرين عدد 1 : صواب أو خطأ' : 'Exercice N° 1 : Vrai ou Faux',
            points: isRtl ? '3 نقاط' : '3 points',
            headerStyle: 'underlined',
            showInstruction: true,
            instructionText: isRtl
              ? 'أجب بصواب أو خطأ أمام كل عبارة من العبارات التالية :'
              : 'Répondre par Vrai ou Faux en justifiant si nécessaire :',
          },
          children: [
            createDefaultBlock('true_false', 0, 0, {
              content: {
                tfStatement: '1) Si $x = 3$, alors $2x + 1 = 7$.',
                trueLabel: isRtl ? 'صحيح' : 'Vrai',
                falseLabel: isRtl ? 'خطأ' : 'Faux',
                correctAnswer: 'true',
                points: '1 pt',
              },
            }),
            createDefaultBlock('true_false', 0, 0, {
              content: {
                tfStatement: '2) Tout nombre premier est impair.',
                trueLabel: isRtl ? 'صحيح' : 'Vrai',
                falseLabel: isRtl ? 'خطأ' : 'Faux',
                correctAnswer: 'false',
                points: '1 pt',
              },
            }),
            createDefaultBlock('true_false', 0, 0, {
              content: {
                tfStatement: '3) L’inverse de $\\frac{5}{2}$ est égal à $0,4$.',
                trueLabel: isRtl ? 'صحيح' : 'Vrai',
                falseLabel: isRtl ? 'خطأ' : 'Faux',
                correctAnswer: 'true',
                points: '1 pt',
              },
            }),
          ],
        }),
      ];
    }

    case 'comp_table': {
      return [
        createDefaultBlock('exercise', 50, 50, {
          content: {
            exerciseNumber: 2,
            exerciseTitle: isRtl ? 'تمرين عدد 2 : إكمال جدول' : 'Exercice N° 2 : Tableau à compléter',
            points: isRtl ? '4 نقاط' : '4 points',
            headerStyle: 'underlined',
            showInstruction: true,
            instructionText: isRtl
              ? 'أكمل تعمير الجدول التالي مع كتابة مراحل الحساب :'
              : 'Compléter le tableau de proportionnalité ci-dessous :',
          },
          children: [
            createDefaultBlock('table', 0, 0),
            createDefaultBlock('answer_lines', 0, 0, {
              content: { lineCount: 2, lineSpacing: 28, lineStyle: 'dotted' },
            }),
          ],
        }),
      ];
    }

    case 'comp_matching': {
      return [
        createDefaultBlock('exercise', 50, 50, {
          content: {
            exerciseNumber: 1,
            exerciseTitle: isRtl ? 'تمرين عدد 1 : مطابقة وربط' : 'Exercice N° 1 : Appariement',
            points: isRtl ? '3 نقاط' : '3 points',
            headerStyle: 'underlined',
            showInstruction: true,
            instructionText: isRtl
              ? 'اربط بسهم كل عنصر من العمود (أ) بما يناسبه في العمود (ب) :'
              : 'Relier chaque figure géométrique de la colonne A à sa propriété correspondante dans la colonne B :',
          },
          children: [createDefaultBlock('matching', 0, 0)],
        }),
      ];
    }

    case 'comp_open_questions': {
      return [
        createDefaultBlock('exercise', 50, 50, {
          content: {
            exerciseNumber: 3,
            exerciseTitle: isRtl ? 'تمرين عدد 3 : أسئلة ومسائل' : 'Exercice N° 3 : Questions & Rédaction',
            points: isRtl ? '5 نقاط' : '5 points',
            headerStyle: 'underlined',
            showInstruction: true,
            instructionText: 'Rédiger une réponse claire et rigoureuse pour chaque question :',
          },
          children: [
            createDefaultBlock('short_answer', 0, 0, {
              content: {
                shortAnswerQuestion: '1) Déterminer la valeur exacte de l’expression pour $x = 0$ :',
                shortAnswerLayout: 'inline',
                shortAnswerLineWidth: 'medium',
                points: '1 pt',
              },
            }),
            createDefaultBlock('long_answer', 0, 0, {
              content: {
                longAnswerQuestion: '2) Démontrer que le triangle $ABC$ est rectangle en $A$ :',
                lineCount: 4,
                lineSpacing: 28,
                points: '4 pts',
              },
            }),
          ],
        }),
      ];
    }

    default:
      return [createDefaultBlock('exercise', 50, 50)];
  }
}

export interface ReferenceExamTemplateDef {
  id: 'exam_fr_math' | 'exam_ar_tunisian' | 'exam_worksheet_td';
  title: string;
  subtitle: string;
  category: 'exam' | 'arabic' | 'worksheet';
  badge: string;
  badgeColor: string;
  flag: string;
  pageCount: number;
  duration: string;
  score: string;
  description: string;
  topics: string[];
}

export const REFERENCE_EXAM_TEMPLATES: ReferenceExamTemplateDef[] = [
  {
    id: 'exam_fr_math',
    title: 'Devoir de Contrôle N°1 — Mathématiques',
    subtitle: 'Niveau Collège / Lycée • Algèbre, Puissances & Géométrie',
    category: 'exam',
    badge: 'Français Standard',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    flag: '🇫🇷',
    pageCount: 2,
    duration: '1 heure',
    score: '20 points',
    description:
      'En-tête officiel standard, Exercice 1 QCM (4 pts), Exercice 2 Calculs algébriques & fractions (6 pts), Exercice 3 Géométrie & démarche en colonnes (10 pts).',
    topics: ['QCM', 'Fractions & Puissances', 'Théorème de Pythagore', 'Colonnes 50/50'],
  },
  {
    id: 'exam_ar_tunisian',
    title: 'فرض مراقبة عدد 1 في الرياضيات — نمط تونسي / عربي',
    subtitle: 'السنة التاسعة أساسي • حساب جبري، جذور تربيعية وهندسة مستوية',
    category: 'arabic',
    badge: 'عربي RTL bilingue',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    flag: '🇹🇳',
    pageCount: 2,
    duration: '1 ساعة',
    score: '20 نقطة',
    description:
      'إطار أكاديمي تونسي وعربي كامل باتجاه RTL، تمرين 1 QCM باللغة العربية (4 ن)، تمرين 2 حساب وجذور ومعادلات (7 ن)، تمرين 3 هندسة ومبرهنة بيتاغور (9 ن).',
    topics: ['تمرين QCM بالعربية', 'حساب وجذور تربيعية', 'مبرهنة بيتاغور', 'RTL كامل'],
  },
  {
    id: 'exam_worksheet_td',
    title: 'Fiche de Travaux Dirigés & Évaluation Formative',
    subtitle: 'Fiche d’exercices • Proportionnalité, Fonctions & Modélisation',
    category: 'worksheet',
    badge: 'TD & Révisions',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    flag: '📘',
    pageCount: 2,
    duration: 'En classe / Maison',
    score: '20 points',
    description:
      'Titre structuré, encadré rappel de cours « À retenir », Exercice 1 Vrai/Faux (5 pts), Exercice 2 Tableau à compléter (6 pts), Exercice 3 Problème avec quadrillage (9 pts).',
    topics: ['Mémo cours', 'Vrai / Faux', 'Tableau de valeurs', 'Quadrillage graphique'],
  },
];

export function createFrenchMathExamDocument(): WorksheetDocument {
  const docId = `doc_fr_${Date.now()}`;
  return {
    id: docId,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    title: 'Devoir de Contrôle N°1 — Mathématiques',
    settings: {
      format: 'A4',
      orientation: 'portrait',
      margins: { top: 40, right: 45, bottom: 40, left: 45 },
      backgroundColor: '#ffffff',
      showMarginGuides: true,
      showGridGuides: false,
      activeLanguage: 'fr',
      defaultTextDirection: 'ltr',
      fontFamily: DEFAULT_WORKSHEET_FONT,
      showPageNumber: true,
      blockGap: 12,
    },
    pages: [
      {
        id: 'page_1',
        pageNumber: 1,
        blocks: layoutVerticalFlow(
          [
            // 1. En-tête officiel
            createDefaultBlock('exam_header', 45, 40, {
              width: 704,
              content: {
                headerPreset: 'classic',
                headerBorderStyle: 'boxed',
                schoolName: 'Collège & Lycée Pilote d’Excellence',
                teacherName: 'Professeur : M. / Mme ...................',
                subjectName: 'Épreuve de Mathématiques',
                testTitle: 'Devoir de Contrôle N°1',
                classGrade: 'Classe : 4ème / 3ème',
                academicYear: 'Année scolaire : 2024 - 2025',
                testDate: 'Date : ...... / ...... / 2024',
                durationText: 'Durée : 1 heure',
                maxScore: 20,
                showStudentArea: true,
                showScoreArea: true,
                showDuration: true,
              },
            }),

            // 2. Consigne générale
            createDefaultBlock('rich_text', 45, 140, {
              width: 704,
              content: {
                variant: 'instruction',
                label: 'Consignes de l’épreuve :',
                text: 'L’usage de la calculatrice est interdit. La clarté des rédactions, la justification des calculs et la présentation générale seront prises en compte dans la notation sur 20.',
              },
            }),

            createDefaultBlock('separator', 45, 200, {
              width: 704,
              content: { separatorMode: 'line', lineStyle: 'solid' },
            }),

            // 3. Exercice 1 : QCM (4 points)
            createDefaultBlock('exercise', 45, 220, {
              width: 704,
              content: {
                exerciseNumber: 1,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 1 : Questionnaire à Choix Multiple (QCM)',
                points: '4 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText:
                  'Pour chaque question, une seule réponse est exacte. Cocher la case correspondante sans justification.',
              },
              children: [
                createDefaultBlock('qcm', 0, 0, {
                  content: {
                    qcmStatement: '1) L’inverse du nombre $2,5$ est égal à :',
                    qcmOptions: [
                      { id: 'opt_1', text: '$0,4$', isCorrect: true },
                      { id: 'opt_2', text: '$-2,5$', isCorrect: false },
                      { id: 'opt_3', text: '$\\frac{1}{25}$', isCorrect: false },
                    ],
                    questionNumber: '1',
                    points: '1 pt',
                  },
                }),
                createDefaultBlock('qcm', 0, 0, {
                  content: {
                    qcmStatement: '2) Le produit $13^4 \\times 13^9$ est égal à :',
                    qcmOptions: [
                      { id: 'opt_4', text: '$13^{13}$', isCorrect: true },
                      { id: 'opt_5', text: '$13^{36}$', isCorrect: false },
                      { id: 'opt_6', text: '$169^{13}$', isCorrect: false },
                    ],
                    questionNumber: '2',
                    points: '1 pt',
                  },
                }),
                createDefaultBlock('qcm', 0, 0, {
                  content: {
                    qcmStatement: '3) L’écriture irréductible de la fraction $\\frac{84}{126}$ est :',
                    qcmOptions: [
                      { id: 'opt_7', text: '$\\frac{2}{3}$', isCorrect: true },
                      { id: 'opt_8', text: '$\\frac{4}{6}$', isCorrect: false },
                      { id: 'opt_9', text: '$\\frac{14}{21}$', isCorrect: false },
                    ],
                    questionNumber: '3',
                    points: '1 pt',
                  },
                }),
                createDefaultBlock('qcm', 0, 0, {
                  content: {
                    qcmStatement: '4) Si $x^2 = 7$, alors dans $\\mathbb{R}$ :',
                    qcmOptions: [
                      { id: 'opt_10', text: '$x = \\sqrt{7}$ ou $x = -\\sqrt{7}$', isCorrect: true },
                      { id: 'opt_11', text: '$x = \\sqrt{7}$ uniquement', isCorrect: false },
                      { id: 'opt_12', text: '$x = 3,5$', isCorrect: false },
                    ],
                    questionNumber: '4',
                    points: '1 pt',
                  },
                }),
              ],
            }),

            createDefaultBlock('separator', 45, 540, {
              width: 704,
              content: { separatorMode: 'line', lineStyle: 'solid' },
            }),

            // 4. Exercice 2 : Calculs & Fractions (6 points)
            createDefaultBlock('exercise', 45, 560, {
              width: 704,
              content: {
                exerciseNumber: 2,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 2 : Calcul numérique, fractions et puissances',
                points: '6 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText:
                  'Calculer chaque expression en détaillant les étapes sur les lignes pointillées.',
              },
              children: [
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '1) Calculer et donner $A$ sous forme d’une fraction irréductible : $A = \\frac{7}{3} - \\frac{2}{3} \\times \\frac{5}{4}$',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: { answerType: 'lines', lineCount: 3, lineSpacing: 28, lineStyle: 'dotted' },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '2) Écrire le nombre $B$ sous la forme $a^n$ où $a$ et $n$ sont des entiers : $B = \\frac{(5^3)^4 \\times 5^{-2}}{5^7}$',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: { answerType: 'lines', lineCount: 3, lineSpacing: 28, lineStyle: 'dotted' },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '3) Résoudre dans $\\mathbb{R}$ l’équation suivante : $3x - 5 = 7x + 11$',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: { answerType: 'lines', lineCount: 3, lineSpacing: 28, lineStyle: 'dotted' },
                }),
              ],
            }),
          ],
          40,
          12
        ),
      },
      {
        id: 'page_2',
        pageNumber: 2,
        blocks: layoutVerticalFlow(
          [
            // Exercice 3 : Géométrie & Démarche en 2 méthodes (10 points)
            createDefaultBlock('exercise', 45, 40, {
              width: 704,
              content: {
                exerciseNumber: 3,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 3 : Géométrie plane & Problème à deux démarches',
                points: '10 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText:
                  'Soit un triangle $ABC$ rectangle en $A$ tel que $AB = 6\\text{ cm}$ et $AC = 8\\text{ cm}$. On note $H$ le projeté orthogonal du point $A$ sur la droite $(BC)$.',
              },
              children: [
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '1) Appliquer le théorème de Pythagore dans le triangle $ABC$ pour démontrer que $BC = 10\\text{ cm}$ :',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: { answerType: 'lines', lineCount: 4, lineSpacing: 28, lineStyle: 'dotted' },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '2) Calculer la longueur de la hauteur $AH$ en utilisant deux démarches indépendantes :',
                  },
                }),
                createDefaultBlock('columns', 0, 0, {
                  content: {
                    columnsPreset: '50_50',
                    columnsGap: 14,
                    columnsData: [
                      {
                        id: 'col_method1',
                        blocks: [
                          createDefaultBlock('answer_box', 0, 0, {
                            content: {
                              answerBoxTitle: 'Démarche 1 : Par l’égalité des aires',
                              answerBoxHeight: 140,
                            },
                          }),
                        ],
                      },
                      {
                        id: 'col_method2',
                        blocks: [
                          createDefaultBlock('answer_box', 0, 0, {
                            content: {
                              answerBoxTitle: 'Démarche 2 : Par les triangles semblables',
                              answerBoxHeight: 140,
                            },
                          }),
                        ],
                      },
                    ],
                  },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '3) Conclure en donnant la valeur exacte de $AH$ et son arrondi au millimètre près :',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: { answerType: 'lines', lineCount: 2, lineSpacing: 28, lineStyle: 'solid' },
                }),
              ],
            }),
          ],
          40,
          12
        ),
      },
    ],
  };
}

export function createArabicRtlExamDocument(): WorksheetDocument {
  const docId = `doc_ar_${Date.now()}`;
  return {
    id: docId,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    title: 'فرض مراقبة عدد 1 في الرياضيات — نمط تونسي / عربي',
    settings: {
      format: 'A4',
      orientation: 'portrait',
      margins: { top: 40, right: 45, bottom: 40, left: 45 },
      backgroundColor: '#ffffff',
      showMarginGuides: true,
      showGridGuides: false,
      activeLanguage: 'ar',
      defaultTextDirection: 'rtl',
      fontFamily: 'Cairo, sans-serif',
      showPageNumber: true,
      blockGap: 12,
    },
    pages: [
      {
        id: 'page_1',
        pageNumber: 1,
        blocks: layoutVerticalFlow(
          [
            // 1. En-tête tunisien RTL
            createDefaultBlock('exam_header', 45, 40, {
              width: 704,
              styles: {
                textDirection: 'rtl',
                languageMode: 'ar',
                fontFamily: 'Cairo, sans-serif',
              },
              content: {
                headerPreset: 'classic',
                headerBorderStyle: 'boxed',
                schoolName: 'المدرسة الإعدادية النموذجية',
                teacherName: 'الأستاذ(ة) : ...................................',
                subjectName: 'المادة : رياضيات',
                testTitle: 'فرض مراقبة عدد 1',
                classGrade: 'القسم : 9 أساسي',
                academicYear: 'السنة الدراسية : 2024 - 2025',
                testDate: 'التاريخ : ...... / ...... / 2024',
                durationText: 'التوقيت : 1 ساعة',
                maxScore: 20,
                showStudentArea: true,
                showScoreArea: true,
                showDuration: true,
              },
            }),

            // 2. تعليمة الفرض
            createDefaultBlock('rich_text', 45, 140, {
              width: 704,
              styles: {
                textDirection: 'rtl',
                languageMode: 'ar',
                fontFamily: 'Cairo, sans-serif',
              },
              content: {
                variant: 'instruction',
                label: 'توجيهات عامة :',
                text: 'يُمنع استعمال الآلة الحاسبة. يجب تفصيل جميع خطوات الحساب وتقديم الإجابات بدقة وتنظيم على الأسطر المنقطة.',
              },
            }),

            createDefaultBlock('separator', 45, 200, {
              width: 704,
              content: { separatorMode: 'line', lineStyle: 'solid' },
            }),

            // 3. تمرين 1 : QCM (4 نقاط)
            createDefaultBlock('exercise', 45, 220, {
              width: 704,
              styles: {
                textDirection: 'rtl',
                languageMode: 'ar',
                fontFamily: 'Cairo, sans-serif',
              },
              content: {
                exerciseNumber: 1,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'تمرين عدد 1 : أسئلة متعددة الخيارات (QCM)',
                points: '4 نقاط',
                showPoints: true,
                pointsPosition: 'left',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText: 'ضع علامة (×) أمام المقترح السليم والوحيد لكل سؤال من الأسئلة التالية :',
              },
              children: [
                createDefaultBlock('qcm', 0, 0, {
                  styles: { textDirection: 'rtl' },
                  content: {
                    qcmStatement: '1) مقلوب العدد $2,5$ يساوي :',
                    qcmOptions: [
                      { id: 'opt_ar_1', text: '$0,4$', isCorrect: true },
                      { id: 'opt_ar_2', text: '$-2,5$', isCorrect: false },
                      { id: 'opt_ar_3', text: '$\\frac{1}{25}$', isCorrect: false },
                    ],
                    questionNumber: '1',
                    points: '1 ن',
                  },
                }),
                createDefaultBlock('qcm', 0, 0, {
                  styles: { textDirection: 'rtl' },
                  content: {
                    qcmStatement: '2) جذاء القوى $13^4 \\times 13^9$ يساوي :',
                    qcmOptions: [
                      { id: 'opt_ar_4', text: '$13^{13}$', isCorrect: true },
                      { id: 'opt_ar_5', text: '$13^{36}$', isCorrect: false },
                      { id: 'opt_ar_6', text: '$169^{13}$', isCorrect: false },
                    ],
                    questionNumber: '2',
                    points: '1 ن',
                  },
                }),
                createDefaultBlock('qcm', 0, 0, {
                  styles: { textDirection: 'rtl' },
                  content: {
                    qcmStatement: '3) إذا كان $x \\in \\mathbb{R}$ بحيث $x^2 = 11$ فإن :',
                    qcmOptions: [
                      { id: 'opt_ar_7', text: '$x = \\sqrt{11}$ أو $x = -\\sqrt{11}$', isCorrect: true },
                      { id: 'opt_ar_8', text: '$x = \\sqrt{11}$ فقط', isCorrect: false },
                      { id: 'opt_ar_9', text: '$x = 5,5$', isCorrect: false },
                    ],
                    questionNumber: '3',
                    points: '1 ن',
                  },
                }),
                createDefaultBlock('qcm', 0, 0, {
                  styles: { textDirection: 'rtl' },
                  content: {
                    qcmStatement: '4) العدد $\\sqrt{50} - \\sqrt{18}$ يكتب في أبسط صورة :',
                    qcmOptions: [
                      { id: 'opt_ar_10', text: '$2\\sqrt{2}$', isCorrect: true },
                      { id: 'opt_ar_11', text: '$4\\sqrt{2}$', isCorrect: false },
                      { id: 'opt_ar_12', text: '$\\sqrt{32}$', isCorrect: false },
                    ],
                    questionNumber: '4',
                    points: '1 ن',
                  },
                }),
              ],
            }),

            createDefaultBlock('separator', 45, 540, {
              width: 704,
              content: { separatorMode: 'line', lineStyle: 'solid' },
            }),

            // 4. تمرين 2 : حساب جبري وتبسيط عبارات (7 نقاط)
            createDefaultBlock('exercise', 45, 560, {
              width: 704,
              styles: {
                textDirection: 'rtl',
                languageMode: 'ar',
                fontFamily: 'Cairo, sans-serif',
              },
              content: {
                exerciseNumber: 2,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'تمرين عدد 2 : الحساب الجبري وتبسيط العبارات',
                points: '7 نقاط',
                showPoints: true,
                pointsPosition: 'left',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText: 'احسب العبارات التالية مع توضيح جميع مراحل الحساب والتبسيط :',
              },
              children: [
                createDefaultChildBlock('rich_text', true, {
                  content: {
                    variant: 'paragraph',
                    text: '1) احسب وبسّط العبارة التالية : $A = \\sqrt{75} - 2\\sqrt{12} + 5\\sqrt{3}$',
                  },
                }),
                createDefaultChildBlock('answer_lines', true, {
                  content: {
                    answerType: 'lines',
                    lineCount: 3,
                    lineSpacing: 28,
                    lineStyle: 'dotted',
                    placeholder: 'مكان إجابة التلميذ...',
                  },
                }),
                createDefaultChildBlock('rich_text', true, {
                  content: {
                    variant: 'paragraph',
                    text: '2) فكّك إلى جذاء عوامل العبارة : $B = (2x - 3)^2 - 25$',
                  },
                }),
                createDefaultChildBlock('answer_lines', true, {
                  content: {
                    answerType: 'lines',
                    lineCount: 3,
                    lineSpacing: 28,
                    lineStyle: 'dotted',
                    placeholder: 'مكان إجابة التلميذ...',
                  },
                }),
                createDefaultChildBlock('rich_text', true, {
                  content: {
                    variant: 'paragraph',
                    text: '3) حل في مجموعة الأعداد الحقيقية $\\mathbb{R}$ المعادلة : $(2x - 8)(2x + 2) = 0$',
                  },
                }),
                createDefaultChildBlock('answer_lines', true, {
                  content: {
                    answerType: 'lines',
                    lineCount: 3,
                    lineSpacing: 28,
                    lineStyle: 'dotted',
                    placeholder: 'مكان إجابة التلميذ...',
                  },
                }),
              ],
            }),
          ],
          40,
          12
        ),
      },
      {
        id: 'page_2',
        pageNumber: 2,
        blocks: layoutVerticalFlow(
          [
            // تمرين 3 : الهندسة المستوية ومبرهنة بيتاغور (9 نقاط)
            createDefaultBlock('exercise', 45, 40, {
              width: 704,
              styles: {
                textDirection: 'rtl',
                languageMode: 'ar',
                fontFamily: 'Cairo, sans-serif',
              },
              content: {
                exerciseNumber: 3,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'تمرين عدد 3 : الهندسة المستوية ومبرهنة بيتاغور',
                points: '9 نقاط',
                showPoints: true,
                pointsPosition: 'left',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText:
                  'ليكن $ABC$ مثلثا قائما في $A$ حيث $AB = 6\\text{ cm}$ و $AC = 8\\text{ cm}$. النقطة $H$ هي المسقط العمودي للنقطة $A$ على الوتر $(BC)$.',
              },
              children: [
                createDefaultChildBlock('rich_text', true, {
                  content: {
                    variant: 'paragraph',
                    text: '1) بتطبيق مبرهنة بيتاغور في المثلث $ABC$، أثبت أن $BC = 10\\text{ cm}$ :',
                  },
                }),
                createDefaultChildBlock('answer_lines', true, {
                  content: {
                    answerType: 'lines',
                    lineCount: 4,
                    lineSpacing: 28,
                    lineStyle: 'dotted',
                    placeholder: 'البرهان والحساب...',
                  },
                }),
                createDefaultChildBlock('rich_text', true, {
                  content: {
                    variant: 'paragraph',
                    text: '2) احسب مساحة المثلث $ABC$ بطريقتين واستنتج بدقة طول الارتفاع $AH$ :',
                  },
                }),
                createDefaultChildBlock('answer_lines', true, {
                  content: {
                    answerType: 'lines',
                    lineCount: 4,
                    lineSpacing: 28,
                    lineStyle: 'dotted',
                    placeholder: 'المساحة وحساب AH...',
                  },
                }),
                createDefaultChildBlock('rich_text', true, {
                  content: {
                    variant: 'paragraph',
                    text: '3) أثبت أن المثلثين $ABH$ و $CAH$ متشابهان واستنتج العلاقة بين أطوال أضلاعهما :',
                  },
                }),
                createDefaultChildBlock('answer_lines', true, {
                  content: {
                    answerType: 'lines',
                    lineCount: 4,
                    lineSpacing: 28,
                    lineStyle: 'solid',
                    placeholder: 'التشابه والاستنتاج...',
                  },
                }),
              ],
            }),
          ],
          40,
          12
        ),
      },
    ],
  };
}

export function createWorksheetExercisesDocument(): WorksheetDocument {
  const docId = `doc_td_${Date.now()}`;
  return {
    id: docId,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    title: 'Fiche de Travaux Dirigés & Évaluation Formative',
    settings: {
      format: 'A4',
      orientation: 'portrait',
      margins: { top: 40, right: 45, bottom: 40, left: 45 },
      backgroundColor: '#ffffff',
      showMarginGuides: true,
      showGridGuides: false,
      activeLanguage: 'fr',
      defaultTextDirection: 'ltr',
      fontFamily: DEFAULT_WORKSHEET_FONT,
      showPageNumber: true,
      blockGap: 12,
    },
    pages: [
      {
        id: 'page_1',
        pageNumber: 1,
        blocks: layoutVerticalFlow(
          [
            // 1. Grand Titre
            createDefaultBlock('title', 45, 40, {
              width: 704,
              content: {
                text: 'Fiche de Travaux Dirigés — Proportionnalité & Modélisation',
                titleNumbering: 'none',
              },
            }),

            // 2. Encadré de cours "À retenir"
            createDefaultBlock('rich_text', 45, 100, {
              width: 704,
              content: {
                variant: 'callout',
                label: 'Rappel de cours & Propriété fondamentale :',
                text: 'Deux grandeurs sont proportionnelles lorsque les valeurs de l’une s’obtiennent en multipliant les valeurs correspondantes de l’autre par un même nombre non nul $k$, appelé coefficient de proportionnalité ($y = k \\times x$). Dans un tableau, les produits en croix sont égaux.',
              },
              styles: {
                backgroundColor: '#f0fdf4',
                borderColor: '#86efac',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 8,
                padding: 10,
                color: '#166534',
              },
            }),

            createDefaultBlock('separator', 45, 180, {
              width: 704,
              content: { separatorMode: 'line', lineStyle: 'solid' },
            }),

            // 3. Exercice 1 : Vrai / Faux (5 points)
            createDefaultBlock('exercise', 45, 200, {
              width: 704,
              content: {
                exerciseNumber: 1,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 1 : Évaluation Vrai ou Faux avec justification',
                points: '5 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText:
                  'Répondre par Vrai ou Faux à chaque proposition et rédiger une justification succincte :',
              },
              children: [
                createDefaultBlock('true_false', 0, 0, {
                  content: {
                    tfStatement: '1) Si 3 kg de pommes coûtent 7,50 €, alors 6 kg coûtent 15,00 €.',
                    trueLabel: 'Vrai',
                    falseLabel: 'Faux',
                    correctAnswer: 'true',
                    points: '1.5 pt',
                  },
                }),
                createDefaultBlock('true_false', 0, 0, {
                  content: {
                    tfStatement: '2) La fonction affine $f(x) = 3x + 2$ traduit une situation de proportionnalité.',
                    trueLabel: 'Vrai',
                    falseLabel: 'Faux',
                    correctAnswer: 'false',
                    points: '1.5 pt',
                  },
                }),
                createDefaultBlock('true_false', 0, 0, {
                  content: {
                    tfStatement: '3) Le quotient $\\frac{a}{b} = \\frac{c}{d}$ équivaut au produit en croix $a \\times d = b \\times c$.',
                    trueLabel: 'Vrai',
                    falseLabel: 'Faux',
                    correctAnswer: 'true',
                    points: '2 pts',
                  },
                }),
              ],
            }),

            createDefaultBlock('separator', 45, 490, {
              width: 704,
              content: { separatorMode: 'line', lineStyle: 'solid' },
            }),

            // 4. Exercice 2 : Tableau de proportionnalité (6 points)
            createDefaultBlock('exercise', 45, 510, {
              width: 704,
              content: {
                exerciseNumber: 2,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 2 : Tableau de valeurs & Calculs de coefficient',
                points: '6 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText:
                  'Compléter le tableau de proportionnalité ci-dessous et justifier les calculs de passage :',
              },
              children: [
                createDefaultBlock('table', 0, 0, {
                  content: {
                    tablePreset: 'complete',
                    tableRowsData: [
                      {
                        id: 'r_0',
                        cells: [
                          { id: 'c_0_0', text: 'Masse de métal (kg)', isHeader: true, align: 'left' },
                          { id: 'c_0_1', text: '2,5', isHeader: false, align: 'center' },
                          { id: 'c_0_2', text: '5', isHeader: false, align: 'center' },
                          { id: 'c_0_3', text: '7,5', isHeader: false, align: 'center' },
                          { id: 'c_0_4', text: '12', isHeader: false, align: 'center' },
                        ],
                      },
                      {
                        id: 'r_1',
                        cells: [
                          { id: 'c_1_0', text: 'Prix facturé (€)', isHeader: true, align: 'left' },
                          { id: 'c_1_1', text: '45', isHeader: false, align: 'center' },
                          { id: 'c_1_2', text: '90', isHeader: false, align: 'center' },
                          { id: 'c_1_3', text: '.......', isHeader: false, align: 'center' },
                          { id: 'c_1_4', text: '.......', isHeader: false, align: 'center' },
                        ],
                      },
                    ],
                  },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: 'Détailler le calcul du coefficient de proportionnalité et des valeurs manquantes :',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: {
                    answerType: 'lines',
                    lineCount: 3,
                    lineSpacing: 28,
                    lineStyle: 'dotted',
                    placeholder: 'Calculs justificatifs...',
                  },
                }),
              ],
            }),
          ],
          40,
          12
        ),
      },
      {
        id: 'page_2',
        pageNumber: 2,
        blocks: layoutVerticalFlow(
          [
            // Exercice 3 : Problème appliqué & Graphique (9 points)
            createDefaultBlock('exercise', 45, 40, {
              width: 704,
              content: {
                exerciseNumber: 3,
                numberingStyle: 'exercice_n',
                exerciseTitle: 'Exercice N° 3 : Problème appliqué & Modélisation graphique',
                points: '9 points',
                showPoints: true,
                pointsPosition: 'right',
                headerStyle: 'underlined',
                showInstruction: true,
                instructionText:
                  'Une société de transport applique un tarif de base comprenant une prise en charge fixe de 15 € plus un coût kilométrique de 2,50 € par kilomètre parcouru ($x$).',
              },
              children: [
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '1) Déterminer la fonction affine $P(x)$ exprimant le prix total en fonction de la distance $x$ en kilomètres :',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: { answerType: 'lines', lineCount: 2, lineSpacing: 28, lineStyle: 'dotted' },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '2) Calculer le coût total d’un trajet de 24 km, puis calculer la distance maximale parcourue pour un budget de 85 € :',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: { answerType: 'lines', lineCount: 4, lineSpacing: 28, lineStyle: 'dotted' },
                }),
                createDefaultChildBlock('rich_text', false, {
                  content: {
                    variant: 'paragraph',
                    text: '3) Esquisser l’allure de la représentation graphique du prix dans le repère quadrillé ci-dessous :',
                  },
                }),
                createDefaultChildBlock('answer_lines', false, {
                  content: {
                    answerType: 'grid',
                    lineCount: 7,
                    lineSpacing: 24,
                    placeholder: 'Zone de tracé graphique quadrillée...',
                  },
                }),
              ],
            }),
          ],
          40,
          12
        ),
      },
    ],
  };
}

export function loadReferenceExam(templateId: string): WorksheetDocument {
  switch (templateId) {
    case 'exam_fr_math':
      return createFrenchMathExamDocument();
    case 'exam_ar_tunisian':
      return createArabicRtlExamDocument();
    case 'exam_worksheet_td':
      return createWorksheetExercisesDocument();
    default:
      return createFrenchMathExamDocument();
  }
}
