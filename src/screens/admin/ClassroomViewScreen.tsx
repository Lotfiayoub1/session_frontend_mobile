import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AdminSessionsStackParamList } from '../../navigation/types';
import { Booking, Session } from '../../models';
import { BookingService, SessionService } from '../../services';
import { StatusBadge } from '../../components/StatusBadge';
import { COLORS } from '../../utils/theme';

type Route = RouteProp<AdminSessionsStackParamList, 'ClassroomView'>;

export const ClassroomViewScreen = () => {
  const { params } = useRoute<Route>();
  const [session, setSession] = useState<Session | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = async () => {
    const [s, b] = await Promise.all([
      SessionService.getSessionById(params.sessionId),
      BookingService.getBookingsForSession(params.sessionId),
    ]);
    setSession(s);
    setBookings(b);
  };

  useEffect(() => { load(); }, [params.sessionId]);

  const handleAttendance = async (booking: Booking) => {
    await BookingService.markAttendance(booking.id, !booking.attended);
    await load();
  };

  if (!session) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.meta}>{session.room} • {session.startTime} – {session.endTime}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>{bookings.filter((b) => b.status === 'confirmed').length}/{session.totalSeats} booked</Text>
          <Text style={styles.statText}>{bookings.filter((b) => b.attended).length} attended</Text>
        </View>
      </View>

      <FlatList
        data={bookings.filter((b) => b.status !== 'cancelled')}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookingRow} onPress={() => handleAttendance(item)} activeOpacity={0.7}>
            <View style={styles.seatBadge}>
              <Text style={styles.seatText}>#{item.seatNumber}</Text>
            </View>
            <View style={styles.bookingInfo}>
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.studentEmail}>{item.studentEmail}</Text>
              <StatusBadge status={item.status} size="small" />
            </View>
            <Ionicons
              name={item.attended ? 'checkmark-circle' : 'ellipse-outline'}
              size={28}
              color={item.attended ? COLORS.success : COLORS.disabled}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  meta: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8 },
  stats: { flexDirection: 'row', gap: 16 },
  statText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  list: { padding: 12 },
  bookingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8, elevation: 1 },
  seatBadge: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  seatText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  bookingInfo: { flex: 1 },
  studentName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  studentEmail: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
});
