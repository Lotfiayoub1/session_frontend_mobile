import {
  AcademicProgram,
  Chapter,
  ChapterInterest,
  InterestSummary,
  ProgramSubject,
} from '../models';
import { StudentLevel } from '../models/user.model';
import {
  ACADEMIC_PROGRAMS,
  CHAPTER_INTERESTS,
} from '../data/mock-data';
import { StorageService, KEYS } from './storage.service';

let interests = [...CHAPTER_INTERESTS];
let interestsInitialized = false;

const loadInterests = async () => {
  if (interestsInitialized) return;
  const persisted = await StorageService.get<ChapterInterest[]>(KEYS.INTERESTS);
  if (persisted) interests = persisted;
  else interests = [...CHAPTER_INTERESTS];
  interestsInitialized = true;
};

const persist = async () => {
  await StorageService.set(KEYS.INTERESTS, interests);
};

export interface AcademicProgramServiceInterface {
  getProgramsForLevel(level: StudentLevel): Promise<AcademicProgram[]>;
  getProgram(subject: ProgramSubject, level: StudentLevel): Promise<AcademicProgram | null>;
  getChapterById(chapterId: string): Promise<Chapter | null>;
  getInterestsForStudent(studentId: number): Promise<ChapterInterest[]>;
  toggleInterest(studentId: number, chapter: Chapter): Promise<boolean>;
  isInterested(studentId: number, chapterId: string): Promise<boolean>;
  getStudentsInterestedInChapter(chapterId: string): Promise<number[]>;
  getAllInterestSummaries(): Promise<InterestSummary[]>;
}

export const AcademicProgramService: AcademicProgramServiceInterface = {
  async getProgramsForLevel(level: StudentLevel): Promise<AcademicProgram[]> {
    return ACADEMIC_PROGRAMS.filter((p) => p.level === level);
  },

  async getProgram(subject: ProgramSubject, level: StudentLevel): Promise<AcademicProgram | null> {
    return ACADEMIC_PROGRAMS.find((p) => p.subject === subject && p.level === level) ?? null;
  },

  async getChapterById(chapterId: string): Promise<Chapter | null> {
    for (const program of ACADEMIC_PROGRAMS) {
      const ch = program.chapters.find((c) => c.id === chapterId);
      if (ch) return ch;
    }
    return null;
  },

  async getInterestsForStudent(studentId: number): Promise<ChapterInterest[]> {
    await loadInterests();
    return interests.filter((i) => i.studentId === studentId);
  },

  async toggleInterest(studentId: number, chapter: Chapter): Promise<boolean> {
    await loadInterests();
    const idx = interests.findIndex(
      (i) => i.studentId === studentId && i.chapterId === chapter.id
    );
    if (idx !== -1) {
      interests = interests.filter((_, i) => i !== idx);
      await persist();
      return false;
    }
    const newInterest: ChapterInterest = {
      id: Math.max(...interests.map((i) => i.id), 0) + 1,
      studentId,
      chapterId: chapter.id,
      subject: chapter.subject,
      level: chapter.level,
      markedAt: new Date(),
    };
    interests = [...interests, newInterest];
    await persist();
    return true;
  },

  async isInterested(studentId: number, chapterId: string): Promise<boolean> {
    await loadInterests();
    return interests.some((i) => i.studentId === studentId && i.chapterId === chapterId);
  },

  async getStudentsInterestedInChapter(chapterId: string): Promise<number[]> {
    await loadInterests();
    return interests.filter((i) => i.chapterId === chapterId).map((i) => i.studentId);
  },

  async getAllInterestSummaries(): Promise<InterestSummary[]> {
    await loadInterests();
    const summaries: InterestSummary[] = [];
    for (const program of ACADEMIC_PROGRAMS) {
      for (const chapter of program.chapters) {
        const chapterInterests = interests.filter((i) => i.chapterId === chapter.id);
        summaries.push({
          chapter,
          interestedCount: chapterInterests.length,
          interestedStudentIds: chapterInterests.map((i) => i.studentId),
        });
      }
    }
    return summaries.sort((a, b) => b.interestedCount - a.interestedCount);
  },
};
