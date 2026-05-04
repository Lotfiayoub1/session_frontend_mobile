import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  if (isThisWeek(d)) return format(d, 'EEEE');
  return format(d, 'MMM d, yyyy');
};

export const formatFullDate = (date: Date | string): string =>
  format(new Date(date), 'EEEE, MMMM d, yyyy');

export const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
};

export const formatTimeRange = (start: string, end: string): string =>
  `${formatTime(start)} - ${formatTime(end)}`;

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
};

export const formatFileSize = (size: string): string => size;
