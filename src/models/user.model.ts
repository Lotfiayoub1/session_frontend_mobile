export type UserRole = 'student' | 'admin' | 'super-admin';

export type StudentLevel =
  | '6ème'
  | '5ème'
  | '4ème'
  | '3ème'
  | 'Seconde'
  | 'Première'
  | 'Terminale'
  | 'Prépa 1'
  | 'Prépa 2';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
  schoolId?: number;
  avatar?: string;
  createdAt: Date;
  level?: StudentLevel;
  phone?: string;
  dateOfBirth?: Date;
  parentName?: string;
  parentPhone?: string;
  siblingIds?: number[];
  sessionCredits?: number;
  createdByAdminId?: number;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
