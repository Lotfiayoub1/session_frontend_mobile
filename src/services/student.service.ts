import { User, StudentLevel } from '../models';
import { USERS } from '../data/mock-data';

let users = [...USERS];

export interface StudentServiceInterface {
  getStudentsBySchool(schoolId: number): Promise<User[]>;
  getAllStudents(): Promise<User[]>;
  getStudentById(id: number): Promise<User | null>;
  getStudentsByLevel(level: StudentLevel, schoolId?: number): Promise<User[]>;
  createStudent(data: Partial<User>): Promise<User>;
  updateStudent(id: number, updates: Partial<User>): Promise<User>;
  deleteStudent(id: number): Promise<void>;
}

export const StudentService: StudentServiceInterface = {
  async getStudentsBySchool(schoolId: number): Promise<User[]> {
    return users.filter((u) => u.role === 'student' && u.schoolId === schoolId);
  },

  async getAllStudents(): Promise<User[]> {
    return users.filter((u) => u.role === 'student');
  },

  async getStudentById(id: number): Promise<User | null> {
    return users.find((u) => u.id === id) ?? null;
  },

  async getStudentsByLevel(level: StudentLevel, schoolId?: number): Promise<User[]> {
    return users.filter(
      (u) => u.role === 'student' && u.level === level && (!schoolId || u.schoolId === schoolId)
    );
  },

  async createStudent(data: Partial<User>): Promise<User> {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      email: data.email ?? '',
      role: 'student',
      schoolId: data.schoolId,
      level: data.level,
      phone: data.phone,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
      sessionCredits: 0,
      createdAt: new Date(),
      createdByAdminId: data.createdByAdminId,
    };
    users = [...users, newUser];
    return newUser;
  },

  async updateStudent(id: number, updates: Partial<User>): Promise<User> {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('Student not found');
    users[idx] = { ...users[idx], ...updates };
    return users[idx];
  },

  async deleteStudent(id: number): Promise<void> {
    users = users.filter((u) => u.id !== id);
  },
};
