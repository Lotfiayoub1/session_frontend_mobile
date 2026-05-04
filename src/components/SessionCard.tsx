import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '../models';
import { StatusBadge } from './StatusBadge';
import { COLORS } from '../utils/theme';
import { formatDate, formatTimeRange } from '../utils/format';

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1565C0',
  Physics: '#6A1B9A',
  Chemistry: '#00695C',
  Biology: '#2E7D32',
  History: '#BF360C',
  Literature: '#4527A0',
  English: '#0277BD',
  'Computer Science': '#F57F17',
};

interface Props {
  session: Session;
  onPress: () => void;
  onLongPress?: () => void;
}

export const SessionCard = ({ session, onPress, onLongPress }: Props) => {
  const subjectColor = SUBJECT_COLORS[session.subject] ?? COLORS.primary;
  const available = session.totalSeats - session.bookedSeats;
  const isFull = available === 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
    >
      <View style={[styles.subjectBar, { backgroundColor: subjectColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.subject}>{session.subject}</Text>
          <StatusBadge status={session.status} size="small" />
        </View>
        <Text style={styles.title} numberOfLines={2}>{session.title}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="person-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.meta}>{session.teacher}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.meta}>{formatDate(session.date)}</Text>
          <Text style={styles.metaSep}>•</Text>
          <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
          <Text style={styles.meta}>{formatTimeRange(session.startTime, session.endTime)}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.meta}>{session.room}</Text>
          </View>
          <View style={[styles.seatsBadge, isFull && styles.seatsFull]}>
            <Text style={[styles.seatsText, isFull && styles.seatsTextFull]}>
              {isFull ? 'Full' : `${available} seats`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, marginBottom: 10, elevation: 2, overflow: 'hidden' },
  subjectBar: { width: 4 },
  content: { flex: 1, padding: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  subject: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  meta: { fontSize: 12, color: COLORS.textSecondary },
  metaSep: { fontSize: 12, color: COLORS.disabled },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  seatsBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  seatsFull: { backgroundColor: COLORS.error + '15' },
  seatsText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  seatsTextFull: { color: COLORS.error },
});
