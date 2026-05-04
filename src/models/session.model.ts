export type Subject =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'History'
  | 'Literature'
  | 'English'
  | 'Computer Science';

export type SessionStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type SessionLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Session {
  id: number;
  title: string;
  subject: Subject;
  description: string;
  teacher: string;
  teacherId: number;
  schoolId: number;
  schoolName: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalSeats: number;
  bookedSeats: number;
  price: number;
  status: SessionStatus;
  level: SessionLevel;
  room: string;
  imageUrl?: string;
  chapterId?: string;
  studentLevelTarget?: string;
}

export interface SessionFilter {
  subject?: Subject;
  date?: Date;
  status?: SessionStatus;
  level?: SessionLevel;
  schoolId?: number;
  search?: string;
}

export interface CreateSessionRequest {
  title: string;
  subject: Subject;
  description: string;
  teacher: string;
  teacherId: number;
  schoolId: number;
  date: Date;
  startTime: string;
  endTime: string;
  totalSeats: number;
  price: number;
  level: SessionLevel;
  room: string;
  chapterId?: string;
  studentLevelTarget?: string;
}
