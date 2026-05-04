import { Session, SessionFilter, CreateSessionRequest } from '../models';
import { SESSIONS } from '../data/mock-data';

let sessions = [...SESSIONS];

export interface SessionServiceInterface {
  getSessions(filter?: SessionFilter): Promise<Session[]>;
  getSessionById(id: number): Promise<Session | null>;
  createSession(request: CreateSessionRequest): Promise<Session>;
  updateSession(id: number, updates: Partial<Session>): Promise<Session>;
  deleteSession(id: number): Promise<void>;
}

const applyFilter = (s: Session, filter: SessionFilter): boolean => {
  if (filter.subject && s.subject !== filter.subject) return false;
  if (filter.status && s.status !== filter.status) return false;
  if (filter.level && s.level !== filter.level) return false;
  if (filter.schoolId && s.schoolId !== filter.schoolId) return false;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    if (
      !s.title.toLowerCase().includes(q) &&
      !s.teacher.toLowerCase().includes(q) &&
      !s.subject.toLowerCase().includes(q)
    )
      return false;
  }
  return true;
};

export const SessionService: SessionServiceInterface = {
  async getSessions(filter?: SessionFilter): Promise<Session[]> {
    if (!filter) return [...sessions];
    return sessions.filter((s) => applyFilter(s, filter));
  },

  async getSessionById(id: number): Promise<Session | null> {
    return sessions.find((s) => s.id === id) ?? null;
  },

  async createSession(request: CreateSessionRequest): Promise<Session> {
    const newSession: Session = {
      ...request,
      id: Math.max(...sessions.map((s) => s.id)) + 1,
      bookedSeats: 0,
      status: 'upcoming',
      schoolName: '',
    };
    sessions = [...sessions, newSession];
    return newSession;
  },

  async updateSession(id: number, updates: Partial<Session>): Promise<Session> {
    const idx = sessions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Session not found');
    sessions[idx] = { ...sessions[idx], ...updates };
    return sessions[idx];
  },

  async deleteSession(id: number): Promise<void> {
    sessions = sessions.filter((s) => s.id !== id);
  },
};
