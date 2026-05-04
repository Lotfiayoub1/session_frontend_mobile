import { School } from '../models';
import { SCHOOLS } from '../data/mock-data';

let schools = [...SCHOOLS];

export interface SchoolServiceInterface {
  getSchools(): Promise<School[]>;
  getSchoolById(id: number): Promise<School | null>;
  createSchool(data: Partial<School>): Promise<School>;
  updateSchool(id: number, updates: Partial<School>): Promise<School>;
  toggleSchoolActive(id: number): Promise<School>;
}

export const SchoolService: SchoolServiceInterface = {
  async getSchools(): Promise<School[]> {
    return [...schools];
  },

  async getSchoolById(id: number): Promise<School | null> {
    return schools.find((s) => s.id === id) ?? null;
  },

  async createSchool(data: Partial<School>): Promise<School> {
    const newSchool: School = {
      id: Math.max(...schools.map((s) => s.id)) + 1,
      name: data.name ?? '',
      address: data.address ?? '',
      city: data.city ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      adminName: data.adminName ?? '',
      adminEmail: data.adminEmail ?? '',
      totalSessions: 0,
      totalStudents: 0,
      createdAt: new Date(),
      active: true,
    };
    schools = [...schools, newSchool];
    return newSchool;
  },

  async updateSchool(id: number, updates: Partial<School>): Promise<School> {
    const idx = schools.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('School not found');
    schools[idx] = { ...schools[idx], ...updates };
    return schools[idx];
  },

  async toggleSchoolActive(id: number): Promise<School> {
    const idx = schools.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('School not found');
    schools[idx] = { ...schools[idx], active: !schools[idx].active };
    return schools[idx];
  },
};
