import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Divider, Chip } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AdminStudentsStackParamList } from '../../navigation/types';
import { User, Booking } from '../../models';
import { StudentService, BookingService } from '../../services';
import { BookingCard } from '../../components/BookingCard';
import { COLORS } from '../../utils/theme';

type Route = RouteProp<AdminStudentsStackParamList, 'StudentProfile'>;

export const StudentProfileScreen = () => {
  const { params } = useRoute<Route>();
  const [student, setStudent] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    Promise.all([
      StudentService.getStudentById(params.studentId),
      BookingService.getBookingsForUser(params.studentId),
    ]).then(([s, b]) => {
      setStudent(s);
      setBookings(b);
    });
  }, [params.studentId]);

  if (!student) return null;

  const initials = `${student.firstName[0]}${student.lastName[0]}`;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const attendedBookings = bookings.filter((b) => b.attended).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{student.firstName} {student.lastName}</Text>
        <Text style={styles.email}>{student.email}</Text>
        <Chip icon="school" style={styles.levelChip}>{student.level}</Chip>
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Credits" value={student.sessionCredits ?? 0} color={COLORS.accent} />
        <StatBox label="Bookings" value={confirmedBookings} color={COLORS.primary} />
        <StatBox label="Attended" value={attendedBookings} color={COLORS.success} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
        {student.phone && <InfoRow label="Phone" value={student.phone} />}
        {student.parentName && <InfoRow label="Parent" value={student.parentName} />}
        {student.parentPhone && <InfoRow label="Parent Phone" value={student.parentPhone} />}
        {student.dateOfBirth && <InfoRow label="Date of Birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />}
      </View>

      <Text style={styles.sectionTitle2}>Bookings ({bookings.length})</Text>
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </ScrollView>
  );
};

const StatBox = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <View style={[styles.statBox, { borderTopColor: color }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  profileHeader: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, marginBottom: 16, elevation: 1 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  email: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
  levelChip: { backgroundColor: COLORS.primary + '20' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, alignItems: 'center', elevation: 1, borderTopWidth: 3 },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
  sectionTitle2: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12, marginTop: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
});
