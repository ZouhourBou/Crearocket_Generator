import React from 'react';
import { WorksheetBlock } from '../../../types/worksheet';
import { CoreRichTextField } from './CoreRichTextField';

interface ExamHeaderBlockItemProps {
  block: WorksheetBlock;
  isSelected: boolean;
  readOnly?: boolean;
  onUpdateContent: (content: Partial<WorksheetBlock['content']>) => void;
  onUpdateStyles: (styles: Partial<WorksheetBlock['styles']>) => void;
}

export const ExamHeaderBlockItem: React.FC<ExamHeaderBlockItemProps> = ({
  block,
  isSelected,
  readOnly = false,
  onUpdateContent,
}) => {
  const c = block.content;
  const isRtl = block.styles.textDirection === 'rtl' || block.styles.languageMode === 'ar';
  const defaultFont =
    block.styles.fontFamily || (isRtl ? 'Cairo, sans-serif' : 'Outfit, sans-serif');

  const preset = c.headerPreset || 'classic';
  const borderStyle = c.headerBorderStyle || 'boxed';

  const school = c.schoolName ?? (isRtl ? 'المدرسة الإعدادية النموذجية' : 'Collège Pilote');
  const teacher = c.teacherName ?? (isRtl ? 'الأستاذ(ة) : .............' : 'Professeur : ..............');
  const subject = c.subjectName ?? (isRtl ? 'المادة : رياضيات' : 'Matière : Mathématiques');
  const testTitle = c.testTitle ?? (isRtl ? 'فرض مراقبة عدد 1' : 'Devoir de Contrôle N°1');
  const classGrade = c.classGrade ?? (isRtl ? '8 أساسي' : 'Classe : 4ème / 3ème');
  const academicYear = c.academicYear ?? (isRtl ? 'السنة الدراسية : 2023 - 2024' : 'Année scolaire : 2023 - 2024');
  const testDate = c.testDate ?? (isRtl ? 'التاريخ : .............' : 'Date : ..............');
  const duration = c.durationText ?? (isRtl ? 'التوقيت : 45 دق' : 'Durée : 45 min');
  const maxScore = c.maxScore ?? 20;

  const showStudent = c.showStudentArea !== false;
  const showScore = c.showScoreArea !== false;
  const showDuration = c.showDuration !== false;

  const borderClass =
    borderStyle === 'boxed'
      ? 'border border-slate-700/80 rounded-md p-3'
      : borderStyle === 'double'
      ? 'border-2 border-double border-slate-800 rounded-md p-3'
      : borderStyle === 'underlined'
      ? 'border-b-2 border-slate-800 pb-3'
      : 'p-2';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`w-full bg-white select-none transition-all text-slate-800 ${borderClass}`}
      style={{ fontFamily: defaultFont }}
    >
      {/* PRESET 1: CLASSIC */}
      {preset === 'classic' && (
        <div className="flex flex-col gap-2.5">
          {/* Top Row: School/Teacher on one side, Class/Year on the other */}
          <div className="flex justify-between items-start text-xs font-semibold text-slate-600 gap-4">
            <div className="flex flex-col gap-1 min-w-[140px]">
              <CoreRichTextField
                value={school}
                onChange={(text) => onUpdateContent({ schoolName: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-xs font-bold text-slate-800"
              />
              <CoreRichTextField
                value={teacher}
                onChange={(text) => onUpdateContent({ teacherName: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-[11px] text-slate-600"
              />
            </div>

            {/* Center title */}
            <div className="flex-1 text-center flex flex-col items-center">
              <CoreRichTextField
                value={testTitle}
                onChange={(text) => onUpdateContent({ testTitle: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-base font-extrabold text-slate-900 uppercase tracking-wide"
              />
              <CoreRichTextField
                value={subject}
                onChange={(text) => onUpdateContent({ subjectName: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-xs font-bold text-indigo-700"
              />
            </div>

            {/* Right side: Academic year & duration */}
            <div className="flex flex-col items-end gap-1 min-w-[140px] text-right">
              <CoreRichTextField
                value={academicYear}
                onChange={(text) => onUpdateContent({ academicYear: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-[11px] text-slate-600"
              />
              {showDuration && (
                <CoreRichTextField
                  value={duration}
                  onChange={(text) => onUpdateContent({ durationText: text })}
                  readOnly={readOnly}
                  isSelected={isSelected}
                  singleLine
                  className="text-[11px] font-semibold text-slate-700"
                />
              )}
            </div>
          </div>

          {/* Student Area Box */}
          {showStudent && (
            <div className="pt-2 border-t border-slate-400/60 flex items-center justify-between text-xs font-medium gap-2">
              <div className="flex items-center gap-1.5 flex-1">
                <span className="font-bold text-slate-700 shrink-0">
                  {isRtl ? 'الاسم واللقب :' : 'Nom & Prénom :'}
                </span>
                <span className="flex-1 border-b border-dotted border-slate-500 h-4" />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 px-3">
                <span className="font-bold text-slate-700">{isRtl ? 'القسم :' : 'Classe :'}</span>
                <span className="w-14 border-b border-dotted border-slate-500 h-4 text-center font-bold">
                  {classGrade}
                </span>
              </div>
              {showScore && (
                <div className="flex items-center gap-1 shrink-0 border border-slate-400 rounded px-2 py-0.5 bg-slate-50/60 font-bold">
                  <span className="text-slate-600">{isRtl ? 'العدد :' : 'Note :'}</span>
                  <span className="text-indigo-900 font-extrabold px-1">...</span>
                  <span className="text-slate-500">/ {maxScore}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PRESET 2: THREE COLUMNS */}
      {preset === 'three_columns' && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 border-b border-slate-300 pb-2 text-xs">
            {/* Col 1 */}
            <div className="flex flex-col gap-1">
              <CoreRichTextField
                value={school}
                onChange={(text) => onUpdateContent({ schoolName: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="font-bold text-slate-800"
              />
              <CoreRichTextField
                value={teacher}
                onChange={(text) => onUpdateContent({ teacherName: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-[11px] text-slate-600"
              />
            </div>
            {/* Col 2 */}
            <div className="text-center flex flex-col items-center">
              <CoreRichTextField
                value={testTitle}
                onChange={(text) => onUpdateContent({ testTitle: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="font-extrabold text-sm text-slate-900"
              />
              <CoreRichTextField
                value={subject}
                onChange={(text) => onUpdateContent({ subjectName: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-xs font-semibold text-indigo-700"
              />
            </div>
            {/* Col 3 */}
            <div className="flex flex-col items-end text-right gap-1">
              <CoreRichTextField
                value={classGrade}
                onChange={(text) => onUpdateContent({ classGrade: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="font-semibold text-slate-700"
              />
              <CoreRichTextField
                value={duration}
                onChange={(text) => onUpdateContent({ durationText: text })}
                readOnly={readOnly}
                isSelected={isSelected}
                singleLine
                className="text-[11px] text-slate-600"
              />
            </div>
          </div>

          {showStudent && (
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-1.5 flex-1">
                <span className="font-bold">{isRtl ? 'التلميذ(ة) :' : 'Élève :'}</span>
                <span className="flex-1 border-b border-dotted border-slate-500 h-4" />
              </div>
              {showScore && (
                <div className="border border-slate-400 rounded px-2 py-0.5 font-bold">
                  <span>{isRtl ? 'العدد : ' : 'Note : '}</span>
                  <span>____ / {maxScore}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PRESET 3: COMPACT */}
      {preset === 'compact' && (
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex justify-between items-center font-bold">
            <CoreRichTextField
              value={school}
              onChange={(text) => onUpdateContent({ schoolName: text })}
              readOnly={readOnly}
              isSelected={isSelected}
              singleLine
              className="text-xs font-bold"
            />
            <CoreRichTextField
              value={testTitle}
              onChange={(text) => onUpdateContent({ testTitle: text })}
              readOnly={readOnly}
              isSelected={isSelected}
              singleLine
              className="text-sm font-extrabold uppercase text-slate-900"
            />
            <CoreRichTextField
              value={academicYear}
              onChange={(text) => onUpdateContent({ academicYear: text })}
              readOnly={readOnly}
              isSelected={isSelected}
              singleLine
              className="text-xs text-slate-600"
            />
          </div>
          {showStudent && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-300">
              <span className="font-semibold">{isRtl ? 'الاسم واللقب :' : 'Nom :'}</span>
              <span className="flex-1 border-b border-dotted border-slate-400 h-4" />
              <span className="font-semibold">{isRtl ? 'القسم :' : 'Classe :'}</span>
              <span className="w-16 border-b border-dotted border-slate-400 h-4" />
              {showScore && <span className="font-bold px-1">... / {maxScore}</span>}
            </div>
          )}
        </div>
      )}

      {/* PRESET 4: INSTITUTIONAL */}
      {preset === 'institutional' && (
        <div className="flex flex-col items-center text-center gap-2">
          <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            {isRtl ? 'الجمهورية التونسية — وزارة التربية' : 'Ministère de l’Éducation Nationale'}
          </div>
          <CoreRichTextField
            value={school}
            onChange={(text) => onUpdateContent({ schoolName: text })}
            readOnly={readOnly}
            isSelected={isSelected}
            singleLine
            className="text-xs font-bold text-slate-800"
          />
          <CoreRichTextField
            value={testTitle}
            onChange={(text) => onUpdateContent({ testTitle: text })}
            readOnly={readOnly}
            isSelected={isSelected}
            singleLine
            className="text-base font-extrabold text-slate-900 uppercase border-y border-slate-800 py-1 w-full"
          />
          <div className="flex justify-between w-full text-xs font-semibold px-2">
            <span>{subject}</span>
            <span>{classGrade}</span>
            <span>{duration}</span>
          </div>
          {showStudent && (
            <div className="w-full pt-2 border-t border-slate-300 flex items-center justify-between text-xs gap-3">
              <span className="font-bold">{isRtl ? 'الاسم واللقب :' : 'Nom et Prénom :'}</span>
              <span className="flex-1 border-b border-dotted border-slate-500 h-4" />
              {showScore && (
                <span className="font-bold border border-slate-400 px-2 py-0.5 rounded">
                  {isRtl ? 'العدد :' : 'Note :'} ____ / {maxScore}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* PRESET 5: MINIMAL */}
      {preset === 'minimal' && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-baseline">
            <CoreRichTextField
              value={testTitle}
              onChange={(text) => onUpdateContent({ testTitle: text })}
              readOnly={readOnly}
              isSelected={isSelected}
              singleLine
              className="text-base font-black uppercase text-slate-900"
            />
            <span className="text-xs font-bold text-slate-600">{subject}</span>
          </div>
          {showStudent && (
            <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-300">
              <span className="font-bold">{isRtl ? 'الاسم :' : 'Élève :'}</span>
              <span className="flex-1 border-b border-dotted border-slate-400 h-4" />
              {showScore && <span className="font-bold font-mono">... / {maxScore}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
