import { StudentLevel } from './user.model';

export type ProgramSubject = 'Mathematics' | 'Physics';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  subject: ProgramSubject;
  level: StudentLevel;
  order: number;
  estimatedSessions: number;
}

export interface AcademicProgram {
  id: string;
  subject: ProgramSubject;
  level: StudentLevel;
  title: string;
  chapters: Chapter[];
}

export interface ChapterInterest {
  id: number;
  studentId: number;
  chapterId: string;
  subject: ProgramSubject;
  level: StudentLevel;
  markedAt: Date;
}

export interface InterestSummary {
  chapter: Chapter;
  interestedCount: number;
  interestedStudentIds: number[];
}
