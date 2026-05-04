export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
export type BookingSource = 'manual' | 'auto-interest' | 'admin-assigned';

export interface Booking {
  id: number;
  sessionId: number;
  sessionTitle: string;
  sessionDate: Date;
  sessionStartTime: string;
  sessionEndTime: string;
  subject: string;
  teacher: string;
  room: string;
  userId?: number;
  guestName?: string;
  guestEmail?: string;
  studentName: string;
  studentEmail: string;
  status: BookingStatus;
  seatNumber: number;
  bookedAt: Date;
  source?: BookingSource;
  attended?: boolean;
}

export interface BookingRequest {
  sessionId: number;
  userId?: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  source?: BookingSource;
}
