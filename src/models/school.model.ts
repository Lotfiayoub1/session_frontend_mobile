export interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  adminName: string;
  adminEmail: string;
  totalSessions: number;
  totalStudents: number;
  createdAt: Date;
  active: boolean;
}
