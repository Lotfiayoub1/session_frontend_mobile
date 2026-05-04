import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Chip, Divider } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SessionsStackParamList } from '../../navigation/types';
import { Session } from '../../models';
import { SessionService, BookingService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { COLORS } from '../../utils/theme';
import { formatFullDate, formatTimeRange, formatDuration } from '../../utils/format';

type Route = RouteProp<SessionsStackParamList, 'SessionDetail'>;
type Nav = NativeStackNavigationProp<SessionsStackParamList, 'SessionDetail'>;

export const SessionDetailScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    SessionService.getSessionById(params.sessionId).then(setSession);
    if (user) {
      BookingService.getBookingsForUser(user.id).then((bookings) => {
        setAlreadyBooked(
          bookings.some(
            (b) => b.sessionId === params.sessionId && b.status !== 'cancelled'
          )
        );
      });
    }
  }, [params.sessionId, user]);

  const handleBook = async () => {
    if (!user || !session) return;
    setBooking(true);
    try {
      await BookingService.createBooking({ sessionId: session.id, userId: user.id });
      Alert.alert('Success', 'Session booked successfully!');
      setAlreadyBooked(true);
    } catch (e: any) {
      Alert.alert('Booking Failed', e.message);
    } finally {
      setBooking(false);
    }
  };

  if (!session) return null;

  const availableSeats = session.totalSeats - session.bookedSeats;
  const isFull = availableSeats === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <StatusBadge status={session.status} />
          <Chip icon="school" compact style={styles.levelChip}>{session.level}</Chip>
        </View>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.subject}>{session.subject}</Text>
      </View>

      <View style={styles.card}>
        <InfoRow icon="person" label="Teacher" value={session.teacher} />
        <Divider style={styles.divider} />
        <InfoRow icon="calendar" label="Date" value={formatFullDate(session.date)} />
        <Divider style={styles.divider} />
        <InfoRow icon="time" label="Time" value={formatTimeRange(session.startTime, session.endTime)} />
        <Divider style={styles.divider} />
        <InfoRow icon="hourglass" label="Duration" value={formatDuration(session.duration)} />
        <Divider style={styles.divider} />
        <InfoRow icon="location" label="Room" value={session.room} />
        <Divider style={styles.divider} />
        <InfoRow icon="business" label="School" value={session.schoolName} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About this session</Text>
        <Text style={styles.description}>{session.description}</Text>
      </View>

      <View style={styles.seatsCard}>
        <Text style={styles.seatsTitle}>Availability</Text>
        <View style={styles.seatsRow}>
          <View style={styles.seatsStat}>
            <Text style={styles.seatsNumber}>{session.totalSeats}</Text>
            <Text style={styles.seatsLabel}>Total</Text>
          </View>
          <View style={styles.seatsStat}>
            <Text style={[styles.seatsNumber, { color: COLORS.error }]}>{session.bookedSeats}</Text>
            <Text style={styles.seatsLabel}>Booked</Text>
          </View>
          <View style={styles.seatsStat}>
            <Text style={[styles.seatsNumber, { color: isFull ? COLORS.error : COLORS.success }]}>
              {availableSeats}
            </Text>
            <Text style={styles.seatsLabel}>Available</Text>
          </View>
        </View>
      </View>

      {user?.role === 'student' && session.status === 'upcoming' && (
        <Button
          mode="contained"
          onPress={alreadyBooked ? undefined : handleBook}
          loading={booking}
          disabled={booking || isFull || alreadyBooked}
          style={styles.bookBtn}
          contentStyle={{ paddingVertical: 6 }}
          icon={alreadyBooked ? 'check' : 'bookmark'}
        >
          {alreadyBooked ? 'Already Booked' : isFull ? 'Session Full' : 'Book This Session'}
        </Button>
      )}
    </ScrollView>
  );
};

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon as any} size={18} color={COLORS.primary} style={styles.infoIcon} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 20, marginBottom: 16 },
  headerTop: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subject: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  levelChip: { backgroundColor: 'rgba(255,255,255,0.2)' },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 10 },
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  divider: { marginVertical: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoIcon: { marginRight: 10 },
  infoLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500', flex: 2, textAlign: 'right' },
  seatsCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1 },
  seatsTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 12 },
  seatsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  seatsStat: { alignItems: 'center' },
  seatsNumber: { fontSize: 28, fontWeight: '700', color: COLORS.primary },
  seatsLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  bookBtn: { borderRadius: 12, marginTop: 4 },
});
