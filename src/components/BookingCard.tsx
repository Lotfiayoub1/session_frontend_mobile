import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../models';
import { StatusBadge } from './StatusBadge';
import { COLORS } from '../utils/theme';
import { formatDate, formatTimeRange } from '../utils/format';

interface Props {
  booking: Booking;
  onCancel?: (id: number) => void;
}

export const BookingCard = ({ booking, onCancel }: Props) => {
  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => onCancel?.(booking.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.sessionTitle} numberOfLines={1}>{booking.sessionTitle}</Text>
        <StatusBadge status={booking.status} size="small" />
      </View>
      <Text style={styles.subject}>{booking.subject}</Text>
      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} />
        <Text style={styles.detail}>{formatDate(booking.sessionDate)}</Text>
        <Text style={styles.detailSep}>•</Text>
        <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
        <Text style={styles.detail}>{formatTimeRange(booking.sessionStartTime, booking.sessionEndTime)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="person-outline" size={13} color={COLORS.textSecondary} />
        <Text style={styles.detail}>{booking.teacher}</Text>
        <Text style={styles.detailSep}>•</Text>
        <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
        <Text style={styles.detail}>{booking.room}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.seatBadge}>
          <Text style={styles.seatText}>Seat #{booking.seatNumber}</Text>
        </View>
        {booking.source && (
          <Text style={styles.source}>{booking.source.replace('-', ' ')}</Text>
        )}
        {booking.attended && (
          <View style={styles.attendedBadge}>
            <Ionicons name="checkmark" size={12} color={COLORS.success} />
            <Text style={styles.attendedText}>Attended</Text>
          </View>
        )}
        {booking.status === 'confirmed' && onCancel && (
          <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  sessionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, flex: 1, marginRight: 8 },
  subject: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  detail: { fontSize: 12, color: COLORS.textSecondary },
  detailSep: { fontSize: 12, color: COLORS.disabled },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  seatBadge: { backgroundColor: COLORS.primary + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  seatText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  source: { fontSize: 11, color: COLORS.textSecondary, textTransform: 'capitalize' },
  attendedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.success + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  attendedText: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
  cancelBtn: { marginLeft: 'auto', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.error },
  cancelBtnText: { fontSize: 12, color: COLORS.error, fontWeight: '600' },
});
