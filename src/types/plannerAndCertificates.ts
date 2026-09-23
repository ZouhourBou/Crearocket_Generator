import { Language } from '../types';

// -------------------------------------------------------------
// SCHOOL TIMETABLE & PLANNER TYPES
// -------------------------------------------------------------

export type PlannerPaperFormat = 'a4' | 'a5' | 'us_letter';
export type PlannerOrientation = 'landscape' | 'portrait';

export type PlannerViewMode =
  | 'timetable'        // Emploi du temps hebdomadaire
  | 'weekly_planner'   // Semainier scolaire / devoirs / examens
  | 'activity'         // Organisateur d'activités & extrascolaire
  | 'daily_routine';   // Planning de routine quotidienne (matin/soir)

export type PlannerTemplateId =
  | 'classic_school'
  | 'pastel_school'
  | 'kawaii_school'
  | 'modern_minimal'
  | 'colorful_kids'
  | 'bw_printable'
  | 'premium_student'
  | 'teacher_planner';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "09:00"
  label?: string;    // e.g. "P1" or "Matin 1"
  isBreak?: boolean; // Pause récréation / déjeuner
}

export interface SubjectItem {
  id: string;
  name: string;
  nameAr?: string;
  color: string;
  textColor?: string;
  icon?: string;
  defaultTeacher?: string;
  defaultRoom?: string;
}

export interface TimetableCell {
  day: DayOfWeek;
  slotId: string;
  subjectId?: string;
  customText?: string;
  room?: string;
  teacher?: string;
  mergedRows?: number;
}

export interface WeeklyPlannerTask {
  id: string;
  day: DayOfWeek;
  text: string;
  type: 'homework' | 'exam' | 'reminder' | 'activity' | 'task';
  completed?: boolean;
}

export interface ChildActivity {
  id: string;
  day: DayOfWeek;
  name: string;
  time?: string;
  location?: string;
  color: string;
  completed?: boolean;
}

export interface DailyRoutineItem {
  id: string;
  period: 'morning' | 'evening';
  title: string;
  icon: string;
  completed?: boolean;
}

export interface SchoolPlannerState {
  viewMode: PlannerViewMode;
  templateId: PlannerTemplateId;
  paperFormat: PlannerPaperFormat;
  orientation: PlannerOrientation;

  // Header info
  studentName: string;
  studentClass: string;
  schoolName: string;
  academicYear: string;
  customTitle: string;
  subtitle: string;

  // Timetable config
  activeDays: DayOfWeek[];
  timeSlots: TimeSlot[];
  subjects: SubjectItem[];
  timetableGrid: Record<string, TimetableCell>; // key: `${day}_${slotId}`

  // Weekly Planner config
  weekNumber: string;
  dateRange: string;
  weeklyGoal: string;
  plannerType: 'academic' | 'personal' | 'combined';
  weeklyTasks: WeeklyPlannerTask[];
  generalNotes: string;

  // Activity Organizer config
  activities: ChildActivity[];

  // Daily Routine config
  morningRoutines: DailyRoutineItem[];
  eveningRoutines: DailyRoutineItem[];

  // Styling & Print Options
  primaryColor: string;
  fontFamily: 'outfit' | 'cairo' | 'schoolbell' | 'patrick' | 'comic' | 'amiri';
  showBorders: boolean;
  zoom: number;
  printMode: 'home' | 'pro';
  showTrimMarks: boolean;
}

// -------------------------------------------------------------
// CERTIFICATES & DIPLOMAS TYPES
// -------------------------------------------------------------

export type CertificatePaperFormat = 'a4' | 'us_letter';
export type CertificateOrientation = 'landscape' | 'portrait';

export type CertificateTypeId =
  | 'encouragement'
  | 'excellence'
  | 'reussite'
  | 'brevet_fin_annee'
  | 'participation'
  | 'merite'
  | 'lecture'
  | 'sport'
  | 'creativite'
  | 'personnalise';

export type CertificateTemplateId =
  | 'classic_gold'
  | 'royal_blue'
  | 'kids_rainbow'
  | 'little_stars'
  | 'modern_minimal'
  | 'floral_elegance'
  | 'graduation_celebration'
  | 'excellence_award'
  | 'sport_achievement'
  | 'kawaii_achievement';

export interface CertificateRecipient {
  id: string;
  studentName: string;
  studentClass: string;
  awardTitle?: string;
  reason?: string;
  date?: string;
  location?: string;
  number?: string;
  photoUrl?: string;
}

export interface CertificateState {
  typeId: CertificateTypeId;
  templateId: CertificateTemplateId;
  paperFormat: CertificatePaperFormat;
  orientation: CertificateOrientation;

  // Core Certificate Content
  title: string;
  subtitle: string; // e.g. "Décerné avec les félicitations du corps professoral à"
  studentName: string;
  studentClass: string;
  schoolName: string;
  academicYear: string;
  awardTitle: string;
  reasonText: string;
  issueDate: string;
  issueLocation: string;
  certificateNumber: string;

  // Signatures & Logos
  schoolLogoUrl?: string;
  schoolLogoWidth?: number;
  showSchoolLogo: boolean;

  teacherSignatureLabel: string;
  teacherSignatureName: string;
  teacherSignatureImg?: string;

  directorSignatureLabel: string;
  directorSignatureName: string;
  directorSignatureImg?: string;

  showOfficialStamp: boolean;
  stampText: string;

  // Customization & Typography
  titleFont: 'outfit' | 'cairo' | 'amiri' | 'schoolbell' | 'patrick';
  nameFont: 'outfit' | 'cairo' | 'amiri' | 'schoolbell' | 'patrick';
  nameFontSize: number; // 24 to 48 pt
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderColor: string;
  backgroundColor: string;

  // Decorative Toggles
  showBorder: boolean;
  showMedal: boolean;
  showStars: boolean;
  showSignatures: boolean;

  // Bulk Generation List
  recipients: CertificateRecipient[];
  activeRecipientIndex: number;

  // Print & Preview
  zoom: number;
  showTrimMarks: boolean;
}
