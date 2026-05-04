import { Booking, BookingRequest, BookingStatus } from '../models';
import { BOOKINGS, USERS, SESSIONS } from '../data/mock-data';
import { StorageService, KEYS } from './storage.service';

let bookings = [...BOOKINGS];
let initialized = false;

const loadPersistedBookings = async () => {
  if (initialized) return;
  const persisted = await StorageService.get<Booking[]>(KEYS.BOOKINGS);
  if (persisted && persisted.length > 0) {
    // merge persisted bookings (new ones) with defaults
    const persistedIds = new Set(persisted.map((b) => b.id));
    const defaultIds = new Set(BOOKINGS.map((b) => b.id));
    const newOnes = persisted.filter((b) => !defaultIds.has(b.id));
    bookings = [...BOOKINGS, ...newOnes];
  }
  initialized = true;
};

const persist = async () => {
  await StorageService.set(KEYS.BOOKINGS, bookings);
};

export interface BookingServiceInterface {
  getBookingsForUser(userId: number): Promise<Booking[]>;
  getBookingsForSession(sessionId: number): Promise<Booking[]>;
  createBooking(request: BookingRequest): Promise<Booking>;
  cancelBooking(bookingId: number): Promise<void>;
  markAttendance(bookingId: number, attended: boolean): Promise<void>;
  updateBookingStatus(bookingId: number, status: BookingStatus): Promise<void>;
}

export const BookingService: BookingServiceInterface = {
  async getBookingsForUser(userId: number): Promise<Booking[]> {
    await loadPersistedBookings();
    return bookings.filter((b) => b.userId === userId);
  },

  async getBookingsForSession(sessionId: number): Promise<Booking[]> {
    await loadPersistedBookings();
    return bookings.filter((b) => b.sessionId === sessionId);
  },

  async createBooking(request: BookingRequest): Promise<Booking> {
    await loadPersistedBookings();
    const session = SESSIONS.find((s) => s.id === request.sessionId);
    if (!session) throw new Error('Session not found');
    if (session.bookedSeats >= session.totalSeats)
      throw new Error('Session is fully booked');

    const existing = bookings.find(
      (b) =>
        b.sessionId === request.sessionId &&
        b.userId === request.userId &&
        b.status !== 'cancelled'
    );
    if (existing) throw new Error('Already booked for this session');

    let studentName = request.guestName ?? 'Guest';
    let studentEmail = request.guestEmail ?? '';
    if (request.userId) {
      const user = USERS.find((u) => u.id === request.userId);
      if (user) {
        studentName = `${user.firstName} ${user.lastName}`;
        studentEmail = user.email;
      }
    }

    const sessionBookings = bookings.filter(
      (b) => b.sessionId === request.sessionId && b.status !== 'cancelled'
    );
    const seatNumber = sessionBookings.length + 1;

    const newBooking: Booking = {
      id: Math.max(...bookings.map((b) => b.id), 0) + 1,
      sessionId: request.sessionId,
      sessionTitle: session.title,
      sessionDate: session.date,
      sessionStartTime: session.startTime,
      sessionEndTime: session.endTime,
      subject: session.subject,
      teacher: session.teacher,
      room: session.room,
      userId: request.userId,
      guestName: request.guestName,
      guestEmail: request.guestEmail,
      studentName,
      studentEmail,
      status: 'confirmed',
      seatNumber,
      bookedAt: new Date(),
      source: request.source ?? 'manual',
    };

    session.bookedSeats += 1;
    bookings = [...bookings, newBooking];
    await persist();
    return newBooking;
  },

  async cancelBooking(bookingId: number): Promise<void> {
    await loadPersistedBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');
    const session = SESSIONS.find((s) => s.id === bookings[idx].sessionId);
    if (session && session.bookedSeats > 0) session.bookedSeats -= 1;
    bookings[idx] = { ...bookings[idx], status: 'cancelled' };
    await persist();
  },

  async markAttendance(bookingId: number, attended: boolean): Promise<void> {
    await loadPersistedBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');
    bookings[idx] = { ...bookings[idx], attended };
    await persist();
  },

  async updateBookingStatus(bookingId: number, status: BookingStatus): Promise<void> {
    await loadPersistedBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (idx === -1) throw new Error('Booking not found');
    bookings[idx] = { ...bookings[idx], status };
    await persist();
  },
};
