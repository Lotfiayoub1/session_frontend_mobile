import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Session, Booking, SessionFilter } from '../models';
import { SessionService, BookingService } from '../services';

interface AppContextValue {
  sessions: Session[];
  bookings: Booking[];
  isLoadingSessions: boolean;
  isLoadingBookings: boolean;
  fetchSessions: (filter?: SessionFilter) => Promise<void>;
  fetchBookingsForUser: (userId: number) => Promise<void>;
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchSessions = useCallback(async (filter?: SessionFilter) => {
    setIsLoadingSessions(true);
    try {
      const data = await SessionService.getSessions(filter);
      setSessions(data);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  const fetchBookingsForUser = useCallback(async (userId: number) => {
    setIsLoadingBookings(true);
    try {
      const data = await BookingService.getBookingsForUser(userId);
      setBookings(data);
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <AppContext.Provider
      value={{
        sessions,
        bookings,
        isLoadingSessions,
        isLoadingBookings,
        fetchSessions,
        fetchBookingsForUser,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
