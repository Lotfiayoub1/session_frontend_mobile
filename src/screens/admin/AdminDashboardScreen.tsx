import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SessionService, StudentService, BookingService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

interface Stats {
  totalSessions: number;
  upcomingSessions: number;
  totalStudents: number;
  totalBookings: number;
  confirmedBookings: number;
}

export const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const load = async () => {
      const [sessions, students, allBookings] = await Promise.all([
        SessionService.getSessions(user?.schoolId ? { schoolId: user.schoolId } : {}),
        StudentService.getStudentsBySchool(user?.schoolId ?? 0),
        // fetch all bookings by getting sessions and collecting bookings
        Promise.all(
          (await SessionService.getSessions()).slice(0, 10).map((s) =>
            BookingService.getBookingsForSession(s.id)
          )
        ).then((b) => b.flat()),
      ]);
      setStats({
        totalSessions: sessions.length,
        upcomingSessions: sessions.filter((s) => s.status === 'upcoming').length,
        totalStudents: students.length,
        totalBookings: allBookings.length,
        confirmedBookings: allBookings.filter((b) => b.status === 'confirmed').length,
      });
    };
    load();
  }, [user]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.welcomeCard}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.adminName}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.school}>School #{user?.schoolId}</Text>
      </View>

      {stats && (
        <View style={styles.grid}>
          <StatCard icon="calendar" label="Total Sessions" value={stats.totalSessions} color={COLORS.primary} />
          <StatCard icon="time" label="Upcoming" value={stats.upcomingSessions} color={COLORS.secondary} />
          <StatCard icon="people" label="Students" value={stats.totalStudents} color={COLORS.accent} />
          <StatCard icon="bookmark" label="Bookings" value={stats.totalBookings} color={COLORS.info} />
          <StatCard icon="checkmark-circle" label="Confirmed" value={stats.confirmedBookings} color={COLORS.success} />
        </View>
      )}
    </ScrollView>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Ionicons name={icon as any} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  welcomeCard: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 20, marginBottom: 20 },
  welcome: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  adminName: { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 2 },
  school: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, elevation: 1, flex: 1, minWidth: '45%', borderLeftWidth: 4 },
  statValue: { fontSize: 32, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});
